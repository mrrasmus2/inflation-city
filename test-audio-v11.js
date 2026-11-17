'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/soundscape.js','utf8');
let nodes=[],interval=0;class Param {constructor(){this.value=0}setValueAtTime(v){this.value=v}setTargetAtTime(v){this.value=v}linearRampToValueAtTime(v){this.value=v}exponentialRampToValueAtTime(v){this.value=v}}
class AudioNode {constructor(name){this.name=name;this.gain=new Param;this.frequency=new Param;this.Q=new Param;nodes.push(this)}connect(){}start(){}stop(){}}
class Context {constructor(){this.currentTime=0;this.sampleRate=8000;this.state='running';this.destination=new AudioNode('destination')}createGain(){return new AudioNode('gain')}createOscillator(){return new AudioNode('oscillator')}createBufferSource(){return new AudioNode('source')}createBiquadFilter(){return new AudioNode('filter')}createBuffer(channels,size){return {getChannelData(){return new Float32Array(size)}}}resume(){this.state='running';return Promise.resolve()}}
const storage={};const window={AudioContext:Context},document={hidden:false,addEventListener(){}},sandbox={window,document,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},performance:{now:()=>1000},setInterval:()=>++interval,clearInterval:()=>{},Math,console};
vm.runInNewContext(source,sandbox,{filename:'soundscape.js'});const a=window.CityAudio;assert.ok(a);
assert.equal(a.state.musicOn,false);assert.equal(a.state.effectsOn,true);
a.unlock();let before=nodes.length;a.roll();assert.ok(nodes.length>before+15,'dice roll should schedule many clacks and landing sounds');
before=nodes.length;a.step();assert.ok(nodes.length>before,'local movement should play footsteps');
a.effects(false);before=nodes.length;a.roll();a.eventMajor({disaster:{type:'flood'}});assert.equal(nodes.length,before,'mute suppresses effects');
a.effects(true);a.music(true);assert.equal(a.state.musicOn,true);assert.ok(a.state.timer,'music scheduler runs');before=nodes.length;a.eventMajor({disaster:{type:'wildfire'}});assert.ok(nodes.length>before+12,'fire + siren must create a layered soundtrack');
before=nodes.length;a.eventMajor({title:'DICTATOR OVERTHROWN',sound:'coup'});assert.ok(nodes.length>before+6,'revolution stinger');
a.musicVolume(.17);a.effectsVolume(.52);assert.equal(JSON.parse(storage['inflation-city-audio-v11']).musicVol,.17);a.music(false);assert.equal(a.state.timer,null);
const ui=fs.readFileSync(__dirname+'/ui.html','utf8');
assert.match(ui,/if\(type==='roll'\)\{window\.CityAudio\?\.roll\(\);await animateDice\(\)/,'roll sound should start before visual animation and API call');
assert.match(ui,/session\?\.id===activeAnimation\.player\)window\.CityAudio\?\.step\(\)/,'travel sounds limited to rolling player');
assert.match(ui,/pendingDice:mode==='network'&&session\?\.id!==m\.player/,'remote dice animation still present');
assert.match(ui,/shouldPlayPersonalEvent\(event,s\)/,'routine news sounds filtered by recipient');
assert.match(ui,/musicBtn/);assert.match(ui,/effectsBtn/);
const html=fs.readFileSync(__dirname+'/index.html','utf8');assert.ok(html.includes('global.CityAudio=api')&&html.includes('V11 SOUND CITY'));
console.log('PASS audio: original music, independently muted channels, dice/clacks and footsteps, disasters, event stingers, persistence and player-only sound guards');
