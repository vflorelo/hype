#!/bin/bash
function usage(){
    echo "clean_iprscan.sh takes a tsv file produced by InterProScan and returns a clean version to be processed with HyPE"
    echo
    echo "Options:"
    echo "  --tsv_file -> TSV file with InterProScan results"
    echo "  --out_file -> TSV file stripped down to be analysed with HyPE"
    echo "  --compress -> Compresses the output file [TRUE]/FALSE"
    echo
    echo "Example:"
    echo "  clean_iprscan.sh --tsv_file /path/to/my/interproscan/results.tsv --out_file /path/to/my/interproscan/clean_results.tsv --compress TRUE"
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
        --out_file )
            shift
            out_file=$1
            ;;
        --compress )
            shift
            compress=$1
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

if [ -z "${out_file}" ]
then
    echo "Missing output file name. Exiting"
    exit 1
fi

if [ "${compress}" != "TRUE" ] && [ "${compress}" != "true" ] && [ "${compress}" != "FALSE" ] && [ "${compress}" != "false" ]
then
    echo "Invalid --compress value. Exiting"
    exit 1
fi

datablock=$(awk 'BEGIN{FS="\t";OFS="\t";dot="."}{print $1,dot,dot,$4,$5,$6,dot,dot,dot,dot,dot,$12,$13}' ${tsv_file} | sort -V | uniq)

if [ "${compress}" == "TRUE" ] || [ "${compress}" == "TRUE" ]
then
    gz_test=$(echo "${out_file}" | grep -c gz$)
    if [ "${gz_test}" -eq 0 ]
    then
        out_file=$(echo "${out_file}.gz")
    fi
    echo "${datablock}" | gzip --best --stdout > ${out_file}
else
    echo "${datablock}" > ${out_file}
fi