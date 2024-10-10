function resize_divs(){
	let body_height = $(window).height() ;
	let body_width  = $(window).width() ;
	let width_10    = body_width / 10;
	let width_20    = width_10 * 2 ;
	let width_30    = width_10 * 3 ;
	let width_50    = width_10 * 5 ;
	$("#input_div").css({  "height": body_height, "max-height": body_height, "width": width_20, "max-width": width_20, "overflow" : "scroll" , "position": "absolute", "top": 0, "left": 0});
	$("#results_div").css({"height": body_height, "max-height": body_height, "width": width_30, "max-width": width_30, "overflow" : "scroll" , "position": "absolute", "top": 0, "left": width_20});
	$("#info_div").css({   "height": body_height, "max-height": body_height, "width": width_50, "max-width": width_50, "overflow" : "scroll" , "position": "absolute", "top": 0, "left": width_50});
	}
function enable_upload_button(file_name){
	if (file_name==""){
		$("#upload_button").attr("disabled",true).attr("enabled",false) ;
		$("#upload_button").removeClass("btn-primary").addClass("btn-secondary")
		$("#upload_button").attr("onclick","")
		}
	else{
		$("#upload_button").attr("disabled",false).attr("enabled",true) ;
		$("#upload_button").removeClass("btn-secondary").addClass("btn-primary")
		$("#upload_button").attr("onclick","upload_ipr()")
		}
	}
function clear_inputs(){
	$(":input").each(function(){
		$(this).val("");
	   });
	$("#hype_button").attr("disabled",true).attr("enabled",false) ;
	$("#hype_button").removeClass("btn-success").addClass("btn-secondary")
	}
function upload_ipr(){
	toggle_spinner("start");
	let form_data = new FormData();
	let ipr_file  = $("#ipr_file_input").prop("files")[0];
	form_data.append("ipr_file",ipr_file);
	$("#status_dialog_message").html("Your file is being uploaded");
	$("#status_dialog").modal("show");
	$.ajax({
		url: "upload_ipr.php",
		cache:       false,
		contentType: false,
		processData: false,
		data:        form_data,
		type:        'post',
		complete: function (upload_ipr){
			$("#status_dialog").modal("hide");
			let status_html_str ;
			let response_xml = upload_ipr.responseText ;
			let xml_data     = $.parseXML(response_xml);
			$xml_data        = $(xml_data);
			let query_str    = $xml_data.find("query_str").text();
			let job_id       = $xml_data.find("job_id").text();
			let alert_arr    = $("#ipr_file_status").attr("class").split(" ")
			let file_str     = "";
			let alert_class  = "" ;
			const alert_bg_arr = ["alert-warning","alert-danger","alert-success","alert-secondary"] ;
			for (let alert_bg in alert_bg_arr){
				if (alert_arr.includes(alert_bg)){
					$("#ipr_file_status").removeClass(alert_bg);
					}
				}
			switch(query_str){
				case "0" :
					file_str = "OK" ;
					alert_class = "alert-success" ;
					break ;
				case "1" :
					file_str = query_str ;
					alert_class = "alert-warning" ;
					break ;
				case "2" :
				case "3" :
					file_str =  query_str ; 
					alert_class = "alert-danger" ;
					break ;
				}
			if(query_str == 0){
				toggle_inputs("enable")
				$("#job_id").val(job_id);
				status_html_str =	"<p>Your file has been successfully uploaded</p>\n"+
									"<p>Your job ID is: "+job_id+"</p>\n"+
									"<div class='row'>\n"+
									"  <div class='col-6'>\n"+
									"    <div class='btn btn-success form-control' onclick='copy_job_id(\""+job_id+"\")'>\n"+
									"      <span class='bi bi-copy'></span>\n"+
									"    </div>\n"+
									"  </div>\n"+
									"  <div class='col-6'>\n"+
									"    <div class='btn btn-danger form-control' onclick='close_status_dialog()'>\n"+
									"      <span class='bi bi-x'></span>\n"+
									"    </div>\n"+
									"  </div>\n"+
									"</div>";
				}
			else{
				toggle_inputs("disable");
				status_html_str =	"<p>There was an error uploading your file</p>\n"+
									"<div class='row'>\n"+
									"  <div class='col-6 offset-3'>\n"+
									"    <div class='btn btn-danger form-control' onclick='close_status_dialog()'>\n"+
									"      <span class='bi bi-x'></span>\n"+
									"    </div>\n"+
									"  </div>\n"+
									"</div>";
				}
			$("#status_dialog_message").html(status_html_str);
			$("#status_dialog").modal("show");
			html_str = "File_status: "+file_str ;
			$("#ipr_file_status").addClass(alert_class);
			$("#ipr_file_status").html(html_str);
			toggle_spinner("stop");
			}
		})
	}
