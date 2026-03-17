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

</div><!-- end #G -->

<!-- Lobby — #G 밖에 위치해야 touch-action:none 영향 안받음 -->
<div id="lobbyScreen">
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

<!-- Class Select — #G 밖 -->
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

<!-- Level Up — #G 밖 -->
<div id="lvlUpScreen">
    <div id="lvlUpTitle">LEVEL UP!</div>
    <div id="lvlUpSub">특성을 선택하세요</div>
    <div id="traitCards"></div>
  </div>

<!-- Stage Clear — #G 밖 -->
<div id="stageClearScreen">
    <div id="stageClearTitle">STAGE CLEAR!</div>
    <div id="stageClearSub"></div>
    <div id="stageClearTimer">3</div>
  </div>

<!-- Game Over — #G 밖 -->
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
  alert('connect 호출됨 URL: '+WS_URL);
  ws=new WebSocket(WS_URL);
  ws.onopen=()=>{alert('WebSocket 연결 성공!');cb();};
  ws.onmessage=e=>handleMsg(JSON.parse(e.data));
  ws.onerror=(e)=>{alert('WebSocket 에러: '+JSON.stringify(e.type));};
  ws.onclose=(e)=>{alert('WebSocket 닫힘: code='+e.code);};
}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o));}
function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';}
function doCreate(){alert('doCreate 호출됨');const name=document.getElementById('nameInp').value.trim()||'Player';connect(()=>send({t:'create',name}));}
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
// assets/ 폴더에 파일을 넣으면 자동으로 사용됩니다.
// 파일이 없으면 기존 도형으로 대체됩니다.
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
    img.onerror=()=>{}; // 파일 없으면 그냥 스킵
    img.src=src;
  }
}
loadImages();

// 이미지로 그리기 (없으면 fallback 함수 실행)
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

// Stage backgrounds
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
  else if(msg.t==='start'){/* game loop starts after allReady */}
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

function showClassScreen(){
  document.getElementById('lobbyScreen').style.display='none';
  document.getElementById('classScreen').style.display='flex';
}
function hideClassScreen(){
  document.getElementById('classScreen').style.display='none';
}

function initGameState(){
  if(!myClass)myClass='warrior';
  const cls=CLASSES[myClass];
  myStats={...cls.stats};
  myWeapon={...cls.weapon};
  myTraits=[];
  running=true;stageTime=600;currentStage=1;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;
  kills=0;score=0;projs=[];parts=[];orbs=[];remoteEffects=[];
  myPlayer={x:0,y:0,hp:myStats.hp,maxHp:myStats.maxHp,lv:1,exp:0,expNext:50,dead:false};
  document.getElementById('classTag').innerHTML='<span>'+cls.icon+' '+cls.name+'</span>';
  document.getElementById('hud').style.display='block';
  document.getElementById('jsWrap').style.display='block';
  document.getElementById('atkBtn').style.display='flex';
  document.getElementById('bossBar').style.display='none';
  G.style.background=STAGE_BG[0];
  updateTraitList();
  lastTime=performance.now();
  requestAnimationFrame(loop);
}

function applyState(msg){
  allPlayers=msg.players||[];enemies=msg.enemies||[];
  bossData=msg.boss||null;stageTime=msg.st??stageTime;
  if(msg.stage)currentStage=msg.stage;
  const me=allPlayers.find(p=>p.id===myId);
  if(me&&myPlayer){
    // 서버 HP가 권위(authoritative). armor는 데미지 경감용이므로 표시 HP = 서버 HP
    myPlayer.hp=Math.max(0,me.hp);
    myPlayer.maxHp=myStats.maxHp;
    myPlayer.lv=me.lv;myPlayer.exp=me.exp;myPlayer.expNext=me.expNext;
    if(me.lvUp)showTraitSelect();
    // 사망 판정: 서버 dead 플래그 OR hp가 0
    if((me.dead||me.hp<=0)&&!myPlayer.dead){
      myPlayer.dead=true;
      if(running){running=false;endGame(false);}
    }
  }
}

// ── Stage transitions ──────────────────────────────────────
function showStageClear(stage,next){
  running=false;
  const el=document.getElementById('stageClearScreen');
  document.getElementById('stageClearTitle').textContent='STAGE '+stage+' CLEAR!';
  document.getElementById('stageClearSub').textContent=next<=3?'다음: '+STAGE_NAMES[next-1]:'모든 스테이지 클리어!';
  el.style.display='flex';
  let t=5;document.getElementById('stageClearTimer').textContent=t;
  const iv=setInterval(()=>{t--;document.getElementById('stageClearTimer').textContent=t;if(t<=0){clearInterval(iv);el.style.display='none';}},1000);
}

function nextStage(stage){
  currentStage=stage;stageTime=600;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;
  bossData=null;enemies=[];projs=[];parts=[];orbs=[];
  document.getElementById('bossBar').style.display='none';
  G.style.background=STAGE_BG[Math.min(stage-1,2)];
  running=true;
  showPop('STAGE '+stage+' START!',2500);
}

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
  if(!myPlayer||myPlayer.dead||!myStats||!myWeapon)return;
  const now=performance.now(),w=getW();
  if(now-lastShot<w.cd)return;
  lastShot=now;
  let target=null,minD=Infinity;
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minD){minD=d;target=e;}}
  let tx,ty;
  if(target&&minD<w.range*1.3){tx=target.x;ty=target.y;}
  else if(jsActive){tx=myPlayer.x+jsX*200;ty=myPlayer.y+jsY*200;}
  else{tx=mouseX+camX-W/2;ty=mouseY+camY-H/2;}
  const ang=Math.atan2(ty-myPlayer.y,tx-myPlayer.x);
  if(w.type==='sword'||w.type==='dagger'){doMelee(ang,w);return;}
  if(w.type==='magic'){doMagic(ang,w);return;}
  // 저격총/기타 투사체
  for(let i=0;i<w.count;i++){
    const a=ang+(i-(w.count-1)/2)*0.28;
    projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*(w.spd||7),vy:Math.sin(a)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:5,enemy:false});
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:tx,ay:ty,w:myClass,cnt:w.count,wtype:w.type});
}

function doMagic(ang,w){
  const explodeR=(w.explodeR||60)*(1+myStats.multishot*0.3);
  projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(ang)*w.spd,vy:Math.sin(ang)*w.spd,
    dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:8,enemy:false,
    magic:true,explodeR});
  const ax=myPlayer.x+Math.cos(ang)*200,ay=myPlayer.y+Math.sin(ang)*200;
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax,ay,w:myClass,cnt:1,wtype:'magic'});
}

