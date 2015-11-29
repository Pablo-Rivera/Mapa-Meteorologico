<?php
	if($_REQUEST['pais']){
		$ciudades = file_get_contents('../config/' . $_REQUEST['pais'] . '/ciudades');
		if($ciudades){
			echo $ciudades;
		}
	}
?>