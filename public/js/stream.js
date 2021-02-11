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

    joinClassStream = () => {
        var streamRoom = localStorage.getItem("streamRoom")
        console.log(streamRoom)
        firebase.firestore().collection("Streamings").doc(streamRoom).get().then((doc) => {
            $(document).ready(function(){
            var data = doc.data()
            var domain = "192.168.7.80";
            var options = {
                roomName : data.streamCode,
                parentNode: document.querySelector('#meet'),
                configOverwrite:{
                },
                interfaceConfigOverwrite:{
                    DEFAULT_BACKGROUND: "#3b98ff",
                    SHOW_JITSI_WATERMARK: false,
                    noSsl: true,
                    JITSI_WATERMARK_LINK: '#',
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_POWERED_BY: false,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen','recording',
                        'fodeviceselection', 'etherpad', 'sharedvideo', 'raisehand',
                        'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                        'tileview'
                    ]
            }}
            var api = new JitsiMeetExternalAPI(domain,options)
            api.executeCommands({
            // toggleShareScreen: [],
            toggleVideo: [],
            toggleAudio: []
        });
            api.executeCommand('displayName', auth.currentUser.displayName);
            })
        })  
    }

    joinClassStream()