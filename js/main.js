$(document).ready(function(){

	// Clase Pais
	function Pais(nombre){
		this.archivoCiudades = 'https://dl.dropboxusercontent.com/s/00i60snrt36w7i3/ciudades.txt';
		this.provincia = [];
		this.inicializar();
	};

	// Metodo inicializar: Lee el Archivo de Configuracion de las Ciudades y las Crea
	Pais.prototype.inicializar = function(){
		alert('SE EJECUTO INICIALIZAR');
		var auxiliarCiudades = new XMLHttpRequest();
		alert(this.archivoCiudades);
		auxiliarCiudades.open("GET", this.archivoCiudades , false);
		auxiliarCiudades.onreadystatechange = function(){
			alert('LEYO EL ARCHIVO');
			var auxiliarLinea = trim(auxiliarCiudades.responseText.split(/\r\n|\n/));
			var auxiliarCampo = [];
			for(var i = 0; i < auxiliarLinea.length; i++){
				alert('ARRANCO A CICLAR');
				auxiliarCampo = trim(auxiliarLinea[i].split(','));
				this.provincia[auxiliarCampo[0]] = [];
				this.provincia[auxiliarCampo[0]].push(new Ciudad(auxiliarCampo[1], auxiliarCampo[2], auxiliarCampo[3]));
			};
		};
	};

	// Clase Ciudad
	function Ciudad(nombre, latitud, longitud){
		this.nombre = nombre;
		this.latitud = latitud;
		this.longitud = longitud;
	};

	var argentina = new Pais('argentina');

});