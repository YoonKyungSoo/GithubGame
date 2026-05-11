
// Firebase Init
firebase.initializeApp({
  apiKey:"AIzaSyCe86yGc4w3drLnI-QJNInPYHgE9F2PoiM",
  authDomain:"github-game-72a82.firebaseapp.com",
  databaseURL:"https://github-game-72a82-default-rtdb.firebaseio.com",
  projectId:"github-game-72a82"
});
const db = firebase.database();

const PC = ['#38d9a9','#ffa94d','#9775fa','#4dabf7','#ff6b6b'];
let myUid='u'+Math.random().toString(36).substr(2,8);
let myName='', roomId='', isHost=false, hostUid='', players={}, _uidOrder=[];
let _omokPrep={mode:'solo',soloOrder:[],teamBlack:[],teamWhite:[],teamBench:[]};
let _minePrep={difficulty:'normal'};
let _rpsPrep={rounds:5};
let _oxPrep={rounds:5};
let _totals={};
let _currentGame=null, _currentType=null, _amInRound=false;
let _timer=null, _wTimer=null, _choTimer=null, _tpTimer=null, _oxTimer=null, _typingTimer=null;
let _flagMode=false;
let _leftCurrentGame=false;
const TURN_MS=10000;
const OMOK_MS=30000;
const TYPING_MS=30000;
const BINGO_TURN_MS=30000;
const BINGO_SETUP_MS=60000;
let _timerAnim=null, _timeoutKey='';
let _winnerShown=false;
