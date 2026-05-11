// =========================================================
// WINNER MODAL
// =========================================================
function showWinnerModal(title, sub=''){
  if(_winnerShown) return; _winnerShown=true;
  q('wm-icon').textContent = title.includes('무승부')?'🤝':'🎉';
  q('wm-title').textContent = title;
  q('wm-sub').textContent = sub;
  q('wm-replay-btn').style.display = isHost ? 'inline-flex':'none';
  q('winner-modal').classList.add('show');
  if(navigator.vibrate) navigator.vibrate([100,50,100,50,200]);
}
function closeWinnerModal(){ q('winner-modal').classList.remove('show'); }
function replayFromModal(){ closeWinnerModal(); restartGame(); }
function endFromModal(){ closeWinnerModal(); endGameToLobby(); }

// Constants / DB
const CHOSUNG_DB=[
  {word:'사과',hint:'🍎 과일'},{word:'바나나',hint:'🍌 과일'},{word:'수박',hint:'🍉 과일'},{word:'포도',hint:'🍇 과일'},{word:'딸기',hint:'🍓 과일'},
  {word:'복숭아',hint:'🍑 과일'},{word:'오렌지',hint:'🍊 과일'},{word:'파인애플',hint:'🍍 과일'},{word:'블루베리',hint:'🫐 과일'},
  {word:'컴퓨터',hint:'💻 기기'},{word:'스마트폰',hint:'📱 기기'},{word:'키보드',hint:'⌨️ 기기'},{word:'마우스',hint:'🖱️ 기기'},{word:'모니터',hint:'🖥️ 기기'},
  {word:'강아지',hint:'🐶 동물'},{word:'고양이',hint:'🐱 동물'},{word:'토끼',hint:'🐰 동물'},{word:'기린',hint:'🦒 동물'},{word:'코끼리',hint:'🐘 동물'},
  {word:'펭귄',hint:'🐧 동물'},{word:'돌고래',hint:'🐬 동물'},{word:'호랑이',hint:'🐯 동물'},{word:'사자',hint:'🦁 동물'},
  {word:'피자',hint:'🍕 음식'},{word:'치킨',hint:'🍗 음식'},{word:'라면',hint:'🍜 음식'},{word:'김치',hint:'🥬 음식'},{word:'떡볶이',hint:'🌶️ 음식'},
  {word:'초밥',hint:'🍣 음식'},{word:'햄버거',hint:'🍔 음식'},{word:'아이스크림',hint:'🍦 음식'},
  {word:'비행기',hint:'✈️ 교통수단'},{word:'자동차',hint:'🚗 교통수단'},{word:'지하철',hint:'🚇 교통수단'},{word:'자전거',hint:'🚲 교통수단'},
  {word:'선생님',hint:'🏫 직업'},{word:'의사',hint:'🏥 직업'},{word:'소방관',hint:'🚒 직업'},{word:'경찰관',hint:'🚓 직업'},
  {word:'축구',hint:'⚽ 스포츠'},{word:'야구',hint:'⚾ 스포츠'},{word:'농구',hint:'🏀 스포츠'},{word:'수영',hint:'🏊 스포츠'}
];
const TP_CATS=[
  {cat:'🍎 과일',opts:['사과','바나나','딸기','포도','수박','오렌지']},
  {cat:'🐶 동물',opts:['강아지','고양이','토끼','사자','고릴라','펭귄']},
  {cat:'🍕 음식',opts:['피자','라면','김치','치킨','떡볶이','초밥']},
  {cat:'🎨 색깔',opts:['빨강','파랑','초록','노랑','보라','주황']},
  {cat:'🌦️ 날씨',opts:['맑음','비','눈','바람','안개','폭염']},
  {cat:'🏖️ 여행지',opts:['바다','산','계곡','놀이공원','캠핑장','해외여행']},
  {cat:'🎬 취미',opts:['영화','게임','독서','운동','요리','음악감상']},
  {cat:'☕ 음료',opts:['커피','콜라','사이다','주스','물','녹차']},
  {cat:'🏫 학교',opts:['국어','수학','영어','과학','체육','미술']},
  {cat:'🕹️ 게임 장르',opts:['퍼즐','액션','스포츠','레이싱','공포','전략']},
  {cat:'🎁 받고 싶은 선물',opts:['현금','옷','전자기기','상품권','편지','음식']},
  {cat:'🍽️ 점심 메뉴',opts:['한식','중식','일식','양식','분식','패스트푸드']}
];
const TYPING_TEXTS=[
  '오늘 회의는 세 시에 시작합니다','보고서는 내일까지 제출해주세요','이번 주 금요일에 팀 회식이 있어요','프로젝트 진행 상황을 공유해주세요','점심 메뉴 투표가 시작되었습니다',
  '빠르게 입력하되 정확도가 더 중요합니다','모바일에서는 입력창을 누르지 않아도 바로 시작됩니다','새로운 아이디어를 자유롭게 말해주세요','오늘 할 일을 먼저 정리해봅시다','잠시 쉬었다가 다시 집중해볼까요',
  '채팅창에는 최신 메시지가 한 줄로 보입니다','타이머가 끝나기 전에 문장을 완성하세요','팀원들과 순서를 지켜 게임을 진행합니다','오타가 있으면 제출할 수 없습니다','마지막 라운드까지 포기하지 마세요',
  '가벼운 마음으로 미니게임을 즐겨주세요','정답을 알면 바로 입력하고 제출하세요','시간이 부족하면 침착하게 핵심부터 보세요','모든 사람이 완료하면 바로 다음 단계로 넘어갑니다','오늘도 즐거운 하루 보내세요',
  '키보드를 바라보지 않고 화면을 보며 입력해보세요','짧은 문장도 방심하면 오타가 날 수 있습니다','빠른 사람에게 더 높은 점수가 주어집니다','연습할수록 타자 속도는 점점 빨라집니다','집중력이 승부를 가르는 순간입니다'
];
const OX_Q = [
  {q:'윤경수는 잘생기고 미남이다.',a:'O'},
  {q:'대한민국의 수도는 서울이다',a:'O'},{q:'세계에서 가장 큰 나라는 중국이다',a:'X'},{q:'물은 100도에서 끓는다',a:'O'},{q:'펭귄은 날 수 있다',a:'X'},{q:'달은 스스로 빛을 낸다',a:'X'},{q:'가장 짧은 달은 2월이다',a:'O'},
  {q:'한글은 세종대왕 때 창제되었다',a:'O'},{q:'지구는 태양 주위를 돈다',a:'O'},{q:'고래는 물고기다',a:'X'},{q:'사람의 심장은 보통 왼쪽 가슴 쪽에 있다',a:'O'},
  {q:'1년은 항상 365일이다',a:'X'},{q:'무지개는 보통 일곱 가지 색으로 표현한다',a:'O'},{q:'축구 한 팀은 경기장에 11명이 뛴다',a:'O'},{q:'올림픽은 매년 열린다',a:'X'},
  {q:'바다는 지구 표면의 절반보다 넓다',a:'O'},{q:'사막에는 비가 절대 오지 않는다',a:'X'},{q:'코끼리는 육상 동물 중 큰 편이다',a:'O'},{q:'바나나는 나무에서 열린다',a:'X'},
  {q:'소리는 진공 상태에서도 잘 전달된다',a:'X'},{q:'번개가 친 뒤 천둥소리가 들릴 수 있다',a:'O'},{q:'컴퓨터의 CPU는 중앙처리장치라고 부른다',a:'O'},{q:'마우스는 출력장치다',a:'X'},
  {q:'김치는 발효 음식이다',a:'O'},{q:'라면은 보통 끓는 물로 조리한다',a:'O'},{q:'스마트폰은 전화 기능만 할 수 있다',a:'X'},{q:'비행기는 하늘을 날 수 있다',a:'O'},
  {q:'자전거는 보통 페달을 밟아 움직인다',a:'O'},{q:'겨울은 여름보다 항상 덥다',a:'X'},{q:'손흥민은 축구 선수로 알려져 있다',a:'O'},{q:'피아노에는 건반이 있다',a:'O'}
];
const WORD_SET=new Set(['사과','하늘','바다','구름','나무','기차','사랑','학교','가령','가정','결혼','대학교','민주주의','설날','시험','인터넷','정치','종교','지구','통신','하천','바나나','수박','포도','딸기','고양이','강아지','토끼']);

