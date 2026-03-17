// dark-survival v2 - node dark-survival.js
const http=require(‘http’),{WebSocketServer}=require(‘ws’);
const PORT=process.env.PORT||3000;

const HTML=`<!DOCTYPE html>

<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Dark Survival v2</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:#000;overflow:hidden;font-family:monospace;touch-action:none;}
#G{position:relative;width:100vw;height:100vh;background:#080810;overflow:hidden;}
canvas{position:absolute;top:0;left:0;width:100%;height:100%;}
#hud{position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:5;}
#topRow{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 12px 0;}
.hudL{display:flex;flex-direction:column;gap:4px;}
.bO{width:130px;height:7px;background:#1a0000;border:1px solid #330000;border-radius:2px;overflow:hidden;}
#hpF{height:100%;background:#dd2222;transition:width .1s;}
.bO2{width:130px;height:3px;background:#001122;border:1px solid #002244;border-radius:2px;overflow:hidden;margin-top:1px;}
#expF{height:100%;background:#2277cc;transition:width .2s;}
.hs{font-size:10px;color:#888;margin-top:1px;} .hs span{color:#ccc;}
#timerBox{text-align:center;}
#timerVal{font-size:20px;color:#ffcc00;letter-spacing:2px;font-weight:bold;}
#timerLbl{font-size:8px;color:#555;margin-bottom:1px;}
.hudR{text-align:right;font-size:10px;color:#888;} .hudR span{color:#ccc;}
#bossBar{display:none;padding:4px 12px;text-align:center;}
#bossLbl{font-size:9px;color:#ff4444;letter-spacing:2px;margin-bottom:3px;animation:bp 1s infinite alternate;}
@keyframes bp{from{opacity:.6}to{opacity:1}}
#bossWrap{height:9px;background:#1a0000;border:1px solid #880000;border-radius:2px;overflow:hidden;max-width:280px;margin:0 auto;}
#bossFill{height:100%;background:#ff3300;transition:width .1s;}
#wBar{position:absolute;bottom:20px;right:12px;display:flex;flex-direction:column;gap:6px;z-index:5;pointer-events:all;}
.wBtn{width:54px;height:54px;background:#0c0c18;border:1px solid #2a2a3a;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;}
.wBtn.on{border-color:#ffcc00;background:#141400;}
.wIcon{font-size:18px;line-height:1;margin-bottom:1px;} .wLbl{font-size:8px;color:#888;} .wBtn.on .wLbl{color:#ffcc00;}
#jsWrap{position:absolute;bottom:30px;left:30px;z-index:5;pointer-events:all;}
#jsBase{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.15);position:relative;touch-action:none;}
#jsKnob{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.25);border:2px solid rgba(255,255,255,0.4);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transition:transform .05s;}
#atkBtn{position:absolute;bottom:44px;right:80px;width:64px;height:64px;border-radius:50%;background:rgba(255,100,100,0.15);border:2px solid rgba(255,100,100,0.4);z-index:5;pointer-events:all;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;touch-action:manipulation;}
#atkBtn.pressing{background:rgba(255,100,100,0.35);}
#lobbyScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.93);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:20;padding:20px;}
h1.title{color:#ffcc00;font-size:24px;letter-spacing:5px;margin-bottom:2px;}
.sub{color:#555;font-size:11px;margin-bottom:6px;}
input.inp{background:#111;border:1px solid #333;color:#eee;padding:9px 14px;font-size:14px;font-family:monospace;outline:none;border-radius:4px;width:200px;text-align:center;}
input.inp:focus{border-color:#ffcc00;}
.btn{background:transparent;border:1px solid #ffcc00;color:#ffcc00;padding:10px 28px;font-size:13px;font-family:monospace;letter-spacing:1px;cursor:pointer;border-radius:4px;touch-action:manipulation;}
.btn:hover,.btn:active{background:#ffcc0022;}
.btn2{border-color:#444;color:#888;}
#codeDisplay{font-size:26px;color:#ffcc00;letter-spacing:8px;font-weight:bold;background:#111;padding:12px 28px;border-radius:4px;border:1px solid #333;margin:4px 0;}
#playerListEl{color:#888;font-size:11px;text-align:center;} #playerListEl b{color:#aaffaa;}
#errMsg{color:#ff6666;font-size:11px;min-height:16px;text-align:center;}
#perkScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.93);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:15;padding:20px;}
#perkTitle{font-size:16px;color:#ffcc00;letter-spacing:3px;}
#perkCards{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:360px;}
.perkCard{width:100px;background:#0d0d1a;border:1px solid #333;border-radius:8px;padding:10px 8px;text-align:center;cursor:pointer;touch-action:manipulation;transition:border-color .15s;}
.perkCard:hover,.perkCard:active{border-color:#ffcc00;background:#141400;}
.pIcon{font-size:22px;margin-bottom:4px;} .pName{font-size:9px;color:#ffcc00;margin-bottom:3px;} .pDesc{font-size:8px;color:#666;line-height:1.4;}
#goScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:20;}
#goTitle{font-size:24px;letter-spacing:4px;font-weight:bold;}
#goStats{font-size:12px;color:#888;text-align:center;line-height:1.9;}
#perkList{font-size:10px;color:#556;text-align:center;margin-top:2px;}
#msgPop{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);font-size:16px;color:#ffcc00;pointer-events:none;z-index:6;display:none;text-align:center;font-weight:bold;}
#killFeed{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:3px;align-items:flex-end;z-index:5;pointer-events:none;}
.kf{font-size:10px;animation:kfade 2.5s forwards;} @keyframes kfade{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
#perkHud{position:absolute;bottom:90px;left:12px;display:flex;flex-direction:column;gap:2px;pointer-events:none;z-index:5;}
.ph{font-size:9px;color:#556;}
</style>
</head>
<body>
<div id="G">
<canvas id="c"></canvas>
<div id="hud">
  <div id="topRow">
    <div class="hudL">
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:9px;color:#aa3333;">HP</span>
        <div class="bO"><div id="hpF" style="width:100%"></div></div>
        <span id="hpTxt" style="font-size:10px;color:#cc4444;">100</span>
      </div>
      <div class="bO2"><div id="expF" style="width:0%"></div></div>
      <div class="hs">Lv.<span id="lvTxt">1</span>&nbsp;<span id="killTxt" style="color:#ff8844;">0</span> kills</div>
    </div>
    <div id="timerBox"><div id="timerLbl">TIME</div><div id="timerVal">15:00</div></div>
    <div class="hudR">Wave <span id="waveTxt">1</span><br>Score <span id="scoreTxt">0</span></div>
  </div>
  <div id="bossBar"><div id="bossLbl">[!] BOSS [!]</div><div id="bossWrap"><div id="bossFill" style="width:100%"></div></div></div>
</div>
<div id="perkHud"></div>
<div id="killFeed"></div>
<div id="msgPop"></div>
<div id="jsWrap"><div id="jsBase"><div id="jsKnob"></div></div></div>
<div id="atkBtn">[S]</div>
<div id="wBar">
  <div class="wBtn on" id="w0" onclick="setW(0)"><div class="wIcon">[S]</div><div class="wLbl">\uac80</div></div>
  <div class="wBtn" id="w1" onclick="setW(1)"><div class="wIcon">[G]</div><div class="wLbl">\ucd1d</div></div>
  <div class="wBtn" id="w2" onclick="setW(2)"><div class="wIcon">[B]</div><div class="wLbl">\ud65c</div></div>
  <div class="wBtn" id="w3" onclick="setW(3)"><div class="wIcon">[M]</div><div class="wLbl">\ub9c8\ubc95</div></div>
</div>
<div id="lobbyScreen">
  <h1 class="title">DARK SURVIVAL</h1>
  <p class="sub">15\ubd84 \uc0dd\uc874 . \ubcf4\uc2a4 \ucc98\uce58 . \ucd5c\ub300 4\uc778 \uba40\ud2f0</p>
  <input class="inp" id="nameInp" placeholder="\ub2c9\ub124\uc784 \uc785\ub825" maxlength="10"/>
  <div style="display:flex;gap:8px;margin-top:4px;">
    <button class="btn" onclick="doCreate()">\ubc29 \ub9cc\ub4e4\uae30</button>
    <button class="btn btn2" onclick="showJoin()">\uc785\uc7a5\ud558\uae30</button>
  </div>
  <div id="joinRow" style="display:none;flex-direction:column;align-items:center;gap:8px;margin-top:4px;">
    <input class="inp" id="codeInp" placeholder="\ubc29 \ucf54\ub4dc 5\uc790\ub9ac" maxlength="5" style="letter-spacing:4px;text-transform:uppercase;"/>
    <button class="btn" onclick="doJoin()">\uc785\uc7a5</button>
  </div>
  <div id="waitRoom" style="display:none;flex-direction:column;align-items:center;gap:10px;margin-top:4px;">
    <p style="color:#555;font-size:10px;">\uce5c\uad6c\uc5d0\uac8c \uc774 \ucf54\ub4dc\ub97c \uc54c\ub824\uc8fc\uc138\uc694</p>
    <div id="codeDisplay">----</div>
    <div id="playerListEl"></div>
    <button class="btn" id="startBtn" onclick="doStart()">\u25b6 \uac8c\uc784 \uc2dc\uc791</button>
  </div>
  <div id="errMsg"></div>
</div>
<div id="perkScreen">
  <div id="perkTitle">LEVEL UP!</div>
  <div style="font-size:10px;color:#666;margin-bottom:4px;">\ud2b9\uc131\uc744 \uc120\ud0dd\ud558\uc138\uc694</div>
  <div id="perkCards"></div>
</div>
<div id="goScreen">
  <div id="goTitle"></div>
  <div id="goStats"></div>
  <div id="perkList"></div>
  <button class="btn" style="margin-top:10px;" onclick="location.reload()">\ub2e4\uc2dc \uc2dc\uc791</button>
</div>
</div>
<script>
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d'),G=document.getElementById('G');
let W=G.clientWidth,H=G.clientHeight;canvas.width=W;canvas.height=H;
const WS_URL=(location.protocol==='https:'?'wss://':'ws://')+location.host;
let ws=null,myId=null;
function connect(cb){ws=new WebSocket(WS_URL);ws.onopen=cb;ws.onmessage=e=>onMsg(JSON.parse(e.data));ws.onerror=()=>showErr('\uc11c\ubc84 \uc5f0\uacb0 \uc2e4\ud328');}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o));}
function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';document.getElementById('codeInp').focus();}
function doCreate(){connect(()=>send({t:'create',name:document.getElementById('nameInp').value.trim()||'Player'}));}
function doJoin(){const c=document.getElementById('codeInp').value.toUpperCase();if(!c){showErr('\ucf54\ub4dc \uc785\ub825');return;}connect(()=>send({t:'join',code:c,name:document.getElementById('nameInp').value.trim()||'Player'}));}
function doStart(){send({t:'start'});}

// Perks
const PERKS=[
{id:‘spd’,icon:’[W]’,name:‘Speed’,desc:’\uc774\ub3d9\uc18d\ub3c4 +20%’,apply:p=>{p.speedMul=(p.speedMul||1)*1.2;}},
{id:‘atk’,icon:’[S]’,name:‘Power’,desc:’\uacf5\uaca9\ub825 +25%’,apply:p=>{p.dmgMul=(p.dmgMul||1)*1.25;}},
{id:‘cd’, icon:’[F]’,name:’\ucfe8\uac10’,desc:’\ucfe8\ud0c0\uc784 -20%’,apply:p=>{p.cdMul=(p.cdMul||1)*0.8;}},
{id:‘hp’, icon:’[H]’,name:‘Tough’,desc:’\ucd5c\ub300HP +50’,apply:p=>{p.maxHp+=50;p.hp=Math.min(p.hp+50,p.maxHp);}},
{id:‘rng’,icon:’[R]’,name:‘Range’,desc:‘Range +30%’,apply:p=>{p.rangeMul=(p.rangeMul||1)*1.3;}},
{id:‘vmp’,icon:’[V]’,name:’\ud761\ud608’,desc:’\uacf5\uaca9 \uc2dc HP \ud68c\ubcf5’,apply:p=>{p.vamp=true;}},
{id:‘def’,icon:’[D]’,name:‘Defense’,desc:’\ud53c\ud574 \uac10\uc18c -20%’,apply:p=>{p.defMul=(p.defMul||1)*0.8;}},
{id:‘mul’,icon:’[X]’,name:‘Multi’,desc:’\ubc1c\uc0ac\uccb4 +1’,apply:p=>{p.extraProj=(p.extraProj||0)+1;}},
{id:‘pierce’,icon:’[P]’,name:‘Pierce’,desc:’\ubc1c\uc0ac\uccb4 Pierce’,apply:p=>{p.pierce=true;}},
];
let myPerks=[];
function showPerkScreen(){
document.getElementById(‘perkScreen’).style.display=‘flex’;
const cards=document.getElementById(‘perkCards’);cards.innerHTML=’’;
const pool=[…PERKS].sort(()=>Math.random()-0.5).slice(0,3);
pool.forEach(pk=>{
const d=document.createElement(‘div’);d.className=‘perkCard’;
d.innerHTML=’<div class="pIcon">’+pk.icon+’</div><div class="pName">’+pk.name+’</div><div class="pDesc">’+pk.desc+’</div>’;
d.onclick=()=>{document.getElementById(‘perkScreen’).style.display=‘none’;myPerks.push(pk);pk.apply(myPlayer);updatePerkHud();running=true;send({t:‘perkDone’});};
cards.appendChild(d);
});
}
function updatePerkHud(){document.getElementById(‘perkHud’).innerHTML=myPerks.map(p=>’<div class="ph">’+p.icon+’ ‘+p.name+’</div>’).join(’’);}

const WEAPONS=[
{name:’\uac80’,color:’#66ccff’,glow:’#0088ff’,type:‘sword’,dmg:40,cd:500,range:90},
{name:’\ucd1d’,color:’#ffee44’,glow:’#ffaa00’,type:‘bullet’,dmg:28,cd:250,range:380,spd:9},
{name:’\ud65c’,color:’#88ff88’,glow:’#00cc44’,type:‘arrow’,dmg:22,cd:450,range:320,spd:7},
{name:’\ub9c8\ubc95’,color:’#cc88ff’,glow:’#aa00ff’,type:‘magic’,dmg:35,cd:700,range:260,spd:5}
];

let running=false,gameTime=900,bossSpawned=false;
let kills=0,score=0,camX=0,camY=0,wIdx=0;
let myPlayer=null,allPlayers=[],enemies=[],minibosses=[],bossData=null;
let projs=[],parts=[],orbs=[],otherAtks=[],lastTime=0;
let jsActive=false,jsX=0,jsY=0,attackPressed=false,lastShot=0;
let pendingLevelUp=false;

function mkPlayer(){return{x:0,y:0,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false,speedMul:1,dmgMul:1,cdMul:1,rangeMul:1,defMul:1,vamp:false,extraProj:0,pierce:false};}

function onMsg(msg){
if(msg.t===‘created’){myId=msg.id;document.getElementById(‘codeDisplay’).textContent=msg.code;document.getElementById(‘joinRow’).style.display=‘none’;document.getElementById(‘waitRoom’).style.display=‘flex’;}
else if(msg.t===‘joined’){myId=msg.id;document.getElementById(‘codeDisplay’).textContent=msg.code;document.getElementById(‘joinRow’).style.display=‘none’;document.getElementById(‘startBtn’).style.display=‘none’;document.getElementById(‘waitRoom’).style.display=‘flex’;}
else if(msg.t===‘lobby’){document.getElementById(‘playerListEl’).innerHTML=’\ucc38\uac00\uc790: ‘+msg.players.map(p=>’<b>’+p.name+’</b>’).join(’, ‘);}
else if(msg.t===‘err’){showErr(msg.msg);}
else if(msg.t===‘start’){startGame();}
else if(msg.t===‘state’){applyState(msg);}
else if(msg.t===‘bossSpawn’){bossSpawned=true;document.getElementById(‘bossBar’).style.display=‘block’;showPop(’[!] \ucd5c\uc885 \ubcf4\uc2a4 \ub4f1\uc7a5!’,3000);}
else if(msg.t===‘minibossSpawn’){showPop(’[F] \uc911\uac04 \ubcf4\uc2a4 \ub4f1\uc7a5!’,1500);addKf(’[F] MINIBOSS’,’#ffaa00’);}
else if(msg.t===‘phase2’){showPop(‘PHASE 2 - \ubd84\ub178!’,1500);}
else if(msg.t===‘bossHp’){if(bossData)bossData.hp=msg.hp;}
else if(msg.t===‘pat’){doBossPat(msg);}
else if(msg.t===‘eDead’){spawnFx(msg.x,msg.y,’#ff8844’,8);kills++;score+=10;addKf(’+10’,’#ff8844’);}
else if(msg.t===‘mbDead’){spawnFx(msg.x,msg.y,’#ffaa00’,18);kills+=5;score+=100;addKf(’+100 MINIBOSS!’,’#ffaa00’);}
else if(msg.t===‘playerLeft’){showPop(’\ud50c\ub808\uc774\uc5b4 \ud1f4\uc7a5’,1000);}
else if(msg.t===‘over’){endGame(msg.win);}
else if(msg.t===‘atk’){if(msg.pid!==myId)otherAtks.push({x:msg.x,y:msg.y,ang:msg.ang,wt:msg.wt,color:msg.color,life:280,maxLife:280});}
}

function startGame(){
document.getElementById(‘lobbyScreen’).style.display=‘none’;
running=true;gameTime=900;bossSpawned=false;
kills=0;score=0;projs=[];parts=[];orbs=[];myPerks=[];otherAtks=[];pendingLevelUp=false;
myPlayer=mkPlayer();lastTime=performance.now();
requestAnimationFrame(loop);
}

function applyState(msg){
allPlayers=msg.players||[];enemies=msg.enemies||[];minibosses=msg.mbs||[];
bossData=msg.boss||null;gameTime=msg.gt??gameTime;
const me=allPlayers.find(p=>p.id===myId);
if(me&&myPlayer){
myPlayer.hp+=(me.hp-myPlayer.hp)*0.3;
myPlayer.maxHp=me.maxHp;myPlayer.lv=me.lv;myPlayer.dead=me.dead;
if(me.pendingPerk&&!pendingLevelUp){pendingLevelUp=true;running=false;showPerkScreen();}
else if(!me.pendingPerk)pendingLevelUp=false;
}
if(me&&me.dead&&running){running=false;endGame(false);}
}

function setW(i){wIdx=i;for(let j=0;j<4;j++)document.getElementById(‘w’+j).className=‘wBtn’+(j===i?’ on’:’’);send({t:‘weapon’,w:i});}

// Joystick
const jsBase=document.getElementById(‘jsBase’),jsKnob=document.getElementById(‘jsKnob’);
let jsCX=0,jsCY=0;
function jsStart(e){e.preventDefault();const t=e.touches?e.touches[0]:e,r=jsBase.getBoundingClientRect();jsCX=r.left+r.width/2;jsCY=r.top+r.height/2;jsActive=true;jsMove(e);}
function jsMove(e){if(!jsActive)return;e.preventDefault();const t=e.touches?e.touches[0]:e;let dx=t.clientX-jsCX,dy=t.clientY-jsCY,d=Math.sqrt(dx*dx+dy*dy),m=30;if(d>m){dx=dx/d*m;dy=dy/d*m;}jsX=dx/m;jsY=dy/m;jsKnob.style.transform=’translate(calc(-50% + ’+dx+’px),calc(-50% + ’+dy+‘px))’;}
function jsEnd(){jsActive=false;jsX=0;jsY=0;jsKnob.style.transform=‘translate(-50%,-50%)’;}
jsBase.addEventListener(‘touchstart’,jsStart,{passive:false});jsBase.addEventListener(‘touchmove’,jsMove,{passive:false});jsBase.addEventListener(‘touchend’,jsEnd);
jsBase.addEventListener(‘mousedown’,jsStart);document.addEventListener(‘mousemove’,jsMove);document.addEventListener(‘mouseup’,jsEnd);
const ab=document.getElementById(‘atkBtn’);
ab.addEventListener(‘touchstart’,e=>{e.preventDefault();attackPressed=true;ab.classList.add(‘pressing’);},{passive:false});
ab.addEventListener(‘touchend’,e=>{e.preventDefault();attackPressed=false;ab.classList.remove(‘pressing’);});
ab.addEventListener(‘mousedown’,()=>{attackPressed=true;ab.classList.add(‘pressing’);});
document.addEventListener(‘mouseup’,()=>{attackPressed=false;ab.classList.remove(‘pressing’);});
const keys={};
document.addEventListener(‘keydown’,e=>keys[e.key.toLowerCase()]=true);
document.addEventListener(‘keyup’,e=>keys[e.key.toLowerCase()]=false);
let mouseX=W/2,mouseY=H/2,mouseDown=false;
canvas.addEventListener(‘mousemove’,e=>{const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;});
canvas.addEventListener(‘mousedown’,()=>mouseDown=true);canvas.addEventListener(‘mouseup’,()=>mouseDown=false);

function tryShoot(){
if(!myPlayer||myPlayer.dead)return;
const now=performance.now(),w=WEAPONS[wIdx],cd=w.cd*(myPlayer.cdMul||1);
if(now-lastShot<cd)return;lastShot=now;
const allE=[…enemies,…minibosses,…(bossData?[{id:‘boss’,x:bossData.x,y:bossData.y}]:[])];
let target=null,minD=Infinity;
for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minD){minD=d;target=e;}}
let tx,ty;
if(target&&minD<400*(myPlayer.rangeMul||1)){tx=target.x;ty=target.y;}
else if(jsActive){tx=myPlayer.x+jsX*200;ty=myPlayer.y+jsY*200;}
else{tx=mouseX+camX-W/2;ty=mouseY+camY-H/2;}
const ang=Math.atan2(ty-myPlayer.y,tx-myPlayer.x);
send({t:‘atk’,pid:myId,wt:w.type,x:myPlayer.x,y:myPlayer.y,ang,color:w.color});
if(w.type===‘sword’){doSword(ang,w);return;}
const dmg=w.dmg*(myPlayer.dmgMul||1),range=w.range*(myPlayer.rangeMul||1);
const cnt=1+(myPlayer.extraProj||0)+(w.type===‘magic’?2:0);
for(let i=0;i<cnt;i++){
const a=ang+(i-(cnt-1)/2)*0.3;
projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*w.spd,vy:Math.sin(a)*w.spd,dmg,range,traveled:0,gone:false,color:w.color,glow:w.glow,r:w.type===‘magic’?7:4,enemy:false,type:w.type,pierce:myPlayer.pierce,trail:[]});
}
}

function doSword(ang,w){
const dmg=w.dmg*(myPlayer.dmgMul||1),range=w.range*(myPlayer.rangeMul||1);
// arc trail particles
for(let a=ang-1.0;a<=ang+1.0;a+=0.13){
for(let r=18;r<range;r+=10){
parts.push({x:myPlayer.x+Math.cos(a)*r,y:myPlayer.y+Math.sin(a)*r,vx:Math.cos(a)*0.6,vy:Math.sin(a)*0.6,life:220,maxLife:220,r:6,color:’#66ccff’,glow:’#0088ff’});
}
}
// shockwave ring
for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2;parts.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*4,vy:Math.sin(a)*4,life:180,maxLife:180,r:4,color:’#aaddff’,glow:’#0088ff’});}
const allE=[…enemies,…minibosses,…(bossData?[{id:‘boss’,x:bossData.x,y:bossData.y,r:38}]:[])];
for(const e of allE){
const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
if(d<range){const ea=Math.atan2(dy,dx),diff=Math.abs(((ea-ang)+Math.PI*3)%(Math.PI*2)-Math.PI);if(diff<1.1){reportHit(e.id,dmg);if(myPlayer.vamp)myPlayer.hp=Math.min(myPlayer.hp+5,myPlayer.maxHp);}}
}
}

function reportHit(id,dmg){id===‘boss’?send({t:‘hit’,target:‘boss’,dmg}):send({t:‘hit’,eid:id,dmg});}

// Boss visual patterns
function doBossPat(m){const{i,bx,by,ang}=m;if(i===0)bSpiral(bx,by,ang);else if(i===1)bBlast(bx,by);else if(i===2)bCross(bx,by);else if(i===3)bRapid(bx,by);else if(i===4)bRing(bx,by,ang);else if(i===5)bLaser(bx,by);}
function mkBB(x,y,vx,vy,dmg,col,r){projs.push({x,y,vx,vy,dmg,range:460,traveled:0,gone:false,color:col,glow:col,r,enemy:true,trail:[]});}
function bSpiral(x,y,ang){for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2+ang;mkBB(x,y,Math.cos(a)*4,Math.sin(a)*4,18,’#ff6600’,8);}}
function bBlast(x,y){for(let i=0;i<24;i++){const a=(i/24)*Math.PI*2;mkBB(x,y,Math.cos(a)*2.8,Math.sin(a)*2.8,24,’#ff2200’,11);}spawnFx(x,y,’#ff6600’,20);}
function bCross(x,y){const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]];for(const[dx,dy]of dirs)for(let n=0;n<4;n++)setTimeout(()=>mkBB(x,y,dx*6,dy*6,22,’#cc44ff’,7),n*150);}
function bRapid(x,y){if(!myPlayer)return;for(let n=0;n<8;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-x,dy=myPlayer.y-y,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.35;mkBB(x,y,Math.cos(a)*7,Math.sin(a)*7,20,’#ff4444’,6);},n*80);}
function bRing(x,y,ang){for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2+ang*2,s=3+Math.random()*2;mkBB(x,y,Math.cos(a)*s,Math.sin(a)*s,26,’#ffaa00’,10);}}
function bLaser(x,y){if(!myPlayer)return;const ang=Math.atan2(myPlayer.y-y,myPlayer.x-x);for(let n=0;n<6;n++)setTimeout(()=>mkBB(x,y,Math.cos(ang+(Math.random()-.5)*.15)*9,Math.sin(ang+(Math.random()-.5)*.15)*9,30,’#ff00ff’,7),n*55);}

function update(dt){
if(!running||!myPlayer||myPlayer.dead)return;
const spd=3.2*(myPlayer.speedMul||1);
let mx=jsX,my=jsY;
if(keys[‘w’]||keys[‘arrowup’])my=-1;if(keys[‘s’]||keys[‘arrowdown’])my=1;
if(keys[‘a’]||keys[‘arrowleft’])mx=-1;if(keys[‘d’]||keys[‘arrowright’])mx=1;
const ml=Math.sqrt(mx*mx+my*my)||1;
if(mx||my){myPlayer.x+=mx/ml*spd*(dt/16);myPlayer.y+=my/ml*spd*(dt/16);}
send({t:‘move’,x:myPlayer.x,y:myPlayer.y});
if(attackPressed||mouseDown||keys[’ ’]||enemies.length||minibosses.length||bossData)tryShoot();
camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;

const spF=dt/16;
for(const p of projs){
if(p.gone)continue;
p.x+=p.vx*spF;p.y+=p.vy*spF;
p.traveled+=Math.sqrt(p.vx*p.vx+p.vy*p.vy)*spF;
if(p.trail){p.trail.push({x:p.x,y:p.y});if(p.trail.length>8)p.trail.shift();}
if(p.traveled>p.range){p.gone=true;continue;}
if(!p.enemy){
for(const e of […enemies,…minibosses]){
const dx=p.x-e.x,dy=p.y-e.y;
if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){reportHit(e.id,p.dmg);spawnFx(p.x,p.y,p.color,5);if(myPlayer.vamp)myPlayer.hp=Math.min(myPlayer.hp+3,myPlayer.maxHp);if(!p.pierce)p.gone=true;break;}
}
if(!p.gone&&bossData){const dx=p.x-bossData.x,dy=p.y-bossData.y;if(Math.sqrt(dx*dx+dy*dy)<38+p.r){reportHit(‘boss’,p.dmg);spawnFx(p.x,p.y,p.color,6);if(myPlayer.vamp)myPlayer.hp=Math.min(myPlayer.hp+5,myPlayer.maxHp);if(!p.pierce)p.gone=true;}}
}else{
if(myPlayer&&!myPlayer.dead){const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;if(Math.sqrt(dx*dx+dy*dy)<14){const d2=p.dmg*(myPlayer.defMul||1);myPlayer.hp-=d2;if(myPlayer.hp<0)myPlayer.hp=0;spawnFx(p.x,p.y,’#ff4444’,4);p.gone=true;}}
}
}
projs=projs.filter(p=>!p.gone);
for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
parts=parts.filter(p=>p.life>0);if(parts.length>600)parts=parts.slice(-600);
for(const o of orbs){if(o.col)continue;const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<28){o.col=true;score+=5;}else if(d<100){o.x-=dx/d*3;o.y-=dy/d*3;}}
orbs=orbs.filter(o=>!o.col);
for(const a of otherAtks){a.life-=dt;}
otherAtks=otherAtks.filter(a=>a.life>0);

const me=allPlayers.find(p=>p.id===myId)||myPlayer;
document.getElementById(‘hpF’).style.width=Math.max(0,(myPlayer.hp/myPlayer.maxHp)*100)+’%’;
document.getElementById(‘hpTxt’).textContent=Math.max(0,Math.floor(myPlayer.hp));
document.getElementById(‘expF’).style.width=((myPlayer.exp||0)/myPlayer.expNext*100)+’%’;
document.getElementById(‘lvTxt’).textContent=myPlayer.lv||1;
document.getElementById(‘killTxt’).textContent=kills;
document.getElementById(‘scoreTxt’).textContent=score;
document.getElementById(‘waveTxt’).textContent=Math.max(1,Math.floor((900-gameTime)/90)+1);
const mins=Math.floor(gameTime/60),secs=Math.floor(gameTime%60);
document.getElementById(‘timerVal’).textContent=mins+’:’+(secs<10?‘0’:’’)+secs;
document.getElementById(‘timerVal’).style.color=gameTime<60?’#ff4444’:’#ffcc00’;
if(bossData)document.getElementById(‘bossFill’).style.width=(bossData.hp/bossData.maxHp*100)+’%’;
}

function draw(){
ctx.clearRect(0,0,W,H);
ctx.save();ctx.translate(W/2-camX,H/2-camY);
drawGrid();drawOrbs();drawParts();drawOtherAtks();drawEnemies();drawMinibosses();
if(bossData)drawBoss();drawOthers();if(myPlayer)drawMe();drawProjs();
ctx.restore();
}

function drawGrid(){
ctx.strokeStyle=’#0d0d1a’;ctx.lineWidth=1;
const gs=80,sx=Math.floor((camX-W/2)/gs)*gs,sy=Math.floor((camY-H/2)/gs)*gs;
for(let x=sx;x<camX+W/2+gs;x+=gs){ctx.beginPath();ctx.moveTo(x,camY-H/2);ctx.lineTo(x,camY+H/2);ctx.stroke();}
for(let y=sy;y<camY+H/2+gs;y+=gs){ctx.beginPath();ctx.moveTo(camX-W/2,y);ctx.lineTo(camX+W/2,y);ctx.stroke();}
}
function drawMe(){
const{x,y}=myPlayer;
ctx.save();ctx.shadowColor=’#4488ff’;ctx.shadowBlur=16;
ctx.fillStyle=’#4488ff’;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;ctx.fillStyle=’#aaccff’;ctx.beginPath();ctx.arc(x-2,y-3,4,0,Math.PI*2);ctx.fill();
ctx.restore();
}
const PC=[’#66aaff’,’#ff8866’,’#88ff88’,’#ffcc44’];
function drawOthers(){
allPlayers.forEach((p,i)=>{
if(p.id===myId||p.dead)return;
ctx.save();ctx.shadowColor=PC[i%4];ctx.shadowBlur=10;
ctx.fillStyle=PC[i%4];ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;ctx.fillStyle=’#ffffffcc’;ctx.font=‘9px monospace’;ctx.textAlign=‘center’;
ctx.fillText(p.name||’?’,p.x,p.y-16);ctx.restore();
});
}
// \ub2e4\ub978 \ud50c\ub808\uc774\uc5b4 \uacf5\uaca9 \uc774\ud329\ud2b8
function drawOtherAtks(){
for(const a of otherAtks){
const al=a.life/a.maxLife;
ctx.save();ctx.globalAlpha=al*0.55;ctx.shadowColor=a.color;ctx.shadowBlur=8;
if(a.wt===‘sword’){
for(let ang=a.ang-1.0;ang<=a.ang+1.0;ang+=0.2){
for(let r=18;r<90;r+=14){ctx.fillStyle=a.color;ctx.beginPath();ctx.arc(a.x+Math.cos(ang)*r,a.y+Math.sin(ang)*r,4*(al),0,Math.PI*2);ctx.fill();}
}
}else if(a.wt===‘magic’){
for(let i=0;i<3;i++){const ag=a.ang+(i-1)*0.28;ctx.fillStyle=a.color;ctx.beginPath();ctx.arc(a.x+Math.cos(ag)*40*(1-al),a.y+Math.sin(ag)*40*(1-al),6*al,0,Math.PI*2);ctx.fill();}
}else{
ctx.fillStyle=a.color;ctx.beginPath();ctx.arc(a.x+Math.cos(a.ang)*50*(1-al),a.y+Math.sin(a.ang)*50*(1-al),5*al,0,Math.PI*2);ctx.fill();
}
ctx.restore();
}
}
const ECOL={m:’#bb1111’,r:’#bb4411’,fast:’#9911bb’,tank:’#115588’,healer:’#116611’};
const EEYE={m:’#ff5555’,r:’#ffaa44’,fast:’#dd44ff’,tank:’#44aaff’,healer:’#44ff44’};
function drawEnemies(){
for(const e of enemies){
const er=e.r||10,col=ECOL[e.type]||’#bb1111’,eye=EEYE[e.type]||’#ff5555’;
ctx.save();ctx.shadowColor=col;ctx.shadowBlur=6;
ctx.fillStyle=col;ctx.beginPath();ctx.arc(e.x,e.y,er,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;ctx.fillStyle=eye;
ctx.beginPath();ctx.arc(e.x-2,e.y-2,3,0,Math.PI*2);ctx.fill();
ctx.beginPath();ctx.arc(e.x+2,e.y-2,3,0,Math.PI*2);ctx.fill();
ctx.fillStyle=’#220000’;ctx.fillRect(e.x-er,e.y-er-8,er*2,3);
ctx.fillStyle=col;ctx.fillRect(e.x-er,e.y-er-8,er*2*(e.hp/e.maxHp),3);
ctx.restore();
}
}
function drawMinibosses(){
const t=performance.now()*0.004;
for(const mb of minibosses){
const mr=mb.r||22;
ctx.save();ctx.shadowColor=’#ffaa00’;ctx.shadowBlur=20;
ctx.fillStyle=’#663300’;ctx.beginPath();ctx.arc(mb.x,mb.y,mr,0,Math.PI*2);ctx.fill();
ctx.fillStyle=’#ffaa00’;ctx.beginPath();ctx.arc(mb.x,mb.y,mr*0.55,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
for(let i=0;i<4;i++){const a=(mb.ang||t)+(i/4)*Math.PI*2;ctx.fillStyle=’#ff8800’;ctx.beginPath();ctx.arc(mb.x+Math.cos(a)*mr*0.82,mb.y+Math.sin(a)*mr*0.82,4,0,Math.PI*2);ctx.fill();}
ctx.fillStyle=’#ffcc88’;ctx.font=‘bold 9px monospace’;ctx.textAlign=‘center’;ctx.fillText(‘MINI’,mb.x,mb.y-mr-8);
ctx.fillStyle=’#330000’;ctx.fillRect(mb.x-mr,mb.y-mr-16,mr*2,4);
ctx.fillStyle=’#ff8800’;ctx.fillRect(mb.x-mr,mb.y-mr-16,mr*2*(mb.hp/mb.maxHp),4);
ctx.restore();
}
}
function drawBoss(){
const b=bossData,t=performance.now()*0.003;
ctx.save();ctx.shadowColor=b.phase>=2?’#ff00ff’:’#ff2200’;ctx.shadowBlur=32;
ctx.fillStyle=b.phase===3?’#220055’:b.phase===2?’#550033’:’#880000’;
ctx.beginPath();ctx.arc(b.x,b.y,38,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;
ctx.fillStyle=b.phase>=2?’#ff00ff’:’#ff4444’;ctx.beginPath();ctx.arc(b.x,b.y,22,0,Math.PI*2);ctx.fill();
const ang=b.ang||t,cnt=b.phase>=2?8:6;
for(let i=0;i<cnt;i++){const a=ang+(i/cnt)*Math.PI*2,pulse=0.5+0.5*Math.sin(t*3+i);ctx.fillStyle=b.phase>=2?’#ff00ff’:’#ff2200’;ctx.beginPath();ctx.arc(b.x+Math.cos(a)*30,b.y+Math.sin(a)*30,5+pulse*2,0,Math.PI*2);ctx.fill();}
if(b.phase>=2){ctx.strokeStyle=‘rgba(255,0,255,0.25)’;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,46+Math.sin(t*4)*5,0,Math.PI*2);ctx.stroke();}
if(b.phase>=3){ctx.strokeStyle=‘rgba(255,0,100,0.2)’;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,58+Math.sin(t*6)*6,0,Math.PI*2);ctx.stroke();}
ctx.fillStyle=’#ffcccc’;ctx.font=‘bold 10px monospace’;ctx.textAlign=‘center’;
ctx.fillText(b.phase>=3?‘BOSS !!!’:b.phase>=2?‘BOSS !!’:‘BOSS’,b.x,b.y-50);
ctx.restore();
}
function drawProjs(){
for(const p of projs){
if(p.trail){
p.trail.forEach((tr,i)=>{
ctx.save();ctx.globalAlpha=(i/p.trail.length)*0.5;ctx.fillStyle=p.color;
ctx.beginPath();ctx.arc(tr.x,tr.y,p.r*0.6,0,Math.PI*2);ctx.fill();ctx.restore();
});
}
ctx.save();ctx.shadowColor=p.glow||p.color;ctx.shadowBlur=14;
ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
if(p.type===‘magic’){ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+4,0,Math.PI*2);ctx.stroke();}
ctx.restore();
}
}
function drawParts(){
for(const p of parts){
const al=p.life/p.maxLife;
ctx.save();ctx.globalAlpha=al;
if(p.glow){ctx.shadowColor=p.glow;ctx.shadowBlur=10;}
ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*al,0,Math.PI*2);ctx.fill();ctx.restore();
}
}
function drawOrbs(){
const t=performance.now()*0.004;
for(const o of orbs){
if(o.col)continue;
ctx.save();ctx.shadowColor=’#44aaff’;ctx.shadowBlur=10;
ctx.fillStyle=’#2266cc’;ctx.beginPath();ctx.arc(o.x,o.y+Math.sin(t+o.x)*2,5,0,Math.PI*2);ctx.fill();
ctx.shadowBlur=0;ctx.fillStyle=’#88ccff’;ctx.beginPath();ctx.arc(o.x-1,o.y-2+Math.sin(t+o.x)*2,2,0,Math.PI*2);ctx.fill();
ctx.restore();
}
}
function spawnFx(x,y,color,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1.5+Math.random()*3;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:380,maxLife:380,r:4,color,glow:color});}}
let msgT=0;
function showPop(txt,dur){const el=document.getElementById(‘msgPop’);el.textContent=txt;el.style.display=‘block’;msgT=dur||1400;}
function addKf(txt,color){const f=document.getElementById(‘killFeed’),el=document.createElement(‘div’);el.className=‘kf’;el.textContent=txt;el.style.color=color||’#ff8844’;f.appendChild(el);setTimeout(()=>el.remove(),2600);while(f.children.length>5)f.removeChild(f.firstChild);}
function endGame(win){
running=false;
document.getElementById(‘goScreen’).style.display=‘flex’;
document.getElementById(‘goTitle’).textContent=win?‘BOSS DEFEATED!’:‘GAME OVER’;
document.getElementById(‘goTitle’).style.color=win?’#ffcc00’:’#ff4444’;
const t=Math.floor(900-gameTime);
document.getElementById(‘goStats’).innerHTML=’\uc0dd\uc874: ‘+Math.floor(t/60)+’:’+(String(t%60).padStart(2,‘0’))+’<br>\ucc98\uce58: ‘+kills+’<br>\uc810\uc218: ‘+score;
document.getElementById(‘perkList’).innerHTML=myPerks.map(p=>p.icon+’ ‘+p.name).join(’ . ’);
}
function loop(ts){
const dt=Math.min(ts-lastTime,50);lastTime=ts;
if(msgT>0){msgT-=dt;if(msgT<=0)document.getElementById(‘msgPop’).style.display=‘none’;}
if(running){update(dt);draw();}else if(myPlayer&&!myPlayer.dead)draw();
requestAnimationFrame(loop);
}
window.addEventListener(‘resize’,()=>{W=G.clientWidth;H=G.clientHeight;canvas.width=W;canvas.height=H;});
</script>

</body>
</html>`;

