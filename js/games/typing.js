// =========================================================
// 8. TYPING (타이핑 경주)
// =========================================================
function initTyping(ap){
  const scores={}; ap.forEach(u=>scores[u]=0);
  return withTimer({phase:'typing', activePlayers:ap, round:1, texts:TYPING_TEXTS, submissions:[], scores, ended:false}, TYPING_MS);
}
function renderTyping(s){
  renderCommonTimer(s); renderControls(s); if(isEndedState(s)) addTotalsOnce(s);
  renderScores('typing-scores', s.activePlayers, s.scores);
  if(s.ended){
    q('typing-win').style.display='block';
    const topUid=(s.activePlayers||[]).reduce((a,b)=>(s.scores[b]||0)>(s.scores[a]||0)?b:a, s.activePlayers[0]);
    const topName=players[topUid]?.name||'';
    q('typing-win-text').textContent=`🏆 ${topName} 우승! 타이핑 종료!`;
    showWinnerModal(`${topName} 우승!`, '타이핑 경주 종료');
    q('typing-input-area').style.display='none'; return;
  }
  const maxRound = (s.texts||TYPING_TEXTS).length;
  q('typing-round').textContent=`라운드 ${s.round} / ${Math.min(5,maxRound)}`;
  q('typing-text').textContent=s.texts[s.round-1];
  const alreadySub = (s.submissions||[]).some(x=>x.uid===myUid);
  const canType = isActivePl()&&!alreadySub&&s.phase==='typing';
  q('typing-input-area').style.display = canType ? 'flex':'none';
  if(canType) setTimeout(()=>{ const ti=q('typing-input'); if(ti){ ti.focus(); ti.select(); } }, 80);
  
  const ord=q('typing-order'); ord.innerHTML='';
  const medals=['🥇','🥈','🥉'];
  const subs=s.submissions||[];
  subs.forEach((sub,i)=>{
    const color=getPC(sub.uid);
    const medal=medals[i]||`${i+1}위`;
    ord.innerHTML+=`<div class="typing-entry"><span style="font-size:18px">${medal}</span><span style="color:${color};font-weight:bold;flex:1">${esc(players[sub.uid]?.name)}</span><span style="color:var(--accent);font-size:10px">완료 ✅</span></div>`;
  });
  if(s.phase==='typing'&&!s.ended){
    const total=s.activePlayers.length;
    const pct=Math.round(subs.length/total*100);
    ord.innerHTML+=`<div style="margin-top:6px;font-size:10px;color:var(--muted);text-align:center">${subs.length}/${total}명 완료</div><div style="height:4px;background:var(--border);border-radius:2px;margin:4px 0;overflow:hidden"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue));border-radius:2px;transition:width .3s"></div></div>`;
  }
  
  if(s.phase==='typing') maybeScheduleTimeout(s, 'typing-'+s.round, ()=>finishTypingRound(true));
  if(s.phase==='reveal'){
    if(isHost) setTimeout(()=>{
      db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
        if(!cur||cur.phase!=='reveal'||cur.round!==s.round)return cur;
        if(cur.round>=5)return{...cur,ended:true};
        cur=applyPendingPlayers(cur); return resetTimerFields({...cur, round:cur.round+1, phase:'typing', submissions:[]});
      });
    }, 2500);
  }
}
function finishTypingRound(force=false){ db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{ if(!cur||cur.phase!=='typing')return cur; if(!force && (cur.submissions||[]).length<cur.activePlayers.length)return cur; const pts=[5,3,1]; const ns=Object.assign({},cur.scores); (cur.submissions||[]).forEach((sub,i)=>{ ns[sub.uid]=(ns[sub.uid]||0)+(pts[i]||0); }); return {...cur, phase:'reveal', scores:ns, deadline:null}; }); }
function submitTyping(){
  const inp=q('typing-input'); const text=inp.value; if(!text)return;
  const s=_currentGame; if(!s||s.phase!=='typing'||!isActivePl())return;
  if(text!==s.texts[s.round-1]){
    inp.select();
    const errEl=q('typing-err');
    if(errEl){ errEl.textContent='❌ 정확하게 입력해주세요!'; setTimeout(()=>{ if(errEl.textContent.startsWith('❌')) errEl.textContent=''; },1500); }
    return;
  }
  inp.value='';
  db.ref(`rooms/${roomId}/game/state/submissions`).transaction(subs=>{
    const list=subs?[...subs]:[]; if(list.some(x=>x.uid===myUid))return subs; return[...list,{uid:myUid,t:Date.now()}];
  }).then(tx=>{
    const list=tx.snapshot.val();
    if(list.length >= s.activePlayers.length){
      finishTypingRound(false);
    }
  });
}