const q=id=>document.getElementById(id);
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function getPC(uid){let i=_uidOrder.indexOf(uid);if(i<0)i=0;return PC[i%PC.length];}
function isActivePl(){return (_currentGame?.activePlayers||[]).includes(myUid);}
function getChosung(word){
  const CHO=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  return word.split('').map(ch=>{const c=ch.charCodeAt(0)-0xAC00;return(c>=0&&c<=11171)?CHO[Math.floor(c/588)]:ch;}).join(' ');
}
function isHangulWord2(w){return typeof w==='string'&&/^[가-힣]{2,15}$/.test(w.trim());}

// Room Logic
function createRoom(){
  myName=q('inp-name').value.trim(); if(!myName)return;
  roomId=Math.random().toString(36).substr(2,6).toUpperCase(); isHost=true; hostUid=myUid;
  db.ref(`rooms/${roomId}/hostUid`).set(myUid);
  enterRoom();
}
function joinRoom(){
  myName=q('inp-name').value.trim(); const code=q('inp-room').value.trim().toUpperCase();
  if(!myName||!code)return; roomId=code; isHost=false; enterRoom();
}
function copyRoomCode(){
  navigator.clipboard.writeText(roomId).then(()=>alert("방 코드가 복사되었습니다!"));
}
function enterRoom(){
  db.ref(`rooms/${roomId}/players/${myUid}`).set({name:myName, online:true, joined:Date.now()});
  db.ref(`rooms/${roomId}/players/${myUid}`).onDisconnect().update({online:false});
  q('login-screen').style.display='none'; q('app').classList.add('on'); q('room-code').textContent=roomId;
  
  db.ref(`rooms/${roomId}/players`).on('value', snap=>{
    players=snap.val()||{};
    _uidOrder=Object.keys(players).sort((a,b)=>players[a].joined-players[b].joined);
    updatePlayerUI();
  });
  db.ref(`rooms/${roomId}/prep/omok`).on('value', snap=>{ _omokPrep=snap.val()||{}; updatePlayerUI(); });
  db.ref(`rooms/${roomId}/prep/mine`).on('value', snap=>{ _minePrep=snap.val()||{difficulty:'normal'}; updatePlayerUI(); });
  db.ref(`rooms/${roomId}/hostUid`).on('value', snap=>{
    const h=snap.val(); hostUid=h||'';
    const wasHost=isHost; isHost=(h===myUid);
    if(!wasHost && isHost){ _timeoutKey=''; } // 새 방장이 되면 타이머 즉시 이어받기
    if(wasHost!==isHost){ updatePlayerUI(); if(_currentGame) renderControls(_currentGame); }
    else updatePlayerUI();
  });
  db.ref(`rooms/${roomId}/totals`).on('value', snap=>{ _totals=snap.val()||{}; renderTotals(); });
  db.ref(`rooms/${roomId}/selectedGame`).on('value', snap=>{ _selGame=snap.val()||null; _currentType=_selGame; document.querySelectorAll('.gcard').forEach(c=>c.classList.remove('sel')); if(_selGame) q('gc-'+_selGame)?.classList.add('sel'); if(q('start-btn')) q('start-btn').disabled=!_selGame; updatePlayerUI(); });
  db.ref(`rooms/${roomId}/game`).on('value', snap=>{
    const g=snap.val();
    if(g && g.state) {
      _currentType=g.type; _currentGame=g.state;
      handleGameState();
    } else {
      _currentType=null; _currentGame=null; _leftCurrentGame=false; _winnerShown=false;
      closeEntryOverlay(); closeWinnerModal();
      navTo('lobby');
    }
  });
  db.ref(`rooms/${roomId}/chat`).limitToLast(50).on('child_added', snap=>appendChat(snap.val()));
  sysChat(`${myName}님이 참여했습니다.`);

  
  // Mobile setup
  if(window.innerWidth<=768){ q('chatpanel').classList.remove('open'); q('sb').classList.remove('open'); }
}
function leaveRoom(){
  if(!confirm('방에서 나가시겠습니까?')) return;
  if(isHost){
    const next=_uidOrder.find(u=>u!==myUid&&players[u]?.online);
    if(next){ db.ref(`rooms/${roomId}/hostUid`).set(next); sysChat(`👑 방장 권한이 ${players[next]?.name||''}님에게 자동 위임되었습니다.`); }
    else db.ref(`rooms/${roomId}/hostUid`).remove();
  }
  sysChat(`${myName}님이 퇴장했습니다.`);
  db.ref(`rooms/${roomId}/players/${myUid}`).update({online:false});
  setTimeout(()=>location.reload(),200);
}
function delegateHostTo(uid){
  if(!isHost||uid===myUid||!players[uid]?.online) return;
  if(!confirm(`${players[uid]?.name||''}님에게 방장을 위임할까요?`)) return;
  db.ref(`rooms/${roomId}/hostUid`).set(uid);
  sysChat(`👑 방장 권한이 ${players[uid]?.name||''}님에게 위임되었습니다.`);
}

