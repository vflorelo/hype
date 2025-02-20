#!/usr/bin/python3
import argparse
import pandas  as pd
import numpy   as np
from   decimal                     import Decimal
from   scipy.stats                 import hypergeom
from   statsmodels.stats.multitest import fdrcorrection

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
parser.add_argument('-q',
                    '--q_value',
                    type=float,
                    default=0.05,
                    help='Adjust the q-value cutoff for significantly under-/over-represented domains')
parser.add_argument('-p',
                    '--p_value',
                    type=float,
                    default=0.05,
                    help='Adjust the p-value cutoff for significantly under-/over-represented domains')
parser.add_argument('-c',
                    '--crit',
                    type=str,
                    required=True,
                    help='Whether to use p-value or q-value as filtering criteria',
                    choices=['q-value','p-value'])
args          = parser.parse_args()
tsv_file      = args.tsv_file
full_gene_len = args.full_gene_len
sub_gene_list = args.sub_gene_list
out_file      = args.out_file
ann_source    = args.ann_source
run_mode      = args.run_mode
q_value       = args.q_value
p_value       = args.p_value
web_log       = args.web_log
crit          = args.crit
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
    domain_df  = domain_df[["accession","ipr_accession","ipr_description"]]
    domain_df  = domain_df.drop_duplicates()
    desc_df    = domain_df.copy()
    desc_df    = desc_df[["ipr_accession","ipr_description"]]
    desc_df    = desc_df.drop_duplicates()
    domain_col = "ipr_accession"
    desc_col   = "ipr_description"
elif (run_mode == "normal"):
    domain_df  = ipr_full_df.copy()
    domain_df  = domain_df[domain_df["ann_source"] == ann_source]
    domain_df  = domain_df[["accession","ann_accession","ann_description"]]
    domain_df  = domain_df.drop_duplicates()
    desc_df    = domain_df.copy()
    desc_df    = desc_df[["ann_accession","ann_description"]]
    desc_df    = desc_df.drop_duplicates()
    domain_col = "ann_accession"
    desc_col   = "ann_description"
domain_df   = domain_df.rename(columns={"accession": "accession", domain_col: "domain"})
unfold_df   = pd.get_dummies(domain_df,columns=["domain"],dtype=int)
unfold_df   = unfold_df.drop_duplicates()
domain_list = list(unfold_df.columns)
domain_list.remove("accession")
domain_list.remove(desc_col)
out_list    = []
for domain in domain_list:
    domain_str = domain.replace("domain_","")
    domain_desc  = desc_df[desc_df[domain_col]==domain_str][desc_col].values.flatten().tolist()[0]
    sub_pos_len  = len(unfold_df[(unfold_df[domain] == 1) & (unfold_df["accession"].isin(sub_gene_list)) ]["accession"].values.flatten().tolist())
    if( full_gene_len == None):
        full_pos_len = len(domain_df[(unfold_df[domain] == 1) & (unfold_df["accession"].isin(full_gene_list))]["accession"].values.flatten().tolist())
    else:
        full_pos_len = len(domain_df[unfold_df[domain] == 1]["accession"].values.flatten().tolist())
    sub_hyperg   = hypergeom(full_gene_len, full_pos_len, sub_gene_len)
    sub_prob     = sub_hyperg.pmf(sub_pos_len)
    sub_tmp_intv = sub_hyperg.interval(0.95)
    
    sub_intv     = [sub_tmp_intv[0].item(),sub_tmp_intv[1].item()]
    if   ((sub_pos_len > sub_intv[0]) and (sub_pos_len < sub_intv[1])):
        status = "within"
    elif (sub_pos_len >= sub_intv[1]):
        status = "over"
    elif (sub_pos_len <= sub_intv[0]):
        status = "under"
    sub_data = [domain,status,full_pos_len,sub_pos_len,sub_prob,sub_intv,full_gene_len,sub_gene_len,domain_desc]
    out_list.append(sub_data)
out_df = pd.DataFrame(out_list, columns = ["domain","status","total_domain_count","subset_domain_count","p-val","ci95","total_genes","sub_genes","domain_desc"])
pvals = out_df["p-val"].values.flatten().tolist()
qvals = list(fdrcorrection(pvals, alpha=0.05, method='indep', is_sorted=False)[1])
out_df['q-val'] = qvals
filt_df = out_df.copy()
if (crit == "q-value"):
    filt_df = filt_df[(filt_df["status"]!="within") & (filt_df["q-val"]<=q_value)]
elif (crit == "p-value"):
    filt_df = filt_df[(filt_df["status"]!="within") & (filt_df["p-val"]<=p_value)]
filt_df = filt_df.sort_values(by=['q-val'])
filt_df["domain"] = filt_df["domain"].str.replace("domain_","")
filt_df["p-val"] = filt_df["p-val"].apply(lambda x: '%.3E' % Decimal(x))
filt_df["q-val"] = filt_df["q-val"].apply(lambda x: '%.3E' % Decimal(x))
columns = ["domain","status","total_domain_count","subset_domain_count","p-val","q-val","ci95","total_genes","sub_genes","domain_desc"]
filt_df[columns].to_csv(out_file,sep="\t",index=None)
if( web_log != None):
    f = open(web_log, "w")
    status_str = "finished"
    f.write(status_str)
    f.close()