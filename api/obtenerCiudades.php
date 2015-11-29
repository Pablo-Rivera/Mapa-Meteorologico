<?php
	// API CROTA PARA OBTENER LAS CIUDADES DEL PAIS INDICADO
	if($_REQUEST['pais']){
		$ciudades = file_get_contents('../config/ciudades/' . $_REQUEST['pais'] . '.ini');
		if($ciudades){
			echo $ciudades;
		}
	}
?>