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
var db = firebase.firestore();

db.collection("items").onSnapshot(snapshot=>{
    document.getElementById('dbcont').innerHTML = ''

    addNew();

    snapshot.forEach(doc=>{
        document.getElementById('dbcont').appendChild(makeCard(doc))
    })
})


function makeCard(docInput){
    const info = docInput.data()
    const d = document.createElement("div")
    d.setAttribute('class', 'card')
    const cardTop = document.createElement("div")
    
    const name = document.createElement("h3")
    name.innerText = info["name"]
    cardTop.appendChild(name)

    cardTop.classList.add("cardTop")

    const del = new Image(20,20)
    del.src = "images/x.png"
    del.setAttribute('class', 'locked')
    cardTop.appendChild(del)
    del.onclick = ()=>{
        if (window.confirm("Are you sure you want to delete this item?")){
        const ff = firebase.firestore().collection("items").doc(docInput.id)
        ff.delete()}
    }
    d.appendChild(cardTop)


    const fields = document.createElement("p")
    fields.setAttribute('class','fields')

    const cc = document.createElement('strong')
    cc.innerHTML = "Category: "
    fields.appendChild(cc)
    fields.innerHTML += info["category"]+"<br>"


    const ss = document.createElement('strong')
    ss.innerHTML = "Sub: "
    fields.appendChild(ss)
    fields.innerHTML += info["sub"]+"<br>"

    const availablerow = document.createElement('div')
    availablerow.id = "availablerow"
    const aa = document.createElement('strong')
    aa.innerHTML = "Available:&nbsp;"
    availablerow.appendChild(aa)
    availablerow.innerHTML += info["available"]+"&nbsp;&nbsp;"
    

    
    const fieldcont = document.createElement("div")
    fieldcont.setAttribute('class','fieldcont')
    
    // const inc = document.createElement('span')
    // inc.setAttribute('class','increment')
    
    const reduce = new Image(20,20)
    reduce.setAttribute('class','locked')
    reduce.src = "images/-.png"
    reduce.onclick = ()=>{
        if (info["available"] >0){
            incFunc(-1,docInput.id)
        }
    }
    
    const increase = new Image(20,20)
    increase.setAttribute('class','locked')
    increase.src = "images/+.png"
    increase.onclick = ()=>{
        incFunc(1,docInput.id)
    }
    
    availablerow.appendChild(reduce)
    availablerow.appendChild(increase)
    fields.appendChild(availablerow)
    // fields.appendChild(inc)
    fieldcont.appendChild(fields)

    const ed = document.createElement('span')
    ed.setAttribute('class','edit locked')
    ed.onclick = ()=>{
        openEdit(docInput.id)
    }
    ed.innerHTML = "Edit"
    // ed.style.paddingBottom = "10px"
    d.appendChild(fieldcont)
    d.appendChild(ed)
    return d

}

function addNew(){
    const d = document.createElement('div');
    d.id = "addnew"
    d.setAttribute('class','card locked')
    const i = new Image(60,60)
    i.src = "images/+.png"
    d.appendChild(i)
    d.onclick = ()=>{
        db.collection("items").add({
            name: "New item",
            category: "none",
            sub: "none",
            available: 0
        })
        .then((doc)=>{openEdit(doc.id)})
    }
    document.getElementById("dbcont").appendChild(d)
}

function incFunc(n, id){
    const ff = firebase.firestore().collection("items").doc(id)
        ff.update({
            available: firebase.firestore.FieldValue.increment(n)
        })
}

document.getElementById("editor").onclick = (event)=>{
    if(!event.path.includes(document.getElementById("editcard"))){
        document.getElementById("editor").style.top = "200%"
    }
}

function openEdit(id){
    const n = document.getElementById("editname")
    const c = document.getElementById("editcategory")
    const s = document.getElementById("editsub")
    const a = document.getElementById("editavailable")
    const e = document.getElementById('editor')
    
    db.collection('items').doc(id).get().then(doc=>{
        if (doc.exists){
            const data = doc.data()
            n.value = data["name"]
            c.value = data["category"]
            s.value = data["sub"]
            a.value = Math.abs(data["available"])
            e.style.top = "50%"
            
        }
    })


    document.getElementById("done").onclick = ()=>{
        if (n.value != "" && c.value != "" && a.value != "") {
        firebase.firestore().collection('items').doc(id).update({
            name: n.value,
            category: c.value,
            sub: s.value,
            available: Math.abs(Number(a.value))
        })}
        document.getElementById("editor").style.top = "200%"
    }
    document.body.addEventListener("keypress", (event)=>{
        if (document.getElementById("editor").style.top == "50%" && event.keyCode == 13){
            document.getElementById("done").click()
    }
    })
}

function search() {
    const cont = document.getElementById('dbcont')
    const query = document.getElementById('search')
    for (let e of cont.childNodes){
        if (e.id != "addnew") {
            e.style.display = query.value == "" ? "block" : (e.textContent.toLowerCase().includes(query.value.toLowerCase()) ? "block" : "none")
        }
    }
}

function authenticate(){
    firebase.auth().signInWithEmailAndPassword('iconsrequestservice@gmail.com',document.getElementById('authpass').value)
    .then((user)=>{
        console.log(user)
        const auth = document.getElementsByClassName('auth')
        for(let a of auth){
            a.style.display = 'none'
        }
        const locked = document.getElementsByClassName('locked')
        for(let l of locked){
            l.style.display = 'flex'
        }
    })
    .catch((error)=>{
        console.log(error)
        const d = document.getElementById('authauth').style
        d.animation = "shake ease-out 0.6s"
        setTimeout(()=>{
            d.animation = ""
        },600)
    })
}
