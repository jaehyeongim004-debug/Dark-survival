// dark-survival.js
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
  <div id="autoAimBtn"><span class="aaIcon">🎯</span><span class="aaLabel">AUTO</span></div>
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
      <div class="classCard" onclick="pickClass('warrior',this)"><div class="classIcon">⚔️</div><div class="classInfo"><div class="className">검사</div><div class="classDesc">강력한 근접 공격으로 적을 베어냅니다.<br>높은 체력과 넓은 광역 검격.</div><div class="classStat">HP: ●●●●○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●○○○</div></div></div>
      <div class="classCard" onclick="pickClass('gunner',this)"><div class="classIcon">🔫</div><div class="classInfo"><div class="className">저격수</div><div class="classDesc">강력한 저격으로 원거리 적을 제압합니다.<br>높은 데미지와 긴 사거리.</div><div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●●○ &nbsp; 속도: ●●●○○</div></div></div>
      <div class="classCard" onclick="pickClass('mage',this)"><div class="classIcon">✨</div><div class="classInfo"><div class="className">마법사</div><div class="classDesc">폭발하는 마법탄으로 광역 피해!<br>낮은 HP지만 강력한 범위 공격.</div><div class="classStat">HP: ●○○○○ &nbsp; 공격: ●●●●● &nbsp; 속도: ●●●○○</div></div></div>
      <div class="classCard" onclick="pickClass('assassin',this)"><div class="classIcon">🗡️</div><div class="classInfo"><div class="className">암살자</div><div class="classDesc">빠른 이동속도와 높은 치명타.<br>리스크와 리워드가 모두 높음.</div><div class="classStat">HP: ●●○○○ &nbsp; 공격: ●●●○○ &nbsp; 속도: ●●●●●</div></div></div>
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
    necromancer:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAALoklEQVR4nO2dXWgcxx3A/1fESRbyVahXYyT1MJYRwjglEqIyjjAYjAKxH9yWPPilbtM6H+CQxAp2I5ADFjhWqVxaAg12TKuHkofi1A9WadUUg1BcC8w5YBOEsEy52EKYQ6iy0MchuD44//Pc3OzezM7nSvMDIe1ob/Y/8/+c2V0JwOPxeDwej8fj8Xg8Hs9WIWFbAFOkGpqKop9ZWl7Y9POzaQcYReHV2IwG4fyAmhp3SCmyUFg/mUzWXrH1eQCAhcUnzs7zd2wL4LGLswbQvmdfmeevra/C2vqqLXGEoeWlx+MKzhqAxwzGDYDHE/Ac2fzvCjgOkbGbwkeALU6NjYu279lXnHlwn1kZszwAc2ld7Tbpay89Xax6Tmp7o/R16mq3leoAUm7RsevGqAHYGODa+uoV0eKRMpIryWStSpGqEmYkqrGWAljGoNJAlp4ucnm76b4A9I9dBCspQCcqFRXUt4oU4QpWi0DS6lV4gE7lq76O6rFHxdgWZdAgWbmufc++Yj7/pHRcrQg0pXgWYdGAljud3hE4XtbnTdQB1peBrMGLDNym8kWvL6J8Uxg9SbG344WqgN16+qsEwPPNkzDvt618kqBIQMqPN4VE5kE3zhWBODnz83O2RVEOj+JNYywFqB68S94PoF4eU8ZiJAKYVv7F7fVT+POvn670yF6Pt7+lp4tKl4h7O14s6k4FzqUAGUhF0W1RTML1fzL0HjhcnLz1hXJj0CKAKG8bHOSgHBBIBzBVy5IogbkagJXoRQAjJt1MsYb7SiKMpZtPRRBX9qRVEGRaEaUGgkAiUATNkB+A8bS3RhpZAp09i43L9+x2eMBEtDPBQDRUa4DvIJLiAWn8fOB5wAAAABJRU5ErkJggg=='
  };
  for(const[name,src]of Object.entries(data)){
    SPRITES[name]=new Image();
    SPRITES[name].src=src;
  }
})();
SPRITES['warrior'].src='/warrior-sprite.png';
SPRITES['mage'].src='/mage-sprite.png';
SPRITES['gunner'].src='/gunner-sprite.png';
SPRITES['assassin'].src='/assassin-sprite.png';

// ── 던전 타일 ────────────────────────────────────────────────
const DUNGEON_TILES=[];
(function(){
  const srcs=[
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVR4nGOUkVL4z4ADfPv2jYGBgYGBi4sLlxIGFgYGBgZ2dg68BrCwsGKV//PnNwMTXDHTl63fmL5sxWkVDsBEWAl+wAJjcP3j8SbHAIpdQLEBjEICYjijkS4uYOHh4cUp+e/fXwZWVjYau4BYhV8ZP0+Hsbn/82ZSzQWUR6OcjDLOaKRLIAIADn0d3mL45ZAAAAAASUVORK5CYII=',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/0lEQVR4nKWSwUoDMRCGvw27tsQtLR48SBFhH8fXEEoLfQFhMVWP3gRFvfgSvfgs7huIxVrnYt31lCXuJlXpDz/JTP6ZyUwSDQ+OKgIQEQC01iEJMUCn092YII4T7/l6/YmqxWo1F7WaB0sFoH6XbEZsN7pMj7dK0ER+elK4trm4y3w6bwvNYACTj1o+ACUiLBavNW3wZGp+VJxMTWbyUbFcvmEpIrA32K9cPj5cPetuWlk27aZepWkPlwA316YIrf3+AJfR4TBr/cTzs7G339nlfWuQ3lcQkRef/yN6fwLYrXrjeog+4X/gbcGiLL9Ikh1b/db63Rv8OUEIW7fwDdPPcsWwA+UZAAAAAElFTkSuQmCC',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABN0lEQVR4nKWSv0vDQBTHv0l7XkiRajmEahEhCBXqoEsHJ+fO+SP825wzOznUQQcLVkQHly6hoTV9tKRJnN7RS9MW8bu8H/e+H94dZ7WOz3JsEBEBAFzX3TSCKgBI6WwFVKui9Hy5TGDrYTsOyI4DXZ9QIDtOUOosbsASnlQJkn5CScg92XECfKO3EyA8qQBAtRVGz6O1wcplpc95+pp2ObdXh1RbAQCa103FvcVg3mNz3auvwQxAOAx1FK5Qi8Fcr85mjhpARIiiMeKnn+4qhGvW5HNixOl0AiKC1Tg4Mv6Be1W755xeZj7nhzcNvXb0ONZw67TlaUB2nmkzS3wJP7/IH7Thzbo1rlA0FLVqLqt3AnbJANgftm+evudmXSLjDYrKshRC7Blr0zAe1vL9uz8Btunfb/AL2iB4pI70PjEAAAAASUVORK5CYII=',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDklEQVR4nJVTO2tCMRT+Eu5VCT4v4vMigv+g/6Cbk0PB2R/h7+jcubNbQejg3qU4OwsiheDgI5Qao0O5IaaJ134QSM53Ht85h5C41T3DAyEEAIAx5nNBAADZbO5mgiAInbyUR1DtTPdTQfdTbykPaLoLMNisJ4PNeuLiSNzqnu0WHr+WWgmjVJjcW9QcJncpj78zcAXei9QWuJRagVk9AYnKNb3Gp5/rIQqluB3wniuOvAq4UgvzuBT1v7ev5jvI5wsAgAe+eradBcAZULXtpVLZreAefNQ7/hbSMGtUxIHsXkybXuO82h7bbXxGjXEYZgAAduCfBEmSK1adUlWRTtzz/kalTkgU+PDvIdq4AOOgW+AYQPcbAAAAAElFTkSuQmCC',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAElEQVR4nK2T0W6CMBSGP0DBMU1IBWqMF76eT+ST+E4iSproWNJ5ZDeTMbHRZfuTpjmnp+d8f5N6i/my4UvGGJIkuYbUdQ1AHMe45ANE0YgoGqH1DGNMG181GAzvrrYBQO2fNrV/2rgm7felm6ArrWcUxdaJfCtvMV82XdzutCAIALDWkqZZ7/L5/NEnABAR0jRDRBCRttFTFopii9azliAIAkTEbUEledNNWGsJw7BX6MrftfAbDcbjSS9ZVQeUmnK5CMPh99Sy3JFl+WMCpaZU1eEpgqctvHnHdXd/2ECpKcaYNq5376s4f1nf1v39EV0HVXX48TMBXpvJ6t8JPgGirVOmtxJ2jgAAAABJRU5ErkJggg=='
  ];
  srcs.forEach(src=>{const img=new Image();img.src=src;DUNGEON_TILES.push(img);});
})();

function getTileIdx(tx,ty){
  const h=((tx*73856093)^(ty*19349663))>>>0;
  const r=h%200;
  if(r<1)return 1;
  if(r<3)return 2;
  if(r<4)return 3;
  if(r<6)return 4;
  return 0;
}
canvas.width=W;canvas.height=H;
const WS_URL=(location.protocol==='https:'?'wss://':'ws://')+location.host;
let ws=null,myId=null,isHost=false,myClass=null;
let _wsHeartbeat=null;
function connect(cb){
  if(ws&&ws.readyState<2)ws.close();
  ws=new WebSocket(WS_URL);
  ws.onopen=()=>{
    if(_wsHeartbeat)clearInterval(_wsHeartbeat);
    _wsHeartbeat=setInterval(()=>{
      if(!ws||ws.readyState!==1)return;
      ws.send(JSON.stringify({t:'ping'}));
    },10000);
    cb();
  };
  ws.onmessage=e=>{try{handleMsg(JSON.parse(e.data));}catch(err){console.warn('[msg err]',err);}};
  ws.onerror=()=>showErr('서버 연결 실패');
  ws.onclose=(e)=>{
    if(_wsHeartbeat){clearInterval(_wsHeartbeat);_wsHeartbeat=null;}
    if(running||_loopRunning){
      running=false;
      showPop('⚠ 서버 연결이 끊겼습니다. 새로고침 해주세요.',8000);
      document.getElementById('errMsg').textContent='연결 끊김 ('+e.code+')';
    }
  };
}
let _lastMoveSend=0;
function send(o){
  if(!ws||ws.readyState!==1)return;
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
  gunner:{name:'저격수',icon:'🔫',color:'#ffee44',stats:{hp:80,maxHp:80,spd:3.0,dmgMult:1.3,cdMult:1,rangeMult:1.5,regen:0.5,multishot:0,magnetRange:1,armor:0,crit:false,critRate:0,expMult:1},weapon:{name:'저격총',type:'bullet',baseDmg:60,baseCd:1300,baseRange:500,color:'#ffee44',spd:20}},
  mage:{name:'마법사',icon:'✨',color:'#cc88ff',stats:{hp:65,maxHp:65,spd:3.0,dmgMult:1.2,cdMult:1,rangeMult:1.1,regen:0.7,multishot:0,magnetRange:1,armor:0,crit:false,critRate:0,expMult:1},weapon:{name:'마법',type:'magic',baseDmg:50,baseCd:850,baseRange:300,color:'#cc88ff',spd:6,explosionRadius:80}},
  assassin:{name:'암살자',icon:'🗡️',color:'#ff88aa',stats:{hp:85,maxHp:85,spd:4.2,dmgMult:1.05,cdMult:0.88,rangeMult:1,regen:0.2,multishot:0,magnetRange:1,armor:0,crit:true,critRate:40,expMult:1},weapon:{name:'단검',type:'dagger',baseDmg:28,baseCd:280,baseRange:90,color:'#ff88aa',spd:12}}
};
let myTraits=[],myStats=null,myWeapon=null,weaponUpgradeLevel=0,weaponElement=null;
const ELEMENT_COLORS={fire:'#ff4400',poison:'#44ff44',ice:'#44ddff'};
const ELEMENT_NAMES={fire:'🔥 화염',poison:'☠ 독',ice:'❄ 냉기'};