// Chat
function sendChat(){
  const inp=q('chat-inp'); if(!inp.value.trim())return;
  db.ref(`rooms/${roomId}/chat`).push({uid:myUid, name:myName, msg:inp.value.trim(), t:Date.now()});
  inp.value='';
}
function appendChat(d){
  const el=document.createElement('div'); el.className='cmsg' + (d.uid==='sys' ? ' sys' : '');
  el.innerHTML= d.uid==='sys' ? `<div class="ctext">— ${esc(d.msg)}</div>` : `<div class="csender" style="color:${getPC(d.uid)}">${esc(d.name)}</div><div class="ctext">${esc(d.msg)}</div>`;
  const c=q('chatmsgs'); c.appendChild(el); c.scrollTop=c.scrollHeight;
  updateMobileChatPreview(d);
}
function updateMobileChatPreview(d){
  const el=q('mobile-chat-text'); if(!el || !d) return;
  if(d.uid==='sys') el.textContent = `알림: ${d.msg||''}`;
  else el.textContent = `${d.name||'익명'}: ${d.msg||''}`;
}
function sysChat(msg){db.ref(`rooms/${roomId}/chat`).push({uid:'sys', name:'', msg, t:Date.now()});}

// UI
function navTo(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  q('view-'+name)?.classList.add('active');
}
function stopAllTimers(){ clearInterval(_timer); clearInterval(_wTimer); clearInterval(_choTimer); clearInterval(_tpTimer); clearInterval(_oxTimer); clearInterval(_typingTimer); }
function backToLobby(){
  if(_currentGame && !isEndedState(_currentGame)){
    if(!confirm('게임 중입니다. 정말 나가시겠습니까?')) return;
  }
  stopAllTimers(); hideCommonTimer(); renderControls(null);
  _leftCurrentGame=true; closeWinnerModal();
  if(isHost && _currentGame && !isEndedState(_currentGame)){
    db.ref(`rooms/${roomId}/game`).remove();
  } else {
    leaveCurrentRound(false);
  }
  closeEntryOverlay();
  q('spectator-banner').style.display='none';
  navTo('lobby');
}
function leaveCurrentRound(removeGameIfEmpty=false){
  if(!roomId || !_currentGame || _currentGame.phase==='entry') return;
  db.ref(`rooms/${roomId}/game/state`).transaction(cur=>{
    if(!cur) return cur;
    const prevCount=(cur.activePlayers||[]).length;
    cur.activePlayers=(cur.activePlayers||[]).filter(u=>u!==myUid);
    if(cur.pendingNextRound) delete cur.pendingNextRound[myUid];
    if(cur.blackTeam) cur.blackTeam=(cur.blackTeam||[]).filter(u=>u!==myUid);
    if(cur.whiteTeam) cur.whiteTeam=(cur.whiteTeam||[]).filter(u=>u!==myUid);
    if(cur.soloOrder) cur.soloOrder=(cur.soloOrder||[]).filter(u=>u!==myUid);
    if(cur.activePlayers.length===0){
      if(removeGameIfEmpty) return null;
      cur.ended=true; cur.phase='ended'; cur.deadline=null; return cur;
    }
    // 1:1에서 한 명이 나가면 남은 사람 즉시 승리
    if(prevCount===2 && cur.activePlayers.length===1 && !cur.ended){
      const winner=cur.activePlayers[0];
      cur.ended=true; cur.phase='ended'; cur.deadline=null;
      cur.scores=cur.scores||{}; cur.scores[winner]=(cur.scores[winner]||0)+10;
      cur.forcedWinner=winner;
      return cur;
    }
    if(typeof cur.curIdx==='number') cur.curIdx=cur.curIdx % Math.max(1,cur.activePlayers.length);
    return cur;
  });
}
function endGameToLobby(){ if(isHost) db.ref(`rooms/${roomId}/game`).remove(); else backToLobby(); }
function cancelEntryAndLobby(){
  if(isHost && _currentGame?.phase==='entry') db.ref(`rooms/${roomId}/game`).remove();
  closeEntryOverlay(); navTo('lobby');
}
function toggleSb(){ q('sb').classList.toggle('open'); q('overlay').classList.toggle('show'); q('chatpanel').classList.remove('open'); }
function toggleChat(){ q('chatpanel').classList.toggle('open'); q('overlay').classList.toggle('show'); q('sb').classList.remove('open'); }
function closeAll(){ q('sb').classList.remove('open'); q('chatpanel').classList.remove('open'); q('overlay').classList.remove('show'); }

