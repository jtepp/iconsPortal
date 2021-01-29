if (window.location.href.includes("%26")) window.location.href = window.location.href.split("%26").join("&")

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var canClick = true;
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
  
  const ids = JSON.parse(new URLSearchParams(window.location.search).get("id")) || []
  const room = new URLSearchParams(window.location.search).get("room") || "[no room]"
  const mail = new URLSearchParams(window.location.search).get("mail") || "19jgt1@queensu.ca"
  const from = new URLSearchParams(window.location.search).get("name") || "[no name]"
  const date = new URLSearchParams(window.location.search).get("date") || "[no date]"
  var itemsRequested = ""
    db.collection("items").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              if (ids.includes(doc.id)){
                document.getElementById("request").innerHTML += " "+doc.get("name")+","
                itemsRequested += " "+doc.get("name")+","
                document.getElementById("request").innerHTML = document.getElementById("request").innerHTML.slice(0,document.getElementById("request").innerHTML.length -1)
                itemsRequested = itemsRequested.slice(0,itemsRequested.length -1)
                addStaff();
              }
          });
      })
      
document.getElementById("room").innerHTML += room
document.getElementById("date").innerHTML += date
document.getElementById("from").innerHTML += from

      

async function addStaff() {
  const staffList = [
    "Adam Pukier.jpg",
    "Laura Osborne.jpg",
    "Anthony Scalzitti.jpg",
    "Laura Phillips.jpg",
    "Aubry Williams.jpg",
    "Leigh Dederer.jpg",
    "Ben Frosst.jpg",
    "Matthew Shade-Silver.jpg",
    "Ciaran Beveridge.jpg",
    "Meghan Fast.jpg",
    "Connor Prior.jpg",
    "Molly White.jpg",
    "David Marshall.jpg",
    "Monique Rivard.jpg",
    "Duncan Steinke.jpg",
    "Nic Fanning.jpg",
    "Emily Schnarr.jpg",
    "Nicolas Arnot.jpg",
    "Jack Lipton.jpg",
    "Olivia Blair.jpg",
    "Jacob Calderone.jpg",
    "Owen Panksep.jpg",
    "Jacqueline Del-Gatto.jpg",
    "Sydney Liao.jpg",
    "Jeff Martin.jpg",
    "Thomas Ung.jpg",
    "Julia Maine.jpg",
    "Will King.jpg",
    "Justin Bonal.jpg",
    "Zane Maklin.jpg"
  ];



  for (let s of staffList) {
    
    const imgh = `<div class="staffdiv" style="width: 240px%3B height: 240px%3B overflow: hidden%3B border-radius: 50px%3B border: solid silver 5px%3B margin: 20px%3B display: flex%3B flex-direction: column%3B"><div class="staffimg"><img src="https://iconsportal.netlify.app/headshots/${s}" draggable="false" style="width: 240px%3B padding: 0%%3B margin: 0%3B"/></div></div>`
    const rh = `<h3>Please wait while ${s.replace('.jpg', '')} delivers your order</h3>${imgh}<p>You ordered: <b>${itemsRequested}</b></p><p>Room: ${room}</p><p>Date: ${date}</p>`;
    const e = document.createElement('div');
    e.setAttribute('class', 'staffdiv');
    e.setAttribute('style', 'width: 240px;height: 240px;overflow: hidden;border-radius: 50px;border: solid silver 5px;margin: 20px;display: flex;flex-direction: column;cursor: pointer;');
    e.onclick = () => { if (canClick){
      canClick = false
      ids.forEach( item =>{
        const ff = firebase.firestore().collection('items').doc(item)
        ff.update({
          available: firebase.firestore.FieldValue.increment(-1)
        })
        
      })
      fetch('https://iconsportal.netlify.app/.netlify/functions/email?r=' + mail + '&s=Your%20iCons%20order%20has%20been%20accepted&h=' + rh)
        .then(res => res.text())
        .then(t => {
          if (t == "success") {
            

            window.location.href = "/";
          } else {
            console.log(t);
          }

        });}
    };




    const i = document.createElement('img');
    i.src = "headshots/" + s.replace(' ', '%20');
    i.style.width = "240px";
    i.setAttribute('draggable', 'false');

    const si = document.createElement('div');
    si.setAttribute('class', 'staffimg');

    si.appendChild(i);

    e.appendChild(si);



    const n = document.createElement('div');
    n.setAttribute('class', 'staffname');
    n.innerText = s.replace('.jpg', '');
    e.appendChild(n);
    document.getElementById('staffcont').appendChild(e);
  }
}
  