function pickClass(cls,el){myClass=cls;document.querySelectorAll('.classCard').forEach(e=>e.classList.remove('sel'));if(el)el.classList.add('sel');document.getElementById('classReady').style.display='block';const icons={warrior:'⚔',gunner:'🔫',mage:'✨',assassin:'🗡'};document.querySelector('#js2Wrap .js2Icon').textContent=icons[cls]||'⚔';}
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
  const result=[];let multishotUsed=false;let safetyBreak=0;
  while(result.length<3&&(pool.length>0||weaponTrait||(!multishotUsed&&multishotTrait))&&safetyBreak++<50){
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
let _traitSelectOpen=false;
let _traitAutoTimeout=null;

function showTraitSelect(){
  if(document.getElementById('goScreen').style.display==='flex')return;
  if(document.getElementById('stageClearScreen').style.display==='flex')return;
  if(_traitSelectOpen){localLvUpQueue++;return;}
  _openTraitSelect();
}

function _openTraitSelect(){
  _traitSelectOpen=true;
  running=false;invincible=true;invincibleEnd=Infinity;send({t:'invincible',start:true});
  projs=projs.filter(p=>!p.enemy);
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
  if(_traitAutoTimeout)clearTimeout(_traitAutoTimeout);
  _traitAutoTimeout=setTimeout(()=>{
    if(_traitSelectOpen&&document.getElementById('lvlUpScreen').style.display==='flex'){
      const firstCard=document.querySelector('.traitCard');
      if(firstCard)firstCard.click();
    }
  },30000);
}

function pickTrait(tr){
  if(!_traitSelectOpen)return;
  _traitSelectOpen=false;
  if(_traitAutoTimeout){clearTimeout(_traitAutoTimeout);_traitAutoTimeout=null;}
  document.getElementById('lvlUpScreen').style.display='none';
  myTraits.push(tr.id);applyTrait(tr.id,tr.value);updateTraitList();updateStatsPanel();
  send({t:'traitPicked',trait:tr.id,value:tr.value});
  invincibleEnd=performance.now()+2000;
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

let laserWarning=null,laserFire=null,slashWarn=null;
let running=false,stageTime=600,currentStage=1,midBossSpawned=false,finalBossSpawned=false,bossAlive=false;
let bossWarning=null;
let kills=0,score=0,camX=0,camY=0;
let myPlayer=null,allPlayers=[],enemies=[],bossData=null,turrets=[];
let projs=[],parts=[],orbs=[],remoteEffects=[],explosions=[],fireZones=[];
let pixelExplList=[];
let megaBlastState=null;
const midBossBGM=new Audio('/mid-boss-bgm.mp3');midBossBGM.loop=true;midBossBGM.volume=0.5;
function stopMidBossBGM(){midBossBGM.pause();midBossBGM.currentTime=0;}
const MB_IMG=new Image();MB_IMG.src='/boss-sprite.png';
const MB_CHARGE_IMG=new Image();MB_CHARGE_IMG.src='/boss-charge-sprite.png';
const NECRO_IMG=new Image();NECRO_IMG.src='/necromancer-sprite.png';
const MB_FW=200,MB_FH=200; // 프레임 크기: 이미지 실측 후 조정
let mbRow=0,mbFrame=0,mbFrameT=0,mbLocked=false,mbPrevT=0;
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
    bossAlive=true;
    showPop(msg.isFinal?'☠ 최종 보스 5초 후 등장!':'⚠ 중간 보스 5초 후 등장!',5500);
    let cd=4;
    if(window._bossWarningIv)clearInterval(window._bossWarningIv);
    window._bossWarningIv=setInterval(()=>{
      if(cd>0){showPop(cd+'....',1100);cd--;}
      else{clearInterval(window._bossWarningIv);window._bossWarningIv=null;}
    },1000);
  }
  else if(msg.t==='midBoss'){midBossSpawned=true;bossAlive=true;bossWarning=null;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='⚠ 중간 보스 ⚠';showPop('⚠ 중간 보스 등장!',3000);midBossBGM.currentTime=0;midBossBGM.play().catch(()=>{});}
  else if(msg.t==='midBossDead'){
    bossAlive=false;document.getElementById('bossBar').style.display='none';showPop('중간 보스 처치!',3000);megaBlastState=null;stopMidBossBGM();
    myStats.multishot+=1;updateTraitList();updateStatsPanel();showPop('🔱 다중사격 획득!',2000);
    if(weaponUpgradeLevel<3){
      invincible=true;invincibleEnd=Infinity;
      send({t:'invincible',start:true});
      setTimeout(()=>{
        if(_traitSelectOpen){localLvUpQueue++;return;}
        _traitSelectOpen=true;
        running=false;
        projs=projs.filter(p=>!p.enemy);
        const wt={id:'weapon',icon:'🌟',name:'무기 강화',desc:'무기 성능 향상'};
        const cards=document.getElementById('traitCards');cards.innerHTML='';
        const div=document.createElement('div');div.className='traitCard';
        let desc=weaponUpgradeLevel===0?'무기 능력치 강화':weaponUpgradeLevel===1?'속성 부여 (화염/독/냉기)':'속성 2배 강화 + 이펙트';
        div.innerHTML='<div class="traitIcon">'+wt.icon+'</div><div class="traitName">'+wt.name+'</div><div class="traitDesc">'+desc+'</div>';
        div.onclick=()=>{
          _traitSelectOpen=false;
          if(_traitAutoTimeout){clearTimeout(_traitAutoTimeout);_traitAutoTimeout=null;}
          document.getElementById('lvlUpScreen').style.display='none';
          applyTrait(wt.id,wt.value);
          myTraits.push(wt.id);updateTraitList();updateStatsPanel();
          send({t:'traitPicked',trait:wt.id,value:wt.value});
          invincibleEnd=performance.now()+2000;
          running=true;
          send({t:'lvUpReady'});
        };
        cards.appendChild(div);
        document.getElementById('lvlUpTitle').textContent='보스 보상!';
        document.getElementById('lvlUpSub').textContent='무기가 강화됩니다';
        document.getElementById('lvlUpScreen').style.display='flex';
        if(_traitAutoTimeout)clearTimeout(_traitAutoTimeout);
        _traitAutoTimeout=setTimeout(()=>{
          if(_traitSelectOpen){const fc=document.querySelector('.traitCard');if(fc)fc.click();}
        },30000);
      },1000);
    }
  }
  else if(msg.t==='finalBoss'){finalBossSpawned=true;bossAlive=true;bossWarning=null;document.getElementById('bossBar').style.display='block';document.getElementById('bossLbl').textContent='☠ 최종 보스 ☠';showPop('☠ 최종 보스 등장!',3000);stopMidBossBGM();}
  else if(msg.t==='finalBossDead'){bossAlive=false;document.getElementById('bossBar').style.display='none';showPop('최종 보스 처치!',3000);myStats.multishot+=1;updateTraitList();updateStatsPanel();showPop('🔱 다중사격 획득!',2000);}
  else if(msg.t==='phase2'){showPop('PHASE 2!',1500);}
  else if(msg.t==='bossHp'){if(bossData)bossData.hp=msg.hp;}
  else if(msg.t==='pat'){doBossPat(msg);}
  else if(msg.t==='eDead'){kills++;score+=msg.sc||10;if(msg.sc>0)addKf('+'+(msg.sc||10));}
  else if(msg.t==='playerLeft'){showPop('플레이어 퇴장',1200);}
  else if(msg.t==='stageClear'){showStageClear(msg.stage,msg.next);}
  else if(msg.t==='stageStart'){nextStage(msg.stage);}
  else if(msg.t==='over'){_loopRunning=false;stopMidBossBGM();endGame(msg.win);}
  else if(msg.t==='statSync'){if(myStats){if(msg.armor!==undefined)myStats.armor=msg.armor;if(msg.regen!==undefined)myStats.regen=msg.regen;updateStatsPanel();}}
  else if(msg.t==='revived'){showPop('💚 부활했습니다!',2000);if(myPlayer){myPlayer.groggy=false;myPlayer.dead=false;}}
  else if(msg.t==='groggyDead'){if(myPlayer&&myPlayer.groggy){running=false;_loopRunning=false;endGame(false);}}
  else if(msg.t==='enemyBuff'){showPop(msg.msg,3000);}
  else if(msg.t==='fx'){remoteEffects.push(msg);}
  else if(msg.t==='explosion'){explosions.push({x:msg.x,y:msg.y,r:msg.r,dmg:msg.dmg,life:300,maxLife:300,color:msg.color||'#cc88ff'});}
  else if(msg.t==='fireZone'){fireZones.push({x:msg.x,y:msg.y,dmg:msg.dmg,life:2000,maxLife:2000});}
  else if(msg.t==='turrets'){turrets=msg.turrets||[];}
  else if(msg.t==='turretHp'){const t=turrets.find(tt=>tt.id===msg.id);if(t)t.hp=msg.hp;}
  else if(msg.t==='weaponUpgrade'){showPop(msg.msg,3000);}
else if(msg.t==='megaBlastWarn'){megaBlastState={phase:'warn',safeZones:msg.safeZones||[],startTime:performance.now(),bx:msg.bx,by:msg.by};showPop('💥 대폭발! 초록 안전지대로!',5000);}
else if(msg.t==='megaBlast'){megaBlastState={phase:'blast',startTime:performance.now()};spawnPixelExplosion(msg.bx,msg.by,'mega');showPop('💥 대폭발!!!',800);}
else if(msg.t==='megaBlastEnd'){megaBlastState=null;}
}
function showClassScreen(){document.getElementById('lobbyScreen').style.display='none';document.getElementById('classScreen').style.display='flex';}
function hideClassScreen(){document.getElementById('classScreen').style.display='none';}

function initGameState(){
  if(!myClass)myClass='warrior';
  const cls=CLASSES[myClass];
  myStats={...cls.stats};
  myStats._lastDmgBonus=1;myStats._lastCdMult=1;
  myWeapon={...cls.weapon};myTraits=[];weaponUpgradeLevel=0;weaponElement=null;
  running=true;stageTime=600;currentStage=1;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;
  kills=0;score=0;projs=[];parts=[];orbs=[];remoteEffects=[];explosions=[];fireZones=[];turrets=[];pixelExplList=[];megaBlastState=null;
  myPlayer={x:0,y:0,hp:myStats.hp,maxHp:myStats.maxHp,lv:1,exp:0,expNext:50,dead:false};
  invincible=false;invincibleEnd=0;localLvUpQueue=0;bossWarning=null;
  _traitSelectOpen=false;if(_traitAutoTimeout){clearTimeout(_traitAutoTimeout);_traitAutoTimeout=null;}
  showGameUI();
  document.getElementById('classTag').innerHTML='<span>'+cls.icon+' '+cls.name+'</span>';
  document.getElementById('bossBar').style.display='none';
  G.style.background=STAGE_BG[0];
  updateTraitList();updateStatsPanel();updateElementDisplay();
  lastTime=performance.now();_loopRunning=true;requestAnimationFrame(loop);
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
    if(msg.teleport){
      myPlayer.x=me.x;myPlayer.y=me.y;
      camX=me.x;camY=me.y;
    }
    myPlayer.hp=me.hp;myPlayer.maxHp=me.maxHp;myPlayer.lv=me.lv;myPlayer.dead=me.dead;myPlayer.exp=me.exp;myPlayer.expNext=me.expNext;
    if(myStats){
      myStats.maxHp=me.maxHp;
      if(me.armor!==undefined&&!isNaN(me.armor))myStats.armor=me.armor;
      if(me.regen!==undefined&&!isNaN(me.regen))myStats.regen=me.regen;
      if(me.dmgBonus!==undefined&&!isNaN(me.dmgBonus)&&me.dmgBonus>0){
        const prev=myStats._lastDmgBonus||1;
        if(me.dmgBonus!==prev&&!isNaN(prev)&&prev>0){
          const ratio=me.dmgBonus/prev;
          if(!isNaN(ratio)&&isFinite(ratio))myStats.dmgMult*=ratio;
          myStats._lastDmgBonus=me.dmgBonus;
        }
      }
      if(me.cdMult!==undefined&&!isNaN(me.cdMult)&&me.cdMult>0){
        const prev=myStats._lastCdMult||1;
        if(me.cdMult!==prev&&!isNaN(prev)&&prev>0){
          const ratio=me.cdMult/prev;
          if(!isNaN(ratio)&&isFinite(ratio))myStats.cdMult*=ratio;
          myStats._lastCdMult=me.cdMult;
        }
      }
      if(me.critRate!==undefined&&!isNaN(me.critRate)&&me.critRate>myStats.critRate){myStats.critRate=me.critRate;if(myStats.critRate>0)myStats.crit=true;}
      if(isNaN(myStats.dmgMult)||!isFinite(myStats.dmgMult))myStats.dmgMult=1;
      if(isNaN(myStats.cdMult)||!isFinite(myStats.cdMult))myStats.cdMult=1;
      updateStatsPanel();
    }
    if(me.dead&&running&&!me.groggy){running=false;endGame(false);}
    const wasGroggy=myPlayer.groggy;
    if(me.groggy&&!wasGroggy){showPop('💀 그로기! 동료가 부활시켜 줄 수 있어요!',3000);}
    if(wasGroggy&&!me.groggy&&!me.dead){running=true;}
    myPlayer.groggy=me.groggy||false;
    myPlayer.groggyTimer=me.groggyTimer||0;
  }
  }catch(err){console.error('[applyState err]',err);}
}

