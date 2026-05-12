// =========================================================
// 4. CHOSUNG (초성게임)
// =========================================================
function initChosung(ap){
  const words=[...CHOSUNG_DB].sort(()=>Math.random()-.5).slice(0,8);
  const scores={}; ap.forEach(u=>scores[u]=0);
  return withTimer({phase:'guessing', activePlayers:ap, round:0, words, correctOrder:[], scores, ended:false});
}
function renderChosung(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  renderScores('cho-scores', s.activePlayers, s.scores);
  if(s.ended){
    q('cho-win').style.display='block'; q('cho-win-text').textContent='초성게임 종료!';
    const topUid=(s.activePlayers||[]).reduce((a,b)=>(s.scores[b]||0)>(s.scores[a]||0)?b:a, s.activePlayers[0]);
    showWinnerModal(`${players[topUid]?.name||''}님 우승!`, '초성게임 종료');
    q('cho-input-area').style.display='none'; return;
  }
  
  const word = s.words[s.round];
  q('cho-hint').textContent = `[${s.round+1}/${s.words.length}] 힌트: ${word.hint}`;
  q('cho-chars').textContent = s.phase==='reveal' ? word.word : getChosung(word.word);
  q('cho-input-area').style.display = s.phase==='guessing'&&isActivePl() ? 'flex':'none';

  // 정답 피드백: 맞힌 사람에게는 즉시 정답 단어를 보여주고,
  // 다른 사람에게는 정답자 수만 보여줘서 남은 유저가 계속 풀 수 있게 유지
  const fb = q('cho-feedback');
  const correctOrder = s.correctOrder || [];
  if(s.phase === 'reveal') {
    fb.style.color = 'var(--accent)';
    fb.textContent = `✅ 정답: ${word.word}`;
  } else if(correctOrder.includes(myUid)) {
    fb.style.color = 'var(--accent)';
    fb.textContent = `✅ 정답입니다! 정답: ${word.word}`;
  } else if(correctOrder.length > 0) {
    fb.style.color = 'var(--accent)';
    fb.textContent = `✅ ${correctOrder.length}명 정답! 계속 도전하세요.`;
  } else {
    fb.style.color = 'var(--red)';
    fb.textContent = '';
  }
  
  if(s.phase==='guessing') maybeScheduleTimeout(s, 'cho-'+s.round, ()=>timeoutChosung());
  if(s.phase==='reveal'){
    q('cho-timer').textContent='정답 공개!';
    if(isHost) setTimeout(()=>{
      db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
        if(!cur || cur.phase!=='reveal' || cur.round!==s.round) return cur;
        const next=cur.round+1; if(next>=cur.words.length) return{...cur,ended:true};
        return resetTimerFields({...cur, round:next, phase:'guessing', correctOrder:[]});
      });
    }, 2500);
  }
}
function timeoutChosung(){ db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{ if(!cur||cur.phase!=='guessing')return cur; const pts=[5,3,1]; const ns=Object.assign({},cur.scores); (cur.correctOrder||[]).forEach((u,i)=>{ ns[u]=(ns[u]||0)+(pts[i]||0); }); return {...cur,phase:'reveal',scores:ns,deadline:null}; }); }
function submitChosung(){
  const inp=q('cho-input'); const answer=inp.value.trim(); if(!answer)return;
  const s=_currentGame; if(!s||s.phase!=='guessing'||!isActivePl())return;
  if((s.correctOrder||[]).includes(myUid)){inp.value='';return;}
  if(answer!==s.words[s.round].word){ q('cho-feedback').style.color='var(--red)'; q('cho-feedback').textContent='❌ 틀렸습니다!'; inp.value=''; setTimeout(()=>{ if(q('cho-feedback').textContent==='❌ 틀렸습니다!') q('cho-feedback').textContent=''; },900); return; }
  q('cho-feedback').style.color='var(--accent)';
  q('cho-feedback').textContent=`✅ 정답입니다! 정답: ${s.words[s.round].word}`;
  if(navigator.vibrate) navigator.vibrate([80,30,80]);
  inp.value='';
  db.ref(`rooms/${roomId}/game/state/correctOrder`).transaction(order=>{
    let ord = order||[]; if(!ord.includes(myUid)) ord=[...ord,myUid]; return ord;
  }).then(tx=>{
    const ord=tx.snapshot.val();
    if(ord.length >= s.activePlayers.length) {
      db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
        if(!cur||cur.phase!=='guessing')return cur;
        const pts=[5,3,1]; const ns=Object.assign({},cur.scores);
        (cur.correctOrder||[]).forEach((u,i)=>{ ns[u]=(ns[u]||0)+(pts[i]||0); });
        return {...cur, phase:'reveal', scores:ns, deadline:null};
      });
    }
  });
}

