var firebaseConfig = {
    apiKey: "AIzaSyCX8O0iEJpoHMrec2-L3wc_qTc4csx8Gww",
    authDomain: "icons724a.firebaseapp.com",
    projectId: "icons724a",
    storageBucket: "icons724a.appspot.com",
    messagingSenderId: "964326883546",
    appId: "1:964326883546:web:a64115e3f2bc20cecb25e3",
    measurementId: "G-50GG58VXPW"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const progress = document.getElementById("progress")
const fileButton = document.getElementById("fileButton")

fileButton.addEventListener('change', (e)=>{
    //get file
    var file = e.target.files[0]

    //create storage ref
    var storageRef = firebase.storage().ref('staff/'+file.name)
    
    //upload file
    var task = storageRef.put(file)

    //update progress bar
    task.on('state_changed', (snapshot)=>{
        var percentage = snapshot.bytesTransferred/snapshot.totalBytes*100
        progress.value = percentage
    }, (error)=>{},
     /*complete*/()=>{})
})