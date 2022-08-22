
/*Modificacion al objeto 'date' para agregarle un metodo para poder
  generar unca cadena en el formato yyyy-mm-dd*/
Date.prototype.genDate = function (){
  let str = this.getFullYear()
  if(this.getMonth()<10){
    str+= "-0"+this.getMonth()
  }else{
    str+= "-"+this.getMonth()
  }
  str+= "-"+this.getDate()
  return str;
}

/*Funcion encargada de generar el documento para descargar, además de que detona el evento en el navegador*/
function downloadFiles(data, file_name, file_type) {
    var file = new Blob([data], {type: file_type});
    if (window.navigator.msSaveOrOpenBlob) 
        window.navigator.msSaveOrOpenBlob(file, file_name);
    else { 
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = file_name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

//Funcion que genera la cadena que se usará en blob para crear el documento .csv
function genStringCSV (obj){
    let str = "fecha,temperatura,unidad\n";
    let unit = "N/A";
    //Esto evita que se vea raro en el csv ya que la codificación es disntinta
    if(op == "mes"){
      if(obj.daily_units.temperature_2m_max == "°C"){
        unit ="C";
      }else if(obj.daily_units.temperature_2m_max == "°F"){
        unit ="F";
      }
      for (let i = 0; i < obj.daily.time.length; i++) {
        if(typeof(obj.daily.temperature_2m_max[i]) == "number"){
            str += obj.daily.time[i]+','+obj.daily.temperature_2m_max[i]+','+unit+'\n'
        }else {
            str += obj.daily.time[i]+','+obj.daily.temperature_2m_max[i].y+','+unit+'\n'
        }
    }
    }
    else if(op == "hora"){
      if(obj.hourly_units.temperature_2m == "°C"){
        unit ="C";
      }else if(obj.hourly_units.temperature_2m == "°F"){
        unit ="F";
      }
      for (let i = 0; i < obj.hourly.time.length; i++) {
        if(typeof(obj.hourly.temperature_2m[i]) == "number"){
            str += obj.hourly.time[i]+','+obj.hourly.temperature_2m[i]+','+unit+'\n'
        }else {
            str += obj.hourly.time[i]+','+obj.hourly.temperature_2m[i].y+','+unit+'\n'
        }
    }
  }else{
      alert("Surfio un error")
      location.reload()
    }
    return [str]
}

//Funcion que genera la cadena que se usará en blob para crear el documento .txt
function genStringTXT (obj){
  var str = "";
  if(op == "mes"){
    for (let i = 0; i < obj.daily.time.length; i++) {
      if(typeof(obj.daily.temperature_2m_max[i]) == "number"){
        str += 'Fecha: '+obj.daily.time[i]+'\t Temperatura: '+obj.daily.temperature_2m_max[i]+'['+obj.daily_units.temperature_2m_max+']\n'
      }else {
        str += 'Fecha: '+obj.daily.time[i]+'\t Temperatura: '+obj.daily.temperature_2m_max[i].y+'['+obj.daily_units.temperature_2m_max+']\n'
      }
  }
  }else if(op == "hora"){
    for (let i = 0; i < obj.hourly.time.length; i++) {
      if(typeof(obj.hourly.temperature_2m[i]) == "number"){
        str += 'Fecha: '+obj.hourly.time[i]+'\t Temperatura: '+obj.hourly.temperature_2m[i]+'['+obj.hourly_units.temperature_2m+']\n'
      }else {
        str += 'Fecha: '+obj.hourly.time[i]+'\t Temperatura: '+obj.hourly.temperature_2m[i].y+'['+obj.hourly_units.temperature_2m+']\n'
      }
  }
}else{
    alert("Surfio un error")
    location.reload()
  }
  return [str]
}

//Funcion que genera la cadena que se usará en blob para crear el documento .json
function genStringJSON (obj){
  var str;
  if(op == "mes"){
    str = '{"unidades": "'+obj.daily_units.temperature_2m_max+'", "fechas":[';
    for (let i = 0; i < obj.daily.time.length; i++) {
      str += '"'+obj.daily.time[i]+'"';
      if (i+1 < obj.daily.time.length) {str += ','}
    }
    str += '], "temperaturas": [';
    for (let i = 0; i < obj.daily.time.length; i++) {
      if(typeof(obj.daily.temperature_2m_max[i]) == "number"){
        str += obj.daily.temperature_2m_max[i];
      }else {
        str += obj.daily.temperature_2m_max[i].y;
      }
      if (i+1 < obj.daily.time.length) {str += ','}
    }
    str += ']}';
  }else if(op == "hora"){
    str = '{"unidades": "'+obj.hourly_units.temperature_2m+'", "horas":[';
    for (let i = 0; i < obj.hourly.time.length; i++) {
      str += '"'+obj.hourly.time[i]+'"';
      if (i+1 < obj.hourly.time.length) {str += ','}
    }
    str += '], "temperaturas": [';
    for (let i = 0; i < obj.hourly.time.length; i++) {
      if(typeof(obj.hourly.temperature_2m[i]) == "number"){
        str += obj.hourly.temperature_2m[i];
      }else {
        str += obj.hourly.temperature_2m[i].y;
      }
      if (i+1 < obj.hourly.time.length) {str += ','}
    }
    str += ']}';
  }else{
    alert("Surfio un error")
    location.reload()
  }
  return [str]
}

//Varaibles que obtiene los elementos html para poder hacer los eventos
const btn = document.querySelector("#checar");
const dwld = document.querySelector("#descargar");
const mes = document.querySelector("#Mes");
const hora = document.querySelector("#Hora");
const fecha = document.querySelector("#fecha");
var info;//variable donde se almacena la info recibida del la peticion a la API de meteo
var op = "mes";//variable que guarda que tipo de peticion se esta trabajando

/*Eventos para alternar entre las peticiones "CLima mes" y "Clima hora"*/
mes.addEventListener("click",()=>{
  if(mes.classList[0]!="active"){
    hora.classList.toggle("active")
    mes.classList.toggle("active")
    fecha.style.display = "none";
    op = "mes";
  }
})
hora.addEventListener("click",()=>{
  if(hora.classList[0]!="active"){
    hora.classList.toggle("active")
    mes.classList.toggle("active")
    fecha.style.display = "initial";
    op = "hora";
  }
})
//Evento para el boton descargar que permite descargar el archivo de la info actual
dwld.addEventListener("click", ()=>{
  const radio = document.querySelector("input[type=radio]:checked");
  if(op == "mes"){
    var nomArchivo = info.daily.time[0]+"_"+info.daily.time[info.daily.time.length-1]+"(Lat"+info.latitude+" Long"+info.longitude+")";
  }else if(op == "hora"){
    var nomArchivo = info.hourly.time[0].substr(0, 10)+"(Lat"+info.latitude+" Long"+info.longitude+")";
  }else{
    var nomArchivo = "default-meteo";
  }
  if(radio.value == "JSON"){
    nomArchivo += ".json";
    downloadFiles(genStringJSON(info), nomArchivo, "application/json")
  }else if (radio.value == "CSV") {
    nomArchivo += ".csv";
    downloadFiles(genStringCSV(info), nomArchivo, "text/csv")
  }else if (radio.value == "TXT") {
    nomArchivo += ".txt";
    downloadFiles(genStringTXT(info), nomArchivo, "text/txt")
  }else{
    alert("Ocurrio un error al selecionar el formato de descarga")
  }
})

//Evento que detona la busqueda
btn.addEventListener("click", ()=>{
    let lat = document.querySelector("#lat").value
    let lon = document.querySelector("#lon").value
    fetch("https://api.mymappi.com/v2/geocoding/reverse?apikey=b9c8e26b-90da-4274-ba84-1cc70a3ce256&lat="+lat+"&lon="+lon)
    .then(res1 => res1.json())
    .then((data1)=>{
      var infoPlace = data1;//respuesta de mymappi
      let title;//varaible del titulo que se guardara
      //valida que si tenga un nombre esa ubicacion
      if(infoPlace.data.address != null){
        if(infoPlace.data.address.country && infoPlace.data.address.city){
          title = infoPlace.data.address.city+", "+infoPlace.data.address.country//Nombre "Ciudad, Pais"
        }else if(infoPlace.data.address.country){
          title = infoPlace.data.address.name+", "+infoPlace.data.address.country//Nombre "Direccion, Pais"
        }else{
          title = infoPlace.data.address.name//Usa el nombre convencional
        }
      }else{
        title = lat+", "+lon;//si no tiene nombre usa la latitud y londitud
      }
      //Se hace la petición de los datos de temperatura máxima diaria del último mes
      if(op == "mes"){
        fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&daily=temperature_2m_max&timezone=auto&past_days=31")
        .then(res => res.json())
        .then((data)=>{
            info=data;//respuesta de open-meteo
            //Varaibles para tabrajar y calcular el día con la temperatura más alta
            var tempMaxData = data.daily.temperature_2m_max;
            var maxTemp = {temp:tempMaxData[0], i:0}; 
            //Determina el día con la temperatura más alta
            for (let i = 1; i < tempMaxData.length; i++) {
                const element = tempMaxData[i];
                if(maxTemp.temp < element){
                    maxTemp.temp = element;
                    maxTemp.i = i;
                }
  
            }
            //Genera un objeto con la info necesaria para marcar en la grafica el día mas soleado
            tempMaxData[maxTemp.i] = {
                y: maxTemp.temp,
                marker: {
                    symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                },
                accessibility: {
                    description: 'El fue el día con la temperatura más alta de el último mes'
                }
            };
            //genera la configuración de la grafica para highcharts
        let config = {
            chart: {
              type: 'spline'
            },
            title: {
              text: 'Temperatura promedio '+title
            },
            subtitle: {
              text: 'Fuente: open-meteo.com, mymappi.com'
            },
            chart: {
                zoomType: 'x'
            }, 
            xAxis: {
              categories: data.daily.time,
              accessibility: {
                description: 'Fechas del último mes'
              }
            },
            yAxis: {
              title: {
                text: 'Temperature [°C]'
              },
              labels: {
                formatter: function () {
                  return this.value + '°';
                }
              }
            },
            tooltip: {
              crosshairs: true,
              shared: true
            },
            plotOptions: {
              spline: {
                marker: {
                  radius: 4,
                  lineColor: '#666666',
                  lineWidth: 1
                }
              }
            },
            series: [{
              name: title,
              marker: {
                symbol: 'diamond'
              },
              data: tempMaxData,
              color: "#007E06"
            }],
            
          }
        Highcharts.chart('container', config);//genera la gráfica en el contenedor indicado
        //Muestra las opciones de descarga de archivo
        document.querySelector("#cont-dwld").style.display = "flex";
        document.querySelector("#info").style.display = "block";
        })
      //Se hace la petición de los datos de temperatura por hora de un dia selecionado
      }else if (op == "hora") {
        var urlHora ;
        //Dependiendo si el usuario ingreso una fecha o no genera la url para la peticion
        if(fecha.value == ""){
          var d = new Date;
          urlHora = 'https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=temperature_2m&start_date='+d.genDate()+'&end_date='+d.genDate()
        }else{
          urlHora = 'https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&hourly=temperature_2m&start_date='+fecha.value+'&end_date='+fecha.value
        }
        fetch(urlHora)//Genra la peticion a open-meteo
        .then(res => res.json())
        .then((data)=>{
          info=data;//respuesta de open-meteo
          //variables que almacena las temperatura por hora y ayudan al calculo de la maxima
          var tempMaxData = data.hourly.temperature_2m;
          var maxTemp = {temp:tempMaxData[0], i:0}; 
          //Calcula la hora de maxima temperatura obtenida de un dia
          for (let i = 1; i < tempMaxData.length; i++) {
              const element = tempMaxData[i];
              if(maxTemp.temp < element){
                  maxTemp.temp = element;
                  maxTemp.i = i;
              }
          }
          //Genera el objeto para mostrar la maxima temperatura
          tempMaxData[maxTemp.i] = {
              y: maxTemp.temp,
              marker: {
                  symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
              },
              accessibility: {
                  description: 'El fue la hora con mayor temperatura'
              }
          };
          //Objeto con la configuracion de la grafica
      let config = {
          chart: {
            type: 'spline'
          },
          title: {
            text: 'Temperatura por hora '+title
          },
          subtitle: {
            text: 'Fuente: open-meteo.com, mymappi.com'
          },
          chart: {
              zoomType: 'x'
          }, 
          xAxis: {
            categories: data.hourly.time,
            accessibility: {
              description: 'Horas del día'
            }
          },
          yAxis: {
            title: {
              text: 'Temperature [°C]'
            },
            labels: {
              formatter: function () {
                return this.value + '°';
              }
            }
          },
          tooltip: {
            crosshairs: true,
            shared: true
          },
          plotOptions: {
            spline: {
              marker: {
                radius: 4,
                lineColor: '#666666',
                lineWidth: 1
              }
            }
          },
          series: [{
            name: title,
            marker: {
              symbol: 'diamond'
            },
            data: tempMaxData,
            color: "#249E50"
          }],
          
        }
      Highcharts.chart('container', config);//genera la grafica con la configuracion previa
      //Muestra las opciones para la descarga
      document.querySelector("#cont-dwld").style.display = "flex";
        document.querySelector("#info").style.display = "block";
         })
      }else{
        //En caso de error recarga la página
        alert("Ocurrio un error")
        location.reload()
      }
    })
})