function close_status_dialog(){
	$("#status_dialog").modal("hide");
	}
function copy_job_id(job_id){
	if (navigator && navigator.clipboard && navigator.clipboard.writeText){
		navigator.clipboard.writeText(job_id);
		}
	else{
		alert("not supported")
		}
	}
function toggle_inputs(action){
	if (action == "enable"){
		$("#ann_source").attr("disabled",false).attr("enabled",true) ;
		$("#run_mode").attr("disabled",false).attr("enabled",true) ;
		$("#gene_list_count_input").attr("disabled",false).attr("enabled",true) ;
		$("#gene_list_input").attr("disabled",false).attr("enabled",true) ;
		$("#gene_list_file_input").attr("disabled",false).attr("enabled",true) ;
		$("#gene_set_list_input").attr("disabled",false).attr("enabled",true) ;
		$("#gene_set_file_input").attr("disabled",false).attr("enabled",true) ;
		}
	else if (action == "disable"){
		$("#ann_source").attr("enabled",false).attr("disabled",true) ;
		$("#run_mode").attr("enabled",false).attr("disabled",true) ;
		$("#gene_list_count_input").attr("enabled",false).attr("disabled",true) ;
		$("#gene_list_input").attr("enabled",false).attr("disabled",true) ;
		$("#gene_list_file_input").attr("enabled",false).attr("disabled",true) ;
		$("#gene_set_list_input").attr("enabled",false).attr("disabled",true) ;
		$("#gene_set_file_input").attr("enabled",false).attr("disabled",true) ;
		}
	}
function verify_form(){
	let ann_source      = $("#ann_source").val();
	let ann_source_test = "" ;
	let gene_list_count = $("#gene_list_count_input").val();
	let gene_list       = $("#gene_list_input").val();
	let gene_list_file  = $("#gene_list_file_input").val();
	let gene_list_eval  = "" ;
	let gene_set_list   = $("#gene_set_list_input").val();
	let gene_set_file   = $("#gene_set_file_input").val();
	let gene_set_eval   = "" ;
	ann_source == "" ? ann_source_test = "fail" : ann_source_test = "pass" ;
	if( gene_list_count != "" || gene_list != "" || gene_list_file != "" ){
		gene_list_eval = "pass" ;
		}
	else{
		gene_list_eval = "fail"
		}
	if( gene_set_list != "" || gene_set_file != "" ){
		gene_set_eval = "pass" ;
		}
	else{
		gene_set_eval = "fail" ;
		}
	if( ann_source_test == "pass" && gene_list_eval == "pass" && gene_set_eval == "pass" ){
		$("#hype_button").attr("disabled",false).attr("enabled",true).attr("onclick","hype()") ;
		$("#hype_button").removeClass("btn-secondary").addClass("btn-success")
		}
	else{
		$("#hype_button").attr("disabled",true).attr("enabled",false).attr("onclick","") ;
		$("#hype_button").removeClass("btn-success").addClass("btn-secondary")
		}
	}
