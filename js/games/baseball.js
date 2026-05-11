// =========================================================
// 5. BASEBALL (다인용 숫자야구 - 상대 선택 / 9회 제한)
// =========================================================
function generateSecret(){
  const d=[1,2,3,4,5,6,7,8,9]; for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d.slice(0,3).join('');
}
function checkBB(secret,guess){
  let strikes=0,balls=0;
  for(let i=0;i<3;i++){
    if(guess[i]===secret[i]) strikes++;
    else if(secret.includes(guess[i])) balls++;
  }
  return {strikes,balls,outs:3-strikes-balls,score:strikes*3+balls};
}
function bbReadInput(){
  const d1=q('bb-d1').value,d2=q('bb-d2').value,d3=q('bb-d3').value;
  if(!d1||!d2||!d3) return null;
  const num=String(d1+d2+d3);
  if(!/^[1-9]{3}$/.test(num)){ alert('1~9 숫자만 입력하세요.'); return null; }
  if([...new Set(num)].length<3){ alert('서로 다른 3자리 숫자여야 합니다.'); return null; }
  return num;
}
function bbClearInput(){ ['bb-d1','bb-d2','bb-d3'].forEach(id=>{q(id).value='';}); }
function bbBestWinner(s){
  const active=s.activePlayers||[];
  let best=null;
  (s.guesses||[]).forEach((g,i)=>{
    if(g.timeout) return;
    const cand={uid:g.uid, score:(g.strikes||0)*3+(g.balls||0), strikes:g.strikes||0, balls:g.balls||0, order:i};
    if(!best || cand.score>best.score || (cand.score===best.score && cand.strikes>best.strikes) || (cand.score===best.score && cand.strikes===best.strikes && cand.balls>best.balls)){
      best=cand;
    }
  });
  return best?.uid || active[0];
}
function initBaseball(ap){
  return {phase:'setup', activePlayers:ap, curIdx:0, inning:1, maxInnings:9, secrets:{}, guesses:[], winner:null, scores:Object.fromEntries(ap.map(u=>[u,0]))};
}
function renderBaseball(s){
  hideCommonTimer(); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  // 야구 스코어보드 시각화 (SBO 포함)
  const sbEl=document.getElementById('bb-scoreboard-vis');
  if(sbEl){
    const ap=s.activePlayers||[];
    const guesses=s.guesses||[];
    const lastGuess=guesses.filter(g=>!g.timeout).slice(-1)[0];
    const ls=lastGuess?lastGuess.strikes:0, lb=lastGuess?lastGuess.balls:0, lo=lastGuess?lastGuess.outs:0;
    const innings=s.maxInnings||9;
    let html='<div class="bb-sbo-panel">';
    // 플레이어 점수
    html+=ap.map(u=>`<div style="display:flex;align-items:center;gap:6px;padding:5px 10px;background:var(--bg);border-radius:6px">
      <span style="font-size:10px;color:${getPC(u)};font-weight:bold">${esc(players[u]?.name?.slice(0,4)||'')}</span>
      <span style="font-size:18px;font-weight:bold;color:${getPC(u)}">${s.scores?.[u]||0}<span style="font-size:10px;color:var(--muted)">pt</span></span>
    </div>`).join('');
    // S/B/O
    if(!s.winner&&s.phase==='playing'){
      html+=`<div style="display:flex;gap:10px;margin-left:auto">
        <div class="bb-sbo-group"><div class="bb-sbo-label">S</div><div class="bb-sbo-dots">${[0,1,2].map(i=>`<div class="bb-sbo-dot bb-s-dot${i<ls?' on':''}"></div>`).join('')}</div></div>
        <div class="bb-sbo-group"><div class="bb-sbo-label">B</div><div class="bb-sbo-dots">${[0,1,2,3].map(i=>`<div class="bb-sbo-dot bb-b-dot${i<lb?' on':''}"></div>`).join('')}</div></div>
        <div class="bb-sbo-group"><div class="bb-sbo-label">O</div><div class="bb-sbo-dots">${[0,1,2].map(i=>`<div class="bb-sbo-dot bb-o-dot${i<lo?' on':''}"></div>`).join('')}</div></div>
        <div class="bb-sbo-group"><div class="bb-sbo-label">이닝</div><div style="font-size:18px;font-weight:bold;color:var(--accent)">${s.inning||1}<span style="font-size:11px;color:var(--muted)">/${innings}</span></div></div>
      </div>`;
    }
    html+='</div>';
    sbEl.innerHTML=html;
  }
  const active=(s.activePlayers||[]);
  const ti=q('bb-turn');
  const hasSecret=!!s.secrets?.[myUid];
  const mySecretEl=q('bb-my-secret'); if(mySecretEl) mySecretEl.textContent = s.secrets?.[myUid] ? `내 번호: ${s.secrets[myUid]}` : '';
  const setup=s.phase==='setup';
  const ended=!!s.ended||!!s.winner;
  const isMyTurn=s.phase==='playing' && active[s.curIdx]===myUid && isActivePl();
  const canInput=(setup && isActivePl() && !hasSecret) || isMyTurn;
  const btn=q('bb-submit-btn');
  const targetSel=q('bb-target');
  if(btn) btn.textContent = setup ? '번호 저장' : '추리하기';

  if(targetSel){
    targetSel.style.display = (!setup && !ended && isMyTurn) ? 'block' : 'none';
    targetSel.disabled = !isMyTurn || ended;
    if(!setup){
      const prev=targetSel.value;
      targetSel.innerHTML = active.filter(u=>u!==myUid).map(u=>`<option value="${u}">${esc(players[u]?.name||'상대')}</option>`).join('');
      if(prev && active.includes(prev) && prev!==myUid) targetSel.value=prev;
    }
  }

  if(s.winner){
    const near = (s.guesses||[]).some(g=>!g.timeout && g.strikes===3) ? '3스트라이크' : '9회 종료 · 최고 근접도';
    ti.textContent=`${players[s.winner]?.name||'승자'} 승리! (${near})`; ti.className='turn-ind';
    showWinnerModal(`${players[s.winner]?.name||''}님 승리!`, `숫자야구 ${near}`);
  } else if(setup){
    const done=Object.keys(s.secrets||{}).length;
    ti.textContent=hasSecret?`내 번호 저장 완료 (${done}/${active.length})`:`나만의 번호 3개를 입력해주세요 (${done}/${active.length})`;
    ti.className=hasSecret?'turn-ind wait':'turn-ind';
  } else if(isMyTurn){
    ti.textContent=`${s.inning||1}/${s.maxInnings||9}회 — 맞힐 상대를 선택하고 추리하세요`; ti.className='turn-ind';
  } else {
    ti.textContent=`${s.inning||1}/${s.maxInnings||9}회 — ${players[active[s.curIdx]]?.name||''} 차례...`; ti.className='turn-ind wait';
  }

  ['bb-d1','bb-d2','bb-d3'].forEach(id=>{ const el=q(id); el.disabled=!canInput||ended; if(canInput)setTimeout(()=>q('bb-d1')?.focus(),60); });

  const hist=q('bb-history'); hist.innerHTML='';
  if(setup){
    active.forEach(u=>{
      const row=document.createElement('div'); row.className='bb-row';
      const color=getPC(u);
      row.innerHTML=`<span class="bb-who" style="color:${color}">${esc(players[u]?.name||'')}</span><span class="bb-guess">${s.secrets?.[u]?'🔒 번호등록 완료':'⌛ 번호등록 대기중'}</span><span class="bb-result"></span>`;
      hist.appendChild(row);
    });
    return;
  }
  (s.guesses||[]).slice().reverse().forEach(g=>{
    const row=document.createElement('div'); row.className='bb-row'+(g.strikes===3?' winner':'');
    const color=getPC(g.uid);
    if(g.timeout){
      row.innerHTML=`<span class="bb-who" style="color:${color}">${esc(players[g.uid]?.name||'')}</span><span class="bb-guess">시간초과</span><span class="bb-result">패스</span>`;
    }else{
      const target = g.target ? `→ ${esc(players[g.target]?.name||'상대')}` : '';
      row.innerHTML=`<span class="bb-who" style="color:${color}">${esc(players[g.uid]?.name||'')} ${target}</span><span class="bb-guess">${g.guess}</span><span class="bb-result">${g.strikes}S ${g.balls}B ${g.outs}O</span>`;
    }
    hist.appendChild(row);
  });
}
function baseballAdvanceAfterGuess(s){
  const max=s.maxInnings||9;
  if((s.inning||1)>=max){
    const win=bbBestWinner(s);
    s.winner=win; s.ended=true; s.scores=s.scores||{}; s.scores[win]=(s.scores[win]||0)+10;
    return s;
  }
  s.inning=(s.inning||1)+1;
  s.curIdx=nextTurnIndex(s);
  return s;
}
function baseballTimeout(){
  db.ref(`rooms/${roomId}/game/state`).transaction(s=>{
    if(!s||s.winner)return s;
    if(s.phase==='setup'){
      const active=s.activePlayers||[];
      s.secrets=s.secrets||{};
      active.forEach(u=>{ if(!s.secrets[u]) s.secrets[u]=generateSecret(); });
      s.phase='playing'; s.curIdx=0; s.inning=1; return resetTimerFields(s);
    }
    if(s.phase==='playing') {
      const uid=(s.activePlayers||[])[s.curIdx];
      s.guesses=s.guesses||[]; if(uid) s.guesses.push({uid,timeout:true});
      return baseballAdvanceAfterGuess(s);
    }
    return s;
  });
}
function submitBaseball(){
  const num=bbReadInput(); if(!num)return;
  const target=q('bb-target')?.value;
  db.ref(`rooms/${roomId}/game/state`).transaction(s=>{
    if(!s||s.winner||!isActivePl()) return s;
    const active=s.activePlayers||[];
    if(s.phase==='setup'){
      s.secrets=s.secrets||{};
      if(s.secrets[myUid]) return s;
      s.secrets[myUid]=num;
      if(active.every(u=>s.secrets[u])){ s.phase='playing'; s.curIdx=0; s.inning=1; }
      return s;
    }
    if(s.phase!=='playing' || active[s.curIdx]!==myUid) return s;
    if(!target || target===myUid || !active.includes(target)) return s;
    s.guesses=s.guesses||[]; s.scores=s.scores||{};
    const res=checkBB(s.secrets[target], num);
    s.guesses.push({uid:myUid,target,guess:num,strikes:res.strikes,balls:res.balls,outs:res.outs});
    if(res.strikes===3){
      s.winner=myUid; s.ended=true; s.scores[myUid]=(s.scores[myUid]||0)+10;
    } else {
      baseballAdvanceAfterGuess(s);
    }
    return s;
  }).then(()=>bbClearInput());
}

