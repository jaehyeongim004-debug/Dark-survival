// dark-survival.js — node dark-survival.js
const http = require('http');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 3000;

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
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
#jsKnob{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.25);border:2px solid rgba(255,255,255,0.4);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
#atkBtn{position:absolute;bottom:44px;right:80px;width:64px;height:64px;border-radius:50%;background:rgba(255,100,100,0.15);border:2px solid rgba(255,100,100,0.4);z-index:5;pointer-events:all;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;touch-action:manipulation;}
#atkBtn.pressing{background:rgba(255,100,100,0.35);}

/* Lobby */
#lobbyScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.93);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:20;padding:20px;}
h1.title{color:#ffcc00;font-size:24px;letter-spacing:5px;margin-bottom:2px;}
.sub{color:#555;font-size:11px;margin-bottom:6px;}
input.inp{background:#111;border:1px solid #333;color:#eee;padding:9px 14px;font-size:14px;font-family:monospace;outline:none;border-radius:4px;width:200px;text-align:center;}
input.inp:focus{border-color:#ffcc00;}
.btn{background:transparent;border:1px solid #ffcc00;color:#ffcc00;padding:10px 28px;font-size:13px;font-family:monospace;letter-spacing:1px;cursor:pointer;border-radius:4px;touch-action:manipulation;}
.btn:active{background:#ffcc0022;}
.btn2{border-color:#444;color:#888;}
.btn2:active{border-color:#888;color:#ccc;}
#codeDisplay{font-size:26px;color:#ffcc00;letter-spacing:8px;font-weight:bold;background:#111;padding:12px 28px;border-radius:4px;border:1px solid #333;}
#playerListEl{color:#888;font-size:11px;text-align:center;}
#playerListEl b{color:#aaffaa;}
#errMsg{color:#ff6666;font-size:11px;min-height:16px;text-align:center;}

/* Level up screen */
#lvlUpScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:15;padding:20px;}
#lvlUpTitle{color:#ffcc00;font-size:18px;letter-spacing:3px;}
#lvlUpSub{color:#888;font-size:11px;}
#traitCards{display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;}
.traitCard{background:#0d0d1e;border:1px solid #333;border-radius:8px;padding:14px 16px;cursor:pointer;touch-action:manipulation;transition:border-color .1s;}
.traitCard:active{border-color:#ffcc00;background:#141420;}
.traitName{color:#ffcc00;font-size:13px;font-weight:bold;margin-bottom:4px;}
.traitDesc{color:#888;font-size:11px;line-height:1.5;}
.traitIcon{font-size:20px;margin-bottom:6px;}

/* Game Over */
#goScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:20;}
#goTitle{font-size:24px;letter-spacing:4px;font-weight:bold;}
#goStats{font-size:12px;color:#888;text-align:center;line-height:1.9;}
#msgPop{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);font-size:16px;color:#ffcc00;pointer-events:none;z-index:6;display:none;text-align:center;font-weight:bold;}
#killFeed{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:3px;align-items:flex-end;z-index:5;pointer-events:none;}
.kf{font-size:10px;color:#ff8844;animation:kfade 2.5s forwards;}
@keyframes kfade{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
#traitList{position:absolute;bottom:84px;left:12px;font-size:9px;color:#556;pointer-events:none;z-index:5;line-height:1.8;}
#traitList span{color:#88aacc;}
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
        <div class="hs">Lv.<span id="lvTxt">1</span>&nbsp;<span id="killTxt" style="color:#ff8844;">0</span> kills</div>
      </div>
      <div id="timerBox"><div id="timerLbl">TIME</div><div id="timerVal">15:00</div></div>
      <div class="hudR">Wave <span id="waveTxt">1</span><br>Score <span id="scoreTxt">0</span></div>
    </div>
    <div id="bossBar"><div id="bossLbl">⚠ BOSS ⚠</div><div id="bossWrap"><div id="bossFill" style="width:100%"></div></div></div>
  </div>
  <div id="killFeed"></div>
  <div id="msgPop"></div>
  <div id="traitList"></div>
  <div id="jsWrap"><div id="jsBase"><div id="jsKnob"></div></div></div>
  <div id="atkBtn">⚔</div>
  <div id="wBar">
    <div class="wBtn on" id="w0" onclick="setW(0)"><div class="wIcon">⚔</div><div class="wLbl">검</div></div>
    <div class="wBtn" id="w1" onclick="setW(1)"><div class="wIcon">🔫</div><div class="wLbl">총</div></div>
    <div class="wBtn" id="w2" onclick="setW(2)"><div class="wIcon">🏹</div><div class="wLbl">활</div></div>
    <div class="wBtn" id="w3" onclick="setW(3)"><div class="wIcon">✨</div><div class="wLbl">마법</div></div>
  </div>

  <!-- Lobby -->
  <div id="lobbyScreen">
    <h1 class="title">DARK SURVIVAL</h1>
    <p class="sub">15분 생존 · 보스 처치 · 최대 4인</p>
    <input class="inp" id="nameInp" placeholder="닉네임" maxlength="10"/>
    <div style="display:flex;gap:8px;margin-top:4px;">
      <button class="btn" onclick="doCreate()">방 만들기</button>
      <button class="btn btn2" onclick="showJoin()">입장하기</button>
    </div>
    <div id="joinRow" style="display:none;flex-direction:column;align-items:center;gap:8px;margin-top:4px;">
      <input class="inp" id="codeInp" placeholder="방 코드 5자리" maxlength="5" style="letter-spacing:4px;text-transform:uppercase;"/>
      <button class="btn" onclick="doJoin()">입장</button>
    </div>
    <div id="waitRoom" style="display:none;flex-direction:column;align-items:center;gap:10px;margin-top:4px;">
      <p style="color:#555;font-size:10px;">친구에게 코드를 알려주세요</p>
      <div id="codeDisplay">----</div>
      <div id="playerListEl"></div>
      <button class="btn" id="startBtn" onclick="doStart()">▶ 게임 시작</button>
    </div>
    <div id="errMsg"></div>
  </div>

  <!-- Level Up -->
  <div id="lvlUpScreen">
    <div id="lvlUpTitle">LEVEL UP!</div>
    <div id="lvlUpSub">특성을 선택하세요</div>
    <div id="traitCards"></div>
  </div>

  <!-- Game Over -->
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
function connect(cb){ws=new WebSocket(WS_URL);ws.onopen=cb;ws.onmessage=e=>handleMsg(JSON.parse(e.data));ws.onerror=()=>showErr('서버 연결 실패');}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o));}
function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';}
function doCreate(){const name=document.getElementById('nameInp').value.trim()||'Player';connect(()=>send({t:'create',name}));}
function doJoin(){const name=document.getElementById('nameInp').value.trim()||'Player',code=document.getElementById('codeInp').value.toUpperCase();if(!code){showErr('코드 입력');return;}connect(()=>send({t:'join',code,name}));}
function doStart(){send({t:'start'});}

// ── Traits ─────────────────────────────────────────────────
const ALL_TRAITS=[
  {id:'hp',icon:'❤',name:'강철 체력',desc:'최대 HP +40, 즉시 회복'},
  {id:'spd',icon:'💨',name:'질풍',desc:'이동속도 +20%'},
  {id:'dmg',icon:'⚔',name:'살육자',desc:'모든 무기 데미지 +25%'},
  {id:'cd',icon:'⚡',name:'신속',desc:'공격속도 +20%'},
  {id:'range',icon:'🎯',name:'저격수',desc:'사거리 +30%'},
  {id:'regen',icon:'🌿',name:'재생',desc:'초당 HP 0.5 회복'},
  {id:'multishot',icon:'🔱',name:'다중사격',desc:'총/활/마법 발사체 +1'},
  {id:'magnet',icon:'🧲',name:'자석',desc:'경험치 흡수 범위 3배'},
  {id:'armor',icon:'🛡',name:'갑옷',desc:'받는 피해 -20%'},
  {id:'crit',icon:'💥',name:'치명타',desc:'30% 확률로 2배 데미지'},
];

let myTraits=[];
let myStats={hp:100,maxHp:100,spd:3.2,dmgMult:1,cdMult:1,rangeMult:1,regen:0,multishot:0,magnetRange:1,armor:0,crit:false};

function rollTraits(){
  const pool=[...ALL_TRAITS];
  const result=[];
  while(result.length<3&&pool.length>0){
    const i=Math.floor(Math.random()*pool.length);
    result.push(pool.splice(i,1)[0]);
  }
  return result;
}

function showTraitSelect(){
  if(!running)return;
  running=false; // pause
  const traits=rollTraits();
  const cards=document.getElementById('traitCards');
  cards.innerHTML='';
  for(const tr of traits){
    const div=document.createElement('div');
    div.className='traitCard';
    div.innerHTML='<div class="traitIcon">'+tr.icon+'</div><div class="traitName">'+tr.name+'</div><div class="traitDesc">'+tr.desc+'</div>';
    div.onclick=()=>pickTrait(tr);
    cards.appendChild(div);
  }
  document.getElementById('lvlUpScreen').style.display='flex';
}

function pickTrait(tr){
  document.getElementById('lvlUpScreen').style.display='none';
  running=true;
  myTraits.push(tr.id);
  applyTrait(tr.id);
  updateTraitList();
}

function applyTrait(id){
  const s=myStats;
  if(id==='hp'){s.maxHp+=40;s.hp=Math.min(s.hp+40,s.maxHp);}
  else if(id==='spd')s.spd*=1.2;
  else if(id==='dmg')s.dmgMult*=1.25;
  else if(id==='cd')s.cdMult*=0.8;
  else if(id==='range')s.rangeMult*=1.3;
  else if(id==='regen')s.regen+=0.5;
  else if(id==='multishot')s.multishot+=1;
  else if(id==='magnet')s.magnetRange*=3;
  else if(id==='armor')s.armor=Math.min(s.armor+0.2,0.6);
  else if(id==='crit')s.crit=true;
}

function updateTraitList(){
  const el=document.getElementById('traitList');
  if(myTraits.length===0){el.innerHTML='';return;}
  el.innerHTML=myTraits.map(id=>{
    const tr=ALL_TRAITS.find(t=>t.id===id);
    return tr?'<span>'+tr.icon+' '+tr.name+'</span>':'';
  }).join('<br>');
}

// ── Weapons ────────────────────────────────────────────────
const WEAPONS=[
  {name:'검',color:'#66ccff',type:'sword',baseDmg:40,baseCd:500,baseRange:90},
  {name:'총',color:'#ffee44',type:'bullet',baseDmg:28,baseCd:250,baseRange:380,spd:9},
  {name:'활',color:'#88ff88',type:'arrow',baseDmg:22,baseCd:450,baseRange:320,spd:7},
  {name:'마법',color:'#cc88ff',type:'magic',baseDmg:35,baseCd:700,baseRange:260,spd:5}
];
function getW(idx){
  const w=WEAPONS[idx],s=myStats;
  return{
    ...w,
    dmg:w.baseDmg*s.dmgMult*(s.crit&&Math.random()<0.3?2:1),
    cd:w.baseCd*s.cdMult,
    range:w.baseRange*s.rangeMult,
    count:1+(w.type!=='sword'?s.multishot:0)
  };
}

// ── Game state ─────────────────────────────────────────────
let running=false,gameTime=900,bossSpawned=false,bossAlive=false;
let kills=0,score=0,camX=0,camY=0,wIdx=0;
let myPlayer=null,allPlayers=[],enemies=[],bossData=null;
let projs=[],parts=[],orbs=[],remoteEffects=[];
let lastTime=0,jsActive=false,jsX=0,jsY=0,attackPressed=false,lastShot=0;

function handleMsg(msg){
  if(msg.t==='created'){myId=msg.id;isHost=true;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='joined'){myId=msg.id;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('startBtn').style.display='none';document.getElementById('waitRoom').style.display='flex';}
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
  // Remote player attack effects
  else if(msg.t==='fx'){remoteEffects.push(msg);}
}

function startGame(){
  document.getElementById('lobbyScreen').style.display='none';
  running=true;gameTime=900;bossSpawned=false;bossAlive=false;
  kills=0;score=0;projs=[];parts=[];orbs=[];remoteEffects=[];myTraits=[];
  myStats={hp:100,maxHp:100,spd:3.2,dmgMult:1,cdMult:1,rangeMult:1,regen:0,multishot:0,magnetRange:1,armor:0,crit:false};
  myPlayer={x:0,y:0,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false};
  lastTime=performance.now();
  requestAnimationFrame(loop);
}

function applyState(msg){
  allPlayers=msg.players||[];enemies=msg.enemies||[];
  bossData=msg.boss||null;gameTime=msg.gt??gameTime;
  const me=allPlayers.find(p=>p.id===myId);
  if(me&&myPlayer){
    // sync server HP (authoritative for damage taken)
    myPlayer.hp=me.hp*(1-myStats.armor); // armor applied client-side display
    myPlayer.maxHp=myStats.maxHp;
    myPlayer.lv=me.lv;myPlayer.dead=me.dead;
    myPlayer.exp=me.exp;myPlayer.expNext=me.expNext;
    // check level up
    if(me.lvUp){showTraitSelect();}
  }
  if(me&&me.dead&&running){running=false;endGame(false);}
}

function setW(i){wIdx=i;for(let j=0;j<4;j++)document.getElementById('w'+j).className='wBtn'+(j===i?' on':'');send({t:'weapon',w:i});}

// ── Joystick ───────────────────────────────────────────────
const jsBase=document.getElementById('jsBase'),jsKnob=document.getElementById('jsKnob');
let jsCX=0,jsCY=0;
function jsStart(e){e.preventDefault();const t=e.touches?e.touches[0]:e,r=jsBase.getBoundingClientRect();jsCX=r.left+r.width/2;jsCY=r.top+r.height/2;jsActive=true;jsMove(e);}
function jsMove(e){if(!jsActive)return;e.preventDefault();const t=e.touches?e.touches[0]:e;let dx=t.clientX-jsCX,dy=t.clientY-jsCY,d=Math.sqrt(dx*dx+dy*dy),max=30;if(d>max){dx=dx/d*max;dy=dy/d*max;}jsX=dx/max;jsY=dy/max;jsKnob.style.transform='translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))';}
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

// ── Shooting ───────────────────────────────────────────────
function tryShoot(){
  if(!myPlayer||myPlayer.dead)return;
  const now=performance.now(),w=getW(wIdx);
  if(now-lastShot<w.cd)return;
  lastShot=now;
  let target=null,minD=Infinity;
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minD){minD=d;target=e;}}
  let tx,ty;
  if(target&&minD<w.range*1.2){tx=target.x;ty=target.y;}
  else if(jsActive){tx=myPlayer.x+jsX*200;ty=myPlayer.y+jsY*200;}
  else{tx=mouseX+camX-W/2;ty=mouseY+camY-H/2;}
  const ang=Math.atan2(ty-myPlayer.y,tx-myPlayer.x);
  if(w.type==='sword'){doSword(ang,w);return;}
  for(let i=0;i<w.count;i++){
    const a=ang+(i-(w.count-1)/2)*0.28;
    projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*w.spd,vy:Math.sin(a)*w.spd,dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:w.type==='magic'?7:4,enemy:false});
  }
  // broadcast attack FX to others
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:tx,ay:ty,w:wIdx,cnt:w.count});
}

function doSword(ang,w){
  for(let a=ang-0.9;a<=ang+0.9;a+=0.2)for(let r=22;r<w.range;r+=14)parts.push({x:myPlayer.x+Math.cos(a)*r,y:myPlayer.y+Math.sin(a)*r,vx:0,vy:0,life:160,maxLife:160,r:5,color:'#66ccff'});
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){
    const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<w.range){const ea=Math.atan2(dy,dx),diff=Math.abs(((ea-ang)+Math.PI*3)%(Math.PI*2)-Math.PI);if(diff<1.1)reportHit(e.id==='boss'?'boss':e.id,w.dmg);}
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:myPlayer.x+Math.cos(ang)*60,ay:myPlayer.y+Math.sin(ang)*60,w:0,cnt:1});
}

function reportHit(id,dmg){id==='boss'?send({t:'hit',target:'boss',dmg}):send({t:'hit',eid:id,dmg});}

// ── Boss patterns ──────────────────────────────────────────
function doBossPat(msg){const{i,bx,by,ang,phase}=msg;[bossSpiral,bossBlast,bossCross,bossRapid,bossRing][Math.min(i,4)](bx,by,ang);}
function mkBB(bx,by,vx,vy,dmg,col,r){projs.push({x:bx,y:by,vx,vy,dmg,range:420,traveled:0,gone:false,color:col,r,enemy:true});}
function bossSpiral(bx,by,ang){for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*3.8,Math.sin(a)*3.8,16,'#ff6600',8);}}
function bossBlast(bx,by){for(let i=0;i<18;i++){const a=(i/18)*Math.PI*2;mkBB(bx,by,Math.cos(a)*2.2,Math.sin(a)*2.2,20,'#ff2200',10);}spawnParts(bx,by,'#ff6600',14);}
function bossCross(bx,by){[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]].forEach(([dx,dy])=>{for(let n=0;n<3;n++)setTimeout(()=>mkBB(bx,by,dx*5,dy*5,18,'#cc44ff',6),n*180);});}
function bossRapid(bx,by){if(!myPlayer)return;for(let n=0;n<6;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.5;mkBB(bx,by,Math.cos(a)*6,Math.sin(a)*6,14,'#ff4444',5);},n*100);}
function bossRing(bx,by,ang){for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2+ang*2,s=2+Math.random()*2;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,22,'#ffaa00',9);}}

