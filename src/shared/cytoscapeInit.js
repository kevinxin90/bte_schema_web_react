import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import popper from 'cytoscape-popper';

cytoscape.use(popper);
cytoscape.use(edgehandles);

export default cytoscape;