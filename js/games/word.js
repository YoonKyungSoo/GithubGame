// =========================================================
// 3. WORD CHAIN (끝말잇기)
// =========================================================
function initWord(ap){
  const scores={}; ap.forEach(u=>scores[u]=0);
  return withTimer({phase:'playing', activePlayers:ap, curIdx:0, scores, curWord:'사과', lastChar:'과', used:['사과'], hist:[], gameOver:false});
}
function renderWord(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  const isMe=s.activePlayers[s.curIdx]===myUid&&isActivePl();
  const ti=q('word-turn'); ti.textContent=isMe?'내 차례! 단어 입력!':(players[s.activePlayers[s.curIdx]]?.name||'')+'의 차례...'; ti.className='turn-ind'+(isMe?'':' wait');
  const cw=q('cword');
  if(s.curWord){const body=s.curWord.slice(0,-1),last=s.curWord.slice(-1); cw.innerHTML=esc(body)+`<span style="color:#ffa94d;text-shadow:0 0 8px rgba(255,169,77,.5)">${esc(last)}</span>`;}
  else cw.textContent='-';
  q('nchar').innerHTML=`<svg width="12" height="12" viewBox="0 0 12 12" style="margin-right:4px;vertical-align:middle"><polygon points="2,6 9,2 9,10" fill="#ffa94d"/></svg><span style="color:#ffa94d;font-weight:700">"${esc(s.lastChar)}"</span><span>(으)로 시작하는 단어</span>`;
  q('winput-area').style.display=isMe&&!s.gameOver?'flex':'none'; if(isMe&&!s.gameOver)q('winput')?.focus();

  const wh=q('whist'); wh.innerHTML='';
  (s.hist||[]).forEach((item,idx)=>{
    if(idx>0){const arr=document.createElement('div'); arr.style.cssText='color:var(--muted);font-size:10px;display:flex;align-items:center;flex-shrink:0'; arr.textContent='→'; wh.appendChild(arr);}
    const chip=document.createElement('div'); chip.className='wchip';
    const color=getPC(item.uid); chip.style.cssText=`border-color:${color};color:${color}`;
    const body=item.word.slice(0,-1),last=item.word.slice(-1);
    chip.innerHTML=esc(body)+`<span style="font-weight:900;text-decoration:underline">${esc(last)}</span>`;
    wh.appendChild(chip);
  });
  wh.scrollTop=wh.scrollHeight;
  renderScores('word-scores', s.activePlayers, s.scores);
  maybeScheduleTimeout(s, 'word-'+s.curIdx, ()=>passWordTurn());
  if(s.gameOver){
    q('word-win').style.display='block'; q('word-win-text').textContent='끝말잇기 종료!';
    const topUid=(s.activePlayers||[]).reduce((a,b)=>(s.scores[b]||0)>(s.scores[a]||0)?b:a, s.activePlayers[0]);
    showWinnerModal(`${players[topUid]?.name||''}님 우승!`, '끝말잇기 종료');
  } else q('word-win').style.display='none';
}
function passWordTurn(){ db.ref(`rooms/${roomId}/game/state`).transaction(s=>{ if(!s||s.gameOver)return s; s.scores=s.scores||{}; const u=s.activePlayers[s.curIdx]; s.scores[u]=(s.scores[u]||0)-1; s.curIdx=nextTurnIndex(s); return resetTimerFields(s); }); }
function submitWord(){
  const inp=q('winput'); const word=inp.value.trim(); if(!word)return;
  if(!isHangulWord2(word)){alert('한글 2~15자만 가능합니다.');return;}
  const s=_currentGame; if(!s||!isActivePl())return;
  if(s.activePlayers[s.curIdx]!==myUid){return;}
  if(word[0]!==s.lastChar){alert(`"${s.lastChar}"(으)로 시작해야 합니다!`);return;}
  if((s.used||[]).includes(word)){alert('이미 사용된 단어입니다!');return;}
  inp.value='';
  db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
    if(!cur||cur.gameOver)return cur;
    if(cur.activePlayers[cur.curIdx]!==myUid)return cur;
    if(word[0]!==cur.lastChar)return cur;
    if((cur.used||[]).includes(word))return cur;
    cur.scores=cur.scores||{}; cur.scores[myUid]=(cur.scores[myUid]||0)+word.length;
    cur.used=[...(cur.used||[]),word];
    cur.hist=[...(cur.hist||[]),{uid:myUid,word}];
    cur.curWord=word; cur.lastChar=word[word.length-1];
    cur.curIdx=(cur.curIdx+1)%cur.activePlayers.length;
    cur.gameOver=cur.used.length>=20; cur.ended=cur.gameOver;
    return resetTimerFields(cur);
  });
}

