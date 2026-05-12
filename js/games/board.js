// =========================================================
// 12. 부루마블
// =========================================================

// ─── 보드 데이터 ──────────────────────────────────────────────────────────────

const BB_SP = [
  {pos:0,  t:'start',   nm:'출발',       icon:'🏁'},
  {pos:1,  t:'prop',    nm:'서울',        gr:'brown',  buy:6,  rent:2,  vr:10,  br:30},
  {pos:2,  t:'card',    nm:'황금열쇠',    icon:'🔑'},
  {pos:3,  t:'prop',    nm:'제주도',      gr:'brown',  buy:6,  rent:4,  vr:20,  br:60},
  {pos:4,  t:'tax',     nm:'세금',        tax:5},
  {pos:5,  t:'airport', nm:'인천공항',    icon:'✈️'},
  {pos:6,  t:'prop',    nm:'타이베이',    gr:'sky',    buy:10, rent:5,  vr:30,  br:90},
  {pos:7,  t:'card',    nm:'황금열쇠',    icon:'🔑'},
  {pos:8,  t:'prop',    nm:'방콕',        gr:'sky',    buy:10, rent:5,  vr:30,  br:90},
  {pos:9,  t:'prop',    nm:'싱가포르',    gr:'sky',    buy:12, rent:6,  vr:40,  br:100},
  {pos:10, t:'jail',    nm:'무인도',      icon:'🏝️'},
  {pos:11, t:'prop',    nm:'카이로',      gr:'purple', buy:14, rent:8,  vr:50,  br:150},
  {pos:12, t:'airport', nm:'런던공항',    icon:'✈️'},
  {pos:13, t:'prop',    nm:'이스탄불',    gr:'purple', buy:14, rent:8,  vr:50,  br:150},
  {pos:14, t:'prop',    nm:'아테네',      gr:'purple', buy:16, rent:10, vr:60,  br:180},
  {pos:15, t:'prop',    nm:'코펜하겐',    gr:'orange', buy:18, rent:12, vr:70,  br:200},
  {pos:16, t:'card',    nm:'황금열쇠',    icon:'🔑'},
  {pos:17, t:'prop',    nm:'스톡홀름',    gr:'orange', buy:18, rent:12, vr:70,  br:200},
  {pos:18, t:'prop',    nm:'로마',        gr:'orange', buy:20, rent:14, vr:80,  br:220},
  {pos:19, t:'tax',     nm:'세금',        tax:10},
  {pos:20, t:'parking', nm:'무료주차',    icon:'🅿️'},
  {pos:21, t:'prop',    nm:'런던',        gr:'red',    buy:22, rent:16, vr:90,  br:250},
  {pos:22, t:'card',    nm:'황금열쇠',    icon:'🔑'},
  {pos:23, t:'prop',    nm:'파리',        gr:'red',    buy:22, rent:16, vr:90,  br:250},
  {pos:24, t:'prop',    nm:'베를린',      gr:'red',    buy:24, rent:18, vr:100, br:300},
  {pos:25, t:'airport', nm:'JFK공항',     icon:'✈️'},
  {pos:26, t:'prop',    nm:'마드리드',    gr:'yellow', buy:26, rent:20, vr:110, br:330},
  {pos:27, t:'tax',     nm:'세금',        tax:15},
  {pos:28, t:'prop',    nm:'뉴욕',        gr:'yellow', buy:26, rent:20, vr:110, br:330},
  {pos:29, t:'prop',    nm:'시카고',      gr:'yellow', buy:28, rent:22, vr:120, br:360},
  {pos:30, t:'gotojail',nm:'무인도로',    icon:'🚓'},
  {pos:31, t:'prop',    nm:'도쿄',        gr:'green',  buy:30, rent:24, vr:130, br:390},
  {pos:32, t:'airport', nm:'나리타공항',  icon:'✈️'},
  {pos:33, t:'prop',    nm:'상하이',      gr:'green',  buy:30, rent:24, vr:130, br:390},
  {pos:34, t:'card',    nm:'황금열쇠',    icon:'🔑'},
  {pos:35, t:'prop',    nm:'하와이',      gr:'green',  buy:32, rent:26, vr:140, br:420},
  {pos:36, t:'tax',     nm:'세금',        tax:20},
  {pos:37, t:'prop',    nm:'LA',          gr:'navy',   buy:35, rent:30, vr:175, br:500},
  {pos:38, t:'card',    nm:'황금열쇠',    icon:'🔑'},
  {pos:39, t:'prop',    nm:'상파울루',    gr:'navy',   buy:40, rent:25, vr:200, br:600},
];
// buy/rent/vr/br 는 만원 단위 (×10000 = 실제 원)

const BB_GC = {
  brown:'#c8a26a', sky:'#87ceeb', purple:'#9b59b6',
  orange:'#e67e22', red:'#e74c3c', yellow:'#f1c40f',
  green:'#2ecc71',  navy:'#2980b9'
};

const BB_GROUPS = {};
BB_SP.forEach(s => { if(s.gr){ if(!BB_GROUPS[s.gr]) BB_GROUPS[s.gr]=[]; BB_GROUPS[s.gr].push(s.pos); }});