function hype(){
	toggle_spinner("start");
	let bg_dist
	let form_data       = new FormData();
	let target_url      = "hype.php";
	let job_id          = $("#job_id").val()
	let ann_source      = $("#ann_source").val();
	let run_mode        = ""
	let run_mode_check  = $("#run_mode").is(":checked");
	run_mode_check ? run_mode = "integrated" : run_mode = "normal" ;
	let gene_list_file  = $("#gene_list_file_input").val();
	let gene_list_count = $("#gene_list_count_input").val();
	let gene_list       = $("#gene_list_input").val();
	let gene_list_eval  = 0 ;
	gene_list_file  == "" ? gene_list_eval += 0 : gene_list_eval += 1 ;
	gene_list_count == "" ? gene_list_eval += 0 : gene_list_eval += 2 ;
	gene_list       == "" ? gene_list_eval += 0 : gene_list_eval += 4 ;
	switch(gene_list_eval){
		case 1:
			bg_dist = $("#gene_list_file_input").prop("files")[0];
			break ;
		case 2:
			bg_dist = gene_list_count ;
			break ;
		case 3:
			bg_dist = $("#gene_list_file_input").prop("files")[0];
			break ;
		case 4:
			gene_list     = gene_list.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g,"");
			gene_list_arr = gene_list.split("\n");
			gene_list_str = gene_list_arr.toString();
			bg_dist = gene_list_str ;
			break;
		case 5:
			bg_dist = $("#gene_list_file_input").prop("files")[0];
			break ;
		case 6:
			bg_dist = gene_list_count ;
			break ;
		case 7:
			bg_dist = $("#gene_list_file_input").prop("files")[0];
			break ;
		}
	let gene_set_file   = $("#gene_set_file_input").val();
	let gene_set_list   = $("#gene_set_list_input").val();
	let gene_set_eval   = 0 
	gene_set_file  == "" ? gene_set_eval += 0 : gene_set_eval += 1 ;
	gene_set_list  == "" ? gene_set_eval += 0 : gene_set_eval += 2 ;
	switch(gene_set_eval){
		case 1:
			test_dist = $("#gene_set_file_input").prop("files")[0];
			break ;
		case 2:
			gene_set_list = gene_set_list.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g,"");
			gene_set_arr  = gene_set_list.split("\n");
			gene_set_str  = gene_set_arr.toString();
			test_dist = gene_set_str ;
			break ;
		case 3:
			test_dist = $("#gene_set_file_input").prop("files")[0];
			break ;
		}
	form_data.append("job_id",         job_id);
	form_data.append("bg_dist",        bg_dist);
	form_data.append("gene_list_eval", gene_list_eval);
	form_data.append("test_dist",      test_dist);
	form_data.append("gene_set_eval",  gene_set_eval);
	form_data.append("ann_source",     ann_source);
	form_data.append("run_mode",       run_mode);
	$.ajax({
		url:         target_url,
		cache:       false,
		contentType: false,
		processData: false,
		data:        form_data,
		type:        'post',
		complete: function (hype){
			let response_xml    = hype.responseText ;
			let xml_data        = $.parseXML(response_xml);
			$xml_data           = $(xml_data);
			let query_str       = parseInt($xml_data.find("query_str").text());
			let job_id          = $xml_data.find("job_id").text();
			let ann_source      = $xml_data.find("ann_source").text();
			let run_mode        = $xml_data.find("run_mode").text();
			let html_str        = "<p>JobID: "+job_id+"</p>\n"+
			                      "<p>Annotation source: "+ann_source+"</p>"+
								  "<p>Run mode: "+run_mode+"</p>";
			$("#status_dialog_message").html(html_str);
			toggle_spinner("stop");
			$("#status_dialog").modal("show");
			setTimeout(function(){
				if(query_str == 0){
					$("#status_dialog").modal("hide");
					check_status(job_id,ann_source,run_mode);
					}
				},2500);
			}
		})
	}
function toggle_spinner(spinner_action){
	if(spinner_action == "start"){
		$("#loading_div").removeClass("d-none").addClass("d-flex");
		}
	else if(spinner_action == "stop"){
		$("#loading_div").removeClass("d-flex").addClass("d-none");
		}
	}
