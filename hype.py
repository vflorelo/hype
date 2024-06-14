#!/usr/bin/python3
import argparse
import pandas  as pd
from   scipy.stats import hypergeom
parser = argparse.ArgumentParser(prog="hype.py",
                                 description="A simple program to calculate over or under representation of functional domains",
                                 epilog="""LICENSE:
                                 Distributed under the GNU General Public License (GPLv3). See License.md
                                 https://github.com/vflorelo/enrichment_tools""")
parser.add_argument('-f',
                    '--full_gene_list',
                    type=argparse.FileType('r'),
                    required=False,
                    help='A plain text file containing all the accession numbers in your genome/proteome')
parser.add_argument('-w',
                    '--web_log',
                    type=str,
                    required=False,
                    help='A handle for printing status message for the web app')
parser.add_argument('-l',
                    '--full_gene_len',
                    type=int,
                    required=False,
                    help='The total number of elements in your genome/proteome')
parser.add_argument('-s',
                    '--sub_gene_list',
                    type=argparse.FileType('r'),
                    required=True,
                    help='A plain text file containing a subset of genes/proteins to be tested')
parser.add_argument('-t',
                    '--tsv_file',
                    type=argparse.FileType('r'),
                    required=True,
                    help='A tsv file with genome-/proteome-wide InterProScan results')
parser.add_argument('-o',
                    '--out_file',
                    type=argparse.FileType('w'),
                    required=True,
                    help='The name of your output file')
parser.add_argument('-a',
                    '--ann_source',
                    type=str,
                    required=True,
                    help='The name of the annotation source, not compatible with --run_mode',
                    choices=['CDD','Gene3D','PANTHER','Pfam','ProSiteProfiles','SMART','SUPERFAMILY'])
parser.add_argument('-m',
                    '--run_mode',
                    type=str,
                    required=True,
                    help='Set this option to "integrated" if you want to perform enrichment of integrated interpro signatures or to "normal" if you want to analyse individual annotation sources, not compatible with --ann_source',
                    choices=["normal","integrated"])
parser.add_argument('-p',
                    '--p_value',
                    type=float,
                    default=0.05,
                    help='Adjust the p-value cutoff for significantly under-/over-represented domains')
args           = parser.parse_args()
tsv_file       = args.tsv_file
full_gene_len  = args.full_gene_len
sub_gene_list  = args.sub_gene_list
out_file       = args.out_file
ann_source     = args.ann_source
run_mode       = args.run_mode
p_value        = args.p_value
web_log        = args.web_log

if( web_log != None):
    f = open(web_log, "w")
    status_str = "running"
    f.write(status_str)
    f.close()
ipr_full_df = pd.read_csv(tsv_file,
                          sep="\t",
                          header=None,
                          usecols=range(13),
                          names=["accession","md5","seq_length","ann_source","ann_accession","ann_description","start","end","e-value","ann_status","ann_date","ipr_accession","ipr_description"])
sub_gene_fh    = sub_gene_list
sub_gene_data  = sub_gene_fh.read()
sub_gene_list  = sub_gene_data.split("\n")
sub_gene_fh.close()
if( full_gene_len == None):
    full_gene_list = args.full_gene_list
    full_gene_fh   = full_gene_list
    full_gene_data = full_gene_fh.read()
    full_gene_list = full_gene_data.split("\n")
    full_gene_fh.close()
    full_gene_len  = len(full_gene_list)
sub_gene_len   = len(sub_gene_list)
if (  run_mode == "integrated"):
    ann_sources = ['CDD','Gene3D','PANTHER','Pfam','ProSiteProfiles','SMART','SUPERFAMILY']
    domain_df  = ipr_full_df.copy()
    domain_df  = domain_df[(domain_df["ipr_accession"] != "-") & (domain_df["ann_source"].isin(ann_sources))]
    domain_df  = domain_df[["accession","ipr_accession"]]
    domain_df  = domain_df.drop_duplicates()
    domain_col = "ipr_accession"
elif (run_mode == "normal"):
    domain_df  = ipr_full_df.copy()
    domain_df  = domain_df[domain_df["ann_source"] == ann_source]
    domain_df  = domain_df[["accession","ann_accession"]]
    domain_df  = domain_df.drop_duplicates()
    domain_col = "ann_accession"
domain_df   = domain_df.rename(columns={"accession": "accession", domain_col: "domain"})
unfold_df   = pd.get_dummies(domain_df,columns=["domain"],dtype=int)
unfold_df   = unfold_df.drop_duplicates()
domain_list = list(unfold_df.columns)
domain_list.remove("accession")
out_list    = []
for domain in domain_list:
    sub_pos_len  = len(unfold_df[(unfold_df[domain] == 1) & (unfold_df["accession"].isin(sub_gene_list)) ]["accession"].values.flatten().tolist())
    if( full_gene_len == None):
        full_pos_len = len(domain_df[(unfold_df[domain] == 1) & (unfold_df["accession"].isin(full_gene_list))]["accession"].values.flatten().tolist())
    else:
        full_pos_len = len(domain_df[unfold_df[domain] == 1]["accession"].values.flatten().tolist())
    sub_hyperg   = hypergeom(full_gene_len, full_pos_len, sub_gene_len)
    sub_prob     = sub_hyperg.pmf(sub_pos_len)
    sub_intv     = list(sub_hyperg.interval(0.95))
    if   ((sub_prob <= p_value ) and (sub_pos_len >= sub_intv[1])):
        status = "over"
        sub_data = [domain,status,full_pos_len,sub_pos_len,sub_prob,sub_intv,full_gene_len,sub_gene_len]
        out_list.append(sub_data)
    elif ((sub_prob <= p_value ) and (sub_pos_len <= sub_intv[0])):
        status = "under"
        sub_data = [domain,status,full_pos_len,sub_pos_len,sub_prob,sub_intv,full_gene_len,sub_gene_len]
        out_list.append(sub_data)
out_df = pd.DataFrame(out_list, columns = ["domain","status","total_domain_count","subset_domain_count","p-val","ci95","total_genes","sub_genes"])
out_df = out_df.sort_values(by=['p-val'])
out_df["domain"] = out_df["domain"].str.replace("domain_","")
out_df.to_csv(out_file,sep="\t",index=None)
if( web_log != None):
    f = open(web_log, "w")
    status_str = "finished"
    f.write(status_str)
    f.close()