const BB_APT_POS  = [5, 12, 25, 32];
const BB_APT_TOLL = [0, 250000, 500000, 1000000, 2000000];

const BB_CARDS = [
  {id:'bonus',     txt:'💰 은행에서 20만원을 받으세요!',           eff:'bonus',      val:200000},
  {id:'taxcard',   txt:'💸 세금 30만원을 납부하세요.',             eff:'pay',        val:300000},
  {id:'again',     txt:'🎲 주사위를 한 번 더 굴리세요!',           eff:'again'},
  {id:'teleport',  txt:'🚀 원하는 칸으로 순간이동하세요!',         eff:'teleport'},
  {id:'birthday',  txt:'🎁 생일 파티! 다른 플레이어에게 10만씩 받기!', eff:'birthday',val:100000},
  {id:'jailcard',  txt:'🔒 감옥 면제권! 저장해두었다가 사용하세요.',eff:'jailcard'},
  {id:'freebuild', txt:'🏠 내 도시에 건물 1개를 무료로 건설!',     eff:'freebuild'},
  {id:'nearAirport',txt:'✈️ 가장 가까운 공항으로 이동!',           eff:'nearAirport'},
];

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

const BB_W = n => n >= 10000 ? (n/10000|0)+'만' : n.toLocaleString(); // 원 → 만원 표시

function bbGrid(p) { // grid row/col (1-indexed) for CSS grid
  if(p===0)  return [11,11];
  if(p===10) return [11,1];
  if(p===20) return [1,1];
  if(p===30) return [1,11];
  if(p>=1  && p<=9)  return [11, 11-p];
  if(p>=11 && p<=19) return [11-(p-10), 1];
  if(p>=21 && p<=29) return [1, p-19];
  return [p-29, 11];
}

function bbCalcRent(sp, props, pos, cur) {
  if(sp.t === 'airport') {
    const owner = props?.[pos]?.owner;
    if(!owner) return 0;
    const cnt = BB_APT_POS.filter(ap => props?.[ap]?.owner === owner).length;
    return BB_APT_TOLL[cnt] || 0;
  }
  if(sp.t !== 'prop') return 0;
  const prop = props?.[pos];
  if(!prop?.owner) return 0;
  if(prop.level === 2) return sp.br * 10000;
  if(prop.level === 1) return sp.vr * 10000;
  const monopoly = BB_GROUPS[sp.gr]?.every(gp => props?.[gp]?.owner === prop.owner);
  return sp.rent * 10000 * (monopoly ? 2 : 1);
}

function bbOwnsGroup(props, uid, gr) {
  return !!gr && BB_GROUPS[gr]?.every(p => props?.[p]?.owner === uid);
}

function bbVillaCost(sp)  { return sp.buy * 10000; }
function bbBuildUpCost(sp){ return sp.buy * 20000; }

function bbNetWorth(cur, uid) {
  if(cur.bankrupt?.includes(uid)) return -1;
  let total = cur.money?.[uid] || 0;
  Object.entries(cur.properties||{}).forEach(([pos,prop]) => {
    if(prop.owner !== uid) return;
    const sp = BB_SP[+pos];
    if(!sp) return;
    total += (sp.t==='airport' ? 400000 : sp.buy*10000);
    if(prop.level >= 1) total += bbVillaCost(sp);
    if(prop.level >= 2) total += bbBuildUpCost(sp);
  });
  return total;
}

function bbAddLog(cur, msg) {
  cur.log = [...(cur.log||[]).slice(-11), msg];
  return cur;
}

// ─── 로비 ─────────────────────────────────────────────────────────────────────

let _bbRounds = 7;
function setBBRounds(r) {
  _bbRounds = r;
  [5,7,10,0].forEach(v => q('bboard-r-'+v)?.classList.toggle('on', v===r));
}

// ─── 초기화 ───────────────────────────────────────────────────────────────────

function initBoard(ap) {
  const money={}, pos={}, jail={}, jailCard={}, doubles={};
  ap.forEach(u => {
    money[u]    = 1500000;
    pos[u]      = 0;
    jail[u]     = {inJail:false, turnsLeft:0};
    jailCard[u] = false;
    doubles[u]  = 0;
  });
  return {
    phase:    'rolling',
    activePlayers: ap,
    bankrupt: [],
    round:    1,
    maxRounds: _bbRounds,
    turnIdx:  0,
    money, pos, jail, jailCard, doubles,
    properties: {},
    lastDice:   null,
    pendingPos: null,
    pendingCard: null,
    _cardDouble: false,
    _pendingDouble: false,
    scores: Object.fromEntries(ap.map(u=>[u,0])),
    log: ['게임 시작! 🎲'],
    ended: false,
    winner: null
  };
}

// ─── 렌더: 메인 ───────────────────────────────────────────────────────────────

