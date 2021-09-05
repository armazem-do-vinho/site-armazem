import firebase from 'firebase';
import 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBFZ4PDFLjqfT5B01pZK_jhU69soHskkKA",
    authDomain: "armazem-do-vinho-e946f.firebaseapp.com",
    databaseURL: "https://armazem-do-vinho-e946f-default-rtdb.firebaseio.com",
    projectId: "armazem-do-vinho-e946f",
    storageBucket: "armazem-do-vinho-e946f.appspot.com",
    messagingSenderId: "85558232246",
    appId: "1:85558232246:web:98854feea97f2a56a79217",
    measurementId: "G-XFMLX2TD0W"
};

firebase.initializeApp(firebaseConfig)

export default firebaseConfig;

export const firebaseAnalytics = firebase.analytics();