function updatePlayerUI(){
  const h=q('hplayers'), sb=q('sb-players');
  if(!h||!sb)return; h.innerHTML=''; sb.innerHTML='';
  _uidOrder.forEach(uid=>{
    const p=players[uid]; if(!p||!p.online)return;
    const isH=uid===hostUid;
    h.innerHTML+=`<div style="width:8px;height:8px;border-radius:50%;background:${getPC(uid)};${isH?'outline:2px solid var(--accent);outline-offset:2px':''}" title="${p.name}${isH?' 👑':''}"></div>`;
    sb.innerHTML+=`<div class="pitem">
      <div class="dot" style="background:${getPC(uid)}"></div>
      <div class="pn">${esc(p.name)}${isH?' <span style=\'font-size:10px\'>👑</span>':''}</div>
      ${isHost&&uid!==myUid&&uid!==hostUid?`<button onclick="delegateHostTo('${uid}')" style="font-size:9px;padding:1px 5px;background:none;border:1px solid var(--muted);border-radius:3px;color:var(--muted);cursor:pointer;margin-left:auto;flex-shrink:0">위임</button>`:''}
    </div>`;
  });
  
  // Omok Lobby UI sync
  if(q('omok-lobby-box')){
    q('omok-lobby-box').style.display = _currentType==='omok' ? 'block' : 'none';
    q('omok-m-solo').checked = _omokPrep.mode==='solo';
    q('omok-m-team').checked = _omokPrep.mode==='team';
    q('omok-m-solo').disabled = !isHost; q('omok-m-team').disabled = !isHost;
    q('omok-solo-ui').style.display = _omokPrep.mode==='solo'?'block':'none';
    q('omok-team-ui').style.display = _omokPrep.mode==='team'?'block':'none';
    
    // Team builder logic
    const tb=q('team-black-list'), tw=q('team-white-list'), bx=q('team-bench-list');
    if(tb) {
      const renderTeam = (arr, id, slot) => {
        let h=''; (arr||[]).forEach(u=>{ if(players[u]) h+=`<div style="color:${getPC(u)};font-size:11px;margin:3px 0">${esc(players[u].name)} ${u===myUid?'(나)':''}</div>`; });
        h += `<button class="opt-btn ${arr?.includes(myUid)?'on':''}" onclick="chooseOmokTeam('${slot}')">여기로 선택</button>`;
        q(id).innerHTML=h;
      };
      renderTeam(_omokPrep.teamBlack, 'team-black-list', 'black');
      renderTeam(_omokPrep.teamWhite, 'team-white-list', 'white');
      renderTeam(_omokPrep.teamBench, 'team-bench-list', 'bench');
      renderOmokSoloLobby();
    }
  }
  if(q('mine-lobby-box')){
    q('mine-lobby-box').style.display = _currentType==='mine' ? 'block' : 'none';
    ['easy','normal','hard'].forEach(d=>q('mine-d-'+d)?.classList.toggle('on', (_minePrep.difficulty||'normal')===d));
  }
  if(q('rps-lobby-box')) q('rps-lobby-box').style.display = _currentType==='rps' ? 'block' : 'none';
  if(q('ox-lobby-box')) q('ox-lobby-box').style.display = _currentType==='ox' ? 'block' : 'none';
}


