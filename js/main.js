// Clase Mapa
function Mapa(){
	this.opcionesMapa = {
		zoom: 5,
		center: new google.maps.LatLng( -40.300000, -65.136344),
		scrollwheel: false,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	this.mapa = new google.maps.Map(document.getElementById('mapa'), this.opcionesMapa);
	this.paises = [];
	this.inicializar();
};

// Metodo inicializar: Lee el Archivo de Configuracion de los Paises y los Crea
Mapa.prototype.inicializar = function(){
	var auxiliarPaises = new XMLHttpRequest();
	auxiliarPaises.open('GET', 'api/obtenerPaises.php', false);
	auxiliarPaises.onreadystatechange = $.proxy(function(){
		if(auxiliarPaises.readyState == 4){
			var auxiliarLinea = auxiliarPaises.responseText.split(';');
			for(var i = 0; i < auxiliarLinea.length; i++){
				this.paises.push(new Pais($.trim(auxiliarLinea[i])));
			};
		};
	}, this);
	auxiliarPaises.send();
};

// Clase Pais
function Pais(nombre){
	this.nombre = nombre;
	this.provincias = [];
	this.inicializar();
};

// Metodo inicializar: Lee el Archivo de Configuracion de las Ciudades y las Crea
Pais.prototype.inicializar = function(){
	var auxiliarCiudades = new XMLHttpRequest();
	auxiliarCiudades.open('GET', 'api/obtenerCiudades.php?pais=' + this.nombre, false);
	auxiliarCiudades.onreadystatechange = $.proxy(function(){
		if(auxiliarCiudades.readyState == 4){
			var auxiliarLinea = auxiliarCiudades.responseText.split(';');
			var auxiliarCampo = [];
			var indexInterno = 0;
			for(var i = 0; i < auxiliarLinea.length; i++){
				auxiliarCampo = auxiliarLinea[i].split(',');
				for(var j = 0; j < auxiliarCampo.length; j++){
					auxiliarCampo[j] = $.trim(auxiliarCampo[j]);
				};
				if(typeof this.provincias[auxiliarCampo[0]] == 'undefined'){
					this.provincias[auxiliarCampo[0]] = [];
				};
				this.provincias[auxiliarCampo[0]].push(new Ciudad(auxiliarCampo[0], auxiliarCampo[1], auxiliarCampo[2], auxiliarCampo[3]));
			};
		};
	}, this);
	auxiliarCiudades.send();
};

// Clase Ciudad
function Ciudad(nombre, provincia, latitud, longitud){
	this.nombre = nombre;
	this.provincia = provincia;
	this.latitud = latitud;
	this.longitud = longitud;
	this.temperatura = '';
	this.iconoClima = '';
};

var mapa = new Mapa();