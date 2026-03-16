// dark-survival.js — 한 파일로 실행: node dark-survival.js
const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

// ── HTML 클라이언트 ─────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Dark Survival</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:#000;overflow:hidden;font-family:monospace;touch-action:none;}
#G{position:relative;width:100vw;height:100vh;background:#080810;overflow:hidden;}
canvas{position:absolute;top:0;left:0;width:100%;height:100%;}
#hud{position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:5;}
#topRow{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 12px 0;}
.hudL{display:flex;flex-direction:column;gap:4px;}
.barOuter{width:130px;height:7px;background:#1a0000;border:1px solid #330000;border-radius:2px;overflow:hidden;}
#hpFill{height:100%;background:#dd2222;transition:width .1s;}
.barOuter2{width:130px;height:3px;background:#001122;border:1px solid #002244;border-radius:2px;overflow:hidden;margin-top:1px;}
#expFill{height:100%;background:#2277cc;transition:width .2s;}
.hs{font-size:10px;color:#888;margin-top:1px;}
.hs span{color:#ccc;}
#timerBox{text-align:center;}
#timerVal{font-size:20px;color:#ffcc00;letter-spacing:2px;font-weight:bold;}
#timerLbl{font-size:8px;color:#555;margin-bottom:1px;}
.hudR{text-align:right;font-size:10px;color:#888;}
.hudR span{color:#ccc;}
#bossBar{display:none;padding:4px 12px;text-align:center;}
#bossLbl{font-size:9px;color:#ff4444;letter-spacing:2px;margin-bottom:3px;animation:bp 1s infinite alternate;}
@keyframes bp{from{opacity:.6}to{opacity:1}}
#bossWrap{height:9px;background:#1a0000;border:1px solid #880000;border-radius:2px;overflow:hidden;max-width:280px;margin:0 auto;}
#bossFill{height:100%;background:#ff3300;transition:width .1s;}
#wBar{position:absolute;bottom:20px;right:12px;display:flex;flex-direction:column;gap:6px;z-index:5;pointer-events:all;}
.wBtn{width:54px;height:54px;background:#0c0c18;border:1px solid #2a2a3a;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;}
.wBtn.on{border-color:#ffcc00;background:#141400;}
.wIcon{font-size:18px;line-height:1;margin-bottom:1px;}
.wLbl{font-size:8px;color:#888;}
.wBtn.on .wLbl{color:#ffcc00;}
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
.btn2:hover,.btn2:active{border-color:#888;color:#ccc;}
#codeDisplay{font-size:26px;color:#ffcc00;letter-spacing:8px;font-weight:bold;background:#111;padding:12px 28px;border-radius:4px;border:1px solid #333;margin:4px 0;}
#playerListEl{color:#888;font-size:11px;text-align:center;min-height:18px;}
#playerListEl b{color:#aaffaa;}
#errMsg{color:#ff6666;font-size:11px;min-height:16px;text-align:center;}
#goScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:20;}
#goTitle{font-size:24px;letter-spacing:4px;font-weight:bold;}
#goStats{font-size:12px;color:#888;text-align:center;line-height:1.9;}
#msgPop{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);font-size:16px;color:#ffcc00;pointer-events:none;z-index:6;display:none;text-align:center;font-weight:bold;text-shadow:0 0 20px #ffcc0088;}
#killFeed{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:3px;align-items:flex-end;z-index:5;pointer-events:none;}
.kf{font-size:10px;color:#ff8844;animation:kfade 2.5s forwards;}
@keyframes kfade{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
#ctrlHint{position:absolute;bottom:84px;left:50%;transform:translateX(-50%);font-size:9px;color:#2a2a3a;pointer-events:none;z-index:4;white-space:nowrap;}
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
          <div class="barOuter"><div id="hpFill" style="width:100%"></div></div>
          <span id="hpTxt" style="font-size:10px;color:#cc4444;">100</span>
        </div>
        <div class="barOuter2"><div id="expFill" style="width:0%"></div></div>
        <div class="hs">Lv.<span id="lvTxt">1</span>&nbsp; <span id="killTxt" style="color:#ff8844;">0</span> kills</div>
      </div>
      <div id="timerBox"><div id="timerLbl">TIME</div><div id="timerVal">15:00</div></div>
      <div class="hudR">Wave <span id="waveTxt">1</span><br>Score <span id="scoreTxt">0</span></div>
    </div>
    <div id="bossBar"><div id="bossLbl">⚠ BOSS ⚠</div><div id="bossWrap"><div id="bossFill" style="width:100%"></div></div></div>
  </div>
  <div id="killFeed"></div>
  <div id="msgPop"></div>
  <div id="ctrlHint">WASD 이동 · 마우스클릭 공격 (PC) &nbsp;|&nbsp; 조이스틱 · ⚔버튼 (모바일)</div>
  <div id="jsWrap"><div id="jsBase"><div id="jsKnob"></div></div></div>
  <div id="atkBtn">⚔</div>
  <div id="wBar">
    <div class="wBtn on" id="w0" onclick="setW(0)"><div class="wIcon">⚔</div><div class="wLbl">검</div></div>
    <div class="wBtn" id="w1" onclick="setW(1)"><div class="wIcon">🔫</div><div class="wLbl">총</div></div>
    <div class="wBtn" id="w2" onclick="setW(2)"><div class="wIcon">🏹</div><div class="wLbl">활</div></div>
    <div class="wBtn" id="w3" onclick="setW(3)"><div class="wIcon">✨</div><div class="wLbl">마법</div></div>
  </div>
  <div id="lobbyScreen">
    <h1 class="title">DARK SURVIVAL</h1>
    <p class="sub">15분 생존 · 보스 처치 · 최대 4인 멀티</p>
    <input class="inp" id="nameInp" placeholder="닉네임 입력" maxlength="10"/>
    <div style="display:flex;gap:8px;margin-top:4px;">
      <button class="btn" onclick="doCreate()">방 만들기</button>
      <button class="btn btn2" onclick="showJoin()">입장하기</button>
    </div>
    <div id="joinRow" style="display:none;flex-direction:column;align-items:center;gap:8px;margin-top:4px;">
      <input class="inp" id="codeInp" placeholder="방 코드 5자리" maxlength="5" style="letter-spacing:4px;text-transform:uppercase;"/>
      <button class="btn" onclick="doJoin()">입장</button>
    </div>
    <div id="waitRoom" style="display:none;flex-direction:column;align-items:center;gap:10px;margin-top:4px;">
      <p style="color:#555;font-size:10px;">친구에게 이 코드를 알려주세요</p>
      <div id="codeDisplay">----</div>
      <div id="playerListEl"></div>
      <button class="btn" id="startBtn" onclick="doStart()">▶ 게임 시작</button>
      <p style="color:#444;font-size:10px;">혼자여도 시작 가능</p>
    </div>
    <div id="errMsg"></div>
  </div>
  <div id="goScreen">
    <div id="goTitle"></div>
    <div id="goStats"></div>
    <button class="btn" style="margin-top:8px;" onclick="location.reload()">다시 시작</button>
  </div>
</div>
<script>
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d'),G=document.getElementById('G');
let W=G.clientWidth,H=G.clientHeight;
canvas.width=W;canvas.height=H;

const WS_URL=(location.protocol==='https:'?'wss://':'ws://')+location.host;
let ws=null,myId=null,isHost=false;

function connect(cb){ws=new WebSocket(WS_URL);ws.onopen=cb;ws.onmessage=e=>handleMsg(JSON.parse(e.data));ws.onerror=()=>showErr('서버 연결 실패 — 잠시 후 다시 시도해주세요');}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o));}

function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';document.getElementById('codeInp').focus();}

function doCreate(){
  const name=document.getElementById('nameInp').value.trim()||'Player';
  connect(()=>send({t:'create',name}));
}
function doJoin(){
  const name=document.getElementById('nameInp').value.trim()||'Player';
  const code=document.getElementById('codeInp').value.toUpperCase();
  if(!code){showErr('코드를 입력하세요');return;}
  connect(()=>send({t:'join',code,name}));
}
function doStart(){send({t:'start'});}

function handleMsg(msg){
  if(msg.t==='created'){myId=msg.id;isHost=true;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='joined'){myId=msg.id;isHost=false;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('startBtn').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='lobby'){document.getElementById('playerListEl').innerHTML='참가자: '+msg.players.map(p=>'<b>'+p.name+'</b>').join(', ');}
  else if(msg.t==='err'){showErr(msg.msg);}
  else if(msg.t==='start'){startGame();}
  else if(msg.t==='state'){applyState(msg);}
  else if(msg.t==='bossSpawn'){bossSpawned=true;bossAlive=true;document.getElementById('bossBar').style.display='block';showPop('⚠  BOSS 등장!',3000);}
  else if(msg.t==='phase2'){showPop('PHASE 2!',1500);}
  else if(msg.t==='bossHp'){if(bossData)bossData.hp=msg.hp;}
  else if(msg.t==='pat'){doBossPat(msg);}
  else if(msg.t==='eDead'){spawnParts(msg.x,msg.y,'#ff8844',8);kills++;score+=10;addKf('+10');}
  else if(msg.t==='playerLeft'){showPop('플레이어 퇴장',1200);}
  else if(msg.t==='over'){endGame(msg.win);}
}

// game state
let running=false,gameTime=900,bossSpawned=false,bossAlive=false;
let kills=0,score=0,camX=0,camY=0,wIdx=0;
let myPlayer=null,allPlayers=[],enemies=[],bossData=null;
let projs=[],parts=[],orbs=[],lastTime=0;
let jsActive=false,jsX=0,jsY=0,attackPressed=false,lastShot=0;

const WEAPONS=[
  {name:'검',color:'#66ccff',type:'sword',dmg:40,cd:500,range:90},
  {name:'총',color:'#ffee44',type:'bullet',dmg:28,cd:250,range:380,spd:9},
  {name:'활',color:'#88ff88',type:'arrow',dmg:22,cd:450,range:320,spd:7},
  {name:'마법',color:'#cc88ff',type:'magic',dmg:35,cd:700,range:260,spd:5}
];

function startGame(){
  document.getElementById('lobbyScreen').style.display='none';
  running=true;gameTime=900;bossSpawned=false;bossAlive=false;
  kills=0;score=0;projs=[];parts=[];orbs=[];
  myPlayer={x:0,y:0,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false};
  lastTime=performance.now();
  requestAnimationFrame(loop);
}

function applyState(msg){
  allPlayers=msg.players||[];enemies=msg.enemies||[];
  bossData=msg.boss||null;gameTime=msg.gt??gameTime;
  const me=allPlayers.find(p=>p.id===myId);
  if(me&&myPlayer){myPlayer.hp=me.hp;myPlayer.maxHp=me.maxHp;myPlayer.lv=me.lv;myPlayer.dead=me.dead;}
  if(me&&me.dead&&running){running=false;endGame(false);}
}

function setW(i){
  wIdx=i;
  for(let j=0;j<4;j++)document.getElementById('w'+j).className='wBtn'+(j===i?' on':'');
  send({t:'weapon',w:i});
}

// joystick
const jsBase=document.getElementById('jsBase'),jsKnob=document.getElementById('jsKnob');
let jsCX=0,jsCY=0;
function jsStart(e){e.preventDefault();const t=e.touches?e.touches[0]:e,r=jsBase.getBoundingClientRect();jsCX=r.left+r.width/2;jsCY=r.top+r.height/2;jsActive=true;jsMove(e);}
function jsMove(e){if(!jsActive)return;e.preventDefault();const t=e.touches?e.touches[0]:e;let dx=t.clientX-jsCX,dy=t.clientY-jsCY,d=Math.sqrt(dx*dx+dy*dy),max=30;if(d>max){dx=dx/d*max;dy=dy/d*max;}jsX=dx/max;jsY=dy/max;jsKnob.style.transform='translate(calc(-50% + '+dx+'px), calc(-50% + '+dy+'px))';}
function jsEnd(){jsActive=false;jsX=0;jsY=0;jsKnob.style.transform='translate(-50%,-50%)';}
jsBase.addEventListener('touchstart',jsStart,{passive:false});
jsBase.addEventListener('touchmove',jsMove,{passive:false});
jsBase.addEventListener('touchend',jsEnd);
jsBase.addEventListener('mousedown',jsStart);
document.addEventListener('mousemove',jsMove);
document.addEventListener('mouseup',jsEnd);

const atkBtn=document.getElementById('atkBtn');
atkBtn.addEventListener('touchstart',e=>{e.preventDefault();attackPressed=true;atkBtn.classList.add('pressing');},{passive:false});
atkBtn.addEventListener('touchend',e=>{e.preventDefault();attackPressed=false;atkBtn.classList.remove('pressing');});
atkBtn.addEventListener('mousedown',()=>{attackPressed=true;atkBtn.classList.add('pressing');});
document.addEventListener('mouseup',()=>{attackPressed=false;atkBtn.classList.remove('pressing');});

const keys={};
document.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let mouseX=W/2,mouseY=H/2,mouseDown=false;
canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;});
canvas.addEventListener('mousedown',()=>mouseDown=true);
canvas.addEventListener('mouseup',()=>mouseDown=false);

function tryShoot(){
  if(!myPlayer||myPlayer.dead)return;
  const now=performance.now(),w=WEAPONS[wIdx];
  if(now-lastShot<w.cd)return;
  lastShot=now;
  let target=null,minD=Infinity;
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minD){minD=d;target=e;}}
  let tx,ty;
  if(target&&minD<380){tx=target.x;ty=target.y;}
  else if(jsActive){tx=myPlayer.x+jsX*200;ty=myPlayer.y+jsY*200;}
  else{tx=mouseX+camX-W/2;ty=mouseY+camY-H/2;}
  const ang=Math.atan2(ty-myPlayer.y,tx-myPlayer.x);
  if(w.type==='sword'){doSword(ang);return;}
  const cnt=w.type==='magic'?3:1;
  for(let i=0;i<cnt;i++){const a=ang+(i-(cnt-1)/2)*0.28;projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*w.spd,vy:Math.sin(a)*w.spd,dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:w.type==='magic'?7:4,enemy:false});}
}

function doSword(ang){
  const w=WEAPONS[0];
  for(let a=ang-0.9;a<=ang+0.9;a+=0.2)for(let r=22;r<w.range;r+=14)parts.push({x:myPlayer.x+Math.cos(a)*r,y:myPlayer.y+Math.sin(a)*r,vx:0,vy:0,life:160,maxLife:160,r:5,color:'#66ccff'});
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<w.range){const ea=Math.atan2(dy,dx),diff=Math.abs(((ea-ang)+Math.PI*3)%(Math.PI*2)-Math.PI);if(diff<1.1)reportHit(e.id==='boss'?'boss':e.id,w.dmg);}}
}

function reportHit(id,dmg){id==='boss'?send({t:'hit',target:'boss',dmg}):send({t:'hit',eid:id,dmg});}

function doBossPat(msg){
  const{i,bx,by,ang,phase}=msg;
  if(i===0)bossSpiral(bx,by,ang);
  else if(i===1)bossBlast(bx,by);
  else if(i===2)bossCross(bx,by);
  else if(i===3)bossRapid(bx,by);
  else if(i===4)bossRing(bx,by,ang);
}
function mkBB(bx,by,vx,vy,dmg,col,r){projs.push({x:bx,y:by,vx,vy,dmg,range:420,traveled:0,gone:false,color:col,r,enemy:true});}
function bossSpiral(bx,by,ang){for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*3.8,Math.sin(a)*3.8,16,'#ff6600',8);}}
function bossBlast(bx,by){for(let i=0;i<18;i++){const a=(i/18)*Math.PI*2;mkBB(bx,by,Math.cos(a)*2.2,Math.sin(a)*2.2,20,'#ff2200',10);}spawnParts(bx,by,'#ff6600',14);}
function bossCross(bx,by){const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]];for(const[dx,dy]of dirs)for(let n=0;n<3;n++)setTimeout(()=>mkBB(bx,by,dx*5,dy*5,18,'#cc44ff',6),n*180);}
function bossRapid(bx,by){if(!myPlayer)return;for(let n=0;n<6;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.5;mkBB(bx,by,Math.cos(a)*6,Math.sin(a)*6,14,'#ff4444',5);},n*100);}
function bossRing(bx,by,ang){for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2+ang*2,s=2+Math.random()*2;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,22,'#ffaa00',9);}}

