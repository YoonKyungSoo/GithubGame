// =========================================================
// 6. TELEPATHY (기준 유저, 즉시 결과)
// =========================================================
function initTelepathy(ap){
  const scores={}; ap.forEach(u=>scores[u]=0);
  return withTimer({ phase:'picking', activePlayers:ap, round:1, scores, baseUser: ap[Math.floor(Math.random()*ap.length)], answers:{} });
}
let _lastTpRound=-1;
function renderTelepathy(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  renderScores('tp-scores', s.activePlayers, s.scores);
  if(s.ended) {
    const topUid=(s.activePlayers||[]).reduce((a,b)=>(s.scores[b]||0)>(s.scores[a]||0)?b:a, s.activePlayers[0]);
    const topName=players[topUid]?.name||'';
    q('tp-win').style.display='block'; q('tp-win-text').textContent=`🏆 ${topName} 우승! 텔레파시 종료!`;
    showWinnerModal(`${topName} 우승!`, '텔레파시 게임 종료');
    return;
  }

  const baseName = players[s.baseUser]?.name || '누군가';
  const isBase = s.baseUser === myUid;
  q('tp-base-info').textContent = isBase ? '🎯 당신이 기준! 당신의 선택이 답이 됩니다!' : `🎯 이번 라운드 기준 유저: ${baseName}`;
  q('tp-base-info').style.background = isBase ? 'rgba(255,169,77,.15)' : 'rgba(56,217,169,.1)';
  q('tp-base-info').style.color = isBase ? 'var(--orange)' : 'var(--accent)';

  const optsEl = q('tp-options'); optsEl.innerHTML = '';
  const ra = q('tp-reveal-area'); ra.style.display = 'none';
  const cat = TP_CATS[(s.round-1) % TP_CATS.length];

  // 카테고리 아이콘 크게 표시
  q('tp-cat-name').innerHTML = `<div style="font-size:11px;color:var(--muted);letter-spacing:1px;margin-bottom:6px">라운드 ${s.round}</div><div style="font-size:40px;line-height:1.1">${esc(cat.cat.split(' ')[0])}</div><div style="font-size:14px;font-weight:700;color:var(--accent);margin-top:4px">${esc(cat.cat.split(' ').slice(1).join(' '))}</div>`;

  if(s.phase === 'picking') {
    maybeScheduleTimeout(s, 'tp-'+s.round, ()=>checkTelepathyComplete(true));
    cat.opts.forEach(opt => {
      const b = document.createElement('div'); b.className = 'tp-opt';
      b.innerHTML = `<div style="font-size:15px;font-weight:700">${esc(opt)}</div>`;
      if(s.answers?.[myUid] === opt) b.classList.add('selected');
      if(isActivePl()) b.onclick = () => {
        db.ref(`rooms/${roomId}/game/state/answers/${myUid}`).set(opt).then(checkTelepathyComplete);
      };
      optsEl.appendChild(b);
    });
  } else if(s.phase === 'reveal') {
    ra.style.display = 'block'; ra.innerHTML = '';
    const basePick = s.answers[s.baseUser];
    ra.innerHTML += `<div style="font-size:18px;font-weight:bold;color:var(--accent);margin-bottom:10px;text-align:center">기준 [${baseName}]의 선택: ${basePick||'?'}</div>`;
    
    let html = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';
    (s.activePlayers||[]).forEach(u => {
      if(u === s.baseUser) return;
      const pick = s.answers[u];
      const match = pick === basePick;
      html += `<div class="tp-pick" style="border-color:${match?'var(--accent)':'var(--border)'}">${players[u]?.name}: ${pick||'미입력'} ${match?'✅':''}</div>`;
    });
    ra.innerHTML += html + '</div>';

    if(isHost && _lastTpRound !== s.round + 'reveal') {
      _lastTpRound = s.round + 'reveal';
      setTimeout(() => {
        db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
          if(!cur || cur.phase !== 'reveal' || cur.round !== s.round) return cur;
          if(cur.round >= 5) { return {...cur, phase: 'ended', ended:true}; }
          
          let nextAp = cur.activePlayers;
          if(cur.pendingNextRound) { nextAp = [...new Set([...nextAp, ...Object.keys(cur.pendingNextRound)])]; }
          // 기준 유저 순서대로 순환
          const nextBaseIdx = (nextAp.indexOf(cur.baseUser) + 1) % nextAp.length;
          const nextBase = nextAp[nextBaseIdx] || nextAp[0];
          return resetTimerFields({ ...cur, phase:'picking', round: cur.round+1, activePlayers: nextAp, answers:{}, pendingNextRound:null, baseUser: nextBase });
        });
      }, 3500);
    }
  }
}
function checkTelepathyComplete(force=false){
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase !== 'picking') return cur;
    if(!force && Object.keys(cur.answers||{}).length < cur.activePlayers.length) return cur; // wait
    
    const basePick = cur.answers[cur.baseUser];
    let matchCount = 0;
    cur.activePlayers.forEach(u => { if(u !== cur.baseUser && cur.answers[u] === basePick) matchCount++; });
    
    const ns = Object.assign({}, cur.scores);
    if(matchCount === 0 && basePick) ns[cur.baseUser] = (ns[cur.baseUser]||0) + 5;
    cur.activePlayers.forEach(u => { if(u !== cur.baseUser && cur.answers[u] === basePick) ns[u] = (ns[u]||0) + 5; });
    
    return {...cur, phase: 'reveal', scores: ns, deadline:null};
  });
}