function doMelee(ang,w){
  const isDagger=w.type==='dagger';
  const spread=isDagger?0.5:0.9,step=isDagger?0.18:0.2,pR=isDagger?4:5;
  const col=isDagger?'#ff88aacc':w.color;
  for(let a=ang-spread;a<=ang+spread;a+=step)
    for(let r=18;r<w.range;r+=isDagger?12:14)
      parts.push({x:myPlayer.x+Math.cos(a)*r,y:myPlayer.y+Math.sin(a)*r,vx:0,vy:0,life:isDagger?120:160,maxLife:isDagger?120:160,r:pR,color:col});
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  for(const e of allE){
    const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<w.range){const ea=Math.atan2(dy,dx),diff=Math.abs(((ea-ang)+Math.PI*3)%(Math.PI*2)-Math.PI);if(diff<(isDagger?0.6:1.1))reportHit(e.id==='boss'?'boss':e.id,w.dmg);}
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:myPlayer.x+Math.cos(ang)*60,ay:myPlayer.y+Math.sin(ang)*60,w:myClass,cnt:1});
}

function spawnEnemyProj(msg){
  const ang=Math.atan2(msg.ty-msg.by,msg.tx-msg.bx);
  if(msg.etype==='ranged'){
    // 총알 - 빠르고 작음
    projs.push({x:msg.bx,y:msg.by,vx:Math.cos(ang)*7,vy:Math.sin(ang)*7,
      dmg:msg.dmg,range:380,traveled:0,gone:false,color:'#ffaa44',r:4,enemy:true});
  } else if(msg.etype==='mage'){
    // 마법탄 3발 부채꼴
    for(let k=-1;k<=1;k++){
      const a=ang+k*0.3;
      projs.push({x:msg.bx,y:msg.by,vx:Math.cos(a)*4.5,vy:Math.sin(a)*4.5,
        dmg:msg.dmg,range:300,traveled:0,gone:false,color:'#cc66ff',r:7,enemy:true,magic:true});
    }
  }
}

function reportHit(id,dmg){id==='boss'?send({t:'hit',target:'boss',dmg}):send({t:'hit',eid:id,dmg});}
  const r=p.explodeR||60;
  // 폭발 파티클
  spawnParts(p.x,p.y,'#cc88ff',20);
  spawnParts(p.x,p.y,'#ffffff',8);
  // 범위 내 모든 적 히트
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:42}]:enemies;
  for(const e of allE){
    const dx=p.x-e.x,dy=p.y-e.y;
    if(Math.sqrt(dx*dx+dy*dy)<r+(e.r||10)){
      reportHit(e.id==='boss'?'boss':e.id,p.dmg);
    }
  }
  // 폭발 링 파티클
  for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2;parts.push({x:p.x+Math.cos(a)*r*0.7,y:p.y+Math.sin(a)*r*0.7,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5,life:300,maxLife:300,r:5,color:'#cc88ff'});}
}

function reportHit(id,dmg){id==='boss'?send({t:'hit',target:'boss',dmg}):send({t:'hit',eid:id,dmg});}

// ── Boss & enemy patterns ──────────────────────────────────
function doBossPat(msg){
  const{i,bx,by,ang,phase,etype,stage}=msg;
  // 원거리 몬스터 탄
  if(i===-1){
    if(etype==='ranged'){
      // 단발 조준탄
      mkBB(bx,by,Math.cos(ang)*5.5,Math.sin(ang)*5.5,12,'#ffaa44',5);
    } else if(etype==='mage'){
      // 3방향 마법탄
      for(let k=-1;k<=1;k++){const a=ang+k*0.35;mkBB(bx,by,Math.cos(a)*3.5,Math.sin(a)*3.5,14,'#cc66ff',6);}
    }
    return;
  }
  // 중간보스 패턴
  if(!msg.isFinal){[midBossSpiral,midBossCharge,midBossRing][Math.min(i,2)](bx,by,ang,phase);return;}
  // 최종보스 패턴 — 스테이지별로 다름
  const st=stage||1;
  if(st===1)[finalBoss1Spiral,finalBoss1Blast,finalBoss1Cross,finalBoss1Rapid,finalBoss1Ring][Math.min(i,4)](bx,by,ang,phase);
  else if(st===2)[finalBoss2Wave,finalBoss2Burst,finalBoss2Cross,finalBoss2Rapid,finalBoss2Ring][Math.min(i,4)](bx,by,ang,phase);
  else[finalBoss3Nova,finalBoss3Death,finalBoss3Spiral,finalBoss3Rapid,finalBoss3Ring][Math.min(i,4)](bx,by,ang,phase);
}

function mkBB(bx,by,vx,vy,dmg,col,r){projs.push({x:bx,y:by,vx,vy,dmg,range:500,traveled:0,gone:false,color:col,r,enemy:true});}

// ─ 중간보스 (해골기사) 패턴 ─
function midBossSpiral(bx,by,ang){for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*3.2,Math.sin(a)*3.2,14,'#aabb44',7);}}
function midBossCharge(bx,by,ang){// 플레이어 방향 집중 3탄
  if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1;
  for(let k=-1;k<=1;k++){const a=Math.atan2(dy,dx)+k*0.2;mkBB(bx,by,Math.cos(a)*6,Math.sin(a)*6,18,'#ddcc22',6);}
}
function midBossRing(bx,by,ang){for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*2.5,Math.sin(a)*2.5,16,'#88cc44',8);}}

// ─ 스테이지1 최종보스 (화염마) 패턴 ─
function finalBoss1Spiral(bx,by,ang){for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*3.8,Math.sin(a)*3.8,16,'#ff6600',8);}}
function finalBoss1Blast(bx,by){for(let i=0;i<18;i++){const a=(i/18)*Math.PI*2;mkBB(bx,by,Math.cos(a)*2.5,Math.sin(a)*2.5,20,'#ff2200',10);}spawnParts(bx,by,'#ff6600',16);}
function finalBoss1Cross(bx,by){[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]].forEach(([dx,dy])=>{for(let n=0;n<3;n++)setTimeout(()=>mkBB(bx,by,dx*5,dy*5,18,'#ff4400',6),n*180);});}
function finalBoss1Rapid(bx,by){if(!myPlayer)return;for(let n=0;n<6;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.4;mkBB(bx,by,Math.cos(a)*6.5,Math.sin(a)*6.5,15,'#ff4444',5);},n*100);}
function finalBoss1Ring(bx,by,ang){for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2+ang*2,s=2.5+Math.random()*2;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,22,'#ffaa00',9);}}

