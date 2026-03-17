// dark-survival-final.js — node dark-survival-final.js
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
#stageBox{font-size:9px;color:#888;text-align:center;margin-top:2px;}
#stageVal{color:#88ccff;font-weight:bold;}
.hudR{text-align:right;font-size:10px;color:#888;}
.hudR span{color:#ccc;}
#bossBar{display:none;padding:4px 12px;text-align:center;}
#bossLbl{font-size:9px;color:#ff4444;letter-spacing:2px;margin-bottom:3px;animation:bp 1s infinite alternate;}
@keyframes bp{from{opacity:.6}to{opacity:1}}
#bossWrap{height:9px;background:#1a0000;border:1px solid #880000;border-radius:2px;overflow:hidden;max-width:280px;margin:0 auto;}
#bossFill{height:100%;background:#ff3300;transition:width .1s;}

#jsWrap{position:absolute;bottom:30px;left:30px;z-index:5;pointer-events:all;}
#jsBase{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.15);position:relative;touch-action:none;}
#jsKnob{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.25);border:2px solid rgba(255,255,255,0.4);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
#atkBtn{position:absolute;bottom:44px;right:80px;width:64px;height:64px;border-radius:50%;background:rgba(255,100,100,0.15);border:2px solid rgba(255,100,100,0.4);z-index:5;pointer-events:all;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;touch-action:manipulation;}
#atkBtn.pressing{background:rgba(255,100,100,0.35);}

#lobbyScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:20;padding:20px;overflow-y:auto;}
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

#classScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px;}
#classTitle{color:#ffcc00;font-size:18px;letter-spacing:3px;margin-bottom:4px;}
#classSub{color:#666;font-size:11px;margin-bottom:6px;}
#classCards{display:flex;flex-direction:column;gap:10px;width:100%;max-width:340px;}
.classCard{background:#0a0a1a;border:1px solid #2a2a3a;border-radius:10px;padding:14px 16px;cursor:pointer;touch-action:manipulation;transition:border-color .15s,background .15s;display:flex;align-items:center;gap:14px;}
.classCard:active,.classCard.sel{border-color:#ffcc00;background:#12120a;}
.classIcon{font-size:28px;min-width:36px;text-align:center;}
.classInfo{flex:1;}
.className{color:#ffcc00;font-size:14px;font-weight:bold;margin-bottom:3px;}
.classDesc{color:#777;font-size:10px;line-height:1.5;}
.classStat{color:#88aacc;font-size:9px;margin-top:4px;}
#classReady{margin-top:4px;}

#lvlUpScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:15;padding:20px;}
#lvlUpTitle{color:#ffcc00;font-size:18px;letter-spacing:3px;}
#lvlUpSub{color:#888;font-size:11px;}
#traitCards{display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;}
.traitCard{background:#0d0d1e;border:1px solid #333;border-radius:8px;padding:14px 16px;cursor:pointer;touch-action:manipulation;transition:border-color .1s;}
.traitCard:active{border-color:#ffcc00;background:#141420;}
.traitName{color:#ffcc00;font-size:13px;font-weight:bold;margin-bottom:4px;}
.traitDesc{color:#888;font-size:11px;line-height:1.5;}
.traitIcon{font-size:20px;margin-bottom:6px;}

#stageClearScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:18;}
#stageClearTitle{font-size:22px;color:#ffcc00;letter-spacing:4px;}
#stageClearSub{font-size:12px;color:#888;text-align:center;}
#stageClearTimer{font-size:28px;color:#fff;font-weight:bold;}

#goScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:20;}
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
#weaponElement{position:absolute;top:62px;left:12px;font-size:9px;color:#888;pointer-events:none;z-index:5;}
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
          <span id="hpTxt" style="font-size:10px;color:#cc4444;">100/100</span>
        </div>
        <div class="barOuter2"><div id="expFill" style="width:0%"></div></div>
        <div class="hs">Lv.<span id="lvTxt">1</span>&nbsp;<span id="killTxt" style="color:#ff8844;">0</span> kills</div>
      </div>
      <div id="timerBox">
        <div id="timerLbl">TIME</div>
        <div id="timerVal">10:00</div>
        <div id="stageBox">STAGE <span id="stageVal">1</span></div>
      </div>
      <div class="hudR">Wave <span id="waveTxt">1</span><br>Score <span id="scoreTxt">0</span></div>
    </div>
    <div id="bossBar"><div id="bossLbl">⚠ BOSS ⚠</div><div id="bossWrap"><div id="bossFill" style="width:100%"></div></div></div>
  </div>
  <div id="killFeed"></div>
  <div id="msgPop"></div>
  <div id="traitList"></div>
  <div id="classTag"></div>
  <div id="weaponElement"></div>
  <div id="jsWrap"><div id="jsBase"><div id="jsKnob"></div></div></div>
  <div id="atkBtn">⚔</div>

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

  <div id="classScreen">
    <div id="classTitle">직업 선택</div>
    <div id="classSub">전투 스타일을 고르세요</div>
    <div id="classCards">
      <div class="classCard" onclick="pickClass('warrior')">
        <div class="classIcon">⚔️</div>
        <div class="classInfo">
          <div class="className">검사</div>
          <div class="classDesc">강력한 근접 공격으로 적을 베어냅니다.<br>높은 체력과 넓은 광역 검격.</div>
          <div class="classStat">HP: ●●●●○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●○○○</div>
        </div>
      </div>
      <div class="classCard" onclick="pickClass('gunner')">
        <div class="classIcon">🔫</div>
        <div class="classInfo">
          <div class="className">저격수</div>
          <div class="classDesc">강력한 저격으로 원거리 적을 제압합니다.<br>높은 데미지와 긴 사거리.</div>
          <div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●●○○</div>
        </div>
      </div>
      <div class="classCard" onclick="pickClass('mage')">
        <div class="classIcon">✨</div>
        <div class="classInfo">
          <div class="className">마법사</div>
          <div class="classDesc">폭발하는 마법탄으로 광역 피해!<br>낮은 HP지만 강력한 범위 공격.</div>
          <div class="classStat">HP: ●○○○○ &nbsp; 공격: ●●●●● &nbsp; 속도: ●●●○○</div>
        </div>
      </div>
      <div class="classCard" onclick="pickClass('assassin')">
        <div class="classIcon">🗡️</div>
        <div class="classInfo">
          <div class="className">암살자</div>
          <div class="classDesc">빠른 이동속도와 높은 치명타.<br>리스크와 리워드가 모두 높음.</div>
          <div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●○○ &nbsp; 속도: ●●●●●</div>
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
</div>

<script>
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d'),G=document.getElementById('G');
let W=G.clientWidth,H=G.clientHeight;
canvas.width=W;canvas.height=H;

const WS_URL=(location.protocol==='https:'?'wss://':'ws://')+location.host;
let ws=null,myId=null,isHost=false,myClass=null,classReady=false;
function connect(cb){ws=new WebSocket(WS_URL);ws.onopen=cb;ws.onmessage=e=>handleMsg(JSON.parse(e.data));ws.onerror=()=>showErr('서버 연결 실패');}
function send(o){if(ws&&ws.readyState===1)ws.send(JSON.stringify(o));}
function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';}
function doCreate(){const name=document.getElementById('nameInp').value.trim()||'Player';connect(()=>send({t:'create',name}));}
function doJoin(){const name=document.getElementById('nameInp').value.trim()||'Player',code=document.getElementById('codeInp').value.toUpperCase();if(!code){showErr('코드 입력');return;}connect(()=>send({t:'join',code,name}));}
function doStart(){send({t:'start'});}

// ── Classes ──────────────────────────────────────────────────
const CLASSES={
  warrior:{name:'검사',icon:'⚔️',color:'#66ccff',
    stats:{hp:150,maxHp:150,spd:2.6,dmgMult:1.15,cdMult:1,rangeMult:1,regen:0.3,multishot:0,magnetRange:1,armor:0.1,crit:false},
    weapon:{name:'검',type:'sword',baseDmg:50,baseCd:480,baseRange:140,color:'#66ccff'}
  },
  gunner:{name:'저격수',icon:'🔫',color:'#ffee44',
    stats:{hp:80,maxHp:80,spd:3.0,dmgMult:1.3,cdMult:1.2,rangeMult:1.5,regen:0,multishot:0,magnetRange:1,armor:0,crit:false},
    weapon:{name:'저격총',type:'bullet',baseDmg:65,baseCd:900,baseRange:500,color:'#ffee44',spd:15}
  },
  mage:{name:'마법사',icon:'✨',color:'#cc88ff',
    stats:{hp:65,maxHp:65,spd:3.0,dmgMult:1.2,cdMult:1,rangeMult:1.1,regen:0,multishot:0,magnetRange:1,armor:0,crit:false},
    weapon:{name:'마법',type:'magic',baseDmg:55,baseCd:850,baseRange:300,color:'#cc88ff',spd:6,explosionRadius:80}
  },
  assassin:{name:'암살자',icon:'🗡️',color:'#ff88aa',
    stats:{hp:85,maxHp:85,spd:4.2,dmgMult:1.05,cdMult:0.88,rangeMult:1,regen:0,multishot:0,magnetRange:1,armor:0,crit:true},
    weapon:{name:'단검',type:'dagger',baseDmg:28,baseCd:280,baseRange:85,color:'#ff88aa',spd:12}
  }
};

let myTraits=[];
let myStats=null;
let myWeapon=null;
let weaponUpgradeLevel=0;
let weaponElement=null; // 'fire', 'poison', 'ice'

const ELEMENT_COLORS={fire:'#ff4400',poison:'#44ff44',ice:'#44ddff'};
const ELEMENT_NAMES={fire:'🔥 화염',poison:'☠ 독',ice:'❄ 냉기'};

function pickClass(cls){
  myClass=cls;
  document.querySelectorAll('.classCard').forEach(el=>el.classList.remove('sel'));
  event.currentTarget.classList.add('sel');
  document.getElementById('classReady').style.display='block';
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
  {id:'multishot',icon:'🔱',name:'다중사격',desc:'발사체 +1 (원거리)'},
  {id:'magnet',icon:'🧲',name:'자석',desc:'경험치 흡수 범위 3배'},
  {id:'armor',icon:'🛡',name:'갑옷',desc:'받는 피해 -20%'},
  {id:'crit',icon:'💥',name:'치명타',desc:'30% 확률로 2배 데미지'},
  {id:'weapon',icon:'🌟',name:'무기 강화',desc:'무기 성능 향상'},
];

function rollTraits(){
  const pool=[...ALL_TRAITS];
  if(weaponUpgradeLevel>=3)pool.splice(pool.findIndex(t=>t.id==='weapon'),1);
  const result=[];
  while(result.length<3&&pool.length>0){const i=Math.floor(Math.random()*pool.length);result.push(pool.splice(i,1)[0]);}
  return result;
}

function showTraitSelect(){
  if(!running)return;
  running=false;
  const traits=rollTraits();
  const cards=document.getElementById('traitCards');
  cards.innerHTML='';
  for(const tr of traits){
    const div=document.createElement('div');div.className='traitCard';
    let desc=tr.desc;
    if(tr.id==='weapon'){
      if(weaponUpgradeLevel===0)desc='무기 능력치 강화';
      else if(weaponUpgradeLevel===1)desc='속성 부여 (화염/독/냉기)';
      else if(weaponUpgradeLevel===2)desc='속성 2배 강화 + 이펙트';
    }
    div.innerHTML='<div class="traitIcon">'+tr.icon+'</div><div class="traitName">'+tr.name+'</div><div class="traitDesc">'+desc+'</div>';
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
  else if(id==='weapon'){
    weaponUpgradeLevel++;
    if(weaponUpgradeLevel===1){
      if(myWeapon.type==='sword'){
        myWeapon.baseDmg*=1.4;
        myWeapon.baseRange*=1.3;
      }else if(myWeapon.type==='bullet'){
        myWeapon.baseDmg*=1.2;
        myWeapon.baseCd*=0.8;
        myWeapon.spd*=1.2;
      }else if(myWeapon.type==='magic'){
        myWeapon.baseDmg*=1.5;
        myWeapon.explosionRadius*=1.4;
      }else if(myWeapon.type==='dagger'){
        myWeapon.baseDmg*=1.35;
        myWeapon.baseCd*=0.75;
        s.spd*=1.15;
      }
    }else if(weaponUpgradeLevel===2){
      const elements=['fire','poison','ice'];
      weaponElement=elements[Math.floor(Math.random()*3)];
      updateElementDisplay();
    }else if(weaponUpgradeLevel===3){
      // 속성 2배 강화
      updateElementDisplay();
    }
  }
}

function updateElementDisplay(){
  const el=document.getElementById('weaponElement');
  if(weaponElement){
    const name=ELEMENT_NAMES[weaponElement];
    const tier=weaponUpgradeLevel>=3?' ★★':'';
    el.innerHTML='<span style="color:'+ELEMENT_COLORS[weaponElement]+'">'+name+tier+'</span>';
  }else{
    el.innerHTML='';
  }
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
    count:1+(w.type!=='sword'&&w.type!=='dagger'&&w.type!=='magic'?s.multishot:0),
    crit:critHit
  };
}

// ── Game state ─────────────────────────────────────────────
let running=false,stageTime=600,currentStage=1,midBossSpawned=false,finalBossSpawned=false,bossAlive=false;
let kills=0,score=0,camX=0,camY=0;
let myPlayer=null,allPlayers=[],enemies=[],bossData=null,turrets=[];
let projs=[],parts=[],orbs=[],remoteEffects=[],explosions=[],fireZones=[];
let lastTime=0,jsActive=false,jsX=0,jsY=0,attackPressed=false,lastShot=0;

const STAGE_BG=['#080810','#100808','#080e0a'];
const STAGE_GRID=['#0d0d1a','#1a0808','#081408'];
const STAGE_NAMES=['어둠의 황야','혈염의 성','마계의 심연'];

function handleMsg(msg){
  if(msg.t==='created'){myId=msg.id;isHost=true;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='joined'){myId=msg.id;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('startBtn').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='lobby'){document.getElementById('playerListEl').innerHTML='참가자: '+msg.players.map(p=>'<b>'+p.name+'</b>').join(', ');}
  else if(msg.t==='err'){showErr(msg.msg);}
  else if(msg.t==='classSelect'){showClassScreen();}
  else if(msg.t==='allReady'){hideClassScreen();initGameState();}
  else if(msg.t==='start'){/* game loop starts after allReady */}
  else if(msg.t==='state'){applyState(msg);}
  else if(msg.t==='midBoss'){midBossSpawned=true;bossAlive=true;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='⚠ 중간 보스 ⚠';showPop('⚠ 중간 보스 등장!',3000);}
  else if(msg.t==='midBossDead'){bossAlive=false;document.getElementById('bossBar').style.display='none';showPop('중간 보스 처치!',3000);}
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
  else if(msg.t==='explosion'){explosions.push({x:msg.x,y:msg.y,r:msg.r,dmg:msg.dmg,life:300,maxLife:300,color:msg.color||'#cc88ff'});}
  else if(msg.t==='fireZone'){fireZones.push({x:msg.x,y:msg.y,dmg:msg.dmg,life:2000,maxLife:2000});}
  else if(msg.t==='turrets'){turrets=msg.turrets||[];}
  else if(msg.t==='turretHp'){const t=turrets.find(tt=>tt.id===msg.id);if(t)t.hp=msg.hp;}
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
  weaponUpgradeLevel=0;
  weaponElement=null;
  running=true;stageTime=600;currentStage=1;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;
  kills=0;score=0;projs=[];parts=[];orbs=[];remoteEffects=[];explosions=[];fireZones=[];turrets=[];
  myPlayer={x:0,y:0,hp:myStats.hp,maxHp:myStats.maxHp,lv:1,exp:0,expNext:50,dead:false};
  document.getElementById('classTag').innerHTML='<span>'+cls.icon+' '+cls.name+'</span>';
  document.getElementById('bossBar').style.display='none';
  G.style.background=STAGE_BG[0];
  updateTraitList();
  updateElementDisplay();
  lastTime=performance.now();
  requestAnimationFrame(loop);
}

function applyState(msg){
  allPlayers=msg.players||[];enemies=msg.enemies||[];
  bossData=msg.boss||null;stageTime=msg.st??stageTime;
  if(msg.stage)currentStage=msg.stage;
  if(msg.turrets)turrets=msg.turrets;
  const me=allPlayers.find(p=>p.id===myId);
  if(me&&myPlayer){
    myPlayer.hp=me.hp;
    myPlayer.maxHp=myStats.maxHp;
    myPlayer.lv=me.lv;myPlayer.dead=me.dead;
    myPlayer.exp=me.exp;myPlayer.expNext=me.expNext;
    if(me.lvUp)showTraitSelect();
  }
  if(me&&me.dead&&running){running=false;endGame(false);}
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
  bossData=null;enemies=[];projs=[];parts=[];orbs=[];explosions=[];fireZones=[];turrets=[];
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
  
  if(w.type==='magic'){
    const multishotCount=myStats.multishot;
    if(multishotCount>0){
      // 중앙탄 + 양옆 탄환
      projs.push({
        x:myPlayer.x,y:myPlayer.y,
        vx:Math.cos(ang)*(w.spd||6),
        vy:Math.sin(ang)*(w.spd||6),
        dmg:w.dmg,range:w.range,traveled:0,gone:false,
        color:w.color,r:9+weaponUpgradeLevel*3,enemy:false,
        isMagic:true,explosionRadius:w.explosionRadius||80,element:weaponElement
      });
      for(let i=1;i<=multishotCount;i++){
        const offset=i*0.3;
        projs.push({
          x:myPlayer.x,y:myPlayer.y,
          vx:Math.cos(ang+offset)*(w.spd||6),
          vy:Math.sin(ang+offset)*(w.spd||6),
          dmg:w.dmg,range:w.range,traveled:0,gone:false,
          color:w.color,r:9+weaponUpgradeLevel*3,enemy:false,
          isMagic:true,explosionRadius:w.explosionRadius||80,element:weaponElement
        });
        projs.push({
          x:myPlayer.x,y:myPlayer.y,
          vx:Math.cos(ang-offset)*(w.spd||6),
          vy:Math.sin(ang-offset)*(w.spd||6),
          dmg:w.dmg,range:w.range,traveled:0,gone:false,
          color:w.color,r:9+weaponUpgradeLevel*3,enemy:false,
          isMagic:true,explosionRadius:w.explosionRadius||80,element:weaponElement
        });
      }
    }else{
      projs.push({
        x:myPlayer.x,y:myPlayer.y,
        vx:Math.cos(ang)*(w.spd||6),
        vy:Math.sin(ang)*(w.spd||6),
        dmg:w.dmg,range:w.range,traveled:0,gone:false,
        color:w.color,r:9+weaponUpgradeLevel*3,enemy:false,
        isMagic:true,explosionRadius:w.explosionRadius||80,element:weaponElement
      });
    }
  }else{
    for(let i=0;i<w.count;i++){
      const a=ang+(i-(w.count-1)/2)*0.28;
      projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*(w.spd||7),vy:Math.sin(a)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:4+weaponUpgradeLevel,enemy:false,element:weaponElement});
    }
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:tx,ay:ty,w:myClass,cnt:w.count,element:weaponElement,elementTier:weaponUpgradeLevel});
}

function doMelee(ang,w){
  const isDagger=w.type==='dagger';
  const spread=isDagger?0.5:1.1,step=isDagger?0.18:0.2,pR=isDagger?4:5;
  let col=isDagger?'#ff88aacc':w.color;
  if(weaponElement&&weaponUpgradeLevel>=3)col=ELEMENT_COLORS[weaponElement];
  const effectMult=1+weaponUpgradeLevel*0.3;
  for(let a=ang-spread;a<=ang+spread;a+=step)
    for(let r=18;r<w.range*effectMult;r+=isDagger?12:14)
      parts.push({x:myPlayer.x+Math.cos(a)*r,y:myPlayer.y+Math.sin(a)*r,vx:0,vy:0,life:isDagger?120:160,maxLife:isDagger?120:160,r:pR+weaponUpgradeLevel,color:col});
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38},...turrets]:enemies;
  for(const e of allE){
    const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<w.range){const ea=Math.atan2(dy,dx),diff=Math.abs(((ea-ang)+Math.PI*3)%(Math.PI*2)-Math.PI);if(diff<(isDagger?0.6:1.3)){
      if(e.id==='boss')reportHit('boss',w.dmg,weaponElement);
      else if(e.isTurret)reportHit('turret',w.dmg,weaponElement,e.id);
      else reportHit(e.id,w.dmg,weaponElement);
    }}
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:myPlayer.x+Math.cos(ang)*60,ay:myPlayer.y+Math.sin(ang)*60,w:myClass,cnt:1,element:weaponElement,elementTier:weaponUpgradeLevel});
}

function reportHit(id,dmg,element,turretId){
  if(id==='boss')send({t:'hit',target:'boss',dmg,element,elementTier:weaponUpgradeLevel});
  else if(id==='turret')send({t:'hit',target:'turret',dmg,tid:turretId,element,elementTier:weaponUpgradeLevel});
  else send({t:'hit',eid:id,dmg,element,elementTier:weaponUpgradeLevel});
}

// ── Explosion ──────────────────────────────────────────────
function createExplosion(x,y,radius,dmg,color,element){
  explosions.push({x,y,r:radius,dmg,life:300,maxLife:300,color:color||'#cc88ff'});
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38},...turrets]:enemies;
  for(const e of allE){
    const dx=e.x-x,dy=e.y-y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<radius+(e.r||10)){
      const hitDmg=dmg*(1-d/(radius+(e.r||10))*0.5);
      if(e.id==='boss')reportHit('boss',hitDmg,element);
      else if(e.isTurret)reportHit('turret',hitDmg,element,e.id);
      else reportHit(e.id,hitDmg,element);
    }
  }
  send({t:'explosion',x,y,r:radius,dmg,color,element,elementTier:weaponUpgradeLevel});
}

// ── Boss patterns ──────────────────────────────────────────
function doBossPat(msg){
  const{i,bx,by,ang,phase,etype}=msg;
  if(i===-1){
    if(etype==='ranged'){
      mkBB(bx,by,Math.cos(ang)*4.5,Math.sin(ang)*4.5,12,'#ffaa44',5);
    }else if(etype==='mage'){
      for(let j=-1;j<=1;j++){
        const a=ang+j*0.4;
        mkBB(bx,by,Math.cos(a)*3.2,Math.sin(a)*3.2,15,'#dd44ff',6);
      }
    }
    return;
  }
  if(i===-2){
    // Heavy projectile
    mkBB(bx,by,Math.cos(ang)*2.8,Math.sin(ang)*2.8,35,'#ff2200',18);
    return;
  }
  [bossSpiral,bossBlast,bossCross,bossRapid,bossRing][Math.min(i,4)](bx,by,ang,phase);
}
function mkBB(bx,by,vx,vy,dmg,col,r){projs.push({x:bx,y:by,vx,vy,dmg,range:600,traveled:0,gone:false,color:col,r,enemy:true});}
function bossSpiral(bx,by,ang,phase){const cnt=phase===2?14:10;for(let i=0;i<cnt;i++){const a=(i/cnt)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*4.2,Math.sin(a)*4.2,18,'#ff6600',8);}}
function bossBlast(bx,by){for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2;mkBB(bx,by,Math.cos(a)*2.6,Math.sin(a)*2.6,22,'#ff2200',10);}spawnParts(bx,by,'#ff6600',16);}
function bossCross(bx,by,ang,phase){const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]];const cnt=phase===2?4:3;dirs.forEach(([dx,dy])=>{for(let n=0;n<cnt;n++)setTimeout(()=>mkBB(bx,by,dx*5.5,dy*5.5,20,'#cc44ff',7),n*150);});}
function bossRapid(bx,by){if(!myPlayer)return;const cnt=8;for(let n=0;n<cnt;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.6;mkBB(bx,by,Math.cos(a)*6.5,Math.sin(a)*6.5,16,'#ff4444',6);},n*90);}
function bossRing(bx,by,ang,phase){const cnt=phase===2?20:16;for(let i=0;i<cnt;i++){const a=(i/cnt)*Math.PI*2+ang*2,s=2.2+Math.random()*2.2;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,24,'#ffaa00',9);}}

