<p><img class="img-responsive" src="common/media/img/chart.png"></p>
<p>The system is composed of a series of layers that originate from the actual data and end with the user interface. Each layer is independent and provides specific functionality, filtering and transforming the data which flows through it.</p>
<br />

<h3><span class="fa fa-square" style="color: #ff6666;"></span> Data</h3>
<p>The data layer contains both the metadata and the actual data, at its core there are two database engines, MongoDB and Neo4j, which are respectively a document database and a graph database. The document database is responsible of storing the bulk of the data, while the graph database is responsible of tracking relationships between data units.</p>
<br />
<h3><span class="fa fa-square" style="color: #D8B05C;"></span> Ontology Wrapper</h3>
<p>The main responsibility of this layer is to manage the metadata and ensure that each data element is linked to a concept in the ontology which thoroughly documents the nature and use of that data element. The data and metadata are divided into five components:</p>
<ul>
        <li><b>Terms</b>: a term is a concept unrelated to a specific context, it can be seen as the vocabulary of the ontology.</p>
        <li><b>Tags</b>: a tag is constituted by a path or sequence of terms which represent the metadata associated to a specific data type and field. All data elements must refer to a tag in order to be stored in the database.</li>
        <li><b>Nodes</b>: nodes are the vertices of the ontology graph, they reference either a term, in which case they instantiate the term in a specific context, or a tag, in which case they represent an element of a data structure, data template, search form or view.</li>
        <li><b>Edges</b>: an edge connects two nodes via a predicate, it is the building block of the ontology which is implemented as a directed graph structure.</li>
        <li><b>Units</b>: this represents a collection of data structures in which all the data units are stored. It handles indiscriminately all the types of data (except the above metadata) records in a single container in order to allow searches across domains.</li>
</ul>
<br />

<h3><span class="fa fa-square" style="color: #49D149;"></span> Service</h3>
<p>This layer implements a set of REST web services which allow access to the data and metadata through the ontology wrapper. All communication with the data and ontology layers is done via these web services, allowing a modular and distributed approach.</p>
<br />

<h3><span class="fa fa-square" style="color: #60ABC9;"></span> Dynamic data contents</h3>
<p>This layer allows access to the data stored in the database via search forms, data tables and graphs.</p>
<br />

<h3><span class="fa fa-square" style="color: #787878;"></span> Static contents</h3>
<p>This layer represents the static content user interface, it consists of all the web pages not directly related to the data stored in the database.</p>
<br />

<h3><span class="fa fa-square" style="color: #aaaaaa;"></span> Frontend GUI</h3>
<p>This layer aggregates all the functionality and elements provided by the static and dynamic contents layers, representing the web portal as a coherent system.</p>
<br />

<h3><span class="fa fa-square-o" style="color: #666;"></span> Backed GUI</h3>
<p>This layer represents the user interface to the management of the backend modules, it is divided into three sections:</p>

<div style="padding-left: 2em;">
        <h4><span class="fa fa-square" style="color: #74B9B9;"></span> Site administrators</h4>
        <p>This section allows the management of the web site sections and settings, along with the management of the data dictionary and ontology content.</p>

        <h4><span class="fa fa-square" style="color: #A9BD7C;"></span> Data upload</h4>
        <p>This section allows data providers to upload data to the system.</p>

        <h4><span class="fa fa-square" style="color: #C293C9;"></span> Static content editings</h4>
        <p>This section allows the update of static web pages, that is, pages that do not display dynamic data.</p>
</div>
<br />

<h3><span class="fa fa-square" style="color: #FFA555;"></span> Login area</h3>
<p>This layer manages access to the site, providing specific permissions depending on the role of the user.</p>
