import { db, auth } from './firebase.js';
import { setDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const countdownElement = document.getElementById('countdown');

let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval;
let countdown = 3; // Tempo da contagem regressiva

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha a cobra
  ctx.fillStyle = 'blue';
  snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20));

  // Desenha a comida
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

  // Atualiza a pontuação
  document.getElementById('score').innerText = score;
}

function move() {
  let head = { ...snake[0] };
  direction = nextDirection;

  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
    clearInterval(gameInterval);
    saveScore();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    clearInterval(gameInterval);
    saveScore();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  } else {
    snake.pop();
  }

  snake.unshift(head);
  draw();
}

// Controles do teclado
document.addEventListener('keydown', (e) => {
  if ((e.key === 'w' || e.key === 'ArrowUp') && direction !== 'DOWN') nextDirection = 'UP';
  if ((e.key === 's' || e.key === 'ArrowDown') && direction !== 'UP') nextDirection = 'DOWN';
  if ((e.key === 'a' || e.key === 'ArrowLeft') && direction !== 'RIGHT') nextDirection = 'LEFT';
  if ((e.key === 'd' || e.key === 'ArrowRight') && direction !== 'LEFT') nextDirection = 'RIGHT';

  // Se apertar espaço, perde o jogo
  if (e.key === ' ') {
    clearInterval(gameInterval);
    saveScore();
  }
});

// Função para iniciar o jogo com contagem regressiva
document.getElementById('start-game').addEventListener('click', () => {
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  nextDirection = 'RIGHT';
  score = 0;

  countdown = 3;
  countdownElement.innerText = countdown;
  countdownElement.style.display = 'block';

  let countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownElement.innerText = countdown;
    } else {
      clearInterval(countdownInterval);
      countdownElement.style.display = 'none';
      gameInterval = setInterval(move, 150);
    }
  }, 1000);
});

// Salvar a melhor pontuação no ranking
async function saveScore() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, 'ranking', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || score > userSnap.data().score) {
    await setDoc(userRef, {
      name: user.displayName || 'Anônimo',
      score: score
    });
  }
}
