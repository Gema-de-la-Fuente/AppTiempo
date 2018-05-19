"use strict";
//------------Creación de variable----------------//

//appid de la aplicacion
var appid = "479092b77bcf850403cb2aeb1a302425";
//creo una variable con una url de localización fija
var urlAlcobendas = "https://api.openweathermap.org/data/2.5/forecast/daily?q=Alcobendas,es&lang=es&units=metric&mode=xml&appid=479092b77bcf850403cb2aeb1a302425";

//creo la variable donde voy a guardar la url completa con la información de la localización que nos va a dar el navegador
var urlWeather;
var urlTiempo;
//variable global para guardar el xml
var xmlData;
//variable global donde guardaremos nuestro array de objetos y el numbre de la ciudad
var aInfo;

var url2 = "http://api.openweathermap.org/data/2.5/forecast?q=Alcobendas,es&lang=es&units=metric&mode=xml&appid=9a6f55ccc997272bb9d7bcb47f35bdab";
var coordenadas ={
    long: "",
    lat: ""
};

//-----------------Funciones----------------------//

async function init() {

    var localizar= await localizacion();
    console.log("localizar " + localizar);
    var xmlResult2  = await xml2();
    //guardamos en el array aInfo la informacion obtenida en la funcion (ciudad, objetos tiempo)
    //aInfo = informacionObj(xmlData);
    aInfo = info2(xmlData);
    //imprimo el array
    imprimirApp(aInfo);

}

function localizacion(coodenadas) {
    console.log('Función obtenerLocalizacion2');
    return new Promise (resolve => {
        //        urlTiempo = "https:api.openweathermap.org/data/2.5/forecast?lat=" + coordenadas.lat + "&lon=" + coordenadas.long + "&lang=es&units=metric&mode=xml&appid=" + appid;
        urlTiempo=url2;
        resolve(urlTiempo);

    });

}

//Segunda peticion 
function xml2() {
    console.log('Funcion xml2');
    return new Promise(function(carga, nocarga) {
        //hacemos la petición del xml
        var xhttp = new XMLHttpRequest();
        //creamos un escuchador de eventos que llama a la función manageResponse
        xhttp.addEventListener('readystatechange', function() {
            if (this.readyState == 4 && this.status == 200) {
                //guardo el xml en la variable global xmlData
                xmlData = this.responseXML;
                carga(xmlData); 
                //lo meto en el else if porque si no me salta al else todo el rato ya que va pasando por diferentes estados la llamada
            } else if(this.readyState == 4) {
                //en el catch devolvemos el mensaje 'Error al cargar XML!'
                nocarga('Error al cargar XML!');
            }
        });
        //abrimos la url
        xhttp.open("GET", urlTiempo, true);
        //mandamos la peticion
        xhttp.send();
    });
}


function manageResponse(event) {
    if (this.readyState == 4 && this.status == 200) {
        crearObjetos(this); 
    }
};

function info2(xml){
    var linea;
    var aInfo = [];
    var tiempos = xml.getElementsByTagName("time");

    aInfo.push(xml.getElementsByTagName("name")[0].textContent);

    for(var i = 0; i < tiempos.length; i++){
        var info = new Tiempo();
        var dia_hora= tiempos[i].getAttribute("from").split("T");
        //console.log(dia_hora);

        info.hora = dia_hora[1];
        info.fecha = dia_hora[0];

        info.precipitation = tiempos[i].getElementsByTagName("precipitation")[0].getAttribute("type");
        info.windSpeed = tiempos[i].getElementsByTagName("windSpeed")[0].getAttribute("mps");
        info.temperature = tiempos[i].getElementsByTagName("temperature")[0].getAttribute("value");
        info.pressure = tiempos[i].getElementsByTagName("pressure")[0].getAttribute("value") + "%";
        info.humidity = tiempos[i].getElementsByTagName("humidity")[0].getAttribute("value") + "%";
        info.clouds = tiempos[i].getElementsByTagName("clouds")[0].getAttribute("all") + "%";
        info.symbol = tiempos[i].getElementsByTagName("symbol")[0].getAttribute("var");
        info.symbol = "http://openweathermap.org/img/w/" + info.symbol + ".png";
        aInfo.push(info);

    }
    console.log(aInfo);
    return aInfo;

}



//Creo una variable con la funcion del constructor del objeto Tiempo
var Tiempo = function (fecha, hora, temperature, minima, maxima, clouds, humidity, pressure, windSpeed, symbol) {
    this.fecha = fecha;
    this.hora = hora;
    this.temperature= temperature;
    this.minima= minima;
    this.maxima= maxima;
    this.clouds = clouds;
    this.humidity = humidity;
    this.pressure = pressure;
    this.windSpeed = windSpeed;
    this.symbol = symbol;   
}

//función imprimir

