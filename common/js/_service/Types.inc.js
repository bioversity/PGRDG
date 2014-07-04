/*=======================================================================================
 *																						*
 *									Types.inc.php										*
 *																						*
 *======================================================================================*/
 
/**
 * Type definitions.
 *
 * This file contains the default type and kind definitions.
 *
 * Each entry is a term object native identifier.
 *
 *	@author		Milko A. Škofič <m.skofic@cgiar.org>
 *	@version	1.00 25/11/2012
 */

/*=======================================================================================
 *	PRIMITIVE DATA TYPES																*
 *======================================================================================*/

/**
 * Mixed.
 *
 * A <i>mixed</i> data type indicates that the referred property may take any data type.
 */
var kTYPE_MIXED = ':type:mixed';

/**
 * String.
 *
 * A <i>string</i> data type indicates that the referred property may hold <i>UNICODE</i>
 * characters, this type <i>does not include binary data</i>
 */
var kTYPE_STRING = ':type:string';

/**
 * Integer.
 *
 * An <i>integer</i> data type indicates that the referred property may hold a <i>32 or 64
 * bit integral numeric value</i>
 */
var kTYPE_INT = ':type:int';

/**
 * Float.
 *
 * A <i>float</i> data type indicates that the referred property may hold a <i>floating
 * point number</i>, also known as <i>double</i> or <i>real</i>. The precision of such value
 * is not inferred, in general it will be a <i>32 or 64 bit real</i>
 */
var kTYPE_FLOAT = ':type:float';

/*=======================================================================================
 *	STRUCTURED DATA TYPES																*
 *======================================================================================*/

/**
 * Struct.
 *
 * This data type defines a <em>structure</em>, this means that the value will be an
 * <em>object</em> or an array of objects if the data kind is a list.
 */
var kTYPE_STRUCT = ':type:struct';

/**
 * Array.
 *
 * This data type defines a <em>list of key/value pairs</em>, the key will be in general a
 * string, while the value type is not inferred. This data type usually applies to arrays in
 * which the key part is the discriminant and determines the type of the value, while
 * traditional arrays are better defined by a fixed data type and a list data kind.
 */
var kTYPE_ARRAY = ':type:array';

/**
 * Language string elements list.
 *
 * This data type defines a <em>list of strings expressed in different languages</em>. The
 * list elements are composed by <em>two key/value pairs</em>. The first pair has the
 * {@link kTAG_LANGUAGE} tag as its key and the value represents the language code. The
 * second pair has the {@link kTAG_TEXT} as its key and the value represents the text
 * expressed in the language defined by the first pair. No two elements may share the same
 * language and only one element may omit the language pair.
 */
var kTYPE_LANGUAGE_STRINGS = ':type:language-strings';

/**
 * Typed list.
 *
 * This data type defines a <em>list of elements categorised by type</em>. The list elements
 * are composed by <em>two key/value pairs</em>. The first pair has the {@link kTAG_TYPE}
 * tag as its key and the value represents the type of the element. The second pair has
 * an unspecified tag as the key and the value represents the element's value qualified by
 * the previous pair. No two elements may share the same type and only one element may omit
 * the type pair.
 */
var kTYPE_TYPED_LIST = ':type:typed-list';

/**
 * Shape.
 *
 * This data type defines a <em>shape structure</em>, this type of object represents a
 * geometric shape and it is expressed as a GeoJSON construct.
 *
 * It is an array composed by two key/value pairs:
 *
 * <ul>
 *	<li><tt>{@link kTAG_SHAPE_TYPE}</tt>: The element indexed by this string contains the
 *		code indicating the type of the shape, these are the supported values:
 *	 <ul>
 *		<li><tt>Point</tt>: A point.
 *		<li><tt>LineString</tt>: A list of non closed points.
 *		<li><tt>Polygon</tt>: A polygon, including its rings.
 *	 </ul>
 *	<li><tt>{@link kTAG_SHAPE_GEOMETRY}</tt>: The element indexed by this string contains
 *		the <em>geometry of the shape</em>, which has a structure depending on the shape
 +		type:
 *	 <ul>
 *		<li><tt>Point</tt>: The point is an array of two floating point numbers,
 *			respectively the <em>longitude</em> and <em>latitude</em>.
 *		<li><tt>LineString</tt>: A line string is an array of points expressed as the
 *			<tt>Point</tt> geometry.
 *		<li><tt>Polygon</tt>: A polygon is a list of rings whose geometry is like the
 *			<tt>LineString</em> geometry, except that the first and last point must match.
 *			The first ring represents the outer boundary of the polygon, the other rings are
 *			optional and represent holes in the polygon.
 *	 </ul>
 * </ul>
 */