// HTTP
const server=http.createServer((req,res)=>{res.writeHead(200,{‘Content-Type’:‘text/html;charset=utf-8’});res.end(HTML);});

// WebSocket
const wss=new WebSocketServer({server});
const rooms=new Map();
function genCode(){return Math.random().toString(36).substr(2,5).toUpperCase();}
function bcast(room,msg,except){const d=JSON.stringify(msg);room.players.forEach((_,ws)=>{if(ws!==except&&ws.readyState===1)ws.send(d);});}
function bcastAll(room,msg){bcast(room,msg,null);}

const ETYPES=[
{type:‘m’,hpM:1,spd:1.0,r:10,w:0.38},
{type:‘r’,hpM:0.8,spd:0.7,r:10,w:0.24},
{type:‘fast’,hpM:0.5,spd:2.2,r:8,w:0.20},
{type:‘tank’,hpM:3.5,spd:0.5,r:16,w:0.10},
{type:‘healer’,hpM:1.0,spd:0.8,r:10,w:0.08},
];
function pickType(){let r=Math.random(),acc=0;for(const t of ETYPES){acc+=t.w;if(r<acc)return t;}return ETYPES[0];}

function spawnEnemies(room){
if(room.bossSpawned)return;
const tf=1+(900-room.gameTime)/900*3;
const arr=[…room.players.values()].filter(p=>!p.dead);
if(!arr.length)return;
const ref=arr[Math.floor(Math.random()*arr.length)];
const cnt=Math.max(1,Math.floor(tf*1.2));
for(let i=0;i<cnt;i++){
const a=Math.random()*Math.PI*2,r=350+Math.random()*80;
const et=pickType(),baseHp=(20+Math.random()*15*tf)*et.hpM;
room.enemies.push({id:room.eid++,x:ref.x+Math.cos(a)*r,y:ref.y+Math.sin(a)*r,hp:baseHp,maxHp:baseHp,spd:et.spd*(0.9+Math.random()*0.4),type:et.type,r:et.r,dead:false,healT:0});
// 1% \ubbf8\ub2c8\ubcf4\uc2a4
if(Math.random()<0.01){
const a2=Math.random()*Math.PI*2,mbHp=(200+Math.random()*100)*tf;
room.minibosses.push({id:‘mb’+room.eid++,x:ref.x+Math.cos(a2)*(r+80),y:ref.y+Math.sin(a2)*(r+80),hp:mbHp,maxHp:mbHp,spd:1.2,r:22,dead:false,patT:0,ang:0});
bcastAll(room,{t:‘minibossSpawn’});
}
}
if(room.enemies.length>140)room.enemies=room.enemies.filter(e=>!e.dead).slice(-140);
}

