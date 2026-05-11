// =========================================================
// 7. RPS (가위바위보 즉시 공개)
// =========================================================
function initRPS(ap){
  const scores={}; ap.forEach(u=>scores[u]=0);
  return withTimer({ phase:'picking', activePlayers:ap, round:1, maxRounds:_rpsPrep.rounds||5, scores, answers:{} });
}
let _lastRpsRound=-1;
function renderRPS(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  renderScores('rps-scores', s.activePlayers, s.scores);
  const maxR = s.maxRounds||5;
  q('rps-round').textContent = `라운드 ${s.round} / ${maxR}`;
  if(s.ended){
    const topUid=(s.activePlayers||[]).reduce((a,b)=>(s.scores[b]||0)>(s.scores[a]||0)?b:a, s.activePlayers[0]);
    const topName=players[topUid]?.name||'';
    q('rps-win').style.display='block'; q('rps-win-text').textContent=`🏆 ${topName} 우승! 가위바위보 종료!`;
    showWinnerModal(`${topName} 우승!`, `가위바위보 ${maxR}라운드 종료`);
    return;
  }
  
  const rv = q('rps-reveal-area'); rv.innerHTML='';

  if(s.phase === 'picking') {
    maybeScheduleTimeout(s, 'rps-'+s.round, ()=>finishRPS(true));
    ['rock','scissors','paper'].forEach((c,i) => {
       const el = q('rps-btns').children[i];
       el.className = 'rps-btn' + (s.answers?.[myUid]===c ? ' selected':'');
    });
  } else if(s.phase === 'reveal') {
    const EMO = {rock:'✊', scissors:'✌️', paper:'🖐️'};
    s.activePlayers.forEach(u => {
      rv.innerHTML += `<div style="text-align:center;padding:10px;background:var(--card);border:1px solid ${getPC(u)};border-radius:6px">
        <div style="font-size:30px">${EMO[s.answers[u]]||'?'}</div><div style="font-size:10px;color:${getPC(u)}">${players[u]?.name}</div></div>`;
    });
    
    if(isHost && _lastRpsRound !== s.round + 'reveal') {
      _lastRpsRound = s.round + 'reveal';
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
function finishRPS(force=false){
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase !== 'picking') return cur;
    if(!force && Object.keys(cur.answers||{}).length < cur.activePlayers.length) return cur;
    const rpsWin = (a,b) => { if(!a||!b||a===b)return 0; if((a==='rock'&&b==='scissors')||(a==='scissors'&&b==='paper')||(a==='paper'&&b==='rock'))return 1; return -1; };
    const ns = Object.assign({}, cur.scores);
    cur.activePlayers.forEach(u => { let wins=0; cur.activePlayers.forEach(u2 => { if(u!==u2 && rpsWin(cur.answers?.[u], cur.answers?.[u2])===1) wins++; }); ns[u]=(ns[u]||0)+(wins*5); });
    return {...cur, phase:'reveal', scores:ns, deadline:null};
  });
}
function pickRPS(c) {
  if(!isActivePl() || _currentGame?.phase !== 'picking') return;
  db.ref(`rooms/${roomId}/game/state/answers/${myUid}`).set(c).then(() => {
    finishRPS(false);
  });
}

