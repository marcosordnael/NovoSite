import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Função para carregar configurações do Firebase do servidor
async function getFirebaseConfig() {
    const response = await fetch('/config');
    const config = await response.json();
    return config;
}

// Inicializar Firebase
async function initFirebase() {
    const firebaseConfig = await getFirebaseConfig();
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;

        auth.sendPasswordResetEmail(email)
            .then(function() {
                document.getElementById('msg-sucesso').style.display = 'block';
                document.getElementById('msg-erro').style.display = 'none';
            })
            .catch(function(error) {
                document.getElementById('msg-erro').style.display = 'block';
                document.getElementById('msg-sucesso').style.display = 'none';
                console.error("Error sending email: ", error);
            });
    });
}

initFirebase();
