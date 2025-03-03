# HyPE
Hypergeometric Protein domain Enrichment

Functional interpretation in the genomic era usually employs gene function prediction, gene ontology and pathway enrichment. For model organisms this is straightforward since annotations are readily available and gene ontologies have been curated extensively.

Non-model organisms do not have the same luck, due to the lack of sequence similarity, presence of alternative and novel pathways, as well as repurposing of existing pathways, gene ontologies might not accurately reflect the functions encoded in the proteins of non-model organisms.

Protein domains on the other hand, provide a robust, albeit more granular, framework for exploring gene functions.

There are readily available tools for gene enrichment analysis based on gene ontologies, however, the same is not true for protein domains.

Here we present HyPE (Hypergeometric Protein-domain Enrichment), a simple tool for performing genome-wide analysis of enrichment (or purification) of domains using the output of interproscan.

HyPE can be used directly from the command line as a python program, but it can also be accessed through our webserver ([www.atglabs.org/hype](https://www.atglabs.org/hype))

The use of protein domains offers some advantages over the use of gene ontologies, to name a few:

- Protein domains are easier to detect using standard tools like [InterProScan](https://www.ebi.ac.uk/interpro/), [Panther score](https://pantherdb.org/) and [PANNZER2](http://ekhidna2.biocenter.helsinki.fi/sanspanz/) 
- Protein domains do not depend on hierarchical classification schemes
- Protein domains are model- and taxonomy-agnostic

For any given protein domain that is found in the proteome, genome or transcriptome of an organism, HyPE calculates a 95% confidence interval based on a hypergeometric distribution, it then compares the number of times the protein domain was found in the background set (the whole proteome) and how many times the domain was found in the testing set (e.g. a list of differentially expressed genes). HyPE then calculates the adjusted p-value (q-value) of a protein domain being under- or over-represented (i.e. it was detected fewer, or more times than what is expected by chance given the 95% CI).

With HyPE, it is possible to detect statistically significant protein domains that might reflect the biological significance of a gene being differentially expressed, without relying on gene ontologies (or their lack thereof).

As of now, HyPE works with files produced by InterProScan, future releases of HyPE will include modules for processing annotations from other sources