let _stageClearIv=null;
function showStageClear(stage,next){running=false;if(_stageClearIv){clearInterval(_stageClearIv);_stageClearIv=null;}const el=document.getElementById('stageClearScreen');document.getElementById('stageClearTitle').textContent='STAGE '+stage+' CLEAR!';document.getElementById('stageClearSub').textContent=next<=3?'다음: '+STAGE_NAMES[next-1]:'모든 스테이지 클리어!';el.style.display='flex';let t=5;document.getElementById('stageClearTimer').textContent=t;_stageClearIv=setInterval(()=>{t--;document.getElementById('stageClearTimer').textContent=t;if(t<=0){clearInterval(_stageClearIv);_stageClearIv=null;el.style.display='none';}},1000);}
function nextStage(stage){currentStage=stage;stageTime=600;midBossSpawned=false;finalBossSpawned=false;bossAlive=false;bossData=null;enemies=[];projs=[];parts=[];orbs=[];explosions=[];fireZones=[];turrets=[];pixelExplList=[];megaBlastState=null;invincible=false;invincibleEnd=0;document.getElementById('bossBar').style.display='none';G.style.background=STAGE_BG[Math.min(stage-1,2)];running=true;showPop('STAGE '+stage+' START!',2500);}

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
    if(w.type==='bullet'){
      const projR=10+weaponUpgradeLevel;
      projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(ang)*(w.spd||7),vy:Math.sin(ang)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:projR,enemy:false,element:weaponElement,pierce:true});
      for(let i=1;i<w.count;i++){
        setTimeout(()=>{
          if(!myPlayer||!running)return;
          projs.push({x:myPlayer.x,y:myPlayer.y,vx:Math.cos(ang)*(w.spd||7),vy:Math.sin(ang)*(w.spd||7),dmg:w.dmg,range:w.range,traveled:0,gone:false,color:w.color,r:projR,enemy:false,element:weaponElement,pierce:true});
        },i*150);
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

// 레이저 경고 시작 (보스 위치 저장, 서버에서 frozen 플래그 함께 옴)
function startLaserWarning(bx,by){
  laserWarning={bx,by,startTime:performance.now(),duration:2000};
  showPop('⚠ 레이저 경보! 비켜!',1800);
}
function fireLaser(bx,by){
  laserWarning=null;
  laserFire={bx,by,startTime:performance.now(),duration:600};
}

function drawLasers(){
  const t=performance.now();
  const LASER_LEN=4000;
  const dirs8=[0,Math.PI/4,Math.PI/2,Math.PI*3/4,Math.PI,Math.PI*5/4,Math.PI*3/2,Math.PI*7/4];

  if(laserWarning){
    const elapsed=t-laserWarning.startTime;
    if(elapsed>laserWarning.duration){laserWarning=null;}
    else{
      const prog=elapsed/laserWarning.duration; // 0→1
      const pulse=Math.sin(t*0.015)*0.3+0.7;
      ctx.save();
      // 8방향 path 하나로 합쳐서 stroke 1회 → 렉 감소
      ctx.beginPath();
      for(const a of dirs8){
        ctx.moveTo(laserWarning.bx,laserWarning.by);
        ctx.lineTo(laserWarning.bx+Math.cos(a)*LASER_LEN,laserWarning.by+Math.sin(a)*LASER_LEN);
      }
      // 경고 색: 시간 지날수록 점점 밝아짐
      const r=Math.floor(200+55*prog),alpha=0.35+prog*0.5;
      ctx.strokeStyle='rgba('+r+',60,0,'+alpha+')';
      ctx.lineWidth=5+pulse*3;
      ctx.stroke();
      // 중심 펄스
      ctx.globalAlpha=pulse*0.5;
      ctx.fillStyle='#ff4400';
      ctx.beginPath();
      ctx.arc(laserWarning.bx,laserWarning.by,18+pulse*6,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha=1;
      // 카운트다운 표시
      const remain=Math.ceil((laserWarning.duration-elapsed)/1000);
      ctx.fillStyle='#ffcc00';
      ctx.font='bold 18px monospace';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(remain>0?remain+'':'!!',laserWarning.bx,laserWarning.by-30);
      ctx.restore();
    }
  }
  if(laserFire){
    const elapsed=t-laserFire.startTime;
    if(elapsed>laserFire.duration){laserFire=null;}
    else{
      const fade=1-elapsed/laserFire.duration;
      ctx.save();
      // 두께감 있는 레이저: 굵은→얇은 2번만 stroke
      ctx.beginPath();
      for(const a of dirs8){
        ctx.moveTo(laserFire.bx,laserFire.by);
        ctx.lineTo(laserFire.bx+Math.cos(a)*LASER_LEN,laserFire.by+Math.sin(a)*LASER_LEN);
      }
      ctx.strokeStyle='rgba(255,100,0,'+(fade*0.5)+')';
      ctx.lineWidth=36*fade;
      ctx.stroke();
      ctx.strokeStyle='rgba(255,240,180,'+fade+')';
      ctx.lineWidth=5*fade;
      ctx.stroke();
      ctx.restore();
    }
  }
}
function drawSlashWarn(){
  if(!slashWarn)return;
  const elapsed=performance.now()-slashWarn.startTime;
  if(elapsed>500){slashWarn=null;return;}
  const prog=elapsed/500,fade=1-prog,pulse=Math.sin(performance.now()*0.03)*0.3+0.7;
  const SLASH_LEN=260,HALF=Math.PI/9;
  ctx.save();
  // 콘 채우기
  ctx.globalAlpha=(0.25+prog*0.2)*fade;
  ctx.fillStyle='#ffcc44';
  ctx.beginPath();
  ctx.moveTo(slashWarn.bx,slashWarn.by);
  ctx.arc(slashWarn.bx,slashWarn.by,SLASH_LEN,slashWarn.ang-HALF,slashWarn.ang+HALF);
  ctx.closePath();
  ctx.fill();
  // 중심선
  ctx.globalAlpha=(0.9+pulse*0.1)*fade;
  ctx.strokeStyle='rgba(255,220,80,'+fade+')';
  ctx.lineWidth=3+pulse*2;
  ctx.shadowColor='#ffcc00';ctx.shadowBlur=10;
  ctx.beginPath();
  ctx.moveTo(slashWarn.bx,slashWarn.by);
  ctx.lineTo(slashWarn.bx+Math.cos(slashWarn.ang)*SLASH_LEN,slashWarn.by+Math.sin(slashWarn.ang)*SLASH_LEN);
  ctx.stroke();
  ctx.restore();
}


function drawMegaBlast(){
  if(!megaBlastState)return;
  const now=performance.now();
  if(megaBlastState.phase==='warn'){
    const elapsed=now-megaBlastState.startTime,total=5000;
    if(elapsed>total)return;
    const remaining=Math.max(0,total-elapsed),pulse=Math.sin(now*0.01)*0.3+0.7,countdown=Math.ceil(remaining/1000);
    const ox=W/2-camX,oy=H/2-camY;
    ctx.save();ctx.translate(-ox,-oy);
    ctx.globalAlpha=0.35+pulse*0.2;
    const vGrad=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.8);
    vGrad.addColorStop(0,'rgba(0,0,0,0)');vGrad.addColorStop(1,'rgba(200,0,0,0.7)');
    ctx.fillStyle=vGrad;ctx.fillRect(0,0,W,H);
    ctx.translate(ox,oy);
    const sz=megaBlastState.safeZones||[];
    for(const z of sz){
      ctx.globalAlpha=0.25+pulse*0.15;ctx.fillStyle='#00ff44';ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=0.9;ctx.strokeStyle='#44ff88';ctx.lineWidth=3+pulse*2;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.stroke();
      ctx.globalAlpha=0.9;ctx.fillStyle='#ccffcc';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SAFE',z.x,z.y);
    }
    ctx.translate(-ox,-oy);ctx.globalAlpha=1;
    ctx.fillStyle='#ff4444';ctx.font='bold 36px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('💥 대폭발 '+countdown+'초!',W/2,H/2-80);
    ctx.restore();
  }
  if(megaBlastState.phase==='blast'){
    const elapsed=now-megaBlastState.startTime,total=800;
    if(elapsed>total){megaBlastState=null;return;}
    const fade=1-elapsed/total,ox=W/2-camX,oy=H/2-camY;
    ctx.save();ctx.translate(-ox,-oy);ctx.globalAlpha=fade*0.85;ctx.fillStyle='rgba(255,140,0,'+fade+')';ctx.fillRect(0,0,W,H);ctx.restore();
  }
}

// ── [BUG FIX] doBossPat: 중첩 함수 선언 제거, 블록 구조 정상화 ──
function doBossPat(msg){
  const{i,bx,by,ang,phase,etype,isFinal}=msg;
  const bRange=isFinal?600:1200;
  if(i===-3){startLaserWarning(bx,by);return;}
  if(i===-4){fireLaser(bx,by);return;}
  if(i===-2){mkBB(bx,by,Math.cos(ang)*2.8,Math.sin(ang)*2.8,35,'#ff2200',18,bRange);return;}
  // i=7: 근접 칼 공격 예고 (0.5초 레이저 방향 표시)
  if(i===7&&!isFinal){slashWarn={bx,by,ang,startTime:performance.now()};showPop('⚠ 근접 참격!',400);return;}
  // i=5: 근접 칼 공격 (중간보스)
  if(i===5&&!isFinal){
    slashWarn=null;
    mbRow=1;mbFrame=0;mbFrameT=0;mbLocked=true;
    const HALF=Math.PI/9;
    for(let k=0;k<18;k++){const a=ang-HALF+(k/17)*HALF*2;parts.push({x:bx+Math.cos(a)*80,y:by+Math.sin(a)*80,vx:Math.cos(a)*6,vy:Math.sin(a)*6,life:400,maxLife:400,r:7,color:'#ffaa44'});}
    return;
  }
  // i=6: 강력한 화염구 발사 (중간보스)
  if(i===6&&!isFinal){
    mbRow=4;mbFrame=0;mbFrameT=0;mbLocked=true;
    projs.push({x:bx,y:by,vx:Math.cos(ang)*5.5,vy:Math.sin(ang)*5.5,dmg:40,range:2500,traveled:0,gone:false,color:'#ff4400',r:22,enemy:true,isBigFireball:true});
    return;
  }
  // [BUG FIX] i===-1 : 잡몹 탄환 처리
  if(i===-1){
    if(etype==='ranged'){
      mkBB(bx,by,Math.cos(ang)*5.5,Math.sin(ang)*5.5,12,'#ff8822',7,400);
    }else if(etype==='mage'){
      for(let k=-1;k<=1;k++){
        const a=ang+k*0.3;
        mkBB(bx,by,Math.cos(a)*4.0,Math.sin(a)*4.0,18,'#cc44ff',9,500);
      }
    }
    return;
  }
  [bossSpiral,bossBlast,bossCross,bossRapid,bossRing][Math.min(i,4)](bx,by,ang,phase,bRange);
}

function mkBB(bx,by,vx,vy,dmg,col,r,range=600){projs.push({x:bx,y:by,vx,vy,dmg,range,traveled:0,gone:false,color:col,r,enemy:true});}
function bossSpiral(bx,by,ang,phase,range=600){const cnt=phase===2?14:10;for(let i=0;i<cnt;i++){const a=(i/cnt)*Math.PI*2+ang;mkBB(bx,by,Math.cos(a)*4.2,Math.sin(a)*4.2,18,'#ff6600',8,range);}}
function bossBlast(bx,by,ang,phase,range=600){for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2;mkBB(bx,by,Math.cos(a)*2.6,Math.sin(a)*2.6,22,'#ff2200',10,range);}spawnParts(bx,by,'#ff6600',16);}
function bossCross(bx,by,ang,phase,range=600){const dirs=[[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]];const cnt=phase===2?4:3;dirs.forEach(([dx,dy])=>{for(let n=0;n<cnt;n++)setTimeout(()=>mkBB(bx,by,dx*5.5,dy*5.5,20,'#cc44ff',7,range),n*150);});}
function bossRapid(bx,by,ang,phase,range=600){
  if(!myPlayer)return;
  const cnt=8;
  for(let n=0;n<cnt;n++)setTimeout(()=>{
    if(!bossData||!running)return;
    let target=myPlayer,minD=Infinity;
    for(const p of allPlayers){
      if(p.dead||p.groggy)continue;
      const d=(p.x-bx)*(p.x-bx)+(p.y-by)*(p.y-by);
      if(d<minD){minD=d;target=p;}
    }
    if(!target)return;
    const dx=target.x-bx,dy=target.y-by,d=Math.sqrt(dx*dx+dy*dy)||1;
    const a=Math.atan2(dy,dx)+(Math.random()-.5)*.6;
    mkBB(bx,by,Math.cos(a)*6.5,Math.sin(a)*6.5,16,'#ff4444',6,range);
  },n*90);
}
function bossRing(bx,by,ang,phase,range=600){const cnt=phase===2?20:16;for(let i=0;i<cnt;i++){const a=(i/cnt)*Math.PI*2+ang*2,s=2.2+Math.random()*2.2;mkBB(bx,by,Math.cos(a)*s,Math.sin(a)*s,24,'#ffaa00',9,range);}}

function spawnRemoteFx(fx){const cls=CLASSES[fx.w]||CLASSES.warrior,wc=cls.weapon;if(wc.type==='sword'||wc.type==='dagger'){const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x),range=fx.range||wc.baseRange||80,spread=wc.type==='dagger'?0.5:0.9,step=wc.type==='dagger'?0.18:0.25,ps=wc.type==='dagger'?12:16;for(let a=ang-spread;a<=ang+spread;a+=step)for(let r=18;r<range;r+=ps)parts.push({x:fx.x+Math.cos(a)*r,y:fx.y+Math.sin(a)*r,vx:0,vy:0,life:140,maxLife:140,r:4,color:wc.color+'88'});}else if(wc.type==='magic'){const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x);projs.push({x:fx.x,y:fx.y,vx:Math.cos(ang)*(wc.spd||6),vy:Math.sin(ang)*(wc.spd||6),dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:8,enemy:false,visual:true,isMagic:true});}else{const ang=Math.atan2(fx.ay-fx.y,fx.ax-fx.x),cnt=fx.cnt||1;for(let i=0;i<cnt;i++){const a=ang+(i-(cnt-1)/2)*0.28;projs.push({x:fx.x,y:fx.y,vx:Math.cos(a)*(wc.spd||7),vy:Math.sin(a)*(wc.spd||7),dmg:0,range:wc.baseRange||300,traveled:0,gone:false,color:wc.color+'aa',r:3,enemy:false,visual:true});}}}

