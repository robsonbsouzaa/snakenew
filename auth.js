import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Cadastro de novo usuário
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    // Criação do usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar o nome do usuário no Firebase Auth
    await updateProfile(user, {
      displayName: name
    });

    // Salvar nome e email no Firestore
    await setDoc(doc(db, 'users', user.uid), { name, email, score: 0 });
    
    alert('Conta criada com sucesso! Redirecionando para o jogo.');
    window.location.href = 'game.html';
  } catch (error) {
    alert('Erro ao criar conta: ' + error.message);
  }
});

// Login de usuário existente
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Login bem-sucedido! Redirecionando para o jogo.');
    window.location.href = 'game.html';
  } catch (error) {
    alert('Erro ao fazer login: ' + error.message);
  }
});
