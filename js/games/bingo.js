// =========================================================
// 11. BINGO (직접 빙고판 작성 → 순서대로 숫자 선언 → 3줄 승리)
// =========================================================
let _bingoSetupLocal = new Array(25).fill(0);

function _genBingoBoard(){
  const n=Array.from({length:25},(_,i)=>i+1);
  for(let i=24;i>0;i--){const j=Math.floor(Math.random()*(i+1));[n[i],n[j]]=[n[j],n[i]];}
  return [n.slice(0,5),n.slice(5,10),n.slice(10,15),n.slice(15,20),n.slice(20,25)];
}
function _getBingoLines(board,called){
  const lines=[];
  for(let i=0;i<5;i++){
    if(board[i].every(n=>called.includes(n))) lines.push('r'+i);
    if([0,1,2,3,4].map(r=>board[r][i]).every(n=>called.includes(n))) lines.push('c'+i);
  }
  if([0,1,2,3,4].every(i=>called.includes(board[i][i]))) lines.push('d0');
  if([0,1,2,3,4].every(i=>called.includes(board[i][4-i]))) lines.push('d1');
  return lines;
}
function initBingo(ap){
  const scores={},bingoCounts={};
  ap.forEach(u=>{scores[u]=0;bingoCounts[u]=0;});
  _bingoSetupLocal = new Array(25).fill(0);
  return {phase:'setup', activePlayers:ap, setupBoards:{}, called:[], bingoCounts, scores, winner:null, ended:false, durationMs:BINGO_SETUP_MS, deadline:Date.now()+BINGO_SETUP_MS};
}

// 빙고 로컬 판 설정 함수들
function bingoSetupClickNum(n){
  if(_bingoSetupLocal.includes(n)) return; // 이미 사용
  const idx=_bingoSetupLocal.indexOf(0); if(idx<0) return;
  _bingoSetupLocal[idx]=n; renderBingoSetupLocal();
}
function bingoSetupClickCell(idx){
  if(_bingoSetupLocal[idx]===0) return;
  _bingoSetupLocal[idx]=0;
  // 빈 칸을 채운 칸들 뒤로 밀기
  const filled=_bingoSetupLocal.filter(x=>x>0);
  const empty=_bingoSetupLocal.filter(x=>x===0);
  _bingoSetupLocal=[...filled,...empty];
  renderBingoSetupLocal();
}
function bingoSetupReset(){
  _bingoSetupLocal=new Array(25).fill(0); renderBingoSetupLocal();
}
function renderBingoSetupLocal(){
  const isMobile = window.innerWidth <= 768;
  const cellSize = isMobile ? 44 : 52;
  const grid=q('bingo-setup-grid'); if(!grid) return;
  grid.style.gridTemplateColumns=`repeat(5,${cellSize}px)`;
  grid.innerHTML=_bingoSetupLocal.map((n,i)=>`<div class="bsetup-cell ${n>0?'filled':'empty'}" onclick="bingoSetupClickCell(${i})">${n>0?n:''}</div>`).join('');
  const numpad=q('bingo-setup-numpad'); if(!numpad) return;
  const numSize = isMobile ? 34 : 38;
  numpad.style.gridTemplateColumns=`repeat(5,${numSize}px)`;
  numpad.innerHTML=Array.from({length:25},(_,i)=>i+1).map(n=>{
    const used=_bingoSetupLocal.includes(n);
    return `<div class="bsetup-num ${used?'used':''}" onclick="${used?'':'bingoSetupClickNum('+n+')'}">${n}</div>`;
  }).join('');
  const full=!_bingoSetupLocal.includes(0);
  const btn=q('bingo-submit-btn'); if(btn) btn.disabled=!full;
}
function submitBingoSetup(){
  if(_bingoSetupLocal.includes(0)){ return; }
  const board=[_bingoSetupLocal.slice(0,5),_bingoSetupLocal.slice(5,10),_bingoSetupLocal.slice(10,15),_bingoSetupLocal.slice(15,20),_bingoSetupLocal.slice(20,25)];
  db.ref(`rooms/${roomId}/game/state/setupBoards/${myUid}`).set(board).then(()=>{
    db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
      if(!cur||cur.phase!=='setup') return cur;
      if(!cur.setupBoards||!cur.activePlayers.every(u=>cur.setupBoards[u])) return cur;
      const boards={};
      cur.activePlayers.forEach(u=>boards[u]=cur.setupBoards[u]);
      return {...cur, phase:'playing', boards, curIdx:0, called:[], bingoCounts:{...cur.bingoCounts}, durationMs:BINGO_TURN_MS, deadline:Date.now()+BINGO_TURN_MS};
    });
  });
}

