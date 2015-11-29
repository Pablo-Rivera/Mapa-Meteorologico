// Clase Pais
function Pais(nombre){
	this.nombre = nombre;
	this.provincia = [];
	this.inicializar();
};

// Metodo inicializar: Lee el Archivo de Configuracion de las Ciudades y las Crea
Pais.prototype.inicializar = function(){
	var auxiliarCiudades = new XMLHttpRequest();
	auxiliarCiudades.open('GET', 'datos/obtenerCiudades.php?pais=' + this.nombre, false);
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
				if(typeof this.provincia[auxiliarCampo[0]] == 'undefined'){
					this.provincia[auxiliarCampo[0]] = [];
				};
				this.provincia[auxiliarCampo[0]].push(new Ciudad(auxiliarCampo[1], auxiliarCampo[2], auxiliarCampo[3]));
			};
		};
	}, this);
	auxiliarCiudades.send();
};

// Clase Ciudad
function Ciudad(nombre, latitud, longitud){
	this.nombre = nombre;
	this.latitud = latitud;
	this.longitud = longitud;
};

var argentina = new Pais('argentina');