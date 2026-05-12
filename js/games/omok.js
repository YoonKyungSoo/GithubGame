// =========================================================
// 1. OMOK (팀 교대 지원)
// =========================================================
function startOmokActual(forcePlayers, forceQueue){
  const p = _omokPrep;
  let s = { phase:'playing', mode:p.mode||'solo', board:Array(13).fill(null).map(()=>Array(13).fill(0)), curIdx:0, winner:null, scores:{}, draw:false };
  if(s.mode==='team'){
    s.blackTeam=(p.teamBlack||[]).filter(u=>players[u]?.online);
    s.whiteTeam=(p.teamWhite||[]).filter(u=>players[u]?.online);
    if(s.blackTeam.length<1||s.whiteTeam.length<1){alert('흑팀/백팀에 각각 최소 1명씩 필요합니다.');return;}
    s.bIdx=0; s.wIdx=0; s.activePlayers=[...s.blackTeam,...s.whiteTeam];
    s.queue=forceQueue!=null?forceQueue:(p.teamBench||[]).filter(u=>players[u]?.online);
  } else {
    s.soloOrder=forcePlayers||(p.soloOrder||[]).filter(u=>players[u]?.online);
    s.activePlayers=s.soloOrder.slice(0,2);
    if(s.activePlayers.length!==2){alert('개인전은 정확히 2명이 필요합니다.');return;}
    if(forceQueue!=null) s.queue=forceQueue;
    else { const allOnline=_uidOrder.filter(u=>players[u]?.online); s.queue=allOnline.filter(u=>!s.activePlayers.includes(u)); }
  }
  s.activePlayers.forEach(u=>s.scores[u]=0);
  db.ref(`rooms/${roomId}/game`).set({type:'omok',state:withTimer(s, OMOK_MS)});
}
function omokCanMove(s) {
  if(s.winner) return false;
  if(s.mode === 'team') {
    const isBlack = s.curIdx % 2 === 0;
    const arr = isBlack ? s.blackTeam : s.whiteTeam;
    const idx = isBlack ? s.bIdx : s.wIdx;
    return arr[idx % arr.length] === myUid;
  }
  return s.activePlayers[s.curIdx % 2] === myUid;
}
function renderOmok(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  renderOmokQueue(s);
  const isMe = omokCanMove(s);
  const ti = q('omok-turn');
  if(s.draw){ ti.textContent='🤝 무승부!'; ti.className='turn-ind'; }
  else if(s.winner){ ti.textContent='🏆 승리!'; ti.className='turn-ind'; }
  else if(isMe){ ti.textContent='내 차례! 원하는 곳을 클릭하세요.'; ti.className='turn-ind'; }
  else { ti.textContent='상대 차례 대기중...'; ti.className='turn-ind wait'; }
  // 흑/백 범례
  const lg=q('olegend'); if(lg){
    if(s.mode==='team'){
      const bN=(s.blackTeam||[]).map(u=>players[u]?.name||'').join(', ');
      const wN=(s.whiteTeam||[]).map(u=>players[u]?.name||'').join(', ');
      lg.innerHTML=`<span style="color:var(--text)">⚫ 흑팀: ${esc(bN)}</span><span style="color:var(--muted)">⚪ 백팀: ${esc(wN)}</span>`;
    } else {
      const b=players[s.soloOrder?.[0]||s.activePlayers?.[0]]?.name||'';
      const w=players[s.soloOrder?.[1]||s.activePlayers?.[1]]?.name||'';
      lg.innerHTML=`<span style="color:var(--text)">⚫ 흑: ${esc(b)}</span><span style="color:var(--muted)">⚪ 백: ${esc(w)}</span>`;
    }
  }

  // 승리/무승부 배너
  const winEl=q('omok-win'), winTxt=q('omok-win-text');
  if(winEl){
    if(s.draw){
      winEl.style.display='block'; winTxt.textContent='🤝 무승부! 169칸이 모두 찼습니다.';
      showWinnerModal('무승부!', '169칸이 모두 찼습니다.');
    }
    else if(s.winner){
      winEl.style.display='block';
      const wIdx=s.winner-1;
      const winTeam=s.mode==='team'?(s.winner===1?s.blackTeam:s.whiteTeam):[s.soloOrder?.[wIdx]||s.activePlayers?.[wIdx]];
      const names=(winTeam||[]).map(u=>players[u]?.name||'').filter(Boolean).join(', ');
      winTxt.textContent=`🏆 ${names} 승리!`;
      showWinnerModal(`${names} 승리!`, '오목 3줄 완성');
    } else winEl.style.display='none';
  }

  if(!s.winner&&!s.draw) maybeScheduleTimeout(s,'omok-'+s.curIdx,()=>passOmokTurn());
  const isMobile = window.innerWidth <= 768;
  const cellSize = isMobile ? 26 : 32;
  const bd=q('omok-board'); bd.style.gridTemplateColumns=`repeat(13,${cellSize}px)`; bd.innerHTML='';
  for(let r=0;r<13;r++) for(let c=0;c<13;c++){
    const cell=document.createElement('div'); cell.className='ocell'+(r===0?' edge-top':'')+(r===12?' edge-bottom':'')+(c===0?' edge-left':'')+(c===12?' edge-right':'');
    if(s.board[r][c]>0) cell.innerHTML=`<div class="ostone os${s.board[r][c]-1}"></div>`;
    else if(isMe&&!s.winner&&!s.draw) {
      // 흑돌(curIdx%2===0)인 경우 33 금지 칸 표시
      const stone=(s.curIdx%2===0)?1:2;
      cell.onclick=()=>placeOmok(r,c);
      if(stone===1){
        // 미리 33 체크해서 금지 칸 시각적 표시
        const testBoard=s.board.map(row=>[...row]); testBoard[r][c]=1;
        if(omokIs33(testBoard,r,c)){cell.classList.add('ocell-forbidden'); cell.onclick=()=>{ if(navigator.vibrate)navigator.vibrate([30,20,30]); };}
      }
    }
    bd.appendChild(cell);
  }
}

