<?php
#error_reporting(E_ALL);
#ini_set('display_errors', TRUE);
#ini_set('display_startup_errors', TRUE);
$job_id        = $_POST["job_id"];
$ann_source    = $_POST["ann_source"];
$run_mode      = $_POST["run_mode"];
$query_str     = 0 ;
$hype_tsv_file = "./$job_id/$job_id.$run_mode.$ann_source.tsv";
$xml_str  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".
            "<get_hype_results>\n".
            "  <job_id>$job_id</job_id>\n".
            "  <ann_source>$ann_source</ann_source>\n".
            "  <run_mode>$run_mode</run_mode>\n";
$inner_xml_str = "";
if(file_exists($hype_tsv_file)){
    $hype_tsv_str   = file_get_contents($hype_tsv_file);
    $hype_row_arr   = explode("\n", $hype_tsv_str);
    $hype_row_count = count($hype_row_arr);
    $xml_str       .= "  <row_count>$hype_row_count</row_count>\n";
    if($hype_row_count >= 2){
        $tmp_row_str = $hype_row_arr[1] ;
        $tmp_row_arr = explode("\t",$tmp_row_str);
        $bg_full_count  = $tmp_row_arr[6];
        $set_full_count = $tmp_row_arr[7];
        $xml_str .= "  <bg_full_count>$bg_full_count</bg_full_count>\n".
                    "  <set_full_count>$set_full_count</set_full_count>\n";
        $query_str = $query_str + 0 ;
        $inner_xml_str .= "  <domain_count>$hype_row_count</domain_count>\n";
        for ($row_num = 1 ; $row_num < $hype_row_count ; $row_num++) {
            $cur_row_str    = $hype_row_arr[$row_num];
            $cur_row_arr    = explode("\t",$cur_row_str);
            $accession      = $cur_row_arr[0];
            $status         = $cur_row_arr[1];
            $bg_count       = $cur_row_arr[2];
            $set_count      = $cur_row_arr[3];
            $pvalue         = $cur_row_arr[4];
            $qvalue         = $cur_row_arr[5];
            $description    = $cur_row_arr[9];
            $description    = htmlentities($description, ENT_QUOTES);
            $interval       = $cur_row_arr[6];
            $interval       = str_replace("[","",$interval);
            $interval       = str_replace("]","",$interval);
            $interval       = str_replace(" ","",$interval);
            $interval_arr   = explode(",",$interval);
            $min_exp        = $interval_arr[0];
            $max_exp        = $interval_arr[1];
            $inner_xml_str .= "  <entry>\n".
                              "    <accession>$accession</accession>\n".
                              "    <status>$status</status>\n".
                              "    <bg_count>$bg_count</bg_count>\n".
                              "    <set_count>$set_count</set_count>\n".
                              "    <pvalue>$pvalue</pvalue>\n".
                              "    <qvalue>$qvalue</qvalue>\n".
                              "    <description>$description</description>\n".
                              "    <min_exp>$min_exp</min_exp>\n".
                              "    <max_exp>$max_exp</max_exp>\n".
                              "  </entry>\n";
            }
        }
    else{
        $query_str = $query_str + 1 ;
        }
    }
else{
    $query_str = $query_str + 2 ;
    }
$xml_str .= "  <query_str>$query_str</query_str>\n";
$xml_str .= $inner_xml_str ;
$xml_str .= "</get_hype_results>\n";
print $xml_str;
?>