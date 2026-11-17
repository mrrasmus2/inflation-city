/* Inflation City Audio Studio — original procedural music and sound design.
   No external audio downloads, no copyrighted samples, no network requests.
   Each browser has its OWN audio instance. Dice and travel sounds only run from
   that player's direct Roll action/movement event. */
(function(global){
'use strict';
const KEY='inflation-city-audio-v11';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
const state={musicOn:false,effectsOn:saved.effectsOn!==false,musicVol:Number.isFinite(+saved.musicVol)?Math.max(0,Math.min(1,+saved.musicVol)):.22,fxVol:Number.isFinite(+saved.fxVol)?Math.max(0,Math.min(1,+saved.fxVol)):.48,ctx:null,musicBus:null,fxBus:null,beat:0,nextAt:0,timer:null,duckUntil:0,buffer:null,usedUserGesture:false};
const BPM=126, SIXTEENTH=60/BPM/4;
const midi=n=>440*Math.pow(2,(n-69)/12);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({musicVol:state.musicVol,fxVol:state.fxVol,effectsOn:state.effectsOn}))}catch{}};
function ctx(){if(state.ctx)return state.ctx;const Klass=global.AudioContext||global.webkitAudioContext;if(!Klass)return null;try{let a=new Klass();let m=a.createGain(),f=a.createGain();m.connect(a.destination);f.connect(a.destination);state.ctx=a;state.musicBus=m;state.fxBus=f;applyGains();return a}catch{return null}}
function unlock(){const a=ctx();if(a){state.usedUserGesture=true;try{if(a.state!=='running')a.resume()}catch{}}return !!a}
function applyGains(){if(!state.ctx)return;const t=state.ctx.currentTime;state.musicBus.gain.setTargetAtTime(state.musicOn?state.musicVol*.22:0,t,.07);state.fxBus.gain.setTargetAtTime(state.effectsOn?state.fxVol*.45:0,t,.025)}
function musicVolume(n){state.musicVol=Math.max(0,Math.min(1,n));applyGains();save()}
function effectsVolume(n){state.fxVol=Math.max(0,Math.min(1,n));applyGains();save()}
function effects(on){state.effectsOn=Boolean(on);if(state.effectsOn)unlock();applyGains();save();return state.effectsOn}
function music(on){state.musicOn=Boolean(on);if(state.musicOn){unlock();start()}else stop();applyGains();return state.musicOn}
function noiseBuffer(){if(state.buffer||!state.ctx)return state.buffer;const a=state.ctx,samples=Math.round(a.sampleRate*2),b=a.createBuffer(1,samples,a.sampleRate),d=b.getChannelData(0);let prev=0;for(let i=0;i<samples;i++){let white=Math.random()*2-1;prev=(prev+white*.28)*.79;d[i]=white*.8+prev*.2}state.buffer=b;return b}
function tone(bus,frequency,when,duration,level=.3,shape='sine',sweep=0,attack=.007){const a=state.ctx;if(!a||duration<=0)return;const begin=Math.max(a.currentTime+.001,when),o=a.createOscillator(),g=a.createGain();o.type=shape;o.frequency.setValueAtTime(Math.max(18,frequency),begin);if(sweep)o.frequency.exponentialRampToValueAtTime(Math.max(18,frequency+sweep),begin+duration*.9);o.connect(g);g.connect(bus);g.gain.setValueAtTime(0.00001,begin);g.gain.exponentialRampToValueAtTime(Math.max(.0002,level),begin+Math.min(attack,duration*.38));g.gain.exponentialRampToValueAtTime(.00001,begin+duration);o.start(begin);o.stop(begin+duration+.015)}
function noise(bus,when,duration,level=.3,filterHz=1200,filterType='bandpass'){const a=state.ctx;if(!a)return;const begin=Math.max(a.currentTime+.001,when),source=a.createBufferSource(),f=a.createBiquadFilter(),gain=a.createGain();source.buffer=noiseBuffer();f.type=filterType;f.frequency.value=filterHz;f.Q.value=.8;source.connect(f);f.connect(gain);gain.connect(bus);gain.gain.setValueAtTime(.00001,begin);gain.gain.linearRampToValueAtTime(Math.max(.0002,level),begin+Math.min(.015,duration/3));gain.gain.exponentialRampToValueAtTime(.00001,begin+duration);source.start(begin);source.stop(begin+duration+.01)}
function fxOK(){return state.effectsOn&&state.fxVol>0&&!!state.ctx&&state.ctx.state!=='closed'}
function duck(seconds=1.5){state.duckUntil=Math.max(state.duckUntil,performance.now()+seconds*1000)}
/* Upbeat original four-bar electronic city groove: bouncy bass, synth stabs,
   syncopated lead, kick, clap and hi-hat. Schedule ahead to avoid timer jitter. */
