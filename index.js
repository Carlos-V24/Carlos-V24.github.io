//Variables
//Codigos postales
const EN_FED = {
  "1": { "Nombre": "AGUASCALIENTES", "code": "mx-ag", "casos": 0 },
  "2": { "Nombre": "BAJA CALIFORNIA", "code": "mx-bc", "casos": 0 },
  "3": { "Nombre": "BAJA CALIFORNIA SUR", "code": "mx-bs", "casos": 0 },
  "4": { "Nombre": "CAMPECHE", "code": "mx-cm", "casos": 0 },
  "5": { "Nombre": "COAHUILA", "code": "mx-co", "casos": 0 },
  "6": { "Nombre": "COLIMA", "code": "mx-cl", "casos": 0 },
  "7": { "Nombre": "CHIAPAS", "code": "mx-cs", "casos": 0 },
  "8": { "Nombre": "CHIHUAHUA", "code": "mx-ch", "casos": 0 },
  "9": { "Nombre": "CIUDAD DE MEXICO", "code": "mx-df", "casos": 0 },
  "10": { "Nombre": "DURANGO", "code": "mx-dg", "casos": 0 },
  "11": { "Nombre": "GUANAJUATO", "code": "mx-gj", "casos": 0 },
  "12": { "Nombre": "GUERRERO", "code": "mx-gr", "casos": 0 },
  "13": { "Nombre": "HIDALGO", "code": "mx-hg", "casos": 0 },
  "14": { "Nombre": "JALISCO", "code": "mx-ja", "casos": 0 },
  "15": { "Nombre": "MEXICO", "code": "mx-mx", "casos": 0 },
  "16": { "Nombre": "MICHOACAN", "code": "mx-mi", "casos": 0 },
  "17": { "Nombre": "MORELOS", "code": "mx-mo", "casos": 0 },
  "18": { "Nombre": "NAYARIT", "code": "mx-na", "casos": 0 },
  "19": { "Nombre": "NUEVO LEON", "code": "mx-nl", "casos": 0 },
  "20": { "Nombre": "OAXACA", "code": "mx-oa", "casos": 0 },
  "21": { "Nombre": "PUEBLA", "code": "mx-pu", "casos": 0 },
  "22": { "Nombre": "QUERETARO", "code": "mx-qt", "casos": 0 },
  "23": { "Nombre": "QUINTANA ROO", "code": "mx-qr", "casos": 0 },
  "24": { "Nombre": "SAN LUIS POTOSI", "code": "mx-sl", "casos": 0 },
  "25": { "Nombre": "SINALOA", "code": "mx-si", "casos": 0 },
  "26": { "Nombre": "SONORA", "code": "mx-so", "casos": 0 },
  "27": { "Nombre": "TABASCO", "code": "mx-tb", "casos": 0 },
  "28": { "Nombre": "TAMAULIPAS", "code": "mx-tm", "casos": 0 },
  "29": { "Nombre": "TLAXCALA", "code": "mx-tl", "casos": 0 },
  "30": { "Nombre": "VERACRUZ", "code": "mx-ve", "casos": 0 },
  "31": { "Nombre": "YUCATAN", "code": "mx-yu", "casos": 0 },
  "32": { "Nombre": "ZACATECAS", "code": "mx-za", "casos": 0 }
}
const Casos = { "01/01/2020": { "Enfermos": 0, "Muertos": 0, "Recuperados": 0 } }
const Edades = {}
const Global = { "Enfermos": 0, "Muertos": 0, "Recuperados": 0 }
const edades = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]


//Obtiene de una bivlioteca online el mapa de la republica méxicana
var data = Highcharts.geojson(Highcharts.maps['countries/mx/mx-all']),
  separators = Highcharts.geojson(Highcharts.maps['countries/mx/mx-all'], 'mapline'),
  // Lo vuelve resposivo
  small = $('#container').width() < 400;