function check_status(job_id,ann_source,run_mode){
	toggle_spinner("start");
	let form_data = new FormData();
	form_data.append("job_id",job_id);
	form_data.append("ann_source",ann_source);
	form_data.append("run_mode",run_mode);
	$.ajax({
		url: "check_status.php",
		cache:       false,
		contentType: false,
		processData: false,
		data:        form_data,
		type:        'post',
		complete: function (status){
			let response_xml = status.responseText ;
			let xml_data     = $.parseXML(response_xml);
			$xml_data        = $(xml_data);
			let query_str    = $xml_data.find("query_str").text();
			let job_id       = $xml_data.find("job_id").text();
			let job_status   = $xml_data.find("job_status").text();
			let ann_source   = $xml_data.find("ann_source").text();
			let run_mode     = $xml_data.find("run_mode").text();
			if (query_str == "0"){
				if(job_status == "finished" ){
					toggle_spinner("stop");
					get_hype_results(job_id,ann_source,run_mode);
					}
				else{
					setTimeout(function(){
						toggle_spinner("stop");
						check_status(job_id,ann_source,run_mode);
						},5000);
					}
				}
			}
		})
	}
function get_hype_results(job_id,ann_source,run_mode){
	toggle_spinner("start");
	let form_data = new FormData();
	form_data.append("job_id",job_id);
	form_data.append("ann_source",ann_source);
	form_data.append("run_mode",run_mode);
	$.ajax({
		url: "get_hype_results.php",
		cache:       false,
		contentType: false,
		processData: false,
		data:        form_data,
		type:        'post',
		complete: function (get_hype_results){
			toggle_spinner("stop");
			let response_xml = get_hype_results.responseText ;
			let xml_data     = $.parseXML(response_xml);
			$xml_data        = $(xml_data);
			let query_str    = $xml_data.find("query_str").text();
			let ann_source   = $xml_data.find("ann_source").text();
			let run_mode     = $xml_data.find("run_mode").text();
			let base_url     = "";
			if(run_mode == "integrated"){
				base_url = "https://www.ebi.ac.uk/interpro/entry/InterPro/";
				}
			else if(run_mode == "normal"){
				switch (ann_source){
					case "Pfam":            base_url = "https://www.ebi.ac.uk/interpro/entry/pfam/"       ; break ;
					case "PANTHER":         base_url = "https://www.ebi.ac.uk/interpro/entry/panther/"    ; break ;
					case "CDD":             base_url = "https://www.ebi.ac.uk/interpro/entry/cdd/"        ; break ;
					case "Gene3D":          base_url = "https://www.ebi.ac.uk/interpro/entry/cathgene3d/" ; break ;
					case "ProSiteProfiles": base_url = "https://www.ebi.ac.uk/interpro/entry/profile/"    ; break ;
					case "SMART":           base_url = "https://www.ebi.ac.uk/interpro/entry/smart/"      ; break ;
					case "SUPERFAMILY":     base_url = "https://www.ebi.ac.uk/interpro/entry/ssf/"        ; break ;
					}
				}
			if(query_str==0){
				let counter  = 0 ;
				let accession ;
				let desc_enc_str ;
				let status ;
				let bg_count ;
				let set_count ;
				let pvalue ;
				let qvalue ;
				let min_exp ;
				let max_exp ;
				let bg_full_count  = $xml_data.find("bg_full_count").text();
				let set_full_count = $xml_data.find("set_full_count").text();
				let over_count     = $xml_data.find("over_count").text();
				let under_count     = $xml_data.find("under_count").text();
				let sum_html_str   = "<div class='list-group'>\n"+
									 "  <div class='list-group-item'>Annotation source: "+ann_source+"</div>\n"+
									 "  <div class='list-group-item'>Full set size: "+bg_full_count+"</div>\n"+
									 "  <div class='list-group-item'>Sub-set size: "+set_full_count+"</div>\n"+
									 "  <div class='list-group-item'>Over-represented domains: "+over_count+"</div>\n"+
									 "  <div class='list-group-item'>Under-represented domains: "+under_count+"</div>\n"+
									 "  <div class='list-group-item'>Tabular results "+
									 "    <span class='badge text-bg-primary rounded-pill' onclick='download_results(\""+job_id+"\",\""+ann_source+"\",\""+run_mode+"\")'>\n"+
									 "      <span class='bi bi-download' title='Click here to download your enrichment results'></span>\n"+
									 "    </span>\n"+
									 "  </div>\n"+
									 "</div>\n";
				let over_html_str  = "<div class='list-group'>\n";
				let under_html_str = "<div class='list-group'>\n";
				$xml_data.find("entry").each(function (){
					counter       += 1 ;
					accession      = $(this).find("accession").text();
					desc_enc_str   = $(this).find("description").text();
					desc_dec_str   = decode_html(desc_enc_str);
					status         = $(this).find("status").text();
					bg_count       = parseInt($(this).find("bg_count").text());
					set_count      = parseInt($(this).find("set_count").text());
					pvalue         = parseFloat($(this).find("pvalue").text()).toFixed(2);
					qvalue         = parseFloat($(this).find("qvalue").text()).toFixed(2);
					min_exp        = parseInt($(this).find("min_exp").text());
					max_exp        = parseInt($(this).find("max_exp").text());
					bg_full_count  = parseInt($(this).find("bg_full_count").text());
					set_full_count = parseInt($(this).find("set_full_count").text());
					link_target    = base_url + accession ;
					if(status=="over"){
						over_html_str += "<div class='list-group-item d-flex justify-content-between align-items-start fs-5'>\n"+
										 "  <div class='ms-2 me-auto'>\n"+
										 "    <div class='fw-bold'><a href='"+link_target+"' target='_blank'>"+accession+" <span class='bi bi-box-arrow-up-right'></span></a></div>"+desc_dec_str+
										 "  </div>\n"+
										 "  <span class='badge text-bg-info      rounded-pill' title='Click here for more info' onclick=\"get_domain_info('"+accession+"','"+ann_source+"','"+run_mode+"')\"><span class='bi bi-search'></span></span>\n"+
										 "  <span class='badge text-bg-dark      rounded-pill' title='Domain count in full set'>"+bg_count+"</span>\n"+
										 "  <span class='badge text-bg-success   rounded-pill' title='Domain count in sub-set'>"+set_count+"</span>\n"+
										 "  <span class='badge text-bg-secondary rounded-pill' title='Minimum expected count'>"+min_exp+"</span>\n"+
										 "  <span class='badge text-bg-primary   rounded-pill' title='Maximum expected count'>"+max_exp+"</span>\n"+
										 "  <span class='badge text-bg-warning   rounded-pill' title='p-value'>"+pvalue+"</span>\n"+
										 "  <span class='badge text-bg-warning   rounded-pill' title='q-value'>"+qvalue+"</span>\n"+
										 "</div>\n";
						}
					else if(status=="under"){
						under_html_str += "<div class='list-group-item d-flex justify-content-between align-items-start fs-5'>\n"+
										  "  <div class='ms-2 me-auto'>\n"+
										  "    <div class='fw-bold'><a href='"+link_target+"' target='_blank'>"+accession+" <span class='bi bi-box-arrow-up-right'></span></a></div>"+desc_dec_str+
										  "  </div>\n"+
										  "  <span class='badge text-bg-info      rounded-pill' title='Click here for more info' onclick=\"get_domain_info('"+accession+"','"+ann_source+"','"+run_mode+"')\"><span class='bi bi-search'></span></span>\n"+
										  "  <span class='badge text-bg-dark      rounded-pill' title='Domain count in full set'>"+bg_count+"</span>\n"+
										  "  <span class='badge text-bg-danger    rounded-pill' title='Domain count in sub-set'>"+set_count+"</span>\n"+
										  "  <span class='badge text-bg-secondary rounded-pill' title='Minimum expected count'>"+min_exp+"</span>\n"+
										  "  <span class='badge text-bg-primary   rounded-pill' title='Maximum expected count'>"+max_exp+"</span>\n"+
										  "  <span class='badge text-bg-warning   rounded-pill' title='p-value'>"+pvalue+"</span>\n"+
										  "  <span class='badge text-bg-warning   rounded-pill' title='q-value'>"+qvalue+"</span>\n"+
										  "</div>\n";
						}
					});
				over_html_str += "</div>\n";
				under_html_str += "</div>\n";
				$("#results_summary").html(sum_html_str);
				$("#over_list").html(over_html_str);
				$("#under_list").html(under_html_str);
				$("#results_accordion").removeClass("d-none");
				toggle_spinner('stop');
				}
			else{
				$("#results_accordion").addClass("d-none");
				toggle_spinner('stop');
				}
			}
		})
	}