function tickRoom(code){
const room=rooms.get(code);if(!room||!room.started)return;
const now=Date.now(),dt=Math.min((now-room.lastTick)/1000,0.1);
room.lastTick=now;room.gameTime-=dt;if(room.gameTime<0)room.gameTime=0;

if(!room.bossSpawned){room.spawnT=(room.spawnT||0)+dt;if(room.spawnT>0.8){room.spawnT=0;spawnEnemies(room);}}
if(!room.bossSpawned&&room.gameTime<=0){
room.bossSpawned=true;
const ref=[…room.players.values()][0]||{x:0,y:0};
room.boss={hp:6000,maxHp:6000,x:ref.x+350,y:ref.y,r:38,dead:false,ang:0,phase:1};
room.enemies=[];room.minibosses=[];
bcastAll(room,{t:‘bossSpawn’,boss:room.boss});
}

const arr=[…room.players.values()];

// enemy AI
for(const e of room.enemies){
if(e.dead)continue;
let near=null,md=Infinity;
for(const p of arr){if(p.dead)continue;const dx=p.x-e.x,dy=p.y-e.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;near=p;}}
if(!near)continue;
const dx=near.x-e.x,dy=near.y-e.y,d=Math.sqrt(dx*dx+dy*dy)||1;
if(e.type===‘healer’){
e.healT+=dt;
if(e.healT>2){e.healT=0;for(const e2 of room.enemies)if(!e2.dead&&Math.sqrt((e2.x-e.x)**2+(e2.y-e.y)**2)<120)e2.hp=Math.min(e2.hp+10,e2.maxHp);}
if(d<200){e.x-=dx/d*e.spd*dt*40;e.y-=dy/d*e.spd*dt*40;}
}else{e.x+=dx/d*e.spd*dt*60;e.y+=dy/d*e.spd*dt*60;}
if(d<e.r+14){near.hp-=(e.type===‘tank’?0.6:0.35)*dt*60;if(near.hp<0)near.hp=0;}
}

