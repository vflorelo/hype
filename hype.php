<?php
#error_reporting(E_ALL);
#ini_set('display_errors', TRUE);
#ini_set('display_startup_errors', TRUE);
$job_id           = $_POST["job_id"];
$bg_dist          = $_POST["bg_dist"];
$gene_list_eval   = $_POST["gene_list_eval"];
$test_dist        = $_POST["test_dist"];
$gene_set_eval    = $_POST["gene_set_eval"];
$ann_source       = $_POST["ann_source"];
$run_mode         = $_POST["run_mode"];
$hype_file_name   = "./$job_id/$job_id.$run_mode.$ann_source.tsv" ;
$ipr_tsv_file     = "./$job_id/$job_id.ipr.tsv" ;
$hype_status_file = "./$job_id/$job_id.status.txt" ;
$hype_log_file    = "./$job_id/$job_id.log" ;
$hype_err_file    = "./$job_id/$job_id.err" ;
$query_str        = 0 ;
$hype_cmd_str     = "hype.py --crit p-value --q_value 0.05 --p_value 0.05 --out_file $hype_file_name --tsv_file $ipr_tsv_file --web_log $hype_status_file ";
if(file_exists($ipr_tsv_file)){
    switch($gene_list_eval){
        case "1":
        case "3":
        case "5":
        case "7":
            $gene_list_file        = $_FILES["bg_dist"]["name"];
            $gene_list_tmp_file    = $_FILES["bg_dist"]["tmp_name"];
            $gene_list_file_error  = $_FILES["bg_dist"]["error"];
            $gene_list_target_file = "./$job_id/$job_id.full.idlist";
            if (move_uploaded_file($gene_list_tmp_file, $gene_list_target_file)) {
                $query_str = $query_str + 0 ;
                }
            else{
                $query_str = $query_str + 1 ;
                }
            $hype_cmd_str .= "--full_gene_list $gene_list_target_file ";
            break ;
        case "2":
        case "6":
            $full_gene_count = $bg_dist ;
            $hype_cmd_str .= "--full_gene_len $full_gene_count ";
            break ;
        case "4":
            $bg_arr                = explode(",",$bg_dist) ;
            $gene_list_target_file = "./$job_id/$job_id.full.idlist";
            $bg_arr_output         = implode("\n", $bg_arr);
            $hype_cmd_str         .= "--full_gene_list $gene_list_target_file ";
            $gene_list_target_fh   = fopen($gene_list_target_file,"w");
            fwrite($gene_list_target_fh, $bg_arr_output);
            fclose($gene_list_target_fh);
            if(file_exists($gene_list_target_file)){
                $query_str = $query_str + 0 ;
                }
            else{
                $query_str = $query_str + 2 ;
                }
            break ;
        }
    switch($gene_set_eval){
        case "1":
        case "3":
            $gene_set_file        = $_FILES["test_dist"]["name"];
            $gene_set_tmp_file    = $_FILES["test_dist"]["tmp_name"];
            $gene_set_file_error  = $_FILES["test_dist"]["error"];
            $gene_set_target_file = "./$job_id/$job_id.set.idlist";
            if (move_uploaded_file($gene_set_tmp_file, $gene_set_target_file)) {
                $query_str = $query_str + 0 ;
                }
            else{
                $query_str = $query_str + 4 ;
                }
            $hype_cmd_str .= "--sub_gene_list $gene_set_target_file ";
            break ;
        case "2":
            $test_arr              = explode(",",$test_dist) ;
            $gene_set_target_file  = "./$job_id/$job_id.set.idlist";
            $test_arr_output       = implode("\n", $test_arr);
            $hype_cmd_str         .= "--sub_gene_list $gene_set_target_file ";
            $gene_set_target_fh    = fopen($gene_set_target_file,"w");
            fwrite($gene_set_target_fh, $test_arr_output);
            fclose($gene_set_target_fh);
            if(file_exists($gene_set_target_file)){
                $query_str = $query_str + 0 ;
                }
            else{
                $query_str = $query_str + 8 ;
                }
            break ;
        }
    $hype_cmd_str .= "--ann_source $ann_source ";
    $hype_cmd_str .= "--run_mode $run_mode ";
    }
else{
    $query_str = $query_str + 16 ;
    }

if($query_str == 0){
    shell_exec("python3 $hype_cmd_str > $hype_log_file 2> $hype_err_file & ");
    }
$xml_str  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n".
"<hype>\n".
"  <query_str>$query_str</query_str>\n".
"  <job_id>$job_id</job_id>\n".
"  <ann_source>$ann_source</ann_source>\n".
"  <run_mode>$run_mode</run_mode>\n".
"  <gene_list_eval>$gene_list_eval</gene_list_eval>\n".
"  <gene_set_eval>$gene_set_eval</gene_set_eval>\n".
"</hype>\n";
print $xml_str;
?>