var kTYPE_SHAPE = ':type:shape';

/*=======================================================================================
 *	STANDARDS DATA TYPES																*
 *======================================================================================*/

/**
 * Link.
 *
 * A <i>link</i> data type indicates that the referred property is a <em>string</em>
 * representing an <em>URL</em> which is an internet link or network address.
 */
var kTYPE_URL = ':type:url';

/*=======================================================================================
 *	ENUMERATED DATA TYPES																*
 *======================================================================================*/

/**
 * Enumeration.
 *
 * An <i>enumerated</i> data type indicates that the referred property may only hold <i>a
 * term reference</i>, that is, the <i>global identifier of a term object</i>. Enumerated
 * values are by default strings and must reference a term object.
 */
var kTYPE_ENUM = ':type:enum';

/**
 * Enumerated set.
 *
 * An <i>enumerated set</i> data type indicates that the referred property may only hold
 * <i>a list of term reference</i>, that is, an array of <i>term native identifiers</i>. All
 * the elements of this list must be unique.
 */
var kTYPE_SET = ':type:enum-set';

/*=======================================================================================
 *	REFERENCE DATA TYPES																*
 *======================================================================================*/

/**
 * Tag reference.
 *
 * A <i>tag reference</i> is a <em>string</em> that must correspond to the native identifier
 * of a {@link Tag} object.
 */
var kTYPE_REF_TAG = ':type:ref:tag';

/**
 * Term reference.
 *
 * A <i>term reference</i> is a <em>string</em> that must correspond to the identifier of a
 * {@link Term} object.
 */
var kTYPE_REF_TERM = ':type:ref:term';

/**
 * Node reference.
 *
 * A <i>node reference</i> is an <em>integer</em> that must correspond to the native
 * identifier of a {@link Node} object.
 */
var kTYPE_REF_NODE = ':type:ref:node';

/**
 * Edge reference.
 *
 * An <i>edge reference</i> is a <em>string</em> that must correspond to the native
 * identifier of an {@link Edge} object.
 */
var kTYPE_REF_EDGE = ':type:ref:edge';

/**
 * Entity reference.
 *
 * An <i>entity reference</i> is a <em>string</em> that must correspond to the native
 * identifier of an {@link Entity} object.
 */
var kTYPE_REF_ENTITY = ':type:ref:entity';

/**
 * Unit reference.
 *
 * A <i>unit reference</i> is a <em>string</em> that must correspond to the native
 * identifier of a {@link Unit} object.
 */
var kTYPE_REF_UNIT = ':type:ref:unit';

/**
 * Self reference.
 *
 * This type defines an <em>reference</em> to an <em>object of the same class</em>.
 */
var kTYPE_REF_SELF = ':type:ref:self';

/*=======================================================================================
 *	DEFAULT TERM TYPES																	*
 *======================================================================================*/

/**
 * Instance.
 *
 * A metadata instance.
 *
 * An instance is a term which represents the actual object that it defines, the term
 * represents the metadata and instance at the same time. This happens generally with
 * elements of an enumerated set: an enumerated value instance term will hold data in
 * addition to metadata regarding the object that it defines.
 */
var kTYPE_TERM_INSTANCE = ':type:term:instance';

/*=======================================================================================
 *	DEFAULT NODE KINDS																	*
 *======================================================================================*/

