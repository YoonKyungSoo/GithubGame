// =========================================================
// 2. MINE SWEEPER
// =========================================================
// 모바일 롱프레스 헬퍼 (500ms 이상 터치 유지 = 깃발 설치)
function addLongPress(el, fn) {
  let timer=null;
  el.addEventListener('touchstart',e=>{
    timer=setTimeout(()=>{ e.preventDefault(); if(navigator.vibrate)navigator.vibrate(40); fn(); timer=null; },500);
  },{passive:true});
  el.addEventListener('touchend',()=>{ if(timer){clearTimeout(timer);timer=null;} });
  el.addEventListener('touchmove',()=>{ if(timer){clearTimeout(timer);timer=null;} });
}

const MINE_ADJ_COLORS=['','#4dabf7','#38d9a9','#ff6b6b','#9775fa','#ffa94d','#74c0fc','#f06595','#adb5bd'];
const MINE_SVG_FLAG=`<svg viewBox="0 0 20 20" width="16" height="16" style="display:block;margin:auto"><rect x="8.5" y="3" width="2" height="13" rx="1" fill="#adb5bd"/><polygon points="10.5,3 18,7 10.5,11" fill="#ff6b6b"/><rect x="5" y="16" width="10" height="2" rx="1" fill="#7f8c8d"/></svg>`;
const MINE_SVG_BOMB=`<svg viewBox="0 0 20 20" width="16" height="16" style="display:block;margin:auto"><circle cx="10" cy="12" r="6" fill="#2d3748"/><rect x="9" y="4" width="2" height="5" rx="1" fill="#718096"/><line x1="5.5" y1="7.5" x2="3.5" y2="5.5" stroke="#718096" stroke-width="1.5" stroke-linecap="round"/><line x1="14.5" y1="7.5" x2="16.5" y2="5.5" stroke="#718096" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="10" r="1.5" fill="#4a5568" opacity="0.7"/></svg>`;
const MINE_SVG_EXPLODE=`<svg viewBox="0 0 20 20" width="16" height="16" style="display:block;margin:auto"><polygon points="10,1 12,7 18,5 14.5,10 19,15 13,13.5 10,19 7,13.5 1,15 5.5,10 2,5 8,7" fill="#ff6b6b"/><circle cx="10" cy="10" r="3" fill="#ffa94d"/><circle cx="10" cy="10" r="1.5" fill="#fff" opacity="0.6"/></svg>`;
const MSIZE=10, MMINES=15; // fallback only
function toggleFlag(){_flagMode=!_flagMode; q('flag-btn').classList.toggle('on',_flagMode);}
function initMine(ap){ const cfg=mineCfg(_minePrep.difficulty); return withTimer({phase:'playing', activePlayers:ap, curIdx:0, board:null, gameOver:false, won:false, revealed:0, difficulty:_minePrep.difficulty||'normal', size:cfg.size, mines:cfg.mines, totalSafe:cfg.size*cfg.size-cfg.mines, scores:Object.fromEntries(ap.map(u=>[u,0]))}); }
function generateMineBoard(sr,sc,size=MSIZE,mines=MMINES){
  const b=Array(size).fill(null).map(()=>Array(size).fill(null).map(()=>({mine:false,revealed:false,flagged:false,adj:0})));
  let p=0; while(p<mines){const r=Math.floor(Math.random()*size),c=Math.floor(Math.random()*size); if(b[r][c].mine||Math.abs(r-sr)<=1&&Math.abs(c-sc)<=1)continue; b[r][c].mine=true;p++;}
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){if(b[r][c].mine)continue; let cnt=0;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(b[r+dr]?.[c+dc]?.mine)cnt++;} b[r][c].adj=cnt;}
  return b;
}
function floodReveal(b,r,c){
  const size=b.length; if(r<0||r>=size||c<0||c>=size)return 0; const cell=b[r][c]; if(cell.revealed||cell.mine||cell.flagged)return 0;
  cell.revealed=true; let cnt=1;
  if(cell.adj===0)for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)cnt+=floodReveal(b,r+dr,c+dc);
  return cnt;
}
function renderMine(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  const isMe=s.activePlayers[s.curIdx]===myUid&&isActivePl();
  const ti=q('mine-turn');
  if(s.won){ti.textContent='전원 클리어! 🎉';ti.className='turn-ind'; showWinnerModal('지뢰 제거 성공!', '모든 칸을 안전하게 열었습니다 🎊');}
  else if(s.gameOver){ti.textContent='💥 지뢰 폭발!';ti.className='turn-ind'; showWinnerModal('💥 지뢰 폭발!', '아쉽지만 지뢰를 밟았습니다.');}
  else if(isMe){ti.textContent='내 차례 — 한 번 열기!';ti.className='turn-ind';}
  else{ti.textContent=(players[s.activePlayers[s.curIdx]]?.name||'')+' 차례 대기중...';ti.className='turn-ind wait';}
  q('mine-count').textContent=s.mines||MMINES; q('mine-cleared').textContent=s.revealed||0;
  
  const size=s.size||MSIZE; const bd=q('mine-board');
  const mineCellSize = window.innerWidth<=768 ? Math.floor((window.innerWidth-80)/size) : 32;
  bd.style.gridTemplateColumns=`repeat(${size},${Math.min(32,mineCellSize)}px)`; bd.innerHTML='';
  const canAct=isMe&&!s.gameOver&&!s.won;
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){
    const cell=document.createElement('div'); cell.className='mcell'; const data=s.board?.[r]?.[c];
    if(!data){ if(canAct){cell.onclick=()=>commitMineReveal(r,c); cell.oncontextmenu=e=>{e.preventDefault();flagMineCellTx(r,c);}; addLongPress(cell,()=>flagMineCellTx(r,c));} }
    else if(data.revealed){ cell.classList.add('revealed'); if(data.mine){cell.classList.add('mmine');cell.innerHTML=MINE_SVG_EXPLODE;}else if(data.adj>0){cell.textContent=data.adj;cell.style.color=MINE_ADJ_COLORS[data.adj]||'#4dabf7';} }
    else if(data.flagged){ cell.classList.add('mflagged'); cell.innerHTML=MINE_SVG_FLAG; if(canAct){cell.onclick=()=>flagMineCellTx(r,c); addLongPress(cell,()=>flagMineCellTx(r,c));} }
    else {
      if(s.gameOver&&data.mine){cell.innerHTML=MINE_SVG_BOMB;}
      if(canAct){cell.onclick=()=>_flagMode?flagMineCellTx(r,c):commitMineReveal(r,c); cell.oncontextmenu=e=>{e.preventDefault();flagMineCellTx(r,c);}; addLongPress(cell,()=>flagMineCellTx(r,c));}
    }
    bd.appendChild(cell);
  }
}
function passMineTurn(){ db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{ if(!cur||cur.gameOver||cur.won)return cur; cur.curIdx=nextTurnIndex(cur); return resetTimerFields(cur); }); }
function commitMineReveal(r,c){
  db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
    if(!cur||cur.gameOver||cur.won||cur.activePlayers[cur.curIdx]!==myUid)return cur;
    let board=cur.board; let revealed=cur.revealed||0;
    if(!board) { board=generateMineBoard(r,c,cur.size||MSIZE,cur.mines||MMINES); }
    const cell=board[r][c]; if(cell.revealed||cell.flagged)return cur;
    if(cell.mine){ cell.revealed=true; cur.scores=cur.scores||{}; cur.scores[myUid]=(cur.scores[myUid]||0)-5; return{...cur,board,gameOver:true,ended:true,curIdx:nextTurnIndex(cur)}; }
    revealed+=floodReveal(board,r,c);
    const won=revealed>=cur.totalSafe;
    cur.scores=cur.scores||{}; cur.scores[myUid]=(cur.scores[myUid]||0)+Math.max(1,revealed-(cur.revealed||0)); return resetTimerFields({...cur,board,revealed,won,ended:won,curIdx:won?cur.curIdx:nextTurnIndex(cur)});
  });
}
function flagMineCellTx(r,c){
  db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
    if(!cur||cur.gameOver||cur.won||!cur.board||cur.activePlayers[cur.curIdx]!==myUid)return cur;
    if(cur.board[r][c].revealed)return cur;
    cur.board[r][c].flagged=!cur.board[r][c].flagged; return cur;
  });
}