function withTimer(state, ms){ const dur=ms||TURN_MS; return {...state, durationMs:dur, deadline:Date.now()+dur}; }
function resetTimerFields(cur){ const ms=cur.durationMs||TURN_MS; cur.durationMs=ms; cur.deadline=Date.now()+ms; return cur; }
function applyPendingPlayers(cur){
  if(cur.pendingNextRound){ cur.activePlayers=[...new Set([...(cur.activePlayers||[]), ...Object.keys(cur.pendingNextRound)])]; cur.pendingNextRound=null; }
  return cur;
}
function renderCommonTimer(s, label='남은 시간'){
  const wrap=q('common-timer'); if(!wrap)return;
  const timed = s && s.deadline && !isEndedState(s);
  wrap.style.display = timed ? 'block' : 'none';
  if(!timed) return;
  q('timer-label').textContent=label;
  clearInterval(_timerAnim);
  const dur=s.durationMs||TURN_MS;
  const tick=()=>{
    const left=Math.max(0,(s.deadline||0)-Date.now());
    q('timer-sec').textContent=Math.ceil(left/1000);
    q('timer-fill').style.width=Math.max(0,Math.min(100,left/dur*100))+'%';
  };
  tick(); _timerAnim=setInterval(tick,120);
}
function hideCommonTimer(){ clearInterval(_timerAnim); const el=q('common-timer'); if(el)el.style.display='none'; }
function isEndedState(s){ return !!(s?.ended||s?.winner||s?.gameOver||s?.won||s?.phase==='ended'); }
function maybeScheduleTimeout(s, key, fn){
  if(!isHost || !s?.deadline || isEndedState(s)) return;
  const k=_currentType+':'+key+':'+s.deadline; if(_timeoutKey===k) return; _timeoutKey=k;
  setTimeout(()=>{ if(_currentGame?.deadline===s.deadline) fn(); }, Math.max(0,s.deadline-Date.now()+80));
}
function renderControls(s){
  const el=q('game-controls'); if(!el)return;
  const ended=!!s&&isEndedState(s);
  const show=ended||(!!s&&s.phase==='reveal');
  el.style.display=show?'flex':'none';
  if(!show) return;
  q('replay-btn').style.display=isHost&&ended?'block':'none';
  q('end-game-btn').style.display=isHost?'block':'none';
  const lb=q('lobby-btn');
  if(lb){
    if(!isHost&&ended) lb.textContent='🏠 로비로 (방장 종료 대기)';
    else lb.textContent='🏠 로비로';
  }
}
function renderTotals(){
  const el=q('total-scores'); if(!el)return;
  const ids=_uidOrder.filter(u=>players[u]?.online || _totals[u]);
  el.innerHTML=ids.map(u=>`<div class="total-chip" style="border-color:${getPC(u)}80;color:${getPC(u)}">${esc(players[u]?.name||'플레이어')}: 총점 ${_totals[u]||0}</div>`).join('');
}
function addTotalsOnce(s){
  if(!isHost || !s || s.totalsAdded || !s.scores) return;
  const updates={}; Object.entries(s.scores).forEach(([u,sc])=>updates[`rooms/${roomId}/totals/${u}`]=(_totals[u]||0)+(sc||0));
  updates[`rooms/${roomId}/game/state/totalsAdded`]=true; db.ref().update(updates);
}
function requestJoinNextRound() {
  if(!_currentGame || _currentGame.phase === 'entry') return;
  db.ref(`rooms/${roomId}/game/state/pendingNextRound/${myUid}`).set(true);
}
function cancelJoinNextRound(){ db.ref(`rooms/${roomId}/game/state/pendingNextRound/${myUid}`).remove(); }
function updateSpectatorBanner(g){
  const el=q('spectator-banner'); if(!el||!g){el&&(el.style.display='none');return;}
  const pending=!!g.pendingNextRound?.[myUid];
  const inRound=(g.activePlayers||[]).includes(myUid);
  const show=(!inRound && !isEndedState(g)) || pending;
  el.style.display=show?'flex':'none';
  q('spectator-text').textContent=pending?'✅ 다음 판부터 참여 신청됨':'👁️ 이번 판 관전 중';
  q('spectator-join-btn').style.display=pending?'none':'inline-block';
  q('spectator-cancel-btn').style.display=pending?'inline-block':'none';
}
function restartGame(){
  if(!isHost || !_currentType || !_currentGame) return;
  let ap=[...new Set([...( _currentGame.activePlayers||[]), ...Object.keys(_currentGame.pendingNextRound||{})])].filter(u=>players[u]?.online);
  if(ap.length<1){alert('참가자가 없습니다.');return;}
  if(_currentType==='omok') return startOmokActual(ap);
  const inits={mine:initMine, word:initWord, chosung:initChosung, baseball:initBaseball, telepathy:initTelepathy, rps:initRPS, typing:initTyping, ox:initOX, bingo:initBingo};
  db.ref(`rooms/${roomId}/game/state`).set(inits[_currentType](ap));
}
function setMineDifficulty(d){ db.ref(`rooms/${roomId}/prep/mine`).set({difficulty:d}); }
function setRpsRounds(n){ _rpsPrep={rounds:n}; ['3','5','7'].forEach(r=>q('rps-r-'+r)?.classList.toggle('on',parseInt(r)===n)); }
function setOxRounds(n){ _oxPrep={rounds:n}; ['3','5','7','10'].forEach(r=>q('ox-r-'+r)?.classList.toggle('on',parseInt(r)===n)); }
function mineCfg(d){ return {easy:{size:8,mines:8},normal:{size:10,mines:15},hard:{size:12,mines:25}}[d||'normal']; }
function chooseOmokTeam(slot){
  let tb=(_omokPrep.teamBlack||[]).filter(u=>u!==myUid), tw=(_omokPrep.teamWhite||[]).filter(u=>u!==myUid), bx=(_omokPrep.teamBench||[]).filter(u=>u!==myUid);
  if(slot==='black')tb.push(myUid); else if(slot==='white')tw.push(myUid); else bx.push(myUid);
  db.ref(`rooms/${roomId}/prep/omok`).update({teamBlack:tb,teamWhite:tw,teamBench:bx});
}
function chooseOmokSolo(slot){
  let ord=(_omokPrep.soloOrder||[]).filter(u=>u!==myUid);
  if(slot==='p1')ord=[myUid,...ord].slice(0,2); else if(slot==='p2'){ord=[ord[0],myUid].filter(Boolean).slice(0,2)}
  db.ref(`rooms/${roomId}/prep/omok/soloOrder`).set(ord);
}
function renderOmokSoloLobby(){
  const el=q('omok-solo-ui'); if(!el)return;
  const ord=_omokPrep.soloOrder||[];
  el.innerHTML=`<div class="opt-grid"><button class="opt-btn ${ord[0]===myUid?'on':''}" onclick="chooseOmokSolo('p1')">흑/1P: ${esc(players[ord[0]]?.name||'비어있음')}</button><button class="opt-btn ${ord[1]===myUid?'on':''}" onclick="chooseOmokSolo('p2')">백/2P: ${esc(players[ord[1]]?.name||'비어있음')}</button><button class="opt-btn ${!ord.includes(myUid)?'on':''}" onclick="chooseOmokSolo('bench')">관전 선택</button></div>`;
}
function nextTurnIndex(cur){ return ((cur.curIdx||0)+1)%Math.max(1,(cur.activePlayers||[]).length); }