// ─ 스테이지2 최종보스 (독룡) 패턴 ─
function finalBoss2Wave(bx,by,ang){// 파도형
  for(let i=0;i<14;i++){const a=ang+(i/14)*Math.PI*2;const spd=3+Math.sin(i*0.8)*1.5;mkBB(bx,by,Math.cos(a)*spd,Math.sin(a)*spd,18,'#44ff88',8);}
}
function finalBoss2Burst(bx,by){// 독 폭발
  for(let i=0;i<24;i++){const a=(i/24)*Math.PI*2;mkBB(bx,by,Math.cos(a)*3,Math.sin(a)*3,22,'#22dd44',9);}
  spawnParts(bx,by,'#44ff88',20);
}
function finalBoss2Cross(bx,by,ang){[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{for(let n=0;n<5;n++)setTimeout(()=>mkBB(bx,by,dx*5.5,dy*5.5,20,'#88ff44',5),n*120);});}
function finalBoss2Rapid(bx,by){if(!myPlayer)return;for(let n=0;n<8;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.3;mkBB(bx,by,Math.cos(a)*7,Math.sin(a)*7,16,'#66ff44',5);},n*80);}
function finalBoss2Ring(bx,by,ang){for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2+ang*2.5;mkBB(bx,by,Math.cos(a)*3.5,Math.sin(a)*3.5,20,'#44ffaa',8);}}

// ─ 스테이지3 최종보스 (마왕) 패턴 ─
function finalBoss3Nova(bx,by,ang){// 전방위 다중 링
  for(let r=0;r<3;r++)setTimeout(()=>{for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2+ang+r*0.3;mkBB(bx,by,Math.cos(a)*(3+r),Math.sin(a)*(3+r),22,'#cc44ff',9);}},r*200);
}
function finalBoss3Death(bx,by){// 죽음의 폭발
  for(let i=0;i<30;i++){const a=(i/30)*Math.PI*2,s=1+Math.random()*5;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,25,'#ff00ff',10);}
  spawnParts(bx,by,'#cc44ff',30);
}
function finalBoss3Spiral(bx,by,ang){// 빠른 나선
  for(let i=0;i<14;i++){const a=(i/14)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*5,Math.sin(a)*5,20,'#ff44cc',8);}
}
function finalBoss3Rapid(bx,by){if(!myPlayer)return;for(let n=0;n<10;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.25;mkBB(bx,by,Math.cos(a)*8,Math.sin(a)*8,18,'#ff44ff',6);},n*70);}
function finalBoss3Ring(bx,by,ang){for(let i=0;i<24;i++){const a=(i/24)*Math.PI*2+ang*3,s=3+Math.random()*3;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,25,'#ff88ff',10);}}

// ── Remote FX ──────────────────────────────────────────────
function spawnRemoteFx(fx){
  const cls=CLASSES[fx.w]||CLASSES.warrior;
  const wc=cls.weapon;
  const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);
  if(fx.wtype==='sword'||fx.wtype==='dagger'){
    const spread=fx.wtype==='dagger'?0.5:0.9;
    for(let a=ang-spread;a<=ang+spread;a+=0.25)
      for(let r=18;r<80;r+=16)
        parts.push({x:fx.x+Math.cos(a)*r,y:fx.y+Math.sin(a)*r,vx:0,vy:0,life:140,maxLife:140,r:4,color:wc.color+'88'});
  } else if(fx.wtype==='magic'){
    // 마법구 visual 투사체
    projs.push({x:fx.x,y:fx.y,vx:Math.cos(ang)*(wc.spd||5),vy:Math.sin(ang)*(wc.spd||5),
      dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'cc',r:8,enemy:false,visual:true});
  } else {
    // 총/기타
    const cnt=fx.cnt||1;
    for(let i=0;i<cnt;i++){
      const a=ang+(i-(cnt-1)/2)*0.28;
      projs.push({x:fx.x,y:fx.y,vx:Math.cos(a)*(wc.spd||7),vy:Math.sin(a)*(wc.spd||7),
        dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:5,enemy:false,visual:true});
    }
  }
}

