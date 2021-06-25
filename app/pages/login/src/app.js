const btnLogin = document.getElementById('btnLogin');

const firebaseConfig = {
  apiKey: 'AIzaSyD0vyC-dOjj-F-ewtvKdqkoS7jCpMwnWwM',
  authDomain: 'semanajsexpert4.firebaseapp.com',
  projectId: 'semanajsexpert4',
  storageBucket: 'semanajsexpert4.appspot.com',
  messagingSenderId: '303237998748',
  appId: '1:303237998748:web:dd1ea366df04d1624ee559',
  measurementId: 'G-NNP80P2PLJ',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const provider = new firebase.auth.GithubAuthProvider();

provider.addScope('read:user');

function _login() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const credential = result.credential;
      const token = credential.accessToken;

      const user = result.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
}

btnLogin.addEventListener('click', _login);