function update(dt){
  if(!running||!myPlayer||myPlayer.dead)return;
  const spd=3.2;
  let mx=jsX,my=jsY;
  if(keys['w']||keys['arrowup'])my=-1;if(keys['s']||keys['arrowdown'])my=1;
  if(keys['a']||keys['arrowleft'])mx=-1;if(keys['d']||keys['arrowright'])mx=1;
  const ml=Math.sqrt(mx*mx+my*my)||1;
  if(mx||my){myPlayer.x+=mx/ml*spd*(dt/16);myPlayer.y+=my/ml*spd*(dt/16);}
  send({t:'move',x:myPlayer.x,y:myPlayer.y});
  if(attackPressed||mouseDown||keys[' ']||keys['f']||enemies.length>0)tryShoot();
  camX+=(myPlayer.x-camX)*0.12;camY+=(myPlayer.y-camY)*0.12;

  const spF=dt/16;
  for(const p of projs){
    if(p.gone)continue;
    p.x+=p.vx*spF;p.y+=p.vy*spF;p.traveled+=Math.sqrt(p.vx*p.vx+p.vy*p.vy)*spF;
    if(p.traveled>p.range){p.gone=true;continue;}
    if(!p.enemy){
      for(const e of enemies){const dx=p.x-e.x,dy=p.y-e.y;if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){reportHit(e.id,p.dmg);spawnParts(p.x,p.y,p.color,4);p.gone=true;break;}}
      if(!p.gone&&bossData){const dx=p.x-bossData.x,dy=p.y-bossData.y;if(Math.sqrt(dx*dx+dy*dy)<38+p.r){reportHit('boss',p.dmg);spawnParts(p.x,p.y,p.color,5);p.gone=true;}}
    }else{
      if(myPlayer&&!myPlayer.dead){const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;if(Math.sqrt(dx*dx+dy*dy)<14){myPlayer.hp-=p.dmg;if(myPlayer.hp<0)myPlayer.hp=0;spawnParts(p.x,p.y,p.color,4);p.gone=true;}}
    }
  }
  projs=projs.filter(p=>!p.gone);
  for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
  parts=parts.filter(p=>p.life>0);if(parts.length>400)parts=parts.slice(-400);
  for(const o of orbs){if(o.col)continue;const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<28){o.col=true;score+=5;}else if(d<100){o.x-=dx/d*3;o.y-=dy/d*3;}}
  orbs=orbs.filter(o=>!o.col);

  const me=allPlayers.find(p=>p.id===myId)||myPlayer;
  document.getElementById('hpFill').style.width=Math.max(0,(me.hp/me.maxHp)*100)+'%';
  document.getElementById('hpTxt').textContent=Math.max(0,Math.floor(me.hp));
  document.getElementById('expFill').style.width=(myPlayer.exp/myPlayer.expNext*100)+'%';
  document.getElementById('lvTxt').textContent=me.lv||1;
  document.getElementById('killTxt').textContent=kills;
  document.getElementById('scoreTxt').textContent=score;
  document.getElementById('waveTxt').textContent=Math.max(1,Math.floor((900-gameTime)/90)+1);
  const mins=Math.floor(gameTime/60),secs=Math.floor(gameTime%60);
  document.getElementById('timerVal').textContent=mins+':'+(secs<10?'0':'')+secs;
  document.getElementById('timerVal').style.color=gameTime<60?'#ff4444':'#ffcc00';
  if(bossData)document.getElementById('bossFill').style.width=(bossData.hp/bossData.maxHp*100)+'%';
}

