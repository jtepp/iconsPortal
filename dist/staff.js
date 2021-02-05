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

// const progress = document.getElementById("progress")
// const fileButton = document.getElementById("fileButton")

// fileButton.addEventListener('change', (e)=>{
//     //get file
//     var file = e.target.files[0]

//     //create storage ref
//     var storageRef = firebase.storage().ref('staff/'+file.name)
    
//     //upload file
//     var task = storageRef.put(file)

//     //update progress bar
//     task.on('state_changed', (snapshot)=>{
//         var percentage = snapshot.bytesTransferred/snapshot.totalBytes*100
//         progress.value = percentage
//     }, (error)=>{},
//      /*complete*/()=>{})
// })

addStaff()


async function addStaff(){
    var listRef = firebase.storage().ref('staff/')
    await listRef.listAll()
    .then((res) => {
        res.items.forEach((itemRef) => {
        placeStaff(itemRef.name)
        });
    }).catch((error) => {
        console.log(error)
    });

}

function placeStaff(s){
    const card = document.createElement('div')
    card.classList.add('staffcard')
    
    const image = document.createElement('div')
    image.classList.add('staffimg')

    const img = new Image()
    img.src = `https://firebasestorage.googleapis.com/v0/b/icons724a.appspot.com/o/staff%2F${s}?alt=media`
    img.width = 100
    image.appendChild(img)

    const info = document.createElement('div')
    info.classList.add('staffinfo')

    const name = document.createElement('div')
    name.classList.add('staffname')
    name.innerHTML = s.replace('.jpg','')

    const actions = document.createElement('div')
    actions.classList.add('staffactions')

    const edit = document.createElement('div')
    edit.classList.add('staffbutton')
    edit.setAttribute('data-text','Edit')

    const del = document.createElement('div')
    del.classList.add('staffbutton')
    del.setAttribute('data-text','Delete')

    actions.appendChild(edit)
    actions.appendChild(del)
    info.appendChild(name)
    info.appendChild(actions)
    card.appendChild(image)
    card.appendChild(info)

    document.getElementById("staffcont").appendChild(card)


}