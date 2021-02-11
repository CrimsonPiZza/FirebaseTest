
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBZs-jLVjpml81XhHuhrFRdG2IRme6G6Dc",
        authDomain: "online-remote-classroom-e2452.firebaseapp.com",
        databaseURL: "https://online-remote-classroom-e2452.firebaseio.com",
        projectId: "online-remote-classroom-e2452",
        storageBucket: "online-remote-classroom-e2452.appspot.com",
        messagingSenderId: "196649677503",
        appId: "1:196649677503:web:6aad9caa026db2baf48c0a"
      };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();

    getElement = (x) => document.getElementById(x)

    googleSignIn = () => {
        var base_provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().languageCode = 'en';

        firebase.auth().signInWithPopup(base_provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            
            // ...
            }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            });
    }

    signUp = () => {
        const email = getElement("email_txt").value
        const password = getElement("pass_txt").value
        const name = prompt("Enter your Display Name")
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("Error Code : " + errorCode)
            console.log(errorMessage)
        }).then(()=>{
            var user = firebase.auth().currentUser;

            user.updateProfile({
            displayName: name,
            photoURL: "https://scontent.fpnh10-1.fna.fbcdn.net/v/t1.0-9/s960x960/72756944_1314460125388290_4375114061507985408_o.jpg?_nc_cat=101&_nc_oc=AQl5icowEpRSwnDW-F0tNXFaW80-VJukZ8ym69kiuGptHjHdkW_IBbEmz5-WsMoz2_0&_nc_ht=scontent.fpnh10-1.fna&oh=b9d32f53c4d4af57e685b7262b366e8b&oe=5E49E697"
            }).then(function() {
            console.log("Updated as successfully")
            }).catch(function(error) {
            // An error happened.
            });
        });
    }

    emailSingIn = () => {
        const email = getElement("email_txt").value
        const password = getElement("pass_txt").value
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("Error Code : " + errorCode)
            console.log(errorMessage)
        })
    }
    
    auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser){
            console.log("Signed In as " + firebaseUser.email + " !...")
            console.log(firebaseUser)
            
            var db = firebase.firestore();
            db.collection("Users").doc(firebaseUser.uid).get().then(function(doc){
                if (doc.exists){
                    window.location.replace("logged.html");
                }else{
                    db.collection("Users").doc(firebaseUser.uid).set({
                        classOwnership : [],
                        classParticipated : [],
                        email : firebaseUser.email
                    }).then(() => {
                        window.location.replace("/logged.html")
                    })
                }
            })
        }else{
            console.log("Not logged in...")
        }
    });
