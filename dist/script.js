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
  const quantities = JSON.parse(new URLSearchParams(window.location.search).get("quantities")) || []
  const room = new URLSearchParams(window.location.search).get("room") || "[no room]"
  const mail = new URLSearchParams(window.location.search).get("mail") || "19jgt1@queensu.ca"
  const from = new URLSearchParams(window.location.search).get("name") || "[no name]"
  const date = new URLSearchParams(window.location.search).get("date") || "[no date]"
  var itemsRequested = ""
    db.collection("items").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              if (ids.includes(doc.id)){
                itemsRequested += " "+doc.get("name")+" x"+(quantities[ids.indexOf(doc.id)] || 1)+","
              }
          });
          itemsRequested = itemsRequested.slice(0,itemsRequested.length -1)
                document.getElementById("request").innerHTML = "Request: " + itemsRequested
                addStaff();
      })
      
document.getElementById("room").innerHTML += room
document.getElementById("date").innerHTML += date
document.getElementById("from").innerHTML += from

      


async function addStaff() {
  var staffList = []
  var listRef = firebase.storage().ref('staff/')
  await listRef.listAll()
  .then((res) => {
    res.items.forEach((itemRef) => {
      staffList.push(itemRef.name)
    });
  }).catch((error) => {
    console.log(error)
  });


  for (let s of staffList) {
    
    const imgh = `<div class="staffdiv" style="width: 240px%3B height: 240px%3B overflow: hidden%3B border-radius: 50px%3B border: solid silver 5px%3B margin: 20px%3B display: flex%3B flex-direction: column%3B"><div class="staffimg"><img src="https://firebasestorage.googleapis.com/v0/b/icons724a.appspot.com/o/staff%2F${s}?alt=media" draggable="false" style="width: 100%25%3B"/></div></div>`
    const rh = `<h3>Please wait while ${s.replace('.jpg', '')} delivers your order</h3>${imgh}<p>You ordered: <b>${itemsRequested}</b></p><p>Room: ${room}</p><p>Date: ${date}</p>`;
    const e = document.createElement('div');
    e.setAttribute('class', 'staffdiv');
    e.setAttribute('style', 'width: 240px;height: 240px;overflow: hidden;border-radius: 50px;border: solid silver 5px;margin: 20px;display: flex;flex-direction: column;cursor: pointer;');
    e.onclick = () => { if (canClick){
      canClick = false
      ids.forEach( item =>{
        const ff = firebase.firestore().collection('items').doc(item)
        const inc = -1 * (quantities[ids.indexOf(ff.id)] || 1)
        ff.update({
          available: firebase.firestore.FieldValue.increment(inc)
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
    i.src = `https://firebasestorage.googleapis.com/v0/b/icons724a.appspot.com/o/staff%2F${s.replace(' ', '%20')}?alt=media`
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
  

