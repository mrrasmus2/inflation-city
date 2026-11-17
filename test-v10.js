'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function http(port,path,body){const r=await fetch(`http://127.0.0.1:${port}/api/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Server error');return j;}
async function fail(promise,pattern){let msg='';try{await promise}catch(e){msg=e.message;}assert.match(msg,pattern);}
function completeVote(s){while(s.phase==='vote'){let p=s.players.find(p=>!p.bankrupt&&!s.voting.ballots[p.id]);if(!p)break;E.action(s,p.id,{type:'vote',choice:'democracy'});}}
(async()=>{
 assert.ok(E.policies.length>=30,'Expanded policy deck');assert.ok(E.IRS_OUTCOMES.length>=20,'Expanded IRS deck');
 let s=E.create(['Alex','Jordan','Taylor','Morgan'],{rounds:4});completeVote(s);
 s.assets[1]={owner:0,level:1,purchasePrice:800};s.assets[3]={owner:1,level:0,purchasePrice:1050};
 E.action(s,0,{type:'tradeOffer',id:1,target:1,price:725,askId:3});assert.equal(s.trades[0].status,'pending');
 await fail(Promise.resolve().then(()=>E.action(s,2,{type:'tradeAccept',tradeId:s.trades[0].id})),/addressed buyer/);
 const c0=s.players[0].cash,c1=s.players[1].cash;
 E.action(s,1,{type:'tradeAccept',tradeId:s.trades[0].id});assert.equal(s.assets[1].owner,1);assert.equal(s.assets[3].owner,0);assert.equal(s.players[1].cash,c1-725);assert.equal(s.players[0].cash,c0+725);
 E.action(s,0,{type:'tradeGiveCash',target:1,amount:100});assert.equal(s.players[1].cash,c1-625);
 E.action(s,1,{type:'tradeGiveProperty',target:0,id:1});assert.equal(s.assets[1].owner,0);
 let q=s.players[1].qol;E.action(s,1,{type:'wellbeing',choice:'housing'});assert.ok(s.players[1].qol>q);
 await fail(Promise.resolve().then(()=>E.action(s,1,{type:'wellbeing',choice:'health'})),/once per round/);
 E.teacherAction(s,{type:'credit',id:2,amount:2000});assert.equal(s.players[2].cash,7000);
 E.teacherAction(s,{type:'setTax',amount:17});assert.equal(E.taxDue(s,s.players[2]),Math.round(s.wage*.17));
 E.teacherAction(s,{type:'pause'});await fail(Promise.resolve().then(()=>E.action(s,s.turn,{type:'roll'})),/paused/);
 E.teacherAction(s,{type:'resume'});E.teacherAction(s,{type:'disaster',kind:'wildfire',properties:[1,3],target:'group',targets:[0,1],severity:2});
 assert.equal(E.rent(s,1),0);assert.equal(s.disasterSites[3].type,'wildfire');
 E.action(s,1,{type:'repair',id:1});assert.equal(s.assets[1].owner,1);assert.equal(s.disasterSites[1],undefined);
 E.teacherAction(s,{type:'restore',id:3});assert.ok(E.rent(s,3)>=0);
 E.teacherAction(s,{type:'remove',id:2});assert.equal(s.players[2].suspended,true);
 await fail(Promise.resolve().then(()=>E.action(s,2,{type:'tradeGiveCash',target:0,amount:1})),/suspended/);
 E.teacherAction(s,{type:'reinstate',id:2});assert.equal(s.players[2].suspended,false);
 console.log('PASS engine: trades, acceptance, swaps, gifts, QoL, teacher macro/pause/disaster/restore/student access');
 const port=3210,dir=fs.mkdtempSync(path.join(os.tmpdir(),'inflation-v10-'));
 const server=cp.spawn(process.execPath,['server.js'],{cwd:__dirname,env:{...process.env,PORT:String(port),DATA_DIR:dir},stdio:'ignore'});
 try{
  let ready=false;for(let i=0;i<30;i++){try{const r=await fetch(`http://127.0.0.1:${port}/health`);if(r.ok){ready=true;break;}}catch{}await wait(100);}assert.ok(ready,'server starts');
  const a=await http(port,'create',{name:'Teacher A',rounds:4});const b=await http(port,'create',{name:'Teacher B',rounds:4});assert.notEqual(a.room.code,b.room.code);
  let tokensA=[],tokensB=[];
  for(let i=0;i<8;i++){tokensA.push(await http(port,'join',{code:a.room.code,name:'A student '+i}));tokensB.push(await http(port,'join',{code:b.room.code,name:'B student '+i}));}
  // Teacher removes from lobby; new student replaces that seat.
  let ar=await http(port,'kick',{code:a.room.code,token:a.token,id:7});assert.equal(ar.players.length,7);
  tokensA.pop();tokensA.push(await http(port,'join',{code:a.room.code,name:'Replacement'}));
  await fail(http(port,'kick',{code:a.room.code,token:tokensA[0].token,id:5}),/Only the teacher/);
  let gameA=await http(port,'start',{code:a.room.code,token:a.token});let gameB=await http(port,'start',{code:b.room.code,token:b.token});
  assert.equal(gameA.players.length,8);assert.equal(gameB.players.length,8);
  for(let i=0;i<8;i++){
   const res=await http(port,'action',{code:a.room.code,token:tokensA[i].token,revision:gameA.game.revision,action:{type:'vote',choice:'democracy'}});gameA=res;
  }
  let before=gameA.game.players[0].cash;
  gameA=await http(port,'teacher',{code:a.room.code,token:a.token,revision:gameA.game.revision,command:{type:'credit',id:0,amount:2000}});
  assert.equal(gameA.game.players[0].cash,before+2000);
  await fail(http(port,'teacher',{code:a.room.code,token:tokensA[0].token,revision:gameA.game.revision,command:{type:'credit',id:0,amount:1000}}),/Only the teacher/);
  gameA=await http(port,'teacher',{code:a.room.code,token:a.token,revision:gameA.game.revision,command:{type:'pause'}});
  await fail(http(port,'action',{code:a.room.code,token:tokensA[0].token,revision:gameA.game.revision,action:{type:'roll'}}),/paused/);
  gameA=await http(port,'teacher',{code:a.room.code,token:a.token,revision:gameA.game.revision,command:{type:'resume'}});
  gameA=await http(port,'teacher',{code:a.room.code,token:a.token,revision:gameA.game.revision,command:{type:'disaster',kind:'flood',properties:[1,3],target:'all',severity:2}});
  assert.equal(E.rent(gameA.game,1),0);
  gameA=await http(port,'action',{code:a.room.code,token:tokensA[0].token,revision:gameA.game.revision,action:{type:'repair',id:1}});
  assert.equal(gameA.game.assets[1].owner,0);
  gameA=await http(port,'action',{code:a.room.code,token:tokensA[0].token,revision:gameA.game.revision,action:{type:'tradeOffer',id:1,target:1,price:450}});
  gameA=await http(port,'action',{code:a.room.code,token:tokensA[1].token,revision:gameA.game.revision,action:{type:'tradeAccept',tradeId:gameA.game.trades[0].id}});
  assert.equal(gameA.game.assets[1].owner,1);
  gameA=await http(port,'teacher',{code:a.room.code,token:a.token,revision:gameA.game.revision,command:{type:'undo'}});
  assert.equal(gameA.game.assets[1].owner,0);
  const unchanged=await fetch(`http://127.0.0.1:${port}/api/state?code=${b.room.code}&token=${b.token}`).then(r=>r.json());
  assert.equal(unchanged.game.phase,'vote');assert.equal(unchanged.game.players[0].cash,5000);
  console.log('PASS server: two simultaneous 8-student rooms; host permissions, lobby kick, state sync, pause, disasters, repair takeover, trade, undo and room isolation');
 }finally{server.kill();fs.rmSync(dir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