const chordRoots=[48,45,53,55,48,43,45,55]; // C, A minor, F, G variations
const patterns=[
 [72,null,76,null,79,null,76,74,null,72,null,79,76,null,74,null],
 [76,null,79,81,null,79,76,null,72,null,74,76,null,72,69,null],
 [77,null,81,null,84,81,null,79,77,null,76,null,72,76,null,74],
 [79,83,null,86,83,null,79,null,77,79,81,null,74,null,72,null]
];
function kick(at){tone(state.musicBus,110,at,.22,.75,'sine',-72,.003);noise(state.musicBus,at,.045,.05,150,'lowpass')}
function clap(at){noise(state.musicBus,at,.12,.23,1500,'bandpass');noise(state.musicBus,at+.04,.085,.1,2200,'highpass')}
function hat(at,accent){noise(state.musicBus,at,accent?.075:.035,accent?.12:.065,6400,'highpass')}
function scheduleBeat(k,at){if(!state.musicOn)return;const step=k%16,bar=Math.floor(k/16)%8,root=chordRoots[bar],base=k%64,chord=[root,root+4,root+7];
 if(step%4===0)kick(at);
 if(step===4||step===12)clap(at);
 if(step%2===0)hat(at,step%4===2);
 if(step===7||step===15)hat(at,false);
 if([0,3,6,8,11,14].includes(step)){const n=root-12+([0,0,7,0,5,7][[0,3,6,8,11,14].indexOf(step)]);tone(state.musicBus,midi(n),at,.19,.32,'triangle',-5)}
 if(step===0||step===8){for(const n of chord)tone(state.musicBus,midi(n+12),at,.27,.11,'triangle',0,.014)}
 const lead=patterns[bar%4][step];if(lead!==null){tone(state.musicBus,midi(lead),at,.15,.15,'square',-7,.012);tone(state.musicBus,midi(lead-12),at,.12,.055,'sine')}
}
function scheduler(){if(!state.musicOn||!state.ctx)return;if(document.hidden)return;const a=state.ctx;if(a.state!=='running')return;let guard=0;while(state.nextAt<a.currentTime+.19&&guard++<24){scheduleBeat(state.beat,state.nextAt);state.nextAt+=SIXTEENTH;state.beat++}if(state.nextAt<a.currentTime-.25)state.nextAt=a.currentTime+.03}
function start(){if(state.timer||!state.ctx)return;state.beat=0;state.nextAt=state.ctx.currentTime+.06;state.timer=setInterval(scheduler,45);scheduler()}
function stop(){if(state.timer)clearInterval(state.timer);state.timer=null}
/* The roller hears shaking immediately, with increasing tumbles and a final
   solid tabletop landing aligned with the 800ms die animation. */