function renderBoard(s) {
  renderControls(s);
  if(isEndedState(s)) { addTotalsOnce(s); }

  const curUid = s.activePlayers?.[s.turnIdx];
  const isMyTurn = curUid === myUid && isActivePl() && !s.ended;

  const ti = q('bb-turn-info');
  if(ti) {
    if(s.ended) { ti.textContent='게임 종료 🏆'; ti.className='turn-ind'; }
    else if(isMyTurn) { ti.textContent='내 차례! 🎲'; ti.className='turn-ind'; }
    else { ti.textContent=(players[curUid]?.name||'?')+' 차례...'; ti.className='turn-ind wait'; }
  }
  const ri = q('bb-round-info');
  if(ri) ri.textContent = '라운드 '+(s.maxRounds===0 ? s.round+' (무제한)' : s.round+' / '+s.maxRounds);

  renderBBGrid(s);
  renderBBPlayers(s);
  renderBBActions(s);
  renderBBLog(s);

  const we = q('board-win');
  if(we) {
    if(s.ended) {
      we.style.display = 'block';
      const wname = s.winner ? (players[s.winner]?.name||'?')+' 우승! 🏆' : '무승부';
      q('board-win-text').textContent = wname;
      showWinnerModal(wname, '부루마블 게임 종료!');
    } else we.style.display = 'none';
  }
}

// ─── 렌더: 보드 그리드 ────────────────────────────────────────────────────────

function renderBBGrid(s) {
  const bd = q('bb-board');
  if(!bd) return;
  bd.innerHTML = '';

  BB_SP.forEach(sp => {
    const [gr, gc] = bbGrid(sp.pos);
    const div = document.createElement('div');
    div.className = 'bb-space';
    div.style.gridRow = gr;
    div.style.gridColumn = gc;

    const isCorner = [0,10,20,30].includes(sp.pos);
    if(isCorner) div.classList.add('bb-corner');

    const prop = s.properties?.[sp.pos];
    const tokensHere = (s.activePlayers||[]).filter(u =>
      (s.pos?.[u]===sp.pos) && !s.bankrupt?.includes(u)
    );

    let inner = '';

    if(sp.gr) {
      // 색상 바
      const color = BB_GC[sp.gr];
      const lvl   = prop?.level || 0;
      const lvlIcon = lvl===2 ? '🏢' : lvl===1 ? '🏡' : '';
      const ownerColor = prop?.owner ? getPC(prop.owner) : 'transparent';
      inner = `<div class="bb-cbar" style="background:${color}"></div>
               <div class="bb-spnm">${esc(sp.nm)}</div>
               ${lvlIcon ? `<div class="bb-bldg">${lvlIcon}</div>` : ''}
               <div class="bb-own-dot" style="background:${ownerColor};opacity:${prop?.owner?1:0}"></div>`;
    } else {
      inner = `<div class="bb-spicon">${sp.icon||''}</div>
               <div class="bb-spnm">${esc(sp.nm)}</div>`;
    }

    // 플레이어 토큰
    if(tokensHere.length) {
      inner += `<div class="bb-tokens">${
        tokensHere.map(u=>`<div class="bb-token" style="background:${getPC(u)}" title="${esc(players[u]?.name||'')}"></div>`).join('')
      }</div>`;
    }

    div.innerHTML = inner;
    bd.appendChild(div);
  });

  // 가운데 영역
  const center = document.createElement('div');
  center.className = 'bb-center';
  center.style.gridRow = '2/11';
  center.style.gridColumn = '2/11';
  if(s.lastDice) {
    const {d1,d2,isDouble} = s.lastDice;
    const dieFace = n => ['','⚀','⚁','⚂','⚃','⚄','⚅'][n] || n;
    center.innerHTML = `
      <div style="font-size:28px;letter-spacing:4px">${dieFace(d1)} ${dieFace(d2)}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${d1}+${d2}=${d1+d2}${isDouble?' <span style="color:var(--accent)">더블!</span>':''}</div>
      <div style="font-size:9px;color:var(--muted);margin-top:8px;letter-spacing:2px">BOARD GAME</div>`;
  } else {
    center.innerHTML = `<div style="font-size:32px">🗺️</div><div style="font-size:11px;color:var(--accent);font-weight:700;margin-top:4px;letter-spacing:1px">부루마블</div>`;
  }
  bd.appendChild(center);
}

// ─── 렌더: 플레이어 패널 ──────────────────────────────────────────────────────

function renderBBPlayers(s) {
  const el = q('bb-players');
  if(!el) return;
  el.innerHTML = (s.activePlayers||[]).map(u => {
    const isBankrupt = s.bankrupt?.includes(u);
    const isJail     = s.jail?.[u]?.inJail;
    const money      = s.money?.[u] ?? 0;
    const posName    = BB_SP[s.pos?.[u]||0]?.nm || '';
    const color      = getPC(u);
    const netW       = bbNetWorth(s, u);
    return `<div class="bb-pcard${isBankrupt?' bb-bankrupt':''}" style="border-color:${color}40">
      <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
        <div class="bb-token" style="background:${color};flex-shrink:0"></div>
        <span style="font-weight:700;font-size:11px;color:${color};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(players[u]?.name||'?')}</span>
        ${isJail?'<span style="font-size:9px">🏝️</span>':''}
        ${isBankrupt?'<span style="font-size:9px;color:var(--red)">파산</span>':''}
        ${s.jailCard?.[u]?'<span style="font-size:9px">🔒</span>':''}
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--text)">${BB_W(money)}</div>
      <div style="font-size:9px;color:var(--muted);margin-top:1px">순자산 ${BB_W(netW>0?netW:0)}</div>
      <div style="font-size:9px;color:var(--muted)">${esc(posName)}</div>
    </div>`;
  }).join('');
}

