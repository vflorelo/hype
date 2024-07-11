<?php
#error_reporting(E_ALL);
#ini_set('display_errors', TRUE);
#ini_set('display_startup_errors', TRUE);
$job_id     = $_POST["job_id"];
$ann_source = $_POST["ann_source"];
$run_mode   = $_POST["run_mode"];
$file_name  = "./$job_id/$job_id.$run_mode.$ann_source.tsv";
file_exists($file_name)? $query_str = 0 : $query_str = 1 ;
$xml_str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".
           "<download_results>\n".
           "  <job_id>$job_id</job_id>\n".
           "  <ann_source>$ann_source</ann_source>\n".
           "  <run_mode>$run_mode</run_mode>\n".
           "  <query_str>$query_str</query_str>\n".
           "  <file_name>$file_name</file_name>\n".
           "</download_results>\n";
print $xml_str;
?>