import { FIREBASE_CONFIG } from '../../_shared/constants.js';
import UserDb from '../../_shared/userDb.js';

function redirectToLobby() {
  window.location.href = '/pages/lobby';
}

const currentUser = UserDb.get();

if (currentUser.id) {
  redirectToLobby();
}

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();

async function onLogin() {
  try {
    const provider = new firebase.auth.GithubAuthProvider();

    provider.addScope('read:user');

    const { user } = await firebase.auth().signInWithPopup(provider);

    const userData = {
      id: user.uid,
      img: user.photoURL,
      username: user.displayName,
    };

    UserDb.insert(userData);

    redirectToLobby();
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', onLogin);