fetch("https://docs.google.com/spreadsheets/d/13NbdBMNQc3MdiGJyw1p2TrAdauvnj3w8fWajBu1Be-A/gviz/tq?tqx=out:json")
  .then(response => response.text())
  .then(data => {
    let jsonData = JSON.parse(data.substring(47).slice(0, -2)); // Limpiar JSON
    jsonData.table.rows.forEach(element => {
      let state = element.c[7].f
      let fecha_infec = element.c[10].f
      let fecha_muerto = element.c[12].v
      let edad = element.c[15].v
      let sexo = element.c[5].v

      //Calcula los casos de enfermos
      if (Casos[fecha_infec] != undefined) {
        Casos[fecha_infec].Enfermos += 1
        Global.Enfermos += 1
      } else {
        Casos[fecha_infec] = { "Enfermos": 1, "Muertos": 0, "Recuperados": 0 }
        Global.Enfermos += 1
      }
      //Calcula los enfermos muertos
      if (fecha_muerto != "9999-99-99") {
        if ((Casos[fecha_muerto] != undefined)) {
          Casos[fecha_muerto].Muertos += 1
          Global.Muertos += 1
        } else {
          Casos[fecha_muerto] = { "Enfermos": 0, "Muertos": 1, "Recuperados": 0 }
          Global.Muertos += 1
        }
      }

      if (state != null) {
        EN_FED[state].casos += 1
      }

      //Calcula las incidencias por estado
      if (state != null) {
        EN_FED[state].casos += 1
      }

      if (Math.floor(edad/5)<17) {
        edades[sexo-1][Math.floor(edad/5)]+=1
      }else{
        edades[sexo-1][17]+=1
      }
      


    });
  }).then(() => {

    // Ordenar las fechas
    // Ordenar las fechas cronológicamente
    const fechasOrdenadas = Object.keys(Casos).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    // Obtener los valores de "Enfermos" y "Muertos" en el mismo orden de las fechas
    const enfermos = fechasOrdenadas.map(fecha => Casos[fecha]["Enfermos"]);
    const muertos = fechasOrdenadas.map(fecha => Casos[fecha]["Muertos"]);

    console.log(fechasOrdenadas);
    console.log(enfermos);
    console.log(muertos);

    // Set drilldown pointers
    $.each(data, function (i) {
      let foundItem = Object.values(EN_FED).find(item => item.code == this.properties['hc-key']);
      if (foundItem != null) {
        this.drilldown = foundItem.code;
        this.value = foundItem.casos;
      }
    }); 
    // Instantiate the map
    Highcharts.mapChart('container', {
      chart: {
        events: {
          drilldown: function (e) {
            if (!e.seriesOptions) {
              var chart = this,
                mapKey = 'countries/mx/' + e.point.drilldown + '-all',
                // Handle error, the timeout is cleared on success
                fail = setTimeout(function () {
                  if (!Highcharts.maps[mapKey]) {
                    chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                    fail = setTimeout(function () {
                      chart.hideLoading();
                    }, 1000);
                  }
                }, 3000);

              // Show the spinner
              chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

              // Load the drilldown map
              $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function () {

                data = Highcharts.geojson(Highcharts.maps[mapKey]);

                // Set a non-random bogus value
                $.each(data, function (i) {
                  this.value = i;
                });

                // Hide loading and add series
                chart.hideLoading();
                clearTimeout(fail);
                chart.addSeriesAsDrilldown(e.point, {
                  name: e.point.name,
                  data: data,
                  dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                  }
                });
              });
            }

            this.setTitle(null, { text: e.point.name });
          },
          drillup: function () {
            this.setTitle(null, { text: '' });
          }
        }
      },

      title: {
        text: 'Datos por estado de H5N1'
      },

      subtitle: {
        text: '',
        floating: true,
        align: 'right',
        y: 50,
        style: {
          fontSize: '16px'
        }
      },

      legend: small ? {} : {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      colorAxis: {
        min: 0,
        minColor: '#ffcdd2',
        maxColor: '#da0000'
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },

      plotOptions: {
        map: {
          states: {
            hover: {
              color: '#EEDD66'
            }
          }
        }
      },

      series: [{
        data: data,
        name: 'México',
        dataLabels: {
          enabled: true,
          format: '{point.properties.postal-code}'
        }
      }, {
        type: 'mapline',
        data: separators,
        color: 'silver',
        enableMouseTracking: false,
        animation: {
          duration: 500
        }
      }],

      drilldown: {
        activeDataLabelStyle: {
          color: '#FFFFFF',
          textDecoration: 'none',
          textOutline: '1px #000000'
        },
        drillUpButton: {
          relativeTo: 'spacingBox',
          position: {
            x: 0,
            y: 60
          }
        }
      }
    });

    //Grafica mamadora
    const charti = document.getElementById('myChart');

    new Chart(charti, {
      type: 'line',
      data: {
          labels: fechasOrdenadas,  // Fechas en el eje X
          datasets: [
              {
                  label: 'Enfermos',
                  data: enfermos,
                  borderColor: "#ff0000",
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                  fill: true
              },
              {
                  label: 'Muertos',
                  data: muertos,
                  borderColor: "#0000ff",
                  backgroundColor: "rgba(0, 0, 255, 0.2)",
                  fill: true
              }
          ]
      },
      options: {
          responsive: true,
          scales: {
              x: {
                  ticks: {
                      callback: function(value, index, values) {
                          return index % 2 === 0 ? this.getLabelForValue(value) : ''; // Mostrar cada 15 días aprox.
                      }
                  }
              },
              y: {
                  beginAtZero: true
              }
          }
      }
  });

  const ctx = document.getElementById('pyramidChart').getContext('2d');
        
        const data_char = {
            labels: ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80+"],
            datasets: [
                {
                    label: "Hombres",
                    data: edades[0].map(value => value * -1),
                    backgroundColor: "blue",
                },
                {
                    label: "Mujeres",
                    data: edades[1],
                    backgroundColor: "pink",
                },
            ]
        };

        const options_char = {
            indexAxis: "y",
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        callback: function (value) {
                            return Math.abs(value);
                        },
                    },
                },
                y: {
                    stacked: true,
                },
            },
            plugins: {
                legend: { position: "top" },
            },
        };

        new Chart(ctx, {
            type: 'bar',
            data: data_char,
            options: options_char
        });
    //DOM
    document.getElementById("confirmados").textContent = Global.Enfermos
    document.getElementById("muertos").textContent = Global.Muertos

  });





