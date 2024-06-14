#!/usr/bin/python3
import argparse
parser = argparse.ArgumentParser(
    prog="get_domain_enrichment.py",
    description="A simple program to calculate over or under representation of functional domains",
    epilog="""LICENSE:
    Distributed under the GNU General Public License (GPLv3). See License.md
    https://github.com/vflorelo/enrichment_tools
    """)
parser.add_argument('-f',
                    '--full_gene_list',
                    #type=argparse.FileType('r'),
#                    required=True,
                    help='A plain text file containing all the accession numbers in your genome/proteome')
parser.add_argument('-s',
                    '--sub_gene_list',
                    #type=argparse.FileType('r'),
                    #required=True,
                    help='A plain text file containing a subset of genes/proteins to be tested')
parser.add_argument('-t',
                    '--tsv_file',
                    #type=argparse.FileType('r'),
                    #required=True,
                    help='A tsv file with genome-/proteome-wide InterProScan results')
parser.add_argument('-o',
                    '--out_file',
                    #type=argparse.FileType('w'),
                    #required=True,
                    help='The name of your output file')
parser.add_argument('-a',
                    '--ann_source',
                    #type=ascii,
                    #required=True,
                    help='The name of the annotation source, not compatible with --run_mode',
                    choices=["CDD","Gene3D","PANTHER","Pfam","ProSiteProfiles","SMART","SUPERFAMILY"])
parser.add_argument('-m',
                    '--run_mode',
                    #type=ascii,
                    #required=True,
                    help='Set this option to "integrated" if you want to perform enrichment of integrated interpro signatures or to "normal" if you want to analyse individual annotation sources, not compatible with --ann_source',
                    choices=["normal","integrated"])
parser.add_argument('-p',
                    '--p_value',
                    #type=float,
                    #default=0.05,
                    help='Adjust the p-value cutoff for significantly under-/over-represented domains')

args = parser.parse_args()
print (args.full_gene_list)