function renderBingo(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);

  if(s.phase==='setup'){
    q('bingo-setup-section').classList.add('active');
    q('bingo-game-section').classList.remove('active');
    renderBingoSetupLocal();
    const submittedMe=!!(s.setupBoards?.[myUid]);
    const submitBtn=q('bingo-submit-btn');
    if(submitBtn){ submitBtn.disabled=submittedMe||_bingoSetupLocal.includes(0); submitBtn.textContent=submittedMe?'저장 완료 ✅':'저장 완료'; }
    // 제출 상황 보여주기
    const readyEl=q('bingo-setup-ready'); if(readyEl){
      readyEl.innerHTML=(s.activePlayers||[]).map(u=>{
        const done=!!(s.setupBoards?.[u]);
        return `<div style="padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid ${done?'var(--accent)':'var(--border)'};color:${done?'var(--accent)':'var(--muted)'}">${esc(players[u]?.name?.slice(0,6)||'')} ${done?'✅':'⌛'}</div>`;
      }).join('');
    }
    const statusEl=q('bingo-setup-status'); if(statusEl){
      const cnt=Object.keys(s.setupBoards||{}).length;
      statusEl.textContent=submittedMe?`저장 완료! 대기 중... (${cnt}/${s.activePlayers.length}명)`:'나만의 빙고판을 완성하세요!';
    }
    // 타임아웃: 시간 초과 시 미제출자 랜덤 배정
    maybeScheduleTimeout(s,'bingo-setup',()=>{
      db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
        if(!cur||cur.phase!=='setup') return cur;
        const boards=cur.setupBoards||{};
        cur.activePlayers.forEach(u=>{ if(!boards[u]) boards[u]=_genBingoBoard(); });
        return {...cur, phase:'playing', boards, curIdx:0, called:[], durationMs:BINGO_TURN_MS, deadline:Date.now()+BINGO_TURN_MS};
      });
    });
    return;
  }

  q('bingo-setup-section').classList.remove('active');
  q('bingo-game-section').classList.add('active');

  const called=s.called||[];
  const _bsp=q('bingo-status');
  if(_bsp) _bsp.innerHTML=(s.activePlayers||[]).map(u=>{
    const bd=s.boards?.[u]; const cnt=bd?_getBingoLines(bd,called).length:0; const isMe=u===myUid;
    return `<div style="display:flex;align-items:center;gap:5px;padding:5px 11px;background:${isMe?'rgba(56,217,169,.12)':'var(--card)'};border:1px solid ${isMe?'var(--accent)':'var(--border)'};border-radius:20px;font-size:11px">
      <span style="color:${getPC(u)};font-weight:bold">${esc(players[u]?.name?.slice(0,5)||'')}</span>
      ${[0,1,2].map(i=>`<div class="bingo-dot${i<cnt?' won':''}"></div>`).join('')}
      <span style="color:var(--muted);font-size:10px">${cnt}/3</span>
    </div>`;
  }).join('');

  const isMyTurn=s.activePlayers[s.curIdx]===myUid&&isActivePl();
  const ti=q('bingo-turn');
  if(s.winner){ ti.textContent=`🎉 ${players[s.winner]?.name||''}님 3빙고!`; ti.className='turn-ind'; }
  else if(isMyTurn){ ti.textContent='🎯 내 차례! 숫자를 선언하세요'; ti.className='turn-ind'; }
  else { ti.textContent=`${players[s.activePlayers[s.curIdx]]?.name||''} 차례...`; ti.className='turn-ind wait'; }

  const myBoard=s.boards?.[myUid];
  if(myBoard){
    const lines=_getBingoLines(myBoard,called);
    const cnt=lines.length;
    const ctr=q('bingo-counter');
    if(ctr) ctr.innerHTML=`빙고: ${[0,1,2].map(i=>`<div class="bingo-dot${i<cnt?' won':''}"></div>`).join('')}<span style="font-size:12px;color:var(--muted);margin-left:4px">${cnt}/3줄</span>`;
    const mb=q('bingo-myboard');
    if(mb) mb.innerHTML=myBoard.map((row,ri)=>row.map((num,ci)=>{
      const mk=called.includes(num);
      const inL=lines.some(l=>(l==='r'+ri)||(l==='c'+ci)||(l==='d0'&&ri===ci)||(l==='d1'&&ri===4-ci));
      const ring=mk?`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 46 46"><circle cx="23" cy="23" r="19" fill="none" stroke="${inL?'#38d9a9':'rgba(56,217,169,0.55)'}" stroke-width="${inL?3.5:2}" stroke-linecap="round"/></svg>`:'';
      return `<div class="bcell${mk?' marked':''}${inL?' bline':''}" style="position:relative">${num}${ring}</div>`;
    }).join('')).join('');
  }

  const calledEl=q('bingo-called');
  if(calledEl) calledEl.innerHTML=called.map(n=>`<div class="bcalled-chip">${n}</div>`).join('');
  const ccEl=q('bingo-called-count'); if(ccEl) ccEl.textContent=called.length;

  const np=q('bingo-numpad');
  if(np){
    np.style.display=(isMyTurn&&!s.winner)?'grid':'none';
    np.innerHTML=Array.from({length:25},(_,i)=>i+1).map(n=>{
      const isCalled=called.includes(n);
      return `<button class="bnum-btn${isCalled?' bcalled':''}" onclick="callBingo(${n})" ${isCalled||!isMyTurn?'disabled':''}>${n}</button>`;
    }).join('');
  }

  const othersEl=q('bingo-others');
  if(othersEl){
    if(isEndedState(s)){
      othersEl.innerHTML=(s.activePlayers||[]).filter(u=>u!==myUid).map(u=>{
        const bd=s.boards?.[u]; if(!bd) return '';
        const ls=_getBingoLines(bd,called);
        return `<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px">
          <div style="font-size:11px;color:${getPC(u)};font-weight:bold;margin-bottom:6px">${esc(players[u]?.name||'')} (${ls.length}줄)</div>
          <div style="display:grid;grid-template-columns:repeat(5,32px);gap:2px">
            ${bd.map((row,ri)=>row.map((num,ci)=>{
              const mk=called.includes(num);
              const il=ls.some(l=>(l==='r'+ri)||(l==='c'+ci)||(l==='d0'&&ri===ci)||(l==='d1'&&ri===4-ci));
              const ring2=mk?`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="none" stroke="${il?'#38d9a9':'rgba(56,217,169,0.55)'}" stroke-width="${il?2.5:1.5}"/></svg>`:'';
              return `<div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border-radius:3px;border:1px solid ${mk?'var(--accent)':'var(--border)'};background:${il?'rgba(56,217,169,.3)':mk?'rgba(56,217,169,.1)':'var(--bg)'};color:${mk?'var(--accent)':'var(--muted)'}">${num}${ring2}</div>`;
            }).join('')).join('')}
          </div>
        </div>`;
      }).join('');
    } else othersEl.innerHTML='';
  }

  renderScores('bingo-scores',s.activePlayers,s.scores);
  const we=q('bingo-win');
  if(we){
    if(s.winner){
      we.style.display='block'; q('bingo-win-text').textContent=`🎉 ${players[s.winner]?.name||''}님 3줄 빙고! 승리!`;
      showWinnerModal(`${players[s.winner]?.name||''}님 빙고!`, '3줄 빙고 완성 승리! 🎯');
      if(navigator.vibrate) navigator.vibrate([200,80,200,80,300]);
    }
    else we.style.display='none';
  }
  maybeScheduleTimeout(s,'bingo-'+s.curIdx,()=>passBingoTurn());
}
function passBingoTurn(){
  db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
    if(!cur||cur.ended) return cur;
    cur.curIdx=nextTurnIndex(cur); return resetTimerFields(cur);
  });
}
function callBingo(num){
  if(!isActivePl()||!_currentGame||(_currentGame.phase!=='playing'&&_currentGame.phase!=='setup')) return;
  if((_currentGame.called||[]).includes(num)) return;
  db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
    if(!cur||cur.ended||cur.activePlayers[cur.curIdx]!==myUid) return cur;
    const called=[...(cur.called||[]),num];
    cur.called=called;
    const bc={};
    let winner=null;
    (cur.activePlayers||[]).forEach(u=>{
      const bd=cur.boards?.[u]; if(!bd) return;
      const ln=_getBingoLines(bd,called);
      bc[u]=ln.length;
      if(ln.length>=3&&!winner) winner=u;
    });
    cur.bingoCounts=bc;
    if(winner){
      cur.winner=winner; cur.ended=true; cur.phase='ended'; cur.deadline=null;
      cur.scores=cur.scores||{}; cur.scores[winner]=(cur.scores[winner]||0)+20;
    } else { cur.curIdx=nextTurnIndex(cur); resetTimerFields(cur); }
    return cur;
  });
}