// miniboss AI
for(const mb of room.minibosses){
if(mb.dead)continue;
mb.ang+=dt*2;
let near=null,md=Infinity;
for(const p of arr){if(p.dead)continue;const dx=p.x-mb.x,dy=p.y-mb.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;near=p;}}
if(!near)continue;
const dx=near.x-mb.x,dy=near.y-mb.y,d=Math.sqrt(dx*dx+dy*dy)||1;
mb.x+=dx/d*mb.spd*dt*60;mb.y+=dy/d*mb.spd*dt*60;
if(d<mb.r+14){near.hp-=0.6*dt*60;if(near.hp<0)near.hp=0;}
mb.patT+=dt;
if(mb.patT>2){mb.patT=0;bcastAll(room,{t:‘pat’,i:0,bx:mb.x,by:mb.y,ang:mb.ang,phase:1});}
}

// boss AI
if(room.boss&&!room.boss.dead){
const b=room.boss;b.ang+=dt*1.5;
if(b.hp<2000&&b.phase===2){b.phase=3;bcastAll(room,{t:‘phase2’});}
if(b.hp<4000&&b.phase===1){b.phase=2;bcastAll(room,{t:‘phase2’});}
let near=null,md=Infinity;
for(const p of arr){if(p.dead)continue;const dx=p.x-b.x,dy=p.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;near=p;}}
if(near){
const spd=b.phase===3?2.5:b.phase===2?2.0:1.5,dx=near.x-b.x,dy=near.y-b.y,d=Math.sqrt(dx*dx+dy*dy)||1;
b.x+=dx/d*spd*dt*60;b.y+=dy/d*spd*dt*60;
if(d<b.r+14){near.hp-=0.9*dt*60*b.phase;if(near.hp<0)near.hp=0;}
}
room.patT=(room.patT||0)+dt;
const patCd=b.phase===3?0.8:b.phase===2?1.1:1.7,patCount=b.phase===3?6:b.phase===2?5:3;
if(room.patT>patCd){room.patT=0;bcastAll(room,{t:‘pat’,i:(room.patI||0)%patCount,bx:b.x,by:b.y,ang:b.ang,phase:b.phase});room.patI=(room.patI||0)+1;}
}

