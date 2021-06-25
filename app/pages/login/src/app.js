import { FIREBASE_CONFIG } from '../../_shared/constants.js';
import UserDb from '../../_shared/userDb.js';

const btnLogin = document.getElementById('btnLogin');

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();

async function onLogin() {
  try {
    const provider = new firebase.auth.GithubAuthProvider();

    provider.addScope('read:user');

    const { user } = await firebase.auth().signInWithPopup(provider);

    const userData = {
      img: user.photoURL,
      username: user.displayName,
    };

    UserDb.insert(userData);

    window.location.href = '/pages/lobby';
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

btnLogin.addEventListener('click', onLogin);
