const options = {
    enableHighAccuracy: true,
    timeout: 100,
    maximumAge: 0,
  };
var calibracion={
    aceX: 0,
    aceY: 0,
    acleZ: 0,
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0,
    tiempo: 0,
};
let id
var data = {}
  function sucess(pos) {
    const crd = pos.coords;
    console.log(crd);
    let lat = document.createElement("td")
    let long = document.createElement("td")
    let alt = document.createElement("td")
    let spd = document.createElement("td")
    let acc = document.createElement("td");
    let time = document.createElement("td");
    let aX = document.createElement("td")
    let aY = document.createElement("td");
    let aZ = document.createElement("td");
    let agX = document.createElement("td")
    let agY = document.createElement("td");
    let agZ = document.createElement("td");

    time.innerText = Date.now()-calibracion.tiempo;
    lat.innerText = crd.latitude.toFixed(4);
    long.innerText = crd.longitude.toFixed(4);
    alt.innerText = crd.altitude.toFixed(4);
    if (crd.speed !=null) {
        spd.innerText = crd.speed.toFixed(4);
    } else {
        spd.innerText = 0;
    }
    acc.innerText = crd.accuracy.toFixed(2);
    agX.innerText = data.agX;
    agY.innerText = data.agY;
    agZ.innerText = data.agY;
    aX.innerText = data.aX;
    aY.innerText = data.aY;
    aZ.innerText = data.aZ;

    let tr = document.createElement("tr")

    tr.appendChild(time)//Tiempo
    tr.appendChild(lat)
    tr.appendChild(long)
    tr.appendChild(alt)
    tr.appendChild(spd)
    tr.appendChild(acc)
    tr.appendChild(aX)
    tr.appendChild(aY)
    tr.appendChild(aZ)
    tr.appendChild(agX)
    tr.appendChild(agY)
    tr.appendChild(agZ)
    document.querySelector("#info").appendChild(tr)
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

    /*Codigo externo*/
  function handleOrientation(event) {
    updateFieldIfNotNull('o-x', event.alpha);
    updateFieldIfNotNull('o-y', event.beta);
    updateFieldIfNotNull('o-z', event.gamma);
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
    if (value != null){
        document.getElementById(fieldName).innerHTML = value.toFixed(precision);
    }
  }
  
  function genDataTabla(event){
    data = {
        agX: event.accelerationIncludingGravity.x,
        agY: event.accelerationIncludingGravity.y,
        agZ: event.accelerationIncludingGravity.z,
        aX: event.acceleration.x,
        aY: event.acceleration.y,
        aZ: event.acceleration.z,
        rx: event.rotationRate.alpha,
        ry: event.rotationRate.beta,
        rz: event.rotationRate.gamma
    }
}
function generarTabla() {;
    window.addEventListener("devicemotion", genDataTabla);
  }
  
  /*Iniciador del código*/
  let is_running = false;
  let btnGrabar = document.getElementById("Start");
  btnGrabar.onclick = function(e) {
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
                btnGrabar.innerHTML = "Iniciar registro";
                btnGrabar.classList.add('btn-start');
                btnGrabar.classList.remove('btn-stop');
                document.getElementById("Calib").style.display = "block";
                document.getElementById("Data").style.display = "block";
                //navigator.geolocation.clearWatch(id); 
                is_running = false;
            }else{
                window.addEventListener("devicemotion", handleMotion);
                window.addEventListener("deviceorientation", handleOrientation);
                document.getElementById("Start").innerHTML = "Detener registro";
                document.getElementById("Calib").style.display = "none";
                setInterval(()=>{
                    navigator.geolocation.getCurrentPosition(sucess, error, options)
                },400)
                document.getElementById("Data").style.display = "none";
        document.getElementById("info").style.display = "block";
        btnGrabar.classList.remove('btn-start');
        btnGrabar.classList.add('btn-stop');
        is_running = true;
    }
};