function decode_html(html_str) {
	let txt = document.createElement("textarea");
	txt.innerHTML = html_str;
	return txt.value;
	}	
function enable_load_button(job_id){
	if (job_id==""){
		$("#load_button").attr("disabled",true).attr("enabled",false) ;
		$("#load_button").removeClass("btn-primary").addClass("btn-secondary")
		$("#load_button").attr("onclick","")
		}
	else{
		$("#load_button").attr("disabled",false).attr("enabled",true) ;
		$("#load_button").removeClass("btn-secondary").addClass("btn-primary")
		$("#load_button").attr("onclick","get_job()")
		}
	}
function get_job(){
	toggle_spinner("start");
	let job_id = $("#ipr_pre_file_input").val()
	let form_data = new FormData();
	form_data.append("job_id",job_id);
	$.ajax({
		url: "get_job.php",
		cache:       false,
		contentType: false,
		processData: false,
		data:        form_data,
		type:        'post',
		complete: function (get_job){
			let response_xml = get_job.responseText ;
			let xml_data     = $.parseXML(response_xml);
			$xml_data        = $(xml_data);
			let query_str    = $xml_data.find("query_str").text();
			let job_id       = $xml_data.find("job_id").text();
			let alert_arr    = $("#ipr_pre_file_status").attr("class").split(" ")
			let alert_class  = "" ;
			let job_str      = "" ;
			const alert_bg_arr = ["alert-warning","alert-danger","alert-success","alert-secondary"] ;
			for (let alert_bg in alert_bg_arr){
				if (alert_arr.includes(alert_bg)){
					$("#ipr_pre_file_status").removeClass(alert_bg);
					}
				}
			switch(query_str){
				case "0" :
					job_str = "OK" ;
					alert_class = "alert-success" ;
					break ;
				case "1" :
					job_str = query_str ;
					alert_class = "alert-warning" ;
					break ;
				case "2" :
				case "3" :
					job_str =  query_str ; 
					alert_class = "alert-danger" ;
					break ;
				}
			query_str == 0 ? toggle_inputs("enable"): toggle_inputs("disable");
			html_str = "Job status: "+job_str ;
			$("#ipr_pre_file_status").addClass(alert_class);
			$("#ipr_pre_file_status").html(html_str);
			$("#job_id").val(job_id);
			toggle_spinner("stop");
			}
		})
	}
