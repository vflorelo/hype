<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
$job_id    = $_POST["job_id"];
$ipr_file  = "./$job_id/$job_id.ipr.tsv";
if(file_exists($ipr_file)){
    $query_str = 0 ;
    }
else{
    $query_str = 1 ;
    }
$xml_str  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".
            "<check_job>\n".
            "  <job_id>$job_id</job_id>\n".
            "  <query_str>$query_str</query_str>\n".
            "</check_job>\n";
print $xml_str;
?>