// ── Remote FX ──────────────────────────────────────────────
function spawnRemoteFx(fx){
  const cls=CLASSES[fx.w]||CLASSES.warrior,wc=cls.weapon;
  if(wc.type==='sword'||wc.type==='dagger'){
    const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);
    for(let a=ang-0.9;a<=ang+0.9;a+=0.25)for(let r=22;r<80;r+=16)parts.push({x:fx.x+Math.cos(a)*r,y:fx.y+Math.sin(a)*r,vx:0,vy:0,life:140,maxLife:140,r:4,color:wc.color+'88'});
  }else if(wc.type==='magic'){
    const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);
    projs.push({x:fx.x,y:fx.y,vx:Math.cos(ang)*(wc.spd||6),vy:Math.sin(ang)*(wc.spd||6),dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:8,enemy:false,visual:true,isMagic:true});
  }else{
    const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x),cnt=fx.cnt||1;
    for(let i=0;i<cnt;i++){
      const a=ang+(i-(cnt-1)/2)*0.28;
      projs.push({x:fx.x,y:fx.y,vx:Math.cos(a)*(wc.spd||7),vy:Math.sin(a)*(wc.spd||7),dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:3,enemy:false,visual:true});
    }
  }
}

// ── Update ─────────────────────────────────────────────────
let regenTimer=0;
function update(dt){
  if(!running||!myPlayer||myPlayer.dead||!myStats)return;
  if(myStats.regen>0){regenTimer+=dt;if(regenTimer>1000){regenTimer=0;myPlayer.hp=Math.min(myPlayer.hp+myStats.regen,myPlayer.maxHp);}}
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
    if(p.traveled>p.range){
      if(p.isMagic&&!p.visual&&!p.enemy){
        createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);
        spawnParts(p.x,p.y,p.color,12);
      }
      p.gone=true;continue;
    }
    if(p.visual)continue;
    if(!p.enemy){
      for(const e of enemies){
        const dx=p.x-e.x,dy=p.y-e.y;
        if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){
          if(p.isMagic){
            createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);
            spawnParts(p.x,p.y,p.color,12);
          }else{
            reportHit(e.id,p.dmg,p.element);
            if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});
            spawnParts(p.x,p.y,p.color,4);
          }
          p.gone=true;break;
        }
      }
      if(!p.gone&&bossData){
        const dx=p.x-bossData.x,dy=p.y-bossData.y;
        if(Math.sqrt(dx*dx+dy*dy)<38+p.r){
          if(p.isMagic){
            createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);
            spawnParts(p.x,p.y,p.color,12);
          }else{
            reportHit('boss',p.dmg,p.element);
            if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});
            spawnParts(p.x,p.y,p.color,5);
          }
          p.gone=true;
        }
      }
      if(!p.gone){
        for(const t of turrets){
          const dx=p.x-t.x,dy=p.y-t.y;
          if(Math.sqrt(dx*dx+dy*dy)<t.r+p.r){
            if(p.isMagic){
              createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);
              spawnParts(p.x,p.y,p.color,12);
            }else{
              reportHit('turret',p.dmg,p.element,t.id);
              if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});
              spawnParts(p.x,p.y,p.color,5);
            }
            p.gone=true;break;
          }
        }
      }
    }else{
      if(myPlayer&&!myPlayer.dead){
        const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;
        if(Math.sqrt(dx*dx+dy*dy)<14+p.r){
          const dmg=p.dmg*(1-myStats.armor);
          myPlayer.hp-=dmg;
          if(myPlayer.hp<=0){myPlayer.hp=0;send({t:'playerDead'});}
          spawnParts(p.x,p.y,p.color,4);
          p.gone=true;
        }
      }
    }
  }
  projs=projs.filter(p=>!p.gone);
  for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
  parts=parts.filter(p=>p.life>0);
  if(parts.length>600)parts=parts.slice(-600);
  
  for(const ex of explosions){ex.life-=dt;}
  explosions=explosions.filter(ex=>ex.life>0);
  
  for(const fz of fireZones){fz.life-=dt;}
  fireZones=fireZones.filter(fz=>fz.life>0);
  
  const magnetR=28*myStats.magnetRange,pullR=100*myStats.magnetRange;
  for(const o of orbs){
    if(o.col)continue;
    const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<magnetR){o.col=true;score+=5;}else if(d<pullR){o.x-=dx/d*3;o.y-=dy/d*3;}
  }
  orbs=orbs.filter(o=>!o.col);
  const me=allPlayers.find(p=>p.id===myId)||myPlayer;
  const hpPct=Math.max(0,(myPlayer.hp/myPlayer.maxHp)*100);
  document.getElementById('hpFill').style.width=hpPct+'%';
  document.getElementById('hpTxt').textContent=Math.max(0,Math.floor(myPlayer.hp))+'/'+Math.floor(myPlayer.maxHp);
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
  drawGrid();drawFireZones();drawOrbs();drawParts();drawExplosions();drawEnemies();
  if(bossData)drawBoss();
  drawTurrets();
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
  const glow=14+weaponUpgradeLevel*4;
  ctx.shadowColor=cls.color;ctx.shadowBlur=glow;
  ctx.fillStyle=cls.color;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
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