// GAME FLOW: Entry Phase -> Actual Game
let _selGame = null;
function selectGame(gm){
  if(!isHost)return; _selGame=gm; _currentType=gm; db.ref(`rooms/${roomId}/selectedGame`).set(gm);
  document.querySelectorAll('.gcard').forEach(c=>c.classList.remove('sel'));
  q('gc-'+gm)?.classList.add('sel');
  q('start-btn').disabled=false;
  updatePlayerUI();
  
  if(gm==='omok'){
     const active = _uidOrder.filter(u=>players[u]?.online);
     db.ref(`rooms/${roomId}/prep/omok`).update({mode:_omokPrep.mode||'solo', soloOrder:_omokPrep.soloOrder?.length?_omokPrep.soloOrder:active, teamBlack:_omokPrep.teamBlack?.length?_omokPrep.teamBlack:active.slice(0,1), teamWhite:_omokPrep.teamWhite?.length?_omokPrep.teamWhite:active.slice(1,2), teamBench:_omokPrep.teamBench?.length?_omokPrep.teamBench:active.slice(2)});
  }
  if(gm==='mine') db.ref(`rooms/${roomId}/prep/mine`).update({difficulty:_minePrep.difficulty||'normal'});
}
function syncOmokLobby(){ const m=q('omok-m-team').checked?'team':'solo'; db.ref(`rooms/${roomId}/prep/omok/mode`).set(m); }
function moveOmokTeam(uid){
  let tb=_omokPrep.teamBlack||[], tw=_omokPrep.teamWhite||[], tx=_omokPrep.teamBench||[];
  tb=tb.filter(u=>u!==uid); tw=tw.filter(u=>u!==uid); tx=tx.filter(u=>u!==uid);
  if(_omokPrep.teamBlack?.includes(uid)) tw.push(uid);
  else if(_omokPrep.teamWhite?.includes(uid)) tx.push(uid);
  else tb.push(uid);
  db.ref(`rooms/${roomId}/prep/omok`).update({teamBlack:tb, teamWhite:tw, teamBench:tx});
}

