'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os'),E=require('./engine.js');
const rooms=new Map();const PORT=Number(process.env.PORT||3000);const TTL=24*60*60*1000;
const DATA_DIR=process.env.DATA_DIR||path.join(__dirname,'data');fs.mkdirSync(DATA_DIR,{recursive:true});
function saveRoom(r){const file=path.join(DATA_DIR,r.code+'.json'),tmp=file+'.tmp';try{const {clients,history,...plain}=r;fs.writeFileSync(tmp,JSON.stringify(plain));fs.renameSync(tmp,file);}catch(e){console.error('Unable to persist classroom:',e.message);}}
for(const file of fs.readdirSync(DATA_DIR).filter(n=>/^[A-F0-9]{6}\.json$/.test(n))){try{let room=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));if(Date.now()-room.touched<TTL){room.clients=new Set();rooms.set(room.code,room);}}catch(e){console.warn('Skipping damaged saved room',file);}}
function streamRoom(r){if(!r.clients)return;for(const c of [...r.clients]){if(c.destroyed){r.clients.delete(c);continue;}try{c.write('event: change\ndata: '+r.revision+'\n\n');}catch{r.clients.delete(c);}}}

function lanUrls(){const out=[];for(const group of Object.values(os.networkInterfaces()))for(const n of group||[]){if(n.family==='IPv4'&&!n.internal&&(/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(n.address))){out.push(`http://${n.address}:${PORT}`);}}return [...new Set(out)];}
const rng=()=>crypto.randomInt(0,1000000000)/1000000000;const token=()=>crypto.randomBytes(24).toString('hex');const code=()=>crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase();
function reply(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj));}
async function body(req){let chunks=[],size=0;for await(const chunk of req){size+=chunk.length;if(size>16000)throw Error('Request too large.');chunks.push(chunk);}return JSON.parse(Buffer.concat(chunks).toString()||'{}');}
function name(v){let n=String(v||'').trim().slice(0,24);if(!n)throw Error('Enter a player name.');return n;}
function publicRoom(r){return {code:r.code,host:r.host,hostName:r.hostName||"Teacher",players:r.players.map((p,i)=>({id:i,name:p.name,online:Date.now()-(p.lastSeen||0)<60000,removed:!!p.removed,suspended:!!r.game?.players[i]?.suspended})),game:r.game,rounds:r.rounds,revision:r.revision};}
function auth(r,t){if(t===r.hostToken)return -1;let i=r.players.findIndex(p=>p.token===t);if(i<0)throw Error('Your session is not valid. Rejoin the room.');r.players[i].lastSeen=Date.now();return i;}
function roomFor(c){let r=rooms.get(String(c||'').toUpperCase());if(!r)throw Error('Room not found. Check the code.');r.touched=Date.now();return r;}
function touch(r){r.revision++;r.touched=Date.now();saveRoom(r);streamRoom(r);}
const server=http.createServer(async(req,res)=>{let u=new URL(req.url,'http://localhost');try{
if(req.method==='GET'&&['/','/index.html'].includes(u.pathname)){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(__dirname,'index.html')).pipe(res);}
if(req.method==='GET'&&['/health','/api/status'].includes(u.pathname)){return reply(res,200,{ok:true,app:'inflation-city',version:11,lanUrls:lanUrls(),maxPlayers:16});}
if(req.method==='GET'&&u.pathname==='/api/state'){let r=roomFor(u.searchParams.get('code'));auth(r,u.searchParams.get('token'));return reply(res,200,publicRoom(r));}
if(req.method==='GET'&&u.pathname==='/api/stream'){let r=roomFor(u.searchParams.get('code'));auth(r,u.searchParams.get('token'));res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 1200\n\nevent: change\ndata: '+r.revision+'\n\n');r.clients??=new Set();r.clients.add(res);req.on('close',()=>r.clients.delete(res));return;}

if(req.method!=='POST'||!u.pathname.startsWith('/api/'))return reply(res,404,{error:'Not found.'});let b=await body(req);
if(u.pathname==='/api/create'){if(rooms.size>=500)throw Error('Server is full. Try again later.');let c;do{c=code();}while(rooms.has(c));let t=token(),rounds=Number(b.rounds||6);if(![3,4,6,8,10,12].includes(rounds))throw Error('Invalid round count.');let r={code:c,host:-1,hostToken:t,hostName:name(b.name),players:[],game:null,rounds,revision:0,touched:Date.now(),clients:new Set()};rooms.set(c,r);saveRoom(r);return reply(res,200,{room:publicRoom(r),token:t,id:-1});}
if(u.pathname==='/api/join'){let r=roomFor(b.code);if(r.game)throw Error('This game has already started.');if(r.players.length>=16)throw Error('This room is full (16 players).');let n=name(b.name);if(r.players.some(p=>p.name.toLowerCase()===n.toLowerCase()))throw Error('That name is taken.');let t=token(),id=r.players.length;r.players.push({name:n,token:t,lastSeen:Date.now()});touch(r);return reply(res,200,{room:publicRoom(r),token:t,id});}
let r=roomFor(b.code),id=auth(r,b.token);
if(u.pathname==='/api/kick'){let r=roomFor(b.code),hostId=auth(r,b.token);if(hostId!==r.host)throw Error('Only the teacher can remove a student.');if(r.game)throw Error('Use Teacher God Mode to manage students after the game begins.');const target=Number(b.id);if(!Number.isInteger(target)||target<0||target>=r.players.length)throw Error('Select a student in the waiting room.');r.players.splice(target,1);touch(r);return reply(res,200,publicRoom(r));}
if(u.pathname==='/api/start'){if(id!==r.host)throw Error('Only the host can start.');if(r.game)throw Error('Game already started.');if(r.players.length<2)throw Error('At least two student players must join before starting.');r.game=E.create(r.players.map(p=>p.name),{rounds:r.rounds});touch(r);return reply(res,200,publicRoom(r));}
if(u.pathname==='/api/action'){if(!r.game)throw Error('Game has not started.');if(!(['vote','revolutionVote','judgmentVote','dictatorDecision','dictatorForceSale','dictatorFreeBuy','dictatorPersonalTax','dictatorSeize','dictatorIRS','dictatorClaim','dictatorGrantProperty','dictatorGrantCash','dictatorMint','dictatorSetWage','dictatorSetCPI','dictatorSetTax','dictatorClose','dictatorRestore','repair','tradeOffer','tradeAccept','tradeReject','tradeCancel','tradeGiveCash','tradeGiveProperty','wellbeing'].includes(b.action?.type))&&b.revision!==r.game.revision)throw Error('Game changed. Please try again.');if(['closeVote','callElection','closeRevolution','closeJudgment'].includes(b.action?.type)&&id!==r.host)throw Error('Only the host can control classroom elections.');if(id!==r.host&&r.players[id]?.removed)throw Error('Your access to this classroom has been removed by the teacher.');if(id===r.host&&!['closeVote','callElection','closeRevolution','closeJudgment'].includes(b.action?.type))throw Error('Teacher host is a spectator. Join as a student in a separate browser tab to play.');r.history??=[];let before=JSON.parse(JSON.stringify(r.game));E.action(r.game,id===r.host?0:id,b.action,rng);r.history.push(before);if(r.history.length>15)r.history.shift();touch(r);return reply(res,200,publicRoom(r));}
if(u.pathname==='/api/teacher'){
 if(id!==r.host)throw Error('Only the teacher can use the administrative console.');
 if(!r.game)throw Error('Start the classroom game first.');
 if(b.revision!==r.game.revision&&b.command?.type!=='pause'&&b.command?.type!=='resume')throw Error('Game state changed; retry the administrative action.');
 const command=b.command||{};r.history??=[];
 if(command.type==='undo'){
  const snapshot=r.history.pop();if(!snapshot)throw Error('No earlier game state to restore.');
  r.game=snapshot;r.game.revision++;
  E.ensure(r.game);r.game.nextSurpriseAt=Date.now()+40000;
  r.game.log.unshift({round:r.game.round,kind:'event',type:'teacher-undo',text:'🎓 Teacher reversed the previous game action.',id:++r.game.logSeq});
  r.game.news.unshift({id:++r.game.newsSeq,round:r.game.round,kind:'event',title:'Teacher restored game state',text:'The teacher reversed the previous action.',major:true,broadcast:true,scope:'city'});
 }else{
  const before=JSON.parse(JSON.stringify(r.game));
  E.teacherAction(r.game,command,rng);r.history.push(before);if(r.history.length>15)r.history.shift();
  if(['remove','reinstate'].includes(command.type)){if(r.players[Number(command.id)])r.players[Number(command.id)].removed=command.type==='remove';}
 }
 touch(r);return reply(res,200,publicRoom(r));}
if(u.pathname==='/api/skip'){if(id!==r.host)throw Error('Only the host can skip.');let g=r.game;if(!g||g.phase==='finished')throw Error('No active turn.');if(b.revision!==g.revision)throw Error('Game changed. Please try again.');if(g.phase==='vote'){E.action(g,0,{type:'closeVote'},rng);touch(r);return reply(res,200,publicRoom(r));}if(g.phase==='revolution'){E.action(g,0,{type:'closeRevolution'},rng);touch(r);return reply(res,200,publicRoom(r));}if(g.phase==='judgment'){E.action(g,0,{type:'closeJudgment'},rng);touch(r);return reply(res,200,publicRoom(r));}let a=g.turn;for(let i=0;i<30&&g.turn===a&&g.phase!=='finished';i++){if(g.phase==='dictator')E.action(g,g.leader,{type:'dictatorDecision',choice:'good'},rng);else if(g.phase==='roll')E.action(g,a,{type:'roll'},rng);else if(g.phase==='buy')E.action(g,a,{type:'pass'},rng);else if(g.phase==='distress'){let k=Object.keys(g.assets).find(k=>g.assets[k].owner===a);E.action(g,a,k?{type:'sell',id:+k}:{type:'bankrupt'},rng);}else if(g.phase==='end'){E.action(g,a,{type:'end'},rng);break;}else break;}touch(r);return reply(res,200,publicRoom(r));}
return reply(res,404,{error:'Not found.'});}catch(e){return reply(res,400,{error:e.message||'Request failed.'});}});
setInterval(()=>{for(let r of rooms.values()){if(r.game&&E.tick(r.game,Date.now(),rng))touch(r);}},750).unref();
setInterval(()=>{for(let [c,r] of rooms)if(Date.now()-r.touched>TTL){for(let client of r.clients||[])client.end();rooms.delete(c);try{fs.unlinkSync(path.join(DATA_DIR,c+'.json'));}catch{}}},60000).unref();
setInterval(()=>{for(const r of rooms.values())for(const client of r.clients||[])try{client.write(': heartbeat\n\n');}catch{}},15000).unref();

server.listen(PORT,'0.0.0.0',()=>{console.log(`\nINFLATION CITY V11 SOUND CITY — server is ready`);console.log(`Host this game: http://localhost:${PORT}`);const urls=lanUrls();if(urls.length)console.log('Student links (same network):\n'+urls.join('\n'));else console.log('No local IPv4 student address detected. Check your network settings.');console.log('Keep this terminal open during the game.\n');});