function roll(){if(!unlock()||!fxOK())return;const a=state.ctx,t=a.currentTime+.006;duck(1.15);noise(state.fxBus,t,.22,.11,1000,'lowpass');
 const hits=[.03,.10,.18,.28,.38,.50,.59,.68];for(let i=0;i<hits.length;i++){const at=t+hits[i];noise(state.fxBus,at,.035+.008*(i%2),.18+.027*i,1500+i*200,'bandpass');tone(state.fxBus,170+i*25,at,.035,.10,'triangle',-75)}
 noise(state.fxBus,t+.765,.10,.45,600,'lowpass');tone(state.fxBus,185,t+.763,.13,.55,'sine',-116);tone(state.fxBus,890,t+.80,.10,.12,'triangle',-330);
}
let lastStepAt=-1;
function step(){if(!fxOK())return;let now=state.ctx.currentTime;if(now-lastStepAt<.09)return;lastStepAt=now;noise(state.fxBus,now,.032,.10,1100,'bandpass');tone(state.fxBus,390+(Math.random()-.5)*85,now,.06,.13,'triangle',-80)}
function arrive(){if(!fxOK())return;const t=state.ctx.currentTime;tone(state.fxBus,420,t,.12,.18,'sine',130);tone(state.fxBus,640,t+.10,.15,.2,'triangle',70)}
function cash(positive=true){if(!fxOK())return;const t=state.ctx.currentTime;[0,.08,.18].forEach((delay,i)=>tone(state.fxBus,positive?[680,880,1120][i]:[440,330,210][i],t+delay,.15,.19,positive?'sine':'sawtooth',-20))}
function purchase(){if(!fxOK())return;const t=state.ctx.currentTime;noise(state.fxBus,t,.028,.32,3600,'highpass');tone(state.fxBus,420,t,.08,.3,'triangle',-80);tone(state.fxBus,780,t+.095,.18,.26,'sine',120);tone(state.fxBus,1080,t+.23,.28,.18,'triangle')}
function positive(){if(!fxOK())return;const t=state.ctx.currentTime;[523,659,784,1046].forEach((f,i)=>tone(state.fxBus,f,t+i*.13,.24,.25,'triangle',30))}
function warning(){if(!fxOK())return;const t=state.ctx.currentTime;[480,370,240].forEach((f,i)=>tone(state.fxBus,f,t+i*.15,.24,.25,'sawtooth',-75))}
function election(){if(!fxOK())return;const t=state.ctx.currentTime;duck(2.1);for(let i=0;i<4;i++){tone(state.fxBus,[392,523,659,784][i],t+i*.19,.35,.22,'triangle');if(i%2===0)noise(state.fxBus,t+i*.2,.12,.15,1400,'bandpass')}}
function revolution(){if(!fxOK())return;const t=state.ctx.currentTime;duck(4);for(let i=0;i<6;i++){noise(state.fxBus,t+i*.30,.13,.25,600+i*250,'bandpass');tone(state.fxBus,104+i*23,t+i*.29,.45,.33,'sawtooth',-28)}[392,466,523,698,784,1046].forEach((f,i)=>tone(state.fxBus,f,t+1.65+i*.17,.7,.18,'triangle'))}
function dictatorship(){if(!fxOK())return;const t=state.ctx.currentTime;duck(3);[0,.34,.68,1.02].forEach((d,i)=>{tone(state.fxBus,[130,146,174,196][i],t+d,.65,.3,'sawtooth');noise(state.fxBus,t+d,.13,.15,480,'lowpass')});tone(state.fxBus,392,t+1.38,.8,.24,'triangle')}
function siren(t=state.ctx.currentTime,len=2.8){for(let i=0;i<6;i++)tone(state.fxBus,i%2?880:550,t+i*.4,.38,.11,'sawtooth',(i%2?-280:330),.025)}
function disaster(kind='wildfire'){if(!fxOK())return;const t=state.ctx.currentTime;duck(4);siren(t);if(kind==='wildfire'){for(let i=0;i<15;i++){let at=t+.15+i*.2;noise(state.fxBus,at,.24,.07,500+i%4*300,'bandpass');noise(state.fxBus,at+.06,.055,.1,1800+i%3*700,'highpass')}}else if(kind==='flood'){for(let i=0;i<8;i++)noise(state.fxBus,t+i*.34,.85,.12,380+i%3*180,'lowpass')}else if(kind==='quake'){tone(state.fxBus,80,t,.9,.45,'sawtooth',-30);for(let i=0;i<9;i++)noise(state.fxBus,t+i*.29,.38,.13,200,'lowpass')}else if(kind==='surge'){for(let i=0;i<8;i++){noise(state.fxBus,t+i*.28,.15,.23,4000,'highpass');tone(state.fxBus,1400+i*120,t+i*.28,.13,.15,'sawtooth',-850)}}}
function eventMajor(n){if(!n)return;if(n.disaster){disaster(n.disaster.type||n.disaster.kind||'wildfire');return}const title=String(n.title||'').toUpperCase();if(n.sound==='coup'||/REVOLUTION|OVERTHROWN|COUP|UPRISING/.test(title))return revolution();if(/DICTATOR|DICTATORSHIP|AUTHORITARIAN/.test(title))return dictatorship();if(/VOTE|ELECTION|REFERENDUM|GOVERNMENT|POLICY/.test(title))return election();if(n.kind==='good'||/STIMULUS|BOOM|BONUS|RELIEF/.test(title))return positive();if(n.kind==='cost'||/CRASH|RECESSION|SHOCK|TAX/.test(title))return warning();return election()}
function eventSmall(n){if(!n||!fxOK())return;const title=String(n.title||'');if(/purchase|sold|sale|property|trade|repair|exchange|grant.*property/i.test(title))return purchase();if(n.kind==='good'||/refund|wage|received|payment|bonus|award/i.test(title))return cash(true);if(n.kind==='cost'||/bill|rent|penalt|lost|fee|deduct|tax/i.test(title))return warning()}
function onVisibility(){if(document.hidden){if(state.timer){clearInterval(state.timer);state.timer=null;}if(state.ctx&&state.musicBus)state.musicBus.gain.setTargetAtTime(0,state.ctx.currentTime,.04)}else if(state.musicOn&&state.ctx){applyGains();state.nextAt=state.ctx.currentTime+.06;start()}}
document.addEventListener('visibilitychange',onVisibility);
const api={state,unlock,music,effects,musicVolume,effectsVolume,roll,step,arrive,eventMajor,eventSmall,disaster,cash,purchase,positive,warning,election,revolution,dictatorship,stop};
global.CityAudio=api;
})(window);
