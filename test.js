'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');
const players=Array.from({length:16},(_,i)=>`Student ${i+1}`);
function voteAll(s,system='democracy'){
 for(let guard=0;s.phase==='vote'&&guard<100;guard++){
  const v=s.voting,p=v.kind==='policy'&&s.government==='dictatorship'?s.players[s.leader]:s.players.find(p=>!p.bankrupt&&!v.ballots[p.id]);
  if(!p)throw Error('Voter not found');
  E.action(s,p.id,{type:'vote',choice:v.kind==='government'?system:'yes'});
 }
}
function dictatorGame(){let s=E.create(players,{rounds:6});voteAll(s,'dictatorship');assert.equal(s.government,'dictatorship');assert.ok(Number.isInteger(s.leader));return s;}
assert.equal(E.board.length,32);assert.equal(E.events.filter(e=>e.kind==='life').length,114);assert.equal(E.surpriseEvents.length,154);
let g=dictatorGame();let leader=g.leader,other=(leader+1)%16,third=(leader+2)%16;
assert.equal(E.taxDue(g,g.players[leader]),0);
let pos=g.players[leader].pos,visits=g.players[leader].irsVisits;
E.irsVisit(g,g.players[leader],()=>.5);assert.equal(g.players[leader].irsVisits,visits);E.summonIRS(g,g.players[leader],()=>0);assert.equal(g.players[leader].pos,pos);
let freeBefore=g.players[leader].cash;E.action(g,leader,{type:'dictatorFreeBuy',id:3});assert.equal(g.assets[3].owner,leader);assert.equal(g.players[leader].cash,freeBefore);assert.ok(Number.isFinite(E.net(g,g.players[leader])));
E.action(g,leader,{type:'dictatorFreeBuy',id:5});assert.equal(g.assets[5].owner,leader);
g.assets[1]={owner:other,level:1,purchasePrice:800};let payment=0,victimBefore=g.players[other].cash,dictatorBefore=g.players[leader].cash;
E.action(g,leader,{type:'dictatorForceSale',id:1});assert.equal(g.assets[1].owner,leader);assert.equal(g.players[other].cash,victimBefore+payment);assert.equal(g.players[leader].cash,dictatorBefore-payment);
let victim=g.players[third];let rulerMoney=g.players[leader].cash,victimMoney=victim.cash;
E.action(g,leader,{type:'dictatorPersonalTax',target:third,amount:1800});assert.equal(g.players[leader].cash,rulerMoney+1800);assert.equal(victim.cash,victimMoney-1800);
E.action(g,leader,{type:'dictatorPersonalTax',target:third,amount:2500});assert.equal(g.players[leader].cash,rulerMoney+1800+2500);
rulerMoney=g.players[leader].cash;victimMoney=victim.cash;E.action(g,leader,{type:'dictatorSeize',target:third,amount:400});assert.equal(g.players[leader].cash,rulerMoney+400);assert.equal(victim.cash,victimMoney-400);
let treasury=g.treasury;E.action(g,leader,{type:'dictatorIRS',target:third,amount:500,destination:'treasury'});assert.equal(g.treasury,treasury+500);
assert.throws(()=>E.action(g,third,{type:'dictatorSeize',target:other,amount:10}),/Only the current dictator/);
// God Mode: unlimited repeated actions, minting, grants, macro policy, property reassignment and business shutdown.
let rulerBefore=g.players[leader].cash;
E.action(g,leader,{type:'dictatorMint',amount:600000});assert.equal(g.players[leader].cash,rulerBefore+600000);
let rcp=g.players[other].cash;E.action(g,leader,{type:'dictatorGrantCash',target:other,amount:3500});assert.equal(g.players[other].cash,rcp+3500);
E.action(g,leader,{type:'dictatorGrantProperty',id:1,target:other});assert.equal(g.assets[1].owner,other);
E.action(g,leader,{type:'dictatorClaim',id:1});assert.equal(g.assets[1].owner,leader);
E.action(g,leader,{type:'dictatorSetWage',amount:3000});assert.equal(g.wage,3000);
E.action(g,leader,{type:'dictatorSetCPI',amount:150});assert.equal(g.cpi,1.5);
E.action(g,leader,{type:'dictatorSetTax',amount:48});assert.equal(g.dictatorTaxExtra,.48);
E.action(g,leader,{type:'dictatorClose',id:1});assert.equal(E.rent(g,1),0);
E.action(g,leader,{type:'dictatorRestore',id:1});assert.ok(E.rent(g,1)>0);
assert.throws(()=>E.action(g,third,{type:'dictatorMint',amount:100}),/Only the current dictator/);
console.log('PASS: dictator God Mode repeats, taxes above $2,000, free transfers, cash creation, macro changes, closures, repairs, and authorization.');
// Positive and negative executive decisions.
let h=dictatorGame(),r=h.leader,non=h.players.find(x=>x.id!==r);
h.treasury=10000;h.turn=r;h.phase='dictator';h.dictatorTopic='healthcare';let q0=non.qol;E.action(h,r,{type:'dictatorDecision',choice:'good'});
assert.equal(h.dictatorPolicies.healthcare,true);assert.ok(non.qol>q0);assert.equal(h.phase,'roll');
// Public health decree makes a medical event free, irrespective of cash.
const beforeHealth=h.players[non.id].cash;
h.nextSurpriseAt=0; // event generator can be tested by targeted life draw? card is public, use known medical life via turn scripted.
// Negative choice taxes every non-ruler and finances the ruler.
h.phase='dictator';h.dictatorTopic='healthcare';let leaderCash=h.players[r].cash;let citizenCash=non.cash;
E.action(h,r,{type:'dictatorDecision',choice:'bad'});assert.equal(h.dictatorPolicies.healthcare,false);assert.equal(h.players[r].cash,leaderCash+140*15);assert.equal(non.cash,citizenCash-140);
// Transport policy must actually block private owners' rent.
h.phase='dictator';h.dictatorTopic='transport';h.assets[5]={owner:non.id,level:0};E.action(h,r,{type:'dictatorDecision',choice:'good'});assert.equal(E.rent(h,5),0);
console.log('PASS: required positive/negative ruler dilemmas, QoL changes, funding flows, revenue-free transport.');
// Persistent disasters, closed rents, upgrade restriction, and owner repairs.
let disaster=E.create(players);voteAll(disaster,'democracy');
for(const b of E.board.filter(b=>b.type==='property'))disaster.assets[b.id]={owner:b.id%16,level:1,purchasePrice:b.price};
E.triggerDisaster(disaster,()=>0,true);assert.ok(Object.keys(disaster.disasterSites).length>=4);
const damagedId=disaster.disaster.affected[0],ownerId=disaster.assets[damagedId].owner;
assert.equal(E.rent(disaster,damagedId),0);
assert.ok(disaster.disasterSites[damagedId].type);
assert.ok(disaster.assets[damagedId].closed);
disaster.turn=ownerId;disaster.phase='end';let repairPrice=E.repairCost(disaster,damagedId);
disaster.players[ownerId].cash=repairPrice+1000;
assert.throws(()=>E.action(disaster,ownerId,{type:'upgrade',id:damagedId}),/Repair/);
const helper=(ownerId+1)%16;disaster.players[helper].cash=repairPrice+4000;
let payerCash=disaster.players[helper].cash;E.action(disaster,helper,{type:'repair',id:damagedId});
assert.equal(disaster.players[helper].cash,payerCash-repairPrice);assert.equal(disaster.assets[damagedId].owner,helper);
assert.equal(disaster.repairHistory[0].payer,helper);assert.equal(disaster.repairHistory[0].previousOwner,ownerId);
assert.ok(!disaster.disasterSites[damagedId]);assert.ok(!disaster.assets[damagedId].closed);assert.ok(E.rent(disaster,damagedId)>0);
assert.ok(Object.keys(disaster.disasterSites).length>=3,'Other sites must remain damaged after one repair');
// Repairs remain possible during citywide voting; no turn transfer.
const second=Object.keys(disaster.disasterSites)[0],cost2=E.repairCost(disaster,+second);
disaster.players[helper].cash=cost2+500;disaster.phase='vote';disaster.voting={kind:'government',ballots:{},open:true};
E.action(disaster,helper,{type:'repair',id:+second});assert.ok(!disaster.disasterSites[second]);assert.equal(disaster.phase,'vote');assert.equal(disaster.assets[second].owner,helper);
console.log('PASS: any player can repair anyone else’s property during any turn or ballot, payer takes title at no extra purchase price, rent resumes.');
// Coup: two thirds of non-ruler citizens required. An election is not enough without votes.
let uprising=dictatorGame();E.openRevolution(uprising);let threshold=uprising.revolution.threshold;
assert.equal(threshold,10);assert.throws(()=>E.action(uprising,uprising.leader,{type:'revolutionVote',choice:'rise'}),/Only non-ruler/);
let rebels=uprising.revolution.eligible.slice(0,threshold);
for(const i of rebels)E.action(uprising,i,{type:'revolutionVote',choice:'rise'});
assert.notEqual(uprising.government,'dictatorship');assert.equal(uprising.revolutionHistory[0].success,true);assert.equal(uprising.phase,'judgment');
// Post-revolution citizen decision: confiscation versus forgiveness.
const formerId=uprising.judgment.former,former=uprising.players[formerId],eligible=uprising.judgment.eligible;uprising.turn=eligible[0];
former.cash=1007;uprising.assets[5]={owner:formerId,level:1,purchasePrice:200};uprising.assets[7]={owner:formerId,level:0,purchasePrice:300};
const totalBefore=uprising.players.reduce((n,p)=>n+p.cash,0),judgmentThreshold=uprising.judgment.threshold;
assert.equal(judgmentThreshold,8);assert.throws(()=>E.action(uprising,formerId,{type:'judgmentVote',choice:'forgive'}),/Only active non-dictator/);
for(const id of eligible.slice(0,judgmentThreshold))E.action(uprising,id,{type:'judgmentVote',choice:'punish'},()=>0);
assert.equal(uprising.judgment.result.punished,true);
assert.equal(former.cash,0);assert.equal(uprising.assets[5],undefined);assert.equal(uprising.assets[7],undefined);
assert.equal(uprising.players.reduce((n,p)=>n+p.cash,0),totalBefore);
assert.equal(former.propertyBan,true);assert.equal(former.skipTurns,1);
assert.equal(uprising.judgmentHistory[0].transferred,1007);
assert.throws(()=>{uprising.disasterSites[5]={type:'quake',severity:1};E.action(uprising,formerId,{type:'repair',id:5});},/barred/);
const claimId=3;uprising.turn=formerId;uprising.phase='buy';uprising.players[formerId].pos=claimId;
assert.throws(()=>E.action(uprising,formerId,{type:'buy'}),/barred/);
// The next scheduled turn is skipped once, but later turns are available.
uprising.phase='end';uprising.turn=(formerId+15)%16;
E.action(uprising,uprising.turn,{type:'end'},()=>0);
assert.equal(uprising.players[formerId].skipTurns,0);assert.notEqual(uprising.turn,formerId);
assert.ok(uprising.log.some(e=>e.type==='suspension'));
let mercy=dictatorGame();E.openRevolution(mercy);for(const id of mercy.revolution.eligible.slice(0,mercy.revolution.threshold))E.action(mercy,id,{type:'revolutionVote',choice:'rise'},()=>0);
const previous=mercy.judgment.former,oldCash=mercy.players[previous].cash;mercy.assets[3]={owner:previous,level:0,purchasePrice:100};
for(const id of mercy.judgment.eligible.slice(0,mercy.judgment.threshold))E.action(mercy,id,{type:'judgmentVote',choice:'forgive'},()=>0);
assert.equal(mercy.judgment.result.punished,false);assert.equal(mercy.players[previous].cash,oldCash);assert.equal(mercy.assets[3].owner,previous);
assert.equal(mercy.players[previous].propertyBan,false);assert.equal(mercy.players[previous].skipTurns,0);
console.log('PASS: citizen punishment/forgiveness, exact money redistribution, repossession, permanent property ban and skipping next turn.');
let failed=dictatorGame();E.openRevolution(failed);let first=failed.revolution.eligible[0];
E.action(failed,first,{type:'revolutionVote',choice:'rise'});
for(const id of failed.revolution.eligible.slice(1)) {if(failed.phase!=='revolution')break;E.action(failed,id,{type:'revolutionVote',choice:'loyal'});}
assert.equal(failed.government,'dictatorship');assert.equal(failed.revolutionHistory[0].success,false);assert.ok(failed.players[first].cash<5000);
console.log('PASS: leader-excluded 2/3 coup referendum, successful overthrow, failed coup penalties, regime changes.');
// A peaceful constitutional vote can also remove a dictator and prompt judgment.
let electoral=dictatorGame(),ousted=electoral.leader;electoral.assets[3]={owner:ousted,level:0,purchasePrice:100};const cashBefore=electoral.players[ousted].cash;
electoral.phase='roll';electoral.lastGovElection=-1;E.openGovernmentVote(electoral);voteAll(electoral,'democracy');
assert.equal(electoral.phase,'judgment');assert.equal(electoral.judgment.former,ousted);
for(const voter of electoral.judgment.eligible.slice(0,electoral.judgment.threshold))E.action(electoral,voter,{type:'judgmentVote',choice:'forgive'},()=>0);
assert.equal(electoral.players[ousted].cash,cashBefore);assert.equal(electoral.assets[3].owner,ousted);
// Repairing a bank-owned damaged utility also issues its deed to the repairer.
const utility=E.board.find(q=>q.type==='property'&&q.group==='energy');
assert.ok(utility);let repairFree=E.create(players);voteAll(repairFree,'democracy');
repairFree.disasterSites[utility.id]={type:'surge',severity:1};const utilityCost=E.repairCost(repairFree,utility.id);
repairFree.players[1].cash=utilityCost+50;E.action(repairFree,1,{type:'repair',id:utility.id});
assert.equal(repairFree.assets[utility.id].owner,1);assert.equal(repairFree.players[1].cash,50);assert.equal(E.rent(repairFree,utility.id)>0,true);
console.log('PASS: constitutional removal triggers judgment; bank-owned utility repair conveys ownership without extra price.');

