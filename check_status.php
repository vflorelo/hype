<?php
#error_reporting(E_ALL);
#ini_set('display_errors', TRUE);
#ini_set('display_startup_errors', TRUE);
$job_id        = $_POST["job_id"];
$ann_source    = $_POST["ann_source"];
$run_mode      = $_POST["run_mode"];
$query_str     = 0 ;
$status_file   = "./$job_id/$job_id.status.txt";
$log_file      = "./$job_id/$job_id.log";
if(file_exists($log_file)){
    file_exists($status_file) ? $job_status = file_get_contents($status_file) : $job_status = "preparing";
    $query_str += 0 ;
    }
else{
    $query_str += 1 ;
    $job_status = "failed";
    }
$xml_str = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".
           "<check_status>\n".
           "  <job_id>$job_id</job_id>\n".
           "  <ann_source>$ann_source</ann_source>\n".
           "  <run_mode>$run_mode</run_mode>\n".
           "  <query_str>$query_str</query_str>\n".
           "  <job_status>$job_status</job_status>\n".
           "</check_status>\n";
print $xml_str;
?>