// ── Remote FX ─────────────────────────────────────────────
function spawnRemoteFx(fx){
  const wc=WEAPONS[fx.w]||WEAPONS[0];
  if(fx.w===0){
    // sword swing
    const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);
    for(let a=ang-0.9;a<=ang+0.9;a+=0.25)for(let r=22;r<80;r+=16)parts.push({x:fx.x+Math.cos(a)*r,y:fx.y+Math.sin(a)*r,vx:0,vy:0,life:140,maxLife:140,r:4,color:'#66ccff88'});
  }else{
    // projectile
    const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);
    const cnt=fx.cnt||1;
    for(let i=0;i<cnt;i++){
      const a=ang+(i-(cnt-1)/2)*0.28;
      projs.push({x:fx.x,y:fx.y,vx:Math.cos(a)*(WEAPONS[fx.w].spd||7),vy:Math.sin(a)*(WEAPONS[fx.w].spd||7),dmg:0,range:WEAPONS[fx.w].baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:fx.w===3?6:3,enemy:false,visual:true});
    }
  }
}

// ── Update ─────────────────────────────────────────────────
let regenTimer=0;
function update(dt){
  if(!running||!myPlayer||myPlayer.dead)return;

  // regen
  if(myStats.regen>0){regenTimer+=dt;if(regenTimer>1000){regenTimer=0;myPlayer.hp=Math.min(myPlayer.hp+myStats.regen,myPlayer.maxHp);}}

  // move
  let mx=jsX,my=jsY;
  if(keys['w']||keys['arrowup'])my=-1;if(keys['s']||keys['arrowdown'])my=1;
  if(keys['a']||keys['arrowleft'])mx=-1;if(keys['d']||keys['arrowright'])mx=1;
  const ml=Math.sqrt(mx*mx+my*my)||1;
  if(mx||my){myPlayer.x+=mx/ml*myStats.spd*(dt/16);myPlayer.y+=my/ml*myStats.spd*(dt/16);}

  // send position every frame (server does throttle)
  send({t:'move',x:Math.round(myPlayer.x),y:Math.round(myPlayer.y)});

  if(attackPressed||mouseDown||keys[' ']||keys['f']||(enemies.length>0&&running))tryShoot();

  camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;

  // process remote FX queue
  for(const fx of remoteEffects)spawnRemoteFx(fx);
  remoteEffects=[];

  const spF=dt/16;
  // projectiles
  for(const p of projs){
    if(p.gone)continue;
    p.x+=p.vx*spF;p.y+=p.vy*spF;
    p.traveled+=Math.sqrt(p.vx*p.vx+p.vy*p.vy)*spF;
    if(p.traveled>p.range){p.gone=true;continue;}
    if(p.visual)continue; // visual-only projectile from other player
    if(!p.enemy){
      for(const e of enemies){const dx=p.x-e.x,dy=p.y-e.y;if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){reportHit(e.id,p.dmg);spawnParts(p.x,p.y,p.color,4);p.gone=true;break;}}
      if(!p.gone&&bossData){const dx=p.x-bossData.x,dy=p.y-bossData.y;if(Math.sqrt(dx*dx+dy*dy)<38+p.r){reportHit('boss',p.dmg);spawnParts(p.x,p.y,p.color,5);p.gone=true;}}
    }else{
      if(myPlayer&&!myPlayer.dead){const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;if(Math.sqrt(dx*dx+dy*dy)<14){const dmg=p.dmg*(1-myStats.armor);myPlayer.hp-=dmg;if(myPlayer.hp<0)myPlayer.hp=0;spawnParts(p.x,p.y,p.color,4);p.gone=true;}}
    }
  }
  projs=projs.filter(p=>!p.gone);

  // particles
  for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
  parts=parts.filter(p=>p.life>0);
  if(parts.length>500)parts=parts.slice(-500);

  // orbs — magnet range from trait
  const magnetR=28*myStats.magnetRange,pullR=100*myStats.magnetRange;
  for(const o of orbs){
    if(o.col)continue;
    const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<magnetR){o.col=true;score+=5;}
    else if(d<pullR){o.x-=dx/d*3;o.y-=dy/d*3;}
  }
  orbs=orbs.filter(o=>!o.col);

  // HUD update
  const me=allPlayers.find(p=>p.id===myId)||myPlayer;
  const hpPct=Math.max(0,(myPlayer.hp/myPlayer.maxHp)*100);
  document.getElementById('hpFill').style.width=hpPct+'%';
  document.getElementById('hpTxt').textContent=Math.max(0,Math.floor(myPlayer.hp));
  document.getElementById('expFill').style.width=((me.exp||0)/(me.expNext||50)*100)+'%';
  document.getElementById('lvTxt').textContent=me.lv||1;
  document.getElementById('killTxt').textContent=kills;
  document.getElementById('scoreTxt').textContent=score;
  document.getElementById('waveTxt').textContent=Math.max(1,Math.floor((900-gameTime)/90)+1);
  const mins=Math.floor(gameTime/60),secs=Math.floor(gameTime%60);
  document.getElementById('timerVal').textContent=mins+':'+(secs<10?'0':'')+secs;
  document.getElementById('timerVal').style.color=gameTime<60?'#ff4444':'#ffcc00';
  if(bossData)document.getElementById('bossFill').style.width=(bossData.hp/bossData.maxHp*100)+'%';
}