// ─── 렌더: 액션 버튼 ─────────────────────────────────────────────────────────

function renderBBActions(s) {
  const el = q('bb-actions');
  if(!el) return;

  const curUid   = s.activePlayers?.[s.turnIdx];
  const isMyTurn = curUid === myUid && isActivePl();

  if(s.ended) { el.innerHTML=''; return; }

  if(s.phase === 'rolling' && isMyTurn) {
    const myJail = s.jail?.[myUid];
    const buildable = bbGetBuildable(s);

    if(myJail?.inJail) {
      const canPay  = (s.money?.[myUid]||0) >= 500000;
      const hasCard = s.jailCard?.[myUid];
      el.innerHTML = `
        <div class="bb-action-box" style="border-color:var(--red)40">
          <div style="font-size:12px;color:var(--red);font-weight:bold;margin-bottom:8px">🏝️ 무인도 감금 (${myJail.turnsLeft}턴 남음)</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${canPay  ? `<button class="btn btn-danger" onclick="bbJailPay()">💸 50만 납부</button>`:''}
            ${hasCard ? `<button class="btn btn-secondary" onclick="bbJailCard()">🔒 면제권 사용</button>`:''}
            <button class="btn btn-primary" onclick="bbDoRoll()">🎲 주사위 (더블=탈출)</button>
          </div>
          ${buildable.length?`<button class="btn btn-secondary" style="margin-top:6px;width:100%;font-size:11px" onclick="bbToggleBuild()">🏗️ 건물 건설</button>`:''}
        </div>
        <div id="bb-build-panel" style="display:none;margin-top:8px"></div>`;
    } else {
      el.innerHTML = `
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary" style="min-width:130px;font-size:13px" onclick="bbDoRoll()">🎲 주사위 굴리기</button>
          ${buildable.length?`<button class="btn btn-secondary" onclick="bbToggleBuild()">🏗️ 건설</button>`:''}
        </div>
        <div id="bb-build-panel" style="display:none;margin-top:8px"></div>`;
    }

  } else if(s.phase === 'buying' && isMyTurn) {
    const sp   = BB_SP[s.pendingPos];
    const cost = sp?.t==='airport' ? 400000 : (sp?.buy||0)*10000;
    const canBuy = (s.money?.[myUid]||0) >= cost;
    el.innerHTML = `
      <div class="bb-action-box">
        <div style="font-size:14px;font-weight:bold;margin-bottom:4px">${sp?.nm||''} 구매?</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:10px">가격: ${BB_W(cost)}</div>
        <div style="display:flex;gap:8px;justify-content:center">
          ${canBuy?`<button class="btn btn-primary" onclick="bbBuy()">✅ 구매 ${BB_W(cost)}</button>`:'<div style="font-size:11px;color:var(--red)">잔액 부족</div>'}
          <button class="btn btn-secondary" onclick="bbPass()">❌ 패스</button>
        </div>
      </div>`;

  } else if(s.phase === 'card' && isMyTurn) {
    const card = BB_CARDS.find(c => c.id === s.pendingCard);
    if(!card) { bbApplyCard(); return; }
    const needPick = card.eff === 'teleport' || card.eff === 'freebuild';
    el.innerHTML = `
      <div class="bb-action-box bb-card-box">
        <div style="font-size:28px;margin-bottom:6px">🔑</div>
        <div style="font-size:13px;font-weight:bold;margin-bottom:10px">${esc(card.txt)}</div>
        ${!needPick ? `<button class="btn btn-primary" onclick="bbApplyCard()">확인</button>` : ''}
        ${card.eff==='teleport' ? `<div style="font-size:11px;color:var(--muted);margin-bottom:6px">이동할 칸을 선택하세요</div><div id="bb-tele-grid"></div>` : ''}
        ${card.eff==='freebuild' ? `<div style="font-size:11px;color:var(--muted);margin-bottom:6px">건설할 도시를 선택하세요</div><div id="bb-fb-list"></div>` : ''}
      </div>`;
    if(card.eff==='teleport')  setTimeout(()=>renderBBTeleGrid(s), 0);
    if(card.eff==='freebuild') setTimeout(()=>renderBBFBList(s), 0);

  } else if(!isMyTurn && !s.ended) {
    el.innerHTML = `<div style="text-align:center;color:var(--muted);font-size:11px;padding:12px">${esc(players[curUid]?.name||'?')} 차례 대기 중...</div>`;
  } else {
    el.innerHTML = '';
  }
}

function renderBBTeleGrid(s) {
  const el = q('bb-tele-grid');
  if(!el) return;
  el.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:4px;max-height:180px;overflow-y:auto';
  el.innerHTML = BB_SP.map(sp =>
    `<button onclick="bbTeleport(${sp.pos})" style="font-size:9px;padding:4px 2px;border-radius:4px;background:var(--card);border:1px solid var(--border);cursor:pointer;color:var(--text)">${esc(sp.nm)}</button>`
  ).join('');
}