function renderOmokQueue(s){
  const el=q('omok-queue-panel'); if(!el)return;
  const queue=s.queue||[];
  el.style.display=(queue.length>0||isEndedState(s))?'block':'none';
  const listEl=q('omok-queue-list'); if(!listEl)return;
  if(queue.length===0) listEl.innerHTML='<div style="font-size:11px;color:var(--muted)">대기 중인 플레이어 없음</div>';
  else listEl.innerHTML=queue.map((u,i)=>`<div class="pitem"><div class="dot" style="background:${getPC(u)}"></div><span class="pn">${i+1}위. ${esc(players[u]?.name||'')}</span></div>`).join('');
  const nb=q('omok-next-btn'); if(nb) nb.style.display=isHost&&isEndedState(s)?'block':'none';
}

function startNextOmokRound(){
  if(!isHost||!_currentGame) return;
  const s=_currentGame;
  const queue=[...(s.queue||[])];
  if(s.mode==='solo'){
    const p0=s.soloOrder?.[0]||s.activePlayers?.[0];
    const p1=s.soloOrder?.[1]||s.activePlayers?.[1];
    if(s.draw){
      // 무승부: p0 잔류, p1은 대기열 뒤로, 다음 대기자 투입
      const next=queue.shift(); const newQ=[...queue,p1];
      const newOrder=next?[p0,next]:[p1,p0];
      startOmokActual(newOrder, next?newQ:[]);
    } else {
      const winner=s.winner===1?p0:p1;
      const loser=s.winner===1?p1:p0;
      const next=queue.shift(); const newQ=[...queue,loser];
      // 승자 잔류, 패자 대기열 뒤로, 다음 대기자 투입
      const newOrder=next?[winner,next]:[loser,winner];
      startOmokActual(newOrder, next?newQ:[]);
    }
  } else {
    // 팀전: 패팀 대기열로, 다음 팀 투입
    const winTeam=[...(s.winner===1?s.blackTeam:s.whiteTeam)];
    const loseTeam=[...(s.winner===1?s.whiteTeam:s.blackTeam)];
    const nextTeam=queue.splice(0,loseTeam.length);
    const newQ=[...queue,...loseTeam];
    if(nextTeam.length>0){
      const saved=_omokPrep;
      _omokPrep={..._omokPrep, mode:'team', teamBlack:winTeam, teamWhite:nextTeam, teamBench:newQ};
      startOmokActual(null, newQ);
      _omokPrep=saved;
    } else {
      const saved=_omokPrep;
      _omokPrep={..._omokPrep, mode:'team', teamBlack:loseTeam, teamWhite:winTeam, teamBench:[]};
      startOmokActual(null, []);
      _omokPrep=saved;
    }
  }
}
function passOmokTurn(){
  db.ref(`rooms/${roomId}/game/state`).transaction(s=>{ if(!s||s.winner)return s; s.curIdx++; if(s.mode==='team'){ const stone=((s.curIdx-1)%2===0)?1:2; if(stone===1)s.bIdx++; else s.wIdx++; } return resetTimerFields(s); });
}
// 오목 방향별 연속 수 계산 (정확히 5개만 카운트)
function omokCountLine(board, r, c, stone, dr, dc) {
  let n = 1;
  for(let i=1;i<6;i++){if(board[r+dr*i]?.[c+dc*i]===stone)n++;else break;}
  for(let i=1;i<6;i++){if(board[r-dr*i]?.[c-dc*i]===stone)n++;else break;}
  return n;
}