const E_STYLES={
  basic:{fill:'#bb1111',eye:'#ff5555',shadow:'#ff2222'},
  ranged:{fill:'#bb4411',eye:'#ffaa44',shadow:'#ff8822'},
  shield:{fill:'#226688',eye:'#44bbff',shadow:'#2299ff'},
  fast:{fill:'#1144bb',eye:'#44aaff',shadow:'#2266ff'},
  mage:{fill:'#662288',eye:'#dd44ff',shadow:'#aa22ff'},
};
const E_ICONS={basic:'',ranged:'🎯',shield:'🛡',fast:'💨',mage:'🌀'};
const STATUS_ICONS={poison:'☠',ice:'❄',atkSlow:'⬇'};

function drawEnemies(){
  for(const e of enemies){
    const st=E_STYLES[e.type]||E_STYLES.basic;
    const r=e.r||10;
    ctx.save();
    ctx.shadowColor=st.shadow;ctx.shadowBlur=6;
    ctx.fillStyle=st.fill;ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);ctx.fill();
    if(e.type==='shield'&&e.shieldHp>0){
      ctx.strokeStyle='#44bbff88';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(e.x,e.y,r+4,0,Math.PI*2);ctx.stroke();
    }
    ctx.shadowBlur=0;ctx.fillStyle=st.eye;
    ctx.beginPath();ctx.arc(e.x-r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(e.x+r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#220000';ctx.fillRect(e.x-r,e.y-r-8,r*2,3);
    ctx.fillStyle=st.shadow;ctx.fillRect(e.x-r,e.y-r-8,r*2*(e.hp/e.maxHp),3);
    // Status icons
    let statusX=e.x+r+2;
    if(e.poison&&e.poison>0){ctx.font='8px serif';ctx.fillStyle='#44ff44';ctx.fillText(STATUS_ICONS.poison,statusX,e.y-r);statusX+=10;}
    if(e.ice){ctx.font='8px serif';ctx.fillStyle='#44ddff';ctx.fillText(STATUS_ICONS.ice,statusX,e.y-r);statusX+=10;}
    if(e.atkSlow){ctx.font='8px serif';ctx.fillStyle='#ffaa44';ctx.fillText(STATUS_ICONS.atkSlow,statusX,e.y-r);}
    if(E_ICONS[e.type]){ctx.font='8px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(E_ICONS[e.type],e.x,e.y+r+6);}
    ctx.restore();
  }
}

function drawBoss(){
  const b=bossData,t=performance.now()*0.003;
  const isFinal=b.isFinal||false;
  const baseColor=isFinal?(b.phase===1?'#880000':'#550033'):(b.phase===1?'#553300':'#333300');
  const coreColor=isFinal?'#ff4444':'#ffaa22';
  const orbColor=isFinal?'#ff2200':'#ffcc00';
  ctx.save();
  ctx.shadowColor=isFinal?'#ff2200':'#ff8800';ctx.shadowBlur=28;
  ctx.fillStyle=baseColor;ctx.beginPath();ctx.arc(b.x,b.y,42,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle=coreColor;ctx.beginPath();ctx.arc(b.x,b.y,24,0,Math.PI*2);ctx.fill();
  const ang=b.ang||t;ctx.fillStyle=orbColor;
  const orbCount=isFinal?8:6;
  for(let i=0;i<orbCount;i++){const a=ang+(i/orbCount)*Math.PI*2;ctx.beginPath();ctx.arc(b.x+Math.cos(a)*33,b.y+Math.sin(a)*33,7,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#fff';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
  ctx.fillText(isFinal?'☠ FINAL BOSS':'⚠ MID BOSS',b.x,b.y-48);
  if(b.phase===2){ctx.fillStyle='#ff4444';ctx.font='bold 8px monospace';ctx.fillText('PHASE 2',b.x,b.y+58);}
  ctx.restore();
}

function drawTurrets(){
  for(const t of turrets){
    ctx.save();
    ctx.fillStyle='#333344';
    ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#6666ff';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#8888ff';
    ctx.beginPath();ctx.arc(t.x,t.y,t.r*0.6,0,Math.PI*2);ctx.fill();
    // HP bar
    ctx.fillStyle='#220022';ctx.fillRect(t.x-t.r,t.y-t.r-10,t.r*2,4);
    ctx.fillStyle='#8888ff';ctx.fillRect(t.x-t.r,t.y-t.r-10,t.r*2*(t.hp/t.maxHp),4);
    ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillText('⚡',t.x,t.y-t.r-12);
    ctx.restore();
  }
}

function drawProjs(){
  for(const p of projs){
    ctx.save();
    const blur=p.visual?4:(p.isMagic?12:8);
    let col=p.color;
    if(p.element&&weaponUpgradeLevel>=2)col=ELEMENT_COLORS[p.element];
    ctx.shadowColor=col;ctx.shadowBlur=blur;
    ctx.globalAlpha=p.visual?0.6:1;
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    if(!p.visual&&!p.enemy&&weaponUpgradeLevel>=3&&p.isMagic){
      ctx.strokeStyle=col+'44';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r+3,0,Math.PI*2);ctx.stroke();
    }
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
function drawExplosions(){
  for(const ex of explosions){
    const a=ex.life/ex.maxLife;
    const cr=ex.r*(1-a*0.3);
    ctx.save();
    ctx.globalAlpha=a*0.7;
    ctx.shadowColor=ex.color;ctx.shadowBlur=20;
    ctx.strokeStyle=ex.color;ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(ex.x,ex.y,cr,0,Math.PI*2);ctx.stroke();
    ctx.globalAlpha=a*0.4;
    ctx.fillStyle=ex.color;
    ctx.beginPath();ctx.arc(ex.x,ex.y,cr*0.6,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}
function drawFireZones(){
  for(const fz of fireZones){
    const a=fz.life/fz.maxLife;
    ctx.save();
    ctx.globalAlpha=a*0.4;
    ctx.fillStyle='#ff4400';
    ctx.beginPath();ctx.arc(fz.x,fz.y,30,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=a*0.6;
    ctx.strokeStyle='#ff6600';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(fz.x,fz.y,30,0,Math.PI*2);ctx.stroke();
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

// ── SERVER ─────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
  res.end(HTML);
});

const wss = new WebSocketServer({ server });
const rooms = new Map();

function genCode() { return Math.random().toString(36).substr(2, 5).toUpperCase(); }
function bcast(room, msg, except) { const d = JSON.stringify(msg); room.players.forEach((_, ws) => { if (ws !== except && ws.readyState === 1) ws.send(d); }); }
function bcastAll(room, msg) { bcast(room, msg, null); }

const ETYPES = [
  { type: 'basic', spd: 1.0, hpMult: 1.0, r: 10, dmgMult: 1.0 },
  { type: 'ranged', spd: 0.65, hpMult: 0.75, r: 9, dmgMult: 0.8 },
  { type: 'shield', spd: 0.55, hpMult: 2.8, r: 14, dmgMult: 1.2, shieldHp: true },
  { type: 'fast', spd: 2.2, hpMult: 0.55, r: 8, dmgMult: 0.9 },
  { type: 'mage', spd: 0.7, hpMult: 0.85, r: 10, dmgMult: 1.1 },
];

const SPAWN_WEIGHTS = [
  [0.55, 0.2, 0.1, 0.1, 0.05],
  [0.35, 0.2, 0.15, 0.15, 0.15],
  [0.2, 0.2, 0.15, 0.2, 0.25],
];

function pickEtype(stage) {
  const w = SPAWN_WEIGHTS[Math.min(stage - 1, 2)];
  const r = Math.random(); let cum = 0;
  for (let i = 0; i < w.length; i++) { cum += w[i]; if (r < cum) return ETYPES[i]; }
  return ETYPES[0];
}

function spawnEnemies(room) {
  if (room.midBossAlive || room.finalBossAlive) return;
  const gameProgress = (600 - room.stageTime) / 600;
  const playerCount = room.players.size;
  const stageMult = room.currentStage;
  
  const difficultyMult = 1 + gameProgress * 1.5 + (playerCount - 1) * 0.4;
  const cnt = Math.max(1, Math.floor(difficultyMult * stageMult * 1.8));
  
  const arr = [...room.players.values()].filter(p => !p.dead);
  if (!arr.length) return;
  const ref = arr[Math.floor(Math.random() * arr.length)];
  
  for (let i = 0; i < cnt; i++) {
    const a = Math.random() * Math.PI * 2, r = 350 + Math.random() * 80;
    const et = pickEtype(room.currentStage);
    const baseHp = (20 + Math.random() * 15 * (1 + gameProgress * 2)) * stageMult * (1 + (playerCount - 1) * 0.3);
    const e = {
      id: room.eid++, x: ref.x + Math.cos(a) * r, y: ref.y + Math.sin(a) * r,
      hp: baseHp * et.hpMult, maxHp: baseHp * et.hpMult,
      spd: et.spd * (1 + (room.currentStage - 1) * 0.3 + gameProgress * 0.4),
      type: et.type, r: et.r, dead: false, lastShot: 0,
      shieldHp: et.shieldHp ? Math.floor(baseHp * 0.5) : 0,
      dmgMult: et.dmgMult * (1 + gameProgress * 0.3),
      poison: 0, ice: false, atkSlow: false
    };
    room.enemies.push(e);
  }
  if (room.enemies.length > 200) room.enemies = room.enemies.filter(e => !e.dead).slice(-200);
}

function spawnBoss(room, isFinal) {
  const arr = [...room.players.values()];
  const ref = arr[0] || { x: 0, y: 0 };
  const playerCount = room.players.size;
  const isF = isFinal;
  const baseHp = isF ? (4500 + room.currentStage * 800) : (2200 + room.currentStage * 400);
  const hp = baseHp * (1 + (playerCount - 1) * 0.5);
  
  room.boss = { 
    hp, maxHp: hp, x: ref.x + 320, y: ref.y, r: 42, dead: false, 
    ang: 0, phase: 1, isFinal: isF,
    playerCount: playerCount,
    lastHeavy: 0
  };
  room.enemies = [];
  
  if (isF) {
    // Spawn turrets
    const turretCount = 5 + playerCount;
    room.turrets = [];
    for (let i = 0; i < turretCount; i++) {
      const angle = (i / turretCount) * Math.PI * 2;
      const dist = 250 + Math.random() * 100;
      room.turrets.push({
        id: 'turret_' + i,
        x: ref.x + Math.cos(angle) * dist,
        y: ref.y + Math.sin(angle) * dist,
        hp: 5000,
        maxHp: 5000,
        r: 25,
        isTurret: true
      });
    }
    bcastAll(room, { t: 'finalBoss', boss: room.boss });
    bcastAll(room, { t: 'turrets', turrets: room.turrets });
  } else {
    room.midBossAlive = true;
    bcastAll(room, { t: 'midBoss', boss: room.boss });
  }
}

function tickRoom(code) {
  const room = rooms.get(code);
  if (!room || !room.started) return;
  const now = Date.now();
  const dt = Math.min((now - room.lastTick) / 1000, 0.1);
  room.lastTick = now;
  room.stageTime -= dt;

  if (!room.midBossAlive && !room.finalBossAlive) {
    room.spawnT = (room.spawnT || 0) + dt;
    if (room.spawnT > 0.7) { room.spawnT = 0; spawnEnemies(room); }
  }

  if (!room.midBossSpawned && room.stageTime <= 300) {
    room.midBossSpawned = true;
    spawnBoss(room, false);
  }

  if (room.midBossAlive) {
    room.stageTime = Math.max(room.stageTime, 0.1);
  }
  
  if (!room.finalBossSpawned && !room.midBossAlive && room.midBossSpawned && room.stageTime <= 0) {
    room.finalBossSpawned = true;
    room.stageTime = 0;
    spawnBoss(room, true);
  }

  const arr = [...room.players.values()];

  // Enemy AI
  for (const e of room.enemies) {
    if (e.dead) continue;
    
    // Poison damage
    if (e.poison > 0) {
      e.hp -= e.maxHp * 0.004 * e.poison * dt;
      if (e.hp <= 1) e.hp = 1;
    }
    
    let near = null, md = Infinity;
    for (const p of arr) { 
      if (p.dead) continue; 
      const dx = p.x - e.x, dy = p.y - e.y, d = Math.sqrt(dx * dx + dy * dy); 
      if (d < md) { md = d; near = p; } 
    }
    if (!near) continue;
    const dx = near.x - e.x, dy = near.y - e.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    
    const spdMult = e.ice ? 0.7 : 1;

    if (e.type === 'ranged') {
      if (d > 180) { e.x += dx / d * e.spd * spdMult * dt * 60; e.y += dy / d * e.spd * spdMult * dt * 60; }
      else if (d < 120) { e.x -= dx / d * e.spd * spdMult * dt * 60; e.y -= dy / d * e.spd * spdMult * dt * 60; }
      e.lastShot += dt;
      const shootCd = e.atkSlow ? 3.3 : 2.2;
      if (e.lastShot > shootCd) { 
        e.lastShot = 0; 
        bcastAll(room, { t: 'pat', i: -1, bx: e.x, by: e.y, ang: Math.atan2(dy, dx), phase: 0, etype: 'ranged' }); 
      }
    } else if (e.type === 'mage') {
      if (d > 220) { e.x += dx / d * e.spd * spdMult * dt * 60; e.y += dy / d * e.spd * spdMult * dt * 60; }
      else if (d < 160) { e.x -= dx / d * e.spd * 0.8 * spdMult * dt * 60; e.y -= dy / d * e.spd * 0.8 * spdMult * dt * 60; }
      e.lastShot += dt;
      const shootCd = e.atkSlow ? 4.2 : 2.8;
      if (e.lastShot > shootCd) { 
        e.lastShot = 0; 
        bcastAll(room, { t: 'pat', i: -1, bx: e.x, by: e.y, ang: Math.atan2(dy, dx), phase: 0, etype: 'mage' }); 
      }
    } else {
      e.x += dx / d * e.spd * spdMult * dt * 60; e.y += dy / d * e.spd * spdMult * dt * 60;
    }
    
    const dmgMult = e.ice ? 0.7 : 1;
    if (d < e.r + 14) { 
      near.hp -= 0.35 * e.dmgMult * dmgMult * dt * 60; 
      if (near.hp < 0) near.hp = 0; 
    }
  }

  // Boss AI
  if (room.boss && !room.boss.dead) {
    const b = room.boss;
    b.ang += dt * 1.5;
    const halfHp = b.maxHp / 2;
    if (b.hp < halfHp && b.phase === 1) { b.phase = 2; bcastAll(room, { t: 'phase2' }); }
    
    // Turret regen
    if (b.isFinal && room.turrets && room.turrets.some(t => !t.dead && t.hp > 0)) {
      b.hp = Math.min(b.hp + b.maxHp * 0.01 * dt, b.maxHp);
    }
    
    let near = null, md = Infinity;
    for (const p of arr) { 
      if (p.dead) continue; 
      const dx = p.x - b.x, dy = p.y - b.y, d = Math.sqrt(dx * dx + dy * dy); 
      if (d < md) { md = d; near = p; } 
    }
    if (near) {
      const dx = near.x - b.x, dy = near.y - b.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      const bspd = b.isFinal ? 2.0 : 1.6;
      b.x += dx / d * bspd * dt * 60; b.y += dy / d * bspd * dt * 60;
      const contactDmg = b.isFinal ? (b.phase === 1 ? 0.4 : 0.6) : (b.phase === 1 ? 0.3 : 0.45);
      if (d < b.r + 14) { 
        near.hp -= contactDmg * dt * 60; 
        if (near.hp < 0) near.hp = 0; 
      }
      
      // Heavy projectile
      b.lastHeavy = (b.lastHeavy || 0) + dt;
      if (b.lastHeavy > 4) {
        b.lastHeavy = 0;
        bcastAll(room, { t: 'pat', i: -2, bx: b.x, by: b.y, ang: Math.atan2(dy, dx), phase: b.phase });
      }
    }
    
    room.patT = (room.patT || 0) + dt;
    const patInterval = b.isFinal ? (b.phase === 1 ? 1.3 : 0.9) : (b.phase === 1 ? 1.8 : 1.3);
    if (room.patT > patInterval) {
      room.patT = 0;
      bcastAll(room, { t: 'pat', i: (room.patI || 0) % (b.phase === 1 ? 3 : 5), bx: b.x, by: b.y, ang: b.ang, phase: b.phase });
      room.patI = (room.patI || 0) + 1;
    }
  }

  room.syncT = (room.syncT || 0) + dt;
  if (room.syncT > 0.05) {
    room.syncT = 0;
    const ps = [];
    room.players.forEach(p => ps.push({ 
      id: p.id, x: Math.round(p.x), y: Math.round(p.y), hp: p.hp, maxHp: p.maxHp, 
      lv: p.lv, dead: p.dead, name: p.name, exp: p.exp, expNext: p.expNext, lvUp: p.lvUp, cls: p.cls 
    }));
    room.players.forEach(p => { if (p.lvUp) p.lvUp = false; });
    bcastAll(room, {
      t: 'state', players: ps,
      enemies: room.enemies.filter(e => !e.dead).map(e => ({ 
        id: e.id, x: Math.round(e.x), y: Math.round(e.y), hp: Math.round(e.hp), 
        maxHp: Math.round(e.maxHp), type: e.type, r: e.r, shieldHp: e.shieldHp,
        poison: e.poison, ice: e.ice, atkSlow: e.atkSlow
      })),
      boss: room.boss && !room.boss.dead ? { 
        x: Math.round(room.boss.x), y: Math.round(room.boss.y), hp: room.boss.hp, 
        maxHp: room.boss.maxHp, phase: room.boss.phase, ang: room.boss.ang, isFinal: room.boss.isFinal 
      } : null,
      turrets: room.turrets ? room.turrets.filter(t => t.hp > 0).map(t => ({
        id: t.id, x: t.x, y: t.y, hp: t.hp, maxHp: t.maxHp, r: t.r, isTurret: true
      })) : [],
      st: room.stageTime, stage: room.currentStage
    });
  }

  const alive = arr.filter(p => !p.dead);
  if (alive.length === 0 && arr.length > 0) { 
    bcastAll(room, { t: 'over', win: false }); 
    clearInterval(room.tick); 
    rooms.delete(code); 
  }
}

wss.on('connection', ws => {
  ws.pid = Math.random().toString(36).substr(2, 6);
  ws.roomCode = null;

  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }

    if (msg.t === 'create') {
      const code = genCode();
      rooms.set(code, {
        players: new Map(), enemies: [], boss: null, turrets: [],
        stageTime: 600, currentStage: 1, started: false,
        midBossSpawned: false, finalBossSpawned: false,
        midBossAlive: false, finalBossAlive: false,
        eid: 0, lastTick: Date.now(), readyCount: 0
      });
      ws.roomCode = code;
      rooms.get(code).players.set(ws, { 
        id: ws.pid, x: 0, y: 0, hp: 100, maxHp: 100, lv: 1, exp: 0, expNext: 50, 
        dead: false, name: msg.name || 'Player', lvUp: false, cls: null 
      });
      ws.send(JSON.stringify({ t: 'created', code, id: ws.pid }));
      bcastAll(rooms.get(code), { t: 'lobby', players: [...rooms.get(code).players.values()].map(p => ({ id: p.id, name: p.name })) });
    }
    else if (msg.t === 'join') {
      const code = (msg.code || '').toUpperCase(), room = rooms.get(code);
      if (!room) { ws.send(JSON.stringify({ t: 'err', msg: '방을 찾을 수 없어요' })); return; }
      if (room.started) { ws.send(JSON.stringify({ t: 'err', msg: '이미 시작된 방이에요' })); return; }
      ws.roomCode = code;
      const idx = room.players.size, sp = [{ x: 0, y: 0 }, { x: 60, y: -40 }, { x: -60, y: 40 }, { x: 40, y: 60 }][idx % 4];
      room.players.set(ws, { 
        id: ws.pid, x: sp.x, y: sp.y, hp: 100, maxHp: 100, lv: 1, exp: 0, expNext: 50, 
        dead: false, name: msg.name || ('P' + (idx + 1)), lvUp: false, cls: null 
      });
      ws.send(JSON.stringify({ t: 'joined', code, id: ws.pid }));
      bcastAll(room, { t: 'lobby', players: [...room.players.values()].map(p => ({ id: p.id, name: p.name })) });
    }
    else if (msg.t === 'start') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      bcastAll(room, { t: 'classSelect' });
    }
    else if (msg.t === 'classReady') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      const p = room.players.get(ws); if (!p) return;
      p.cls = msg.cls || 'warrior';
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
      const element = msg.element;
      const tier = msg.elementTier || 0;
      
      if (msg.target === 'boss') {
        if (room.boss && !room.boss.dead) {
          room.boss.hp -= msg.dmg;
          if (room.boss.hp <= 0) {
            room.boss.dead = true;
            const isFinal = room.boss.isFinal;
            if (isFinal) {
              if (room.currentStage < 3) {
                bcastAll(room, { t: 'stageClear', stage: room.currentStage, next: room.currentStage + 1 });
                setTimeout(() => {
                  room.currentStage++;
                  room.stageTime = 600;
                  room.midBossSpawned = false; room.finalBossSpawned = false;
                  room.midBossAlive = false; room.finalBossAlive = false;
                  room.boss = null; room.enemies = []; room.turrets = [];
                  bcastAll(room, { t: 'stageStart', stage: room.currentStage });
                }, 5500);
              } else {
                bcastAll(room, { t: 'over', win: true });
                clearInterval(room.tick); rooms.delete(ws.roomCode);
              }
            } else {
              room.midBossAlive = false;
              room.boss = null;
              bcastAll(room, { t: 'midBossDead' });
              bcastAll(room, { t: 'bossHp', hp: 0 });
            }
          } else {
            bcastAll(room, { t: 'bossHp', hp: room.boss.hp });
          }
        }
      } else if (msg.target === 'turret') {
        const t = room.turrets ? room.turrets.find(tt => tt.id === msg.tid) : null;
        if (t && t.hp > 0) {
          t.hp -= msg.dmg;
          if (t.hp <= 0) t.hp = 0;
          bcastAll(room, { t: 'turretHp', id: t.id, hp: t.hp });
        }
      } else {
        const e = room.enemies.find(e => e.id === msg.eid && !e.dead);
        if (e) {
          let dmg = msg.dmg;
          if (e.shieldHp > 0) { 
            const absorbed = Math.min(e.shieldHp, dmg); 
            e.shieldHp -= absorbed; 
            dmg -= absorbed; 
          }
          
          // Apply element effects
          if (element === 'poison' && tier >= 2) {
            e.poison = Math.min(e.poison + 1, 5);
          } else if (element === 'ice' && tier >= 2) {
            e.ice = true;
            e.atkSlow = true;
          }
          
          e.hp -= dmg;
          if (e.hp <= 0) {
            e.dead = true;
            const h = room.players.get(ws);
            if (h) {
              const sc = e.type === 'shield' ? 25 : e.type === 'fast' ? 15 : e.type === 'mage' ? 20 : 10;
              h.exp += Math.floor(sc / 2);
              if (h.exp >= h.expNext) { 
                h.lv++; 
                h.exp -= h.expNext; 
                h.expNext = Math.floor(h.expNext * 1.4); 
                h.maxHp += 15; // Reduced from 20
                h.hp = Math.min(h.hp + 20, h.maxHp); // Reduced from 30
                h.lvUp = true; 
              }
              bcastAll(room, { t: 'eDead', eid: e.id, x: e.x, y: e.y, sc });
            }
          }
        }
      }
    }
    else if (msg.t === 'atk') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      bcast(room, { t: 'fx', x: msg.x, y: msg.y, ax: msg.ax, ay: msg.ay, w: msg.w, cnt: msg.cnt }, ws);
    }
    else if (msg.t === 'explosion') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      bcast(room, { t: 'explosion', x: msg.x, y: msg.y, r: msg.r, dmg: msg.dmg, color: msg.color }, ws);
    }
    else if (msg.t === 'fireZone') {
      const room = rooms.get(ws.roomCode); if (!room) return;
      bcast(room, { t: 'fireZone', x: msg.x, y: msg.y, dmg: msg.dmg }, ws);
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.roomCode); if (!room) return;
    room.players.delete(ws);
    if (room.players.size === 0) { clearInterval(room.tick); rooms.delete(ws.roomCode); }
    else bcastAll(room, { t: 'playerLeft', id: ws.pid });
  });
});

server.listen(PORT, () => console.log('Dark Survival Final → http://localhost:' + PORT));