function renderBBFBList(s) {
  const el = q('bb-fb-list');
  if(!el) return;
  const list = bbGetBuildable(s);
  if(!list.length) { el.innerHTML='<div style="font-size:11px;color:var(--muted)">건설 가능한 도시 없음</div>'; return; }
  el.innerHTML = list.map(({sp,lv}) =>
    `<button class="btn btn-secondary" style="font-size:11px;margin-bottom:4px;width:100%" onclick="bbFreeBuild(${sp.pos})">${esc(sp.nm)} → ${lv===1?'별장🏡':'빌딩🏢'}</button>`
  ).join('');
}

function renderBBLog(s) {
  const el = q('bb-log');
  if(!el) return;
  el.innerHTML = (s.log||[]).slice().reverse().map(l =>
    `<div style="padding:2px 0;border-bottom:1px solid var(--border)20">${esc(l)}</div>`
  ).join('');
}

// ─── 건설 패널 ────────────────────────────────────────────────────────────────

let _bbBuildOpen = false;
function bbToggleBuild() {
  _bbBuildOpen = !_bbBuildOpen;
  const el = q('bb-build-panel');
  if(!el) return;
  if(!_bbBuildOpen) { el.style.display='none'; return; }
  el.style.display = 'block';
  const s = _currentGame;
  if(!s) return;
  const list = bbGetBuildable(s);
  if(!list.length) {
    el.innerHTML = '<div style="font-size:11px;color:var(--muted);text-align:center;padding:6px">건설 가능한 도시 없음<br><small>그룹 전체 소유 시 건설 가능</small></div>';
    return;
  }
  el.innerHTML = '<div style="font-size:10px;color:var(--muted);margin-bottom:6px">건설할 도시 선택</div>' +
    list.map(({sp, lv}) => {
      const cost    = lv===1 ? bbVillaCost(sp) : bbBuildUpCost(sp);
      const lvNm    = lv===1 ? '별장🏡' : '빌딩🏢';
      const canAff  = (s.money?.[myUid]||0) >= cost;
      return `<div class="bb-build-row">
        <span style="font-size:11px;font-weight:bold;flex:1">${esc(sp.nm)}</span>
        <span style="font-size:9px;color:var(--muted)">${lvNm} ${BB_W(cost)}</span>
        <button class="btn btn-primary" style="font-size:10px;padding:2px 8px" onclick="bbBuild(${sp.pos},${lv})" ${canAff?'':'disabled'}>건설</button>
      </div>`;
    }).join('') +
    '<button class="btn btn-secondary" style="width:100%;margin-top:6px;font-size:10px" onclick="bbToggleBuild()">닫기</button>';
}

function bbGetBuildable(s) {
  const result = [];
  BB_SP.filter(sp => sp.t==='prop').forEach(sp => {
    const prop = s.properties?.[sp.pos];
    if(!prop || prop.owner !== myUid) return;
    if(!bbOwnsGroup(s.properties, myUid, sp.gr)) return;
    const lv = (prop.level||0) + 1;
    if(lv <= 2) result.push({sp, lv});
  });
  return result;
}

// ─── 주사위 & 이동 ────────────────────────────────────────────────────────────

function bbDoRoll() {
  const d1 = (Math.random()*6|0)+1;
  const d2 = (Math.random()*6|0)+1;
  const preCard = BB_CARDS[(Math.random()*BB_CARDS.length)|0].id;
  _bbBuildOpen = false;

  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.ended || cur.phase !== 'rolling') return cur;
    if(cur.activePlayers[cur.turnIdx] !== myUid) return cur;

    const total    = d1+d2;
    const isDouble = d1===d2;
    cur.lastDice   = {d1, d2, total, isDouble};
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🎲 ${d1}+${d2}=${total}${isDouble?' (더블!)':''}`);

    const myJail = cur.jail?.[myUid];

    // ── 감옥 상태 ──
    if(myJail?.inJail) {
      if(isDouble) {
        cur.jail[myUid] = {inJail:false, turnsLeft:0};
        cur.doubles[myUid] = 0;
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 더블로 감옥 탈출!`);
        // 이동 계속
      } else {
        cur.jail[myUid] = {...myJail, turnsLeft: myJail.turnsLeft-1};
        if(cur.jail[myUid].turnsLeft <= 0) {
          // 벌금 내고 탈출
          const fine = 500000;
          cur.money[myUid] = (cur.money[myUid]||0) - fine;
          cur = bbCheckBankruptcy(cur, myUid, fine, null);
          cur.jail[myUid] = {inJail:false, turnsLeft:0};
          cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 감옥 벌금 -50만`);
        }
        return bbAdvanceTurn(cur, false); // 이동 없음
      }
    } else {
      // ── 더블 연속 체크 ──
      if(isDouble) {
        cur.doubles[myUid] = (cur.doubles[myUid]||0) + 1;
        if(cur.doubles[myUid] >= 3) {
          // 3연속 더블 → 감옥
          cur.pos[myUid] = 10;
          cur.jail[myUid] = {inJail:true, turnsLeft:3};
          cur.doubles[myUid] = 0;
          cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 더블 3연속! 감옥행! 🚔`);
          return bbAdvanceTurn(cur, false);
        }
      } else {
        cur.doubles[myUid] = 0;
      }
    }

    // ── 이동 ──
    const curPos = cur.pos?.[myUid] || 0;
    const newPos = (curPos + total) % 40;

    if(newPos < curPos || (curPos + total) >= 40) {
      // 출발 통과
      cur.money[myUid] = (cur.money[myUid]||0) + 200000;
      cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 출발 통과 +20만 🏁`);
    }
    if(newPos === 0) {
      // 출발 착지 추가 보너스
      cur.money[myUid] = (cur.money[myUid]||0) + 200000;
      cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 출발 착지! +20만 추가 🏁`);
    }

    cur.pos[myUid] = newPos;
    return bbHandleLanding(cur, myUid, BB_SP[newPos], isDouble, preCard);
  });
}

