var firebaseConfig = { apiKey: "AIzaSyA3j9W9C6xyr2i90LOmzfp2rLMxLkqtGHc", authDomain: "packhacks2021.firebaseapp.com", projectId: "packhacks2021", storageBucket: "packhacks2021.appspot.com", messagingSenderId: "233589867920", appId: "1:233589867920:web:c7e1bdf16c479516a05f15" };
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();
var storage = firebase.storage();
