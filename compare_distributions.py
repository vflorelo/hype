#!/usr/bin/python3
import sys
import pandas  as pd
import numpy   as np
from   scipy import stats
tg_list   = sys.argv[1]
full_list = sys.argv[2]
tsv_file  = sys.argv[3]
df        = pd.read_csv(tsv_file,sep="\t")
col_list  = list(df.columns)
col_list.remove("accession")
tg_fh     = open(tg_list, "r")
tg_data   = tg_fh.read()
tg_list   = tg_data.split("\n")
tg_fh.close()
full_fh     = open(full_list, "r")
full_data   = full_fh.read()
full_list   = full_data.split("\n")
full_fh.close()
bg_list     = list(set(full_list) - set(tg_list))
for col_name in col_list:
    tg_vals  = np.array(df[df["accession"].isin(tg_list)][col_name].dropna().values.flatten().tolist())
    #tg_vals  = tg_vals[tg_vals != 0]
    bg_vals  = np.array(df[df["accession"].isin(bg_list)][col_name].dropna().values.flatten().tolist())
    #bg_vals  = bg_vals[bg_vals != 0]
    tg_len   = tg_vals.size
    bg_len   = bg_vals.size
    tg_qvals = [np.percentile(tg_vals,25),np.percentile(tg_vals,50),np.percentile(tg_vals,75)]
    bg_qvals = [np.percentile(bg_vals,25),np.percentile(bg_vals,50),np.percentile(bg_vals,75)]
    ks_test  = stats.ks_2samp(tg_vals,bg_vals,method="exact",nan_policy="omit")
    ks_pval  = ks_test.pvalue
    ad_test  = stats.anderson_ksamp([tg_vals,bg_vals])
    ad_pval  = ad_test.pvalue
    print("Background distribution (n="+str(bg_len)+"):" )
    print("\t"+str(bg_qvals))
    print("Testing distribution (n="+str(tg_len)+"):" )
    print("\t"+str(tg_qvals))
    print("Kolmogorov Smirnov:")
    print("\tp-value: " + str(ks_pval))
    print("Anderson Darling:")
    print("\tp-value: " + str(ad_pval))