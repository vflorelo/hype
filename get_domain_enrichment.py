#!/usr/bin/python3
import sys
import pandas  as pd
from   scipy.stats import hypergeom
target_list = sys.argv[1]
full_list   = sys.argv[2]
tsv_file    = sys.argv[3]
out_file    = sys.argv[4]
df          = pd.read_csv(tsv_file,sep="\t")
target_fh   = open(target_list, "r")
target_data = target_fh.read()
target_list = target_data.split("\n")
target_fh.close()
full_fh     = open(full_list, "r")
full_data   = full_fh.read()
full_list   = full_data.split("\n")
full_fh.close()
out_list    = []
domain_df   = pd.get_dummies(df,columns=["domain"],dtype=int)
domain_df   = domain_df.drop_duplicates(subset=["accession"])
domain_list = list(domain_df.columns)
domain_list.remove("accession")
for domain in domain_list:
    target_pos_len = len(domain_df[(domain_df[domain] == 1) & (domain_df["accession"].isin(target_list))]["accession"].values.flatten().tolist())
    target_len     = len(target_list)
    full_pos_len   = len(domain_df[(domain_df[domain] == 1) & (domain_df["accession"].isin(full_list))  ]["accession"].values.flatten().tolist())
    full_len       = len(full_list)
    target_hyperg  = hypergeom(full_len, full_pos_len, target_len)
    target_prob    = target_hyperg.pmf(target_pos_len)
    target_intv    = list(target_hyperg.interval(0.95))
    if   ((target_prob <= 0.05) and (target_pos_len >= target_intv[1])):
        status = "over"
        target_data = [domain,status,full_pos_len,target_pos_len,target_prob,target_intv]
        out_list.append(target_data)
    elif ((target_prob <= 0.05) and (target_pos_len <= target_intv[0])):
        status = "under"
        target_data = [domain,status,full_pos_len,target_pos_len,target_prob,target_intv]
        out_list.append(target_data)
out_df = pd.DataFrame(out_list, columns = ["domain","status","total_domain_count","subset_domain_count","p-val","ci95"])
out_df.to_csv(out_file,sep="\t",index=None)