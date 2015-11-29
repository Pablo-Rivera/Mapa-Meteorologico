<?php
	// API CROTA PARA OBTENER LAS CIUDADES DEL PAIS INDICADO
	if($_REQUEST['pais']){
		$ciudades = file_get_contents('../config/' . $_REQUEST['pais'] . '/ciudades');
		if($ciudades){
			echo $ciudades;
		}
	}
?>