function bbHandleLanding(cur, uid, sp, isDouble, preCard) {
  switch(sp.t) {
    case 'start':
    case 'parking':
      return bbAdvanceTurn(cur, isDouble);

    case 'jail':
      return bbAdvanceTurn(cur, isDouble); // 그냥 방문

    case 'gotojail':
      cur.pos[uid] = 10;
      cur.jail[uid] = {inJail:true, turnsLeft:3};
      cur.doubles[uid] = 0;
      cur = bbAddLog(cur, `${players[uid]?.name||'?'}: 무인도로 이동! 🚔`);
      return bbAdvanceTurn(cur, false);

    case 'tax':
      cur.money[uid] = (cur.money[uid]||0) - sp.tax*10000;
      cur = bbAddLog(cur, `${players[uid]?.name||'?'}: 세금 -${sp.tax}만`);
      cur = bbCheckBankruptcy(cur, uid, sp.tax*10000, null);
      return bbAdvanceTurn(cur, isDouble);

    case 'card':
      cur.pendingCard  = preCard;
      cur._cardDouble  = isDouble;
      cur.phase        = 'card';
      return cur;

    case 'prop':
    case 'airport': {
      const prop = cur.properties?.[sp.pos];
      if(!prop || !prop.owner) {
        // 미소유 → 구매 제안
        cur.phase          = 'buying';
        cur.pendingPos     = sp.pos;
        cur._pendingDouble = isDouble;
        return cur;
      }
      if(prop.owner === uid) {
        cur = bbAddLog(cur, `${players[uid]?.name||'?'}: 자기 땅 (${sp.nm})`);
        return bbAdvanceTurn(cur, isDouble);
      }
      // 통행료 지불
      const rent = bbCalcRent(sp, cur.properties, sp.pos, cur);
      cur.money[uid] = (cur.money[uid]||0) - rent;
      cur.money[prop.owner] = (cur.money[prop.owner]||0) + rent;
      cur = bbAddLog(cur, `${players[uid]?.name||'?'}: ${sp.nm} 통행료 -${BB_W(rent)}`);
      cur = bbCheckBankruptcy(cur, uid, rent, prop.owner);
      return bbAdvanceTurn(cur, isDouble);
    }
    default:
      return bbAdvanceTurn(cur, isDouble);
  }
}

function bbAdvanceTurn(cur, isDouble) {
  if(cur.ended) return cur;

  // 더블이면 한 번 더
  const curUid = cur.activePlayers[cur.turnIdx];
  if(isDouble && !cur.bankrupt?.includes(curUid)) {
    cur.phase = 'rolling';
    cur = bbAddLog(cur, '더블! 한 번 더 굴리세요 🎲');
    return cur;
  }

  // 다음 활성 플레이어 탐색
  const total = cur.activePlayers.length;
  let next = (cur.turnIdx + 1) % total;
  for(let i=0; i<total; i++) {
    if(!cur.bankrupt?.includes(cur.activePlayers[next])) break;
    next = (next + 1) % total;
  }

  // 라운드 완료 체크 (0번으로 wrap-around 시)
  if(next <= cur.turnIdx) {
    cur.round = (cur.round||1) + 1;
    if(cur.maxRounds > 0 && cur.round > cur.maxRounds) {
      return bbEndByRounds(cur);
    }
  }

  cur.turnIdx = next;
  cur.phase   = 'rolling';
  return cur;
}

// ─── 구매 ─────────────────────────────────────────────────────────────────────

function bbBuy() {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase !== 'buying') return cur;
    if(cur.activePlayers[cur.turnIdx] !== myUid) return cur;
    const sp   = BB_SP[cur.pendingPos];
    if(!sp) return cur;
    const cost = sp.t==='airport' ? 400000 : sp.buy*10000;
    if((cur.money[myUid]||0) < cost) return cur;
    cur.money[myUid] = (cur.money[myUid]||0) - cost;
    if(!cur.properties) cur.properties = {};
    cur.properties[cur.pendingPos] = {owner:myUid, level:0};
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: ${sp.nm} 구매! 💰 -${BB_W(cost)}`);
    const isDouble = cur._pendingDouble;
    cur._pendingDouble = false;
    cur.pendingPos = null;
    return bbAdvanceTurn(cur, isDouble);
  });
}

function bbPass() {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase !== 'buying') return cur;
    if(cur.activePlayers[cur.turnIdx] !== myUid) return cur;
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 구매 패스`);
    const isDouble = cur._pendingDouble;
    cur._pendingDouble = false;
    cur.pendingPos = null;
    return bbAdvanceTurn(cur, isDouble);
  });
}