// ── Update ─────────────────────────────────────────────────
let regenTimer=0;
function update(dt){
  if(!running||!myPlayer||myPlayer.dead||!myStats)return;
  // regen — 서버에 회복 요청
  if(myStats.regen>0){regenTimer+=dt;if(regenTimer>1000){regenTimer=0;send({t:'regen',amount:myStats.regen});}}
  let mx=jsX,my=jsY;
  if(keys['w']||keys['arrowup'])my=-1;if(keys['s']||keys['arrowdown'])my=1;
  if(keys['a']||keys['arrowleft'])mx=-1;if(keys['d']||keys['arrowright'])mx=1;
  const ml=Math.sqrt(mx*mx+my*my)||1;
  if(mx||my){myPlayer.x+=mx/ml*myStats.spd*(dt/16);myPlayer.y+=my/ml*myStats.spd*(dt/16);}
  send({t:'move',x:Math.round(myPlayer.x),y:Math.round(myPlayer.y)});
  if(attackPressed||mouseDown||keys[' ']||keys['f']||(enemies.length>0&&running))tryShoot();
  camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;
  for(const fx of remoteEffects)spawnRemoteFx(fx);
  remoteEffects=[];
  const spF=dt/16;
  for(const p of projs){
    if(p.gone)continue;
    p.x+=p.vx*spF;p.y+=p.vy*spF;p.traveled+=Math.sqrt(p.vx*p.vx+p.vy*p.vy)*spF;
    if(p.traveled>p.range){p.gone=true;continue;}
    if(p.visual)continue;
    if(!p.enemy){
      for(const e of enemies){const dx=p.x-e.x,dy=p.y-e.y;if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){
        if(p.magic){magicExplode(p);p.gone=true;break;}
        reportHit(e.id,p.dmg);spawnParts(p.x,p.y,p.color,4);p.gone=true;break;
      }}
      if(!p.gone&&bossData){const dx=p.x-bossData.x,dy=p.y-bossData.y;if(Math.sqrt(dx*dx+dy*dy)<42+p.r){
        if(p.magic){magicExplode(p);p.gone=true;}
        else{reportHit('boss',p.dmg);spawnParts(p.x,p.y,p.color,5);p.gone=true;}
      }}
    }else{
      if(myPlayer&&!myPlayer.dead){const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;if(Math.sqrt(dx*dx+dy*dy)<14){spawnParts(p.x,p.y,p.color,4);p.gone=true;send({t:'projHit',dmg:p.dmg});}}
    }
  }
  projs=projs.filter(p=>!p.gone);
  for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
  parts=parts.filter(p=>p.life>0);
  if(parts.length>600)parts=parts.slice(-600);
  const magnetR=28*myStats.magnetRange,pullR=100*myStats.magnetRange;
  for(const o of orbs){
    if(o.col)continue;
    const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<magnetR){o.col=true;score+=5;}else if(d<pullR){o.x-=dx/d*3;o.y-=dy/d*3;}
  }
  orbs=orbs.filter(o=>!o.col);
  // HUD
  const me=allPlayers.find(p=>p.id===myId)||myPlayer;
  const hpPct=Math.max(0,(myPlayer.hp/myPlayer.maxHp)*100);
  document.getElementById('hpFill').style.width=hpPct+'%';
  document.getElementById('hpTxt').textContent=Math.max(0,Math.floor(myPlayer.hp));
  document.getElementById('expFill').style.width=((me.exp||0)/(me.expNext||50)*100)+'%';
  document.getElementById('lvTxt').textContent=me.lv||1;
  document.getElementById('killTxt').textContent=kills;
  document.getElementById('scoreTxt').textContent=score;
  document.getElementById('waveTxt').textContent=Math.max(1,Math.floor((600-stageTime)/60)+1);
  const mins=Math.floor(stageTime/60),secs=Math.floor(stageTime%60);
  document.getElementById('timerVal').textContent=mins+':'+(secs<10?'0':'')+secs;
  document.getElementById('timerVal').style.color=stageTime<60?'#ff4444':stageTime<120?'#ff8844':'#ffcc00';
  document.getElementById('stageVal').textContent=currentStage;
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
  const gi=Math.min(currentStage-1,2);
  ctx.strokeStyle=STAGE_GRID[gi];ctx.lineWidth=1;
  const gs=80,sx=Math.floor((camX-W/2)/gs)*gs,sy=Math.floor((camY-H/2)/gs)*gs;
  for(let x=sx;x<camX+W/2+gs;x+=gs){ctx.beginPath();ctx.moveTo(x,camY-H/2);ctx.lineTo(x,camY+H/2);ctx.stroke();}
  for(let y=sy;y<camY+H/2+gs;y+=gs){ctx.beginPath();ctx.moveTo(camX-W/2,y);ctx.lineTo(camX+W/2,y);ctx.stroke();}
}

function drawMe(){
  if(!myClass)return;
  const{x,y}=myPlayer;
  const cls=CLASSES[myClass];
  ctx.save();
  ctx.shadowColor=cls.color;ctx.shadowBlur=14;
  ctx.fillStyle=cls.color;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  // class icon text
  ctx.font='11px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(cls.icon,x,y);
  ctx.restore();
}

