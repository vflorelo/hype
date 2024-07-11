<?php
$job_id = uniqid();
$target_file_name  = "./$job_id/$job_id.ipr.tsv" ;
$ipr_file_name     = $_FILES["ipr_file"]["name"];
$ipr_tmp_file_name = $_FILES["ipr_file"]["tmp_name"];
$ipr_file_error    = $_FILES["ipr_file"]["error"];
if ($ipr_file_error == 0){
    if (mkdir($job_id,0775,true)){
        chmod($job_id,0775);
        if (move_uploaded_file($ipr_tmp_file_name, $target_file_name)) {
            chmod($target_file_name, 0775);
            $query_str = 0 ;
            }
        else{
            $query_str = 1 ;
            }
        }
    else{
        $query_str = 2 ;
        }
    }
else{
    $query_str = 3 ;
    }
$xml_str  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".
            "<upload_ipr>\n".
            "  <query_str>$query_str</query_str>\n".
            "  <job_id>$job_id</job_id>\n".
            "</upload_ipr>\n";
print $xml_str;
?>