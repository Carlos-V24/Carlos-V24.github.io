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

function tableToCSV(id, fileName) {
 
    // Variable to store the final csv data
    var csv_data = [];
 
    // Get each row data
    var rows = document.querySelectorAll("#"+id+" tr")
    ;
    for (var i = 0; i < rows.length; i++) {
 
        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');
 
        // Stores each csv row data
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
 
            // Get the text data of each cell of
            // a row and push it to csvrow
            csvrow.push(cols[j].innerHTML);
        }
 
        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }
    // combine each row data with new line character
    csv_data = csv_data.join('\n');
    downloadCSVFile(csv_data, fileName)
}
function downloadCSVFile(csv_data, fieldName) {
 
    // Create CSV file object and feed our
    // csv_data into it
    CSVFile = new Blob([csv_data], { type: "text/csv" });
 
    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');
 
    // Download csv file
    temp_link.download = fieldName+".csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
 
    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
 
    // Automatically click the link to trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}
  function sucess(pos) {
    const crd = pos.coords;
    console.log(crd);

    let lat = document.createElement("td")
    let long = document.createElement("td")
    let alt = document.createElement("td")
    let spd = document.createElement("td")
    let acc = document.createElement("td");
    let time = document.createElement("td");

    time.innerText = (Date.now()-calibracion.tiempo);
    lat.innerText = crd.latitude.toFixed(4);
    long.innerText = crd.longitude.toFixed(4);
    alt.innerText = crd.altitude.toFixed(4);
    if (crd.speed !=null) {
        spd.innerText = crd.speed.toFixed(4);
    } else {
        spd.innerText = 0;
    }
    acc.innerText = crd.accuracy.toFixed(2);
    
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


function dataOrientation(event) {
    let t = document.createElement("td")
    let a = document.createElement("td")
    let b = document.createElement("td")
    let g = document.createElement("td")

    t.innerText = (Date.now()-calibracion.tiempo);
    a.innerText = event.alpha;
    b.innerText = event.beta;
    g.innerText = event.gamma;
    
    let tr = document.createElement("tr")
    
    tr.appendChild(t)//Tiempo
    tr.appendChild(a)
    tr.appendChild(b)
    tr.appendChild(g)
    document.querySelector("#info_ori").appendChild(tr)
}

function dataMotion(event) {
    updateFieldIfNotNull('a-gx', event.accelerationIncludingGravity.x);
    updateFieldIfNotNull('a-gy', event.accelerationIncludingGravity.y);
    updateFieldIfNotNull('a-gz', event.accelerationIncludingGravity.z);
    
    updateFieldIfNotNull('a-x', event.acceleration.x);
    updateFieldIfNotNull('a-y', event.acceleration.y);
    updateFieldIfNotNull('a-z', event.acceleration.z);
    
    updateFieldIfNotNull('g-x', event.rotationRate.alpha);
    updateFieldIfNotNull('g-y', event.rotationRate.beta);
    updateFieldIfNotNull('g-z', event.rotationRate.gamma);

    let t = document.createElement("td")
    let aX = document.createElement("td")
    let aY = document.createElement("td")
    let aZ = document.createElement("td")
    let agX = document.createElement("td")
    let agY = document.createElement("td")
    let agZ = document.createElement("td")
    let rX = document.createElement("td")
    let rY = document.createElement("td")
    let rZ = document.createElement("td")

    t.innerText = (Date.now()-calibracion.tiempo);
    aX.innerText = event.acceleration.x;
    aY.innerText = event.acceleration.y;
    aZ.innerText = event.acceleration.z;
    agX.innerText = event.accelerationIncludingGravity.x;
    agY.innerText = event.accelerationIncludingGravity.y;
    agZ.innerText = event.accelerationIncludingGravity.z;
    rX.innerText = event.rotationRate.alpha;
    rY.innerText = event.rotationRate.beta;
    rZ.innerText = event.rotationRate.gamma;
    
    let tr = document.createElement("tr")
    
    tr.appendChild(t)//Tiempo
    tr.appendChild(aX)
    tr.appendChild(aY)
    tr.appendChild(aZ)
    tr.appendChild(agX)
    tr.appendChild(agY)
    tr.appendChild(agZ)
    tr.appendChild(rX)
    tr.appendChild(rY)
    tr.appendChild(rZ)
    document.querySelector("#info_acel").appendChild(tr)
}
function updateFieldIfNotNull(fieldName, value, precision=10){
    if (value != null){
        document.getElementById(fieldName).innerHTML = value.toFixed(precision);
    }
}

function grabarDatos() {
    setInterval(()=>{
        navigator.geolocation.getCurrentPosition(sucess, error, options)
    }, 400)
    //window.addEventListener("devicemotion", dataMotion);
    //window.addEventListener("deviceorientation", dataOrientation);
}
/*Iniciador del código*/
let is_running = false;
let btnGrabar = document.getElementById("Start");
btnGrabar.onclick = function(e) {
    e.preventDefault();
    calibracion.tiempo = Date.now();
    
    // Request permission for iOS 13+ devices
    if (
        DeviceMotionEvent &&
        typeof DeviceMotionEvent.requestPermission === "function"
        ) {
            DeviceMotionEvent.requestPermission();
        }
        
        if (is_running){
                //window.removeEventListener("devicemotion", handleMotion);
                //window.removeEventListener("deviceorientation", handleOrientation);
                btnGrabar.innerHTML = "Iniciar registro";
                btnGrabar.classList.add('btn-start');
                btnGrabar.classList.remove('btn-stop');
                document.getElementById("Calib").style.display = "block";
                document.getElementById("Data").style.display = "block";
                tableToCSV("info","prueba")
                is_running = false;
            }else{
                //window.addEventListener("devicemotion", handleMotion);
                //window.addEventListener("deviceorientation", handleOrientation);
                grabarDatos()
                document.getElementById("Start").innerHTML = "Detener registro";
                document.getElementById("Calib").style.display = "none";
                document.getElementById("Data").style.display = "none";
                document.getElementById("info").style.display = "block";
                btnGrabar.classList.remove('btn-start');
                btnGrabar.classList.add('btn-stop');
                is_running = true;
            }
        };
        
