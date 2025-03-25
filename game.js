import { db, auth } from './firebase.js';
import { setDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Desenha a cobra
  ctx.fillStyle = 'blue';
  snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20));

  // Desenha a comida
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

  // Atualiza a pontuação no HTML
  document.getElementById('score').innerText = score;
}

function move() {
  let head = { ...snake[0] };
  
  // Movimento da cobra
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  // Se a cobra comer a comida, aumenta a pontuação
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  } else {
    snake.pop();
  }

  snake.unshift(head);

  // Verifica se a cobra bateu na parede ou nela mesma
  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
      snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(gameInterval);
    saveScore();
  }

  draw();
}

// Captura as teclas pressionadas
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') direction = 'UP';
  if (e.key === 's') direction = 'DOWN';
  if (e.key === 'a') direction = 'LEFT';
  if (e.key === 'd') direction = 'RIGHT';

  
  if (e.key === ' ') {
    clearInterval(gameInterval); // Para o jogo
    saveScore(); // Salva a pontuação
    alert('Você perdeu! A barra de espaço foi pressionada.');
  }
});

// Inicia o jogo ao clicar no botão "Começar Jogo"
document.getElementById('start-game').addEventListener('click', () => {
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  score = 0;
  gameInterval = setInterval(move, 150);
});

async function saveScore() {
  const user = auth.currentUser;
  if (!user) return;
  
  const userRef = doc(db, 'ranking', user.uid);
  const userSnap = await getDoc(userRef);
  
  // Se não houver pontuação ou se a nova for maior, atualiza
  if (!userSnap.exists() || score > userSnap.data().score) {
    await setDoc(userRef, {
      name: user.displayName || 'Anônimo',  // Nome do usuário
      score: score                          // A nova pontuação
    });
  }
}
