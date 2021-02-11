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
    
    var db = firebase.firestore();

    getElement = (x) => document.getElementById(x)

    const auth = firebase.auth();

    auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser){
            console.log("Signed In as " + firebaseUser.email + " !...")
            var image = getElement("pf_pic")
            var username = getElement("name_box")
            var email = getElement("gmail_box")
            queryClass(firebaseUser.email)

            image.setAttribute("src",firebaseUser.photoURL)
            username.value = firebaseUser.displayName
            email.value = firebaseUser.email
        }else{
            window.location.replace("/index.html")
            console.log("Not logged in...")
        }
    });

    updatePf = () => {
        var user = firebase.auth().currentUser;
        user.updateProfile({
        photoURL: "https://scontent.fpnh10-1.fna.fbcdn.net/v/t1.0-9/s960x960/72756944_1314460125388290_4375114061507985408_o.jpg?_nc_cat=101&_nc_oc=AQl5icowEpRSwnDW-F0tNXFaW80-VJukZ8ym69kiuGptHjHdkW_IBbEmz5-WsMoz2_0&_nc_ht=scontent.fpnh10-1.fna&oh=b9d32f53c4d4af57e685b7262b366e8b&oe=5E49E697"
        }).then(function() {
        console.log("Updated as successfully")
        }).catch(function(error) {
        // An error happened.
        });
    }

    signOut = () => {
        firebase.auth().signOut().then(function() {
        // Sign-out successful.        
        console.log("Signed out!")
        window.location.replace("/index.html");
        }).catch(function(error) {
        // An error happened.
        });
    }
    
    queryClass = (email) => {
        var user = firebase.auth().currentUser
        //Get document collection from firestore based on user email
        db.collection("Users").doc(user.uid)
            .get()
            .then(function(doc) {
                // Add items owned class collection from firestore
                doc.data().classOwnership.forEach((item)=>{
                            db.collection("Classes").doc(item).get()
                            .then(function(foundClass) {
                                console.log(foundClass.data())
                                const joinedClass = foundClass.data()
                                var option = document.createElement("option")
                                option.setAttribute("value",joinedClass.code)
                                option.innerHTML = joinedClass.code + " - " + joinedClass.classroomName
                                var selectBox = getElement("inputGroupSelect01")                              
                                selectBox.appendChild(option)
                            })
                        })
                // Add items joined class collection from firestore
                doc.data().classParticipated.forEach((item)=>{
                            db.collection("Classes").doc(item).get()
                            .then(function(foundClass) {
                                const participatedClass = foundClass.data()
                                var option = document.createElement("option")
                                option.setAttribute("value",participatedClass.code)
                                option.innerHTML = participatedClass.code + " - " +  participatedClass.classroomName
                                var selectBox = getElement("inputGroupSelect02")
                                selectBox.appendChild(option)
                            })
                        })
                console.log("Class data received....")
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        
        
        console.log("Query Excecuted...")
        console.log("Please wait for data arrival")
    }
    
    makeUniqueID = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    createNewClass = () => {
        className = prompt("Enter your new Class Name : ")
        if (className != "" && className != null){
            appendNewClassToDB(className)
        }else{
            createNewClass()
        }       
    }

    appendNewClassToDB = (className) => {
        randomCode = makeUniqueID(6)
        db.collection("Classes").doc(randomCode).get().then(function (doc) {
            if (!doc.exists) {
                var user = firebase.auth().currentUser;
                console.log(user)
                const newClass = {
                    classroomName : className,
                    code : randomCode,
                    owner : user.email,
                    members : []
                }
                db.collection("Classes").doc(randomCode).set(newClass).then(() => {
                    appendNewOption(className,randomCode,"inputGroupSelect01")
                    appendNewOption(className,randomCode,"inputGroupSelect02")
                })
                // db.collection("Users").where("email", "==", user.email).update({
                //     classOwnership : firebase.firestore.FieldValue.arrayUnion(randomCode)
                // })
                /* */db.collection("Users").doc(user.uid)
                .update({
                    classOwnership : firebase.firestore.FieldValue.arrayUnion(randomCode),
                    classParticipated : firebase.firestore.FieldValue.arrayUnion(randomCode)
                })
                // .then(function(oldDoc) {
                //     if (oldDoc.exists){
                //         console.log("Empty")
                //     }else{
                //         classOwned = oldDoc.data().classOwnership
                //         classJoined = oldDoc.data().classParticipated
                //         classOwned.push(randomCode)
                //         classJoined.push(randomCode)
                //         db.collection("Users").doc(oldDoc.id).set({
                //             classOwnership : classOwned,
                //             classParticipated : classJoined
                //         }, { merge: true })
                //     }
                // })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
            } else {
                createNewClass()
            }
        }).catch(function(error) {
            console.log("Error creating new class :", error);
        });
        console.log(`${className} class was created as succe`)
    }

    appendNewOption = (name,code,parentID) => {
        var newOption = document.createElement("option")
        newOption.setAttribute("value",code)
        newOption.innerHTML = code + " - " + name
        var parent = getElement(parentID)
        parent.appendChild(newOption)
    }

    joinNewClass = () => {
        var classCode = prompt("Enter the class code :")
        if (classCode != "" && classCode != null){
            var user = firebase.auth().currentUser
            db.collection("Classes").doc(classCode).get().then(function(doc) {
                if (doc.exists){
                    if (doc.data().owner != user.email){
                        db.collection("Users").doc(user.uid).update({
                            classParticipated : firebase.firestore.FieldValue.arrayUnion(classCode)
                        })
                        db.collection("Classes").doc(classCode).update({
                            members : firebase.firestore.FieldValue.arrayUnion(user.email)
                        })
                        appendNewOption(doc.data().classroomName,doc.data().code,"inputGroupSelect02")
                    }else{
                        console.log("You already own the class!")
                    }
                }else{
                    console.log("No classroom is attached to the Code :",classCode)
                }
            })
        }else{
            joinedClass()
        }
    }
    
    startStreaming = () => {
        // Get stream title
        streamTitle = getElement("streamName_box").value
        randomCode = makeUniqueID(8)
        // Check for empty stream title
        if (streamTitle != "" && streamTitle != null){
            //Getting selected Class
            classCodeSelected = getElement("inputGroupSelect01").value
            //Check if selected class code is empty
            if (classCodeSelected != "" && classCodeSelected != null ){
                //Connecto Streamings collection
                db.collection("Streaming").doc(classCodeSelected+randomCode).get().then((doc)=>{
                    //Verify that the unique code is not taken
                    if (!doc.exists){
                        db.collection("Classes").doc(classCodeSelected).get().then((doc)=>{
                            if (doc.data().owner == firebase.auth().currentUser.email){
                                db.collection("Classes").doc(classCodeSelected).update({
                                    currentlyStreaming : classCodeSelected+randomCode
                                })
                                d = new Date();
                                day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                                date = `${day[d.getDay()]}-${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`
                                console.log(date)
                                db.collection("Streamings").doc(classCodeSelected+randomCode).set({
                                    streamCode : classCodeSelected+randomCode,
                                    streamTitle : streamTitle,
                                    dateCreated : date,
                                    classCode : classCodeSelected,
                                    isOnline : true,
                                    owner : doc.data().owner
                                }).then(() => {
                                    localStorage.setItem("streamRoom",classCodeSelected+randomCode)
                                    window.location.replace("/stream.html") 
                                })
                            }
                  
                        })
                    }else{
                        startStreaming()
                    }
                })
            }else{
                alert("Please select a class!")
            }
        }else{
            alert("Stream title can't be empty!")
        }
        
    }

    findStream = () => {
        var streamBox = getElement("inputGroupSelect02")
        const selectedClassCode = streamBox.value
        if (selectedClassCode != "" && selectedClassCode != null){
            db.collection("Classes").doc(selectedClassCode).get().then((doc)=>{
                if(doc.exists){
                    if (doc.data().currentlyStreaming != ""){
                        db.collection("Streamings").doc(doc.data().currentlyStreaming).get().then((doc)=>{
                            stream = doc.data()
                            //Reset items in input
                            if (doc.exists){
                                if (stream.isOnline){
                                    getElement("inputGroupSelect03").innerHTML = ""
                                    appendNewOption(stream.streamTitle,stream.streamCode,"inputGroupSelect03")
                                }else{
                                    getElement("inputGroupSelect03").innerHTML = ""
                                    console.log("Stream is not currently online")
                                }
                            }else{
                                getElement("inputGroupSelect03").innerHTML = ""
                            }
                        })
                    }else{
                        getElement("inputGroupSelect03").innerHTML = ""
                        console.log("No Streaming available for the selected class!")
                    }

                }else{
                    console.log("Class not found Exception xD!")
                }
            })
        }
    }

    selectStream = () => {
        var streamRoom = getElement("inputGroupSelect03").value

        db.collection("Streamings").doc(streamRoom).get().then((doc)=>{
            stream = doc.data()
            if (stream.isOnline){
                localStorage.setItem("streamRoom",streamRoom)
                window.location.replace("/stream.html")
            }else{
                console.log("Stream is not currently online")
            }

        })
    }




