# BioThings Explorer

## Introduction

This is the development repo for the web service of BioThings Explorer. This tool aims at helping users querying and linking results from a variety of biomedical relevant APIs through one interface. The project is funded by the NCATS Translator project.

### Revelant Concepts

1. BioLink Model

   [The BioLink Model](https://biolink.github.io/biolink-model/) defines a high level datamodel of biological entities (genes, diseases, phenotypes, pathways, individuals, substances, etc) and their associations. BioThings Explorer restructures outputs from different APIs into the data model defined by BioLink, so that they can be easily connected and queried.

2. SmartAPI

   [SmartAPI](https://smart-api.info) aims to maximize the FAIRness (Findability, Accessibility, Interoperability, and Reusability) of web-based Application Programming Interfaces (APIs). Rich metadata is essential to properly describe your API so that it becomes discoverable, connected, and reusable. BioThings Explorer takes advantage of the rich metadata information described in SmartAPI and create a meta knowledge graph, allowing BioThings Explorer to autonomously query a distributed knowledge graph. The distributed knowledge graph is made up of biomedical APIs that have been annotated with semantically-precise descriptions of their inputs and outputs.

### Current Integrated APIs

   - [MyGene.info API](https://mygene.info)
   - [MyVariant.info API](https://myvariant.info)
   - [MyChem.info API](https://mychem.info)
   - [MyDisease.info API](http://mydisease.info)
   - [Semmed API](https://pending.biothings.io/semmed)
   - [BioLink API](https://api.monarchinitiative.org/api)
   - [DGIdb API](http://dgidb.org/api)
   - [CORD Gene API](https://biothings.ncats.io/cord_gene)
   - [CORD Protein API](https://biothings.ncats.io/cord_protein)
   - [CORD Chemical API](https://biothings.ncats.io/cord_chemical)
   - [CORD Cell API](https://biothings.ncats.io/cord_cell)
   - [CORD Disease API](https://biothings.ncats.io/cord_disease)
   - [CORD Molecular Activity API](https://biothings.ncats.io/cord_ma)
   - [CORD Biological Process API](https://biothings.ncats.io/cord_bp)
   - [CORD Genomic Entity API](https://biothings.ncats.io/cord_genomic_entity)
   - [CORD Anatomy API](https://biothings.ncats.io/cord_anatomy)
   - [CORD Cellular Component API](https://biothings.ncats.io/cord_cc)
   - [EBIgene2phenotype API](https://biothings.ncats.io/ebigene2phenotype)
   - [DISEASES API](https://biothings.ncats.io/DISEASES)
   - [PFOCR API](https://biothings.ncats.io/pfocr)
   - [QuickGO API](https://www.ebi.ac.uk/QuickGO)
   - [LitVar API](https://www.ncbi.nlm.nih.gov/CBBresearch/Lu/Demo/LitVar/#!?query=)
   - [Ontology Lookup Service API](https://www.ebi.ac.uk/ols)
   - [Stanford Biosample API](http://api.kp.metadatacenter.org/)
   - [ChEMBL API](https://www.ebi.ac.uk/chembl)
   - [CTD API](http://ctdbase.org)
   - [OpenTarget API](https://platform-api.opentargets.io)
   - [RGD API](https://rest.rgd.mcw.edu)
   - [Automat CORD19 Scibite API](https://automat.renci.org)


### How to use the BioThings Explorer


Jupyter notebook demo is located at [this folder](https://github.com/kevinxin90/bte_schema/tree/master/jupyter%20notebooks).

Some real world use cases of BioThings Explorer.

   - [Why does imatinib have an effect on the treatment of chronic myelogenous leukemia (CML)?](https://colab.research.google.com/github/biothings/biothings_explorer/blob/master/jupyter%20notebooks/EXPLAIN_demo.ipynb)
   - [What drugs might be used to treat hyperphenylalaninemia?](https://colab.research.google.com/github/biothings/biothings_explorer/blob/master/jupyter%20notebooks/PREDICT_demo.ipynb)
   - [Finding New Uses for Existing Drugs to Treat Parkinson’s Disease](https://colab.research.google.com/github/biothings/biothings_explorer/blob/master/jupyter%20notebooks/TIDBIT%2002%20Finding%20New%20Uses%20for%20Existing%20Drugs%20to%20Treat%20Parkinson%E2%80%99s%20Disease.ipynb)
   - [Finding Marketed Drugs that Might Treat an Unknown Syndrome by Perturbing the Disease Mechanism Pathway](https://colab.research.google.com/github/biothings/biothings_explorer/blob/master/jupyter%20notebooks/TIDBIT%2004%20Finding%20Marketed%20Drugs%20that%20Might%20Treat%20an%20Unknown%20Syndrome%20by%20Perturbing%20the%20Disease%20Mechanism%20Pathway.ipynb)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:8855](http://localhost:8855) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
