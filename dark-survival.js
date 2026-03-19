// dark-survival-final.js
const http = require('http');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 3000;

const HTML = `<!DOCTYPE html>
<html lang='ko'>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>Dark Survival</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:#000;overflow:hidden;font-family:monospace;}
#G{position:relative;width:100vw;height:100vh;background:#080810;overflow:hidden;touch-action:none;}
canvas{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;touch-action:none;}
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
#jsWrap{position:absolute;bottom:30px;left:30px;z-index:5;pointer-events:none;}
#jsBase{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.15);position:relative;touch-action:none;}
#jsKnob{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.25);border:2px solid rgba(255,255,255,0.4);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
#js2Wrap{position:absolute;bottom:30px;right:30px;z-index:5;pointer-events:none;}
#js2Base{width:100px;height:100px;border-radius:50%;background:rgba(255,100,100,0.06);border:2px solid rgba(255,100,100,0.2);position:relative;touch-action:none;}
#js2Knob{width:42px;height:42px;border-radius:50%;background:rgba(255,100,100,0.3);border:2px solid rgba(255,100,100,0.5);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
#js2Wrap .js2Icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:18px;pointer-events:none;z-index:1;}
#statsPanel{position:absolute;top:48px;right:12px;font-size:9px;color:#666;pointer-events:none;z-index:5;background:rgba(0,0,0,0.5);padding:6px 8px;border-radius:4px;border:1px solid #333;line-height:14px;display:none;}
#statsPanel .statLine{display:flex;justify-content:space-between;gap:8px;}
#statsPanel .statName{color:#888;}
#statsPanel .statVal{color:#ffcc00;font-weight:bold;}
#autoAimBtn{position:absolute;right:12px;top:230px;z-index:6;pointer-events:all;width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,0.65);border:2px solid #444;display:none;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;}
#autoAimBtn .aaIcon{font-size:20px;line-height:1;}
#autoAimBtn .aaLabel{font-size:7px;color:#666;margin-top:2px;font-family:monospace;}
#autoAimBtn.on{border-color:#44ff88;}
#autoAimBtn.on .aaLabel{color:#44ff88;}
#lobbyScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:20;padding:20px;overflow-y:auto;pointer-events:all;touch-action:auto;}
#lobbyScreen input,#lobbyScreen button,#lobbyScreen .btn{touch-action:manipulation;pointer-events:all;}
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
#classScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.96);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px;pointer-events:all;touch-action:auto;}
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
#lvlUpScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:15;padding:20px;pointer-events:all;touch-action:auto;}
#lvlUpTitle{color:#ffcc00;font-size:18px;letter-spacing:3px;}
#lvlUpSub{color:#888;font-size:11px;}
#traitCards{display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;}
.traitCard{background:#0d0d1e;border:1px solid #333;border-radius:8px;padding:14px 16px;cursor:pointer;touch-action:manipulation;transition:border-color .1s;}
.traitCard:active{border-color:#ffcc00;background:#141420;}
.traitName{color:#ffcc00;font-size:13px;font-weight:bold;margin-bottom:4px;}
.traitDesc{color:#888;font-size:11px;line-height:1.5;}
.traitIcon{font-size:20px;margin-bottom:6px;}
#stageClearScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:18;pointer-events:all;touch-action:auto;}
#stageClearTitle{font-size:22px;color:#ffcc00;letter-spacing:4px;}
#stageClearSub{font-size:12px;color:#888;text-align:center;}
#stageClearTimer{font-size:28px;color:#fff;font-weight:bold;}
#goScreen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:20;pointer-events:all;touch-action:auto;}
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
#minimap{position:absolute;top:80px;left:12px;width:120px;height:120px;background:rgba(0,0,0,0.7);border:2px solid #333;border-radius:8px;pointer-events:none;z-index:5;}
</style>
</head>
<body>
<div id="G">
  <canvas id="c"></canvas>
  <div id="hud">
    <div id="topRow">
      <div class="hudL">
        <div style="display:flex;gap:6px;align-items:center;"><span style="font-size:9px;color:#aa3333;">HP</span><div class="barOuter"><div id="hpFill" style="width:100%"></div></div><span id="hpTxt" style="font-size:10px;color:#cc4444;">100/100</span></div>
        <div class="barOuter2"><div id="expFill" style="width:0%"></div></div>
        <div class="hs">Lv.<span id="lvTxt">1</span>&nbsp;<span id="killTxt" style="color:#ff8844;">0</span> kills</div>
      </div>
      <div id="timerBox"><div id="timerLbl">TIME</div><div id="timerVal">10:00</div><div id="stageBox">STAGE <span id="stageVal">1</span></div></div>
      <div class="hudR">Wave <span id="waveTxt">1</span><br>Score <span id="scoreTxt">0</span></div>
    </div>
    <div id="bossBar"><div id="bossLbl">⚠ BOSS ⚠</div><div id="bossWrap"><div id="bossFill" style="width:100%"></div></div></div>
  </div>
  <div id="killFeed"></div><div id="msgPop"></div><div id="traitList"></div><div id="classTag"></div><div id="weaponElement"></div>
  <div id="statsPanel"></div>
  <div id="autoAimBtn" class="on"><span class="aaIcon">🎯</span><span class="aaLabel">AUTO</span></div>
  <div id="minimap"><canvas id="minimapCanvas" width="120" height="120"></canvas></div>
  <div id="jsWrap"><div id="jsBase"><div id="jsKnob"></div></div></div>
  <div id="js2Wrap"><div id="js2Base"><span class="js2Icon">⚔</span><div id="js2Knob"></div></div></div>
  <div id="lobbyScreen">
    <h1 class="title">DARK SURVIVAL</h1>
    <p class="sub">3스테이지 · 보스 처치 · 최대 4인</p>
    <input class="inp" id="nameInp" placeholder="닉네임" maxlength="10"/>
    <div style="display:flex;gap:8px;margin-top:4px;"><button class="btn" onclick="doCreate()">방 만들기</button><button class="btn btn2" onclick="showJoin()">입장하기</button></div>
    <div id="joinRow" style="display:none;flex-direction:column;align-items:center;gap:8px;margin-top:4px;"><input class="inp" id="codeInp" placeholder="방 코드 5자리" maxlength="5" style="letter-spacing:4px;text-transform:uppercase;"/><button class="btn" onclick="doJoin()">입장</button></div>
    <div id="waitRoom" style="display:none;flex-direction:column;align-items:center;gap:10px;margin-top:4px;"><p style="color:#555;font-size:10px;">친구에게 코드를 알려주세요</p><div id="codeDisplay">----</div><div id="playerListEl"></div><button class="btn" id="startBtn" onclick="doStart()">▶ 게임 시작</button></div>
    <div id="errMsg"></div>
  </div>
  <div id="classScreen">
    <div id="classTitle">직업 선택</div><div id="classSub">전투 스타일을 고르세요</div>
    <div id="classCards">
      <div class="classCard" onclick="pickClass('warrior')"><div class="classIcon">⚔️</div><div class="classInfo"><div class="className">검사</div><div class="classDesc">강력한 근접 공격으로 적을 베어냅니다.<br>높은 체력과 넓은 광역 검격.</div><div class="classStat">HP: ●●●●○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●○○○</div></div></div>
      <div class="classCard" onclick="pickClass('gunner')"><div class="classIcon">🔫</div><div class="classInfo"><div class="className">저격수</div><div class="classDesc">강력한 저격으로 원거리 적을 제압합니다.<br>높은 데미지와 긴 사거리.</div><div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●●○○</div></div></div>
      <div class="classCard" onclick="pickClass('mage')"><div class="classIcon">✨</div><div class="classInfo"><div class="className">마법사</div><div class="classDesc">폭발하는 마법탄으로 광역 피해!<br>낮은 HP지만 강력한 범위 공격.</div><div class="classStat">HP: ●○○○○ &nbsp; 공격: ●●●●● &nbsp; 속도: ●●●○○</div></div></div>
      <div class="classCard" onclick="pickClass('assassin')"><div class="classIcon">🗡️</div><div class="classInfo"><div class="className">암살자</div><div class="classDesc">빠른 이동속도와 높은 치명타.<br>리스크와 리워드가 모두 높음.</div><div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●○○ &nbsp; 속도: ●●●●●</div></div></div>
    </div>
    <button class="btn" id="classReady" style="display:none;" onclick="doReady()">준비 완료</button>
  </div>
  <div id="lvlUpScreen"><div id="lvlUpTitle">LEVEL UP!</div><div id="lvlUpSub">특성을 선택하세요</div><div id="traitCards"></div></div>
  <div id="stageClearScreen"><div id="stageClearTitle">STAGE CLEAR!</div><div id="stageClearSub"></div><div id="stageClearTimer">3</div></div>
  <div id="goScreen"><div id="goTitle"></div><div id="goStats"></div><button class="btn" style="margin-top:8px;" onclick="location.reload()">다시 시작</button></div>
</div>
<script>
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d'),G=document.getElementById('G');
const minimapCanvas=document.getElementById('minimapCanvas'),minimapCtx=minimapCanvas.getContext('2d');
let W=G.clientWidth,H=G.clientHeight;

// ── 스프라이트 로드 ──────────────────────────────────────────
const SPRITES={};
(function(){
  const data={
    warrior:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByElEQVR4nGNgIBFoqOn+J0cOF2AiVQO1wdByACyIsQU1Pjl8gJEYReam9iTHLQMDA8PJ0wfh5p84fBZuhoWtMVx8wKOAhRTF79+/JUqdoKAw0WYOeAgMuAOIioLbt69jFZeWlmNgYGBgePr0EYr4mzevqOsABgYGhm0s/1D4Xn8wAw9djQU1HUAOqK1owpp9kcWJdgA2HxNSk43E3rp1K1Y9eB1gY+Xy/8ixPfBCAxbn6ABdHD1N4AM4S0IbKxd4MF27dgmvA9ABzAFaWnpwscy0NDg7OiEMf0mIbDnMoHcfXsE1/f79CyuGgXcfXjEiW44PYDgA3XJC4pSqxUgD3759w6rwxw+EOBMT9gT59+8fBgYGBoZ3794wcHBwkecAQkDmyR3syRkKnsioeJNi3oAXxQPuAJKjADmIk57fZ2BgYGCYJ6lIfQcgZysGBgYGZmYWeCIjBJiZWTD0E+2AcxeOMTIwMDDoapuQ1QwjFVBUGVES9CQ7wPHhDZIM3i+vQZS6wZsLvn37QpHBxOofvCGADnZIKGCIebx4gFOOgcgsO3hD4O79GyiNFTUVHYxyYdKXL4wMDAwMagwMGHLo+hmwqGFgYGAAAKXnl5qbxCY2AAAAAElFTkSuQmCC',
    gunner:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABL0lEQVR4nO1XLRPCMAwtHDMzM5iYmhr0zAwaAwKN4qeh0BNgMJgZDBozUzMzMzNTMdR2FNou5eMywVNtL3tJX5JdyhgxRljD6RQaH+KyLFDcYx/SX4A8AKtMnAtN8rquvYjDMNT2UuZGX+QKTLCGzzf6FtBdwBhjMyFQnXDLzXKbgFagxS6KuvW2qqxnWJDXAHkAXjVw4BxVAysp0bzDVmC93mg3vlwyFGmSzLV9mu6tfsgV8G7DFstFrO2Pp+tbPMNVAIA3jzl/zmsfHr8F4E1RmDvDWhwAuJbDgjQAIUS3zrKz5vOnNQAADAC0szhOtIsNtwi/Cdc0Ra6A81dsG8WDIDDaK6WM564RnVyBfwBvdYFS6iWvvk83dACRZRovkXZVz3uGPAXOALAv3E847ixTUZC3hwAVAAAAAElFTkSuQmCC',
    mage:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaUlEQVR4nO2XsW6DMBCGr4YSCyEhRagvQAa/Rudk6N65W9WHqbp1q5S9Q7pV6mswlDdAlZAQogl2O4EwOPSwkzpDbjrjw/f5/BsbAEML/PDH5H1yiOQmEEYAhzBtgP6sdaugBbAvmQ7ExZTgMJijEuTFF3pc6xpQkvo0UM700vVQg3LBQQg+eF5WxSAfugKEONjQSfEudkAhONT1Dpkcv7KTRLiJohts7CrLXjFx1kV4BkCL0MQ2UfTZ+KssW3T79opwHl4NvgXb3TcqoUdnrf9CRLpkLG7ab0mSdiGOugT95AAAS8bibkWOBsC3NSrOugiVGlCdeo7jShq4j0Kp/ynLW9+js7YCa0pGNYAGuKZysZjvS+2kLKX2RyVaf01J2vj9XfAv2/C2EjGA+p5gXQPoCryX8knI/PH+xooyHz3w0BrgigsGxrQAumb64/EXwOlrQHW3a+yBiDsAgEdBnnUBrFfgDGAd4Be/V3aMSULt/QAAAABJRU5ErkJggg==',
    assassin:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABiElEQVR4nGNgGGDASIwifn6h/+QY/vHjO4LmM5FjMDXBqAMIxpGQkBhZ8Q8D7969wmvHgIcACymKv337QpQ6Li4eos0cWiHAwMDA0MfDdRLGLvryzRyXGLFgwENgwB2AN4u4OXrDs+DJc8dJMtjcyBLO3rV/K057BjwEiE6EE7nYSTJ4GZHqcIYAcvBTCvCZhTcEkOP9JAP+UHjz+zc8Kzb//mfOgKQXOT2gA7yJkJR2QC0rE6oDkAC+dsHQSYTowNFIGlXg8nPaO0BZEncls0yECxHsz4mrtEh2ADlg6YIZDAwMDBhpyScwjJGgA7hYUZPI8zffGCRFuPBa+PzNNwx9+ACGA7asX4Xh2tTULIbPP34zMDAwMHx+8pGBgYGB4RaUxgZ4OViJdgCKU1MCbP5vWDiJYcPCSUQbQCmgeRpITc1ieP7mDc5yAEMCWxT4BIYx8vDwE10offnykagOD1YH4AID6gARIeyW//gFoTnYsOt7846wQwa8KB7aDvjy5SMjKfGNDQAAnbxwyc6xh0gAAAAASUVORK5CYII=',
    midboss:'data:image/png;base64,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',
    necromancer:'data:image/png;base64,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'
  };
  for(const[name,src]of Object.entries(data)){
    SPRITES[name]=new Image();
    SPRITES[name].src=src;
  }
})();

// ── 던전 타일 ────────────────────────────────────────────────
const DUNGEON_TILES=[];
(function(){
  const srcs=[
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVR4nGOUkVL4z4ADfPv2jYGBgYGBi4sLlxIGFgYGBgZ2dg68BrCwsGKV//PnNwMTXDHTl63fmL5sxWkVDsBEWAl+wAJjcP3j8SbHAIpdQLEBjEICYjijkS4uYOHh4cUp+e/fXwZWVjYau4BYhV8ZP0+Hsbn/82ZSzQWUR6OcjDLOaKRLIAIADn0d3mL45ZAAAAAASUVORK5CYII=', // base
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/0lEQVR4nKWSwUoDMRCGvw27tsQtLR48SBFhH8fXEEoLfQFhMVWP3gRFvfgSvfgs7huIxVrnYt31lCXuJlXpDz/JTP6ZyUwSDQ+OKgIQEQC01iEJMUCn092YII4T7/l6/YmqxWo1F7WaB0sFoH6XbEZsN7pMj7dK0ER+elK4trm4y3w6bwvNYACTj1o+ACUiLBavNW3wZGp+VJxMTWbyUbFcvmEpIrA32K9cPj5cPetuWlk27aZepWkPlwA316YIrf3+AJfR4TBr/cTzs7G339nlfWuQ3lcQkRef/yN6fwLYrXrjeog+4X/gbcGiLL9Ikh1b/db63Rv8OUEIW7fwDdPPcsWwA+UZAAAAAElFTkSuQmCC', // skull
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABN0lEQVR4nKWSv0vDQBTHv0l7XkiRajmEahEhCBXqoEsHJ+fO+SP825wzOznUQQcLVkQHly6hoTV9tKRJnN7RS9MW8bu8H/e+H94dZ7WOz3JsEBEBAFzX3TSCKgBI6WwFVKui9Hy5TGDrYTsOyI4DXZ9QIDtOUOosbsASnlQJkn5CScg92XECfKO3EyA8qQBAtRVGz6O1wcplpc95+pp2ObdXh1RbAQCa103FvcVg3mNz3auvwQxAOAx1FK5Qi8Fcr85mjhpARIiiMeKnn+4qhGvW5HNixOl0AiKC1Tg4Mv6Be1W755xeZj7nhzcNvXb0ONZw67TlaUB2nmkzS3wJP7/IH7Thzbo1rlA0FLVqLqt3AnbJANgftm+evudmXSLjDYrKshRC7Blr0zAe1vL9uz8Btunfb/AL2iB4pI70PjEAAAAASUVORK5CYII=', // mold
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDklEQVR4nJVTO2tCMRT+Eu5VCT4v4vMigv+g/6Cbk0PB2R/h7+jcubNbQejg3qU4OwsiheDgI5Qao0O5IaaJ134QSM53Ht85h5C41T3DAyEEAIAx5nNBAADZbO5mgiAInbyUR1DtTPdTQfdTbykPaLoLMNisJ4PNeuLiSNzqnu0WHr+WWgmjVJjcW9QcJncpj78zcAXei9QWuJRagVk9AYnKNb3Gp5/rIQqluB3wniuOvAq4UgvzuBT1v7ev5jvI5wsAgAe+eradBcAZULXtpVLZreAefNQ7/hbSMGtUxIHsXkybXuO82h7bbXxGjXEYZgAAduCfBEmSK1adUlWRTtzz/kalTkgU+PDvIdq4AOOgW+AYQPcbAAAAAElFTkSuQmCC', // blood
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAElEQVR4nK2T0W6CMBSGP0DBMU1IBWqMF76eT+ST+E4iSproWNJ5ZDeTMbHRZfuTpjmnp+d8f5N6i/my4UvGGJIkuYbUdQ1AHMe45ANE0YgoGqH1DGNMG181GAzvrrYBQO2fNrV/2rgm7felm6ArrWcUxdaJfCtvMV82XdzutCAIALDWkqZZ7/L5/NEnABAR0jRDRBCRttFTFopii9azliAIAkTEbUEledNNWGsJw7BX6MrftfAbDcbjSS9ZVQeUmnK5CMPh99Sy3JFl+WMCpaZU1eEpgqctvHnHdXd/2ECpKcaYNq5376s4f1nf1v39EV0HVXX48TMBXpvJ6t8JPgGirVOmtxJ2jgAAAABJRU5ErkJggg==' // crack
  ];
  srcs.forEach(src=>{const img=new Image();img.src=src;DUNGEON_TILES.push(img);});
})();

// 타일 인덱스 결정 (시드 기반 - 위치마다 고정된 패턴)
function getTileIdx(tx,ty){
  const h=((tx*73856093)^(ty*19349663))>>>0;
  const r=h%200;
  if(r<1)return 1;   // 해골 0.5%
  if(r<3)return 2;   // 곰팡이 1%
  if(r<4)return 3;   // 핏자국 0.5%
  if(r<6)return 4;   // 균열 1%
  return 0;          // 기본 97%
}
canvas.width=W;canvas.height=H;
const WS_URL=(location.protocol==='https:'?'wss://':'ws://')+location.host;
let ws=null,myId=null,isHost=false,myClass=null;
let _wsHeartbeat=null;
function connect(cb){
  ws=new WebSocket(WS_URL);
  ws.onopen=()=>{
    // heartbeat 시작 (15초마다 ping)
    if(_wsHeartbeat)clearInterval(_wsHeartbeat);
    _wsHeartbeat=setInterval(()=>{
      if(ws&&ws.readyState===1)ws.send(JSON.stringify({t:'ping'}));
    },15000);
    cb();
  };
  ws.onmessage=e=>{try{handleMsg(JSON.parse(e.data));}catch(err){console.warn('[msg err]',err);}};
  ws.onerror=()=>showErr('서버 연결 실패');
  ws.onclose=(e)=>{
    if(_wsHeartbeat){clearInterval(_wsHeartbeat);_wsHeartbeat=null;}
    // 게임 중이었으면 연결 끊김 알림
    if(running){
      running=false;
      showPop('⚠ 서버 연결이 끊겼습니다. 새로고침 해주세요.',5000);
      document.getElementById('errMsg').textContent='연결 끊김 ('+e.code+')';
    }
  };
}
let _lastMoveSend=0;
function send(o){
  if(!ws||ws.readyState!==1)return;
  // move 메시지는 50ms(20fps) throttle - 서버 부하 감소
  if(o.t==='move'){
    const now=performance.now();
    if(now-_lastMoveSend<50)return;
    _lastMoveSend=now;
  }
  ws.send(JSON.stringify(o));
}
function showErr(m){document.getElementById('errMsg').textContent=m;}
function showJoin(){document.getElementById('joinRow').style.display='flex';}
function doCreate(){const name=document.getElementById('nameInp').value.trim()||'Player';connect(()=>send({t:'create',name}));}
function doJoin(){const name=document.getElementById('nameInp').value.trim()||'Player',code=document.getElementById('codeInp').value.toUpperCase();if(!code){showErr('코드 입력');return;}connect(()=>send({t:'join',code,name}));}
function doStart(){send({t:'start'});}

const CLASSES={
  warrior:{name:'검사',icon:'⚔️',color:'#66ccff',stats:{hp:150,maxHp:150,spd:2.6,dmgMult:1.15,cdMult:1,rangeMult:1,regen:2.0,multishot:0,magnetRange:1,armor:0.15,crit:false,critRate:0,expMult:1},weapon:{name:'검',type:'sword',baseDmg:15,baseCd:1000,baseRange:140,color:'#66ccff'}},
  gunner:{name:'저격수',icon:'🔫',color:'#ffee44',stats:{hp:80,maxHp:80,spd:3.0,dmgMult:1.3,cdMult:1,rangeMult:1.5,regen:0.5,multishot:0,magnetRange:1,armor:0,crit:false,critRate:0,expMult:1},weapon:{name:'저격총',type:'bullet',baseDmg:90,baseCd:1000,baseRange:500,color:'#ffee44',spd:20}},
  mage:{name:'마법사',icon:'✨',color:'#cc88ff',stats:{hp:65,maxHp:65,spd:3.0,dmgMult:1.2,cdMult:1,rangeMult:1.1,regen:0.7,multishot:0,magnetRange:1,armor:0,crit:false,critRate:0,expMult:1},weapon:{name:'마법',type:'magic',baseDmg:50,baseCd:850,baseRange:300,color:'#cc88ff',spd:6,explosionRadius:80}},
  assassin:{name:'암살자',icon:'🗡️',color:'#ff88aa',stats:{hp:85,maxHp:85,spd:4.2,dmgMult:1.05,cdMult:0.88,rangeMult:1,regen:0.2,multishot:0,magnetRange:1,armor:0,crit:true,critRate:40,expMult:1},weapon:{name:'단검',type:'dagger',baseDmg:28,baseCd:280,baseRange:90,color:'#ff88aa',spd:12}}
};
let myTraits=[],myStats=null,myWeapon=null,weaponUpgradeLevel=0,weaponElement=null;
const ELEMENT_COLORS={fire:'#ff4400',poison:'#44ff44',ice:'#44ddff'};
const ELEMENT_NAMES={fire:'🔥 화염',poison:'☠ 독',ice:'❄ 냉기'};

function pickClass(cls){myClass=cls;document.querySelectorAll('.classCard').forEach(el=>el.classList.remove('sel'));event.currentTarget.classList.add('sel');document.getElementById('classReady').style.display='block';const icons={warrior:'⚔',gunner:'🔫',mage:'✨',assassin:'🗡'};document.querySelector('#js2Wrap .js2Icon').textContent=icons[cls]||'⚔';}
function doReady(){if(!myClass)return;send({t:'classReady',cls:myClass});document.getElementById('classReady').disabled=true;document.getElementById('classReady').textContent='대기중...';}

const ALL_TRAITS=[
  {id:'hp',icon:'❤',name:'강철 체력',desc:'최대 HP +{value}, 즉시 회복',min:5,max:40},
  {id:'spd',icon:'💨',name:'질풍',desc:'이동속도 +{value}%',min:3,max:15},
  {id:'dmg',icon:'⚔',name:'살육자',desc:'모든 무기 데미지 +{value}%',min:3,max:15},
  {id:'cd',icon:'⚡',name:'신속',desc:'공격속도 +{value}%',min:3,max:15},
  {id:'range',icon:'🎯',name:'저격수',desc:'사거리 +{value}%',min:5,max:30},
  {id:'regen',icon:'🌿',name:'재생',desc:'초당 HP {value} 회복',min:0.1,max:1},
  {id:'multishot',icon:'🔱',name:'다중사격',desc:'발사체 +1'},
  {id:'magnet',icon:'📘',name:'수학의 정석',desc:'받는 경험치 +{value}%',min:5,max:20},
  {id:'armor',icon:'🛡',name:'갑옷',desc:'받는 피해 -{value}%',min:2,max:5},
  {id:'crit',icon:'💥',name:'치명타',desc:'치명타율 +{value}%',min:3,max:15},
  {id:'weapon',icon:'🌟',name:'무기 강화',desc:'무기 성능 향상'},
];
function getTraitGrade(trait,value){if(!trait.min||!trait.max||value===undefined)return'';const n=(value-trait.min)/(trait.max-trait.min);if(n>=0.9)return'S';if(n>=0.75)return'A';if(n>=0.5)return'B';if(n>=0.25)return'C';return'D';}

function rollTraits(){
  const pool=[...ALL_TRAITS];
  let multishotTrait=null;const mi=pool.findIndex(t=>t.id==='multishot');if(mi!==-1)multishotTrait=pool.splice(mi,1)[0];
  let weaponTrait=null;const wi=pool.findIndex(t=>t.id==='weapon');if(wi!==-1){if(weaponUpgradeLevel>=3)pool.splice(wi,1);else weaponTrait=pool.splice(wi,1)[0];}
  const ai=pool.findIndex(t=>t.id==='armor');if(ai!==-1&&myStats.armor>=0.8)pool.splice(ai,1);
  const ci=pool.findIndex(t=>t.id==='crit');if(ci!==-1&&myStats.critRate>=100)pool.splice(ci,1);
  const result=[];let multishotUsed=false;
  while(result.length<3&&(pool.length>0||weaponTrait||(!multishotUsed&&multishotTrait))){
    const roll=Math.random();
    if(multishotTrait&&!multishotUsed&&roll<0.01){result.push({...multishotTrait});multishotUsed=true;}
    else if(weaponTrait&&!result.find(t=>t.id==='weapon')&&roll<0.02){result.push({...weaponTrait});weaponTrait=null;}
    else if(pool.length>0){const i=Math.floor(Math.random()*pool.length);const trait=pool.splice(i,1)[0];if(trait.min!==undefined&&trait.max!==undefined){if(trait.id==='regen')trait.value=Math.round((trait.min+Math.random()*(trait.max-trait.min))*10)/10;else trait.value=Math.floor(trait.min+Math.random()*(trait.max-trait.min+1));}result.push(trait);}
    else break;
  }
  if(result.length<3&&weaponTrait&&!result.find(t=>t.id==='weapon'))result.push(weaponTrait);
  return result;
}

let localLvUpQueue=0;

function showTraitSelect(){
  if(document.getElementById('goScreen').style.display==='flex')return;
  if(document.getElementById('stageClearScreen').style.display==='flex')return;
  // [FIX] 이미 특성창 열려있으면 로컬 큐에 쌓기 (return 후 무시하지 않음)
  if(document.getElementById('lvlUpScreen').style.display==='flex'){
    localLvUpQueue++;return;
  }
  _openTraitSelect();
}

function _openTraitSelect(){
  running=false;invincible=true;invincibleEnd=Infinity;send({t:'invincible',start:true});
  const traits=rollTraits();const cards=document.getElementById('traitCards');cards.innerHTML='';
  for(const tr of traits){
    const div=document.createElement('div');div.className='traitCard';
    let desc=tr.desc;if(tr.value!==undefined)desc=desc.replace('{value}',tr.value);
    if(tr.id==='weapon'){if(weaponUpgradeLevel===0)desc='무기 능력치 강화';else if(weaponUpgradeLevel===1)desc='속성 부여 (화염/독/냉기)';else if(weaponUpgradeLevel===2)desc='속성 2배 강화 + 이펙트';}
    const g=getTraitGrade(tr,tr.value);const gc={S:'#ff6b6b',A:'#ffa500',B:'#ffd700',C:'#90ee90',D:'#87ceeb'};
    const gb=g?' <span style="color:'+gc[g]+';font-weight:bold;">['+g+']</span>':'';
    div.innerHTML='<div class="traitIcon">'+tr.icon+'</div><div class="traitName">'+tr.name+gb+'</div><div class="traitDesc">'+desc+'</div>';
    div.onclick=()=>pickTrait(tr);cards.appendChild(div);
  }
  document.getElementById('lvlUpTitle').textContent='LEVEL UP!';document.getElementById('lvlUpSub').textContent='특성을 선택하세요';
  document.getElementById('lvlUpScreen').style.display='flex';
}

function pickTrait(tr){
  document.getElementById('lvlUpScreen').style.display='none';
  myTraits.push(tr.id);applyTrait(tr.id,tr.value);updateTraitList();updateStatsPanel();
  send({t:'traitPicked',trait:tr.id,value:tr.value});
  invincibleEnd=performance.now()+2000;
  // [FIX] 로컬 큐에 쌓인 레벨업이 있으면 즉시 다음 특성창 열기
  if(localLvUpQueue>0){
    localLvUpQueue--;
    setTimeout(()=>_openTraitSelect(),50);
  }else{
    running=true;
    send({t:'lvUpReady'});
  }
}

function applyTrait(id,value){
  const s=myStats;
  if(id==='hp'){const hpInc=value||40;s.maxHp+=hpInc;s.hp=Math.min(s.hp+hpInc,s.maxHp);send({t:'updateMaxHp',maxHp:s.maxHp,hp:s.hp});}
  else if(id==='spd')s.spd*=(1+(value||20)/100);
  else if(id==='dmg')s.dmgMult*=(1+(value||25)/100);
  else if(id==='cd')s.cdMult*=(1-(value||20)/100);
  else if(id==='range')s.rangeMult*=(1+(value||30)/100);
  else if(id==='regen'){let r=value||0.5;if(myClass==='mage'||myClass==='gunner')r*=0.5;s.regen+=r;send({t:'updateRegen',regen:s.regen});}
  else if(id==='multishot')s.multishot+=1;
  else if(id==='magnet'){s.expMult*=(1+(value||10)/100);send({t:'updateExpMult',expMult:s.expMult});}
  else if(id==='armor'){s.armor=Math.min(s.armor+(value||20)/100,0.8);send({t:'updateArmor',armor:s.armor});}
  else if(id==='crit'){s.critRate+=(value||30);if(s.critRate>100){const ov=s.critRate-100;s.dmgMult*=(1+ov/100);s.critRate=100;}send({t:'updateCritRate',critRate:s.critRate});}
  else if(id==='weapon'){
    weaponUpgradeLevel++;
    if(weaponUpgradeLevel===1){if(myWeapon.type==='sword'){myWeapon.baseDmg*=1.4;myWeapon.baseRange*=1.3;}else if(myWeapon.type==='bullet'){myWeapon.baseDmg*=1.2;myWeapon.baseCd*=0.8;myWeapon.spd*=1.2;}else if(myWeapon.type==='magic'){myWeapon.baseDmg*=1.5;myWeapon.explosionRadius*=1.4;}else if(myWeapon.type==='dagger'){myWeapon.baseDmg*=1.35;myWeapon.baseCd*=1.15;s.spd*=1.15;}}
    else if(weaponUpgradeLevel===2){weaponElement=['fire','poison','ice'][Math.floor(Math.random()*3)];updateElementDisplay();}
    else if(weaponUpgradeLevel===3)updateElementDisplay();
    updateStatsPanel();
  }
}

function updateElementDisplay(){const el=document.getElementById('weaponElement');if(weaponElement){const tier=weaponUpgradeLevel>=3?' ★★':'';el.innerHTML='<span style="color:'+ELEMENT_COLORS[weaponElement]+'">'+ELEMENT_NAMES[weaponElement]+tier+'</span>';}else el.innerHTML='';}
function updateTraitList(){const el=document.getElementById('traitList');if(myTraits.length===0){el.innerHTML='';return;}el.innerHTML=myTraits.map(id=>{const tr=ALL_TRAITS.find(t=>t.id===id);return tr?'<span>'+tr.icon+' '+tr.name+'</span>':'';}).join('<br>');}
function updateStatsPanel(){
  if(!myStats||!myWeapon)return;
  const s=myStats,w=myWeapon;
  document.getElementById('statsPanel').innerHTML=
    '<div class="statLine"><span class="statName">공격력</span><span class="statVal">'+(w.baseDmg*s.dmgMult).toFixed(1)+'</span></div>'+
    '<div class="statLine"><span class="statName">공속</span><span class="statVal">'+(100/s.cdMult).toFixed(0)+'%</span></div>'+
    '<div class="statLine"><span class="statName">이속</span><span class="statVal">'+s.spd.toFixed(1)+'</span></div>'+
    '<div class="statLine"><span class="statName">방어력</span><span class="statVal">'+(s.armor*100).toFixed(0)+'%</span></div>'+
    '<div class="statLine"><span class="statName">재생</span><span class="statVal">'+s.regen.toFixed(1)+'/s</span></div>'+
    '<div class="statLine"><span class="statName">치명타</span><span class="statVal">'+s.critRate.toFixed(0)+'%</span></div>'+
    '<div class="statLine"><span class="statName">경험치</span><span class="statVal">+'+((s.expMult-1)*100).toFixed(0)+'%</span></div>'+
    '<div class="statLine"><span class="statName">다중사격</span><span class="statVal">+'+s.multishot+'</span></div>';
}
function getW(){const w=myWeapon,s=myStats;const critHit=s.critRate>0&&Math.random()<(s.critRate/100);return{...w,dmg:w.baseDmg*s.dmgMult*(critHit?2:1),cd:w.baseCd*s.cdMult,range:w.baseRange*s.rangeMult,count:1+s.multishot,crit:critHit};}

let running=false,stageTime=600,currentStage=1,midBossSpawned=false,finalBossSpawned=false,bossAlive=false;
let bossWarning=null; // {x,y,isFinal,countdown,startTime}
let kills=0,score=0,camX=0,camY=0;
let myPlayer=null,allPlayers=[],enemies=[],bossData=null,turrets=[];
let projs=[],parts=[],orbs=[],remoteEffects=[],explosions=[],fireZones=[];
let lastTime=0,jsActive=false,jsX=0,jsY=0,attackPressed=false,lastShot=0;
let invincible=false,invincibleEnd=0;
const STAGE_BG=['#080810','#100808','#080e0a'];
const STAGE_GRID=['#0d0d1a','#1a0808','#081408'];
const STAGE_NAMES=['어둠의 황야','혈염의 성','마계의 심연'];
const MAP_SIZE=3500;

function showGameUI(){canvas.style.pointerEvents='all';document.getElementById('jsWrap').style.pointerEvents='all';document.getElementById('js2Wrap').style.pointerEvents='all';document.getElementById('statsPanel').style.display='block';document.getElementById('autoAimBtn').style.display='flex';}
function hideGameUI(){canvas.style.pointerEvents='none';document.getElementById('jsWrap').style.pointerEvents='none';document.getElementById('js2Wrap').style.pointerEvents='none';document.getElementById('statsPanel').style.display='none';document.getElementById('autoAimBtn').style.display='none';}

function handleMsg(msg){
  if(msg.t==='created'){myId=msg.id;isHost=true;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='joined'){myId=msg.id;document.getElementById('codeDisplay').textContent=msg.code;document.getElementById('joinRow').style.display='none';document.getElementById('startBtn').style.display='none';document.getElementById('waitRoom').style.display='flex';}
  else if(msg.t==='lobby'){document.getElementById('playerListEl').innerHTML='참가자: '+msg.players.map(p=>'<b>'+p.name+'</b>').join(', ');}
  else if(msg.t==='err'){showErr(msg.msg);}
  else if(msg.t==='classSelect'){showClassScreen();}
  else if(msg.t==='allReady'){hideClassScreen();initGameState();}
  else if(msg.t==='state'){applyState(msg);}
  else if(msg.t==='lvUp'){showTraitSelect();}
  else if(msg.t==='bossWarning'){
    bossWarning={x:msg.x,y:msg.y,isFinal:msg.isFinal,startTime:performance.now()};
    bossAlive=true; // 맵제한 미리 적용 (5초 후 실제 등장 전에 경계 활성화)
    const ARENA=800;
    if(myPlayer){
      const d=Math.sqrt(myPlayer.x*myPlayer.x+myPlayer.y*myPlayer.y);
      if(d>ARENA*0.7){
        const a=Math.atan2(myPlayer.y,myPlayer.x);
        myPlayer.x=Math.cos(a)*ARENA*0.6;
        myPlayer.y=Math.sin(a)*ARENA*0.6;
      }
    }
    showPop(msg.isFinal?'☠ 최종 보스 5초 후 등장!':'⚠ 중간 보스 5초 후 등장!',5500);
    let cd=4;
    const cdInt=setInterval(()=>{
      if(cd>0){showPop(cd+'....',1100);cd--;}
      else clearInterval(cdInt);
    },1000);
  }
  else if(msg.t==='midBoss'){midBossSpawned=true;bossAlive=true;bossWarning=null;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='⚠ 중간 보스 ⚠';showPop('⚠ 중간 보스 등장!',3000);}
  else if(msg.t==='midBossDead'){
    bossAlive=false;document.getElementById('bossBar').style.display='none';showPop('중간 보스 처치!',3000);
    myStats.multishot+=1;updateTraitList();updateStatsPanel();showPop('🔱 다중사격 획득!',2000);
    if(weaponUpgradeLevel<3){setTimeout(()=>{running=false;const wt={id:'weapon',icon:'🌟',name:'무기 강화',desc:'무기 성능 향상'};const cards=document.getElementById('traitCards');cards.innerHTML='';const div=document.createElement('div');div.className='traitCard';let desc=weaponUpgradeLevel===0?'무기 능력치 강화':weaponUpgradeLevel===1?'속성 부여 (화염/독/냉기)':'속성 2배 강화 + 이펙트';div.innerHTML='<div class="traitIcon">'+wt.icon+'</div><div class="traitName">'+wt.name+'</div><div class="traitDesc">'+desc+'</div>';div.onclick=()=>pickTrait(wt);cards.appendChild(div);document.getElementById('lvlUpTitle').textContent='보스 보상!';document.getElementById('lvlUpSub').textContent='무기가 강화됩니다';document.getElementById('lvlUpScreen').style.display='flex';},1000);}
  }
  else if(msg.t==='finalBoss'){finalBossSpawned=true;bossAlive=true;bossWarning=null;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='☠ 최종 보스 ☠';showPop('☠ 최종 보스 등장!',3000);}
  else if(msg.t==='finalBossDead'){bossAlive=false;document.getElementById('bossBar').style.display='none';showPop('최종 보스 처치!',3000);myStats.multishot+=1;updateTraitList();updateStatsPanel();showPop('🔱 다중사격 획득!',2000);}
  else if(msg.t==='phase2'){showPop('PHASE 2!',1500);}
  else if(msg.t==='bossHp'){if(bossData)bossData.hp=msg.hp;}
  else if(msg.t==='pat'){doBossPat(msg);}
  else if(msg.t==='eDead'){spawnParts(msg.x,msg.y,'#ff8844',8);kills++;score+=msg.sc||10;addKf('+'+(msg.sc||10));}
  else if(msg.t==='playerLeft'){showPop('플레이어 퇴장',1200);}
  else if(msg.t==='stageClear'){showStageClear(msg.stage,msg.next);}
  else if(msg.t==='stageStart'){nextStage(msg.stage);}
  else if(msg.t==='over'){endGame(msg.win);}
  else if(msg.t==='statSync'){if(myStats){if(msg.armor!==undefined)myStats.armor=msg.armor;if(msg.regen!==undefined)myStats.regen=msg.regen;updateStatsPanel();}}
  else if(msg.t==='revived'){showPop('💚 부활했습니다!',2000);if(myPlayer){myPlayer.groggy=false;myPlayer.dead=false;}}
  else if(msg.t==='groggyDead'){if(myPlayer&&myPlayer.groggy){running=false;endGame(false);}}
  else if(msg.t==='fx'){remoteEffects.push(msg);}
  else if(msg.t==='explosion'){explosions.push({x:msg.x,y:msg.y,r:msg.r,dmg:msg.dmg,life:300,maxLife:300,color:msg.color||'#cc88ff'});}
  else if(msg.t==='fireZone'){fireZones.push({x:msg.x,y:msg.y,dmg:msg.dmg,life:2000,maxLife:2000});}
  else if(msg.t==='turrets'){turrets=msg.turrets||[];}
  else if(msg.t==='turretHp'){const t=turrets.find(tt=>tt.id===msg.id);if(t)t.hp=msg.hp;}
  else if(msg.t==='weaponUpgrade'){showPop(msg.msg,3000);}
}
function showClassScreen(){document.getElementById('lobbyScreen').style.display='none';document.getElementById('classScreen').style.display='flex';}
function hideClassScreen(){document.getElementById('classScreen').style.display='none';}

function initGameState(){
  if(!myClass)myClass='warrior';
  const cls=CLASSES[myClass];
  myStats={...cls.stats};
  // [FIX1] 서버 dmgBonus/cdMult 추적용 초기화
  myStats._lastDmgBonus=1;myStats._lastCdMult=1;
  myWeapon={...cls.weapon};myTraits=[];weaponUpgradeLevel=0;weaponElement=null;
  running=true;stageTime=600;currentStage=1;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;
  kills=0;score=0;projs=[];parts=[];orbs=[];remoteEffects=[];explosions=[];fireZones=[];turrets=[];
  myPlayer={x:0,y:0,hp:myStats.hp,maxHp:myStats.maxHp,lv:1,exp:0,expNext:50,dead:false};
  invincible=false;invincibleEnd=0;localLvUpQueue=0;bossWarning=null;
  showGameUI();
  document.getElementById('classTag').innerHTML='<span>'+cls.icon+' '+cls.name+'</span>';
  document.getElementById('bossBar').style.display='none';
  G.style.background=STAGE_BG[0];
  updateTraitList();updateStatsPanel();updateElementDisplay();
  lastTime=performance.now();requestAnimationFrame(loop);
}

function applyState(msg){
  try{
  allPlayers=msg.players||[];
  if(msg.enemies!==undefined){
    const newEnemies=msg.enemies,oldMap=new Map(enemies.map(e=>[e.id,e])),aliveIds=new Set(newEnemies.map(e=>e.id));
    enemies=newEnemies.map(ne=>{const old=oldMap.get(ne.id);if(old){old.targetX=ne.x;old.targetY=ne.y;if(ne.vx!==undefined){old.vx=ne.vx;old.vy=ne.vy;}old.hp=ne.hp;if(ne.maxHp!==undefined)old.maxHp=ne.maxHp;if(ne.type!==undefined)old.type=ne.type;if(ne.r!==undefined)old.r=ne.r;if(ne.poison!==undefined)old.poison=ne.poison;if(ne.iceEnd!==undefined)old.iceEnd=ne.iceEnd;if(ne.atkSlow!==undefined)old.atkSlow=ne.atkSlow;if(ne.shieldHp!==undefined)old.shieldHp=ne.shieldHp;return old;}else return{...ne,targetX:ne.x,targetY:ne.y,vx:ne.vx||0,vy:ne.vy||0};});
    enemies=enemies.filter(e=>aliveIds.has(e.id));
  }
  bossData=msg.boss||null;stageTime=msg.st??stageTime;if(msg.stage)currentStage=msg.stage;if(msg.turrets)turrets=msg.turrets;
  const me=allPlayers.find(p=>p.id===myId);
  if(me&&myPlayer){
    myPlayer.hp=me.hp;myPlayer.maxHp=me.maxHp;myPlayer.lv=me.lv;myPlayer.dead=me.dead;myPlayer.exp=me.exp;myPlayer.expNext=me.expNext;
    if(myStats){
      myStats.maxHp=me.maxHp;
      if(me.armor!==undefined&&!isNaN(me.armor))myStats.armor=me.armor;
      if(me.regen!==undefined&&!isNaN(me.regen))myStats.regen=me.regen;
      // dmgBonus - NaN 방어 강화
      if(me.dmgBonus!==undefined&&!isNaN(me.dmgBonus)&&me.dmgBonus>0){
        const prev=myStats._lastDmgBonus||1;
        if(me.dmgBonus!==prev&&!isNaN(prev)&&prev>0){
          const ratio=me.dmgBonus/prev;
          if(!isNaN(ratio)&&isFinite(ratio))myStats.dmgMult*=ratio;
          myStats._lastDmgBonus=me.dmgBonus;
        }
      }
      // cdMult - NaN 방어 강화
      if(me.cdMult!==undefined&&!isNaN(me.cdMult)&&me.cdMult>0){
        const prev=myStats._lastCdMult||1;
        if(me.cdMult!==prev&&!isNaN(prev)&&prev>0){
          const ratio=me.cdMult/prev;
          if(!isNaN(ratio)&&isFinite(ratio))myStats.cdMult*=ratio;
          myStats._lastCdMult=me.cdMult;
        }
      }
      if(me.critRate!==undefined&&!isNaN(me.critRate)&&me.critRate>myStats.critRate){myStats.critRate=me.critRate;if(myStats.critRate>0)myStats.crit=true;}
      // NaN 최종 방어
      if(isNaN(myStats.dmgMult)||!isFinite(myStats.dmgMult))myStats.dmgMult=1;
      if(isNaN(myStats.cdMult)||!isFinite(myStats.cdMult))myStats.cdMult=1;
      updateStatsPanel();
    }
    if(me.dead&&running){running=false;endGame(false);}
    const wasGroggy=myPlayer.groggy;
    if(me.groggy&&!wasGroggy){showPop('💀 그로기! 동료가 부활시켜 줄 수 있어요!',3000);}
    if(wasGroggy&&!me.groggy&&!me.dead){running=true;}
    myPlayer.groggy=me.groggy||false;
    myPlayer.groggyTimer=me.groggyTimer||0;
  }
  }catch(err){console.error('[applyState err]',err);}
}

function showStageClear(stage,next){running=false;const el=document.getElementById('stageClearScreen');document.getElementById('stageClearTitle').textContent='STAGE '+stage+' CLEAR!';document.getElementById('stageClearSub').textContent=next<=3?'다음: '+STAGE_NAMES[next-1]:'모든 스테이지 클리어!';el.style.display='flex';let t=5;document.getElementById('stageClearTimer').textContent=t;const iv=setInterval(()=>{t--;document.getElementById('stageClearTimer').textContent=t;if(t<=0){clearInterval(iv);el.style.display='none';}},1000);}
function nextStage(stage){currentStage=stage;stageTime=600;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;bossData=null;enemies=[];projs=[];parts=[];orbs=[];explosions=[];fireZones=[];turrets=[];invincible=false;invincibleEnd=0;document.getElementById('bossBar').style.display='none';G.style.background=STAGE_BG[Math.min(stage-1,2)];running=true;showPop('STAGE '+stage+' START!',2500);}

// [FIX2] 조이스틱 완전 분리 - 각각 touchId 추적
const jsBase=document.getElementById('jsBase'),jsKnob=document.getElementById('jsKnob');
let jsCX=0,jsCY=0,jsTouchId=null,js1MouseDown=false;
function jsStart(e){e.preventDefault();const touch=e.changedTouches?e.changedTouches[0]:e;jsTouchId=touch.identifier!==undefined?touch.identifier:null;const r=jsBase.getBoundingClientRect();jsCX=r.left+r.width/2;jsCY=r.top+r.height/2;jsActive=true;_jsUpdate(touch);}
function _jsUpdate(t){let dx=t.clientX-jsCX,dy=t.clientY-jsCY,d=Math.sqrt(dx*dx+dy*dy),max=30;if(d>max){dx=dx/d*max;dy=dy/d*max;}jsX=dx/max;jsY=dy/max;jsKnob.style.transform='translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))';}
function jsMove(e){if(!jsActive)return;e.preventDefault();const touch=jsTouchId!==null?[...e.changedTouches].find(t=>t.identifier===jsTouchId):e.changedTouches?e.changedTouches[0]:e;if(!touch)return;_jsUpdate(touch);}
function jsEnd(e){if(e&&e.changedTouches&&jsTouchId!==null){if(![...e.changedTouches].find(t=>t.identifier===jsTouchId))return;}jsActive=false;jsX=0;jsY=0;jsTouchId=null;jsKnob.style.transform='translate(-50%,-50%)';}
jsBase.addEventListener('touchstart',jsStart,{passive:false});
jsBase.addEventListener('touchmove',jsMove,{passive:false});
jsBase.addEventListener('touchend',jsEnd,{passive:false});
jsBase.addEventListener('touchcancel',jsEnd,{passive:false});
jsBase.addEventListener('mousedown',e=>{js1MouseDown=true;jsStart(e);});
document.addEventListener('mousemove',e=>{if(js1MouseDown&&running)jsMove(e);});
document.addEventListener('mouseup',()=>{if(js1MouseDown){js1MouseDown=false;jsEnd();}});

const js2Wrap=document.getElementById('js2Wrap'),js2Base=document.getElementById('js2Base'),js2Knob=document.getElementById('js2Knob');
let js2Active=false,js2X=0,js2Y=0,js2CX=0,js2CY=0,js2TouchId=null,js2MouseDown=false;
function js2Start(e){e.preventDefault();const touch=e.changedTouches?e.changedTouches[0]:e;js2TouchId=touch.identifier!==undefined?touch.identifier:null;const r=js2Base.getBoundingClientRect();js2CX=r.left+r.width/2;js2CY=r.top+r.height/2;js2Active=true;_js2Update(touch);}
function _js2Update(t){let dx=t.clientX-js2CX,dy=t.clientY-js2CY,d=Math.sqrt(dx*dx+dy*dy),max=30;if(d>max){dx=dx/d*max;dy=dy/d*max;}js2X=dx/max;js2Y=dy/max;js2Knob.style.transform='translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))';}
function js2Move(e){if(!js2Active)return;e.preventDefault();const touch=js2TouchId!==null?[...e.changedTouches].find(t=>t.identifier===js2TouchId):e.changedTouches?e.changedTouches[0]:e;if(!touch)return;_js2Update(touch);}
function js2End(e){if(e&&e.changedTouches&&js2TouchId!==null){if(![...e.changedTouches].find(t=>t.identifier===js2TouchId))return;}js2Active=false;js2X=0;js2Y=0;js2TouchId=null;js2Knob.style.transform='translate(-50%,-50%)';}
js2Base.addEventListener('touchstart',js2Start,{passive:false});
js2Base.addEventListener('touchmove',js2Move,{passive:false});
js2Base.addEventListener('touchend',js2End,{passive:false});
js2Base.addEventListener('touchcancel',js2End,{passive:false});
js2Base.addEventListener('mousedown',e=>{js2MouseDown=true;js2Start(e);});
document.addEventListener('mousemove',e=>{if(js2MouseDown&&running)js2Move(e);});
document.addEventListener('mouseup',e=>{if(js2MouseDown){js2MouseDown=false;js2End(e);}});

let autoAim=true;
const autoAimBtn=document.getElementById('autoAimBtn');
function toggleAutoAim(){autoAim=!autoAim;autoAimBtn.className=autoAim?'on':'';autoAimBtn.querySelector('.aaLabel').textContent=autoAim?'AUTO':'MAN';}
autoAimBtn.addEventListener('click',toggleAutoAim);
autoAimBtn.addEventListener('touchend',e=>{e.preventDefault();toggleAutoAim();});

const keys={};
document.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let mouseX=W/2,mouseY=H/2,mouseDown=false;
canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;});
canvas.addEventListener('mousedown',()=>mouseDown=true);
canvas.addEventListener('mouseup',()=>mouseDown=false);

function tryShoot(){
  if(!myPlayer||myPlayer.dead||myPlayer.groggy||!myStats||!myWeapon)return;
  const now=performance.now(),w=getW();if(now-lastShot<w.cd)return;lastShot=now;
  let target=null,minD=Infinity;
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38}]:enemies;
  if(autoAim){for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minD){minD=d;target=e;}}}
  let tx,ty;
  if(autoAim&&target&&minD<w.range*1.3){const projSpd=(w.spd||7)*60;const tt=minD/projSpd;tx=target.x+(target.vx||0)*tt;ty=target.y+(target.vy||0)*tt;}
  else if(js2Active){tx=myPlayer.x+js2X*400;ty=myPlayer.y+js2Y*400;}
  else{tx=mouseX+camX-W/2;ty=mouseY+camY-H/2;}
  const ang=Math.atan2(ty-myPlayer.y,tx-myPlayer.x);
  if(w.type==='sword'||w.type==='dagger'){for(let i=0;i<w.count;i++)doMelee(ang,w);return;}
  if(w.type==='magic'){
    projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(ang)*(w.spd||6),vy:Math.sin(ang)*(w.spd||6),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:9+weaponUpgradeLevel*3,enemy:false,isMagic:true,explosionRadius:w.explosionRadius||80,element:weaponElement});
    const extraAngles=[0.78,-1.57,2.36,-2.36,1.57];
    for(let i=0;i<w.count-1;i++){const a=ang+extraAngles[i%extraAngles.length];projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*(w.spd||6),vy:Math.sin(a)*(w.spd||6),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:9+weaponUpgradeLevel*3,enemy:false,isMagic:true,explosionRadius:w.explosionRadius||80,element:weaponElement});}
  }else{
    // bullet: 원래 궤도(정조준) 항상 발사 + 다중사격은 ±15도 옆으로 추가탄
    if(w.type==='bullet'){
      const projR=10+weaponUpgradeLevel; // [FIX] 히트박스 확대
      // 기본탄 - 항상 정조준 방향
      projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(ang)*(w.spd||7),vy:Math.sin(ang)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:projR,enemy:false,element:weaponElement});
      // 추가탄 - 15도(0.26rad) 간격으로 좌우 교대
      const extraAngles=[0.26,-0.26,0.52,-0.52,0.78];
      for(let i=0;i<w.count-1;i++){
        const a=ang+extraAngles[i%extraAngles.length];
        projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*(w.spd||7),vy:Math.sin(a)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:projR,enemy:false,element:weaponElement});
      }
    }else{
      for(let i=0;i<w.count;i++){
        const a=ang+(i-(w.count-1)/2)*0.28;
        const projR=4+weaponUpgradeLevel;
        projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(a)*(w.spd||7),vy:Math.sin(a)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:projR,enemy:false,element:weaponElement});
      }
    }
  }
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:tx,ay:ty,w:myClass,cnt:w.count,range:w.range,element:weaponElement,elementTier:weaponUpgradeLevel});
}

function doMelee(ang,w){
  const isDagger=w.type==='dagger',spread=isDagger?0.5:1.1,step=isDagger?0.18:0.2,pR=isDagger?4:5;
  let col=isDagger?'#ff88aacc':w.color;if(weaponElement&&weaponUpgradeLevel>=3)col=ELEMENT_COLORS[weaponElement];
  const effectMult=1+weaponUpgradeLevel*0.3,actualRange=w.range*effectMult;
  for(let a=ang-spread;a<=ang+spread;a+=step)for(let r=18;r<actualRange;r+=isDagger?12:14)parts.push({x:myPlayer.x+Math.cos(a)*r,y:myPlayer.y+Math.sin(a)*r,vx:0,vy:0,life:isDagger?120:160,maxLife:isDagger?120:160,r:pR+weaponUpgradeLevel,color:col});
  const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38},...turrets]:enemies;
  for(const e of allE){const dx=e.x-myPlayer.x,dy=e.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<actualRange){const ea=Math.atan2(dy,dx),diff=Math.abs(((ea-ang)+Math.PI*3)%(Math.PI*2)-Math.PI);if(diff<(isDagger?0.6:1.3)){if(e.id==='boss')reportHit('boss',w.dmg,weaponElement);else if(e.isTurret)reportHit('turret',w.dmg,weaponElement,e.id);else reportHit(e.id,w.dmg,weaponElement);}}}
  send({t:'atk',x:myPlayer.x,y:myPlayer.y,ax:myPlayer.x+Math.cos(ang)*60,ay:myPlayer.y+Math.sin(ang)*60,w:myClass,cnt:1,range:actualRange,element:weaponElement,elementTier:weaponUpgradeLevel});
}
function reportHit(id,dmg,element,turretId){let wt='melee';if(myWeapon){if(myWeapon.type==='bullet')wt='ranged';else if(myWeapon.type==='magic')wt='magic';}if(id==='boss')send({t:'hit',target:'boss',dmg,element,elementTier:weaponUpgradeLevel,weaponType:wt});else if(id==='turret')send({t:'hit',target:'turret',dmg,tid:turretId,element,elementTier:weaponUpgradeLevel,weaponType:wt});else send({t:'hit',eid:id,dmg,element,elementTier:weaponUpgradeLevel});}
function createExplosion(x,y,radius,dmg,color,element){explosions.push({x,y,r:radius,dmg,life:300,maxLife:300,color:color||'#cc88ff'});const allE=bossData?[...enemies,{id:'boss',x:bossData.x,y:bossData.y,r:38},...turrets]:enemies;for(const e of allE){const dx=e.x-x,dy=e.y-y,d=Math.sqrt(dx*dx+dy*dy);if(d<radius+(e.r||10)){const hd=dmg*(1-d/(radius+(e.r||10))*0.5);if(e.id==='boss')reportHit('boss',hd,element);else if(e.isTurret)reportHit('turret',hd,element,e.id);else reportHit(e.id,hd,element);}}send({t:'explosion',x,y,r:radius,dmg,color,element,elementTier:weaponUpgradeLevel});}

function doBossPat(msg){
  const{i,bx,by,ang,phase,etype,isFinal}=msg;const bRange=isFinal?600:1200;
  if(i===-1){if(etype==='ranged')mkBB(bx,by,Math.cos(ang)*4.5,Math.sin(ang)*4.5,12,'#ffaa44',5,bRange);else if(etype==='mage'){for(let j=-1;j<=1;j++){const a=ang+j*0.4;mkBB(bx,by,Math.cos(a)*3.2,Math.sin(a)*3.2,15,'#dd44ff',6,bRange);}}return;}
  if(i===-2){mkBB(bx,by,Math.cos(ang)*2.8,Math.sin(ang)*2.8,35,'#ff2200',18,bRange);return;}
  [bossSpiral,bossBlast,bossCross,bossRapid,bossRing][Math.min(i,4)](bx,by,ang,phase,bRange);
}
function mkBB(bx,by,vx,vy,dmg,col,r,range=600){projs.push({x:bx,y:by,vx,vy,dmg,range,traveled:0,gone:false,color:col,r,enemy:true});}
function bossSpiral(bx,by,ang,phase,range=600){const cnt=phase===2?14:10;for(let i=0;i<cnt;i++){const a=(i/cnt)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*4.2,Math.sin(a)*4.2,18,'#ff6600',8,range);}}
function bossBlast(bx,by,ang,phase,range=600){for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2;mkBB(bx,by,Math.cos(a)*2.6,Math.sin(a)*2.6,22,'#ff2200',10,range);}spawnParts(bx,by,'#ff6600',16);}
function bossCross(bx,by,ang,phase,range=600){const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]];const cnt=phase===2?4:3;dirs.forEach(([dx,dy])=>{for(let n=0;n<cnt;n++)setTimeout(()=>mkBB(bx,by,dx*5.5,dy*5.5,20,'#cc44ff',7,range),n*150);});}
function bossRapid(bx,by,ang,phase,range=600){if(!myPlayer)return;const cnt=8;for(let n=0;n<cnt;n++)setTimeout(()=>{if(!myPlayer)return;const dx=myPlayer.x-bx,dy=myPlayer.y-by,d=Math.sqrt(dx*dx+dy*dy)||1,a=Math.atan2(dy,dx)+(Math.random()-.5)*.6;mkBB(bx,by,Math.cos(a)*6.5,Math.sin(a)*6.5,16,'#ff4444',6,range);},n*90);}
function bossRing(bx,by,ang,phase,range=600){const cnt=phase===2?20:16;for(let i=0;i<cnt;i++){const a=(i/cnt)*Math.PI*2+ang*2,s=2.2+Math.random()*2.2;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,24,'#ffaa00',9,range);}}

function spawnRemoteFx(fx){const cls=CLASSES[fx.w]||CLASSES.warrior,wc=cls.weapon;if(wc.type==='sword'||wc.type==='dagger'){const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x),range=fx.range||wc.baseRange||80,spread=wc.type==='dagger'?0.5:0.9,step=wc.type==='dagger'?0.18:0.25,ps=wc.type==='dagger'?12:16;for(let a=ang-spread;a<=ang+spread;a+=step)for(let r=18;r<range;r+=ps)parts.push({x:fx.x+Math.cos(a)*r,y:fx.y+Math.sin(a)*r,vx:0,vy:0,life:140,maxLife:140,r:4,color:wc.color+'88'});}else if(wc.type==='magic'){const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);projs.push({x:fx.x,y:fx.y,vx:Math.cos(ang)*(wc.spd||6),vy:Math.sin(ang)*(wc.spd||6),dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:8,enemy:false,visual:true,isMagic:true});}else{const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x),cnt=fx.cnt||1;for(let i=0;i<cnt;i++){const a=ang+(i-(cnt-1)/2)*0.28;projs.push({x:fx.x,y:fx.y,vx:Math.cos(a)*(wc.spd||7),vy:Math.sin(a)*(wc.spd||7),dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:3,enemy:false,visual:true});}}}

function update(dt){
  if(!running||!myPlayer||myPlayer.dead||!myStats)return;
  const now=performance.now();if(invincible&&invincibleEnd!==Infinity&&now>=invincibleEnd){invincible=false;invincibleEnd=0;}
  // 보스전 맵 축소 (보스 생존 시 이동범위 제한)
  const activeMapSize=bossAlive?800:MAP_SIZE;
  // 그로기 상태면 이동/공격 불가, 카메라만 유지
  if(myPlayer.groggy){
    camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;
    // 적 예측 이동은 그로기 중에도 계속
    for(const e of enemies){if(e.targetX===undefined){e.targetX=e.x;e.targetY=e.y;e.vx=0;e.vy=0;}e.x+=e.vx*(dt/16);e.y+=e.vy*(dt/16);const errX=e.targetX-e.x,errY=e.targetY-e.y,correction=Math.min(1,dt/60*8);e.x+=errX*correction;e.y+=errY*correction;}
    // 파티클/폭발/탄환도 계속 업데이트 (시각 연속성)
    const spF=dt/16;
    for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
    parts=parts.filter(p=>p.life>0);
    for(const ex of explosions)ex.life-=dt;explosions=explosions.filter(ex=>ex.life>0);
    for(const fz of fireZones)fz.life-=dt;fireZones=fireZones.filter(fz=>fz.life>0);
    // 적 탄환도 그로기 중엔 맞지 않음 (어그로 없으니 날아오지 않지만 안전하게 처리)
    projs=projs.filter(p=>!p.gone&&!p.enemy);
    // HUD 업데이트
    document.getElementById('hpFill').style.width='0%';
    document.getElementById('hpTxt').textContent='그로기';
    const mins=Math.floor(stageTime/60),secs=Math.floor(stageTime%60);
    document.getElementById('timerVal').textContent=mins+':'+(secs<10?'0':'')+secs;
    document.getElementById('stageVal').textContent=currentStage;
    return;
  }
  let mx=jsX,my=jsY;
  if(keys['w']||keys['arrowup'])my=-1;if(keys['s']||keys['arrowdown'])my=1;if(keys['a']||keys['arrowleft'])mx=-1;if(keys['d']||keys['arrowright'])mx=1;
  const ml=Math.sqrt(mx*mx+my*my)||1;
  if(mx||my){myPlayer.x+=mx/ml*myStats.spd*(dt/16);myPlayer.y+=my/ml*myStats.spd*(dt/16);myPlayer.x=Math.max(-activeMapSize,Math.min(activeMapSize,myPlayer.x));myPlayer.y=Math.max(-activeMapSize,Math.min(activeMapSize,myPlayer.y));}
  send({t:'move',x:Math.round(myPlayer.x),y:Math.round(myPlayer.y)});
  tryShoot();
  camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;
  for(const e of enemies){if(e.targetX===undefined){e.targetX=e.x;e.targetY=e.y;e.vx=0;e.vy=0;}e.x+=e.vx*(dt/16);e.y+=e.vy*(dt/16);const errX=e.targetX-e.x,errY=e.targetY-e.y,correction=Math.min(1,dt/60*8);e.x+=errX*correction;e.y+=errY*correction;}
  for(const fx of remoteEffects)spawnRemoteFx(fx);remoteEffects=[];
  const spF=dt/16;
  for(const p of projs){
    if(p.gone)continue;p.x+=p.vx*spF;p.y+=p.vy*spF;p.traveled+=Math.sqrt(p.vx*p.vx+p.vy*p.vy)*spF;
    if(p.traveled>p.range){if(p.isMagic&&!p.visual&&!p.enemy){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}p.gone=true;continue;}
    if(p.visual)continue;
    if(!p.enemy){
      for(const e of enemies){const dx=p.x-e.x,dy=p.y-e.y;if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){if(p.isMagic){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}else{reportHit(e.id,p.dmg,p.element);if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});spawnParts(p.x,p.y,p.color,4);}p.gone=true;break;}}
      if(!p.gone&&bossData){const dx=p.x-bossData.x,dy=p.y-bossData.y;if(Math.sqrt(dx*dx+dy*dy)<38+p.r){if(p.isMagic){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}else{reportHit('boss',p.dmg,p.element);if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});spawnParts(p.x,p.y,p.color,5);}p.gone=true;}}
      if(!p.gone){for(const t of turrets){const dx=p.x-t.x,dy=p.y-t.y;if(Math.sqrt(dx*dx+dy*dy)<t.r+p.r){if(p.isMagic){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}else{reportHit('turret',p.dmg,p.element,t.id);if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});spawnParts(p.x,p.y,p.color,5);}p.gone=true;break;}}}
    }else{if(myPlayer&&!myPlayer.dead&&!invincible){const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;if(Math.sqrt(dx*dx+dy*dy)<14+p.r){send({t:'enemyHit',dmg:p.dmg});spawnParts(p.x,p.y,p.color,4);p.gone=true;}}}
  }
  projs=projs.filter(p=>!p.gone);
  for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}parts=parts.filter(p=>p.life>0);if(parts.length>600)parts=parts.slice(-600);
  for(const ex of explosions)ex.life-=dt;explosions=explosions.filter(ex=>ex.life>0);
  for(const fz of fireZones)fz.life-=dt;fireZones=fireZones.filter(fz=>fz.life>0);
  const magnetR=28*myStats.magnetRange,pullR=100*myStats.magnetRange;
  for(const o of orbs){if(o.col)continue;const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<magnetR){o.col=true;score+=5;}else if(d<pullR){o.x-=dx/d*3;o.y-=dy/d*3;}}orbs=orbs.filter(o=>!o.col);
  // 캐싱: 매 프레임 find 대신 myPlayer 직접 사용
  const hpPct=Math.max(0,(myPlayer.hp/myPlayer.maxHp)*100);
  document.getElementById('hpFill').style.width=hpPct+'%';document.getElementById('hpTxt').textContent=Math.max(0,Math.floor(myPlayer.hp))+'/'+Math.floor(myPlayer.maxHp);
  document.getElementById('expFill').style.width=((myPlayer.exp||0)/(myPlayer.expNext||50)*100)+'%';document.getElementById('lvTxt').textContent=myPlayer.lv||1;document.getElementById('killTxt').textContent=kills;document.getElementById('scoreTxt').textContent=score;
  document.getElementById('waveTxt').textContent=Math.max(1,Math.floor((600-stageTime)/60)+1);
  const mins=Math.floor(stageTime/60),secs=Math.floor(stageTime%60);document.getElementById('timerVal').textContent=mins+':'+(secs<10?'0':'')+secs;document.getElementById('timerVal').style.color=stageTime<60?'#ff4444':stageTime<120?'#ff8844':'#ffcc00';document.getElementById('stageVal').textContent=currentStage;
  if(bossData)document.getElementById('bossFill').style.width=(bossData.hp/bossData.maxHp*100)+'%';
}

function draw(){
  ctx.clearRect(0,0,W,H);
  // 매 프레임 시작 시 상태 완전 초기화
  ctx.setLineDash([]);
  ctx.lineDashOffset=0;
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';
  const ox=W/2-camX,oy=H/2-camY;
  ctx.save();ctx.translate(ox,oy);
  drawGrid();drawFireZones();drawOrbs();drawParts();drawExplosions();
  if(bossAlive||bossWarning) drawArenaBorder();
  if(bossWarning) drawBossSpawnMarker();
  drawEnemies();if(bossData)drawBoss();drawTurrets();drawOthers();
  if(myPlayer&&!myPlayer.dead)drawMe();
  drawProjs();
  ctx.restore();
  // restore 후 상태 보장
  ctx.setLineDash([]);
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  drawMinimap();
}

function drawArenaBorder(){
  const ARENA=800;
  const t=performance.now();
  const pulse=Math.sin(t*0.004)*0.3+0.7;
  ctx.save();
  // 모든 상태 명시적 초기화
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';
  ctx.shadowBlur=0;
  ctx.setLineDash([]);
  // 경계 바깥 어둡게
  const isFinalBoss=(bossData&&bossData.isFinal)||(bossWarning&&bossWarning.isFinal);
  const lineColor=isFinalBoss?'rgba(220,30,30,'+(pulse*0.9)+')':'rgba(255,180,0,'+(pulse*0.85)+')';
  ctx.fillStyle=isFinalBoss?'rgba(60,0,0,0.35)':'rgba(40,20,0,0.3)';
  ctx.beginPath();
  ctx.rect(-5000,-5000,10000,10000);
  ctx.arc(0,0,ARENA,0,Math.PI*2,true);
  ctx.fill('evenodd');
  // 경계선
  ctx.beginPath();
  ctx.strokeStyle=lineColor;
  ctx.lineWidth=3+pulse*2;
  ctx.shadowColor=lineColor;
  ctx.shadowBlur=16;
  ctx.setLineDash([20,8]);
  ctx.lineDashOffset=-(t*0.05)%28;
  ctx.arc(0,0,ARENA,0,Math.PI*2);
  ctx.stroke();
  // 완전 리셋
  ctx.setLineDash([]);
  ctx.lineDashOffset=0;
  ctx.shadowBlur=0;
  // 내부 링
  ctx.beginPath();
  ctx.strokeStyle=isFinalBoss?'rgba(220,30,30,0.3)':'rgba(255,180,0,0.3)';
  ctx.lineWidth=1;
  ctx.arc(0,0,ARENA-8,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
  // restore 후에도 명시적으로 보장
  ctx.setLineDash([]);
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
}

function drawBossSpawnMarker(){
  if(!bossWarning)return;
  const{x,y,isFinal,startTime}=bossWarning;
  const elapsed=(performance.now()-startTime)/1000;
  const remaining=Math.max(0,5-elapsed);
  const t=performance.now();
  ctx.save();
  // 등장 위치 바닥 원형 경고
  const warningPulse=Math.sin(t*0.008)*0.4+0.6;
  const warnR=60+Math.sin(t*0.005)*10;
  ctx.globalAlpha=warningPulse*0.5;
  ctx.fillStyle=isFinal?'#aa0000':'#cc6600';
  ctx.beginPath();ctx.arc(x,y,warnR,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  // 경고 원 외곽선
  ctx.strokeStyle=isFinal?'#ff2200':'#ffaa00';
  ctx.lineWidth=2+warningPulse*2;
  ctx.shadowColor=isFinal?'#ff0000':'#ff8800';
  ctx.shadowBlur=20;
  ctx.beginPath();ctx.arc(x,y,warnR,0,Math.PI*2);ctx.stroke();
  // 십자 표시
  ctx.strokeStyle=isFinal?'rgba(255,50,50,'+warningPulse+')':'rgba(255,180,0,'+warningPulse+')';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(x-warnR,y);ctx.lineTo(x+warnR,y);
  ctx.moveTo(x,y-warnR);ctx.lineTo(x,y+warnR);
  ctx.stroke();
  ctx.shadowBlur=0;
  // 카운트다운 숫자
  const cdNum=Math.ceil(remaining);
  ctx.globalAlpha=warningPulse;
  ctx.fillStyle=isFinal?'#ff4444':'#ffcc00';
  ctx.font='bold '+(28+warningPulse*8)+'px monospace';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(cdNum>0?cdNum+'':'!!',x,y);
  // 라벨
  ctx.font='bold 11px monospace';
  ctx.fillStyle=isFinal?'#ff8888':'#ffcc88';
  ctx.fillText(isFinal?'☠ FINAL BOSS':'⚠ BOSS',x,y-warnR-12);
  ctx.globalAlpha=1;
  ctx.restore();
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  ctx.setLineDash([]);
}
function drawMinimap(){if(!myPlayer||!running)return;const mCtx=minimapCtx,size=120;mCtx.clearRect(0,0,size,size);mCtx.fillStyle='rgba(20,20,30,0.8)';mCtx.fillRect(0,0,size,size);mCtx.strokeStyle='#444';mCtx.lineWidth=1;mCtx.strokeRect(0,0,size,size);const scale=size/(MAP_SIZE*2),cx=size/2,cy=size/2;mCtx.strokeStyle='#333';mCtx.beginPath();mCtx.moveTo(cx,0);mCtx.lineTo(cx,size);mCtx.moveTo(0,cy);mCtx.lineTo(size,cy);mCtx.stroke();allPlayers.forEach(p=>{if(p.id===myId||p.dead)return;const cls=CLASSES[p.cls];mCtx.globalAlpha=p.groggy?0.4:1;mCtx.fillStyle=p.groggy?'#888':(cls?cls.color:'#66aaff');mCtx.beginPath();mCtx.arc(cx+p.x*scale,cy+p.y*scale,4,0,Math.PI*2);mCtx.fill();mCtx.globalAlpha=1;});if(bossData&&!bossData.dead){mCtx.fillStyle='#ff3300';mCtx.beginPath();mCtx.arc(cx+bossData.x*scale,cy+bossData.y*scale,6,0,Math.PI*2);mCtx.fill();mCtx.strokeStyle='#ff6600';mCtx.lineWidth=2;mCtx.stroke();}mCtx.globalAlpha=myPlayer.groggy?0.4:1;mCtx.fillStyle=CLASSES[myClass]?CLASSES[myClass].color:'#ffcc00';mCtx.beginPath();mCtx.arc(cx+myPlayer.x*scale,cy+myPlayer.y*scale,5,0,Math.PI*2);mCtx.fill();mCtx.strokeStyle='#fff';mCtx.lineWidth=2;mCtx.stroke();mCtx.globalAlpha=1;}
// 타일 캐시 (뷰포트 이동 시만 갱신)
let _tileCache=null,_tileCamX=null,_tileCamY=null,_tileW=0,_tileH=0;
function drawGrid(){
  const gi=Math.min(currentStage-1,2);
  if(gi===0&&DUNGEON_TILES[0].complete&&DUNGEON_TILES[0].naturalWidth>0){
    ctx.save();ctx.imageSmoothingEnabled=false;
    const ts=16;
    const sx=Math.floor((camX-W/2)/ts)*ts;
    const sy=Math.floor((camY-H/2)/ts)*ts;
    for(let x=sx;x<camX+W/2+ts;x+=ts){
      for(let y=sy;y<camY+H/2+ts;y+=ts){
        const idx=getTileIdx(Math.floor(x/ts),Math.floor(y/ts));
        const tile=DUNGEON_TILES[idx];
        ctx.drawImage(tile&&tile.complete?tile:DUNGEON_TILES[0],x,y,ts,ts);
      }
    }
    ctx.restore();
  }else{
    ctx.strokeStyle=STAGE_GRID[gi];ctx.lineWidth=1;
    const gs=80,sx=Math.floor((camX-W/2)/gs)*gs,sy=Math.floor((camY-H/2)/gs)*gs;
    for(let x=sx;x<camX+W/2+gs;x+=gs){ctx.beginPath();ctx.moveTo(x,camY-H/2);ctx.lineTo(x,camY+H/2);ctx.stroke();}
    for(let y=sy;y<camY+H/2+gs;y+=gs){ctx.beginPath();ctx.moveTo(camX-W/2,y);ctx.lineTo(camX+W/2,y);ctx.stroke();}
  }
}
// ── 직업별 애니메이션 ────────────────────────────────────────
function drawClassAnim(ctx, cls, x, y, isMoving, t, scale=1){
  const s=scale;
  ctx.save();
  ctx.translate(x,y);

  if(cls==='assassin'){
    // 이동 방향 감지 (jsX, jsY 활용)
    const moveX = typeof jsX !== 'undefined' ? jsX : 0;
    const moveY = typeof jsY !== 'undefined' ? jsY : 0;
    // 망토 물리: 이동 반대 방향으로 휘어짐 (관성)
    const windX = isMoving ? -moveX * 10 : 0;
    const windY = isMoving ? -moveY * 6 : 0;
    // 주파수 다른 두 사인파 합성 → 자연스러운 펄럭임
    const f1 = Math.sin(t * 0.016) * 0.6 + Math.sin(t * 0.027) * 0.4;
    const f2 = Math.sin(t * 0.013 + 1.2) * 0.5 + Math.sin(t * 0.031) * 0.5;
    const baseFlutter = isMoving ? 6 : 1.5;
    const flutter1 = windX + f1 * baseFlutter;
    const flutter2 = windY * 0.4 + f2 * baseFlutter * 0.7;
    const alpha = isMoving ? 0.88 : 0.65;

    // ── 망토 좌측 (3개 레이어: 외곽/중간/안감) ──────────────
    ctx.save();

    // 레이어1: 외곽 (가장 어둡고 넓음)
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = '#0e0e14';
    ctx.beginPath();
    ctx.moveTo(-5*s, -12*s);
    ctx.bezierCurveTo(
      (-9 + flutter1*0.3)*s, (-4)*s,
      (-16 + flutter1)*s,    6*s,
      (-13 + flutter1*0.8)*s,18*s
    );
    ctx.bezierCurveTo(
      (-10 + flutter1*0.5)*s, 22*s,
      (-4)*s,                  20*s,
      (-3)*s,                  10*s
    );
    ctx.bezierCurveTo(
      (-4)*s, 2*s,
      (-5)*s, -6*s,
      (-5)*s, -12*s
    );
    ctx.fill();

    // 레이어2: 중간 (메인 망토)
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#18182a';
    ctx.beginPath();
    ctx.moveTo(-4*s, -11*s);
    ctx.bezierCurveTo(
      (-7 + flutter1*0.4)*s, -2*s,
      (-14 + flutter1*1.1)*s, 8*s,
      (-11 + flutter1*0.9)*s, 17*s
    );
    ctx.bezierCurveTo(
      (-8 + flutter1*0.5)*s, 21*s,
      (-3)*s,                 19*s,
      (-2)*s,                 9*s
    );
    ctx.bezierCurveTo(
      (-3)*s, 0*s,
      (-4)*s, -6*s,
      (-4)*s, -11*s
    );
    ctx.fill();

    // 레이어3: 빨간 안감 (망토 뒤집힐 때 보임)
    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = '#7a0a0a';
    ctx.beginPath();
    ctx.moveTo(-4*s, -9*s);
    ctx.bezierCurveTo(
      (-6 + flutter1*0.5)*s, 0*s,
      (-11 + flutter1*1.2)*s, 9*s,
      (-9 + flutter1)*s,     16*s
    );
    ctx.bezierCurveTo(
      (-7 + flutter1*0.6)*s, 19*s,
      (-3)*s,                 17*s,
      (-2)*s,                 8*s
    );
    ctx.fill();

    // 주름선 (천의 질감)
    ctx.globalAlpha = alpha * 0.3;
    ctx.strokeStyle = '#0a0a12';
    ctx.lineWidth = 0.8 * s;
    for(let i=0; i<3; i++){
      const offset = i * 3;
      ctx.beginPath();
      ctx.moveTo((-3-offset*0.3)*s, (-8+offset)*s);
      ctx.quadraticCurveTo(
        (-7 + flutter1*0.3 - offset*0.2)*s, (2+offset)*s,
        (-6 + flutter1*0.5 - offset*0.2)*s, (12+offset*0.5)*s
      );
      ctx.stroke();
    }

    ctx.restore();

    // ── 망토 우측 ──────────────────────────────────────────
    ctx.save();

    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = '#0e0e14';
    ctx.beginPath();
    ctx.moveTo(5*s, -12*s);
    ctx.bezierCurveTo(
      (9 + flutter2*0.3)*s, (-4)*s,
      (16 + flutter2)*s,    6*s,
      (13 + flutter2*0.8)*s,18*s
    );
    ctx.bezierCurveTo(
      (10 + flutter2*0.5)*s, 22*s,
      4*s,                   20*s,
      3*s,                   10*s
    );
    ctx.bezierCurveTo(
      4*s, 2*s,
      5*s, -6*s,
      5*s, -12*s
    );
    ctx.fill();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#18182a';
    ctx.beginPath();
    ctx.moveTo(4*s, -11*s);
    ctx.bezierCurveTo(
      (7 + flutter2*0.4)*s, -2*s,
      (14 + flutter2*1.1)*s, 8*s,
      (11 + flutter2*0.9)*s, 17*s
    );
    ctx.bezierCurveTo(
      (8 + flutter2*0.5)*s, 21*s,
      3*s,                   19*s,
      2*s,                   9*s
    );
    ctx.bezierCurveTo(
      3*s, 0*s,
      4*s, -6*s,
      4*s, -11*s
    );
    ctx.fill();

    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = '#7a0a0a';
    ctx.beginPath();
    ctx.moveTo(4*s, -9*s);
    ctx.bezierCurveTo(
      (6 + flutter2*0.5)*s, 0*s,
      (11 + flutter2*1.2)*s, 9*s,
      (9 + flutter2)*s,     16*s
    );
    ctx.bezierCurveTo(
      (7 + flutter2*0.6)*s, 19*s,
      3*s,                   17*s,
      2*s,                   8*s
    );
    ctx.fill();

    ctx.globalAlpha = alpha * 0.3;
    ctx.strokeStyle = '#0a0a12';
    ctx.lineWidth = 0.8 * s;
    for(let i=0; i<3; i++){
      const offset = i * 3;
      ctx.beginPath();
      ctx.moveTo((3+offset*0.3)*s, (-8+offset)*s);
      ctx.quadraticCurveTo(
        (7 + flutter2*0.3 + offset*0.2)*s, (2+offset)*s,
        (6 + flutter2*0.5 + offset*0.2)*s, (12+offset*0.5)*s
      );
      ctx.stroke();
    }

    ctx.restore();

    // ── 빠른 이동 시 잔상/속도감 ──────────────────────────
    if(isMoving && (Math.abs(moveX)>0.3 || Math.abs(moveY)>0.3)){
      const speed = Math.sqrt(moveX*moveX + moveY*moveY);
      ctx.save();
      ctx.globalAlpha = 0.08 * speed;
      ctx.fillStyle = '#cc4466';
      // 이동 반대 방향으로 잔상
      ctx.beginPath();
      ctx.ellipse(windX*0.5, windY*0.5, 14*s, 8*s, Math.atan2(-moveY,-moveX), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  else if(cls==='warrior'){
    // 붉은 천: 이동 시 펄럭임
    const swing=isMoving?Math.sin(t*0.014)*5:Math.sin(t*0.005)*1.5;
    ctx.save();
    ctx.globalAlpha=0.8;
    ctx.fillStyle='#880a0a';
    ctx.beginPath();
    ctx.moveTo(-7*s,6*s);
    ctx.lineTo(7*s,6*s);
    ctx.lineTo((8+swing)*s,16*s);
    ctx.lineTo((0+swing*0.3)*s,18*s);
    ctx.lineTo((-8-swing)*s,16*s);
    ctx.closePath();ctx.fill();
    // 천 하이라이트
    ctx.globalAlpha=0.4;
    ctx.fillStyle='#cc1111';
    ctx.beginPath();
    ctx.moveTo(-3*s,6*s);ctx.lineTo(3*s,6*s);
    ctx.lineTo((3+swing*0.5)*s,14*s);ctx.lineTo((-3-swing*0.5)*s,14*s);
    ctx.closePath();ctx.fill();
    ctx.restore();
    // 검 글로우 (무기강화 시)
    if(weaponUpgradeLevel>0){
      const glow=Math.sin(t*0.008)*0.3+0.5;
      ctx.globalAlpha=glow*0.4;
      ctx.fillStyle='#aaaaff';
      ctx.beginPath();ctx.arc(12*s,-8*s,4+weaponUpgradeLevel,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
  }

  else if(cls==='gunner'){
    // 롱코트 자락: 이동 시 翻
    const coat=isMoving?Math.sin(t*0.016)*6:Math.sin(t*0.005)*1;
    ctx.save();
    ctx.globalAlpha=0.7;
    ctx.fillStyle='#18181e';
    // 코트 좌측
    ctx.beginPath();
    ctx.moveTo(-6*s,4*s);
    ctx.lineTo(-10*s,4*s);
    ctx.lineTo((-12+coat)*s,18*s);
    ctx.lineTo(-6*s,16*s);
    ctx.closePath();ctx.fill();
    // 코트 우측
    ctx.beginPath();
    ctx.moveTo(6*s,4*s);
    ctx.lineTo(10*s,4*s);
    ctx.lineTo((12-coat)*s,18*s);
    ctx.lineTo(6*s,16*s);
    ctx.closePath();ctx.fill();
    ctx.restore();
    // 스카프 펄럭임
    const scarf=isMoving?Math.sin(t*0.02)*3:0;
    ctx.save();
    ctx.globalAlpha=0.85;
    ctx.fillStyle='#cc2222';
    ctx.beginPath();
    ctx.moveTo(-6*s,-4*s);ctx.lineTo(6*s,-4*s);
    ctx.lineTo((8+scarf)*s,2*s);ctx.lineTo((-8-scarf)*s,2*s);
    ctx.closePath();ctx.fill();
    ctx.restore();
    // 총구 플래시 (공격 직후)
    if(performance.now()-lastShot<80){
      ctx.globalAlpha=0.6;
      ctx.fillStyle='#ffffaa';
      ctx.beginPath();ctx.arc(14*s,2*s,5,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
  }

  else if(cls==='mage'){
    // 마법 오라: 항상 회전
    const orbAng=t*0.01;
    const orbR=isMoving?14:12;
    const orbAlpha=isMoving?0.6:0.4;
    // 마법진 (바닥)
    ctx.save();
    ctx.globalAlpha=0.2+Math.sin(t*0.008)*0.1;
    ctx.strokeStyle='#cc2222';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,10*s,10*s,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(0,10*s,7*s,0,Math.PI*2);ctx.stroke();
    ctx.restore();
    // 오브 3개 회전
    for(let i=0;i<3;i++){
      const a=orbAng+(i/3)*Math.PI*2;
      const ox=Math.cos(a)*orbR*s,oy=Math.sin(a)*orbR*s*0.4+4*s;
      ctx.save();
      ctx.globalAlpha=orbAlpha;
      ctx.shadowColor='#ff3300';ctx.shadowBlur=6;
      ctx.fillStyle=i===0?'#ff2200':i===1?'#ff6600':'#cc0000';
      ctx.beginPath();ctx.arc(ox,oy,2.5*s,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    // 로브 펄럭임
    if(isMoving){
      const robeFlap=Math.sin(t*0.018)*4;
      ctx.save();
      ctx.globalAlpha=0.5;
      ctx.fillStyle='#0d0a12';
      ctx.beginPath();
      ctx.moveTo(-7*s,8*s);
      ctx.lineTo((-10+robeFlap)*s,18*s);
      ctx.lineTo(-4*s,16*s);
      ctx.closePath();ctx.fill();
      ctx.beginPath();
      ctx.moveTo(7*s,8*s);
      ctx.lineTo((10-robeFlap)*s,18*s);
      ctx.lineTo(4*s,16*s);
      ctx.closePath();ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawMe(){
  if(!myClass)return;
  const{x,y}=myPlayer,cls=CLASSES[myClass];
  ctx.save();
  // 그로기 상태
  if(myPlayer.groggy){
    ctx.globalAlpha=0.5;
    const spr=SPRITES[myClass];
    if(spr&&spr.complete&&spr.naturalWidth>0){
      ctx.imageSmoothingEnabled=false;ctx.drawImage(spr,x-16,y-16,32,32);
    }else{ctx.fillStyle='#666';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
    const gt=myPlayer.groggyTimer||0;
    const bW=40,bH=5,bX=x-bW/2,bY=y-28;
    ctx.fillStyle='#330000';ctx.fillRect(bX,bY,bW,bH);
    ctx.fillStyle='#ff4444';ctx.fillRect(bX,bY,bW*(gt/30),bH);
    ctx.strokeStyle='#880000';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
    ctx.fillStyle='#ff8888';ctx.font='8px monospace';ctx.textAlign='center';
    ctx.fillText('💀 '+(gt).toFixed(0)+'s',x,bY-3);
    ctx.restore();
    return;
  }
  if(invincible){const alpha=Math.sin(performance.now()*0.01)>0?1:0.3;ctx.globalAlpha=alpha;ctx.strokeStyle='#ffcc00';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  const spr=SPRITES[myClass];
  const t=performance.now();
  const isMoving=(jsX!==0||jsY!==0||keys['w']||keys['s']||keys['a']||keys['d']||keys['arrowup']||keys['arrowdown']||keys['arrowleft']||keys['arrowright']);
  // 바운스는 시각 전용 - 히트박스/공격위치(x,y)는 절대 변경 안 함
  const bounce=isMoving?Math.sin(t*0.015)*2:0;
  if(spr&&spr.complete&&spr.naturalWidth>0){
    ctx.imageSmoothingEnabled=false;
    ctx.shadowColor=cls.color;ctx.shadowBlur=14+weaponUpgradeLevel*4;
    ctx.drawImage(spr,x-16,y-16+bounce,32,32); // 시각만 bounce 적용
    ctx.shadowBlur=0;
  }else{
    ctx.shadowColor=cls.color;ctx.shadowBlur=14+weaponUpgradeLevel*4;
    ctx.fillStyle=cls.color;ctx.beginPath();ctx.arc(x,y+bounce,11,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.font='11px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(cls.icon,x,y+bounce);
  }
  // 애니메이션도 시각 오프셋만 - x,y는 그대로
  drawClassAnim(ctx,myClass,x,y+bounce,isMoving,t);
  const hpPct=Math.max(0,myPlayer.hp/myPlayer.maxHp),bW=30,bH=4,bX=x-bW/2,bY=y-22;
  ctx.fillStyle='#1a0000';ctx.fillRect(bX,bY,bW,bH);
  ctx.fillStyle=hpPct>0.5?'#44ff44':hpPct>0.25?'#ffaa00':'#ff4444';ctx.fillRect(bX,bY,bW*hpPct,bH);
  ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
  ctx.restore();
}
const PC=['#66aaff','#ff8866','#88ff88','#ffcc44'];
function drawOthers(){allPlayers.forEach((p,i)=>{
  if(p.id===myId||p.dead)return;
  const cls=CLASSES[p.cls]||null,c=cls?cls.color:PC[i%4];
  ctx.save();
  if(p.groggy){
    ctx.globalAlpha=0.5;
    const spr=cls?SPRITES[p.cls]:null;
    if(spr&&spr.complete&&spr.naturalWidth>0){ctx.imageSmoothingEnabled=false;ctx.drawImage(spr,p.x-16,p.y-16,32,32);}
    else{ctx.fillStyle='#666';ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
    const bW=40,bH=5,bX=p.x-bW/2,bY=p.y-28;
    if(p.reviveProgress>0){
      ctx.fillStyle='#003300';ctx.fillRect(bX,bY,bW,bH);
      ctx.fillStyle='#44ff44';ctx.fillRect(bX,bY,bW*p.reviveProgress,bH);
      ctx.strokeStyle='#00aa00';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
      ctx.fillStyle='#aaffaa';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText('부활 중...',p.x,bY-3);
    }else{
      ctx.fillStyle='#330000';ctx.fillRect(bX,bY,bW,bH);
      ctx.fillStyle='#ff4444';ctx.fillRect(bX,bY,bW*((p.groggyTimer||0)/30),bH);
      ctx.strokeStyle='#880000';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
      ctx.fillStyle='#ff8888';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText('💀 '+Math.ceil(p.groggyTimer||0)+'s',p.x,bY-3);
    }
    ctx.restore();return;
  }
  const spr=cls?SPRITES[p.cls]:null;
  const t2=performance.now();
  // 위치 변화로 이동 감지
  const pMoving=p._lastX!==undefined&&(Math.abs(p.x-p._lastX)>0.5||Math.abs(p.y-p._lastY)>0.5);
  p._lastX=p.x;p._lastY=p.y;
  // 바운스는 시각 전용
  const pBounce=pMoving?Math.sin(t2*0.015)*2:0;
  if(spr&&spr.complete&&spr.naturalWidth>0){
    ctx.imageSmoothingEnabled=false;ctx.shadowColor=c;ctx.shadowBlur=10;
    ctx.drawImage(spr,p.x-16,p.y-16+pBounce,32,32);ctx.shadowBlur=0;
  }else{
    ctx.shadowColor=c;ctx.shadowBlur=10;ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y+pBounce,11,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(cls){ctx.font='11px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(cls.icon,p.x,p.y+pBounce);}
  }
  if(p.cls)drawClassAnim(ctx,p.cls,p.x,p.y+pBounce,pMoving,t2);
  ctx.fillStyle='#ffffffcc';ctx.font='9px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
  ctx.fillText(p.name||'?',p.x,p.y-20);
  const hpPct=Math.max(0,p.hp/(p.maxHp||100)),bW=30,bH=4,bX=p.x-bW/2,bY=p.y-22;
  ctx.fillStyle='#1a0000';ctx.fillRect(bX,bY,bW,bH);
  ctx.fillStyle=hpPct>0.5?'#44ff44':hpPct>0.25?'#ffaa00':'#ff4444';ctx.fillRect(bX,bY,bW*hpPct,bH);
  ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
  ctx.restore();
});}
const E_STYLES={basic:{fill:'#bb1111',eye:'#ff5555',shadow:'#ff2222'},ranged:{fill:'#bb4411',eye:'#ffaa44',shadow:'#ff8822'},shield:{fill:'#226688',eye:'#44bbff',shadow:'#2299ff'},fast:{fill:'#1144bb',eye:'#44aaff',shadow:'#2266ff'},mage:{fill:'#662288',eye:'#dd44ff',shadow:'#aa22ff'}};
const E_ICONS={basic:'',ranged:'🎯',shield:'🛡',fast:'💨',mage:'🌀'};
// 렌더 크기 고정값 (히트박스 r과 별개)
const E_RENDER_R={basic:10,ranged:9,shield:14,fast:8,mage:10};
function drawEnemies(){for(const e of enemies){const st=E_STYLES[e.type]||E_STYLES.basic,r=E_RENDER_R[e.type]||10;ctx.save();ctx.shadowColor=st.shadow;ctx.shadowBlur=6;ctx.fillStyle=st.fill;ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);ctx.fill();if(e.type==='shield'&&e.shieldHp>0){ctx.strokeStyle='#44bbff88';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,r+4,0,Math.PI*2);ctx.stroke();}ctx.shadowBlur=0;ctx.fillStyle=st.eye;ctx.beginPath();ctx.arc(e.x-r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(e.x+r*0.25,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();ctx.fillStyle='#220000';ctx.fillRect(e.x-r,e.y-r-8,r*2,3);ctx.fillStyle=st.shadow;ctx.fillRect(e.x-r,e.y-r-8,r*2*(e.hp/e.maxHp),3);let sx=e.x+r+2;if(e.poison&&e.poison>0){ctx.font='8px serif';ctx.fillStyle='#44ff44';ctx.fillText('☠',sx,e.y-r);sx+=10;}if(e.iceEnd&&e.iceEnd>performance.now()){ctx.font='8px serif';ctx.fillStyle='#44ddff';ctx.fillText('❄',sx,e.y-r);sx+=10;}if(e.atkSlow){ctx.font='8px serif';ctx.fillStyle='#ffaa44';ctx.fillText('⬇',sx,e.y-r);}if(E_ICONS[e.type]){ctx.font='8px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(E_ICONS[e.type],e.x,e.y+r+6);}ctx.restore();}}
function drawBoss(){
  const b=bossData,isFinal=b.isFinal||false;
  const t=performance.now();
  ctx.save();
  ctx.translate(b.x,b.y);

  if(!isFinal){
    // ── 중간보스: 불꽃 악마 스프라이트 ──────────────────────
    const phase2=b.phase===2;
    const bobY=Math.sin(t*0.002)*4; // 시각 전용, translate 안 함

    // 불꽃 파티클 애니메이션
    ctx.save();
    for(let i=0;i<6;i++){
      const pa=(t*0.004+i*1.05)%(Math.PI*2);
      const pr=30+Math.sin(t*0.006+i)*8;
      const py=-20+Math.sin(t*0.003+i*0.7)*6;
      ctx.globalAlpha=0.4+Math.sin(t*0.008+i)*0.2;
      ctx.fillStyle=phase2?'#ff66ff':i%2===0?'#ff5544':'#ff8866';
      ctx.beginPath();ctx.arc(Math.cos(pa)*pr*0.5,py+bobY+Math.sin(pa)*pr*0.3,3+Math.sin(t*0.01+i)*2,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    ctx.restore();

    // 스프라이트 (bobY는 drawImage에만)
    const spr=SPRITES['midboss'];
    ctx.save();
    ctx.imageSmoothingEnabled=false;
    if(phase2){ctx.shadowColor='#ff44ff';ctx.shadowBlur=30;}
    else{ctx.shadowColor='#ff4466';ctx.shadowBlur=20;}
    if(spr&&spr.complete&&spr.naturalWidth>0){
      ctx.drawImage(spr,-42,-42+bobY,84,84);
    }else{
      ctx.fillStyle=phase2?'#cc22cc':'#cc2244';
      ctx.beginPath();ctx.arc(0,bobY,38,0,Math.PI*2);ctx.fill();
    }
    ctx.shadowBlur=0;
    ctx.restore();

    // 마법진 (발 아래 - bobY 적용)
    ctx.save();
    ctx.globalAlpha=0.3+Math.sin(t*0.004)*0.1;
    ctx.strokeStyle=phase2?'#ff66ff':'#ff4466';
    ctx.lineWidth=1.5;
    const spin=t*0.002;
    ctx.beginPath();
    for(let i=0;i<8;i++){const a=spin+(i/8)*Math.PI*2;i===0?ctx.moveTo(Math.cos(a)*36,Math.sin(a)*14+38+bobY):ctx.lineTo(Math.cos(a)*36,Math.sin(a)*14+38+bobY);}
    ctx.closePath();ctx.stroke();
    ctx.restore();

    // 체력바
    const hpPct=b.hp/b.maxHp;
    ctx.fillStyle='#1a0000';ctx.fillRect(-44,-60,88,8);
    ctx.fillStyle=hpPct>0.5?'#ff4466':phase2?'#ff44ff':'#cc2244';
    ctx.fillRect(-44,-60,88*hpPct,8);
    ctx.strokeStyle='#660022';ctx.lineWidth=1;ctx.strokeRect(-44,-60,88,8);
    ctx.fillStyle='#fff';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.fillText(phase2?'🔥 INFERNO DEMON':'🔥 FLAME DEMON',0,-64);
    if(phase2){ctx.fillStyle='#ff88ff';ctx.font='bold 7px monospace';ctx.fillText('PHASE 2',0,-54);}
    if(b.iceEnd&&b.iceEnd>t){ctx.fillStyle='#44ddff';ctx.font='12px serif';ctx.fillText('❄',52,-58);}
    ctx.lineWidth=1.5;
    for(let r=0;r<3;r++){
      const rr=20+r*10,spin=(t*0.001*(r%2===0?1:-1));
      ctx.beginPath();
      for(let i=0;i<8;i++){
        const a=spin+(i/8)*Math.PI*2;
        i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr*0.35+38):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr*0.35+38);
      }
      ctx.closePath();ctx.stroke();
    }
    ctx.restore();

  }else{
    // ── 최종보스: 네크로맨서 스프라이트 ──────────────────────
    const phase2=b.phase===2;
    const bobY=Math.sin(t*0.0015)*2; // 시각 전용, translate 안 함

    // 체인 파티클
    ctx.save();
    const ang=b.ang||t*0.003;
    for(let i=0;i<8;i++){
      const a=ang+(i/8)*Math.PI*2;
      const cr=38+Math.sin(t*0.004+i)*5;
      ctx.globalAlpha=0.5;
      ctx.fillStyle=phase2?'#ff4466':'#884422';
      ctx.fillRect(Math.cos(a)*cr-2,Math.sin(a)*cr-2+bobY,4,4);
    }
    ctx.globalAlpha=1;
    ctx.restore();

    // 스프라이트 (bobY는 drawImage에만)
    const spr=SPRITES['necromancer'];
    ctx.save();
    ctx.imageSmoothingEnabled=false;
    if(phase2){ctx.shadowColor='#ff2244';ctx.shadowBlur=35;}
    else{ctx.shadowColor='#660022';ctx.shadowBlur=22;}
    if(spr&&spr.complete&&spr.naturalWidth>0){
      ctx.drawImage(spr,-48,-48+bobY,96,96);
    }else{
      ctx.fillStyle=phase2?'#550033':'#880000';
      ctx.beginPath();ctx.arc(0,bobY,42,0,Math.PI*2);ctx.fill();
    }
    ctx.shadowBlur=0;
    ctx.restore();

    // 눈 빛 (bobY 적용)
    const eyeGlow=Math.sin(t*0.005)*0.4+0.6;
    ctx.save();
    ctx.globalAlpha=eyeGlow*0.7;
    ctx.shadowColor=phase2?'#ff2244':'#cc0022';
    ctx.shadowBlur=10;
    ctx.fillStyle=phase2?'#ff4466':'#cc1133';
    ctx.beginPath();ctx.ellipse(-7,-18+bobY,3,3,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(7,-18+bobY,3,3,0,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
    ctx.restore();

    const hpPct=b.hp/b.maxHp;
    ctx.fillStyle='#1a0000';ctx.fillRect(-44,-66,88,8);
    ctx.fillStyle=hpPct>0.5?'#aa0022':phase2?'#ff2244':'#880011';
    ctx.fillRect(-44,-66,88*hpPct,8);
    ctx.strokeStyle='#440011';ctx.lineWidth=1;ctx.strokeRect(-44,-66,88,8);
    ctx.fillStyle='#fff';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.fillText('☠ NECROMANCER',0,-70);
    if(phase2){ctx.fillStyle='#ff4466';ctx.font='bold 7px monospace';ctx.fillText('PHASE 2',0,-60);}
    if(b.iceEnd&&b.iceEnd>t){ctx.fillStyle='#44ddff';ctx.font='12px serif';ctx.fillText('❄',52,-64);}
  }

  ctx.restore();
}
function drawTurrets(){for(const t of turrets){ctx.save();ctx.fillStyle='#333344';ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6666ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#8888ff';ctx.beginPath();ctx.arc(t.x,t.y,t.r*0.6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#220022';ctx.fillRect(t.x-t.r,t.y-t.r-10,t.r*2,4);ctx.fillStyle='#8888ff';ctx.fillRect(t.x-t.r,t.y-t.r-10,t.r*2*(t.hp/t.maxHp),4);ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('⚡',t.x,t.y-t.r-12);ctx.restore();}}
function drawProjs(){for(const p of projs){ctx.save();let col=p.color;if(p.element&&weaponUpgradeLevel>=2)col=ELEMENT_COLORS[p.element];ctx.shadowColor=col;ctx.shadowBlur=p.visual?4:p.isMagic?12:8;ctx.globalAlpha=p.visual?0.6:1;ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();if(!p.visual&&!p.enemy&&weaponUpgradeLevel>=3&&p.isMagic){ctx.strokeStyle=col+'44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+3,0,Math.PI*2);ctx.stroke();}ctx.restore();}}
function drawParts(){for(const p of parts){const a=p.life/p.maxLife;ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*a,0,Math.PI*2);ctx.fill();ctx.restore();}}
function drawExplosions(){for(const ex of explosions){const a=ex.life/ex.maxLife,cr=ex.r*(1-a*0.3);ctx.save();ctx.globalAlpha=a*0.7;ctx.shadowColor=ex.color;ctx.shadowBlur=20;ctx.strokeStyle=ex.color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(ex.x,ex.y,cr,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=a*0.4;ctx.fillStyle=ex.color;ctx.beginPath();ctx.arc(ex.x,ex.y,cr*0.6,0,Math.PI*2);ctx.fill();ctx.restore();}}
function drawFireZones(){for(const fz of fireZones){const a=fz.life/fz.maxLife;ctx.save();ctx.globalAlpha=a*0.4;ctx.fillStyle='#ff4400';ctx.beginPath();ctx.arc(fz.x,fz.y,30,0,Math.PI*2);ctx.fill();ctx.globalAlpha=a*0.6;ctx.strokeStyle='#ff6600';ctx.lineWidth=2;ctx.beginPath();ctx.arc(fz.x,fz.y,30,0,Math.PI*2);ctx.stroke();ctx.restore();}}
function drawOrbs(){const t=performance.now()*0.004;for(const o of orbs){if(o.col)continue;ctx.save();ctx.shadowColor='#44aaff';ctx.shadowBlur=8;ctx.fillStyle='#2266cc';ctx.beginPath();ctx.arc(o.x,o.y+Math.sin(t+o.x)*2,5,0,Math.PI*2);ctx.fill();ctx.restore();}}
function spawnParts(x,y,color,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*2.5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:350,maxLife:350,r:3,color});}}
let msgTimer=0;
function showPop(txt,dur){const el=document.getElementById('msgPop');el.textContent=txt;el.style.display='block';msgTimer=dur||1400;}
function addKf(txt){const f=document.getElementById('killFeed'),el=document.createElement('div');el.className='kf';el.textContent=txt;f.appendChild(el);setTimeout(()=>el.remove(),2600);while(f.children.length>4)f.removeChild(f.firstChild);}
function endGame(win){running=false;hideGameUI();const el=document.getElementById('goScreen');el.style.display='flex';document.getElementById('goTitle').textContent=win?'ALL CLEAR! 🎉':'GAME OVER';document.getElementById('goTitle').style.color=win?'#ffcc00':'#ff4444';const stagesCleared=win?3:currentStage-1;document.getElementById('goStats').innerHTML='스테이지: '+stagesCleared+'/3<br>직업: '+(myClass?CLASSES[myClass].name:'없음')+'<br>처치: '+kills+'<br>점수: '+score+'<br>레벨: '+(myPlayer?myPlayer.lv:1)+'<br>특성: '+(myTraits.length>0?myTraits.map(id=>ALL_TRAITS.find(t=>t.id===id)?.name||id).join(', '):'없음');}
function loop(ts){const dt=Math.min(ts-lastTime,50);lastTime=ts;if(msgTimer>0){msgTimer-=dt;if(msgTimer<=0)document.getElementById('msgPop').style.display='none';}if(running){update(dt);draw();}else if(myPlayer&&!myPlayer.dead&&document.getElementById('lvlUpScreen').style.display==='flex'){draw();}requestAnimationFrame(loop);}
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
function genCode(){let code,a=0;do{code=Math.random().toString(36).substr(2,5).toUpperCase();a++;}while(rooms.has(code)&&a<100);return code;}
function bcast(room,msg,except){
  const d=JSON.stringify(msg);
  room.players.forEach((_,ws)=>{
    if(ws===except||ws.readyState!==1)return;
    // 버퍼가 64KB 이상 쌓이면 해당 클라이언트에 전송 스킵 (폭주 방지)
    if(ws.bufferedAmount>65536)return;
    try{ws.send(d);}catch(e){}
  });
}
function bcastAll(room,msg){bcast(room,msg,null);}
const ETYPES=[{type:'basic',spd:1.0,hpMult:1.0,r:12,dmgMult:1.0},{type:'ranged',spd:0.65,hpMult:0.75,r:11,dmgMult:0.8},{type:'shield',spd:0.55,hpMult:2.8,r:14,dmgMult:1.2,shieldHp:true},{type:'fast',spd:2.2,hpMult:0.55,r:10,dmgMult:0.9},{type:'mage',spd:0.7,hpMult:0.85,r:11,dmgMult:1.1}];
const SPAWN_WEIGHTS=[[0.55,0.2,0.1,0.1,0.05],[0.35,0.2,0.15,0.15,0.15],[0.2,0.2,0.15,0.2,0.25]];
function pickEtype(stage){const w=SPAWN_WEIGHTS[Math.min(stage-1,2)];const r=Math.random();let cum=0;for(let i=0;i<w.length;i++){cum+=w[i];if(r<cum)return ETYPES[i];}return ETYPES[0];}
function spawnEnemies(room){if(room.midBossAlive||room.finalBossAlive)return;const gp=(600-room.stageTime)/600,pc=room.players.size,sm=room.currentStage;const cnt=Math.max(1,Math.floor((1+gp*1.5+(pc-1)*0.4)*sm*1.8));const arr=[...room.players.values()].filter(p=>!p.dead);if(!arr.length)return;const ref=arr[Math.floor(Math.random()*arr.length)];for(let i=0;i<cnt;i++){const a=Math.random()*Math.PI*2,r=350+Math.random()*80,et=pickEtype(room.currentStage);const bh=(20+Math.random()*15*(1+gp*2))*sm*(1+(pc-1)*0.3);room.enemies.push({id:room.eid++,x:ref.x+Math.cos(a)*r,y:ref.y+Math.sin(a)*r,hp:bh*et.hpMult,maxHp:bh*et.hpMult,spd:et.spd*(1+(room.currentStage-1)*0.3+gp*0.4),type:et.type,r:et.r,dead:false,lastShot:0,shieldHp:et.shieldHp?Math.floor(bh*0.5):0,dmgMult:et.dmgMult*(1+gp*0.3),poison:0,ice:false,atkSlow:false});}if(room.enemies.length>150)room.enemies=room.enemies.filter(e=>!e.dead).slice(-150);}
function spawnBossMobs(room){const pc=room.players.size,cnt=3+pc*2;const arr=[...room.players.values()].filter(p=>!p.dead);if(!arr.length)return;const br=room.boss||{x:0,y:0};for(let i=0;i<cnt;i++){const a=Math.random()*Math.PI*2,r=200+Math.random()*150;const et=Math.random()<0.8?ETYPES[1]:ETYPES[2];const bh=(30+Math.random()*20)*(1+(pc-1)*0.3);room.enemies.push({id:room.eid++,x:br.x+Math.cos(a)*r,y:br.y+Math.sin(a)*r,hp:bh*et.hpMult,maxHp:bh*et.hpMult,spd:et.spd*1.2,type:et.type,r:et.r,dead:false,lastShot:0,shieldHp:et.shieldHp?Math.floor(bh*0.5):0,dmgMult:et.dmgMult*1.3,poison:0,ice:false,atkSlow:false});}}
function spawnBoss(room,isFinal){
  const pc=room.players.size;
  const ARENA=800; // 보스전 아레나 반경
  // 1. 모든 플레이어를 아레나 안으로 순간이동
  room.players.forEach(p=>{
    const d=Math.sqrt(p.x*p.x+p.y*p.y);
    if(d>ARENA*0.7){
      const a=Math.atan2(p.y,p.x);
      p.x=Math.cos(a)*ARENA*0.6;
      p.y=Math.sin(a)*ARENA*0.6;
    }
  });
  // 2. 보스 등장 위치 (중앙 기준)
  const bossSpawnX=0, bossSpawnY=0;
  // 3. 5초 예고 전송
  bcastAll(room,{t:'bossWarning',isFinal,x:bossSpawnX,y:bossSpawnY,countdown:5});
  // 4. 5초 후 실제 보스 등장
  setTimeout(()=>{
    const bh=isFinal?(4500+room.currentStage*800):(2200+room.currentStage*400);
    const hp=bh*(1+(pc-1)*0.5);
    room.boss={hp,maxHp:hp,x:bossSpawnX,y:bossSpawnY,r:42,dead:false,ang:0,phase:1,isFinal,playerCount:pc,lastHeavy:0,lastHpThreshold:100,armor:isFinal?0.7:0.5};
    room.enemies=[];
    if(isFinal){
      room.turrets=[];
      for(let i=0;i<5+pc;i++){const angle=(i/(5+pc))*Math.PI*2,dist=250+Math.random()*100;room.turrets.push({id:'turret_'+i,x:Math.cos(angle)*dist,y:Math.sin(angle)*dist,hp:1000,maxHp:1000,r:25,isTurret:true,dead:false});}
      bcastAll(room,{t:'finalBoss',boss:room.boss});
      bcastAll(room,{t:'turrets',turrets:room.turrets});
    }else{
      room.midBossAlive=true;
      bcastAll(room,{t:'midBoss',boss:room.boss});
    }
  },5000);
}

function tickRoom(code){
  try{
  const room=rooms.get(code);if(!room||!room.started)return;
  const now=Date.now(),dt=Math.min((now-room.lastTick)/1000,0.1);room.lastTick=now;room.stageTime-=dt;room.stateTick=(room.stateTick||0)+1;
  room.players.forEach((p,ws)=>{
    if(!p.dead&&!p.groggy&&p.regen)p.hp=Math.min(p.hp+p.regen*dt,p.maxHp);
    if(p.invincibleEnd>0&&p.invincibleEnd!==Infinity&&now>=p.invincibleEnd){p.invincible=false;p.invincibleEnd=0;}
    // 그로기 타이머 - 30초 후 게임오버
    if(p.groggy){
      p.groggyTimer=Math.max(0,(p.groggyTimer||30)-dt);
      if(p.groggyTimer<=0){p.groggy=false;p.dead=true;if(ws.readyState===1)ws.send(JSON.stringify({t:'groggyDead'}));}
    }
  });
  // 부활 감지 - 살아있는 플레이어가 그로기 플레이어 근처(60px) 5초 있으면 부활
  room.players.forEach((gp,gws)=>{
    if(!gp.groggy)return;
    let nearReviver=false;
    room.players.forEach((rp,rws)=>{
      if(rp.dead||rp.groggy||rws===gws)return;
      const dx=rp.x-gp.x,dy=rp.y-gp.y;
      if(Math.sqrt(dx*dx+dy*dy)<60)nearReviver=true;
    });
    if(nearReviver){
      gp.reviveProgress=(gp.reviveProgress||0)+dt/5;
      if(gp.reviveProgress>=1){
        gp.groggy=false;gp.dead=false;gp.hp=gp.maxHp*0.3;gp.reviveProgress=0;
        bcastAll(room,{t:'revived',id:gp.id});
      }
    }else{
      gp.reviveProgress=Math.max(0,(gp.reviveProgress||0)-dt/3);
    }
  });
  if(!room.midBossAlive&&!room.finalBossAlive&&!room.stageClearPending){room.spawnT=(room.spawnT||0)+dt;if(room.spawnT>0.7){room.spawnT=0;spawnEnemies(room);}}
  if(!room.midBossSpawned&&room.stageTime<=300){room.midBossSpawned=true;spawnBoss(room,false);}
  if(room.midBossAlive)room.stageTime=Math.max(room.stageTime,0.1);
  if(!room.finalBossSpawned&&!room.midBossAlive&&room.midBossSpawned&&room.stageTime<=0){room.finalBossSpawned=true;room.stageTime=0;spawnBoss(room,true);}
  const arr=[...room.players.values()];
  // [FIX] 스테이지 클리어 대기 중 적 AI 완전 차단
  if(!room.stageClearPending){
  room.enemies=room.enemies.filter(e=>!e.dead);
  for(const e of room.enemies){
    if(e.poison>0){e.hp-=e.maxHp*0.004*e.poison*dt;if(e.hp<=1)e.hp=1;}
    const isIced=e.iceEnd&&e.iceEnd>now,sm=isIced?0.85:1,dm=isIced?0.85:1;
    let near=null,md=Infinity;for(const p of arr){if(p.dead||p.groggy)continue;const dx=p.x-e.x,dy=p.y-e.y,d=dx*dx+dy*dy;if(d<md){md=d;near=p;}}if(!near)continue;md=Math.sqrt(md);const dx=near.x-e.x,dy=near.y-e.y;
    if(e.type==='ranged'){if(md>180){e._vx=dx/md*e.spd*sm*60;e._vy=dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else if(md<120){e._vx=-dx/md*e.spd*sm*60;e._vy=-dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else{e._vx=0;e._vy=0;}e.lastShot+=dt;if(e.lastShot>(e.atkSlow?3.3:2.2)*(isIced?1.176:1)){e.lastShot=0;bcastAll(room,{t:'pat',i:-1,bx:e.x,by:e.y,ang:Math.atan2(dy,dx),phase:0,etype:'ranged'});}}
    else if(e.type==='mage'){if(md>220){e._vx=dx/md*e.spd*sm*60;e._vy=dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else if(md<160){e._vx=-dx/md*e.spd*0.8*sm*60;e._vy=-dy/md*e.spd*0.8*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else{e._vx=0;e._vy=0;}e.lastShot+=dt;if(e.lastShot>(e.atkSlow?4.2:2.8)*(isIced?1.176:1)){e.lastShot=0;bcastAll(room,{t:'pat',i:-1,bx:e.x,by:e.y,ang:Math.atan2(dy,dx),phase:0,etype:'mage'});}}
    else{e._vx=dx/md*e.spd*sm*60;e._vy=dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}
    if(md<e.r+14){const isInv=near.invincible||(near.invincibleEnd>0&&near.invincibleEnd>now);if(!isInv){near.hp-=0.35*e.dmgMult*dm*dt*60*(1-(near.armor||0));if(near.hp<=0){near.hp=0;const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==near).length;if(ac>0){near.groggy=true;near.groggyTimer=30;near.reviveProgress=0;}else near.dead=true;}}}
  }
  if(room.fireZones&&room.fireZones.length>0){room.fireZones=room.fireZones.filter(fz=>fz.life>0);for(const fz of room.fireZones){fz.life-=dt*1000;for(const e of room.enemies){const dx=e.x-fz.x,dy=e.y-fz.y;if(Math.sqrt(dx*dx+dy*dy)<30+e.r){e.hp-=fz.dmg*dt*2;if(e.hp<=0)e.dead=true;}}}}
  if(room.boss&&!room.boss.dead){
    const b=room.boss;b.ang+=dt*1.5;if(b.hp<b.maxHp/2&&b.phase===1){b.phase=2;bcastAll(room,{t:'phase2'});}
    if(b.isFinal){const hp=Math.floor((b.hp/b.maxHp)*100),thr=Math.floor(hp/10)*10;if(thr<b.lastHpThreshold){b.lastHpThreshold=thr;spawnBossMobs(room);}}
    if(b.isFinal&&room.turrets&&room.turrets.some(t=>!t.dead&&t.hp>0))b.hp=Math.min(b.hp+b.maxHp*0.05*dt,b.maxHp);
    const isIced=b.iceEnd&&b.iceEnd>now,bs=(b.isFinal?2.0:1.6)*(isIced?0.85:1),bd=isIced?0.85:1;
    let near=null,md=Infinity;for(const p of arr){if(p.dead||p.groggy)continue;const dx=p.x-b.x,dy=p.y-b.y,d=dx*dx+dy*dy;if(d<md){md=d;near=p;}}
    if(near){md=Math.sqrt(md)||1;const dx=near.x-b.x,dy=near.y-b.y;b.x+=dx/md*bs*dt*60;b.y+=dy/md*bs*dt*60;if(md<b.r+14){const isInv=near.invincible||(near.invincibleEnd>0&&near.invincibleEnd>now);if(!isInv){const cd=b.isFinal?(b.phase===1?0.4:0.6):(b.phase===1?0.3:0.45);near.hp-=cd*bd*dt*60*(1-(near.armor||0));if(near.hp<=0){near.hp=0;const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==near).length;if(ac>0){near.groggy=true;near.groggyTimer=30;near.reviveProgress=0;}else near.dead=true;}}}b.lastHeavy=(b.lastHeavy||0)+dt;if(b.lastHeavy>(isIced?4.7:4)){b.lastHeavy=0;bcastAll(room,{t:'pat',i:-2,bx:b.x,by:b.y,ang:Math.atan2(dy,dx),phase:b.phase,isFinal:b.isFinal});}}
    room.patT=(room.patT||0)+dt;const pi=(b.isFinal?(b.phase===1?1.3:0.9):(b.phase===1?1.8:1.3))*(isIced?1.176:1);if(room.patT>pi){room.patT=0;bcastAll(room,{t:'pat',i:(room.patI||0)%(b.phase===1?3:5),bx:b.x,by:b.y,ang:b.ang,phase:b.phase,isFinal:b.isFinal});room.patI=(room.patI||0)+1;}
  }
  } // end stageClearPending check
  room.syncT=(room.syncT||0)+dt;
  // 인원 많을수록 전송 주기 늘림 (2인:50ms, 3인:70ms, 4인:90ms)
  const syncInterval=0.03+room.players.size*0.02;
  if(room.syncT>syncInterval){
    room.syncT=0;const ps=[];
    room.players.forEach((p,ws)=>{
      ps.push({id:p.id,x:Math.round(p.x),y:Math.round(p.y),hp:p.hp,maxHp:p.maxHp,lv:p.lv,dead:p.dead,groggy:p.groggy||false,groggyTimer:p.groggyTimer||0,reviveProgress:p.reviveProgress||0,name:p.name,exp:p.exp,expNext:p.expNext,cls:p.cls,dmgBonus:p.dmgBonus||1,armor:p.armor||0,regen:p.regen||0,rangeMult:p.rangeMult||1,cdMult:p.cdMult||1,spdMult:p.spdMult||1,critRate:p.critRate||0});
      // lvUpPending 제거 - syncT에서 전송 안 함 (lvUpReady pull 방식으로만 처리)
    });
    const se=room.stateTick%2===0,sf=room.stateTick%10===0;
    const ed=se?room.enemies.map(e=>sf?{id:e.id,x:Math.round(e.x),y:Math.round(e.y),hp:Math.round(e.hp),vx:e._vx||0,vy:e._vy||0,maxHp:Math.round(e.maxHp),type:e.type,r:e.r,shieldHp:e.shieldHp,poison:e.poison,iceEnd:e.iceEnd,atkSlow:e.atkSlow}:{id:e.id,x:Math.round(e.x),y:Math.round(e.y),hp:Math.round(e.hp),vx:e._vx||0,vy:e._vy||0}):undefined;
    bcastAll(room,{t:'state',players:ps,enemies:ed,boss:room.boss&&!room.boss.dead?{x:Math.round(room.boss.x),y:Math.round(room.boss.y),hp:room.boss.hp,maxHp:room.boss.maxHp,phase:room.boss.phase,ang:room.boss.ang,isFinal:room.boss.isFinal,iceEnd:room.boss.iceEnd}:null,turrets:room.stateTick%10===0&&room.turrets?room.turrets.filter(t=>t.hp>0).map(t=>({id:t.id,x:t.x,y:t.y,hp:t.hp,maxHp:t.maxHp,r:t.r,isTurret:true})):undefined,st:room.stageTime,stage:room.currentStage});
  }
  const alive=arr.filter(p=>!p.dead&&!p.groggy);if(alive.length===0&&arr.length>0){bcastAll(room,{t:'over',win:false});clearInterval(room.tick);rooms.delete(code);}
  }catch(e){console.error('[tickRoom error]',e);} // tick이 죽지 않도록 catch
}

wss.on('connection',ws=>{
  ws.pid=Math.random().toString(36).substr(2,6);ws.roomCode=null;
  ws.isAlive=true;
  ws.on('pong',()=>{ws.isAlive=true;});
  ws.on('message',raw=>{
    let msg;try{msg=JSON.parse(raw);}catch{return;}
    // ping/pong 처리
    if(msg.t==='ping'){if(ws.readyState===1)ws.send(JSON.stringify({t:'pong'}));return;}
    const newPlayer=(name,x=0,y=0)=>({id:ws.pid,x,y,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false,groggy:false,groggyTimer:0,reviveProgress:0,name,lvUp:false,cls:null,regen:0,armor:0,expMult:1,critRate:0,dmgBonus:1,invincible:false,invincibleEnd:0,lvUpQueue:0});
    if(msg.t==='create'){
      const code=genCode();
      rooms.set(code,{players:new Map(),enemies:[],boss:null,turrets:[],fireZones:[],stageTime:600,currentStage:1,started:false,midBossSpawned:false,finalBossSpawned:false,midBossAlive:false,finalBossAlive:false,eid:0,lastTick:Date.now(),readyCount:0});
      ws.roomCode=code;rooms.get(code).players.set(ws,newPlayer(msg.name||'Player'));
      ws.send(JSON.stringify({t:'created',code,id:ws.pid}));
      bcastAll(rooms.get(code),{t:'lobby',players:[...rooms.get(code).players.values()].map(p=>({id:p.id,name:p.name}))});
    }
    else if(msg.t==='join'){
      const code=(msg.code||'').toUpperCase(),room=rooms.get(code);
      if(!room){ws.send(JSON.stringify({t:'err',msg:'방을 찾을 수 없어요'}));return;}
      if(room.started){ws.send(JSON.stringify({t:'err',msg:'이미 시작된 방이에요'}));return;}
      ws.roomCode=code;const idx=room.players.size;const sp=[{x:0,y:0},{x:60,y:-40},{x:-60,y:40},{x:40,y:60}][idx%4];
      room.players.set(ws,newPlayer(msg.name||('P'+(idx+1)),sp.x,sp.y));
      ws.send(JSON.stringify({t:'joined',code,id:ws.pid}));
      bcastAll(room,{t:'lobby',players:[...room.players.values()].map(p=>({id:p.id,name:p.name}))});
    }
    else if(msg.t==='start'){const room=rooms.get(ws.roomCode);if(!room)return;bcastAll(room,{t:'classSelect'});}
    else if(msg.t==='classReady'){
      const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;
      p.cls=msg.cls||'warrior';
      const CLS={warrior:{hp:150,maxHp:150,regen:2.0,armor:0.15,critRate:0,expMult:1},gunner:{hp:80,maxHp:80,regen:0.5,armor:0,critRate:0,expMult:1},mage:{hp:65,maxHp:65,regen:0.7,armor:0,critRate:0,expMult:1},assassin:{hp:85,maxHp:85,regen:0.2,armor:0,critRate:40,expMult:1}};
      const cls=CLS[p.cls]||CLS.warrior;p.hp=cls.hp;p.maxHp=cls.maxHp;p.regen=cls.regen;p.armor=cls.armor;p.critRate=cls.critRate;p.expMult=cls.expMult;p.rangeMult=1;p.cdMult=1;p.spdMult=1;
      room.readyCount=(room.readyCount||0)+1;if(room.readyCount>=room.players.size){room.started=true;room.lastTick=Date.now();bcastAll(room,{t:'allReady'});room.tick=setInterval(()=>tickRoom(ws.roomCode),60);}
    }
    else if(msg.t==='move'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      const p=room.players.get(ws);if(!p||p.dead||p.groggy)return;
      // rate limit: 40ms 이내 중복 move 무시 (3명이상 메시지 폭주 방지)
      const nowMs=Date.now();
      if(p._lastMove&&nowMs-p._lastMove<40)return;
      p._lastMove=nowMs;
      const MS=room.boss&&!room.boss.dead?800:3500;
      p.x=Math.max(-MS,Math.min(MS,msg.x));
      p.y=Math.max(-MS,Math.min(MS,msg.y));
    }
    else if(msg.t==='enemyHit'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p||p.dead||p.groggy)return;const n=Date.now(),isInv=p.invincible||(p.invincibleEnd>0&&p.invincibleEnd>n);if(!isInv){p.hp-=msg.dmg*(1-(p.armor||0));if(p.hp<=0){p.hp=0;const aliveCount=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==p).length;if(aliveCount>0){p.groggy=true;p.groggyTimer=30;p.reviveProgress=0;}else p.dead=true;}}}
    else if(msg.t==='updateMaxHp'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.maxHp=msg.maxHp;p.hp=msg.hp;}
    else if(msg.t==='updateRegen'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.regen=msg.regen;}
    else if(msg.t==='updateArmor'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.armor=msg.armor;}
    else if(msg.t==='updateExpMult'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.expMult=msg.expMult;}
    else if(msg.t==='updateCritRate'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.critRate=msg.critRate;}
    else if(msg.t==='hit'){
      const room=rooms.get(ws.roomCode);if(!room)return;const el=msg.element,tier=msg.elementTier||0;
      // NaN/Infinity 방어
      const safeDmg=(!isNaN(msg.dmg)&&isFinite(msg.dmg)&&msg.dmg>0)?msg.dmg:0;
      if(safeDmg<=0)return;
      if(msg.target==='boss'){
        if(room.boss&&!room.boss.dead){
          const wt=msg.weaponType||'melee',ba=wt==='ranged'?0:wt==='magic'?(room.boss.isFinal?0.8:0.6):(room.boss.isFinal?0.7:0.5);
          if(msg.element==='ice'&&tier>=2)room.boss.iceEnd=Date.now()+3000;
          room.boss.hp-=safeDmg*(1-ba);
          if(room.boss.hp<=0){room.boss.dead=true;const isFinal=room.boss.isFinal;
            if(isFinal){room.players.forEach(p=>{if(!p.dmgBonus)p.dmgBonus=1;p.dmgBonus*=1.25;});if(room.currentStage<3){
              bcastAll(room,{t:'weaponUpgrade',msg:'최종 보스 처치! (+25% 데미지)'});
              bcastAll(room,{t:'stageClear',stage:room.currentStage,next:room.currentStage+1});
              // [FIX] 스테이지 전환 대기 중 적 AI/데미지 차단 + 전원 무적
              room.stageClearPending=true;
              room.enemies=[];
              room.players.forEach(p=>{p.invincible=true;p.invincibleEnd=Infinity;});
              setTimeout(()=>{
                room.currentStage++;room.stageTime=600;
                room.midBossSpawned=false;room.finalBossSpawned=false;
                room.midBossAlive=false;room.finalBossAlive=false;
                room.boss=null;room.enemies=[];room.turrets=[];room.fireZones=[];
                room.stageClearPending=false;
                // 무적 해제
                room.players.forEach(p=>{p.invincible=false;p.invincibleEnd=0;});
                bcastAll(room,{t:'stageStart',stage:room.currentStage});
              },5500);
            }else{bcastAll(room,{t:'weaponUpgrade',msg:'최종 보스 처치! 승리!'});bcastAll(room,{t:'over',win:true});clearInterval(room.tick);rooms.delete(ws.roomCode);}}
            else{room.midBossAlive=false;room.boss=null;bcastAll(room,{t:'midBossDead'});bcastAll(room,{t:'bossHp',hp:0});room.players.forEach(p=>{if(!p.dmgBonus)p.dmgBonus=1;p.dmgBonus*=1.15;});bcastAll(room,{t:'weaponUpgrade',msg:'중간 보스 처치! (+15% 데미지)'});}
          }else bcastAll(room,{t:'bossHp',hp:room.boss.hp});
        }
      }else if(msg.target==='turret'){
        const t=room.turrets?room.turrets.find(tt=>tt.id===msg.tid):null;if(t&&t.hp>0){t.hp-=safeDmg;if(t.hp<=0){t.hp=0;t.dead=true;if(room.boss&&room.boss.isFinal)spawnBossMobs(room);}bcastAll(room,{t:'turretHp',id:t.id,hp:t.hp});}
      }else{
        const e=room.enemies.find(e=>e.id===msg.eid&&!e.dead);
        if(e){let dmg=safeDmg;if(e.shieldHp>0){const ab=Math.min(e.shieldHp,dmg);e.shieldHp-=ab;dmg-=ab;}if(el==='poison'&&tier>=2)e.poison=Math.min(e.poison+1,5);else if(el==='ice'&&tier>=2){e.iceEnd=Date.now()+3000;e.iceSlow=0.15;}e.hp-=dmg;
          if(e.hp<=0){e.dead=true;const h=room.players.get(ws);if(h&&!h.groggy){const sc=10+Math.floor(e.maxHp*0.1);const ed=room.players.size<=1?1:room.players.size*0.65;h.exp+=Math.floor(sc/2*(h.expMult||1)/ed);if(h.exp>=h.expNext){h.lv++;h.exp-=h.expNext;h.expNext=Math.floor(h.expNext*1.4);if(h.cls==='warrior'){h.maxHp+=10;h.hp=Math.min(h.hp+10,h.maxHp);h.armor=Math.min((h.armor||0.15)+0.02,0.9);h.regen=(h.regen||2.0)+0.002;if(!h.rangeMult)h.rangeMult=1;h.rangeMult*=1.02;if(ws.readyState===1)ws.send(JSON.stringify({t:'statSync',armor:h.armor,regen:h.regen}));}else if(h.cls==='gunner'){if(!h.dmgBonus)h.dmgBonus=1;h.dmgBonus*=1.06;}else if(h.cls==='mage'){if(!h.dmgBonus)h.dmgBonus=1;h.dmgBonus*=1.03;if(!h.cdMult)h.cdMult=1;h.cdMult*=0.98;}else if(h.cls==='assassin'){if(!h.spdMult)h.spdMult=1;h.spdMult*=1.01;if(!h.dmgBonus)h.dmgBonus=1;h.dmgBonus*=1.02;if(!h.cdMult)h.cdMult=1;h.cdMult*=0.99;h.critRate=(h.critRate||40)+3;if(h.critRate>100){const ov=h.critRate-100;h.dmgBonus*=(1+ov/100);h.critRate=100;}}if(!h.lvUpQueue)h.lvUpQueue=0;h.lvUpQueue++;if(h.lvUpQueue===1&&ws.readyState===1){h.lvUpQueue=0;ws.send(JSON.stringify({t:'lvUp'}));}}bcastAll(room,{t:'eDead',eid:e.id,x:e.x,y:e.y,sc});}}
        }
      }
    }
    else if(msg.t==='atk'){const room=rooms.get(ws.roomCode);if(!room)return;bcast(room,{t:'fx',x:msg.x,y:msg.y,ax:msg.ax,ay:msg.ay,w:msg.w,cnt:msg.cnt,range:msg.range},ws);}
    else if(msg.t==='explosion'){const room=rooms.get(ws.roomCode);if(!room)return;bcast(room,{t:'explosion',x:msg.x,y:msg.y,r:msg.r,dmg:msg.dmg,color:msg.color},ws);}
    else if(msg.t==='fireZone'){const room=rooms.get(ws.roomCode);if(!room)return;if(!room.fireZones)room.fireZones=[];room.fireZones.push({x:msg.x,y:msg.y,dmg:msg.dmg,life:2000});bcast(room,{t:'fireZone',x:msg.x,y:msg.y,dmg:msg.dmg},ws);}
    else if(msg.t==='playerDead'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.dead=true;p.hp=0;}
    else if(msg.t==='invincible'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;if(msg.start){p.invincible=true;p.invincibleEnd=Infinity;}else if(msg.duration)p.invincibleEnd=Date.now()+msg.duration;}
    else if(msg.t==='traitPicked'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;p.invincible=false;p.invincibleEnd=Date.now()+2000;}
    else if(msg.t==='lvUpReady'){const room=rooms.get(ws.roomCode);if(!room)return;const p=room.players.get(ws);if(!p)return;if(p.lvUpQueue>0){p.lvUpQueue--;if(ws.readyState===1)ws.send(JSON.stringify({t:'lvUp'}));}}
  });
  ws.on('close',()=>{const room=rooms.get(ws.roomCode);if(!room)return;room.players.delete(ws);if(room.players.size===0){clearInterval(room.tick);rooms.delete(ws.roomCode);}else bcastAll(room,{t:'playerLeft',id:ws.pid});});
});

// 서버 heartbeat: 30초마다 응답없는 연결 강제 종료
const heartbeatInterval=setInterval(()=>{
  wss.clients.forEach(ws=>{
    if(!ws.isAlive){
      // 응답 없으면 강제 종료 → onclose 이벤트 발생
      return ws.terminate();
    }
    ws.isAlive=false;
    try{ws.ping();}catch(e){}
  });
},30000);
wss.on('close',()=>clearInterval(heartbeatInterval));

server.listen(PORT,()=>console.log('Dark Survival Final → http://localhost:'+PORT));