function get_domain_info(accession,ann_source,run_mode){
	toggle_spinner("start");
	$("#info_div").html("");
	let base_url = "";
	if(run_mode == "integrated"){
		base_url = "https://www.ebi.ac.uk/interpro/api/entry/InterPro/";
		}
	else if(run_mode == "normal"){
		switch (ann_source){
			case "Pfam":            base_url = "https://www.ebi.ac.uk/interpro/api/entry/pfam/"       ; break ;
			case "PANTHER":         base_url = "https://www.ebi.ac.uk/interpro/api/entry/panther/"    ; break ;
			case "CDD":             base_url = "https://www.ebi.ac.uk/interpro/api/entry/cdd/"        ; break ;
			case "Gene3D":          base_url = "https://www.ebi.ac.uk/interpro/api/entry/cathgene3d/" ; break ;
			case "ProSiteProfiles": base_url = "https://www.ebi.ac.uk/interpro/api/entry/profile/"    ; break ;
			case "SMART":           base_url = "https://www.ebi.ac.uk/interpro/api/entry/smart/"      ; break ;
			case "SUPERFAMILY":     base_url = "https://www.ebi.ac.uk/interpro/api/entry/ssf/"        ; break ;
			}
		}
	let html_str = "<div class='card h-100 overflow-scroll'>\n"+
	               "  <div class='card-header bg-primary text-white text-bold text-center fs-3'>"+accession+"</div>\n"+
				   "  <div class='card-body overflow-scroll'>\n";
	let api_url = base_url + accession ;
	$.getJSON(api_url).done(function(data){
		$.each(data,function(metadata,metainfo){
			console.log(metadata);
			let desc_obj = metainfo.description;
			let lit_obj  = metainfo.literature;
			if (desc_obj !== null){
				let desc_str = desc_obj[0].text;
				html_str    += "    <div class='h-25 overflow-scroll alert alert-primary fs-4'>"+desc_str+"</div>\n";
				}
			if(lit_obj !== null){
				html_str += "    <div class='overflow-scroll list-group'>\n";
				let lit_keys = Object.keys(lit_obj);
				for (const lit_key of lit_keys){
					let lit_title   = lit_obj[lit_key].title;
					let lit_pmid    = lit_obj[lit_key].PMID;
					let lit_doi_url = lit_obj[lit_key].DOI_URL;
					let lit_pm_url  = "https://pubmed.ncbi.nlm.nih.gov/"+lit_pmid;
					html_str += "      <div class='list-group list-group-item fs-5'>"+
					            "        <div class='ms-2 me-auto'>\n"+
								"          <div class='fw-bold'>"+lit_title+"</div>\n"+
								"        </div>\n"+
								"        <a class='badge text-bg-primary rounded-pill' href='"+lit_pm_url+"'  target='_blank'><span title='PubMed' class='bi bi-book-fill'></span></a>\n"+
								"        <a class='badge text-bg-success rounded-pill' href='"+lit_doi_url+"' target='_blank'><span title='DOI'    class='bi bi-book-fill'></span></a>\n"+
								"      </div>\n";
					}
				html_str += "    </div>\n";
				}
			html_str += "  </div>\n"+
						"</div>";
			});
		$("#info_div").html(html_str);
		toggle_spinner("stop");
		}).fail(function(data){
			let fail_json = JSON.parse(data.responseText);
			let error_str = fail_json.Error;
			html_str += "    <div class='h-25 overflow-scroll alert alert-danger'>"+error_str+"</div></div></div>\n";
			$("#info_div").html(html_str);
			toggle_spinner("stop");
			});
	}