function update(dt){
  if(!running||!myPlayer||myPlayer.dead||!myStats)return;
  const now=performance.now();if(invincible&&invincibleEnd!==Infinity&&now>=invincibleEnd){invincible=false;invincibleEnd=0;}
  const activeMapSize=bossAlive?800:MAP_SIZE;
  if(myPlayer.groggy){
    camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;
    for(const e of enemies){if(e.targetX===undefined){e.targetX=e.x;e.targetY=e.y;e.vx=0;e.vy=0;}e.x+=e.vx*(dt/16);e.y+=e.vy*(dt/16);const errX=e.targetX-e.x,errY=e.targetY-e.y,correction=Math.min(1,dt/60*12);e.x+=errX*correction;e.y+=errY*correction;}
    const spF=dt/16;
    for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}
    parts=parts.filter(p=>p.life>0);
    for(const ex of explosions)ex.life-=dt;explosions=explosions.filter(ex=>ex.life>0);
  for(const fz of fireZones)fz.life-=dt;fireZones=fireZones.filter(fz=>fz.life>0);
  for(const px of pixelExplList){px.x+=px.vx*spF;px.y+=px.vy*spF;px.vy+=0.1*spF;px.rot+=px.rotV;px.life-=dt;}pixelExplList=pixelExplList.filter(px=>px.life>0);
    projs=projs.filter(p=>!p.gone&&!p.enemy);
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
  if(mx||my){myPlayer.x+=mx/ml*myStats.spd*(dt/16);myPlayer.y+=my/ml*myStats.spd*(dt/16);}
  const prevX=myPlayer.x,prevY=myPlayer.y;
  myPlayer.x=Math.max(-activeMapSize,Math.min(activeMapSize,myPlayer.x));
  myPlayer.y=Math.max(-activeMapSize,Math.min(activeMapSize,myPlayer.y));
  if(myPlayer.x!==prevX||myPlayer.y!==prevY){camX=myPlayer.x;camY=myPlayer.y;}
  send({t:'move',x:Math.round(myPlayer.x),y:Math.round(myPlayer.y)});
  tryShoot();
  camX+=(myPlayer.x-camX)*0.1;camY+=(myPlayer.y-camY)*0.1;
  for(const e of enemies){if(e.targetX===undefined){e.targetX=e.x;e.targetY=e.y;e.vx=0;e.vy=0;}e.x+=e.vx*(dt/16);e.y+=e.vy*(dt/16);const errX=e.targetX-e.x,errY=e.targetY-e.y,correction=Math.min(1,dt/60*12);e.x+=errX*correction;e.y+=errY*correction;}
  for(const fx of remoteEffects)spawnRemoteFx(fx);remoteEffects=[];
  const spF=dt/16;
  for(const p of projs){
    if(p.gone)continue;p.x+=p.vx*spF;p.y+=p.vy*spF;p.traveled+=Math.sqrt(p.vx*p.vx+p.vy*p.vy)*spF;
    if(p.isBigFireball&&Math.sqrt(p.x*p.x+p.y*p.y)>=800){for(let fi=0;fi<10;fi++){const a=(fi/10)*Math.PI*2;mkBB(p.x,p.y,Math.cos(a)*3.5,Math.sin(a)*3.5,10,'#ff6600',8,280);}spawnParts(p.x,p.y,'#ff4400',24);p.gone=true;continue;}
    if(p.traveled>p.range){if(p.isMagic&&!p.visual&&!p.enemy){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}p.gone=true;continue;}
    if(p.visual)continue;
    if(!p.enemy){
      for(const e of enemies){const dx=p.x-e.x,dy=p.y-e.y;if(Math.sqrt(dx*dx+dy*dy)<(e.r||10)+p.r){if(p.isMagic){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);p.gone=true;break;}else{if(p.pierce){if(!p._hit)p._hit=new Set();if(p._hit.has(e.id))continue;p._hit.add(e.id);}reportHit(e.id,p.dmg,p.element);if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});spawnParts(p.x,p.y,p.color,4);if(!p.pierce)p.gone=true;}if(!p.pierce)break;}}
      if(!p.gone&&bossData){const dx=p.x-bossData.x,dy=p.y-bossData.y;if(Math.sqrt(dx*dx+dy*dy)<38+p.r){if(p.isMagic){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}else{reportHit('boss',p.dmg,p.element);if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});spawnParts(p.x,p.y,p.color,5);}if(!p.pierce)p.gone=true;}}
      if(!p.gone){for(const t of turrets){const dx=p.x-t.x,dy=p.y-t.y;if(Math.sqrt(dx*dx+dy*dy)<t.r+p.r){if(p.isMagic){createExplosion(p.x,p.y,p.explosionRadius||80,p.dmg*0.6,p.color,p.element);spawnParts(p.x,p.y,p.color,12);}else{reportHit('turret',p.dmg,p.element,t.id);if(p.element==='fire')send({t:'fireZone',x:p.x,y:p.y,dmg:p.dmg*0.5});spawnParts(p.x,p.y,p.color,5);}if(!p.pierce){p.gone=true;break;}}}}
    }else{if(myPlayer&&!myPlayer.dead&&!invincible){const dx=p.x-myPlayer.x,dy=p.y-myPlayer.y;if(Math.sqrt(dx*dx+dy*dy)<14+p.r){send({t:'enemyHit',dmg:p.dmg});spawnParts(p.x,p.y,p.color,4);p.gone=true;}}}
  }
  projs=projs.filter(p=>!p.gone);
  for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}parts=parts.filter(p=>p.life>0);if(parts.length>600)parts=parts.slice(-600);
  for(const ex of explosions)ex.life-=dt;explosions=explosions.filter(ex=>ex.life>0);
  for(const fz of fireZones)fz.life-=dt;fireZones=fireZones.filter(fz=>fz.life>0);
  const magnetR=28*myStats.magnetRange,pullR=100*myStats.magnetRange;
  for(const o of orbs){if(o.col)continue;const dx=o.x-myPlayer.x,dy=o.y-myPlayer.y,d=Math.sqrt(dx*dx+dy*dy);if(d<magnetR){o.col=true;score+=5;}else if(d<pullR){o.x-=dx/d*3;o.y-=dy/d*3;}}orbs=orbs.filter(o=>!o.col);
  const hpPct=Math.max(0,(myPlayer.hp/myPlayer.maxHp)*100);
  document.getElementById('hpFill').style.width=hpPct+'%';document.getElementById('hpTxt').textContent=Math.max(0,Math.floor(myPlayer.hp))+'/'+Math.floor(myPlayer.maxHp);
  document.getElementById('expFill').style.width=((myPlayer.exp||0)/(myPlayer.expNext||50)*100)+'%';document.getElementById('lvTxt').textContent=myPlayer.lv||1;document.getElementById('killTxt').textContent=kills;document.getElementById('scoreTxt').textContent=score;
  document.getElementById('waveTxt').textContent=Math.max(1,Math.floor((600-stageTime)/60)+1);
  const mins=Math.floor(stageTime/60),secs=Math.floor(stageTime%60);document.getElementById('timerVal').textContent=mins+':'+(secs<10?'0':'')+secs;document.getElementById('timerVal').style.color=stageTime<60?'#ff4444':stageTime<120?'#ff8844':'#ffcc00';document.getElementById('stageVal').textContent=currentStage;
  if(bossData)document.getElementById('bossFill').style.width=(bossData.hp/bossData.maxHp*100)+'%';
}

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.setLineDash([]);
  ctx.lineDashOffset=0;
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';
  const ox=W/2-camX,oy=H/2-camY;
  ctx.save();ctx.translate(ox,oy);
  drawGrid();drawFireZones();drawOrbs();drawParts();drawPixelExplosions();drawExplosions();
  if(bossWarning) drawBossSpawnMarker();
  drawLasers();drawSlashWarn();
  drawEnemies();
  ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);
  if(bossData)drawBoss();
  ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);
  drawTurrets();drawOthers();
  if(myPlayer&&!myPlayer.dead)drawMe();
  drawProjs();drawMegaBlast();
  ctx.restore();
  if(bossAlive||bossWarning) drawArenaBorder(ox,oy);
  ctx.setLineDash([]);
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  drawMinimap();
}

