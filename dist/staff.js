var authed = false

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
    const fr = new FileReader()
    fr.onload = (event)=>{
        document.getElementById('editimg').src = event.target.result
    }
   
    fr.readAsDataURL(e.target.files[0])
})



addStaff()


async function addStaff(){
    placeNewCard()
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

function placeNewCard() {
    const nc = document.createElement('div')
    nc.id = "newcard"
    nc.setAttribute('class', 'staffcard')
    nc.onclick = ()=>{showEdit(false, '')}
    
    const inc = document.createElement('div')
    inc.id = "innernewcard"
    
    const i = new Image(60,60)
    i.src = "images/+.png"
    i.style.filter = "hue-rotate(90deg)"

    inc.appendChild(i)
    nc.appendChild(inc)
    document.getElementById('staffcont').appendChild(nc)
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

    // const edit = document.createElement('div')
    // edit.classList.add('staffbutton')
    // edit.setAttribute('data-text','Edit')
    // edit.onclick = ()=>{showEdit(false, s)}

    const del = document.createElement('div')
    if (!authed) {
        del.setAttribute('class','staffbutton locked')
    } else {
        del.setAttribute('class','staffbutton')
    }

    del.setAttribute('data-text','Delete')
    del.onclick = ()=>{
        deleteStaff(s, false)
    }

    // actions.appendChild(edit)
    actions.appendChild(del)
    info.appendChild(name)
    info.appendChild(actions)
    card.appendChild(image)
    card.appendChild(info)

    document.getElementById("staffcont").appendChild(card)


}

function cancelEdit(){
    if (progress.value == 0) {
        document.getElementById("editorcont").style.top = "200%"
        document.getElementById('editname').value = ""
        document.getElementById("fileButton").value = ""
        document.getElementById('editimg').src = ""
    }
}

function showEdit(creating, name){
    document.getElementById('editupload').style.background = (name == "" || document.getElementById('fileButton').files.length == 0) ? "grey" : "#06894b"
    if (!creating) {
        document.getElementById('editimg').src = `https://firebasestorage.googleapis.com/v0/b/icons724a.appspot.com/o/staff%2F${name}?alt=media`
        document.getElementById("editname").value = name.replace('.jpg', '')
        document.getElementById("editorcont").style.top = "50%"
        document.getElementById("editupload").onclick = ()=>{
            if (document.getElementById("editname").value != "" && document.getElementById('fileButton').files.length != 0){
                //delete from old name
                deleteStaff(name, true)
                //upload with new name/picture
                upload(document.getElementById("editname").value, document.getElementById('fileButton').files[0])
            }
        }
    } else {
        //upload with fixed new name
        if (document.getElementById("editname").value != "" && document.getElementById('fileButton').files.length != 0) {
            upload(document.getElementById("editname").value+".jpg", document.getElementById('fileButton').files[0])
        }
    }

    

}

document.getElementById("editname").addEventListener('input', (e)=>{
    document.getElementById('editupload').style.background = (e.target.value == "" || document.getElementById('fileButton').files.length == 0) ? "grey" : "#06894b"
})

document.getElementById("fileButton").addEventListener('change', (e)=>{
    document.getElementById('editupload').style.background = (e.target.files.length == 0 || document.getElementById("editname").value == "") ? "grey" : "#06894b"
})

function upload(name, file) {

    //create storage ref
    var storageRef = firebase.storage().ref('staff/'+name)
    
    //upload file
    var task = storageRef.put(file)

    //update progress bar
    task.on('state_changed', (snapshot)=>{
        var percentage = snapshot.bytesTransferred/snapshot.totalBytes*100
        progress.value = percentage
    }, (error)=>{},
     /*complete*/()=>{
        document.getElementById('editorcont').style.top = "200%"
        document.getElementById('staffcont').innerHTML = ""
        addStaff()
     })
}

async function deleteStaff(name, skip){
    if (skip || window.confirm("Are you sure you want to remove "+name.replace('.jpg','')+"?")) {
        var storageRef = firebase.storage().ref('staff/'+name)
        await storageRef.delete().then(() => {
            document.getElementById('staffcont').innerHTML = ""
            addStaff()
        })
        .catch((e)=>{
            console.log("delete error: "+e)
        })
    }
}

function search() {
    const cont = document.getElementById('staffcont')
    const query = document.getElementById('search')
    for (let e of cont.children){
        if (e.id != "newcard") {
            e.style.display = query.value == "" ? "flex" : (e.textContent.toLowerCase().includes(query.value.toLowerCase()) ? "flex" : "none")
            // console.log(e.textContent)
        }
    }
}

function authenticate(){
    const p = document.getElementById('authpass')

    firebase.auth().signInWithEmailAndPassword('iconsrequestservice@gmail.com',p.value || window.sessionStorage.getItem('iconsportal-password'))
    .then((user)=>{
        console.log(user)
        authed = true
        const auth = document.getElementsByClassName('auth')
        for(let a of auth){
            a.style.display = 'none'
        }
        const locked = document.getElementsByClassName('locked')
        for(let l of locked){
            l.style.display = 'flex'
        }
        document.getElementById('newcard').style.display = "flex"
    })
    .catch((error)=>{
        console.log(error)
        const d = document.getElementById('authauth').style
        d.animation = "shake ease-out 0.6s"
        authed = false
        setTimeout(()=>{
            d.animation = ""
        },600)
    })
}

document.getElementById('newcard').style.display = "none"

// authenticate()