// 흑돌 33 검사: 돌을 놓은 후 열린 3이 2개 이상인지 확인
function omokIs33(board, r, c) {
  const stone = 1; // 흑돌
  const dirs = [[1,0],[0,1],[1,1],[1,-1]];
  let threeCount = 0;
  const size = board.length;

  for(const [dr,dc] of dirs) {
    // 이 방향 연속 흑돌 수
    let cnt = 1;
    let fi = 1, bi = 1;
    for(;fi<=4;fi++){ if(board[r+dr*fi]?.[c+dc*fi]===stone)cnt++;else break; }
    for(;bi<=4;bi++){ if(board[r-dr*bi]?.[c-dc*bi]===stone)cnt++;else break; }
    if(cnt !== 3) continue;
    // 양 끝이 모두 비어있는지 확인 (열린 3)
    const fr=r+dr*fi, fc=c+dc*fi;
    const br=r-dr*bi, bc=c-dc*bi;
    const frontOpen = fr>=0&&fr<size&&fc>=0&&fc<size&&board[fr][fc]===0;
    const backOpen  = br>=0&&br<size&&bc>=0&&bc<size&&board[br][bc]===0;
    if(frontOpen && backOpen) threeCount++;
  }
  return threeCount >= 2;
}

function placeOmok(r,c) {
  if(navigator.vibrate) navigator.vibrate(30);
  db.ref(`rooms/${roomId}/game/state`).transaction(s => {
    if(!s || s.winner || s.board[r][c]!==0) return s;
    const stone = (s.curIdx % 2 === 0) ? 1 : 2;

    // 흑돌(stone===1) 33 금지 규칙
    // 돌을 임시 배치 후 판정
    s.board[r][c] = stone;
    if(stone === 1 && omokIs33(s.board, r, c)) {
      s.board[r][c] = 0; // 착수 불가 → 원상복구
      return s; // 트랜잭션 abort (아무 변화 없음)
    }

    // 정확히 5목만 승리 (6목 이상은 패배)
    let won = false;
    for(const[dr,dc]of[[1,0],[0,1],[1,1],[1,-1]]){
      const n = omokCountLine(s.board, r, c, stone, dr, dc);
      if(n === 5) won=true;
    }

    if(won){ s.winner=stone; s.ended=true; const winIds=s.mode==='team'?(stone===1?s.blackTeam:s.whiteTeam):[myUid]; winIds.forEach(u=>s.scores[u]=(s.scores[u]||0)+10); }
    else {
      // 무승부 체크: 169칸 모두 채워졌는지 확인
      let boardFull=true;
      outerLoop: for(let rr=0;rr<13;rr++) for(let cc=0;cc<13;cc++) if(s.board[rr][cc]===0){boardFull=false;break outerLoop;}
      if(boardFull){ s.draw=true; s.ended=true; s.deadline=null; return s; }
      s.curIdx++;
      if(s.mode==='team'){ if(stone===1)s.bIdx++;else s.wIdx++; }
    }
    if(!won) resetTimerFields(s);
    return s;
  });
}

