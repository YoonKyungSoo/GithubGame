// =========================================================
// 10. OX QUIZ (무한 생존, 전체 라운드)
// =========================================================
function initOX(ap){
  const scores={}; ap.forEach(u=>scores[u]=0);
  return withTimer({ phase:'picking', activePlayers:ap, round:1, maxRounds:_oxPrep.rounds||5, scores, answers:{} });
}
let _lastOxRound=-1;
function renderOX(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  renderScores('ox-scores', s.activePlayers, s.scores);
  const maxR = s.maxRounds||5;
  if(s.ended){
    const topUid=(s.activePlayers||[]).reduce((a,b)=>(s.scores[b]||0)>(s.scores[a]||0)?b:a, s.activePlayers[0]);
    const topName=players[topUid]?.name||'';
    q('ox-win').style.display='block'; q('ox-win-text').textContent=`🏆 ${topName} 우승! OX 퀴즈 종료!`;
    showWinnerModal(`${topName} 우승!`, `OX 퀴즈 ${maxR}라운드 종료`);
    return;
  }
  const qdata = OX_Q[(s.round-1) % OX_Q.length];
  q('ox-qtxt').textContent = `Q${s.round}/${maxR}. ${qdata.q}`;
  
  const rv = q('ox-reveal-area'); rv.innerHTML='';
  ['ox-o','ox-x'].forEach(id=>{q(id).className='ox-btn'; q(id).style.borderColor='var(--border)';});

  if(s.phase === 'picking') {
    maybeScheduleTimeout(s, 'ox-'+s.round, ()=>finishOX(true));
    if(s.answers?.[myUid]) q(s.answers[myUid]==='O'?'ox-o':'ox-x').classList.add('picked');
  } else if(s.phase === 'reveal') {
    q(qdata.a==='O'?'ox-o':'ox-x').style.borderColor = 'var(--accent)';
    
    s.activePlayers.forEach(u => {
      const pick = s.answers[u]; const match = pick === qdata.a;
      rv.innerHTML += `<div style="padding:6px 12px;border-radius:4px;border:1px solid ${match?'var(--accent)':'var(--red)'};color:${match?'var(--accent)':'var(--red)'}">${players[u]?.name}: ${pick||'미입력'}</div>`;
    });
    
    if(isHost && _lastOxRound !== s.round + 'reveal') {
      _lastOxRound = s.round + 'reveal';
      setTimeout(() => {
        db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
          if(!cur || cur.phase !== 'reveal' || cur.round !== s.round) return cur;
          if(cur.round >= (cur.maxRounds||5)) { return {...cur, phase: 'ended', ended:true}; }
          
          let nextAp = cur.activePlayers;
          if(cur.pendingNextRound) nextAp = [...new Set([...nextAp, ...Object.keys(cur.pendingNextRound)])];
          return resetTimerFields({ ...cur, phase:'picking', round: cur.round+1, activePlayers: nextAp, answers:{}, pendingNextRound:null });
        });
      }, 3000);
    }
  }
}
function finishOX(force=false){ db.ref(`rooms/${roomId}/game/state`).transaction(cur => { if(!cur||cur.phase!=='picking')return cur; if(!force && Object.keys(cur.answers||{}).length < cur.activePlayers.length)return cur; const qdata=OX_Q[(cur.round-1)%OX_Q.length]; const ns=Object.assign({},cur.scores); cur.activePlayers.forEach(u=>{ if(cur.answers?.[u]===qdata.a) ns[u]=(ns[u]||0)+5; }); return {...cur, phase:'reveal', scores:ns, deadline:null}; }); }
function answerOX(c) {
  if(!isActivePl() || _currentGame?.phase !== 'picking') return;
  db.ref(`rooms/${roomId}/game/state/answers/${myUid}`).set(c).then(() => {
    finishOX(false);
  });
}