/**
 * Root.
 *
 * An entry point of an ontology.
 *
 * This kind represents a door or entry point of a tree or graph. It can be either the node
 * from which the whole structure originates from, or a node that represents a specific
 * thematic entry point. In general, such objects will have other attributes that will
 * qualify the kind of the structure.
 */
var kTYPE_NODE_ROOT = ':kind:root-node';

/**
 * Property.
 *
 * The full data property definition.
 *
 * This kind of node references a {@link Tag} object which contains all the necessary
 * information to define and describe a data property.
 */
var kTYPE_NODE_PROPERTY = ':kind:property-node';

/**
 * Enumerated.
 *
 * A controlled vocabulary.
 *
 * This kind of node describes a controlled vocabulary, it has implicitly the
 * {@link kTYPE_NODE_TYPE} type holding an enumerated set of values. This kind of node can
 * be used to define a specific controlled vocabulary, its elements are related to this node
 * by the {@link kPREDICATE_ENUM_OF} predicate and this node can define a tag referring to
 * the latter using the kPREDICATE_TYPE_OF} predicate.
 */
var kTYPE_NODE_ENUMERATED = ':kind:enumerated-node';

/**
 * Ontology.
 *
 * An ontology.
 *
 * This is a graph structure that represents an ontology, the element that bares this
 * attribute is expected to be a root node, structures of this kind usually represent the
 * full set of elements comprising an ontology which will be used by views to create
 * thematic selections.
 */
var kTYPE_NODE_ONTOLOGY = ':type:node:ontology';

/**
 * Type.
 *
 * A type or controlled vocabulary.
 *
 * This is a structure that represents a type or controlled vocabulary, the element that
 * bares this attribute is expected to be a root node and its structure must be a tree (at
 * most one parent node). The main use of such a kind is to group all elements representing
 * a type or controlled vocabulary that comprises the full set of attributes, views that
 * reference such structures can be used to represent thematic subsets of such types or
 * controlled vocabularies.
 */
var kTYPE_NODE_TYPE = ':type:node:type';

/**
 * View.
 *
 * A view.
 *
 * This represents a view into an existing structure or structures, the element that bares
 * this attribute is expected to be a root node and the structure is expected to be either
 * a selection or an aggregation of elements from different existing structures. The main
 * goal is to create specific thematic views.
 */
var kTYPE_NODE_VIEW = ':type:node:view';

/**
 * Template.
 *
 * A data template.
 *
 * This is a view that represents a template, the element that bares this attribute is
 * expected to be a root node and its structure must be a tree (at most one parent node).
 * Templates are generally used to import and export data recorded using elements from the
 * ontologies.
 */
var kTYPE_NODE_TEMPLATE = ':type:node:template';

/**
 * Form.
 *
 * A search form.
 *
 * This is a view that represents a search form, the element that bares this attribute is
 * expected to be a root node and its structure must be a tree (at most one parent node).
 * Structures of this kind can be used as search form templates where the branches represent
 * categories and the leaf nodes the attributes to be searched.
 */
var kTYPE_NODE_FORM = ':type:node:form';

/**
 * Structure.
 *
 * A data structure.
 *
 * This is a view that represents a data structure, the element that bares this attribute is
 * expected to be a root node and its structure must be a tree (at most one parent node).
 * Structures of this kind can be used as templates to define the physical structure of an
 * object.
 */
var kTYPE_NODE_STRUCT = ':type:node:struct';

/**
 * Schema.
 *
 * A data schema.
 *
 * This is a view that represents a data schema, the element that bares this attribute is
 * expected to be a root node and its structure must be a tree (at most one parent node).
 * Structures of this kind can be used as templates to define common sub-structures which
 * will be used by structures to define the physical structure of an object.
 */
var kTYPE_NODE_SCHEMA = ':type:node:schema';

/**
 * Feature.
 *
 * A feature or attribute of an object that can be described or measured.
 *
 * This kind of node defines a feature, property or attribute of an object that can be
 * described or measured. This kind of node will generally be found as a leaf of the
 * structure describing an object. Plant height is a plant characteristic that belongs to
 * the category of morphological traits: the latter is not a feature, while plant height is.
 */