// ─── 감옥 ─────────────────────────────────────────────────────────────────────

function bbJailPay() {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase!=='rolling') return cur;
    if(cur.activePlayers[cur.turnIdx]!==myUid) return cur;
    if(!cur.jail?.[myUid]?.inJail) return cur;
    if((cur.money[myUid]||0) < 500000) return cur;
    cur.money[myUid] = (cur.money[myUid]||0) - 500000;
    cur.jail[myUid]  = {inJail:false, turnsLeft:0};
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 감옥 탈출 (50만 납부) 🔓`);
    return cur;
  });
}

function bbJailCard() {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase!=='rolling') return cur;
    if(cur.activePlayers[cur.turnIdx]!==myUid) return cur;
    if(!cur.jail?.[myUid]?.inJail || !cur.jailCard?.[myUid]) return cur;
    cur.jailCard[myUid] = false;
    cur.jail[myUid]     = {inJail:false, turnsLeft:0};
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 감옥 면제권 사용! 🔓`);
    return cur;
  });
}

// ─── 황금열쇠 카드 ────────────────────────────────────────────────────────────

function bbApplyCard() {
  const preCard2 = BB_CARDS[(Math.random()*BB_CARDS.length)|0].id;
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase!=='card') return cur;
    if(cur.activePlayers[cur.turnIdx]!==myUid) return cur;
    const card    = BB_CARDS.find(c => c.id===cur.pendingCard);
    const isDbl   = cur._cardDouble;
    cur._cardDouble  = false;
    cur.pendingCard  = null;
    if(!card) return bbAdvanceTurn(cur, isDbl);

    switch(card.eff) {
      case 'bonus':
        cur.money[myUid] = (cur.money[myUid]||0) + card.val;
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 +${BB_W(card.val)}`);
        return bbAdvanceTurn(cur, isDbl);
      case 'pay':
        cur.money[myUid] = (cur.money[myUid]||0) - card.val;
        cur = bbCheckBankruptcy(cur, myUid, card.val, null);
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 -${BB_W(card.val)}`);
        return bbAdvanceTurn(cur, isDbl);
      case 'again':
        cur.phase = 'rolling';
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 한 번 더!`);
        return cur;
      case 'jailcard':
        cur.jailCard[myUid] = true;
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 감옥 면제권 획득!`);
        return bbAdvanceTurn(cur, isDbl);
      case 'birthday': {
        let total = 0;
        (cur.activePlayers||[]).forEach(u => {
          if(u===myUid || cur.bankrupt?.includes(u)) return;
          const pay = Math.min(card.val, cur.money[u]||0);
          cur.money[u] = (cur.money[u]||0) - pay;
          total += pay;
        });
        cur.money[myUid] = (cur.money[myUid]||0) + total;
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 생일파티 +${BB_W(total)}`);
        return bbAdvanceTurn(cur, isDbl);
      }
      case 'nearAirport': {
        const myP = cur.pos?.[myUid]||0;
        let nearest=BB_APT_POS[0], minD=40;
        BB_APT_POS.forEach(ap=>{ const d=(ap-myP+40)%40; if(d>0&&d<minD){minD=d;nearest=ap;} });
        if(nearest < myP) cur.money[myUid]=(cur.money[myUid]||0)+200000;
        cur.pos[myUid] = nearest;
        cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 ✈️ ${BB_SP[nearest].nm}으로!`);
        const apProp = cur.properties?.[nearest];
        if(apProp?.owner && apProp.owner!==myUid) {
          const rent = bbCalcRent(BB_SP[nearest], cur.properties, nearest, cur);
          cur.money[myUid]=(cur.money[myUid]||0)-rent;
          cur.money[apProp.owner]=(cur.money[apProp.owner]||0)+rent;
          cur = bbCheckBankruptcy(cur, myUid, rent, apProp.owner);
          return bbAdvanceTurn(cur, isDbl);
        } else if(!apProp?.owner) {
          cur.pendingPos=nearest; cur._pendingDouble=isDbl; cur.phase='buying'; return cur;
        }
        return bbAdvanceTurn(cur, isDbl);
      }
      default:
        return bbAdvanceTurn(cur, isDbl);
    }
  });
}

