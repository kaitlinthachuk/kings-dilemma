import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBgDoAjDtgvB1FspMPKqjwIFeKxCcIaOns",
    authDomain: "kings-dilemma.firebaseapp.com",
    databaseURL: "https://kings-dilemma.firebaseio.com",
    projectId: "kings-dilemma",
    storageBucket: "kings-dilemma.appspot.com",
    messagingSenderId: "296535823923",
    appId: "1:296535823923:web:52245a4faec4511c157546"
};

firebase.initializeApp(config);
const database = firebase.database();

export { database };