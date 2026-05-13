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

// SVG 보드 치수 상수
const BB_COR = 90;   // 코너 셀
const BB_CELL = 60;  // 일반 셀
const BB_SZ = 720;   // BB_COR*2 + BB_CELL*9 = 180+540

// 각 칸의 SVG 좌표 반환 {x,y,w,h,side}
function bbCellRect(pos) {
  const C=BB_COR, S=BB_CELL, Z=BB_SZ;
  if(pos===0)  return {x:Z-C, y:Z-C, w:C, h:C, side:'br'};
  if(pos===10) return {x:0,   y:Z-C, w:C, h:C, side:'bl'};
  if(pos===20) return {x:0,   y:0,   w:C, h:C, side:'tl'};
  if(pos===30) return {x:Z-C, y:0,   w:C, h:C, side:'tr'};
  if(pos>=1 &&pos<=9)  return {x:Z-C-pos*S,       y:Z-C,          w:S, h:C, side:'b'};
  if(pos>=11&&pos<=19) return {x:0,               y:Z-C-(pos-10)*S, w:C, h:S, side:'l'};
  if(pos>=21&&pos<=29) return {x:C+(pos-21)*S,    y:0,             w:S, h:C, side:'t'};
  if(pos>=31&&pos<=39) return {x:Z-C,             y:C+(pos-31)*S,  w:C, h:S, side:'r'};
  return null;
}

// 색상 밝기 조절
function bbShade(hex, amt) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, Math.min(255, (n>>16)+amt));
  const g = Math.max(0, Math.min(255, ((n>>8)&0xff)+amt));
  const b = Math.max(0, Math.min(255, (n&0xff)+amt));
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
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

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const BB_TURN_MS = 30000; // 30초 턴 타이머

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
  return withTimer({
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
  }, BB_TURN_MS);
}

// ─── 렌더: 메인 ───────────────────────────────────────────────────────────────

function passBoardTurn() {
  db.ref(`rooms/${roomId}/game/state`).transaction(cur => {
    if(!cur || cur.ended || cur.phase !== 'rolling') return cur;
    const curUid = cur.activePlayers?.[cur.turnIdx];
    cur = bbAddLog(cur, `${players[curUid]?.name||'?'}: ⏰ 시간 초과 (자동 패스)`);
    return bbAdvanceTurn(cur, false);
  });
}