function bbTeleport(destPos) {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase!=='card') return cur;
    if(cur.activePlayers[cur.turnIdx]!==myUid) return cur;
    const card = BB_CARDS.find(c=>c.id===cur.pendingCard);
    if(!card || card.eff!=='teleport') return cur;
    const isDbl = cur._cardDouble;
    cur._cardDouble=false; cur.pendingCard=null;
    const curP = cur.pos?.[myUid]||0;
    if(destPos<curP && destPos!==0) cur.money[myUid]=(cur.money[myUid]||0)+200000;
    cur.pos[myUid] = destPos;
    const preCard = BB_CARDS[(Math.random()*BB_CARDS.length)|0].id;
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 순간이동 → ${BB_SP[destPos].nm}`);
    return bbHandleLanding(cur, myUid, BB_SP[destPos], isDbl, preCard);
  });
}

function bbFreeBuild(pos) {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase!=='card') return cur;
    if(cur.activePlayers[cur.turnIdx]!==myUid) return cur;
    const card = BB_CARDS.find(c=>c.id===cur.pendingCard);
    if(!card||card.eff!=='freebuild') return cur;
    const sp = BB_SP[pos];
    if(!sp||sp.t!=='prop') return cur;
    if(cur.properties?.[pos]?.owner!==myUid) return cur;
    if(!bbOwnsGroup(cur.properties, myUid, sp.gr)) return cur;
    if((cur.properties[pos].level||0)>=2) return cur;
    const isDbl=cur._cardDouble; cur._cardDouble=false; cur.pendingCard=null;
    cur.properties[pos].level = (cur.properties[pos].level||0)+1;
    const lvNm = cur.properties[pos].level===1?'별장':'빌딩';
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 🔑 무료 ${lvNm} (${sp.nm})`);
    return bbAdvanceTurn(cur, isDbl);
  });
}

// ─── 건설 ─────────────────────────────────────────────────────────────────────

function bbBuild(pos, lv) {
  const sp   = BB_SP[pos];
  const cost = lv===1 ? bbVillaCost(sp) : bbBuildUpCost(sp);
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.phase!=='rolling') return cur;
    if(cur.activePlayers[cur.turnIdx]!==myUid) return cur;
    if(cur.properties?.[pos]?.owner!==myUid) return cur;
    if(!bbOwnsGroup(cur.properties, myUid, sp.gr)) return cur;
    if((cur.properties[pos].level||0) !== lv-1) return cur;
    if((cur.money[myUid]||0) < cost) return cur;
    cur.money[myUid]=(cur.money[myUid]||0)-cost;
    cur.properties[pos].level = lv;
    const lvNm=lv===1?'별장🏡':'빌딩🏢';
    cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: ${sp.nm} ${lvNm} 건설 -${BB_W(cost)}`);
    return cur;
  });
  _bbBuildOpen = false;
  const bpEl = q('bb-build-panel');
  if(bpEl) bpEl.style.display='none';
}

// ─── 파산 ─────────────────────────────────────────────────────────────────────

function bbCheckBankruptcy(cur, uid, debt, creditor) {
  if((cur.money[uid]||0) >= 0) return cur;

  // 건물 철거 후 도시 매각 시도
  const myProps = Object.entries(cur.properties||{})
    .filter(([,p])=>p.owner===uid)
    .sort(([a],[b])=>(BB_SP[+a]?.buy||0)-(BB_SP[+b]?.buy||0));

  for(const [pos, prop] of myProps) {
    const sp = BB_SP[+pos];
    if(!sp) continue;
    if(prop.level===2) {
      cur.money[uid]=(cur.money[uid]||0)+Math.round(bbBuildUpCost(sp)*0.5);
      cur.properties[pos].level=1;
      if((cur.money[uid]||0)>=0) return cur;
    }
    if(prop.level>=1) {
      cur.money[uid]=(cur.money[uid]||0)+Math.round(bbVillaCost(sp)*0.5);
      cur.properties[pos].level=0;
      if((cur.money[uid]||0)>=0) return cur;
    }
    const base = sp.t==='airport' ? 400000 : sp.buy*10000;
    cur.money[uid]=(cur.money[uid]||0)+Math.round(base*0.5);
    delete cur.properties[pos];
    if((cur.money[uid]||0)>=0) return cur;
  }

  // 여전히 파산
  cur.bankrupt = [...(cur.bankrupt||[]), uid];
  cur.money[uid] = 0;
  cur = bbAddLog(cur, `${players[uid]?.name||'?'}: 💀 파산!`);

  // 자산 이전
  if(creditor && !cur.bankrupt.includes(creditor)) {
    Object.entries(cur.properties||{})
      .filter(([,p])=>p.owner===uid)
      .forEach(([pos])=>{ cur.properties[pos]={owner:creditor,level:0}; });
  } else {
    Object.keys(cur.properties||{})
      .filter(pos=>cur.properties[pos].owner===uid)
      .forEach(pos=>{ delete cur.properties[pos]; });
  }

  // 무제한 모드: 1명 남으면 우승
  const alive = (cur.activePlayers||[]).filter(u=>!cur.bankrupt.includes(u));
  if(alive.length===1 && cur.maxRounds===0) {
    cur.winner=alive[0]; cur.ended=true; cur.phase='ended';
  }
  return cur;
}

// ─── 게임 종료 (라운드제) ─────────────────────────────────────────────────────

function bbEndByRounds(cur) {
  const nw = {};
  (cur.activePlayers||[]).forEach(u=>{ nw[u]=bbNetWorth(cur, u); });
  const alive = (cur.activePlayers||[]).filter(u=>!cur.bankrupt?.includes(u));
  const winner = alive.reduce((a,b)=>nw[a]>=nw[b]?a:b, alive[0]||cur.activePlayers[0]);
  cur.winner  = winner;
  cur.ended   = true;
  cur.phase   = 'ended';
  cur.scores  = nw;
  cur = bbAddLog(cur, `게임 종료! ${players[winner]?.name||'?'} 우승 🏆`);
  return cur;
}
