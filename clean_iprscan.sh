#!/bin/bash
function usage(){
    echo "clean_iprscan.sh takes a tsv file produced by InterProScan and returns a clean version to be processed with HyPE"
    echo
    echo "Options:"
    echo "  --tsv_file -> TSV file with InterProScan results"
    echo "  --e_value  -> E-value threshold for keeping significant domains"
    echo "  --out_file -> TSV file stripped down to be analysed with HyPE"
    echo
    echo "Example:"
    echo "  clean_iprscan.sh --tsv_file /path/to/my/interproscan/results.tsv --out_file /path/to/my/interproscan/clean_results.tsv --e_value 1e-6"
    echo
	}
export -f usage
while [ "$1" != "" ]
do
    case $1 in
        --tsv_file )
            shift
            tsv_file=$(realpath $1)
            ;;
        --e_value  )
            shift
            e_value=$1
            ;;
        --out_file )
            shift
            out_file=$1
            ;;
		--help     )
            usage
            exit 0
            ;;
	esac
	shift
done
if [ ! -f "${tsv_file}" ] || [ -z "${tsv_file}" ]
then
    echo "Missing input file name. Exiting"
    exit 1
fi
if [ -z "${e_value}" ]
then
    echo "Missing e-value cutoff. Exiting"
    exit 1
fi
if [ -z "${out_file}" ]
then
    echo "Missing output file name. Exiting"
    exit 1
fi
datablock=$(awk -v e_value="${e_value}" 'BEGIN{FS="\t";OFS="\t";dot="."}{if($9<=e_value){print $1,dot,dot,$4,$5,$6,dot,dot,dot,dot,dot,$12,$13}}' ${tsv_file} | sort -V | uniq)
echo "${datablock}" > ${out_file}