// Full simulations include dictator phases, revolution voting, tax/disaster mechanics, distress, property purchase.
let finished=0;for(let run=0;run<28;run++){
 let s=E.create(players,{rounds:run%2?4:6}),count=0;voteAll(s,run%2?'dictatorship':'democracy');
 while(s.phase!=='finished'){
  if(++count>3000)throw Error('Game stalled in phase '+s.phase+' R'+s.round);
  if(s.phase==='vote'){voteAll(s,s.voting.kind==='government'?'democracy':'yes');continue;}
  if(s.phase==='revolution'){
   let eligible=s.revolution.eligible.find(id=>!s.revolution.ballots[id]);
   if(eligible!=null)E.action(s,eligible,{type:'revolutionVote',choice:run%3===0?'rise':'loyal'});
   else E.action(s,0,{type:'closeRevolution'});
   continue;
  }
  if(s.phase==='judgment'){
   let eligible=s.judgment.eligible.find(id=>!s.judgment.ballots[id]);
   if(eligible!=null)E.action(s,eligible,{type:'judgmentVote',choice:run%4===0?'punish':'forgive'});
   else E.action(s,0,{type:'closeJudgment'});
   continue;
  }
  if(s.phase==='dictator'){E.action(s,s.leader,{type:'dictatorDecision',choice:run%2?'good':'bad'});continue;}
  const p=E.current(s);let act;
  if(s.phase==='roll')act={type:'roll'};
  else if(s.phase==='buy')act={type:p.cash>=E.purchaseCost(s,p.pos,p.id)?'buy':'pass'};
  else if(s.phase==='end')act={type:'end'};
  else if(s.phase==='distress'){let k=Object.keys(s.assets).find(k=>s.assets[k].owner===p.id);act=k?{type:'sell',id:+k}:{type:'bankrupt'};}
  else throw Error('Unexpected '+s.phase);
  E.action(s,p.id,act);
  assert.ok(s.players.every(q=>Number.isFinite(E.net(s,q))),'Net worth NaN');
  assert.ok(Object.values(s.assets).every(a=>Number.isInteger(a.level)&&a.level>=0));
 }
 assert.ok(s.taxHistory.length);assert.ok(s.requiredDisaster);
 finished++;
}
console.log('PASS:',finished,'complete 16-player game simulations with dictator/revolution, asset, tax and disaster mechanics.');
(async()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'inflation-v9-')),port=42000+Math.floor(Math.random()*1000);let proc=spawn(process.execPath,[path.join(__dirname,'server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:temp},stdio:'ignore'}),base='http://127.0.0.1:'+port;
 async function post(route,data){let r=await fetch(base+'/api/'+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),j=await r.json();if(!r.ok)throw Error(route+': '+j.error);return j;}
 async function wait(){for(let n=0;n<40;n++){try{if((await fetch(base+'/health')).ok)return;}catch{}await new Promise(r=>setTimeout(r,60));}throw Error('Server failed to start');}
 try{
  await wait();let host=await post('create',{name:'Teacher',rounds:4}),code=host.room.code,tokens=[];
  for(let i=0;i<16;i++)tokens.push((await post('join',{code,name:players[i]})).token);
  let invalid=await fetch(base+'/api/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,name:'17th student'})});assert.equal(invalid.status,400);
  let room=await post('start',{code,token:host.token});assert.equal(room.players.length,16);
  const stream=await fetch(base+'/api/stream?code='+code+'&token='+tokens[0]);assert.equal(stream.status,200);
  for(let i=0;i<16;i++)await post('action',{code,token:tokens[i],revision:0,action:{type:'vote',choice:'dictatorship'}});
  let snap=await(await fetch(base+'/api/state?code='+code+'&token='+tokens[0])).json();assert.equal(snap.game.government,'dictatorship');
  let ruler=snap.game.leader,target=(ruler+1)%16;
  let r=await post('action',{code,token:tokens[ruler],revision:snap.game.revision,action:{type:'dictatorPersonalTax',target,amount:600}});
  assert.ok(r.game.news.some(n=>n.title.includes('UNLIMITED EXECUTIVE COLLECTION')));
  let forbidden=await fetch(base+'/api/action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,token:tokens[target],revision:r.game.revision,action:{type:'dictatorSeize',target:ruler,amount:50}})});assert.equal(forbidden.status,400);
  await stream.body.cancel().catch(()=>{});proc.kill('SIGTERM');await new Promise(r=>setTimeout(r,200));
  proc=spawn(process.execPath,[path.join(__dirname,'server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:temp},stdio:'ignore'});await wait();
  let restored=await(await fetch(base+'/api/state?code='+code+'&token='+tokens[ruler])).json();assert.equal(restored.game.government,'dictatorship');assert.ok(restored.game.news.some(n=>n.title.includes('UNLIMITED EXECUTIVE COLLECTION')));
  // Resume a persisted post-revolution vote and verify network actions from all students.
  proc.kill('SIGTERM');await new Promise(r=>setTimeout(r,200));
  let roomFile=path.join(temp,code+'.json'),disk=JSON.parse(fs.readFileSync(roomFile,'utf8'));
  E.openRevolution(disk.game);for(const voter of disk.game.revolution.eligible.slice(0,disk.game.revolution.threshold))E.action(disk.game,voter,{type:'revolutionVote',choice:'rise'},()=>0);
  assert.equal(disk.game.phase,'judgment');disk.revision++;disk.touched=Date.now();fs.writeFileSync(roomFile,JSON.stringify(disk));
  proc=spawn(process.execPath,[path.join(__dirname,'server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:temp},stdio:'ignore'});await wait();
  let jud=await(await fetch(base+'/api/state?code='+code+'&token='+tokens[0])).json();
  assert.equal(jud.game.phase,'judgment');let former=jud.game.judgment.former,ballots=jud.game.judgment.eligible.slice(0,jud.game.judgment.threshold);
  let exVote=await fetch(base+'/api/action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,token:tokens[former],revision:jud.game.revision,action:{type:'judgmentVote',choice:'punish'}})});assert.equal(exVote.status,400);
  for(const voter of ballots)jud=await post('action',{code,token:tokens[voter],revision:0,action:{type:'judgmentVote',choice:'punish'}});
  assert.equal(jud.game.judgment.result.punished,true);assert.equal(jud.game.players[former].propertyBan,true);
  console.log('PASS: real multiplayer server: 16 seats, 17th blocked, authorized judgment ballots, shared SSE, and persistence after server restart.');
 }finally{proc.kill('SIGTERM');fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