function renderBoard(s) {
  renderCommonTimer(s);
  renderControls(s);
  if(isEndedState(s)) { addTotalsOnce(s); }

  // 타이머: 롤링 단계에서만 (buying/card 단계는 사용자 입력 대기라 타이머 없음)
  if(s.phase === 'rolling' && !s.ended) {
    maybeScheduleTimeout(s, 'board-' + s.turnIdx + '-' + s.round, () => passBoardTurn());
  }

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
  renderBBMoneyBar(s);
  renderBBTopActions(s);
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

// ─── 렌더: 보드 그리드 (SVG) ─────────────────────────────────────────────────

function renderBBGrid(s) {
  const bd = q('bb-board');
  if(!bd) return;
  const Z = BB_SZ, C = BB_COR;
  let o = `<svg viewBox="0 0 ${Z} ${Z}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:${Z}px;height:auto">`;
  o += `<defs>
    <linearGradient id="bbWood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7b4f2a"/>
      <stop offset="40%" stop-color="#a0673a"/>
      <stop offset="100%" stop-color="#6b3e1e"/>
    </linearGradient>
    <linearGradient id="bbFelt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2e8b57"/>
      <stop offset="100%" stop-color="#1f6b3e"/>
    </linearGradient>
    <filter id="bbShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/>
    </filter>
  </defs>`;
  // 나무 프레임 (외곽)
  o += `<rect width="${Z}" height="${Z}" rx="14" fill="url(#bbWood)"/>`;
  // 나무결 장식 줄
  for(let i=0;i<4;i++) {
    o += `<rect x="${6+i*2}" y="${6+i*2}" width="${Z-12-i*4}" height="${Z-12-i*4}" rx="${11-i}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width=".8"/>`;
  }
  // 보드 크림 배경
  o += `<rect x="8" y="8" width="${Z-16}" height="${Z-16}" rx="9" fill="#f5f0e0"/>`;
  // 중앙 펠트
  o += `<rect x="${C}" y="${C}" width="${Z-C*2}" height="${Z-C*2}" fill="url(#bbFelt)"/>`;
  // 중앙 내용 (주사위/타이틀)
  o += bbSVGCenter(s, C, C, Z - C*2);
  // 40칸
  BB_SP.forEach(sp => { const r=bbCellRect(sp.pos); if(r) o+=bbSVGCell(sp,r,s); });
  // 전체 보드 얇은 테두리
  o += `<rect x="8" y="8" width="${Z-16}" height="${Z-16}" rx="9" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>`;
  o += '</svg>';
  bd.innerHTML = o;
}

// 중앙 영역
function bbSVGCenter(s, cx, cy, cs) {
  const tx=cx+cs/2, ty=cy+cs/2;
  // 펠트 배경은 renderBBGrid에서 이미 그림 — 여기서는 내부 장식만
  let o='';
  // 얇은 금색 테두리
  o += `<rect x="${cx+4}" y="${cy+4}" width="${cs-8}" height="${cs-8}" fill="none" stroke="rgba(200,160,80,0.35)" stroke-width="1.5" rx="3"/>`;
  if(s.lastDice) {
    const {d1,d2,isDouble}=s.lastDice;
    const dSz=80;
    o += bbDiceSVG(d1, tx-dSz-6, ty-dSz/2, dSz);
    o += bbDiceSVG(d2, tx+6,     ty-dSz/2, dSz);
    o+=`<text x="${tx}" y="${ty+52}" text-anchor="middle" font-size="18" fill="#d4edda" font-family="'Courier New',monospace" font-weight="bold">${d1}+${d2}=${d1+d2}</text>`;
    if(isDouble) o+=`<text x="${tx}" y="${ty+76}" text-anchor="middle" font-size="15" fill="#90ee90" font-family="'Courier New',monospace">✨ 더블! 한 번 더!</text>`;
  } else {
    o+=`<text x="${tx}" y="${ty-26}" text-anchor="middle" font-size="72">🗺️</text>`;
    o+=`<text x="${tx}" y="${ty+36}" text-anchor="middle" font-size="26" fill="#d4edda" font-weight="bold" font-family="'Courier New',monospace" letter-spacing="5">부루마블</text>`;
    o+=`<text x="${tx}" y="${ty+58}" text-anchor="middle" font-size="12" fill="rgba(200,240,210,0.45)" font-family="'Courier New',monospace" letter-spacing="3">BOARD GAME</text>`;
  }
  // ── 주사위 버튼 (SVG 중앙 하단 / 내 차례 + rolling + 감옥 아님) ──
  const _cu = s.activePlayers?.[s.turnIdx];
  const _showDice = !s.ended && s.phase==='rolling' &&
                    typeof myUid!=='undefined' && _cu===myUid &&
                    typeof isActivePl==='function' && isActivePl() &&
                    !s.jail?.[myUid]?.inJail;
  if(_showDice) {
    const bW=220, bH=70, bx=tx-bW/2, by=cy+cs-bH-18;
    o += `<g onclick="bbDoRoll()" style="cursor:pointer" role="button">
      <rect x="${bx}" y="${by}" width="${bW}" height="${bH}" rx="18" fill="#38d9a9" filter="url(#bbShadow)"/>
      <rect x="${bx+2}" y="${by+2}" width="${bW-4}" height="${bH-4}" rx="16" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1.5"/>
      ${bbDiceSVG(6, bx+10, by+8, 54)}
      <text x="${tx+26}" y="${by+29}" text-anchor="middle" font-size="19" fill="#04110c" font-weight="900" font-family="'Courier New',monospace">🎲 주사위</text>
      <text x="${tx+26}" y="${by+51}" text-anchor="middle" font-size="14" fill="#04110c" font-weight="700" font-family="'Courier New',monospace">굴리기!</text>
    </g>`;
  }
  return o;
}

// 칸 디스패처
function bbSVGCell(sp, r, s) {
  const prop = s.properties?.[sp.pos];
  const tok  = (s.activePlayers||[]).filter(u=>s.pos?.[u]===sp.pos&&!s.bankrupt?.includes(u));
  if(['br','bl','tl','tr'].includes(r.side)) return bbSVGCorner(sp,r,s,tok);
  if(sp.gr)  return bbSVGProp(sp,r,s,prop,tok);
  return bbSVGSpecial(sp,r,s,tok);
}

// ── 코너 칸 ──
function bbSVGCorner(sp, r, s, tok) {
  const {x,y,w,h,side}=r;
  const cx=x+w/2, cy=y+h/2;
  const cfg={
    0: {bg:'#e8f5e9',border:'#43a047',icon:'🏁',nm:'출발',nc:'#1b5e20',sub:'+20만',sc:'#2e7d32'},
    10:{bg:'#fff8e1',border:'#fb8c00',icon:'🏝️',nm:'무인도',nc:'#bf360c',sub:'감옥',sc:'#e65100'},
    20:{bg:'#e3f2fd',border:'#1e88e5',icon:'🅿️',nm:'무료주차',nc:'#0d47a1',sub:'FREE',sc:'#1565c0'},
    30:{bg:'#fce4ec',border:'#e53935',icon:'🚓',nm:'무인도로',nc:'#b71c1c',sub:'이동!',sc:'#c62828'},
  }[sp.pos]||{bg:'#f5f0e0',border:'#999',icon:sp.icon||'',nm:sp.nm,nc:'#333',sub:'',sc:''};
  let o=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cfg.bg}"/>`;
  // 컬러 테두리 (inner side만: 코너에 따라 2면)
  const bw=3;
  if(sp.pos===0)  { o+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="${cfg.border}"/>`;o+=`<rect x="${x}" y="${y}" width="${w}" height="${bw}" fill="${cfg.border}"/>`; }
  if(sp.pos===10) { o+=`<rect x="${x+w-bw}" y="${y}" width="${bw}" height="${h}" fill="${cfg.border}"/>`;o+=`<rect x="${x}" y="${y}" width="${w}" height="${bw}" fill="${cfg.border}"/>`; }
  if(sp.pos===20) { o+=`<rect x="${x+w-bw}" y="${y}" width="${bw}" height="${h}" fill="${cfg.border}"/>`;o+=`<rect x="${x}" y="${y+h-bw}" width="${w}" height="${bw}" fill="${cfg.border}"/>`; }
  if(sp.pos===30) { o+=`<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="${cfg.border}"/>`;o+=`<rect x="${x}" y="${y+h-bw}" width="${w}" height="${bw}" fill="${cfg.border}"/>`; }
  // 아이콘 (크게)
  o+=`<text x="${cx}" y="${cy-12}" text-anchor="middle" dominant-baseline="middle" font-size="38">${cfg.icon}</text>`;
  // 이름
  o+=`<text x="${cx}" y="${cy+20}" text-anchor="middle" font-size="${cfg.nm.length>4?9:11}" fill="${cfg.nc}" font-family="'Courier New',monospace" font-weight="bold">${cfg.nm}</text>`;
  if(cfg.sub) o+=`<text x="${cx}" y="${cy+34}" text-anchor="middle" font-size="8.5" fill="${cfg.sc}" font-family="'Courier New',monospace">${cfg.sub}</text>`;
  // 전체 외곽선
  o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1"/>`;
  tok.forEach((u,i)=>{o+=bbTokenSVG(x+12+i*18, y+14, getPC(u));});
  return o;
}

// ── 도시 칸 ──
function bbSVGProp(sp, r, s, prop, tok) {
  const {x,y,w,h,side}=r;
  const col=BB_GC[sp.gr], level=prop?.level||0;
  const ownerCol=prop?.owner?getPC(prop.owner):null;
  const BAR=12; // 색상 바 두께
  // 크림 배경
  let o=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fdfcf7"/>`;
  // 색상 바 (안쪽 모서리)
  let bx,by,bw,bh;
  if(side==='b')     {bx=x;       by=y;       bw=w;   bh=BAR;}
  else if(side==='t'){bx=x;       by=y+h-BAR; bw=w;   bh=BAR;}
  else if(side==='l'){bx=x+w-BAR; by=y;       bw=BAR; bh=h;}
  else               {bx=x;       by=y;       bw=BAR; bh=h;}
  o+=`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${col}"/>`;
  // 건물: b/t는 셀 내부에, l/r는 바 위에 소형으로
  if(level>=1) {
    if(side==='b')      o+=bbBuildingSVG(x+w/2, y+BAR+64, level, col);
    else if(side==='t') o+=bbBuildingSVG(x+w/2, y+52,     level, col);
    else                o+=bbBuildingSVG(bx+bw/2, by+bh/2, level, col, true);
  }
  // 텍스트 위치 계산
  let ntx,nmy,pry;
  if(side==='b')     {ntx=x+w/2;           nmy=y+BAR+24; pry=y+BAR+38;}
  else if(side==='t'){ntx=x+w/2;           nmy=y+20;     pry=y+34;}
  else if(side==='l'){ntx=x+(w-BAR)/2;     nmy=y+h/2-6;  pry=y+h/2+8;}
  else               {ntx=x+BAR+(w-BAR)/2; nmy=y+h/2-6;  pry=y+h/2+8;}
  const nm=esc(sp.nm);
  const nmFz=nm.length>4?8:9.5;
  o+=`<text x="${ntx}" y="${nmy}" text-anchor="middle" font-size="${nmFz}" fill="#1a1a1a" font-family="'Courier New',monospace" font-weight="bold">${nm}</text>`;
  o+=`<text x="${ntx}" y="${pry}" text-anchor="middle" font-size="7.5" fill="#555" font-family="'Courier New',monospace">${sp.buy}만</text>`;
  // 소유자 도트
  if(ownerCol){
    let ox,oy;
    if(side==='b')     {ox=x+w-9; oy=y+h-10;}
    else if(side==='t'){ox=x+w-9; oy=y+BAR+10;}
    else if(side==='l'){ox=x+9;   oy=y+9;}
    else               {ox=x+w-9; oy=y+9;}
    o+=`<circle cx="${ox}" cy="${oy}" r="6" fill="${ownerCol}" stroke="#fff" stroke-width="1.5"/>`;
  }
  // 테두리
  o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width=".75"/>`;
  // 토큰 (사람 모양)
  tok.forEach((u,i)=>{
    const[tx2,ty2]=bbTokPos(x,y,w,h,side,i);
    o+=bbTokenSVG(tx2, ty2, getPC(u));
  });
  return o;
}

// ── 특수 칸 (황금열쇠 / 세금 / 공항) ──
function bbSVGSpecial(sp, r, s, tok) {
  const {x,y,w,h,side}=r;
  const tx=x+w/2, ty=y+h/2;
  const isV=(side==='b'||side==='t');
  // 배경색 결정
  const bgMap={card:'#fffde7',tax:'#fff5f5',airport:'#f0f8ff'};
  const bg=bgMap[sp.t]||'#fdfcf7';
  let o=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>`;
  const iSz=isV?22:17;
  // 아이콘 y위치
  const iconY = isV ? ty-10 : ty-8;
  const nm1Y  = isV ? ty+12 : ty+10;
  const nm2Y  = isV ? ty+23 : ty+21;
  if(sp.t==='card'){
    o+=`<text x="${tx}" y="${iconY}" text-anchor="middle" dominant-baseline="middle" font-size="${iSz}">🔑</text>`;
    o+=`<text x="${tx}" y="${nm1Y}" text-anchor="middle" font-size="8" fill="#b8860b" font-family="'Courier New',monospace" font-weight="bold">황금열쇠</text>`;
  } else if(sp.t==='tax'){
    o+=`<text x="${tx}" y="${iconY}" text-anchor="middle" dominant-baseline="middle" font-size="${iSz}">💸</text>`;
    o+=`<text x="${tx}" y="${nm1Y}" text-anchor="middle" font-size="9" fill="#cc2222" font-family="'Courier New',monospace" font-weight="bold">세금</text>`;
    o+=`<text x="${tx}" y="${nm2Y}" text-anchor="middle" font-size="8" fill="#aa2222" font-family="'Courier New',monospace">${sp.tax}만원</text>`;
  } else if(sp.t==='airport'){
    const prop=s.properties?.[sp.pos];
    const oCol=prop?.owner?getPC(prop.owner):null;
    o+=`<text x="${tx}" y="${iconY}" text-anchor="middle" dominant-baseline="middle" font-size="${iSz}">✈️</text>`;
    const apnm=esc(sp.nm); const apFz=apnm.length>5?7:8;
    o+=`<text x="${tx}" y="${nm1Y}" text-anchor="middle" font-size="${apFz}" fill="#1565c0" font-family="'Courier New',monospace" font-weight="bold">${apnm}</text>`;
    if(oCol) o+=`<circle cx="${x+w-9}" cy="${y+9}" r="5.5" fill="${oCol}" stroke="#fff" stroke-width="1.2"/>`;
  }
  o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width=".75"/>`;
  tok.forEach((u,i)=>{
    const[tx2,ty2]=bbTokPos(x,y,w,h,side,i);
    o+=bbTokenSVG(tx2, ty2, getPC(u));
  });
  return o;
}

// ── 주사위 SVG (에셋 기반) ──
function bbDiceSVG(n, x, y, sz) {
  const r=sz/60;
  const dps={1:[[30,30]],2:[[18,18],[42,42]],3:[[18,18],[30,30],[42,42]],
    4:[[18,18],[42,18],[18,42],[42,42]],5:[[18,18],[42,18],[30,30],[18,42],[42,42]],
    6:[[18,15],[42,15],[18,30],[42,30],[18,45],[42,45]]};
  const dots=(dps[n]||[]);
  let o=`<g transform="translate(${x},${y}) scale(${r})">`;
  o+=`<rect x="1" y="1" width="58" height="58" rx="9" fill="white" stroke="#ccc" stroke-width="1.5"/>`;
  dots.forEach(([dx,dy])=>{o+=`<circle cx="${dx}" cy="${dy}" r="5.5" fill="#2c2c2a"/>`;});
  o+='</g>';
  return o;
}

// ── 플레이어 토큰 SVG (에셋: 사람 모양) ──
// cx,cy = 토큰 중심 좌표
function bbTokenSVG(cx, cy, color) {
  const s=0.27; // 60×80 → 16×21.6
  const tx=cx-30*s, ty=cy-38*s;
  return `<g transform="translate(${tx},${ty}) scale(${s})">
    <ellipse cx="30" cy="72" rx="18" ry="6" fill="${color}" opacity="0.28"/>
    <ellipse cx="30" cy="60" rx="14" ry="8" fill="${color}"/>
    <rect x="22" y="28" width="16" height="32" rx="4" fill="${color}"/>
    <circle cx="30" cy="22" r="14" fill="${color}"/>
    <circle cx="25" cy="19" r="3.5" fill="white" opacity="0.85"/>
    <circle cx="35" cy="19" r="3.5" fill="white" opacity="0.85"/>
    <path d="M24 26 Q30 31 36 26" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>`;
}

// ── 건물 SVG (에셋: 집/호텔 모양) ──
// cx,cy = 건물 중심, small=true이면 바 위에 표시할 초소형
function bbBuildingSVG(cx, cy, level, color, small=false) {
  const dark=bbShade(color,-55);
  if(level===1) {
    const s=small?0.18:0.46;
    const tx=cx-25*s, ty=cy-24*s; // 집의 무게중심 약 (25,24) 기준
    return `<g transform="translate(${tx},${ty}) scale(${s})">
      <polygon points="25,5 45,22 5,22" fill="${dark}"/>
      <rect x="12" y="22" width="26" height="20" fill="${color}" rx="1"/>
      <rect x="20" y="30" width="10" height="12" fill="rgba(0,0,0,0.38)" rx="1"/>
    </g>`;
  } else {
    const s=small?0.16:0.40;
    const tx=cx-30*s, ty=cy-30*s;
    return `<g transform="translate(${tx},${ty}) scale(${s})">
      <rect x="8" y="20" width="44" height="34" fill="${color}" rx="2"/>
      <polygon points="30,4 52,20 8,20" fill="${dark}"/>
      <rect x="14" y="26" width="8" height="8" fill="rgba(255,255,255,0.75)" rx="1"/>
      <rect x="26" y="26" width="8" height="8" fill="rgba(255,255,255,0.75)" rx="1"/>
      <rect x="38" y="26" width="8" height="8" fill="rgba(255,255,255,0.75)" rx="1"/>
      <rect x="24" y="38" width="12" height="14" fill="rgba(0,0,0,0.35)" rx="1"/>
    </g>`;
  }
}

// ── 토큰 위치 (사람 모형: 16px 폭, 22px 높이) ──
function bbTokPos(x, y, w, h, side, idx) {
  const off=idx*15;
  switch(side){
    case'b': return[x+9+off, y+h-14];
    case't': return[x+9+off, y+14];
    case'l': return[x+9,     y+12+off];
    case'r': return[x+w-9,   y+12+off];
    default: return[x+w/2,   y+h/2];
  }
}

// ─── 렌더: 플레이어 자본금 바 (상단 가로형) ──────────────────────────────────

function renderBBPlayers(s) { renderBBMoneyBar(s); } // 하위 호환

function renderBBMoneyBar(s) {
  const el = q('bb-money-bar');
  if(!el) return;
  el.innerHTML = (s.activePlayers||[]).map(u => {
    const isBankrupt = s.bankrupt?.includes(u);
    const isJail     = s.jail?.[u]?.inJail;
    const money      = s.money?.[u] ?? 0;
    const posName    = BB_SP[s.pos?.[u]||0]?.nm || '';
    const color      = getPC(u);
    const netW       = bbNetWorth(s, u);
    const isCur      = s.activePlayers?.[s.turnIdx]===u && !s.ended;
    // 사람 토큰 미니 SVG
    const tokSVG=`<svg width="22" height="30" viewBox="0 0 60 80" style="flex-shrink:0">
      <ellipse cx="30" cy="72" rx="18" ry="6" fill="${color}" opacity="0.25"/>
      <ellipse cx="30" cy="60" rx="14" ry="8" fill="${color}"/>
      <rect x="22" y="28" width="16" height="32" rx="4" fill="${color}"/>
      <circle cx="30" cy="22" r="14" fill="${color}"/>
      <circle cx="25" cy="19" r="3.5" fill="white" opacity="0.85"/>
      <circle cx="35" cy="19" r="3.5" fill="white" opacity="0.85"/>
      <path d="M24 26 Q30 31 36 26" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`;
    return `<div class="bb-mcard${isBankrupt?' bb-bankrupt':''}${isCur?' bb-mcard-cur':''}" style="border-color:${color}${isCur?'':'55'}">
      ${tokSVG}
      <div style="flex:1;min-width:0">
        <div style="font-size:10px;font-weight:bold;color:${color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70px">
          ${esc(players[u]?.name?.slice(0,6)||'?')}${isJail?' 🏝️':''}${isBankrupt?' 💀':''}
        </div>
        <div style="font-size:13px;font-weight:800;color:var(--text);line-height:1.2">${BB_W(money)}</div>
        <div style="font-size:9px;color:var(--muted)">${esc(posName)}</div>
      </div>
    </div>`;
  }).join('');
}

// ─── 렌더: 상단 액션 (구매 / 카드 / 감옥 / 건설) ──────────────────────────────

function renderBBTopActions(s) {
  const el = q('bb-top-actions');
  if(!el) return;

  const curUid   = s.activePlayers?.[s.turnIdx];
  const isMyTurn = curUid === myUid && isActivePl();

  if(s.ended) { el.innerHTML=''; return; }

  if(s.phase === 'rolling' && isMyTurn) {
    const myJail   = s.jail?.[myUid];
    const buildable = bbGetBuildable(s);

    if(myJail?.inJail) {
      // 감옥: 납부/면제권/더블 버튼을 상단에 표시
      const canPay  = (s.money?.[myUid]||0) >= 500000;
      const hasCard = s.jailCard?.[myUid];
      el.innerHTML = `<div class="bb-action-box bb-jail-box">
        <span style="font-size:12px;color:var(--red);font-weight:bold;margin-right:8px">🏝️ 무인도 감금 (${myJail.turnsLeft}턴)</span>
        ${canPay  ? `<button class="btn btn-danger"     style="font-size:11px;padding:4px 10px" onclick="bbJailPay()">💸 50만 납부</button>` : ''}
        ${hasCard ? `<button class="btn btn-secondary"  style="font-size:11px;padding:4px 10px" onclick="bbJailCard()">🔒 면제권 사용</button>` : ''}
        <button class="btn btn-primary" style="font-size:11px;padding:4px 10px" onclick="bbDoRoll()">🎲 더블로 탈출</button>
        ${buildable.length ? `<button class="btn btn-secondary" style="font-size:11px;padding:4px 10px" onclick="bbToggleBuild()">🏗️ 건물</button>` : ''}
      </div>
      <div id="bb-build-panel" style="display:none;margin-top:6px"></div>`;
    } else {
      // 일반 차례: 주사위는 SVG 안에 있으므로 건설 버튼만
      el.innerHTML = buildable.length
        ? `<div class="bb-action-row">
             <button class="btn btn-secondary" style="font-size:11px;padding:4px 12px" onclick="bbToggleBuild()">🏗️ 건물 건설</button>
           </div>
           <div id="bb-build-panel" style="display:none;margin-top:6px"></div>`
        : `<div id="bb-build-panel" style="display:none"></div>`;
    }

  } else if(s.phase === 'buying' && isMyTurn) {
    const sp   = BB_SP[s.pendingPos];
    const cost = sp?.t==='airport' ? 400000 : (sp?.buy||0)*10000;
    const canBuy = (s.money?.[myUid]||0) >= cost;
    el.innerHTML = `<div class="bb-action-box bb-buy-box">
      <span style="font-size:14px;font-weight:bold;margin-right:8px">${esc(sp?.nm||'')} 구매?</span>
      <span style="font-size:11px;color:var(--muted);margin-right:10px">가격 ${BB_W(cost)}</span>
      ${canBuy ? `<button class="btn btn-primary" style="font-size:12px;padding:5px 14px" onclick="bbBuy()">✅ 구매</button>` : `<span style="font-size:11px;color:var(--red);margin-right:8px">잔액 부족</span>`}
      <button class="btn btn-secondary" style="font-size:12px;padding:5px 12px" onclick="bbPass()">❌ 패스</button>
    </div>`;

  } else if(s.phase === 'card' && isMyTurn) {
    const card = BB_CARDS.find(c => c.id === s.pendingCard);
    if(!card) { bbApplyCard(); return; }
    const needPick = card.eff === 'teleport' || card.eff === 'freebuild';
    el.innerHTML = `<div class="bb-action-box bb-card-box">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:24px">🔑</span>
        <span style="font-size:12px;font-weight:bold;flex:1;min-width:0">${esc(card.txt)}</span>
        ${!needPick ? `<button class="btn btn-primary" style="font-size:12px;padding:5px 14px" onclick="bbApplyCard()">확인</button>` : ''}
      </div>
      ${card.eff==='teleport'  ? `<div style="margin-top:6px;font-size:10px;color:var(--muted);margin-bottom:4px">이동할 칸 선택</div><div id="bb-tele-grid"></div>` : ''}
      ${card.eff==='freebuild' ? `<div style="margin-top:6px;font-size:10px;color:var(--muted);margin-bottom:4px">건설할 도시 선택</div><div id="bb-fb-list"></div>` : ''}
    </div>`;
    if(card.eff==='teleport')  setTimeout(()=>renderBBTeleGrid(s), 0);
    if(card.eff==='freebuild') setTimeout(()=>renderBBFBList(s), 0);

  } else if(!isMyTurn && !s.ended) {
    el.innerHTML = `<div class="bb-waiting-row">${esc(players[curUid]?.name||'?')} 차례 대기 중...</div>`;
  } else {
    el.innerHTML = '';
  }
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
      // 주사위는 오버레이가 담당 — 여기에는 건설 버튼만
      el.innerHTML = buildable.length
        ? `<div style="display:flex;gap:8px;justify-content:center">
             <button class="btn btn-secondary" onclick="bbToggleBuild()">🏗️ 건물 건설</button>
           </div>
           <div id="bb-build-panel" style="display:none;margin-top:8px"></div>`
        : `<div id="bb-build-panel" style="display:none"></div>`;
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
  const myPos = s.pos?.[myUid] || 0;
  el.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:4px;max-height:180px;overflow-y:auto';
  el.innerHTML = BB_SP
    .filter(sp => sp.pos !== myPos) // 현재 위치 제외
    .map(sp =>
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

    // 출발점 통과 시만 20만 지급 (착지 추가 보너스 없음)
    if((curPos + total) >= 40) {
      cur.money[myUid] = (cur.money[myUid]||0) + 200000;
      cur = bbAddLog(cur, `${players[myUid]?.name||'?'}: 출발 통과 +20만 🏁`);
    }

    cur.pos[myUid] = newPos;
    cur = bbHandleLanding(cur, myUid, BB_SP[newPos], isDouble, preCard);
    // 이동 후 타이머 리셋 (다음 턴 또는 구매/카드 페이즈 시작)
    if(!cur.ended && cur.phase === 'rolling') cur = resetTimerFields(cur);
    return cur;
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

  // 라운드 완료 체크: 인덱스가 앞으로 되감길 때만
  if(next < cur.turnIdx) {
    cur.round = (cur.round||1) + 1;
    if(cur.maxRounds > 0 && cur.round > cur.maxRounds) {
      return bbEndByRounds(cur);
    }
  }

  cur.turnIdx = next;
  cur.phase   = 'rolling';
  return resetTimerFields(cur);
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
    // 건설 후 턴 넘김
    return bbAdvanceTurn(cur, false);
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

  // 1명 남으면 항상 우승 (라운드제/무제한 모두)
  const alive = (cur.activePlayers||[]).filter(u=>!cur.bankrupt.includes(u));
  if(alive.length<=1) {
    cur.winner=alive[0]||null; cur.ended=true; cur.phase='ended';
    if(alive[0]) cur = bbAddLog(cur, `${players[alive[0]]?.name||'?'}: 최후 생존 우승! 🏆`);
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