function drawArenaBorder(ox,oy){
  const ARENA=800;
  const t=performance.now();
  const pulse=Math.sin(t*0.004)*0.3+0.7;
  const isFinalBoss=(bossData&&bossData.isFinal)||(bossWarning&&bossWarning.isFinal);
  const scx=ox,scy=oy;
  const lineColor=isFinalBoss?'rgba(220,30,30,'+(pulse*0.9)+')':'rgba(255,180,0,'+(pulse*0.85)+')';
  const darkColor=isFinalBoss?'rgba(60,0,0,0.35)':'rgba(40,20,0,0.3)';
  ctx.save();
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='source-over';
  ctx.shadowBlur=0;
  ctx.setLineDash([]);
  const px=scx,py=scy;
  ctx.fillStyle=darkColor;
  if(py-ARENA>0)ctx.fillRect(0,0,W,py-ARENA);
  if(py+ARENA<H)ctx.fillRect(0,py+ARENA,W,H-(py+ARENA));
  if(px-ARENA>0)ctx.fillRect(0,Math.max(0,py-ARENA),px-ARENA,Math.min(H,py+ARENA)-Math.max(0,py-ARENA));
  if(px+ARENA<W)ctx.fillRect(px+ARENA,Math.max(0,py-ARENA),W-(px+ARENA),Math.min(H,py+ARENA)-Math.max(0,py-ARENA));
  ctx.beginPath();
  ctx.strokeStyle=lineColor;
  ctx.lineWidth=3+pulse*2;
  ctx.shadowColor=lineColor;
  ctx.shadowBlur=16;
  ctx.setLineDash([20,8]);
  ctx.lineDashOffset=-(t*0.05)%28;
  ctx.arc(px,py,ARENA,0,Math.PI*2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineDashOffset=0;
  ctx.shadowBlur=0;
  ctx.strokeStyle=isFinalBoss?'rgba(220,30,30,0.3)':'rgba(255,180,0,0.3)';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.arc(px,py,ARENA-8,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
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
  const warningPulse=Math.sin(t*0.008)*0.4+0.6;
  const warnR=60+Math.sin(t*0.005)*10;
  ctx.globalAlpha=warningPulse*0.5;
  ctx.fillStyle=isFinal?'#aa0000':'#cc6600';
  ctx.beginPath();ctx.arc(x,y,warnR,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  ctx.strokeStyle=isFinal?'#ff2200':'#ffaa00';
  ctx.lineWidth=2+warningPulse*2;
  ctx.shadowColor=isFinal?'#ff0000':'#ff8800';
  ctx.shadowBlur=20;
  ctx.beginPath();ctx.arc(x,y,warnR,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle=isFinal?'rgba(255,50,50,'+warningPulse+')':'rgba(255,180,0,'+warningPulse+')';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(x-warnR,y);ctx.lineTo(x+warnR,y);
  ctx.moveTo(x,y-warnR);ctx.lineTo(x,y+warnR);
  ctx.stroke();
  ctx.shadowBlur=0;
  const cdNum=Math.ceil(remaining);
  ctx.globalAlpha=warningPulse;
  ctx.fillStyle=isFinal?'#ff4444':'#ffcc00';
  ctx.font='bold '+(28+warningPulse*8)+'px monospace';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(cdNum>0?cdNum+'':'!!',x,y);
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
function drawClassAnim(ctx, cls, x, y, isMoving, t, scale=1){
  const s=scale;
  ctx.save();
  ctx.translate(x,y);
  if(cls==='assassin'){
    const moveX = typeof jsX !== 'undefined' ? jsX : 0;
    const moveY = typeof jsY !== 'undefined' ? jsY : 0;
    const windX = isMoving ? -moveX * 10 : 0;
    const windY = isMoving ? -moveY * 6 : 0;
    const f1 = Math.sin(t * 0.016) * 0.6 + Math.sin(t * 0.027) * 0.4;
    const f2 = Math.sin(t * 0.013 + 1.2) * 0.5 + Math.sin(t * 0.031) * 0.5;
    const baseFlutter = isMoving ? 6 : 1.5;
    const flutter1 = windX + f1 * baseFlutter;
    const flutter2 = windY * 0.4 + f2 * baseFlutter * 0.7;
    const alpha = isMoving ? 0.88 : 0.65;
    if(isMoving && (Math.abs(moveX)>0.3 || Math.abs(moveY)>0.3)){
      const speed = Math.sqrt(moveX*moveX + moveY*moveY);
      ctx.save();
      ctx.globalAlpha = 0.08 * speed;
      ctx.fillStyle = '#cc4466';
      ctx.beginPath();
      ctx.ellipse(windX*0.5, windY*0.5, 14*s, 8*s, Math.atan2(-moveY,-moveX), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }
  else if(cls==='warrior'){
    if(weaponUpgradeLevel>0){
      const glow=Math.sin(t*0.008)*0.3+0.5;
      ctx.globalAlpha=glow*0.4;ctx.fillStyle='#aaaaff';
      ctx.beginPath();ctx.arc(12*s,-8*s,4+weaponUpgradeLevel,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
  }
  else if(cls==='gunner'){
    const scarf=isMoving?Math.sin(t*0.02)*3:0;
    ctx.save();ctx.globalAlpha=0.85;ctx.fillStyle='#cc2222';
    ctx.beginPath();ctx.moveTo(-6*s,-4*s);ctx.lineTo(6*s,-4*s);ctx.lineTo((8+scarf)*s,2*s);ctx.lineTo((-8-scarf)*s,2*s);ctx.closePath();ctx.fill();
    ctx.restore();
    if(performance.now()-lastShot<80){ctx.globalAlpha=0.6;ctx.fillStyle='#ffffaa';ctx.beginPath();ctx.arc(14*s,2*s,5,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  }
  else if(cls==='mage'){
    const orbAng=t*0.01;const orbR=isMoving?14:12;const orbAlpha=isMoving?0.6:0.4;
    ctx.save();
    ctx.globalAlpha=0.2+Math.sin(t*0.008)*0.1;ctx.strokeStyle='#cc2222';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,10*s,10*s,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(0,10*s,7*s,0,Math.PI*2);ctx.stroke();
    ctx.restore();
    for(let i=0;i<3;i++){
      const a=orbAng+(i/3)*Math.PI*2;
      const ox=Math.cos(a)*orbR*s,oy=Math.sin(a)*orbR*s*0.4+4*s;
      ctx.save();ctx.globalAlpha=orbAlpha;ctx.shadowColor='#ff3300';ctx.shadowBlur=6;
      ctx.fillStyle=i===0?'#ff2200':i===1?'#ff6600':'#cc0000';
      ctx.beginPath();ctx.arc(ox,oy,2.5*s,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }
  ctx.restore();
}

function drawMe(){
  if(!myClass)return;
  const{x,y}=myPlayer,cls=CLASSES[myClass];
  ctx.save();
  if(myPlayer.groggy){
    ctx.globalAlpha=0.5;
    const spr=SPRITES[myClass];
    if(spr&&spr.complete&&spr.naturalWidth>0){ctx.imageSmoothingEnabled=false;ctx.drawImage(spr,x-16,y-16,32,32);}
    else{ctx.fillStyle='#666';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
    const gt=myPlayer.groggyTimer||0;
    const bW=40,bH=5,bX=x-bW/2,bY=y-28;
    ctx.fillStyle='#330000';ctx.fillRect(bX,bY,bW,bH);
    ctx.fillStyle='#ff4444';ctx.fillRect(bX,bY,bW*(gt/30),bH);
    ctx.strokeStyle='#880000';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);
    ctx.fillStyle='#ff8888';ctx.font='8px monospace';ctx.textAlign='center';
    ctx.fillText('💀 '+(gt).toFixed(0)+'s',x,bY-3);
    ctx.restore();return;
  }
  if(invincible){const alpha=Math.sin(performance.now()*0.01)>0?1:0.3;ctx.globalAlpha=alpha;ctx.strokeStyle='#ffcc00';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  const spr=SPRITES[myClass];
  const t=performance.now();
  const isMoving=(jsX!==0||jsY!==0||keys['w']||keys['s']||keys['a']||keys['d']||keys['arrowup']||keys['arrowdown']||keys['arrowleft']||keys['arrowright']);
  const bounce=isMoving?Math.sin(t*0.015)*2:0;
  if(spr&&spr.complete&&spr.naturalWidth>0){
    ctx.imageSmoothingEnabled=false;ctx.shadowColor=cls.color;ctx.shadowBlur=14+weaponUpgradeLevel*4;
    ctx.drawImage(spr,x-16,y-16+bounce,32,32);ctx.shadowBlur=0;
  }else{
    ctx.shadowColor=cls.color;ctx.shadowBlur=14+weaponUpgradeLevel*4;
    ctx.fillStyle=cls.color;ctx.beginPath();ctx.arc(x,y+bounce,11,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.font='11px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(cls.icon,x,y+bounce);
  }
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
  const pMoving=p._lastX!==undefined&&(Math.abs(p.x-p._lastX)>0.5||Math.abs(p.y-p._lastY)>0.5);
  p._lastX=p.x;p._lastY=p.y;
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
const E_RENDER_R={basic:10,ranged:9,shield:14,fast:8,mage:10};
function drawEnemies(){
  const t=performance.now();
  for(const e of enemies){
    const st=E_STYLES[e.type]||E_STYLES.basic,r=E_RENDER_R[e.type]||10;
    const isMoving=(e.vx!==0||e.vy!==0);
    ctx.save();
    if(e.type==='fast'&&isMoving){
      ctx.globalAlpha=0.18;ctx.fillStyle=st.fill;
      ctx.beginPath();ctx.arc(e.x-e.vx*0.4,e.y-e.vy*0.4,r*0.8,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(e.x-e.vx*0.8,e.y-e.vy*0.8,r*0.5,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
    if(e.type==='mage'){
      ctx.globalAlpha=0.2+Math.sin(t*0.006+e.id)*0.1;ctx.fillStyle=st.shadow;
      ctx.beginPath();ctx.arc(e.x,e.y,r*1.7,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }
    if(e.type==='shield'&&e.shieldHp>0){
      ctx.shadowColor='#44bbff';ctx.shadowBlur=12;ctx.strokeStyle='rgba(68,187,255,0.6)';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(e.x,e.y,r+5+Math.sin(t*0.008)*2,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
    }
    ctx.shadowColor=st.shadow;ctx.shadowBlur=8+Math.sin(t*0.005+e.id)*3;
    ctx.fillStyle=st.fill;ctx.beginPath();ctx.arc(e.x,e.y,r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=st.shadow+'44';ctx.beginPath();ctx.arc(e.x-r*0.2,e.y-r*0.25,r*0.65,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    const blink=Math.sin(t*0.003+e.id*2.3)>0.92;
    if(!blink){
      ctx.fillStyle=st.eye;
      ctx.beginPath();ctx.arc(e.x-r*0.28,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(e.x+r*0.28,e.y-r*0.2,r*0.28,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.beginPath();ctx.arc(e.x-r*0.22,e.y-r*0.28,r*0.1,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(e.x+r*0.34,e.y-r*0.28,r*0.1,0,Math.PI*2);ctx.fill();
    }else{
      ctx.strokeStyle=st.eye;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(e.x-r*0.5,e.y-r*0.2);ctx.lineTo(e.x-r*0.06,e.y-r*0.2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(e.x+r*0.06,e.y-r*0.2);ctx.lineTo(e.x+r*0.5,e.y-r*0.2);ctx.stroke();
    }
    ctx.fillStyle='#220000';ctx.fillRect(e.x-r,e.y-r-8,r*2,3);
    ctx.fillStyle=st.shadow;ctx.fillRect(e.x-r,e.y-r-8,r*2*(e.hp/e.maxHp),3);
    let sx=e.x+r+2;
    if(e.poison&&e.poison>0){ctx.font='8px serif';ctx.fillStyle='#44ff44';ctx.fillText('☠',sx,e.y-r);sx+=10;}
    if(e.iceEnd&&e.iceEnd>t){ctx.font='8px serif';ctx.fillStyle='#44ddff';ctx.fillText('❄',sx,e.y-r);sx+=10;}
    if(e.atkSlow){ctx.font='8px serif';ctx.fillStyle='#ffaa44';ctx.fillText('⬇',sx,e.y-r);}
    if(E_ICONS[e.type]){ctx.font='8px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(E_ICONS[e.type],e.x,e.y+r+6);}
    ctx.restore();
  }
}
function drawFlameDemon(ctx,b,t){
  // 애니메이션 프레임 업데이트
  const dtA=t-(mbPrevT||t);mbPrevT=t;
  mbFrameT+=dtA;
  if(mbFrameT>=125){mbFrameT-=125;mbFrame=(mbFrame+1)%5;if(mbLocked&&mbFrame===0){mbLocked=false;mbRow=0;}}
  const bobY=Math.sin(t*0.002)*4;
  const sz=100;
  const phase2=b.phase===2;
  const glowCol=phase2?'#ff44ff':'#ff4400';
  const glowCol2=phase2?'#aa44ff':'#ffaa00';
  const pulse=Math.sin(t*0.003)*0.5+0.5; // 0→1

  // ── 이펙트1: 배경 발광 오라 (이미지 뒤) ──
  ctx.save();
  ctx.globalAlpha=0.35+pulse*0.25;
  ctx.shadowColor=glowCol;ctx.shadowBlur=28+pulse*18;
  ctx.fillStyle=glowCol;
  ctx.beginPath();ctx.ellipse(0,bobY,34,26,0,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // ── 스프라이트 드로잉 + 이펙트2: 이미지 글로우 ──
  ctx.save();
  if(megaBlastState&&megaBlastState.phase==='warn'&&MB_CHARGE_IMG.complete&&MB_CHARGE_IMG.naturalWidth>0){
    // 대폭발 준비 자세
    const elapsed=t-megaBlastState.startTime;
    const cp=1+Math.sin(elapsed*0.008)*0.07;
    const shakeX=(elapsed>3000?(Math.random()-0.5)*4:(Math.random()-0.5)*1);
    ctx.translate(shakeX,bobY);ctx.scale(cp,cp);
    ctx.shadowColor='#ff4400';ctx.shadowBlur=20+Math.sin(elapsed*0.01)*10;
    ctx.drawImage(MB_CHARGE_IMG,-sz/2,-sz/2,sz,sz);
  }else if(MB_IMG.complete&&MB_IMG.naturalWidth>0){
    ctx.shadowColor=glowCol;ctx.shadowBlur=8+pulse*10;
    if(MB_IMG.naturalWidth>=MB_FW*2){
      ctx.drawImage(MB_IMG,mbFrame*MB_FW,mbRow*MB_FH,MB_FW,MB_FH,-sz/2,-sz/2+bobY,sz,sz);
    }else{
      ctx.drawImage(MB_IMG,-sz/2,-sz/2+bobY,sz,sz);
    }
  }else{
    ctx.shadowColor=glowCol;ctx.shadowBlur=14+pulse*10;
    ctx.fillStyle='#ff3300';ctx.beginPath();ctx.arc(0,bobY,28,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  // ── 이펙트3: 공전 불꽃 오브 4개 ──
  ctx.save();
  for(let i=0;i<4;i++){
    const ang=t*0.002+(i/4)*Math.PI*2;
    const or=40+Math.sin(t*0.003+i*1.2)*6;
    const ox=Math.cos(ang)*or,oy=Math.sin(ang)*or*0.55+bobY;
    const op=Math.sin(t*0.005+i*1.7)*0.3+0.7;
    const or2=3.5+op*2;
    ctx.globalAlpha=op*0.85;
    ctx.shadowColor=i%2===0?glowCol:glowCol2;ctx.shadowBlur=10;
    ctx.fillStyle=i%2===0?glowCol:glowCol2;
    ctx.beginPath();ctx.arc(ox,oy,or2,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  // ── 이펙트4: 엠버 파티클 spawn (세계 좌표) ──
  if(Math.random()<0.3){
    const ax=(Math.random()-0.5)*60,ay=(Math.random()-0.5)*40;
    parts.push({x:b.x+ax,y:b.y+ay,vx:(Math.random()-0.5)*1.2,vy:-1-Math.random()*1.5,life:350,maxLife:350,r:1.5+Math.random()*2,color:phase2?'#ff88ff':(Math.random()<0.5?'#ff6600':'#ffaa00')});
  }

  // HP바 및 이름
  const hpPct=b.hp/b.maxHp;
  ctx.fillStyle='#1a0000';ctx.fillRect(-46,-62,92,8);
  ctx.fillStyle=hpPct>0.5?'#ff4466':phase2?'#ff44ff':'#cc2244';ctx.fillRect(-46,-62,92*hpPct,8);
  ctx.strokeStyle='#660022';ctx.lineWidth=1;ctx.strokeRect(-46,-62,92,8);
  ctx.fillStyle='#fff';ctx.font='bold 9px monospace';ctx.textAlign='center';
  ctx.fillText(phase2?'🔥 INFERNO DEMON':'🔥 FLAME DEMON',0,-66);
  if(phase2){ctx.fillStyle='#ff88ff';ctx.font='bold 7px monospace';ctx.fillText('PHASE 2',0,-56);}
  if(b.iceEnd&&b.iceEnd>t){ctx.fillStyle='#44ddff';ctx.font='12px serif';ctx.fillText('❄',52,-60);}
}

function drawNecromancer(ctx,b,t){
  // ── 최종 보스: NECROMANCER (Canvas로 직접 그림) ──
  if(NECRO_IMG.complete&&NECRO_IMG.naturalWidth>0){ctx.drawImage(NECRO_IMG,-50,-50,100,100);return;}
  const phase2=b.phase===2;
  const bobY=Math.sin(t*0.0015)*2;
  const turretsAlive=turrets.filter(tt=>tt.hp>0).length;
  const hasBarrier=turretsAlive>0;
  const alpha=hasBarrier?0.55:1;

  ctx.save();
  ctx.globalAlpha=alpha;

  // 로브 파티클 (망토 효과)
  for(let i=0;i<10;i++){
    const robeAng=t*0.002+i*0.628;
    const rr=34+Math.sin(t*0.004+i*1.1)*10;
    const rx=Math.cos(robeAng)*rr*0.6;
    const ry=bobY+Math.sin(robeAng)*rr*0.35+12;
    ctx.globalAlpha=alpha*(0.15+Math.sin(t*0.005+i)*0.1);
    ctx.fillStyle=phase2?'#880022':'#330044';
    ctx.beginPath();ctx.arc(rx,ry,3+Math.sin(t*0.008+i)*2,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=alpha;

  // 외부 에너지 오라
  const oraGrad=ctx.createRadialGradient(0,bobY,28,0,bobY,52);
  oraGrad.addColorStop(0,'rgba(0,0,0,0)');
  oraGrad.addColorStop(0.7,phase2?'rgba(180,0,40,0.2)':'rgba(80,0,80,0.18)');
  oraGrad.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=oraGrad;
  ctx.beginPath();ctx.arc(0,bobY,52,0,Math.PI*2);ctx.fill();

  // 갑옷 몸통
  const bodyGrad=ctx.createRadialGradient(-8,-14+bobY,5,0,bobY,26);
  bodyGrad.addColorStop(0,phase2?'#220011':'#1a0022');
  bodyGrad.addColorStop(0.5,phase2?'#3a0015':'#250030');
  bodyGrad.addColorStop(1,phase2?'#110008':'#100018');
  ctx.fillStyle=bodyGrad;
  ctx.beginPath();ctx.arc(0,bobY,26,0,Math.PI*2);ctx.fill();

  // 갑옷 흉갑 리벳
  for(let ri=0;ri<6;ri++){
    const ra=(ri/6)*Math.PI*2+t*0.001;
    const rrr=18;
    ctx.fillStyle=phase2?'rgba(200,0,40,0.6)':'rgba(100,0,120,0.5)';
    ctx.beginPath();ctx.arc(Math.cos(ra)*rrr,bobY+Math.sin(ra)*rrr,2,0,Math.PI*2);ctx.fill();
  }

  // 두개골 얼굴
  // 해골 머리
  ctx.shadowColor=phase2?'#ff2244':'#aa00cc';ctx.shadowBlur=12;
  ctx.fillStyle=phase2?'#e8e0d0':'#d8d0c8';
  ctx.beginPath();ctx.ellipse(0,-18+bobY,13,11,0,0,Math.PI*2);ctx.fill();
  // 광대뼈
  ctx.fillStyle=phase2?'#ccbfb0':'#bfb8b0';
  ctx.beginPath();ctx.ellipse(-9,-14+bobY,5,4,0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(9,-14+bobY,5,4,-0.3,0,Math.PI*2);ctx.fill();
  // 턱
  ctx.fillStyle=phase2?'#e0d8c8':'#d0c8c0';
  ctx.beginPath();ctx.ellipse(0,-9+bobY,10,6,0,0,Math.PI*2);ctx.fill();
  // 눈 소켓
  ctx.fillStyle='#000';
  ctx.beginPath();ctx.ellipse(-5,-20+bobY,4,4,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(5,-20+bobY,4,4,0,0,Math.PI*2);ctx.fill();
  // 눈 발광
  const eyeGlow2=Math.sin(t*0.005)*0.4+0.6;
  ctx.globalAlpha=alpha*eyeGlow2;
  ctx.fillStyle=phase2?'#ff2244':'#cc00ff';
  ctx.shadowColor=phase2?'#ff0022':'#aa00ff';ctx.shadowBlur=8;
  ctx.beginPath();ctx.ellipse(-5,-20+bobY,2.5,3,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(5,-20+bobY,2.5,3,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=alpha;ctx.shadowBlur=0;
  // 코 구멍
  ctx.fillStyle='rgba(0,0,0,0.7)';
  ctx.beginPath();ctx.ellipse(-2,-14+bobY,1.5,2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(2,-14+bobY,1.5,2,0,0,Math.PI*2);ctx.fill();
  // 치아
  for(let ti=-2;ti<=2;ti++){
    ctx.fillStyle=ti%2===0?'#e8e0d0':'#ccbfb0';
    ctx.fillRect(ti*4-1.5,-10+bobY,3,4);
  }

  // 마법봉 (오른쪽)
  ctx.save();
  ctx.translate(28,bobY-8);ctx.rotate(Math.sin(t*0.003)*0.15);
  ctx.strokeStyle=phase2?'#440011':'#330044';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,32);ctx.stroke();
  ctx.strokeStyle=phase2?'#cc0033':'#7700cc';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,32);ctx.stroke();
  // 오브
  const orbGlow=Math.sin(t*0.007)*0.4+0.6;
  ctx.globalAlpha=orbGlow;ctx.shadowColor=phase2?'#ff0044':'#9900ff';ctx.shadowBlur=12;
  ctx.fillStyle=phase2?'#ff0044':'#9900ff';
  ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,0.4)';
  ctx.beginPath();ctx.arc(-2,-2,3,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // 왼팔
  ctx.save();
  ctx.translate(-28,bobY-5);ctx.rotate(-Math.sin(t*0.003)*0.15-0.2);
  ctx.strokeStyle=phase2?'#440011':'#330044';ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,18);ctx.stroke();
  ctx.strokeStyle=phase2?'#6600ff':'#660033';ctx.lineWidth=3;
  ctx.stroke();
  ctx.restore();

  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  ctx.restore();

  // 배리어
  if(hasBarrier){
    ctx.save();
    const barrierAlpha=0.4+Math.sin(t*0.006)*0.2;
    const barrierR=58+Math.sin(t*0.004)*4;
    ctx.globalAlpha=barrierAlpha;ctx.strokeStyle='#ff2244';ctx.lineWidth=4;
    ctx.shadowColor='#ff0022';ctx.shadowBlur=20;
    ctx.beginPath();ctx.arc(0,bobY,barrierR,0,Math.PI*2);ctx.stroke();
    ctx.globalAlpha=barrierAlpha*0.12;ctx.fillStyle='#ff0022';
    ctx.beginPath();ctx.arc(0,bobY,barrierR,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.globalAlpha=1;
    ctx.fillStyle='#ff4466';ctx.font='bold 9px monospace';ctx.textAlign='center';
    ctx.fillText('🛡 포탑 '+turretsAlive+'개',0,bobY+barrierR+14);
    ctx.restore();
  }

  // HP바 및 이름
  const hpPct=b.hp/b.maxHp;
  ctx.fillStyle='#1a0000';ctx.fillRect(-46,-68,92,8);
  ctx.fillStyle=hpPct>0.5?'#aa0022':phase2?'#ff2244':'#880011';ctx.fillRect(-46,-68,92*hpPct,8);
  ctx.strokeStyle='#440011';ctx.lineWidth=1;ctx.strokeRect(-46,-68,92,8);
  ctx.fillStyle='#fff';ctx.font='bold 9px monospace';ctx.textAlign='center';
  ctx.fillText('☠ NECROMANCER',0,-72);
  if(phase2){ctx.fillStyle='#ff4466';ctx.font='bold 7px monospace';ctx.fillText('PHASE 2',0,-62);}
  if(b.iceEnd&&b.iceEnd>t){ctx.fillStyle='#44ddff';ctx.font='12px serif';ctx.fillText('❄',52,-66);}
}

function drawBoss(){
  const b=bossData,isFinal=b.isFinal||false;
  const t=performance.now();
  ctx.save();
  ctx.translate(b.x,b.y);
  if(!isFinal){
    drawFlameDemon(ctx,b,t);
  }else{
    drawNecromancer(ctx,b,t);
  }
  ctx.restore();
}
function drawTurrets(){for(const t of turrets){ctx.save();ctx.fillStyle='#333344';ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6666ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#8888ff';ctx.beginPath();ctx.arc(t.x,t.y,t.r*0.6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#220022';ctx.fillRect(t.x-t.r,t.y-t.r-10,t.r*2,4);ctx.fillStyle='#8888ff';ctx.fillRect(t.x-t.r,t.y-t.r-10,t.r*2*(t.hp/t.maxHp),4);ctx.fillStyle='#fff';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('⚡',t.x,t.y-t.r-12);ctx.restore();}}
function drawProjs(){for(const p of projs){ctx.save();if(p.isBigFireball){ctx.shadowColor='#ff4400';ctx.shadowBlur=35;ctx.fillStyle='#ff6600';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(255,220,80,0.75)';ctx.beginPath();ctx.arc(p.x,p.y,p.r*0.5,0,Math.PI*2);ctx.fill();ctx.restore();continue;}let col=p.color;if(p.element&&weaponUpgradeLevel>=2)col=ELEMENT_COLORS[p.element];ctx.shadowColor=col;ctx.shadowBlur=p.visual?4:p.isMagic?12:8;ctx.globalAlpha=p.visual?0.6:1;ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();if(!p.visual&&!p.enemy&&weaponUpgradeLevel>=3&&p.isMagic){ctx.strokeStyle=col+'44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+3,0,Math.PI*2);ctx.stroke();}ctx.restore();}}
function drawParts(){for(const p of parts){const a=p.life/p.maxLife;ctx.save();ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*a,0,Math.PI*2);ctx.fill();ctx.restore();}}
function drawPixelExplosions(){
  for(const px of pixelExplList){
    const a=px.life/px.maxLife;
    ctx.save();ctx.globalAlpha=a;ctx.translate(px.x,px.y);ctx.rotate(px.rot);ctx.fillStyle=px.color;ctx.fillRect(-px.w/2,-px.h/2,px.w,px.h);ctx.restore();
  }
}
function drawExplosions(){for(const ex of explosions){const a=ex.life/ex.maxLife,cr=ex.r*(1-a*0.3);ctx.save();ctx.globalAlpha=a*0.7;ctx.shadowColor=ex.color;ctx.shadowBlur=20;ctx.strokeStyle=ex.color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(ex.x,ex.y,cr,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=a*0.4;ctx.fillStyle=ex.color;ctx.beginPath();ctx.arc(ex.x,ex.y,cr*0.6,0,Math.PI*2);ctx.fill();ctx.restore();}}
function drawFireZones(){for(const fz of fireZones){const a=fz.life/fz.maxLife;ctx.save();ctx.globalAlpha=a*0.4;ctx.fillStyle='#ff4400';ctx.beginPath();ctx.arc(fz.x,fz.y,30,0,Math.PI*2);ctx.fill();ctx.globalAlpha=a*0.6;ctx.strokeStyle='#ff6600';ctx.lineWidth=2;ctx.beginPath();ctx.arc(fz.x,fz.y,30,0,Math.PI*2);ctx.stroke();ctx.restore();}}
function drawOrbs(){const t=performance.now()*0.004;for(const o of orbs){if(o.col)continue;ctx.save();ctx.shadowColor='#44aaff';ctx.shadowBlur=8;ctx.fillStyle='#2266cc';ctx.beginPath();ctx.arc(o.x,o.y+Math.sin(t+o.x)*2,5,0,Math.PI*2);ctx.fill();ctx.restore();}}
function spawnParts(x,y,color,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*2.5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:350,maxLife:350,r:3,color});}}
function spawnPixelExplosion(x,y,type){
  if(type==='mega'){
    for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,s=3+Math.random()*8;const col=Math.random()<0.5?'#ff2200':'#ff8800';const sz=4+Math.floor(Math.random()*8);pixelExplList.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:600+Math.random()*400,maxLife:1000,w:sz,h:sz,color:col,rot:Math.random()*Math.PI*2,rotV:(Math.random()-0.5)*0.2});}
    for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*4;pixelExplList.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:400+Math.random()*300,maxLife:700,w:6,h:6,color:'#ffcc44',rot:0,rotV:0});}
  }else{
    for(let i=0;i<16;i++){const a=Math.random()*Math.PI*2,s=1.5+Math.random()*4;const col=Math.random()<0.5?'#ff8844':'#ffcc44';const sz=2+Math.floor(Math.random()*4);pixelExplList.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:250+Math.random()*200,maxLife:450,w:sz,h:sz,color:col,rot:0,rotV:(Math.random()-0.5)*0.15});}
  }
}
let msgTimer=0;
function showPop(txt,dur){const el=document.getElementById('msgPop');el.textContent=txt;el.style.display='block';msgTimer=dur||1400;}
function addKf(txt){const f=document.getElementById('killFeed'),el=document.createElement('div');el.className='kf';el.textContent=txt;f.appendChild(el);setTimeout(()=>el.remove(),2600);while(f.children.length>4)f.removeChild(f.firstChild);}
function endGame(win){running=false;hideGameUI();const el=document.getElementById('goScreen');el.style.display='flex';document.getElementById('goTitle').textContent=win?'ALL CLEAR! 🎉':'GAME OVER';document.getElementById('goTitle').style.color=win?'#ffcc00':'#ff4444';const stagesCleared=win?3:currentStage-1;document.getElementById('goStats').innerHTML='스테이지: '+stagesCleared+'/3<br>직업: '+(myClass?CLASSES[myClass].name:'없음')+'<br>처치: '+kills+'<br>점수: '+score+'<br>레벨: '+(myPlayer?myPlayer.lv:1)+'<br>특성: '+(myTraits.length>0?myTraits.map(id=>ALL_TRAITS.find(t=>t.id===id)?.name||id).join(', '):'없음');}
let _loopRunning=false;
function loop(ts){
  const dt=Math.min(ts-lastTime,50);lastTime=ts;
  if(msgTimer>0){msgTimer-=dt;if(msgTimer<=0)document.getElementById('msgPop').style.display='none';}
  if(running){update(dt);draw();}
  else if(myPlayer&&!myPlayer.dead){
    const spF=dt/16;
    if(parts.length>0){for(const p of parts){p.x+=p.vx*spF;p.y+=p.vy*spF;p.life-=dt;}parts=parts.filter(p=>p.life>0);}
    if(explosions.length>0){for(const ex of explosions)ex.life-=dt;explosions=explosions.filter(ex=>ex.life>0);}
    if(projs.length>200)projs=projs.filter(p=>!p.enemy).slice(-100);
    draw();
  }
  if(_loopRunning)requestAnimationFrame(loop);
}
window.addEventListener('resize',()=>{W=G.clientWidth;H=G.clientHeight;canvas.width=W;canvas.height=H;});
</script>
</body>
</html>`;

// ── SERVER ─────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if(req.url&&/\.(png|jpg|gif|mp3|ogg|wav)$/i.test(req.url)){const path=require('path'),fs=require('fs');const fp=path.join(__dirname,'assets',req.url.split('?')[0]);const ext=req.url.split('.').pop().split('?')[0].toLowerCase();const ct={png:'image/png',jpg:'image/jpeg',gif:'image/gif',mp3:'audio/mpeg',ogg:'audio/ogg',wav:'audio/wav'};let d;try{d=fs.readFileSync(fp);}catch(e){try{const dir=path.dirname(fp),base=path.basename(fp).toLowerCase();const match=fs.readdirSync(dir).find(f=>f.toLowerCase()===base);if(match)d=fs.readFileSync(path.join(dir,match));}catch(e2){}}if(d){res.writeHead(200,{'Content-Type':ct[ext]||'application/octet-stream'});res.end(d);return;}}
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
    if(ws.bufferedAmount>65536)return;
    try{ws.send(d);}catch(e){}
  });
}
function bcastAll(room,msg){bcast(room,msg,null);}
const ETYPES=[{type:'basic',spd:1.0,hpMult:1.0,r:12,dmgMult:1.0},{type:'ranged',spd:0.65,hpMult:0.75,r:11,dmgMult:0.8},{type:'shield',spd:0.55,hpMult:2.8,r:14,dmgMult:1.2,shieldHp:true},{type:'fast',spd:2.2,hpMult:0.55,r:10,dmgMult:0.9},{type:'mage',spd:0.7,hpMult:0.85,r:11,dmgMult:1.1}];
const SPAWN_WEIGHTS=[[0.55,0.2,0.1,0.1,0.05],[0.35,0.2,0.15,0.15,0.15],[0.2,0.2,0.15,0.2,0.25]];
function pickEtype(stage){const w=SPAWN_WEIGHTS[Math.min(stage-1,2)];const r=Math.random();let cum=0;for(let i=0;i<w.length;i++){cum+=w[i];if(r<cum)return ETYPES[i];}return ETYPES[0];}
function spawnEnemies(room){if(room.midBossAlive||room.finalBossAlive)return;const gp=(600-room.stageTime)/600,pc=room.players.size,sm=room.currentStage;const cnt=Math.max(1,Math.floor((1+gp*1.5+(pc-1)*0.4)*sm*1.8));const arr=[...room.players.values()].filter(p=>!p.dead);if(!arr.length)return;const ref=arr[Math.floor(Math.random()*arr.length)];for(let i=0;i<cnt;i++){const a=Math.random()*Math.PI*2,r=350+Math.random()*80,et=pickEtype(room.currentStage);const bh=(20+Math.random()*15*(1+gp*2))*sm*(1+(pc-1)*0.3);const ehm=room.enemyHpMult||1,edm=room.enemyDmgMult||1;room.enemies.push({id:room.eid++,x:ref.x+Math.cos(a)*r,y:ref.y+Math.sin(a)*r,hp:bh*et.hpMult*ehm,maxHp:bh*et.hpMult*ehm,spd:et.spd*(1+(room.currentStage-1)*0.3+gp*0.4),type:et.type,r:et.r,dead:false,lastShot:0,shieldHp:et.shieldHp?Math.floor(bh*0.5*ehm):0,dmgMult:et.dmgMult*(1+gp*0.3)*edm,poison:0,ice:false,atkSlow:false});}if(room.enemies.length>150)room.enemies=room.enemies.filter(e=>!e.dead).slice(-150);}
function spawnBossMobs(room){const pc=room.players.size,cnt=3+pc*2;const arr=[...room.players.values()].filter(p=>!p.dead);if(!arr.length)return;const br=room.boss||{x:0,y:0};for(let i=0;i<cnt;i++){const a=Math.random()*Math.PI*2,r=200+Math.random()*150;const et=Math.random()<0.8?ETYPES[1]:ETYPES[2];const bh=(30+Math.random()*20)*(1+(pc-1)*0.3);room.enemies.push({id:room.eid++,x:br.x+Math.cos(a)*r,y:br.y+Math.sin(a)*r,hp:bh*et.hpMult,maxHp:bh*et.hpMult,spd:et.spd*1.2,type:et.type,r:et.r,dead:false,lastShot:0,shieldHp:et.shieldHp?Math.floor(bh*0.5):0,dmgMult:et.dmgMult*1.3,poison:0,ice:false,atkSlow:false});}}
function spawnMiniMidBoss(room){
  const br=room.boss||{x:0,y:0};
  const a=Math.random()*Math.PI*2,r=220+Math.random()*100;
  room.enemies.push({id:room.eid++,x:br.x+Math.cos(a)*r,y:br.y+Math.sin(a)*r,hp:2000,maxHp:2000,spd:1.1,type:'basic',r:18,dead:false,lastShot:0,shieldHp:0,dmgMult:1.4,poison:0,ice:false,atkSlow:false,isMiniMid:true});
}
function spawnBoss(room,isFinal){
  const pc=room.players.size;
  const ARENA=800;
  room.players.forEach(p=>{
    const d=Math.sqrt(p.x*p.x+p.y*p.y);
    if(d>ARENA*0.7){const a=Math.atan2(p.y,p.x);p.x=Math.cos(a)*ARENA*0.6;p.y=Math.sin(a)*ARENA*0.6;}
  });
  room.enemies=[];
  const bossSpawnX=0, bossSpawnY=0;
  const ps=[];
  room.players.forEach(p=>{
    ps.push({id:p.id,x:Math.round(p.x),y:Math.round(p.y),hp:p.hp,maxHp:p.maxHp,lv:p.lv,dead:p.dead,groggy:p.groggy||false,groggyTimer:p.groggyTimer||0,reviveProgress:p.reviveProgress||0,name:p.name,exp:p.exp,expNext:p.expNext,cls:p.cls,dmgBonus:p.dmgBonus||1,armor:p.armor||0,regen:p.regen||0,rangeMult:p.rangeMult||1,cdMult:p.cdMult||1,spdMult:p.spdMult||1,critRate:p.critRate||0});
  });
  bcastAll(room,{t:'state',players:ps,enemies:[],st:room.stageTime,stage:room.currentStage,teleport:true});
  bcastAll(room,{t:'bossWarning',isFinal,x:bossSpawnX,y:bossSpawnY,countdown:5});
  setTimeout(()=>{
    const bh=isFinal?(4500+room.currentStage*800):(2200+room.currentStage*400);
    const hp=bh*(1+(pc-1)*0.5);
    room.boss={hp,maxHp:hp,x:bossSpawnX,y:bossSpawnY,r:42,dead:false,ang:0,phase:1,isFinal,playerCount:pc,lastHeavy:0,lastHpThreshold:100,armor:isFinal?0.7:0.5,frozen:false,invincible:false,megaBlasting:false,miniMidTimer:0,lastSlash:0,lastBigFireball:0,slashCharging:false,slashChargeTimer:0,slashWarnAng:0};
    room.enemies=[];
    if(isFinal){
      room.finalBossAlive=true;
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
    if(p.groggy){
      p.groggyTimer=Math.max(0,(p.groggyTimer||30)-dt);
      if(p.groggyTimer<=0){p.groggy=false;p.dead=true;if(ws.readyState===1)ws.send(JSON.stringify({t:'groggyDead'}));}
    }
  });
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
      if(gp.reviveProgress>=1){gp.groggy=false;gp.dead=false;gp.hp=gp.maxHp*0.3;gp.reviveProgress=0;bcastAll(room,{t:'revived',id:gp.id});}
    }else{
      gp.reviveProgress=Math.max(0,(gp.reviveProgress||0)-dt/3);
    }
  });
  if(!room.midBossAlive&&!room.finalBossAlive&&!room.stageClearPending){room.spawnT=(room.spawnT||0)+dt;if(room.spawnT>0.7){room.spawnT=0;spawnEnemies(room);}}
  if(!room.midBossSpawned&&room.stageTime<=300){room.midBossSpawned=true;spawnBoss(room,false);}
  if(room.midBossAlive)room.stageTime=Math.max(room.stageTime,0.1);
  if(!room.finalBossSpawned&&!room.midBossAlive&&room.midBossSpawned&&room.stageTime<=0){room.finalBossSpawned=true;room.stageTime=0;spawnBoss(room,true);}
  const arr=[...room.players.values()];
  if(!room.stageClearPending){
  room.enemies=room.enemies.filter(e=>!e.dead);
  const alivePlayers=arr.filter(p=>!p.dead&&!p.groggy);
  for(const e of room.enemies){
    if(e.poison>0){e.hp-=e.maxHp*0.004*e.poison*dt;if(e.hp<=1)e.hp=1;}
    const isIced=e.iceEnd&&e.iceEnd>now,sm=isIced?0.85:1,dm=isIced?0.85:1;
    let near=null,md2=Infinity;
    for(const p of alivePlayers){const dx=p.x-e.x,dy=p.y-e.y,d2=dx*dx+dy*dy;if(d2<md2){md2=d2;near=p;}}
    if(!near)continue;
    const md=Math.sqrt(md2);
    const dx=near.x-e.x,dy=near.y-e.y;
    if(e.type==='ranged'){if(md>180){e._vx=dx/md*e.spd*sm*60;e._vy=dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else if(md<120){e._vx=-dx/md*e.spd*sm*60;e._vy=-dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else{e._vx=0;e._vy=0;}e.lastShot+=dt;if(e.lastShot>(e.atkSlow?3.3:2.2)*(isIced?1.176:1)){e.lastShot=0;bcastAll(room,{t:'pat',i:-1,bx:e.x,by:e.y,ang:Math.atan2(dy,dx),phase:0,etype:'ranged'});}}
    else if(e.type==='mage'){if(md>220){e._vx=dx/md*e.spd*sm*60;e._vy=dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else if(md<160){e._vx=-dx/md*e.spd*0.8*sm*60;e._vy=-dy/md*e.spd*0.8*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}else{e._vx=0;e._vy=0;}e.lastShot+=dt;if(e.lastShot>(e.atkSlow?4.2:2.8)*(isIced?1.176:1)){e.lastShot=0;bcastAll(room,{t:'pat',i:-1,bx:e.x,by:e.y,ang:Math.atan2(dy,dx),phase:0,etype:'mage'});}}
    else{e._vx=dx/md*e.spd*sm*60;e._vy=dy/md*e.spd*sm*60;e.x+=e._vx*dt;e.y+=e._vy*dt;}
    if(md<e.r+14){const isInv=near.invincible||(near.invincibleEnd>0&&near.invincibleEnd>now);if(!isInv){near.hp-=0.35*e.dmgMult*dm*dt*60*(1-(near.armor||0));if(near.hp<=0){near.hp=0;const ac=alivePlayers.filter(q=>q!==near).length;if(ac>0){near.groggy=true;near.groggyTimer=30;near.reviveProgress=0;}else near.dead=true;}}}
  }
  if(room.fireZones&&room.fireZones.length>0){room.fireZones=room.fireZones.filter(fz=>fz.life>0);for(const fz of room.fireZones){fz.life-=dt*1000;for(const e of room.enemies){const dx=e.x-fz.x,dy=e.y-fz.y;if(Math.sqrt(dx*dx+dy*dy)<30+e.r){e.hp-=fz.dmg*dt*2;if(e.hp<=0)e.dead=true;}}}}
  if(room.boss&&!room.boss.dead){
    const b=room.boss;b.ang+=dt*1.5;if(b.hp<b.maxHp/2&&b.phase===1){b.phase=2;bcastAll(room,{t:'phase2'});}
    if(!b.isFinal&&b.phase===2&&!b.megaBlasting&&b.hp<b.maxHp*0.2){
      b.megaBlasting=true;b.frozen=true;b.invincible=true;
      const safeZones=[];const alive2=arr.filter(p=>!p.dead&&!p.groggy);
      for(let si=0;si<Math.max(1,alive2.length);si++){const sa=(si/Math.max(1,alive2.length))*Math.PI*2+(Math.random()-0.5)*0.5;const sd=200+Math.random()*100;safeZones.push({x:b.x+Math.cos(sa)*sd,y:b.y+Math.sin(sa)*sd,r:55});}
      bcastAll(room,{t:'megaBlastWarn',bx:b.x,by:b.y,safeZones});
      setTimeout(()=>{
        if(!room.boss||room.boss.dead)return;
        bcastAll(room,{t:'megaBlast',bx:b.x,by:b.y});
        room.players.forEach(p=>{
          if(p.dead||p.groggy)return;
          const isInv=p.invincible||(p.invincibleEnd>0&&p.invincibleEnd>Date.now());if(isInv)return;
          const inSafe=safeZones.some(z=>{const dx=p.x-z.x,dy=p.y-z.y;return Math.sqrt(dx*dx+dy*dy)<z.r;});
          if(!inSafe){p.hp=0;const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==p).length;if(ac>0){p.groggy=true;p.groggyTimer=30;p.reviveProgress=0;}else p.dead=true;}
        });
        setTimeout(()=>{if(!room.boss||room.boss.dead)return;room.boss.frozen=false;room.boss.invincible=false;bcastAll(room,{t:'megaBlastEnd'});},1000);
      },5000);
    }
    if(b.isFinal){const hp=Math.floor((b.hp/b.maxHp)*100),thr=Math.floor(hp/10)*10;if(thr<b.lastHpThreshold){b.lastHpThreshold=thr;}b.miniMidTimer=(b.miniMidTimer||0)+dt;if(b.miniMidTimer>=30){b.miniMidTimer=0;spawnMiniMidBoss(room);}}
    if(b.isFinal&&room.turrets&&room.turrets.some(t=>!t.dead&&t.hp>0))b.hp=Math.min(b.hp+b.maxHp*0.05*dt,b.maxHp);
    const isIced=b.iceEnd&&b.iceEnd>now,bs=(b.isFinal?2.0:1.6)*(isIced?0.85:1),bd=isIced?0.85:1;
    let near=null,md=Infinity;for(const p of alivePlayers){const dx=p.x-b.x,dy=p.y-b.y,d=dx*dx+dy*dy;if(d<md){md=d;near=p;}}
    if(near){md=Math.sqrt(md)||1;const dx=near.x-b.x,dy=near.y-b.y;if(!b.frozen){b.x+=dx/md*bs*dt*60;b.y+=dy/md*bs*dt*60;}if(md<b.r+14){const isInv=near.invincible||(near.invincibleEnd>0&&near.invincibleEnd>now);if(!isInv){const cd=b.isFinal?(b.phase===1?0.4:0.6):(b.phase===1?0.3:0.45);near.hp-=cd*bd*dt*60*(1-(near.armor||0));if(near.hp<=0){near.hp=0;const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==near).length;if(ac>0){near.groggy=true;near.groggyTimer=30;near.reviveProgress=0;}else near.dead=true;}}}b.lastHeavy=(b.lastHeavy||0)+dt;if(b.lastHeavy>(isIced?4.7:4)){b.lastHeavy=0;bcastAll(room,{t:'pat',i:-2,bx:b.x,by:b.y,ang:Math.atan2(dy,dx),phase:b.phase,isFinal:b.isFinal});}}
    // ── 근접 칼 공격 (5초, 중간보스 전용, frozen/megaBlasting 제외) ──
    if(!b.isFinal&&!b.megaBlasting&&!b.frozen){
      if(!b.slashCharging){
        b.lastSlash+=dt;
        if(b.lastSlash>=5){
          b.lastSlash=0;
          // 가장 가까운 플레이어 방향 기준 180° 내 랜덤 방향 선택
          const baseAng=near?Math.atan2(near.y-b.y,near.x-b.x):0;
          const randOff=(Math.random()-0.5)*Math.PI; // ±90°
          b.slashWarnAng=baseAng+randOff;
          b.slashCharging=true;
          b.slashChargeTimer=0;
          bcastAll(room,{t:'pat',i:7,bx:b.x,by:b.y,ang:b.slashWarnAng,phase:b.phase,isFinal:false});
        }
      }else{
        b.slashChargeTimer+=dt;
        if(b.slashChargeTimer>=0.5){
          b.slashCharging=false;
          const SLASH_RANGE=250,SLASH_HALF=Math.PI/9; // 사거리 250, 콘 ±20°
          alivePlayers.forEach(p=>{
            const dx=p.x-b.x,dy=p.y-b.y;
            if(Math.sqrt(dx*dx+dy*dy)<SLASH_RANGE){
              let da=Math.atan2(dy,dx)-b.slashWarnAng;
              while(da>Math.PI)da-=Math.PI*2;while(da<-Math.PI)da+=Math.PI*2;
              if(Math.abs(da)<=SLASH_HALF){
                const isInv=p.invincible||(p.invincibleEnd>0&&p.invincibleEnd>now);
                if(!isInv){p.hp-=70*(1-(p.armor||0));if(p.hp<=0){p.hp=0;const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==p).length;if(ac>0){p.groggy=true;p.groggyTimer=30;p.reviveProgress=0;}else p.dead=true;}}
              }
            }
          });
          bcastAll(room,{t:'pat',i:5,bx:b.x,by:b.y,ang:b.slashWarnAng,phase:b.phase,isFinal:false});
        }
      }
      // ── 강력한 화염구 (10초, 가장 먼 플레이어 방향) ──
      b.lastBigFireball+=dt;
      if(b.lastBigFireball>=10){
        b.lastBigFireball=0;
        let farthest=null,maxD=-1;
        alivePlayers.forEach(p=>{const dx=p.x-b.x,dy=p.y-b.y,d=dx*dx+dy*dy;if(d>maxD){maxD=d;farthest=p;}});
        if(farthest){const dx=farthest.x-b.x,dy=farthest.y-b.y;bcastAll(room,{t:'pat',i:6,bx:b.x,by:b.y,ang:Math.atan2(dy,dx),phase:b.phase,isFinal:false});}
      }
    }
    room.patT=(room.patT||0)+dt;const pi=(b.isFinal?(b.phase===1?1.3:0.9):(b.phase===1?1.8:1.3))*(isIced?1.176:1);if(room.patT>pi){room.patT=0;const patI=(room.patI||0);const patCycle=b.phase===1?3:5;if(!b.isFinal&&patI>0&&patI%10===0){b.frozen=true;
bcastAll(room,{t:'pat',i:-3,bx:b.x,by:b.y,ang:b.ang,phase:b.phase,isFinal:false});
setTimeout(()=>{
  if(!room.boss||room.boss.dead)return;
  // 레이저 피격 판정
  room.players.forEach(p=>{
    if(p.dead||p.groggy)return;
    const ang8=[0,Math.PI/4,Math.PI/2,Math.PI*3/4,Math.PI,Math.PI*5/4,Math.PI*3/2,Math.PI*7/4];
    let hit=false;
    for(const a of ang8){
      const dx2=Math.cos(a),dy2=Math.sin(a);
      const t2=(p.x-b.x)*dx2+(p.y-b.y)*dy2;
      if(t2<0)continue;
      const px=p.x-(b.x+dx2*t2),py=p.y-(b.y+dy2*t2);
      if(Math.sqrt(px*px+py*py)<28){hit=true;break;}
    }
    if(hit){
      const isInv=p.invincible||(p.invincibleEnd>0&&p.invincibleEnd>Date.now());
      if(!isInv){
        p.hp-=p.maxHp*0.5+20;
        if(p.hp<=0){
          p.hp=0;
          const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==p).length;
          if(ac>0){p.groggy=true;p.groggyTimer=30;p.reviveProgress=0;}
          else p.dead=true;
        }
      }
    }
  });
  bcastAll(room,{t:'pat',i:-4,bx:b.x,by:b.y,ang:b.ang,phase:b.phase,isFinal:false});
  // 레이저 종료 0.6초 후 frozen 해제
  setTimeout(()=>{
    if(room.boss&&!room.boss.dead)room.boss.frozen=false;
  },600);
},2000); // 경고 2초 후 발사
setTimeout(()=>{if(!room.boss||room.boss.dead)return;room.players.forEach((p)=>{if(p.dead||p.groggy)return;const ang8=[0,Math.PI/4,Math.PI/2,Math.PI*3/4,Math.PI,Math.PI*5/4,Math.PI*3/2,Math.PI*7/4];let hit=false;for(const a of ang8){const dx=Math.cos(a),dy=Math.sin(a);const t2=((p.x-b.x)*dx+(p.y-b.y)*dy);if(t2<0)continue;const px=p.x-(b.x+dx*t2),py=p.y-(b.y+dy*t2);const dist=Math.sqrt(px*px+py*py);if(dist<28){hit=true;break;}}if(hit){const isInv=p.invincible||(p.invincibleEnd>0&&p.invincibleEnd>Date.now());if(!isInv){p.hp-=p.maxHp*0.5+20;if(p.hp<=0){p.hp=0;const ac=[...room.players.values()].filter(q=>!q.dead&&!q.groggy&&q!==p).length;if(ac>0){p.groggy=true;p.groggyTimer=30;p.reviveProgress=0;}else p.dead=true;}}}});bcastAll(room,{t:'pat',i:-4,bx:b.x,by:b.y,ang:b.ang,phase:b.phase,isFinal:false});},2000);}else{bcastAll(room,{t:'pat',i:patI%patCycle,bx:b.x,by:b.y,ang:b.ang,phase:b.phase,isFinal:b.isFinal});}room.patI=patI+1;}
  }
  }
  room.syncT=(room.syncT||0)+dt;
  const syncInterval=0.033+Math.max(0,room.players.size-1)*0.01;
  if(room.syncT>syncInterval){
    room.syncT=0;const ps=[];
    room.players.forEach((p)=>{
      ps.push({id:p.id,x:Math.round(p.x),y:Math.round(p.y),hp:Math.round(p.hp),maxHp:p.maxHp,lv:p.lv,dead:p.dead,groggy:p.groggy||false,groggyTimer:p.groggyTimer?Math.round(p.groggyTimer):0,reviveProgress:p.reviveProgress?Math.round(p.reviveProgress*100)/100:0,name:p.name,exp:p.exp,expNext:p.expNext,cls:p.cls,dmgBonus:p.dmgBonus||1,armor:p.armor||0,regen:p.regen||0,rangeMult:p.rangeMult||1,cdMult:p.cdMult||1,spdMult:p.spdMult||1,critRate:p.critRate||0});
    });
    const sf=room.stateTick%8===0;
    const ed=room.enemies.map(e=>sf
      ?{id:e.id,x:Math.round(e.x),y:Math.round(e.y),hp:Math.round(e.hp),vx:e._vx||0,vy:e._vy||0,maxHp:Math.round(e.maxHp),type:e.type,r:e.r,shieldHp:e.shieldHp||0,poison:e.poison||0,iceEnd:e.iceEnd||0,atkSlow:e.atkSlow||false}
      :{id:e.id,x:Math.round(e.x),y:Math.round(e.y),hp:Math.round(e.hp),vx:e._vx||0,vy:e._vy||0});
    bcastAll(room,{t:'state',players:ps,enemies:ed,
      boss:room.boss&&!room.boss.dead?{x:Math.round(room.boss.x),y:Math.round(room.boss.y),hp:Math.round(room.boss.hp),maxHp:room.boss.maxHp,phase:room.boss.phase,ang:Math.round(room.boss.ang*100)/100,isFinal:room.boss.isFinal,iceEnd:room.boss.iceEnd||0}:null,
      turrets:room.stateTick%12===0&&room.turrets?room.turrets.filter(t=>t.hp>0).map(t=>({id:t.id,x:Math.round(t.x),y:Math.round(t.y),hp:Math.round(t.hp),maxHp:t.maxHp,r:t.r,isTurret:true})):undefined,
      st:Math.round(room.stageTime),stage:room.currentStage});
  }
  const alive=arr.filter(p=>!p.dead&&!p.groggy);if(alive.length===0&&arr.length>0){bcastAll(room,{t:'over',win:false});clearInterval(room.tick);rooms.delete(code);}
  }catch(e){console.error('[tickRoom error]',e);}
}

wss.on('connection',ws=>{
  ws.pid=Math.random().toString(36).substr(2,6);ws.roomCode=null;
  ws.isAlive=true;
  ws.on('pong',()=>{ws.isAlive=true;});
  ws.on('message',raw=>{
    let msg;try{msg=JSON.parse(raw);}catch{return;}
    if(msg.t==='ping'){ws.isAlive=true;if(ws.readyState===1)ws.send(JSON.stringify({t:'pong'}));return;}
    const newPlayer=(name,x=0,y=0)=>({id:ws.pid,x,y,hp:100,maxHp:100,lv:1,exp:0,expNext:50,dead:false,groggy:false,groggyTimer:0,reviveProgress:0,name,lvUp:false,cls:null,regen:0,armor:0,expMult:1,critRate:0,dmgBonus:1,invincible:false,invincibleEnd:0,lvUpQueue:0});
    if(msg.t==='create'){
      const code=genCode();
      rooms.set(code,{players:new Map(),enemies:[],boss:null,turrets:[],fireZones:[],stageTime:600,currentStage:1,started:false,midBossSpawned:false,finalBossSpawned:false,midBossAlive:false,finalBossAlive:false,eid:0,lastTick:Date.now(),readyCount:0,enemyHpMult:1,enemyDmgMult:1});
      ws.roomCode=code;rooms.get(code).players.set(ws,newPlayer(msg.name||'Player'));
      ws.send(JSON.stringify({t:'created',code,id:ws.pid}));
      bcastAll(rooms.get(code),{t:'lobby',players:[...rooms.get(code).players.values()].map(p=>({id:p.id,name:p.name}))});
    }
    else if(msg.t==='join'){
      const code=(msg.code||'').toUpperCase(),room=rooms.get(code);
      if(!room){ws.send(JSON.stringify({t:'err',msg:'방을 찾을 수 없어요'}));return;}
      if(room.started){ws.send(JSON.stringify({t:'err',msg:'이미 시작된 방이에요'}));return;}
      if(room.players.size>=4){ws.send(JSON.stringify({t:'err',msg:'방이 가득 찼어요 (최대 4인)'}));return;}
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
      room.readyCount=(room.readyCount||0)+1;if(room.readyCount>=room.players.size){room.started=true;room.lastTick=Date.now();bcastAll(room,{t:'allReady'});room.tick=setInterval(()=>tickRoom(ws.roomCode),33);}
    }
    else if(msg.t==='move'){
      const room=rooms.get(ws.roomCode);if(!room)return;
      const p=room.players.get(ws);if(!p||p.dead||p.groggy)return;
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
      const safeDmg=(!isNaN(msg.dmg)&&isFinite(msg.dmg)&&msg.dmg>0)?msg.dmg:0;
      if(safeDmg<=0)return;
      if(msg.target==='boss'){
        if(room.boss&&!room.boss.dead){
          if(room.boss.invincible)return;
          const wt=msg.weaponType||'melee';
          // 직업별 피해 감소: 중간보스(검사/암살자 50%, 저격수/마법사 60%), 최종보스(검사/암살자 70%, 저격수/마법사 80%)
          const sender=room.players.get(ws);const senderCls=sender?sender.cls:'warrior';
          let ba;
          if(room.boss.isFinal){
            if(senderCls==='gunner'||senderCls==='mage') ba=0.80;
            else ba=0.70;
          }else{
            if(senderCls==='gunner'||senderCls==='mage') ba=0.60;
            else ba=0.50;
          }
          if(msg.element==='ice'&&tier>=2)room.boss.iceEnd=Date.now()+3000;
          room.boss.hp-=safeDmg*(1-ba);
          if(room.boss.hp<=0){room.boss.dead=true;const isFinal=room.boss.isFinal;
            if(isFinal){room.players.forEach(p=>{if(!p.dmgBonus)p.dmgBonus=1;p.dmgBonus*=1.25;});if(room.currentStage<3){
              bcastAll(room,{t:'weaponUpgrade',msg:'최종 보스 처치! (+25% 데미지)'});
              bcastAll(room,{t:'stageClear',stage:room.currentStage,next:room.currentStage+1});
              room.stageClearPending=true;
              room.enemies=[];
              room.players.forEach(p=>{p.invincible=true;p.invincibleEnd=Infinity;});
              setTimeout(()=>{
                room.currentStage++;room.stageTime=600;
                room.midBossSpawned=false;room.finalBossSpawned=false;
                room.midBossAlive=false;room.finalBossAlive=false;
                room.boss=null;room.enemies=[];room.turrets=[];room.fireZones=[];
                room.stageClearPending=false;
                room.players.forEach(p=>{p.invincible=false;p.invincibleEnd=0;});
                bcastAll(room,{t:'stageStart',stage:room.currentStage});
              },5500);
            }else{bcastAll(room,{t:'weaponUpgrade',msg:'최종 보스 처치! 승리!'});bcastAll(room,{t:'over',win:true});clearInterval(room.tick);rooms.delete(ws.roomCode);}}
            else{
              room.midBossAlive=false;room.boss=null;
              room.enemies=[];
              room.players.forEach(p=>{p.invincible=true;p.invincibleEnd=Infinity;});
              bcastAll(room,{t:'midBossDead'});
              bcastAll(room,{t:'bossHp',hp:0});
              room.players.forEach(p=>{if(!p.dmgBonus)p.dmgBonus=1;p.dmgBonus*=1.15;});
              bcastAll(room,{t:'weaponUpgrade',msg:'중간 보스 처치! (+15% 데미지)'});
              if(room.currentStage===1){room.enemyHpMult=2;room.enemyDmgMult=1.5;bcastAll(room,{t:'enemyBuff',msg:'⚠ 잡몹 강화! (HP×2, 공격력×1.5)'});}
            }
          }else bcastAll(room,{t:'bossHp',hp:room.boss.hp});
        }
      }else if(msg.target==='turret'){
        const t=room.turrets?room.turrets.find(tt=>tt.id===msg.tid):null;if(t&&t.hp>0){t.hp-=safeDmg;if(t.hp<=0){t.hp=0;t.dead=true;spawnBossMobs(room);}bcastAll(room,{t:'turretHp',id:t.id,hp:t.hp});}
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
  ws.on('close',()=>{
    const room=rooms.get(ws.roomCode);
    if(!room)return;
    const p=room.players.get(ws);
    if(p){p.dead=true;p.groggy=false;}
    room.players.delete(ws);
    if(room.players.size===0){
      clearInterval(room.tick);
      rooms.delete(ws.roomCode);
    }else{
      bcastAll(room,{t:'playerLeft',id:ws.pid});
      const arr=[...room.players.values()];
      const alive=arr.filter(p=>!p.dead&&!p.groggy);
      if(alive.length===0&&arr.length>0){
        bcastAll(room,{t:'over',win:false});
        clearInterval(room.tick);
        rooms.delete(ws.roomCode);
      }
    }
  });
});

const heartbeatInterval=setInterval(()=>{
  wss.clients.forEach(ws=>{
    if(!ws.isAlive){
      if(ws.roomCode)console.log('[heartbeat] 응답없음 종료:',ws.roomCode);
      return ws.terminate();
    }
    ws.isAlive=false;
    try{ws.ping();}catch(e){}
  });
},25000);
wss.on('close',()=>clearInterval(heartbeatInterval));

server.listen(PORT,()=>console.log('Dark Survival Final → http://localhost:'+PORT));