// ── Draw ───────────────────────────────────────────────────
function draw(){
  ctx.clearRect(0,0,W,H);
  const ox=W/2-camX,oy=H/2-camY;
  ctx.save();ctx.translate(ox,oy);
  drawGrid();drawOrbs();drawParts();drawEnemies();
  if(bossData)drawBoss();
  drawOthers();
  if(myPlayer&&!myPlayer.dead)drawMe();
  drawProjs();
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
  ctx.save();
  ctx.shadowColor='#4488ff';ctx.shadowBlur=14;
  ctx.fillStyle='#4488ff';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle='#aaccff';ctx.beginPath();ctx.arc(x-2,y-3,4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

const PC=['#66aaff','#ff8866','#88ff88','#ffcc44'];
function drawOthers(){
  allPlayers.forEach((p,i)=>{
    if(p.id===myId||p.dead)return;
    const c=PC[i%4];
    ctx.save();ctx.shadowColor=c;ctx.shadowBlur=10;
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle='#ffffffcc';ctx.font='9px monospace';ctx.textAlign='center';
    ctx.fillText(p.name||'?',p.x,p.y-16);
    ctx.restore();
  });
}

// Monster types: m=melee, r=ranged, f=fast, t=tank
const E_STYLES={
  m:{fill:'#bb1111',eye:'#ff5555',shadow:'#ff2222'},
  r:{fill:'#bb4411',eye:'#ffaa44',shadow:'#ff8822'},
  f:{fill:'#1144bb',eye:'#44aaff',shadow:'#2266ff'},
  t:{fill:'#226622',eye:'#44ff44',shadow:'#44aa44'},
};
function drawEnemies(){
  for(const e of enemies){
    const st=E_STYLES[e.type]||E_STYLES.m;
    const r=e.r||10;
    ctx.save();
    ctx.shadowColor=st.shadow;ctx.shadowBlur=6;
    ctx.fillStyle=st.fill;ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle=st.eye;
    ctx.beginPath();ctx.arc(e.x-r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(e.x+r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
    // hp bar
    ctx.fillStyle='#220000';ctx.fillRect(e.x-r,e.y-r-8,r*2,3);
    ctx.fillStyle=st.shadow;ctx.fillRect(e.x-r,e.y-r-8,r*2*(e.hp/e.maxHp),3);
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
  ctx.fillStyle='#ffcccc';ctx.font='bold 10px monospace';ctx.textAlign='center';
  ctx.fillText('BOSS',b.x,b.y-44);
  ctx.restore();
}

function drawProjs(){
  for(const p of projs){
    ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=p.visual?4:8;
    ctx.globalAlpha=p.visual?0.6:1;
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

function drawParts(){
  for(const p of parts){
    const a=p.life/p.maxLife;
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*a,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

function drawOrbs(){
  const t=performance.now()*0.004;
  for(const o of orbs){
    if(o.col)continue;
    ctx.save();ctx.shadowColor='#44aaff';ctx.shadowBlur=8;
    ctx.fillStyle='#2266cc';ctx.beginPath();ctx.arc(o.x,o.y+Math.sin(t+o.x)*2,5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

function spawnParts(x,y,color,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*2.5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:350,maxLife:350,r:3,color});}}

let msgTimer=0;
function showPop(txt,dur){const el=document.getElementById('msgPop');el.textContent=txt;el.style.display='block';msgTimer=dur||1400;}
function addKf(txt){const f=document.getElementById('killFeed'),el=document.createElement('div');el.className='kf';el.textContent=txt;f.appendChild(el);setTimeout(()=>el.remove(),2600);while(f.children.length>4)f.removeChild(f.firstChild);}
function endGame(win){running=false;const el=document.getElementById('goScreen');el.style.display='flex';document.getElementById('goTitle').textContent=win?'BOSS DEFEATED!':'GAME OVER';document.getElementById('goTitle').style.color=win?'#ffcc00':'#ff4444';const t=Math.floor(900-gameTime);document.getElementById('goStats').innerHTML='생존: '+Math.floor(t/60)+':'+(String(t%60).padStart(2,'0'))+'<br>처치: '+kills+'<br>점수: '+score+'<br>특성: '+(myTraits.length>0?myTraits.map(id=>ALL_TRAITS.find(t=>t.id===id)?.name||id).join(', '):'없음');}

function loop(ts){
  const dt=Math.min(ts-lastTime,50);lastTime=ts;
  if(msgTimer>0){msgTimer-=dt;if(msgTimer<=0)document.getElementById('msgPop').style.display='none';}
  if(running){update(dt);draw();}
  else if(myPlayer&&!myPlayer.dead&&document.getElementById('lvlUpScreen').style.display==='flex'){draw();}
  requestAnimationFrame(loop);
}
window.addEventListener('resize',()=>{W=G.clientWidth;H=G.clientHeight;canvas.width=W;canvas.height=H;});
</script>
</body>
</html>`;

// ── HTTP ───────────────────────────────────────────────────
const server=http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(HTML);
});

// ── WebSocket ──────────────────────────────────────────────
const wss=new WebSocketServer({server});
const rooms=new Map();

function genCode(){return Math.random().toString(36).substr(2,5).toUpperCase();}
function bcast(room,msg,except){const d=JSON.stringify(msg);room.players.forEach((_,ws)=>{if(ws!==except&&ws.readyState===1)ws.send(d);});}
function bcastAll(room,msg){bcast(room,msg,null);}

// Monster types with distinct stats
const ETYPES=[
  {type:'m',spd:0.9,hpMult:1.0,r:10},   // melee - normal
  {type:'r',spd:0.7,hpMult:0.8,r:9},    // ranged - shoots
  {type:'f',spd:1.8,hpMult:0.6,r:8},    // fast - speedy
  {type:'t',spd:0.5,hpMult:2.5,r:15},   // tank - big HP
];

function spawnEnemies(room){
  if(room.bossSpawned)return;
  const tf=1+(900-room.gameTime)/900*3;
  const cnt=Math.max(1,Math.floor(tf*1.2));
  const arr=[...room.players.values()].filter(p=>!p.dead);
  if(!arr.length)return;
  const ref=arr[Math.floor(Math.random()*arr.length)];
  for(let i=0;i<cnt;i++){
    const a=Math.random()*Math.PI*2,r=350+Math.random()*80;
    // weighted random type: 50% melee, 20% ranged, 20% fast, 10% tank
    const roll=Math.random();
    const et=roll<0.5?ETYPES[0]:roll<0.7?ETYPES[1]:roll<0.9?ETYPES[2]:ETYPES[3];
    const baseHp=20+Math.random()*15*tf;
    room.enemies.push({id:room.eid++,x:ref.x+Math.cos(a)*r,y:ref.y+Math.sin(a)*r,hp:baseHp*et.hpMult,maxHp:baseHp*et.hpMult,spd:et.spd,type:et.type,r:et.r,dead:false,lastShot:0});
  }
  if(room.enemies.length>130)room.enemies=room.enemies.filter(e=>!e.dead).slice(-130);
}

function tickRoom(code){
  const room=rooms.get(code);
  if(!room||!room.started)return;
  const now=Date.now();
  const dt=Math.min((now-room.lastTick)/1000,0.1);
  room.lastTick=now;
  room.gameTime-=dt;
  if(room.gameTime<0)room.gameTime=0;

  if(!room.bossSpawned){room.spawnT=(room.spawnT||0)+dt;if(room.spawnT>0.8){room.spawnT=0;spawnEnemies(room);}}

  if(!room.bossSpawned&&room.gameTime<=0){
    room.bossSpawned=true;
    const arr=[...room.players.values()];
    const ref=arr[0]||{x:0,y:0};
    room.boss={hp:2500,maxHp:2500,x:ref.x+300,y:ref.y,r:38,dead:false,ang:0,phase:1};
    room.enemies=[];
    bcastAll(room,{t:'bossSpawn',boss:room.boss});
  }

  const arr=[...room.players.values()];
  for(const e of room.enemies){
    if(e.dead)continue;
    let near=null,md=Infinity;
    for(const p of arr){if(p.dead)continue;const dx=p.x-e.x,dy=p.y-e.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;near=p;}}
    if(!near)continue;
    const dx=near.x-e.x,dy=near.y-e.y,d=Math.sqrt(dx*dx+dy*dy)||1;
    e.x+=dx/d*e.spd*dt*60;e.y+=dy/d*e.spd*dt*60;
    // contact damage
    if(d<e.r+14){near.hp-=0.35*dt*60;if(near.hp<0)near.hp=0;}
    // ranged attack
    if(e.type==='r'&&d>80&&d<220){
      e.lastShot=(e.lastShot||0)+dt;
      if(e.lastShot>2.2){e.lastShot=0;bcastAll(room,{t:'pat',i:-1,bx:e.x,by:e.y,ang:Math.atan2(dy,dx),phase:0,etype:'r'});}
    }
  }

  if(room.boss&&!room.boss.dead){
    const b=room.boss;
    b.ang+=dt*1.5;
    if(b.hp<1250&&b.phase===1){b.phase=2;bcastAll(room,{t:'phase2'});}
    let near=null,md=Infinity;
    for(const p of arr){if(p.dead)continue;const dx=p.x-b.x,dy=p.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<md){md=d;near=p;}}
    if(near){
      const dx=near.x-b.x,dy=near.y-b.y,d=Math.sqrt(dx*dx+dy*dy)||1;
      b.x+=dx/d*1.5*dt*60;b.y+=dy/d*1.5*dt*60;
      if(d<b.r+14){near.hp-=0.8*dt*60*b.phase;if(near.hp<0)near.hp=0;}
    }
    room.patT=(room.patT||0)+dt;
    if(room.patT>(b.phase===1?1.8:1.2)){room.patT=0;bcastAll(room,{t:'pat',i:(room.patI||0)%(b.phase===1?3:5),bx:b.x,by:b.y,ang:b.ang,phase:b.phase});room.patI=(room.patI||0)+1;}
  }

  // sync ~20hz
  room.syncT=(room.syncT||0)+dt;
  if(room.syncT>0.05){
    room.syncT=0;
    const ps=[];
    room.players.forEach(p=>ps.push({id:p.id,x:Math.round(p.x),y:Math.round(p.y),hp:Math.round(p.hp),maxHp:p.maxHp,lv:p.lv,dead:p.dead,name:p.name,exp:p.exp,expNext:p.expNext,lvUp:p.lvUp}));
    // clear lvUp flag after sending
    room.players.forEach(p=>{if(p.lvUp)p.lvUp=false;});
    bcastAll(room,{
      t:'state',players:ps,
      enemies:room.enemies.filter(e=>!e.dead).map(e=>({id:e.id,x:Math.round(e.x),y:Math.round(e.y),hp:Math.round(e.hp),maxHp:Math.round(e.maxHp),type:e.type,r:e.r})),
      boss:room.boss&&!room.boss.dead?{x:Math.round(room.boss.x),y:Math.round(room.boss.y),hp:room.boss.hp,maxHp:room.boss.maxHp,phase:room.boss.phase,ang:room.boss.ang}:null,
      gt:room.gameTime
    });
  }

  const alive=arr.filter(p=>!p.dead);
  if(alive.length===0&&arr.length>0){bcastAll(room,{t:'over',win:false});clearInterval(room.tick);rooms.delete(code);}
}

wss.on('connection',ws=>{
  ws.pid=Math.random().toString(36).substr(2,6);ws.roomCode=null;

  ws.on('message',raw=>{
    let msg;try{msg=JSON.parse(raw);}catch{return;}

    if(msg.t==='create'){
      const code=genCode();
      rooms.set(code,{players:new Map(),enemies:[],boss:null,gameTime:900,started:false,bossSpawned:false,eid:0,lastTick:Date.now()});
      ws.roomCode=code;
      rooms.get(code).players.set(ws,{id:ws.pid,x:0,y:0,hp:100,maxHp:100,lv:1,exp:0,expNext:50,weapon:0,dead:false,name:msg.name||'Player',lvUp:false});
      ws.send(JSON.stringify({t:'created',code,id:ws.pid}));
      bcastAll(rooms.get(code),{t:'lobby',players:[...rooms.get(code).players.values()].map(p=>({id:p.id,name:p.name}))});
    }
    else if(msg.t==='join'){
      const code=(msg.code||'').toUpperCase(),room=rooms.get(code);
      if(!room){ws.send(JSON.stringify({t:'err',msg:'방을 찾을 수 없어요'}));return;}
      if(room.started){ws.send(JSON.stringify({t:'err',msg:'이미 시작된 방이에요'}));return;}
      ws.roomCode=code;
      const idx=room.players.size,sp=[{x:0,y:0},{x:60,y:-40},{x:-60,y:40},{x:40,y:60}][idx%4];
      room.players.set(ws,{id:ws.pid,x:sp.x,y:sp.y,hp:100,maxHp:100,lv:1,exp:0,expNext:50,weapon:idx%4,dead:false,name:msg.name||('P'+(idx+1)),lvUp:false});
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
            if(h){
              h.exp+=5;
              if(h.exp>=h.expNext){h.lv++;h.exp-=h.expNext;h.expNext=Math.floor(h.expNext*1.4);h.maxHp+=20;h.hp=Math.min(h.hp+30,h.maxHp);h.lvUp=true;}
            }
            bcastAll(room,{t:'eDead',eid:e.id,x:e.x,y:e.y});
          }
        }
      }
    }
    else if(msg.t==='weapon'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      const p=room.players.get(ws);if(p)p.weapon=msg.w;
    }
    // broadcast attack fx to OTHER players only
    else if(msg.t==='atk'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      bcast(room,{t:'fx',x:msg.x,y:msg.y,ax:msg.ax,ay:msg.ay,w:msg.w,cnt:msg.cnt},ws);
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