function startEntryPhase(){
  if(!isHost || !_selGame) return;
  if(_selGame === 'omok') { startOmokActual(); }
  else {
    db.ref(`rooms/${roomId}/game`).set({ type: _selGame, state: { phase: 'entry', entries: {} } });
  }
}

function setEntry(choice) {
  _leftCurrentGame=false;
  if(_currentGame?.phase === 'entry') db.ref(`rooms/${roomId}/game/state/entries/${myUid}`).set(choice);
}
function closeEntryOverlay() { q('entry-overlay').classList.remove('active'); }

function hostStartActualGame() {
  if(!isHost) return;
  const entries = _currentGame.entries || {};
  // _uidOrder 기준으로 순서를 보장하여 activePlayers 배열 생성
  const activePlayers = _uidOrder.filter(u => entries[u] === 'play' && players[u]?.online);
  if(activePlayers.length < 1) { alert("최소 1명의 참가자가 필요합니다."); return; }
  if(_currentType==='baseball' && activePlayers.length < 2) { alert("숫자야구는 최소 2명부터 가능합니다."); return; }
  
  const inits = {mine:initMine, word:initWord, chosung:initChosung, baseball:initBaseball, telepathy:initTelepathy, rps:initRPS, typing:initTyping,  ox:initOX, bingo:initBingo};
  const state = inits[_currentType](activePlayers);
  db.ref(`rooms/${roomId}/game/state`).set(state);
}


