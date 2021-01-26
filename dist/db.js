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
    snapshot.forEach(doc=>{
        document.getElementById('dbcont').appendChild(makeCard(doc.data()))
    })
})


function makeCard(info){
    const d = document.createElement("div")
    d.setAttribute('class', 'card')
    
    const name = document.createElement("h3")
    name.innerText = info["name"]
    d.appendChild(name)


    const fields = document.createElement("p")
    fields.setAttribute('class','fields')

        fields.innerHTML+="<strong>Category: </strong>"+info["category"]+"<br>"
        fields.innerHTML+="<strong>Available: </strong>"+info["available"]

    const fieldcont = document.createElement("div")
    fieldcont.setAttribute('class','fieldcont')
    fieldcont.appendChild(fields)



    d.appendChild(fieldcont)
    return d

}