room.syncT=(room.syncT||0)+dt;
if(room.syncT>0.05){
room.syncT=0;
const ps=[];room.players.forEach(p=>ps.push({id:p.id,x:p.x,y:p.y,hp:p.hp,maxHp:p.maxHp,lv:p.lv,dead:p.dead,name:p.name,pendingPerk:p.pendingPerk}));
bcastAll(room,{t:‘state’,players:ps,
enemies:room.enemies.filter(e=>!e.dead).map(e=>({id:e.id,x:e.x,y:e.y,hp:e.hp,maxHp:e.maxHp,type:e.type,r:e.r})),
mbs:room.minibosses.filter(m=>!m.dead).map(m=>({id:m.id,x:m.x,y:m.y,hp:m.hp,maxHp:m.maxHp,r:m.r,ang:m.ang})),
boss:room.boss&&!room.boss.dead?{x:room.boss.x,y:room.boss.y,hp:room.boss.hp,maxHp:room.boss.maxHp,phase:room.boss.phase,ang:room.boss.ang}:null,
gt:room.gameTime});
}
if([…arr].filter(p=>!p.dead).length===0&&arr.length>0){bcastAll(room,{t:‘over’,win:false});clearInterval(room.tick);rooms.delete(code);}
}

wss.on(‘connection’,ws=>{
ws.pid=Math.random().toString(36).substr(2,6);ws.roomCode=null;
ws.on(‘message’,raw=>{
let msg;try{msg=JSON.parse(raw);}catch{return;}
if(msg.t===‘create’){
const code=genCode();
rooms.set(code,{players:new Map(),enemies:[],minibosses:[],boss:null,gameTime:900,started:false,bossSpawned:false,eid:0,lastTick:Date.now()});
ws.roomCode=code;
rooms.get(code).players.set(ws,{id:ws.pid,x:0,y:0,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false,name:msg.name||‘Player’,pendingPerk:false});
ws.send(JSON.stringify({t:‘created’,code,id:ws.pid}));
bcastAll(rooms.get(code),{t:‘lobby’,players:[…rooms.get(code).players.values()].map(p=>({id:p.id,name:p.name}))});
}
else if(msg.t===‘join’){
const code=(msg.code||’’).toUpperCase(),room=rooms.get(code);
if(!room){ws.send(JSON.stringify({t:‘err’,msg:’\ubc29 \uc5c6\uc74c’}));return;}
if(room.started){ws.send(JSON.stringify({t:‘err’,msg:’\uc774\ubbf8 \uc2dc\uc791\ub428’}));return;}
ws.roomCode=code;
const idx=room.players.size,sp=[{x:0,y:0},{x:60,y:-40},{x:-60,y:40},{x:40,y:60}][idx%4];
room.players.set(ws,{id:ws.pid,…sp,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false,name:msg.name||(‘P’+(idx+1)),pendingPerk:false});
ws.send(JSON.stringify({t:‘joined’,code,id:ws.pid}));
bcastAll(room,{t:‘lobby’,players:[…room.players.values()].map(p=>({id:p.id,name:p.name}))});
}
else if(msg.t===‘start’){const room=rooms.get(ws.roomCode);if(!room)return;room.started=true;room.lastTick=Date.now();bcastAll(room,{t:‘start’});room.tick=setInterval(()=>tickRoom(ws.roomCode),50);}
else if(msg.t===‘move’){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p||p.dead)return;p.x=msg.x;p.y=msg.y;}
else if(msg.t===‘hit’){
const room=rooms.get(ws.roomCode);if(!room)return;
if(msg.target===‘boss’){
if(room.boss&&!room.boss.dead){room.boss.hp-=msg.dmg;if(room.boss.hp<=0){room.boss.dead=true;bcastAll(room,{t:‘over’,win:true});clearInterval(room.tick);rooms.delete(ws.roomCode);}else bcastAll(room,{t:‘bossHp’,hp:room.boss.hp});}
}else{
const mb=room.minibosses.find(m=>m.id===msg.eid&&!m.dead);
if(mb){mb.hp-=msg.dmg;if(mb.hp<=0){mb.dead=true;bcastAll(room,{t:‘mbDead’,x:mb.x,y:mb.y});}return;}
const e=room.enemies.find(e=>e.id===msg.eid&&!e.dead);
if(e){e.hp-=msg.dmg;if(e.hp<=0){e.dead=true;const h=room.players.get(ws);if(h){h.exp+=5;if(h.exp>=h.expNext){h.lv++;h.exp-=h.expNext;h.expNext=Math.floor(h.expNext*1.4);h.maxHp+=20;h.hp=Math.min(h.hp+30,h.maxHp);h.pendingPerk=true;setTimeout(()=>{if(h.pendingPerk)h.pendingPerk=false;},8000);}}bcastAll(room,{t:‘eDead’,eid:e.id,x:e.x,y:e.y});}}
}
}
else if(msg.t===‘perkDone’){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(p)p.pendingPerk=false;}
else if(msg.t===‘weapon’){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(p)p.weapon=msg.w;}
else if(msg.t===‘atk’){const room=rooms.get(ws.roomCode);if(!room)return;bcast(room,msg,ws);}
});
ws.on(‘close’,()=>{const room=rooms.get(ws.roomCode);if(!room)return;room.players.delete(ws);if(room.players.size===0){clearInterval(room.tick);rooms.delete(ws.roomCode);}else bcastAll(room,{t:‘playerLeft’,id:ws.pid});});
});

server.listen(PORT,()=>console.log(‘Dark Survival v2 \u2192 http://localhost:’+PORT));
