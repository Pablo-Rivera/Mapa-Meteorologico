<?php
	// API CROTA PARA OBTENER LOS PAISES
	$paises = file_get_contents('../config/paises.ini');
	if($paises){
		echo $paises;
	}
?>