function draw(){
  ctx.clearRect(0,0,W,H);
  const ox=W/2-camX,oy=H/2-camY;
  ctx.save();ctx.translate(ox,oy);
  drawGrid();drawOrbs();drawParts();drawEnemies();
  if(bossData)drawBoss();drawOthers();if(myPlayer)drawMe();drawProjs();
  ctx.restore();
}

function drawGrid(){
  ctx.strokeStyle='#0d0d1a';ctx.lineWidth=1;
  const gs=80,sx=Math.floor((camX-W/2)/gs)*gs,sy=Math.floor((camY-H/2)/gs)*gs;
  for(let x=sx;x<camX+W/2+gs;x+=gs){ctx.beginPath();ctx.moveTo(x,camY-H/2);ctx.lineTo(x,camY+H/2);ctx.stroke();}
  for(let y=sy;y<camY+H/2+gs;y+=gs){ctx.beginPath();ctx.moveTo(camX-W/2,y);ctx.lineTo(camX+W/2,y);ctx.stroke();}
}
function drawMe(){
  const{x,y}=myPlayer;
  ctx.save();ctx.shadowColor='#4488ff';ctx.shadowBlur=14;
  ctx.fillStyle='#4488ff';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle='#aaccff';ctx.beginPath();ctx.arc(x-2,y-3,4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
const PC=['#66aaff','#ff8866','#88ff88','#ffcc44'];
function drawOthers(){
  allPlayers.forEach((p,i)=>{
    if(p.id===myId||p.dead)return;
    ctx.save();ctx.shadowColor=PC[i%4];ctx.shadowBlur=10;
    ctx.fillStyle=PC[i%4];ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle='#ffffffcc';ctx.font='9px monospace';ctx.textAlign='center';
    ctx.fillText(p.name||'?',p.x,p.y-16);ctx.restore();
  });
}
function drawEnemies(){
  for(const e of enemies){
    ctx.save();ctx.shadowColor=e.type==='r'?'#ff8844':'#ff2222';ctx.shadowBlur=6;
    ctx.fillStyle=e.type==='r'?'#bb4411':'#bb1111';ctx.beginPath();ctx.arc(e.x,e.y,10,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle='#ff5555';
    ctx.beginPath();ctx.arc(e.x-2,e.y-2,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(e.x+2,e.y-2,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#220000';ctx.fillRect(e.x-10,e.y-18,20,3);
    ctx.fillStyle='#cc2222';ctx.fillRect(e.x-10,e.y-18,20*(e.hp/e.maxHp),3);
    ctx.restore();
  }
}
function drawBoss(){
  const b=bossData,t=performance.now()*0.003;
  ctx.save();ctx.shadowColor='#ff2200';ctx.shadowBlur=24;
  ctx.fillStyle=b.phase===1?'#880000':'#550033';ctx.beginPath();ctx.arc(b.x,b.y,38,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(b.x,b.y,22,0,Math.PI*2);ctx.fill();
  const ang=b.ang||t;ctx.fillStyle='#ff2200';
  for(let i=0;i<6;i++){const a=ang+(i/6)*Math.PI*2;ctx.beginPath();ctx.arc(b.x+Math.cos(a)*30,b.y+Math.sin(a)*30,6,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#ffcccc';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('BOSS',b.x,b.y-44);
  ctx.restore();
}
function drawProjs(){
  for(const p of projs){ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=8;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();}
}
function drawParts(){
  for(const p of parts){const a=p.life/p.maxLife;ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*a,0,Math.PI*2);ctx.fill();ctx.restore();}
}
function drawOrbs(){
  const t=performance.now()*0.004;
  for(const o of orbs){if(o.col)continue;ctx.save();ctx.shadowColor='#44aaff';ctx.shadowBlur=8;ctx.fillStyle='#2266cc';ctx.beginPath();ctx.arc(o.x,o.y+Math.sin(t+o.x)*2,5,0,Math.PI*2);ctx.fill();ctx.restore();}
}

function spawnParts(x,y,color,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*2.5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:350,maxLife:350,r:3,color});}}

let msgTimer=0;
function showPop(txt,dur){const el=document.getElementById('msgPop');el.textContent=txt;el.style.display='block';msgTimer=dur||1400;}
function addKf(txt){const f=document.getElementById('killFeed'),el=document.createElement('div');el.className='kf';el.textContent=txt;f.appendChild(el);setTimeout(()=>el.remove(),2600);while(f.children.length>4)f.removeChild(f.firstChild);}

function endGame(win){
  running=false;
  const el=document.getElementById('goScreen');el.style.display='flex';
  document.getElementById('goTitle').textContent=win?'BOSS DEFEATED!':'GAME OVER';
  document.getElementById('goTitle').style.color=win?'#ffcc00':'#ff4444';
  const t=Math.floor(900-gameTime);
  document.getElementById('goStats').innerHTML='생존: '+Math.floor(t/60)+':'+(String(t%60).padStart(2,'0'))+'<br>처치: '+kills+'<br>점수: '+score;
}

function loop(ts){
  const dt=Math.min(ts-lastTime,50);lastTime=ts;
  if(msgTimer>0){msgTimer-=dt;if(msgTimer<=0)document.getElementById('msgPop').style.display='none';}
  if(running){update(dt);draw();}
  requestAnimationFrame(loop);
}

window.addEventListener('resize',()=>{W=G.clientWidth;H=G.clientHeight;canvas.width=W;canvas.height=H;});
</script>
</body>
</html>`;

// ── HTTP 서버 ──────────────────────────────────────────────
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});

// ── WebSocket 서버 ─────────────────────────────────────────
const wss = new WebSocketServer({ server });
const rooms = new Map();

function genCode() { return Math.random().toString(36).substr(2, 5).toUpperCase(); }
function bcast(room, msg, except) {
  const d = JSON.stringify(msg);
  room.players.forEach((_, ws) => { if (ws !== except && ws.readyState === 1) ws.send(d); });
}
function bcastAll(room, msg) { bcast(room, msg, null); }

function spawnEnemies(room) {
  if (room.bossSpawned) return;
  const tf = 1 + (900 - room.gameTime) / 900 * 3;
  const cnt = Math.max(1, Math.floor(tf * 1.2));
  const arr = [...room.players.values()].filter(p => !p.dead);
  if (!arr.length) return;
  const ref = arr[Math.floor(Math.random() * arr.length)];
  for (let i = 0; i < cnt; i++) {
    const a = Math.random() * Math.PI * 2, r = 350 + Math.random() * 80;
    const hp = 20 + Math.random() * 15 * tf;
    room.enemies.push({ id: room.eid++, x: ref.x + Math.cos(a)*r, y: ref.y + Math.sin(a)*r, hp, maxHp: hp, spd: 0.9 + Math.random()*0.5, type: Math.random()<0.25?'r':'m', dead: false });
  }
  if (room.enemies.length > 130) room.enemies = room.enemies.filter(e => !e.dead).slice(-130);
}

function tickRoom(code) {
  const room = rooms.get(code);
  if (!room || !room.started) return;
  const now = Date.now();
  const dt = Math.min((now - room.lastTick) / 1000, 0.1);
  room.lastTick = now;
  room.gameTime -= dt;
  if (room.gameTime < 0) room.gameTime = 0;

  if (!room.bossSpawned) {
    room.spawnT = (room.spawnT||0) + dt;
    if (room.spawnT > 0.8) { room.spawnT = 0; spawnEnemies(room); }
  }
  if (!room.bossSpawned && room.gameTime <= 0) {
    room.bossSpawned = true;
    const arr = [...room.players.values()];
    const ref = arr[0] || { x: 0, y: 0 };
    room.boss = { hp: 2500, maxHp: 2500, x: ref.x+300, y: ref.y, r: 38, dead: false, ang: 0, phase: 1 };
    room.enemies = [];
    bcastAll(room, { t: 'bossSpawn', boss: room.boss });
  }

  const arr = [...room.players.values()];
  for (const e of room.enemies) {
    if (e.dead) continue;
    let near = null, md = Infinity;
    for (const p of arr) { if (p.dead) continue; const dx=p.x-e.x,dy=p.y-e.y,d=Math.sqrt(dx*dx+dy*dy); if(d<md){md=d;near=p;} }
    if (!near) continue;
    const dx=near.x-e.x,dy=near.y-e.y,d=Math.sqrt(dx*dx+dy*dy)||1;
    e.x+=dx/d*e.spd*dt*60; e.y+=dy/d*e.spd*dt*60;
    if (d<24) { near.hp-=0.35*dt*60; if(near.hp<0)near.hp=0; }
  }

  if (room.boss && !room.boss.dead) {
    const b = room.boss;
    b.ang += dt * 1.5;
    if (b.hp < 1250 && b.phase===1) { b.phase=2; bcastAll(room, {t:'phase2'}); }
    let near=null,md=Infinity;
    for(const p of arr){if(p.dead)continue;const dx=p.x-b.x,dy=p.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;near=p;}}
    if (near) {
      const dx=near.x-b.x,dy=near.y-b.y,d=Math.sqrt(dx*dx+dy*dy)||1;
      b.x+=dx/d*1.5*dt*60; b.y+=dy/d*1.5*dt*60;
      if(d<b.r+14){near.hp-=0.8*dt*60*b.phase;if(near.hp<0)near.hp=0;}
    }
    room.patT=(room.patT||0)+dt;
    if(room.patT>(b.phase===1?1.8:1.2)){
      room.patT=0;
      bcastAll(room,{t:'pat',i:(room.patI||0)%(b.phase===1?3:5),bx:b.x,by:b.y,ang:b.ang,phase:b.phase});
      room.patI=(room.patI||0)+1;
    }
  }

  room.syncT=(room.syncT||0)+dt;
  if(room.syncT>0.05){
    room.syncT=0;
    const ps=[]; room.players.forEach(p=>ps.push({id:p.id,x:p.x,y:p.y,hp:p.hp,maxHp:p.maxHp,lv:p.lv,w:p.weapon,dead:p.dead,name:p.name}));
    bcastAll(room,{t:'state',players:ps,enemies:room.enemies.filter(e=>!e.dead).map(e=>({id:e.id,x:e.x,y:e.y,hp:e.hp,maxHp:e.maxHp,type:e.type})),boss:room.boss&&!room.boss.dead?{x:room.boss.x,y:room.boss.y,hp:room.boss.hp,maxHp:room.boss.maxHp,phase:room.boss.phase,ang:room.boss.ang}:null,gt:room.gameTime});
  }

  const alive=arr.filter(p=>!p.dead);
  if(alive.length===0&&arr.length>0){bcastAll(room,{t:'over',win:false});clearInterval(room.tick);rooms.delete(code);}
}

wss.on('connection', ws => {
  ws.pid = Math.random().toString(36).substr(2, 6);
  ws.roomCode = null;

  ws.on('message', raw => {
    let msg; try{msg=JSON.parse(raw);}catch{return;}

    if(msg.t==='create'){
      const code=genCode();
      rooms.set(code,{players:new Map(),enemies:[],boss:null,gameTime:900,started:false,bossSpawned:false,eid:0,lastTick:Date.now()});
      ws.roomCode=code;
      rooms.get(code).players.set(ws,{id:ws.pid,x:0,y:0,hp:100,maxHp:100,lv:1,exp:0,expNext:50,weapon:0,dead:false,name:msg.name||'Player'});
      ws.send(JSON.stringify({t:'created',code,id:ws.pid}));
      bcastAll(rooms.get(code),{t:'lobby',players:[...rooms.get(code).players.values()].map(p=>({id:p.id,name:p.name}))});
    }
    else if(msg.t==='join'){
      const code=(msg.code||'').toUpperCase(),room=rooms.get(code);
      if(!room){ws.send(JSON.stringify({t:'err',msg:'방을 찾을 수 없어요'}));return;}
      if(room.started){ws.send(JSON.stringify({t:'err',msg:'이미 시작된 방이에요'}));return;}
      ws.roomCode=code;
      const idx=room.players.size,sp=[{x:0,y:0},{x:60,y:-40},{x:-60,y:40},{x:40,y:60}][idx%4];
      room.players.set(ws,{id:ws.pid,x:sp.x,y:sp.y,hp:100,maxHp:100,lv:1,exp:0,expNext:50,weapon:idx%4,dead:false,name:msg.name||('P'+(idx+1))});
      ws.send(JSON.stringify({t:'joined',code,id:ws.pid}));
      bcastAll(room,{t:'lobby',players:[...room.players.values()].map(p=>({id:p.id,name:p.name}))});
    }
    else if(msg.t==='start'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      room.started=true;room.lastTick=Date.now();
      bcastAll(room,{t:'start'});
      room.tick=setInterval(()=>tickRoom(ws.roomCode),50);
    }
    else if(msg.t==='move'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      const p=room.players.get(ws);if(!p||p.dead)return;
      p.x=msg.x;p.y=msg.y;
    }
    else if(msg.t==='hit'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      if(msg.target==='boss'){
        if(room.boss&&!room.boss.dead){
          room.boss.hp-=msg.dmg;
          if(room.boss.hp<=0){room.boss.dead=true;bcastAll(room,{t:'over',win:true});clearInterval(room.tick);rooms.delete(ws.roomCode);}
          else bcastAll(room,{t:'bossHp',hp:room.boss.hp});
        }
      }else{
        const e=room.enemies.find(e=>e.id===msg.eid&&!e.dead);
        if(e){
          e.hp-=msg.dmg;
          if(e.hp<=0){
            e.dead=true;
            const h=room.players.get(ws);
            if(h){h.exp+=5;if(h.exp>=h.expNext){h.lv++;h.exp-=h.expNext;h.expNext=Math.floor(h.expNext*1.4);h.maxHp+=20;h.hp=Math.min(h.hp+30,h.maxHp);}}
            bcastAll(room,{t:'eDead',eid:e.id,x:e.x,y:e.y});
          }
        }
      }
    }
    else if(msg.t==='weapon'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      const p=room.players.get(ws);if(p)p.weapon=msg.w;
    }
  });

  ws.on('close',()=>{
    const room=rooms.get(ws.roomCode);if(!room)return;
    room.players.delete(ws);
    if(room.players.size===0){clearInterval(room.tick);rooms.delete(ws.roomCode);}
    else bcastAll(room,{t:'playerLeft',id:ws.pid});
  });
});

server.listen(PORT,()=>console.log('Dark Survival → http://localhost:'+PORT));
