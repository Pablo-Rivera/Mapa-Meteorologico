// Clase Mapa
function Mapa(){
	this.opcionesMapa = {
		zoom: 4,
		center: new google.maps.LatLng( -40.000000, -65.000000),
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	mapa = new google.maps.Map(document.getElementById('mapa'), this.opcionesMapa);
	this.paises = [];
	this.inicializar();
	this.actualizarMarcadores();
};

// Metodo inicializar: Lee el Archivo de Configuracion de los Paises y los Crea
Mapa.prototype.inicializar = function(){
	var auxiliarPaises = new XMLHttpRequest();
	auxiliarPaises.open('GET', 'api/obtenerPaises.php', false);
	auxiliarPaises.onreadystatechange = $.proxy(function(){
		if(auxiliarPaises.readyState == 4){
			var auxiliarLinea = auxiliarPaises.responseText.split(';');
			for(var i = 0; i < auxiliarLinea.length; i++){
				if(typeof this.paises[auxiliarLinea[i]] == 'undefined'){
					this.paises[auxiliarLinea[i]] = [];
				};
				this.paises[auxiliarLinea[i]] = new Pais($.trim(auxiliarLinea[i]));
			};
		};
	}, this);
	auxiliarPaises.send();
};

// Metodo actualizarMarcadores: Muestra u Oculta los Marcadores en Base al Zoom
Mapa.prototype.actualizarMarcadores = function(){
	for(var clavePais in this.paises){
		for(var claveProvincia in this.paises[clavePais].provincias){
			for(var claveCiudad in this.paises[clavePais].provincias[claveProvincia]){
				if(claveCiudad != 0){
					if(mapa.getZoom() == 7){
						this.paises[clavePais].provincias[claveProvincia][claveCiudad].marcador.setMap(mapa);
					} else if(mapa.getZoom() == 4){
						this.paises[clavePais].provincias[claveProvincia][claveCiudad].marcador.setMap(null);
					};
				} else {
					this.paises[clavePais].provincias[claveProvincia][claveCiudad].marcador.setMap(mapa);
				};
			};
		};
	};
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
function Ciudad(provincia, nombre, latitud, longitud){
	this.provincia = provincia;
	this.nombre = nombre;
	this.latitud = latitud;
	this.longitud = longitud;
	this.ventanaPronosticoExtendido = '';
	this.marcador = '';
	this.pronosticoExtendido = '<img src="imagenes/loading.png" class="center-block"></img>';
	this.temperatura = 'N/A';
	this.iconoClima = 'imagenes/loading.png';
	this.crearVentanaPronosticoExtendido();
	this.crearMarcador();
	this.obtenerClima();
};

// Metodo obtenerClima: Hace una Consulta al Web Service del Clima
Ciudad.prototype.obtenerClima = function(){
	$.proxy(
		$.ajax({
		type: 'GET',
		dataType: 'JSON',
		url: 'http://api.openweathermap.org/data/2.5/find?lat=' + this.latitud + '&lon=' + this.longitud + '&cnt=1&units=metric&appid=2de143494c0b295cca9337e1e96b00e0',
		success: $.proxy(
					function(data){
						this.temperatura = Math.floor(data.list[0].main.temp);
						this.iconoClima = 'imagenes/' + data.list[0].weather[0].icon + '.png';
						this.marcador.setTitle(this.provincia + ', ' + this.nombre + ' ' + this.temperatura + '*C');
						this.marcador.setIcon({url: this.iconoClima, anchor: new google.maps.Point(25, 25)});
					}, this),
		error: function(){
					alert('Error al Obtener el Clima');
				}
	}), this);
};

// Metodo obtenerPronosticoExtendido: Hace una Consulta al Web Service del Clima
Ciudad.prototype.obtenerPronosticoExtendido = function(){
	$.proxy(
		$.ajax({
		type: 'GET',
		async: true,
		dataType: 'JSON',
		url: 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + this.latitud + '&lon=' + this.longitud + '&cnt=5&units=metric&appid=2de143494c0b295cca9337e1e96b00e0',
		success: $.proxy(
					function(data){
						$.proxy(
							$.ajax({
								url: 'js/templates/pronosticoExtendido.mst',
								success: $.proxy(
											function(template){
												var hoy = new Date().getDay();
												var dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
												var variables = {
													'nombre': this.nombre,
													'iconoHoy': data.list[0].weather[0].icon,
													'tempMinHoy': Math.floor(data.list[0].temp.min),
													'tempMaxHoy': Math.floor(data.list[0].temp.max),
													'humedadHoy': Math.floor(data.list[0].humidity),
													'presionHoy': Math.floor(data.list[0].pressure),
													'diaB': dias[++hoy%7],
													'iconoB': data.list[1].weather[0].icon,
													'tempMinB': Math.floor(data.list[1].temp.min),
													'tempMaxB': Math.floor(data.list[1].temp.max),
													'humedadB': Math.floor(data.list[1].humidity),
													'presionB': Math.floor(data.list[1].pressure),
													'diaC': dias[++hoy%7],
													'iconoC': data.list[2].weather[0].icon,
													'tempMinC': Math.floor(data.list[2].temp.min),
													'tempMaxC': Math.floor(data.list[2].temp.max),
													'humedadC': Math.floor(data.list[2].humidity),
													'presionC': Math.floor(data.list[2].pressure),
													'diaD': dias[++hoy%7],
													'iconoD': data.list[3].weather[0].icon,
													'tempMinD': Math.floor(data.list[3].temp.min),
													'tempMaxD': Math.floor(data.list[3].temp.max),
													'humedadD': Math.floor(data.list[3].humidity),
													'presionD': Math.floor(data.list[3].pressure),
													'diaE': dias[++hoy%7],
													'iconoE': data.list[4].weather[0].icon,
													'tempMinE': Math.floor(data.list[4].temp.min),
													'tempMaxE': Math.floor(data.list[4].temp.max),
													'humedadE': Math.floor(data.list[4].humidity),
													'presionE': Math.floor(data.list[4].pressure)
												};
												this.pronosticoExtendido = Mustache.render(template, variables);
												this.ventanaPronosticoExtendido.setContent(this.pronosticoExtendido);
										 }, this)
						}), this);
					}, this)
	}), this);
};

// Metodo crearMarcador: Crea un Marcador con los Datos Propios
Ciudad.prototype.crearMarcador = function(){
	this.marcador = new google.maps.Marker({
		position: new google.maps.LatLng(this.latitud, this.longitud),
		title: this.provincia + ', ' + this.nombre + ' ' + this.temperatura + '*C',
		icon: {url: this.iconoClima, anchor: new google.maps.Point(25, 25)}
	});
	this.marcador.addListener('click', $.proxy(function(){
		this.obtenerPronosticoExtendido();
		this.ventanaPronosticoExtendido.open(mapa, this.marcador);
	}, this));
};

// Metodo crearVentanaEmergente: Crea una Ventana Emergente para Visualizar el Pronostico Extendido
Ciudad.prototype.crearVentanaPronosticoExtendido = function(){
	this.ventanaPronosticoExtendido = new google.maps.InfoWindow({
		content: this.pronosticoExtendido
	});
};

mapamundi = new Mapa();

mapa.addListener('zoom_changed', function(){
	if(mapa.getZoom() > 7){
		mapa.setZoom(7);
	} else if(mapa.getZoom() == 6){
		mapa.setZoom(4);
		mapamundi.actualizarMarcadores();
	} else if(mapa.getZoom() == 5){
		mapa.setZoom(7);
		mapamundi.actualizarMarcadores();
	} else if(mapa.getZoom() < 4){
		mapa.setZoom(4);
	};
});