var kTYPE_NODE_FEATURE = ':type:node:feature';

/**
 * Method.
 *
 * A method or variation of an object's feature measurement.
 *
 * This kind of node is required whenever an object's feature can be measured in different
 * ways or with different workflows without becoming a different feature. Plant height is an
 * attribute of a plant which can be measured after a month or at flowering time; the
 * attribute is the same, but the method is different.
 */
var kTYPE_NODE_METHOD = ':type:node:method';

/**
 * Scale.
 *
 * The scale or unit in which a measurement is expressed in.
 *
 * This kind of node describes in what unit or scale a measurement is expressed in. Plant
 * height may be measured in centimeters or inches, as well as in intervals or finite
 * categories.
 */
var kTYPE_NODE_SCALE = ':type:node:scale';

/**
 * Enumeration.
 *
 * An element of a controlled vocabulary.
 *
 * This kind of node describes a controlled vocabulary element. These nodes derive from
 * scale nodes and represent the valid choices of enumeration and enumerated set scale
 * nodes. An ISO 3166 country code could be considered an enumeration node.
 */
var kTYPE_NODE_ENUMERATION = ':type:node:enumeration';

/**
 * Term.
 *
 * A term.
 *
 * This kind of node describes a reference to a term with no specific qualification, this
 * type is only used to qualify a node that has no type.
 */
var kTYPE_NODE_TERM = ':type:node:term';

/*=======================================================================================
 *	CARDINALITY TYPES																	*
 *======================================================================================*/

/**
 * List.
 *
 * A <i>list</i> cardinality type indicates that the referred property will hold a <i>list
 * of values</i> whose elements will have the data type defined by the <i>data type</i>
 * property.
 */
var kTYPE_LIST = ':type:list';

/**
 * Categorical.
 *
 * A <i>categorical</i> property is one which can take on one of a limited, and usually
 * fixed, number of possible values. In general, properties which take their values from an
 * enumerated set of choices are of this kind.
 */
var kTYPE_CATEGORICAL = ':type:categorical';

/**
 * Quantitative.
 *
 * A <i>quantitative</i> property is one whose type of information based in quantities or
 * else quantifiable data. In general numerical values which can be aggregated in ranges
 * fall under this category.
 */
var kTYPE_QUANTITATIVE = ':type:quantitative';

/**
 * Discrete.
 *
 * A <i>discrete</i> property is one which may <em>take an indefinite number of values</em>,
 * which <em>differentiates it from a categorical</em> property, and whose values are
 * <em>not continuous</em>, which <em>differentiates it from a quantitative property</em>.
 */
var kTYPE_DISCRETE = ':type:discrete';

/**
 * Private input.
 *
 * A <i>private input</i> cardinality type indicates that the referred property is handled
 * internally and it must not be set by clients.
 */
var kTYPE_PRIVATE_IN = ':type:private-in';

/**
 * Private output.
 *
 * A <i>private output</i> cardinality type indicates that the referred property internal
 * and it should not be displayed to clients.
 */
var kTYPE_PRIVATE_OUT = ':type:private-out';

/*=======================================================================================
 *	RELATIONSHIP TYPES																	*
 *======================================================================================*/

/**
 * Incoming.
 *
 * An <i>incoming relationship</i> indicates that the relationship is originating from an
 * external vertex directed to the current vertex.
 */
var kTYPE_RELATIONSHIP_IN = ':relationship:in';

/**
 * Outgoing.
 *
 * An <i>outgoing relationship</i> indicates that the relationship is originating from the
 * current vertex directed to an external vertex.
 */
var kTYPE_RELATIONSHIP_OUT = ':relationship:out';

/**
 * Cross referenced.
 *
 * An <i>cross referenced relationship</i> indicates that the relationship is going in both
 * directions: from the current vertex to an external vertex and from the external vertex to
 * the current vertex.
 */
var kTYPE_RELATIONSHIP_ALL = ':relationship:all';