const PC=['#66aaff','#ff8866','#88ff88','#ffcc44'];
function drawOthers(){
  allPlayers.forEach((p,i)=>{
    if(p.id===myId||p.dead)return;
    const cls=CLASSES[p.cls]||null;
    const c=cls?cls.color:PC[i%4];
    ctx.save();ctx.shadowColor=c;ctx.shadowBlur=10;
    ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    if(cls){ctx.font='11px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(cls.icon,p.x,p.y);}
    ctx.fillStyle='#ffffffcc';ctx.font='9px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillText(p.name||'?',p.x,p.y-16);
    ctx.restore();
  });
}

// Monster style map
const E_STYLES={
  basic:{fill:'#bb1111',eye:'#ff5555',shadow:'#ff2222'},      // 잡몹
  ranged:{fill:'#bb4411',eye:'#ffaa44',shadow:'#ff8822'},     // 총 쏘는 적
  shield:{fill:'#226688',eye:'#44bbff',shadow:'#2299ff'},     // 방패
  fast:{fill:'#1144bb',eye:'#44aaff',shadow:'#2266ff'},       // 빠른 적
  mage:{fill:'#662288',eye:'#dd44ff',shadow:'#aa22ff'},       // 마법 적
};
const E_ICONS={basic:'',ranged:'🎯',shield:'🛡',fast:'💨',mage:'🌀'};

function drawEnemies(){
  for(const e of enemies){
    const st=E_STYLES[e.type]||E_STYLES.basic;
    const r=e.r||10;
    const imgKey='enemy_'+e.type;
    ctx.save();
    ctx.shadowColor=st.shadow;ctx.shadowBlur=6;
    // 이미지 or 도형
    if(IMGS[imgKey]){
      ctx.drawImage(IMGS[imgKey],e.x-r,e.y-r,r*2,r*2);
    } else {
      ctx.fillStyle=st.fill;ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);ctx.fill();
      if(e.type==='shield'&&e.shieldHp>0){
        ctx.strokeStyle='#44bbff88';ctx.lineWidth=3;
        ctx.beginPath();ctx.arc(e.x,e.y,r+4,0,Math.PI*2);ctx.stroke();
      }
      ctx.shadowBlur=0;ctx.fillStyle=st.eye;
      ctx.beginPath();ctx.arc(e.x-r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(e.x+r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
    }
    // 방패 링 (이미지 위에도 표시)
    if(e.type==='shield'&&e.shieldHp>0&&IMGS[imgKey]){
      ctx.shadowBlur=0;ctx.strokeStyle='#44bbff88';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(e.x,e.y,r+4,0,Math.PI*2);ctx.stroke();
    }
    ctx.shadowBlur=0;
    // HP 바
    ctx.fillStyle='#220000';ctx.fillRect(e.x-r,e.y-r-8,r*2,3);
    ctx.fillStyle=st.shadow;ctx.fillRect(e.x-r,e.y-r-8,r*2*(e.hp/e.maxHp),3);
    ctx.restore();
  }
}

function drawBoss(){
  const b=bossData,t=performance.now()*0.003;
  const ang=b.ang||t;
  const bSize=b.isFinal?46:40;
  ctx.save();
  if(!b.isFinal){
    // ── 중간보스: 해골기사 ──
    const imgKey='boss_mid';
    ctx.shadowColor='#aacc44';ctx.shadowBlur=20;
    if(IMGS[imgKey]){
      ctx.drawImage(IMGS[imgKey],b.x-bSize,b.y-bSize,bSize*2,bSize*2);
    } else {
      ctx.fillStyle=b.phase===1?'#334400':'#223300';
      ctx.beginPath();ctx.arc(b.x,b.y,38,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle='#aabb44';ctx.beginPath();ctx.arc(b.x,b.y,20,0,Math.PI*2);ctx.fill();
      for(let i=0;i<4;i++){const a=ang+(i/4)*Math.PI*2;
        ctx.fillStyle='#88aa33';ctx.beginPath();ctx.arc(b.x+Math.cos(a)*28,b.y+Math.sin(a)*28,8,0,Math.PI*2);ctx.fill();}
    }
    ctx.shadowBlur=0;
    ctx.fillStyle='#eeff88';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillText('\u26a0 \ud574\uace8\uae30\uc0ac',b.x,b.y-bSize-8);
  } else {
    const st=currentStage;
    const imgKey='boss_final'+st;
    if(st===1){
      ctx.shadowColor='#ff4400';ctx.shadowBlur=28;
      if(IMGS[imgKey]){
        ctx.drawImage(IMGS[imgKey],b.x-bSize,b.y-bSize,bSize*2,bSize*2);
      } else {
        ctx.fillStyle=b.phase===1?'#880000':'#550000';
        ctx.beginPath();ctx.arc(b.x,b.y,42,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(b.x,b.y,22,0,Math.PI*2);ctx.fill();
        for(let i=0;i<8;i++){const a=ang+(i/8)*Math.PI*2;
          ctx.fillStyle='hsl('+(20+i*5)+',100%,50%)';ctx.beginPath();ctx.arc(b.x+Math.cos(a)*32,b.y+Math.sin(a)*32,7,0,Math.PI*2);ctx.fill();}
      }
      ctx.shadowBlur=0;
      ctx.fillStyle='#ffcc88';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillText('\u2620 \ud654\uc5fc\ub9c8',b.x,b.y-bSize-8);
    } else if(st===2){
      ctx.shadowColor='#44ff44';ctx.shadowBlur=28;
      if(IMGS[imgKey]){
        ctx.drawImage(IMGS[imgKey],b.x-bSize,b.y-bSize,bSize*2,bSize*2);
      } else {
        ctx.fillStyle=b.phase===1?'#004400':'#002200';
        ctx.beginPath();ctx.arc(b.x,b.y,44,0,Math.PI*2);ctx.fill();
        for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2+ang*0.5;
          ctx.fillStyle=i%2===0?'#22bb44':'#118833';ctx.beginPath();ctx.arc(b.x+Math.cos(a)*34,b.y+Math.sin(a)*34,6,0,Math.PI*2);ctx.fill();}
        ctx.shadowBlur=0;ctx.fillStyle='#44ff88';ctx.beginPath();ctx.arc(b.x,b.y,20,0,Math.PI*2);ctx.fill();
      }
      ctx.shadowBlur=0;
      ctx.fillStyle='#aaffcc';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillText('\u2620 \ub3c5\ub8a1',b.x,b.y-bSize-8);
    } else {
      ctx.shadowColor='#ff00ff';ctx.shadowBlur=32;
      if(IMGS[imgKey]){
        ctx.drawImage(IMGS[imgKey],b.x-bSize,b.y-bSize,bSize*2,bSize*2);
      } else {
        ctx.fillStyle=b.phase===1?'#330033':'#220022';
        ctx.beginPath();ctx.arc(b.x,b.y,46,0,Math.PI*2);ctx.fill();
        for(let ring=0;ring<3;ring++){
          ctx.strokeStyle='hsla('+(280+ring*30)+',100%,60%,'+(0.4+ring*0.2)+')';ctx.lineWidth=2;
          ctx.beginPath();ctx.arc(b.x,b.y,20+ring*10,ang*(ring+1)*0.5,ang*(ring+1)*0.5+Math.PI*1.5);ctx.stroke();
        }
        ctx.shadowBlur=0;ctx.fillStyle='#ff44ff';ctx.beginPath();ctx.arc(b.x,b.y,22,0,Math.PI*2);ctx.fill();
        for(let i=0;i<10;i++){const a=ang*2+(i/10)*Math.PI*2;
          ctx.fillStyle='hsl('+(280+i*8)+',100%,60%)';ctx.beginPath();ctx.arc(b.x+Math.cos(a)*36,b.y+Math.sin(a)*36,6,0,Math.PI*2);ctx.fill();}
      }
      ctx.shadowBlur=0;
      ctx.fillStyle='#ffaaff';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillText('\u2620 \ub9c8\uc655',b.x,b.y-bSize-8);
    }
  }
  if(b.phase===2){
    ctx.fillStyle='#ff4444';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillText('PHASE 2',b.x,b.y+bSize+10);
  }
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

function endGame(win){
  running=false;const el=document.getElementById('goScreen');el.style.display='flex';
  document.getElementById('goTitle').textContent=win?'ALL CLEAR! 🎉':'GAME OVER';
  document.getElementById('goTitle').style.color=win?'#ffcc00':'#ff4444';
  const stagesCleared=win?3:currentStage-1;
  document.getElementById('goStats').innerHTML=
    '스테이지: '+stagesCleared+'/3<br>직업: '+(myClass?CLASSES[myClass].name:'없음')+'<br>처치: '+kills+'<br>점수: '+score+'<br>레벨: '+(myPlayer?myPlayer.lv:1)+'<br>특성: '+(myTraits.length>0?myTraits.map(id=>ALL_TRAITS.find(t=>t.id===id)?.name||id).join(', '):'없음');
}

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
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
  res.end(HTML);
});

// ── WebSocket ──────────────────────────────────────────────
const wss = new WebSocketServer({ server });
const rooms = new Map();

function genCode() { return Math.random().toString(36).substr(2, 5).toUpperCase(); }
function bcast(room, msg, except) { const d = JSON.stringify(msg); room.players.forEach((_, ws) => { if (ws !== except && ws.readyState === 1) ws.send(d); }); }
function bcastAll(room, msg) { bcast(room, msg, null); }

// ── Monster definitions ───────────────────────────────────
// basic: 일반 잡몹 | ranged: 원거리 총 | shield: 방패병 | fast: 고속 | mage: 마법사
const ETYPES = [
  { type: 'basic', spd: 1.0, hpMult: 1.0, r: 10, dmgMult: 1.0 },
  { type: 'ranged', spd: 0.65, hpMult: 0.75, r: 9, dmgMult: 0.8 },
  { type: 'shield', spd: 0.55, hpMult: 2.8, r: 14, dmgMult: 1.2, shieldHp: true },
  { type: 'fast', spd: 2.2, hpMult: 0.55, r: 8, dmgMult: 0.9 },
  { type: 'mage', spd: 0.7, hpMult: 0.85, r: 10, dmgMult: 1.1 },
];

// Weighted spawn: changes per stage
const SPAWN_WEIGHTS = [
  [0.55, 0.2, 0.1, 0.1, 0.05],  // stage 1
  [0.35, 0.2, 0.15, 0.15, 0.15], // stage 2
  [0.2, 0.2, 0.15, 0.2, 0.25],   // stage 3
];

function pickEtype(stage) {
  const w = SPAWN_WEIGHTS[Math.min(stage - 1, 2)];
  const r = Math.random(); let cum = 0;
  for (let i = 0; i < w.length; i++) { cum += w[i]; if (r < cum) return ETYPES[i]; }
  return ETYPES[0];
}

function spawnEnemies(room) {
  if (room.midBossAlive || room.finalBossAlive) return;
  const playerCount = [...room.players.values()].filter(p => !p.dead).length;
  if (!playerCount) return;

  // 시간 경과 (0~600초 → 1~4배)
  const elapsed = 600 - room.stageTime;
  const timeProg = 1 + (elapsed / 600) * 3;

  // 스테이지 배율
  const stageMult = room.currentStage;

  // 플레이어 수 배율: 1명=1x, 2명=1.8x, 3명=2.5x, 4명=3.2x
  const playerMult = 1 + (playerCount - 1) * 0.75;

  // 소환 수
  const cnt = Math.max(2, Math.floor(timeProg * 1.5 * stageMult * playerMult * 0.6));

  const arr = [...room.players.values()].filter(p => !p.dead);
  const ref = arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < cnt; i++) {
    const a = Math.random() * Math.PI * 2, r = 350 + Math.random() * 100;
    const et = pickEtype(room.currentStage);

    // HP: 시간·스테이지·플레이어 수 모두 반영
    const baseHp = (25 + elapsed * 0.08) * stageMult * playerMult * et.hpMult;

    // 속도: 시간이 지날수록 점점 빨라짐
    const spd = et.spd * (1 + (room.currentStage - 1) * 0.3) * (1 + elapsed / 600 * 0.5);

    // 데미지: 플레이어 수에 따라 증가
    const dmgMult = et.dmgMult * (1 + (playerCount - 1) * 0.2) * (1 + elapsed / 600 * 0.8);

    const e = {
      id: room.eid++, x: ref.x + Math.cos(a) * r, y: ref.y + Math.sin(a) * r,
      hp: baseHp, maxHp: baseHp,
      spd, type: et.type, r: et.r, dead: false, lastShot: 0,
      shieldHp: et.shieldHp ? Math.floor(baseHp * 0.4) : 0,
      dmgMult
    };
    room.enemies.push(e);
  }
  // 최대 동시 적 수도 플레이어 수에 비례
  const maxEnemies = Math.floor(120 * playerMult);
  if (room.enemies.length > maxEnemies) room.enemies = room.enemies.filter(e => !e.dead).slice(-maxEnemies);
}

function spawnBoss(room, isFinal) {
  const arr = [...room.players.values()];
  const ref = arr[0] || { x: 0, y: 0 };
  const playerCount = arr.filter(p => !p.dead).length || 1;
  const playerMult = 1 + (playerCount - 1) * 0.6;
  const hp = isFinal
    ? Math.floor((3500 + room.currentStage * 800) * playerMult)
    : Math.floor((1800 + room.currentStage * 400) * playerMult);
  room.boss = { hp, maxHp: hp, x: ref.x + 320, y: ref.y, r: 42, dead: false, ang: 0, phase: 1, isFinal };
  room.enemies = [];
  if (isFinal) { room.finalBossAlive = true; bcastAll(room, { t: 'finalBoss', boss: room.boss }); }
  else { room.midBossAlive = true; bcastAll(room, { t: 'midBoss', boss: room.boss }); }
}

function tickRoom(code) {
  const room = rooms.get(code);
  if (!room || !room.started) return;
  const now = Date.now();
  const dt = Math.min((now - room.lastTick) / 1000, 0.1);
  room.lastTick = now;
  room.stageTime -= dt;

  // Spawn waves — 중간보스 살아있거나 최종보스 살아있을 때만 중단
  if (!room.midBossAlive && !room.finalBossAlive) {
    room.spawnT = (room.spawnT || 0) + dt;
    if (room.spawnT > 0.8) { room.spawnT = 0; spawnEnemies(room); }
  }

  // 시작 5분 후(stageTime 600→300) → 중간보스
  if (!room.midBossSpawned && room.stageTime <= 300) {
    room.midBossSpawned = true;
    spawnBoss(room, false);
  }

  // 중간보스 살아있으면 타이머 0 아래로 안내려감
  if (room.midBossAlive) {
    room.stageTime = Math.max(room.stageTime, 0.1);
  }

  // 시작 10분 후(stageTime<=0) + 중간보스 처치 완료 → 최종보스
  if (!room.finalBossSpawned && !room.midBossAlive && room.midBossSpawned && room.stageTime <= 0) {
    room.finalBossSpawned = true;
    room.stageTime = 0;
    spawnBoss(room, true);
  }

  const arr = [...room.players.values()];

  // Enemy AI
  for (const e of room.enemies) {
    if (e.dead) continue;
    let near = null, md = Infinity;
    for (const p of arr) { if (p.dead || p.paused) continue; const dx = p.x - e.x, dy = p.y - e.y, d = Math.sqrt(dx * dx + dy * dy); if (d < md) { md = d; near = p; } }
    if (!near) continue;
    const dx = near.x - e.x, dy = near.y - e.y, d = Math.sqrt(dx * dx + dy * dy) || 1;

    if (e.type === 'ranged') {
      // 거리 유지하며 조준 사격
      if (d > 180) { e.x += dx / d * e.spd * dt * 60; e.y += dy / d * e.spd * dt * 60; }
      else if (d < 110) { e.x -= dx / d * e.spd * dt * 60; e.y -= dy / d * e.spd * dt * 60; }
      e.lastShot += dt;
      if (e.lastShot > 2.2) {
        e.lastShot = 0;
        // 실제 탄환 데이터를 서버에서 직접 전송 (playerPos 포함)
        bcastAll(room, { t: 'eproj', etype: 'ranged', bx: e.x, by: e.y, tx: near.x, ty: near.y, dmg: 12 * e.dmgMult });
      }
    } else if (e.type === 'mage') {
      // 원거리 유지하며 마법 시전
      if (d > 220) { e.x += dx / d * e.spd * dt * 60; e.y += dy / d * e.spd * dt * 60; }
      else if (d < 150) { e.x -= dx / d * e.spd * 0.8 * dt * 60; e.y -= dy / d * e.spd * 0.8 * dt * 60; }
      e.lastShot += dt;
      if (e.lastShot > 2.8) {
        e.lastShot = 0;
        bcastAll(room, { t: 'eproj', etype: 'mage', bx: e.x, by: e.y, tx: near.x, ty: near.y, dmg: 16 * e.dmgMult });
      }
    } else {
      e.x += dx / d * e.spd * dt * 60; e.y += dy / d * e.spd * dt * 60;
    }
    // contact damage — armor는 서버에서 반영
    if (d < e.r + 14) {
      const armor = near.armor || 0;
      near.hp -= 0.35 * e.dmgMult * (1 - armor) * dt * 60;
      if (near.hp <= 0) { near.hp = 0; near.dead = true; }
    }
  }

  // Boss AI
  if (room.boss && !room.boss.dead) {
    const b = room.boss;
    b.ang += dt * (b.isFinal ? 2.2 : 1.5);
    const halfHp = b.maxHp / 2;
    if (b.hp < halfHp && b.phase === 1) { b.phase = 2; bcastAll(room, { t: 'phase2' }); }
    let near = null, md = Infinity;
    for (const p of arr) { if (p.dead) continue; const dx = p.x - b.x, dy = p.y - b.y, d = Math.sqrt(dx * dx + dy * dy); if (d < md) { md = d; near = p; } }
    if (near) {
      const dx = near.x - b.x, dy = near.y - b.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      // 최종보스: 스테이지마다 속도 증가, 페이즈2에서 더 빠름
      const bspd = b.isFinal
        ? (1.8 + (room.currentStage - 1) * 0.4) * (b.phase === 2 ? 1.5 : 1.0)
        : 1.4;
      b.x += dx / d * bspd * dt * 60; b.y += dy / d * bspd * dt * 60;
      if (d < b.r + 14) {
        const armor = near.armor || 0;
        const dmg = b.isFinal
          ? (1.2 + (room.currentStage - 1) * 0.3) * b.phase * (1 - armor)
          : 0.7 * (1 - armor);
        near.hp -= dmg * dt * 60;
        if (near.hp <= 0) { near.hp = 0; near.dead = true; }
      }
    }
    room.patT = (room.patT || 0) + dt;
    // 최종보스: 스테이지·페이즈마다 패턴 빈도 증가
    const patInterval = b.isFinal
      ? Math.max(0.6, 1.4 - (room.currentStage - 1) * 0.2 - (b.phase === 2 ? 0.4 : 0))
      : (b.phase === 1 ? 2.0 : 1.4);
    if (room.patT > patInterval) {
      room.patT = 0;
      const patCount = b.isFinal ? 5 : 3;
      bcastAll(room, { t: 'pat', i: (room.patI || 0) % patCount, bx: b.x, by: b.y, ang: b.ang, phase: b.phase, stage: room.currentStage, isFinal: b.isFinal });
      room.patI = (room.patI || 0) + 1;
    }
    // 최종보스 페이즈2: 주기적으로 추가 전방위 탄막
    if (b.isFinal && b.phase === 2) {
      room.extraPatT = (room.extraPatT || 0) + dt;
      if (room.extraPatT > 2.5) {
        room.extraPatT = 0;
        bcastAll(room, { t: 'pat', i: 1, bx: b.x, by: b.y, ang: b.ang + Math.PI / 4, phase: 2, stage: room.currentStage, isFinal: true });
      }
    }
  }

  // Sync ~20hz
  room.syncT = (room.syncT || 0) + dt;
  if (room.syncT > 0.05) {
    room.syncT = 0;
    const ps = [];
    room.players.forEach(p => ps.push({ id: p.id, x: Math.round(p.x), y: Math.round(p.y), hp: Math.round(p.hp), maxHp: p.maxHp, lv: p.lv, dead: p.dead, name: p.name, exp: p.exp, expNext: p.expNext, lvUp: p.lvUp, cls: p.cls }));
    room.players.forEach(p => { if (p.lvUp) p.lvUp = false; });
    bcastAll(room, {
      t: 'state', players: ps,
      enemies: room.enemies.filter(e => !e.dead).map(e => ({ id: e.id, x: Math.round(e.x), y: Math.round(e.y), hp: Math.round(e.hp), maxHp: Math.round(e.maxHp), type: e.type, r: e.r, shieldHp: e.shieldHp })),
      boss: room.boss && !room.boss.dead ? { x: Math.round(room.boss.x), y: Math.round(room.boss.y), hp: room.boss.hp, maxHp: room.boss.maxHp, phase: room.boss.phase, ang: room.boss.ang, isFinal: room.boss.isFinal } : null,
      st: room.stageTime, stage: room.currentStage
    });
  }

  const alive = arr.filter(p => !p.dead);
  if (alive.length === 0 && arr.length > 0) { bcastAll(room, { t: 'over', win: false }); clearInterval(room.tick); rooms.delete(code); }
}

// ── WebSocket handlers ─────────────────────────────────────
wss.on('connection', ws => {
  ws.pid = Math.random().toString(36).substr(2, 6);
  ws.roomCode = null;

  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }

    if (msg.t === 'create') {
      const code = genCode();
      rooms.set(code, {
        players: new Map(), enemies: [], boss: null,
        stageTime: 600, currentStage: 1, started: false,
        midBossSpawned: false, finalBossSpawned: false,
        midBossAlive: false, finalBossAlive: false,
        eid: 0, lastTick: Date.now(), readyCount: 0
      });
      ws.roomCode = code;
      rooms.get(code).players.set(ws, { id: ws.pid, x: 0, y: 0, hp: 100, maxHp: 100, lv: 1, exp: 0, expNext: 50, dead: false, name: msg.name || 'Player', lvUp: false, cls: null });
      ws.send(JSON.stringify({ t: 'created', code, id: ws.pid }));
      bcastAll(rooms.get(code), { t: 'lobby', players: [...rooms.get(code).players.values()].map(p => ({ id: p.id, name: p.name })) });
    }
    else if (msg.t === 'join') {
      const code = (msg.code || '').toUpperCase(), room = rooms.get(code);
      if (!room) { ws.send(JSON.stringify({ t: 'err', msg: '방을 찾을 수 없어요' })); return; }
      if (room.started) { ws.send(JSON.stringify({ t: 'err', msg: '이미 시작된 방이에요' })); return; }
      ws.roomCode = code;
      const idx = room.players.size, sp = [{ x: 0, y: 0 }, { x: 60, y: -40 }, { x: -60, y: 40 }, { x: 40, y: 60 }][idx % 4];
      room.players.set(ws, { id: ws.pid, x: sp.x, y: sp.y, hp: 100, maxHp: 100, lv: 1, exp: 0, expNext: 50, dead: false, name: msg.name || ('P' + (idx + 1)), lvUp: false, cls: null });
      ws.send(JSON.stringify({ t: 'joined', code, id: ws.pid }));
      bcastAll(room, { t: 'lobby', players: [...room.players.values()].map(p => ({ id: p.id, name: p.name })) });
    }
    else if (msg.t === 'start') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      // Trigger class select for all
      bcastAll(room, { t: 'classSelect' });
    }
    else if (msg.t === 'classReady') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p) return;
      p.cls = msg.cls || 'warrior';
      // 클래스별 초기 스탯을 서버에도 반영
      const clsHp = { warrior: 150, gunner: 80, mage: 65, assassin: 85 };
      const clsArmor = { warrior: 0.1, gunner: 0, mage: 0, assassin: 0 };
      const initHp = clsHp[p.cls] || 100;
      p.hp = initHp; p.maxHp = initHp;
      p.armor = clsArmor[p.cls] || 0;
      room.readyCount = (room.readyCount || 0) + 1;
      if (room.readyCount >= room.players.size) {
        room.started = true; room.lastTick = Date.now();
        bcastAll(room, { t: 'allReady' });
        room.tick = setInterval(() => tickRoom(ws.roomCode), 50);
      }
    }
    else if (msg.t === 'move') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p || p.dead) return;
      p.x = msg.x; p.y = msg.y;
    }
    else if (msg.t === 'hit') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      if (msg.target === 'boss') {
        if (room.boss && !room.boss.dead) {
          room.boss.hp -= msg.dmg;
          if (room.boss.hp <= 0) {
            room.boss.dead = true;
            const isFinal = room.boss.isFinal;
            if (isFinal) {
              // Stage clear
              if (room.currentStage < 3) {
                bcastAll(room, { t: 'stageClear', stage: room.currentStage, next: room.currentStage + 1 });
                setTimeout(() => {
                  room.currentStage++;
                  room.stageTime = 600;
                  room.midBossSpawned = false; room.finalBossSpawned = false;
                  room.midBossAlive = false; room.finalBossAlive = false;
                  room.boss = null; room.enemies = [];
                  bcastAll(room, { t: 'stageStart', stage: room.currentStage });
                }, 5500);
              } else {
                bcastAll(room, { t: 'over', win: true });
                clearInterval(room.tick); rooms.delete(ws.roomCode);
              }
            } else {
              // 중간보스 처치 → 일반 몬스터 재개, 타이머 계속 흘러 0초에 최종보스 등장
              room.midBossAlive = false;
              room.boss = null;
              bcastAll(room, { t: 'midBossDead' });
              bcastAll(room, { t: 'bossHp', hp: 0 });
            }
          } else {
            bcastAll(room, { t: 'bossHp', hp: room.boss.hp });
          }
        }
      } else {
        const e = room.enemies.find(e => e.id === msg.eid && !e.dead);
        if (e) {
          // Shield absorbs damage first
          let dmg = msg.dmg;
          if (e.shieldHp > 0) { const absorbed = Math.min(e.shieldHp, dmg); e.shieldHp -= absorbed; dmg -= absorbed; }
          e.hp -= dmg;
          if (e.hp <= 0) {
            e.dead = true;
            const sc = e.type === 'shield' ? 25 : e.type === 'fast' ? 15 : e.type === 'mage' ? 20 : 10;
            // 경험치 공유: 방의 모든 살아있는 플레이어에게 분배
            room.players.forEach((plr) => {
              if (plr.dead) return;
              plr.exp += Math.floor(sc / 2);
              if (plr.exp >= plr.expNext) { plr.lv++; plr.exp -= plr.expNext; plr.expNext = Math.floor(plr.expNext * 1.4); plr.maxHp += 20; plr.hp = Math.min(plr.hp + 30, plr.maxHp); plr.lvUp = true; }
            });
            bcastAll(room, { t: 'eDead', eid: e.id, x: e.x, y: e.y, sc });
          }
        }
      }
    }
    else if (msg.t === 'pause') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p) return;
      p.paused = true;
    }
    else if (msg.t === 'resume') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p) return;
      p.paused = false;
    }
    else if (msg.t === 'projHit') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p || p.dead) return;
      const dmg = (msg.dmg || 0) * (1 - (p.armor || 0));
      p.hp -= dmg;
      if (p.hp <= 0) { p.hp = 0; p.dead = true; }
    }
    else if (msg.t === 'regen') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p || p.dead) return;
      p.hp = Math.min(p.hp + (msg.amount || 0), p.maxHp);
    }
    else if (msg.t === 'atk') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      bcast(room, { t: 'fx', x: msg.x, y: msg.y, ax: msg.ax, ay: msg.ay, w: msg.w, cnt: msg.cnt }, ws);
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.roomCode); if (!room) return;
    room.players.delete(ws);
    if (room.players.size === 0) { clearInterval(room.tick); rooms.delete(ws.roomCode); }
    else bcastAll(room, { t: 'playerLeft', id: ws.pid });
  });
});

server.listen(PORT, () => console.log('Dark Survival → http://localhost:' + PORT));
