
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreTieEl = document.getElementById("scoreTie");
const gameModeEl = document.getElementById("gameMode");
const restartBtn = document.getElementById("restart");
const toggleSoundBtn = document.getElementById("toggleSound");
const historyList = document.getElementById("historyList");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let board = Array(9).fill(null);
let currentPlayer = "X";
let isGameOver = false;
let isSoundOn = true;
let scores = { X: 0, O: 0, Tie: 0 };

function playSound(sound, forceStop = false) {
  if (forceStop) {
    sound.pause();
    sound.currentTime = 0;
    return;
  }
  if (!isSoundOn || !sound) return;
  try {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  } catch {}
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    if (val) {
      cell.classList.add(val);
      cell.textContent = val;
    } else if (!isGameOver) {
      cell.addEventListener("click", handleMove);
    }
    boardEl.appendChild(cell);
  });
}

function handleMove(e) {
  const i = e.target.dataset.index;
  if (board[i] || isGameOver) return;
  board[i] = currentPlayer;
  playSound(clickSound);
  renderBoard();

  const winner = checkWinner();
  if (winner) {
    handleWin(winner);
  } else if (board.every(Boolean)) {
    handleTie();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = "Current Turn: " + currentPlayer;
    if (gameModeEl.value === "ai" && currentPlayer === "O") {
      setTimeout(makeAIMove, 300);
    }
  }
}

function makeAIMove() {
  playSound(winSound, true);
  const empty = board.map((v, i) => v === null ? i : null).filter(i => i !== null);
  const choice = empty[Math.floor(Math.random() * empty.length)];
  board[choice] = "O";
  playSound(clickSound);
  renderBoard();
  const winner = checkWinner();
  if (winner) handleWin(winner);
  else if (board.every(Boolean)) handleTie();
  else {
    currentPlayer = "X";
    statusEl.textContent = "Current Turn: " + currentPlayer;
  }
}

function checkWinner() {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function handleWin(winner) {
  isGameOver = true;
  playSound(winSound);
  statusEl.textContent = winner + " wins!";
  scores[winner]++;
  updateScores();
  addHistory(`${winner} won`);
}

function handleTie() {
  isGameOver = true;
  statusEl.textContent = "It's a tie!";
  scores.Tie++;
  updateScores();
  addHistory("Tie");
}

function addHistory(text) {
  const li = document.createElement("li");
  li.textContent = `Game ${historyList.children.length + 1}: ${text}`;
  historyList.prepend(li);
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreTieEl.textContent = scores.Tie;
}

restartBtn.addEventListener("click", () => {
  playSound(winSound, true);
  board = Array(9).fill(null);
  currentPlayer = "X";
  isGameOver = false;
  renderBoard();
  statusEl.textContent = "Current Turn: X";
});

toggleSoundBtn.addEventListener("click", () => {
  isSoundOn = !isSoundOn;
  toggleSoundBtn.textContent = isSoundOn ? "Sound: ON" : "Sound: OFF";
});

renderBoard();
