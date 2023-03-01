const options = {
    enableHighAccuracy: false,
    timeout: 1000,
    maximumAge: 0,
  };
  
  var s = 0;
  function success(pos) {
    const crd = pos.coords;
    
    let lat = document.createElement("td")
    let long = document.createElement("td")
    let alt = document.createElement("td")
    let spd = document.createElement("td")
    let acc = document.createElement("td");
    let time = document.createElement("td");

    time.innerText = Date.now();
    lat.innerText = crd.latitude;
    long.innerText = crd.longitude;
    alt.innerText = crd.altitude;
    spd.innerText = crd.speed;
    acc.innerText = crd.accuracy;

    let tr = document.createElement("tr")

    tr.appendChild(time)//Tiempo
    tr.appendChild(lat)
    tr.appendChild(long)
    tr.appendChild(alt)
    tr.appendChild(spd)
    tr.appendChild(acc)
    document.querySelector("#info").appendChild(tr)
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  document.querySelector("#Start").addEventListener("click", ()=>{
    var mainLoopId = setInterval(function(){
        navigator.geolocation.getCurrentPosition(success, error, options)
    }, 1000);

  })
  document.querySelector("#Detener").addEventListener("click", ()=>{
    clearInterval(mainLoopId);
  })