function imprimirApp(aInfo){
    console.log('Funcion imprimir');
    //caja es el contenedor principal que se va a imprimir en demo
    var cajaHTML = document.getElementById("demo");

    //donde voy a guardar "El tiempo en " + aInfo[0]
    var titulo = document.createElement("p");
    titulo.setAttribute("id", "titulo");
    //imprimo la información
    titulo.innerHTML = "El tiempo en " + aInfo[0] ;
    ////se la agrego a la caja
    cajaHTML.appendChild(titulo);

    //creo un bucle para poder imprimir la informacion de los tiempos
    for(var i = 1; i < aInfo.length; i++) {
        //Las variables que habian aqui no eran inutiles, ya que se crearan adelante
        var cajaInfo = document.createElement("div");

        //i<aInfo.length-1 para evitar undefined
        /**
        * Este if solo se activa al cambiar el dia, para que no de errores
        * el primer dia (i==0), tambien entra
        */
        if((i<aInfo.length-1 && aInfo[i].fecha != aInfo[i+1].fecha) || i==1){
            
             var contentDia = document.createElement("div");
            //textoTiempo(fecha, hora e icono)
             var textoDia = document.createElement("p");
             var info = " Fecha: " + aInfo[i+1].fecha;

             var cajaInfo = document.createElement("div");
             
            var img = document.createElement("img");
            img.setAttribute("src", aInfo[i].symbol);
            textoDia.innerHTML= info;
        


        //le añado la clase masInfo para darle el none con css
        cajaInfo.setAttribute("class", "masInfo");
        contentDia.classList.add('contentDia');
        textoDia.setAttribute("class", "textoDia");
        //añadimos un atributo a la p textoDia con valor de i

        //dia de la semana
        /*var dias=["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        var fechaJ = aInfo[i].fecha.split("-");
        var dt = new Date (fechaJ[1]+' '+fechaJ[2]+', '+fechaJ[0]+' 12:00:00');

        //me guardo en info dia de la semana, la fecha y la hora
        var info = dias[dt.getUTCDay()] + "// ";*/



        //me creo un elemento para imprimir el icono como src
        
     

        //------------------------------------------------------------------

        //añado un evento escuchador para la funcion click
        textoDia.addEventListener("click", function() {
            var content = this.parentElement;         
            //me guardo la clase que tiene el elemento al pulsarlo
            var tieneClase = content.getAttribute('class');
            //recorro todo el array de objetos y quito la clase activo
            var each = document.getElementsByClassName("contentDia");
            for(var i = 0; i < each.length; i++) {
                each[i].classList.remove("activo"); 
            }         
            //si el textoTiempo que he pulsado antes no tiene class active lo activo.       
            if(tieneClase != "activo") {
                content.classList.add("activo");       
            }
        });

        //---------------------------------------------------------------------

        //añado la img del icono a textoTiempo para que salga con fecha y hora.
            
        textoDia.appendChild(img);
        //añado el textoTiempo a contentTime
        contentDia.appendChild(textoDia);
        //guardo en la variable info la informacion de caja info
        info = 'Hora: ' + aInfo[i].hora + '<br>';
        info += 'Temperatura: ' + aInfo[i].temperature + '<br>';   
        info += 'Nubes: ' + aInfo[i].clouds + '<br>';
        info += 'Humedad: ' + aInfo[i].humidity + '<br>';
        info += 'Presión: ' + aInfo[i].pressure + '<br>';
        info += 'Viento: ' + aInfo[i].windSpeed + '<br>';
        img = document.createElement("img");
        img.setAttribute("src", aInfo[i].symbol);

        //añado la info a cajainfo
        cajaInfo.innerHTML= info;
        //añado cajainfo a contentTime
        contentDia.appendChild(cajaInfo);
        //añado el contentTime a la caja
        cajaHTML.appendChild(contentDia); 
        }else{
                
        
        //añado el textoTiempo a contentTime
        //contentDia.appendChild(textoDia);
        //guardo en la variable info la informacion de caja info
        info = 'Hora: ' + aInfo[i].hora + '<br>';
        info += 'Temperatura: ' + aInfo[i].temperature + '<br>';   
        info += 'Nubes: ' + aInfo[i].clouds + '<br>';
        info += 'Humedad: ' + aInfo[i].humidity + '<br>';
        info += 'Presión: ' + aInfo[i].pressure + '<br>';
        info += 'Viento: ' + aInfo[i].windSpeed + '<br>';
        /*img = document.createElement("img");
        img.setAttribute("src", aInfo[i].symbol);
        textoDia.appendChild(img);*/
        //añado la info a cajainfo
        cajaInfo.innerHTML= info;
        cajaInfo.setAttribute('class', 'masInfo')
        //añado cajainfo a contentTime
        contentDia.appendChild(cajaInfo);
        //añado el contentTime a la caja
        cajaHTML.appendChild(contentDia);  
        }
    } 

}


window.onload = function(){
    init();
};