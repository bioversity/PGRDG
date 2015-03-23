![](common/media/img/chart.png)

The system is composed of a series of layers that originate from the actual data and end with the user interface. Each layer is independent and provides specific functionality, filtering and transforming the data which flows through it.

<h3><span class="fa fa-square" style="color: #ff6666;"></span> Data</h3>
The data layer contains both the metadata and the actual data, at its core there are two database engines, MongoDB and Neo4j, which are respectively a document database and a graph database. The document database is responsible of storing the bulk of the data, while the graph database is responsible of tracking relationships between data units.

<h3><span class="fa fa-square" style="color: #D8B05C;"></span> Ontology Wrapper</h3>
The main responsibility of this layer is to manage the metadata and ensure that each data element is linked to a concept in the ontology which thoroughly documents the nature and use of that data element. The data and metadata are divided into five components:

* **Terms**: a term is a concept unrelated to a specific context, it can be seen as the vocabulary of the ontology.</p>
* **Tags**: a tag is constituted by a path or sequence of terms which represent the metadata associated to a specific data type and field. All data elements must refer to a tag in order to be stored in the database.
* **Nodes**: nodes are the vertices of the ontology graph, they reference either a term, in which case they instantiate the term in a specific context, or a tag, in which case they represent an element of a data structure, data template, search form or view.
* **Edges**: an edge connects two nodes via a predicate, it is the building block of the ontology which is implemented as a directed graph structure.
* **Units**: this represents a collection of data structures in which all the data units are stored. It handles indiscriminately all the types of data (except the above metadata) records in a single container in order to allow searches across domains.

<h3><span class="fa fa-square" style="color: #49D149;"></span> Service</h3>
This layer implements a set of REST web services which allow access to the data and metadata through the ontology wrapper. All communication with the data and ontology layers is done via these web services, allowing a modular and distributed approach.

<h3><span class="fa fa-square" style="color: #60ABC9;"></span> Dynamic data contents</h3>
This layer allows access to the data stored in the database via search forms, data tables and graphs.

<h3><span class="fa fa-square" style="color: #787878;"></span> Static contents</h3>
This layer represents the static content user interface, it consists of all the web pages not directly related to the data stored in the database.

<h3><span class="fa fa-square" style="color: #aaaaaa;"></span> Frontend GUI</h3>
This layer aggregates all the functionality and elements provided by the static and dynamic contents layers, representing the web portal as a coherent system.

<h3><span class="fa fa-square-o" style="color: #666;"></span> Backed GUI</h3>
This layer represents the user interface to the management of the backend modules, it is divided into three sections:

<div style="padding-left: 2em;">
<h4><span class="fa fa-square" style="color: #74B9B9;"></span> Site administrators</h4>
This section allows the management of the web site sections and settings, along with the management of the data dictionary and ontology content.

<h4><span class="fa fa-square" style="color: #A9BD7C;"></span> Data upload</h4>
This section allows data providers to upload data to the system.

<h4><span class="fa fa-square" style="color: #C293C9;"></span> Static content editings</h4>
This section allows the update of static web pages, that is, pages that do not display dynamic data.

</div>

<h3><span class="fa fa-square" style="color: #FFA555;"></span> Login area</h3>
This layer manages access to the site, providing specific permissions depending on the role of the user.
