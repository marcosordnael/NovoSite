// Importando as funções necessárias do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Carregar configurações do Firebase do servidor
async function getFirebaseConfig() {
    const response = await fetch('/config');
    const config = await response.json();
    return config;
}

// Inicializar Firebase
let auth, db;
async function initFirebase() {
    const firebaseConfig = await getFirebaseConfig();
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}

initFirebase();

// Função de Registro
window.signUp = function () {
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var mobile = document.getElementById("mobile").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            return setDoc(doc(db, "users", user.uid), {
                firstName: fname,
                lastName: lname,
                mobile: mobile,
                email: email
            });
        })
        .then(() => {
            document.getElementById("fname").value = "";
            document.getElementById("lname").value = "";
            document.getElementById("mobile").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";

            const msgSucesso = document.getElementById('msg-sucesso');
            msgSucesso.textContent = 'Registro realizado com sucesso!';
            setTimeout(() => {
                msgSucesso.textContent = '';
            }, 3000);
        })
        .catch((error) => {
            const errorMessage = error.message;
            const msgErro = document.getElementById('msg-erro');
            msgErro.textContent = "Falha no registro: " + errorMessage;
            setTimeout(() => {
                msgErro.textContent = '';
            }, 3000);
        });
};

// Função de Login
window.signIn = function () {
    var email = document.getElementById("email2").value;
    var password = document.getElementById("password2").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            const loginSucesso = document.getElementById('login-sucesso');
            const loadingDiv = document.getElementById('loading');
            
            loginSucesso.textContent = 'Carregando';
            loadingDiv.style.display = 'flex';
            setTimeout(() => {
                loginSucesso.textContent = '';
                window.location = 'home.html';
            }, 3000);
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert("Falha no login: " + errorMessage);
        });
};

// Adicionar listener ao botão de logout após a página ser carregada
window.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erro ao realizar logout:', error);
            }
        });
    }
});

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