// Handle State Changes
function handleGameState() {
  const g = _currentGame;
  // 이미 나가기를 선택한 경우 → 타이밍 무관하게 즉시 로비로 (타이머 노출 버그 방지)
  if(_leftCurrentGame){
    closeEntryOverlay(); hideCommonTimer(); renderControls(null);
    q('spectator-banner').style.display='none'; closeWinnerModal(); navTo('lobby'); return;
  }
  if(g && (g.activePlayers||[]).includes(myUid)) _leftCurrentGame=false;
  navTo(_currentType);
  stopAllTimers();
  
  if(g.phase === 'entry') {
    q('entry-overlay').classList.add('active');
    const el = q('entry-players'); el.innerHTML = '';
    _uidOrder.forEach(u => {
      if(!g.entries || !g.entries[u] || !players[u]?.online) return;
      const isPlay = g.entries[u] === 'play';
      el.innerHTML += `<div class="entry-chip" style="color:${isPlay?'var(--accent)':'var(--muted)'};border-color:${isPlay?'var(--accent)':'var(--muted)'}">${esc(players[u]?.name)} (${isPlay?'참가':'관전'})</div>`;
    });
    q('entry-start-btn').style.display = isHost ? 'block' : 'none';
    q('spectator-banner').style.display = 'none'; hideCommonTimer(); renderControls(null);
    _winnerShown = false;
    return;
  }
  closeEntryOverlay();
  // 게임 진행 중일 때(아직 안 끝났을 때)마다 모달 플래그 초기화 → replay 후에도 정상 작동
  if(!isEndedState(g)) _winnerShown = false;
  // 모바일에서 게임 시작 시 채팅 자동 닫기
  if(window.innerWidth<=768){ q('chatpanel').classList.remove('open'); q('overlay').classList.remove('show'); }
  
  _amInRound = (g.activePlayers||[]).includes(myUid);
  updateSpectatorBanner(g);
  renderControls(g);

  const R = {omok:renderOmok, mine:renderMine, word:renderWord, chosung:renderChosung, baseball:renderBaseball, telepathy:renderTelepathy, rps:renderRPS, typing:renderTyping, ox:renderOX, bingo:renderBingo};
  if(R[_currentType]) R[_currentType](g);
}

function renderScores(elId, order, scores) {
  const el=q(elId); if(!el)return;
  el.innerHTML=(order||[]).map(uid=>`<div class="sc-card" style="border-color:${getPC(uid)}80"><div class="sc-val" style="color:${getPC(uid)}">${scores?.[uid]||0}</div><div class="sc-lbl">${esc(players[uid]?.name)}</div></div>`).join('');
}

