const options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0,
  };
var calibracion={
    acleX: 0,
    acleY: 0,
    acleZ: 0,
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0,
    tiempo: 0,
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



    /*Codigo externo*/
  function handleOrientation(event) {
    updateFieldIfNotNull('o-x', event.alpha);
    updateFieldIfNotNull('o-y', event.beta);
    updateFieldIfNotNull('o-y', event.gamma);
  }

  function handleMotion(event) {
    updateFieldIfNotNull('a-gx', event.accelerationIncludingGravity.x);
    updateFieldIfNotNull('a-gy', event.accelerationIncludingGravity.y);
    updateFieldIfNotNull('a-gz', event.accelerationIncludingGravity.z);
  
    updateFieldIfNotNull('a-x', event.acceleration.x);
    updateFieldIfNotNull('a-y', event.acceleration.y);
    updateFieldIfNotNull('a-z', event.acceleration.z);
  
    updateFieldIfNotNull('g-x', event.rotationRate.alpha);
    updateFieldIfNotNull('g-y', event.rotationRate.beta);
    updateFieldIfNotNull('g-z', event.rotationRate.gamma);
  }
  
  function updateFieldIfNotNull(fieldName, value, precision=10){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }
  
  /*Iniciador del código*/
  let is_running = false;
  let demo_button = document.getElementById("Start");
  demo_button.onclick = function(e) {
    e.preventDefault();
    
    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    
    if (is_running){
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
      demo_button.innerHTML = "Iniciar registro";
      demo_button.classList.add('btn-start');
      demo_button.classList.remove('btn-stop');
      document.getElementById("Calib").style.display = "block";
      document.getElementById("Data").style.display = "block";
      is_running = false;
      /*const mainLoopId = setInterval(function(){
            navigator.geolocation.getCurrentPosition(success, error, options)
        }, 40);*/
    }else{
      window.addEventListener("devicemotion", handleMotion);
      window.addEventListener("deviceorientation", handleOrientation);
      document.getElementById("Start").innerHTML = "Detener registro";
      document.getElementById("Calib").style.display = "none";
      document.getElementById("Data").style.display = "none";
      demo_button.classList.remove('btn-start');
      demo_button.classList.add('btn-stop');
      is_running = true;
    }
  };
