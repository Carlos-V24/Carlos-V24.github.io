function geoFindMe() {
  
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      status.textContent = "";
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }
  
    function error() {
      status.textContent = "Unable to retrieve your location";
    }
  
    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  if (window.DeviceMotionEvent == undefined) {
    //No accelerometer is present. Use buttons. 
    alert("no accelerometer");
    }
    else {
        alert("accelerometer found");
        window.addEventListener("devicemotion", accelerometerUpdate, true);
        console.log("try")
    }
    function accelerometerUpdate(e) {
        var aX = event.accelerationIncludingGravity.x*1;
        var aY = event.accelerationIncludingGravity.y*1;
        var aZ = event.accelerationIncludingGravity.z*1;
        //The following two lines are just to calculate a
        // tilt. Not really needed. 
        xPosition = Math.atan2(aY, aZ);
        yPosition = Math.atan2(aX, aZ);
     }