function download_results(job_id,ann_source,run_mode){
	let form_data  = new FormData();
	form_data.append("job_id",job_id);
	form_data.append("ann_source",ann_source);
	form_data.append("run_mode",run_mode);
	let target_url = "download_results.php"  ;
	$.ajax({
		url: target_url,
		dataType:    'script',
		cache:       false,
		contentType: false,
		processData: false,
		data:        form_data,
		type:        'post',
		complete: function (download_results){
			let response_xml = download_results.responseText ;
			let xml_data  = $.parseXML(response_xml);
			$xml_data     = $(xml_data);
			let query_str = $xml_data.find("query_str").text();
			if (query_str == 0){
				let server_file_name = $xml_data.find("file_name").text();
				let client_file_name = job_id+"."+run_mode+"."+ann_source+".tsv";
				let dialog_html_str  = "<p>Your tsv file has been downloaded as \""+client_file_name+"\"</p>\n";
				let element = document.createElement('a');
				element.setAttribute("href",server_file_name);
				element.setAttribute("download",client_file_name);
				element.style.display  = 'none';
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
				toggle_spinner('stop');
				$("#download_dialog_message").html(dialog_html_str);
				$("#download_dialog").modal('show') ;
				setTimeout(function(){
					$("#download_dialog").modal("hide");
					$("#download_dialog_message").html("");
					},2500);
				}
			}
		});
	}
function reset(){
	toggle_spinner("start");
	clear_inputs();
	toggle_inputs("disable");
	let file_status_class_arr = $("#ipr_file_status").attr("class").split(" ")
	for (let class_item in file_status_class_arr){
		$("#ipr_file_status").removeClass(class_item);
		}
	enable_load_button("");
	$("#ipr_file_status").html("");
	$("#results_summary").html("");
	$("#over_list").html("");
	$("#under_list").html("");
	$("#results_accordion").addClass("d-none");
	$("#status_dialog_message").html("");
	$("#info_div").html("");
	toggle_spinner("stop");
	}