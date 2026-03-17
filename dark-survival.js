// dark-survival.js — node dark-survival.js
const http = require('http');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 8080;

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Dark Survival</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:#000;overflow:hidden;font-family:monospace;}
#G{position:relative;width:100vw;height:100vh;background:#080810;overflow:hidden;touch-action:none;}
canvas{position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;}
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
#stageBox{font-size:9px;color:#888;text-align:center;margin-top:2px;}
#stageVal{color:#88ccff;font-weight:bold;}
.hudR{text-align:right;font-size:10px;color:#888;}
.hudR span{color:#ccc;}
#bossBar{display:none;padding:4px 12px;text-align:center;}
#bossLbl{font-size:9px;color:#ff4444;letter-spacing:2px;margin-bottom:3px;animation:bp 1s infinite alternate;}
@keyframes bp{from{opacity:.6}to{opacity:1}}
#bossWrap{height:9px;background:#1a0000;border:1px solid #880000;border-radius:2px;overflow:hidden;max-width:280px;margin:0 auto;}
#bossFill{height:100%;background:#ff3300;transition:width .1s;}

/* Joystick & buttons */
#jsWrap{position:absolute;bottom:30px;left:30px;z-index:5;pointer-events:all;}
#jsBase{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.15);position:relative;touch-action:none;}
#jsKnob{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.25);border:2px solid rgba(255,255,255,0.4);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
#atkBtn{position:absolute;bottom:44px;right:80px;width:64px;height:64px;border-radius:50%;background:rgba(255,100,100,0.15);border:2px solid rgba(255,100,100,0.4);z-index:5;pointer-events:all;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;touch-action:manipulation;}
#atkBtn.pressing{background:rgba(255,100,100,0.35);}

/* Lobby */
#lobbyScreen{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:200;padding:20px;overflow-y:auto;}
h1.title{color:#ffcc00;font-size:24px;letter-spacing:5px;margin-bottom:2px;}
.sub{color:#555;font-size:11px;margin-bottom:6px;}
input.inp{background:#111;border:1px solid #333;color:#eee;padding:9px 14px;font-size:16px;font-family:monospace;outline:none;border-radius:4px;width:200px;text-align:center;pointer-events:all;-webkit-user-select:text;user-select:text;}
input.inp:focus{border-color:#ffcc00;}
.btn{background:transparent;border:1px solid #ffcc00;color:#ffcc00;padding:12px 32px;font-size:15px;font-family:monospace;letter-spacing:1px;cursor:pointer;border-radius:4px;touch-action:manipulation;pointer-events:all;-webkit-tap-highlight-color:rgba(255,204,0,0.2);min-height:48px;min-width:100px;}
.btn:active{background:#ffcc0033;}
.btn2{border-color:#444;color:#888;}
.btn2:active{border-color:#888;color:#ccc;}
#codeDisplay{font-size:26px;color:#ffcc00;letter-spacing:8px;font-weight:bold;background:#111;padding:12px 28px;border-radius:4px;border:1px solid #333;}
#playerListEl{color:#888;font-size:11px;text-align:center;}
#playerListEl b{color:#aaffaa;}
#errMsg{color:#ff4444;font-size:12px;min-height:20px;text-align:center;font-weight:bold;background:#1a0000;padding:6px 12px;border-radius:4px;word-break:break-all;max-width:300px;}

/* Class Select */
#classScreen{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:200;padding:20px;overflow-y:auto;}
#classTitle{color:#ffcc00;font-size:18px;letter-spacing:3px;margin-bottom:4px;}
#classSub{color:#666;font-size:11px;margin-bottom:6px;}
#classCards{display:flex;flex-direction:column;gap:10px;width:100%;max-width:340px;}
.classCard{background:#0a0a1a;border:1px solid #2a2a3a;border-radius:10px;padding:14px 16px;cursor:pointer;touch-action:manipulation;transition:border-color .15s,background .15s;display:flex;align-items:center;gap:14px;min-height:60px;}
.classCard:active,.classCard.sel{border-color:#ffcc00;background:#12120a;}
.classIcon{font-size:28px;min-width:36px;text-align:center;}
.classInfo{flex:1;}
.className{color:#ffcc00;font-size:14px;font-weight:bold;margin-bottom:3px;}
.classDesc{color:#777;font-size:10px;line-height:1.5;}
.classStat{color:#88aacc;font-size:9px;margin-top:4px;}
#classReady{margin-top:4px;}

/* Level up */
#lvlUpScreen{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:200;padding:20px;}
#lvlUpTitle{color:#ffcc00;font-size:18px;letter-spacing:3px;}
#lvlUpSub{color:#888;font-size:11px;}
#traitCards{display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;}
.traitCard{background:#0d0d1e;border:1px solid #333;border-radius:8px;padding:14px 16px;cursor:pointer;touch-action:manipulation;transition:border-color .1s;pointer-events:all;}
.traitCard:active{border-color:#ffcc00;background:#141420;}
.traitName{color:#ffcc00;font-size:13px;font-weight:bold;margin-bottom:4px;}
.traitDesc{color:#888;font-size:11px;line-height:1.5;}
.traitIcon{font-size:20px;margin-bottom:6px;}

/* Stage clear */
#stageClearScreen{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:200;}
#stageClearTitle{font-size:22px;color:#ffcc00;letter-spacing:4px;}
#stageClearSub{font-size:12px;color:#888;text-align:center;}
#stageClearTimer{font-size:28px;color:#fff;font-weight:bold;}

/* Game Over */
#goScreen{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:200;}
#goTitle{font-size:24px;letter-spacing:4px;font-weight:bold;}
#goStats{font-size:12px;color:#888;text-align:center;line-height:1.9;}

#msgPop{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);font-size:16px;color:#ffcc00;pointer-events:none;z-index:6;display:none;text-align:center;font-weight:bold;text-shadow:0 0 12px #ffcc0088;}
#killFeed{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:3px;align-items:flex-end;z-index:5;pointer-events:none;}
.kf{font-size:10px;color:#ff8844;animation:kfade 2.5s forwards;}
@keyframes kfade{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
#traitList{position:absolute;bottom:84px;left:12px;font-size:9px;color:#556;pointer-events:none;z-index:5;line-height:1.8;}
#traitList span{color:#88aacc;}
#classTag{position:absolute;top:48px;left:12px;font-size:9px;color:#888;pointer-events:none;z-index:5;}
#classTag span{color:#ffcc00;}
</style>
</head>
<body>
<div id="G">
  <canvas id="c"></canvas>
  <div id="hud" style="display:none;">
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
      <div id="timerBox">
        <div id="timerLbl">TIME</div>
        <div id="timerVal">05:00</div>
        <div id="stageBox">STAGE <span id="stageVal">1</span></div>
      </div>
      <div class="hudR">Wave <span id="waveTxt">1</span><br>Score <span id="scoreTxt">0</span></div>
    </div>
    <div id="bossBar"><div id="bossLbl" id="bossLblEl">⚠ BOSS ⚠</div><div id="bossWrap"><div id="bossFill" style="width:100%"></div></div></div>
  </div>
  <div id="killFeed"></div>
  <div id="msgPop"></div>
  <div id="traitList"></div>
  <div id="classTag"></div>
  <div id="jsWrap" style="display:none;"><div id="jsBase"><div id="jsKnob"></div></div></div>
  <div id="atkBtn" style="display:none;">⚔</div>

</div><div id="lobbyScreen">
    <h1 class="title">DARK SURVIVAL</h1>
    <p class="sub">3스테이지 · 보스 처치 · 최대 4인</p>
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

<div id="classScreen">
    <div id="classTitle">직업 선택</div>
    <div id="classSub">전투 스타일을 고르세요</div>
    <div id="classCards">
      <div class="classCard" onclick="pickClass('warrior')">
        <div class="classIcon">⚔️</div>
        <div class="classInfo">
          <div class="className">검사</div>
          <div class="classDesc">강력한 근접 공격으로 적을 베어냅니다.<br>높은 체력과 광역 검격이 특기.</div>
          <div class="classStat">HP: ●●●●○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●○○○</div>
        </div>
      </div>
      <div class="classCard" onclick="pickClass('gunner')">
        <div class="classIcon">🔫</div>
        <div class="classInfo">
          <div class="className">총사</div>
          <div class="classDesc">강력한 저격으로 원거리 적을 처치합니다.<br>느리지만 한방이 강한 저격총.</div>
          <div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●●● &nbsp; 속도: ●●●○○</div>
        </div>
      </div>
      <div class="classCard" onclick="pickClass('mage')">
        <div class="classIcon">✨</div>
        <div class="classInfo">
          <div class="className">마법사</div>
          <div class="classDesc">광역 마법으로 여러 적을 동시에 처리합니다.<br>낮은 HP지만 강력한 범위 공격.</div>
          <div class="classStat">HP: ●○○○○ &nbsp; 공격: ●●●●●&nbsp; 속도: ●●●○○</div>
        </div>
      </div>
      <div class="classCard" onclick="pickClass('assassin')">
        <div class="classIcon">🗡️</div>
        <div class="classInfo">
          <div class="className">암살자</div>
          <div class="classDesc">빠른 이동속도와 높은 치명타로 순식간에 처치합니다.<br>리스크와 리워드가 모두 높음.</div>
          <div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●●●●</div>
        </div>
      </div>
    </div>
    <button class="btn" id="classReady" style="display:none;" onclick="doReady()">준비 완료</button>
  </div>

<div id="lvlUpScreen">
    <div id="lvlUpTitle">LEVEL UP!</div>
    <div id="lvlUpSub">특성을 선택하세요</div>
    <div id="traitCards"></div>
  </div>

<div id="stageClearScreen">
    <div id="stageClearTitle">STAGE CLEAR!</div>
    <div id="stageClearSub"></div>
    <div id="stageClearTimer">3</div>
  </div>

<div id="goScreen">
    <div id="goTitle"></div>
    <div id="goStats"></div>
    <button class="btn" style="margin-top:8px;" onclick="location.reload()">다시 시작</button>
  </div>

<script>
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d'),G=document.getElementById('G');
let W=G.clientWidth,H=G.clientHeight;
canvas.width=W;canvas.height=H;

const WS_URL=(location.protocol==='https:'?'wss://':'ws://')+location.host;
let ws=null,myId=null,isHost=false,myClass=null,classReady=false;
function connect(cb){
  ws=new WebSocket(WS_URL);
  ws.onopen=cb;
  ws.onmessage=e=>handleMsg(JSON.parse(e.data));
  ws.onerror=()=>showErr('서버 연결 실패');
  ws.onclose=()=>{if(!myId)showErr('연결 끊김 - 새로고침 해주세요');};
}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o));}
function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';}
function doCreate(){const name=document.getElementById('nameInp').value.trim()||'Player';connect(()=>send({t:'create',name}));}
function doJoin(){const name=document.getElementById('nameInp').value.trim()||'Player',code=document.getElementById('codeInp').value.toUpperCase();if(!code){showErr('코드 입력');return;}connect(()=>send({t:'join',code,name}));}
function doStart(){send({t:'start'});}

// ── Classes ──────────────────────────────────────────────────
const CLASSES={
  warrior:{name:'검사',icon:'⚔️',color:'#66ccff',
    stats:{hp:150,maxHp:150,spd:2.6,dmgMult:1.2,cdMult:1,rangeMult:1,regen:0.3,multishot:0,magnetRange:1,armor:0.1,crit:false},
    weapon:{name:'대검',type:'sword',baseDmg:55,baseCd:480,baseRange:100,color:'#66ccff'}
  },
  gunner:{name:'총사',icon:'🔫',color:'#ffee44',
    // 저격총: 공속 느림, 한방 강함, 사거리 매우 김
    stats:{hp:80,maxHp:80,spd:3.2,dmgMult:1,cdMult:1,rangeMult:1,regen:0,multishot:0,magnetRange:1,armor:0,crit:false},
    weapon:{name:'저격총',type:'bullet',baseDmg:90,baseCd:1100,baseRange:600,color:'#ffee44',spd:14}
  },
  mage:{name:'마법사',icon:'✨',color:'#cc88ff',
    // 마법: 폭발 광역, multishot은 폭발 반경 증가로 사용
    stats:{hp:65,maxHp:65,spd:3.0,dmgMult:1.15,cdMult:1,rangeMult:1.1,regen:0,multishot:0,magnetRange:1,armor:0,crit:false},
    weapon:{name:'마법',type:'magic',baseDmg:45,baseCd:900,baseRange:300,color:'#cc88ff',spd:5,explodeR:60}
  },
  assassin:{name:'암살자',icon:'🗡️',color:'#ff88aa',
    stats:{hp:85,maxHp:85,spd:4.2,dmgMult:1.1,cdMult:0.9,rangeMult:1,regen:0,multishot:0,magnetRange:1,armor:0,crit:true},
    weapon:{name:'단검',type:'dagger',baseDmg:30,baseCd:280,baseRange:75,color:'#ff88aa',spd:12}
  }
};
let myTraits=[];
let myStats=null;
let myWeapon=null;

function pickClass(cls){
  myClass=cls;
  document.querySelectorAll('.classCard').forEach(el=>el.classList.remove('sel'));
  event.currentTarget.classList.add('sel');
  document.getElementById('classReady').style.display='block';
  // update attack button icon
  const icons={warrior:'⚔',gunner:'🔫',mage:'✨',assassin:'🗡'};
  document.getElementById('atkBtn').textContent=icons[cls]||'⚔';
}

function doReady(){
  if(!myClass)return;
  send({t:'classReady',cls:myClass});
  document.getElementById('classReady').disabled=true;
  document.getElementById('classReady').textContent='대기중...';
}

// ── Traits ─────────────────────────────────────────────────
const ALL_TRAITS=[
  {id:'hp',icon:'❤',name:'강철 체력',desc:'최대 HP +40, 즉시 회복'},
  {id:'spd',icon:'💨',name:'질풍',desc:'이동속도 +20%'},
  {id:'dmg',icon:'⚔',name:'살육자',desc:'모든 무기 데미지 +25%'},
  {id:'cd',icon:'⚡',name:'신속',desc:'공격속도 +20%'},
  {id:'range',icon:'🎯',name:'저격수',desc:'사거리 +30%'},
  {id:'regen',icon:'🌿',name:'재생',desc:'초당 HP 0.5 회복'},
  {id:'multishot',icon:'🔱',name:'다중사격',desc:'발사체 +1'},
  {id:'magnet',icon:'🧲',name:'자석',desc:'경험치 흡수 범위 3배'},
  {id:'armor',icon:'🛡',name:'갑옷',desc:'받는 피해 -20%'},
  {id:'crit',icon:'💥',name:'치명타',desc:'30% 확률로 2배 데미지'},
];

function rollTraits(){
  const pool=[...ALL_TRAITS];
  const result=[];
  while(result.length<3&&pool.length>0){const i=Math.floor(Math.random()*pool.length);result.push(pool.splice(i,1)[0]);}
  return result;
}

function showTraitSelect(){
  if(!running)return;
  running=false;
  send({t:'pause'}); // 서버에 pause 알림 → 몬스터 공격 중단
  const traits=rollTraits();
  const cards=document.getElementById('traitCards');
  cards.innerHTML='';
  for(const tr of traits){
    const div=document.createElement('div');div.className='traitCard';
    div.innerHTML='<div class="traitIcon">'+tr.icon+'</div><div class="traitName">'+tr.name+'</div><div class="traitDesc">'+tr.desc+'</div>';
    div.onclick=()=>pickTrait(tr);
    cards.appendChild(div);
  }
  document.getElementById('lvlUpScreen').style.display='flex';
}

function pickTrait(tr){
  document.getElementById('lvlUpScreen').style.display='none';
  running=true;
  send({t:'resume'}); // 서버에 resume 알림
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
  el.innerHTML=myTraits.map(id=>{const tr=ALL_TRAITS.find(t=>t.id===id);return tr?'<span>'+tr.icon+' '+tr.name+'</span>':'';}).join('<br>');
}

// ── Weapon helper ──────────────────────────────────────────
function getW(){
  const w=myWeapon,s=myStats;
  const critHit=s.crit&&Math.random()<0.3;
  return{
    ...w,
    dmg:w.baseDmg*s.dmgMult*(critHit?2:1),
    cd:w.baseCd*s.cdMult,
    range:w.baseRange*s.rangeMult,
    count:1+(w.type!=='sword'&&w.type!=='dagger'?s.multishot:0),
    crit:critHit
  };
}

// ── Image system ───────────────────────────────────────────
const IMGS={};
const IMG_KEYS={
  enemy_basic:   'assets/enemy_basic.png',
  enemy_ranged:  'assets/enemy_ranged.png',
  enemy_shield:  'assets/enemy_shield.png',
  enemy_fast:    'assets/enemy_fast.png',
  enemy_mage:    'assets/enemy_mage.png',
  boss_mid:      'assets/boss_mid.png',
  boss_final1:   'assets/boss_final1.png',
  boss_final2:   'assets/boss_final2.png',
  boss_final3:   'assets/boss_final3.png',
};
function loadImages(){
  for(const[key,src]of Object.entries(IMG_KEYS)){
    const img=new Image();
    img.onload=()=>{IMGS[key]=img;};
    img.onerror=()=>{}; 
    img.src=src;
  }
}
loadImages();

function drawImg(key,x,y,size,fallback){
  const img=IMGS[key];
  if(img){
    ctx.save();
    ctx.drawImage(img,x-size,y-size,size*2,size*2);
    ctx.restore();
  } else {
    fallback();
  }
}

// ── Game state ─────────────────────────────────────────────
let running=false,stageTime=600,currentStage=1,midBossSpawned=false,finalBossSpawned=false,bossAlive=false;
let kills=0,score=0,camX=0,camY=0;
let myPlayer=null,allPlayers=[],enemies=[],bossData=null;
let projs=[],parts=[],orbs=[],remoteEffects=[];
let lastTime=0,jsActive=false,jsX=0,jsY=0,attackPressed=false,lastShot=0;

const STAGE_BG=['#080810','#100808','#080e0a'];
const STAGE_GRID=['#0d0d1a','#1a0808','#081408'];
const STAGE_NAMES=['어둠의 황야','혈염의 성','마계의 심연'];

function handleMsg(msg){
  if(msg.t==='created'){
    myId=msg.id;isHost=true;
    document.getElementById('codeDisplay').textContent=msg.code;
    document.getElementById('joinRow').style.display='none';
    document.getElementById('waitRoom').style.display='flex';
    document.querySelectorAll('#lobbyScreen .btn,#lobbyScreen input.inp,#lobbyScreen .sub').forEach(el=>el.style.display='none');
  }
  else if(msg.t==='joined'){
    myId=msg.id;
    document.getElementById('codeDisplay').textContent=msg.code;
    document.getElementById('joinRow').style.display='none';
    document.getElementById('startBtn').style.display='none';
    document.getElementById('waitRoom').style.display='flex';
    document.querySelectorAll('#lobbyScreen .btn,#lobbyScreen input.inp,#lobbyScreen .sub').forEach(el=>el.style.display='none');
  }
  else if(msg.t==='lobby'){document.getElementById('playerListEl').innerHTML='참가자: '+msg.players.map(p=>'<b>'+p.name+'</b>').join(', ');}
  else if(msg.t==='err'){showErr(msg.msg);}
  else if(msg.t==='classSelect'){showClassScreen();}
  else if(msg.t==='allReady'){hideClassScreen();initGameState();}
  else if(msg.t==='start'){ }
  else if(msg.t==='state'){applyState(msg);}
  else if(msg.t==='midBoss'){midBossSpawned=true;bossAlive=true;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='⚠ 중간 보스 ⚠';showPop('⚠ 중간 보스 등장!',3000);}
  else if(msg.t==='eproj'){spawnEnemyProj(msg);}
  else if(msg.t==='midBossDead'){bossAlive=false;document.getElementById('bossBar').style.display='none';showPop('중간 보스 처치! 10분까지 생존하세요!',3000);}
  else if(msg.t==='finalBoss'){finalBossSpawned=true;bossAlive=true;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='☠ 최종 보스 ☠';showPop('☠ 최종 보스 등장!',3000);}
  else if(msg.t==='phase2'){showPop('PHASE 2!',1500);}
  else if(msg.t==='bossHp'){if(bossData)bossData.hp=msg.hp;}
  else if(msg.t==='pat'){doBossPat(msg);}
  else if(msg.t==='eDead'){spawnParts(msg.x,msg.y,'#ff8844',8);kills++;score+=msg.sc||10;addKf('+'+( msg.sc||10));}
  else if(msg.t==='playerLeft'){showPop('플레이어 퇴장',1200);}
  else if(msg.t==='stageClear'){showStageClear(msg.stage,msg.next);}
  else if(msg.t==='stageStart'){nextStage(msg.stage);}
  else if(msg.t==='over'){endGame(msg.win);}
  else if(msg.t==='fx'){remoteEffects.push(msg);}
}
// ── Shooting & Combat Logic ────────────────────────────────
function tryShoot(){
  if(!myPlayer||myPlayer.dead||!myStats||!myWeapon)return;
  const now=performance.now(),w=getW();
  if(now-lastShot<w.cd)return;
  lastShot=now;
  
  let target=null,minD=Infinity;
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){
    const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<minD){minD=d;target=e;}
  }

  let tx,ty;
  if(target&&minD<w.range*1.3){tx=target.x;ty=target.y;}
  else if(jsActive){tx=myPlayer.x+jsX*200;ty=myPlayer.y+jsY*200;}
  else{tx=mouseX+camX-W/2;ty=mouseY+camY-H/2;}

  const ang=Math.atan2(ty-myPlayer.y,tx-myPlayer.x);
  if(w.type==='sword'||w.type==='dagger'){doMelee(ang,w);return;}
  if(w.type==='magic'){doMagic(ang,w);return;}

  // Projectile classes (Gunner etc.)
  for(let i=0;i<w.count;i++){
    const a=ang+(i-(w.count-1)/2)*0.28;
    projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*(w.spd||7),vy:Math.sin(a)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:5,enemy:false});
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:tx,ay:ty,w:myClass,cnt:w.count,wtype:w.type});
}

// ── Boss Patterns (Server Authoritative) ───────────────────
function doBossPat(msg){
  const b=bossData; if(!b)return;
  const st=currentStage;
  if(st===1) stage1BossPat(msg);
  else if(st===2) stage2BossPat(msg);
  else stage3BossPat(msg);
}

// ── Server Side: Room & Combat Tick ────────────────────────
function tickRoom(code) {
  const room = rooms.get(code);
  if (!room || !room.started) return;
  const now = Date.now();
  const dt = Math.min((now - room.lastTick) / 1000, 0.1);
  room.lastTick = now;
  room.stageTime -= dt;

  // Boss Spawning Logic
  if(room.stageTime <= 300 && !room.midBossSpawned){
    spawnBoss(room, false); // Mid-boss at 5:00
    room.midBossSpawned = true;
  }
  if(room.stageTime <= 0 && !room.finalBossSpawned){
    spawnBoss(room, true); // Final boss at 0:00
    room.finalBossSpawned = true;
  }

  // Enemy AI & Movement
  for (const e of room.enemies) {
    let near = getNearestPlayer(room, e);
    if (!near) continue;
    const dx = near.x - e.x, dy = near.y - e.y, d = Math.sqrt(dx*dx+dy*dy);
    
    if (e.type === 'ranged') {
      if (d > 250) { e.x += dx/d*e.spd*dt*60; e.y += dy/d*e.spd*dt*60; }
      e.lastShot += dt;
      if (e.lastShot > 2.2) {
        e.lastShot = 0;
        bcastAll(room, { t: 'eproj', etype: 'ranged', bx: e.x, by: e.y, tx: near.x, ty: near.y, dmg: 12 });
      }
    } else {
      e.x += dx/d*e.spd*dt*60; e.y += dy/d*e.spd*dt*60;
    }
  }

  // Update all clients
  bcastAll(room, {
    t: 'state',
    players: [...room.players.values()],
    enemies: room.enemies,
    boss: room.boss,
    st: room.stageTime,
    stage: room.currentStage
  });
}

// ── Initialization ─────────────────────────────────────────
loadImages();
console.log("Dark Survival Server Engine Loaded on Port " + PORT);
