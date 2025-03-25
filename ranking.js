import { db } from './firebase.js';
import { collection, getDocs, orderBy, query, limit } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

async function loadRanking() {
  const rankingTable = document.getElementById('ranking-table');
  if (!rankingTable) return;

  rankingTable.innerHTML = '';

  const rankingRef = collection(db, 'ranking');
  const q = query(rankingRef, orderBy('score', 'desc'), limit(5));
  const querySnapshot = await getDocs(q);

  let position = 1;
  querySnapshot.forEach(doc => {
    const data = doc.data();
    const name = data.name || 'Anônimo';  // Exibe o nome registrado do usuário
    const score = data.score || 0;        // Exibe a pontuação

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${position}º</td>
      <td>${name}</td>
      <td>${score}</td>
    `;

    rankingTable.appendChild(row);
    position++;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadRanking, 500); // Pequeno delay para garantir que o Firestore carregue
});
