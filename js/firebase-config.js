// Configuração do Firebase para o G.R.U Notícias
// Substitua os valores abaixo pelas credenciais do console do seu projeto Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyDYVM3wOFn65fxBSmHyxsyg9Zm2NMKDfWw",
    authDomain: "gru-e9858.firebaseapp.com",
    projectId: "gru-e9858",
    storageBucket: "gru-e9858.firebasestorage.app",
    messagingSenderId: "80923967383",
    appId: "1:80923967383:web:9cccc0f28d937369e20ed2",
    measurementId: "G-F3L4BH28RN"
  };

// Inicializa o Firebase (compat v8)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
