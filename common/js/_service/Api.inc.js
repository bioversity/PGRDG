/*=======================================================================================
 *																						*
 *										Api.inc.js										*
 *																						*
 *======================================================================================*/
 
/**
 * Service application interface.
 *
 * This file contains the definitions for the service application interface, 
 *
 * To convert this file to javascript use the following grep pattern:
 * <code>
 * search:  ^define\( "(.+)",.+(\'.+\').*;
 * replace: var \1 = \2;
 * </code>
 *
 * To convert the definitions into constants:
 * <code>
 * search:  ^\tdefine\( \"(.+)\"\,(.+)(\'.+\') \);\r
 * replace: \tconst \1 =   \2\3;\r
 * </code>
 *
 *	@author		Milko A. Škofič <m.skofic@cgiar.org>
 *	@version	1.00 04/05/2014
 */

/*=======================================================================================
 *	REQUEST																				*
 *======================================================================================*/

/**
 * Operation.
 *
 * This tag identifies the service operation.
 */
var kAPI_REQUEST_OPERATION = 'op';

/**
 * Language.
 *
 * This tag identifies the service default language.
 */
var kAPI_REQUEST_LANGUAGE = 'lang';

/**
 * Parameters.
 *
 * This tag identifies the service parameters.
 */
var kAPI_REQUEST_PARAMETERS = 'param';

/*=======================================================================================
 *	RESPONSE																			*
 *======================================================================================*/

/**
 * Status.
 *
 * This tag identifies the status section which provides information on the outcome of the
 * operation, which includes the eventual error message if the operation failed.
 */
var kAPI_RESPONSE_STATUS = 'status';

/**
 * Paging.
 *
 * This tag identifies the paging section which provides information on the number of
 * affected records, skipped records, the maximum number of returned records and the actual
 * number of returned records.
 */
var kAPI_RESPONSE_PAGING = 'paging';

/**
 * Results.
 *
 * This tag identifies the results section which holds the operation result.
 */
var kAPI_RESPONSE_RESULTS = 'results';

/**
 * Dictionary.
 *
 * This tag indicates the results dictionary.
 */
var kAPI_RESULTS_DICTIONARY = 'dictionary';

/*=======================================================================================
 *	STATUS																				*
 *======================================================================================*/

/**
 * State.
 *
 * This tag provides a general indicatrion on the outcome of the operation, it can take two
 * values:
 *
 * <ul>
 *	<li><tt>{@link kAPI_STATE_IDLE}</tt>: This indicates that the operation has not yet
 *		started.
 *	<li><tt>{@link kAPI_STATE_OK}</tt>: This indicates that the operation was successful.
 *	<li><tt>{@link kAPI_STATE_ERROR}</tt>: This indicates that the operation failed.
 * </ul>
 */
var kAPI_STATUS_STATE = 'state';

/**
 * Code.
 *
 * This tag indicates a status code.
 */
var kAPI_STATUS_CODE = 'code';

/**
 * File.
 *
 * This tag indicates the source filename.
 */
var kAPI_STATUS_FILE = 'file';

/**
 * Line.
 *
 * This tag indicates the source file line.
 */
var kAPI_STATUS_LINE = 'line';

/**
 * Message.
 *
 * This tag indicates a status message.
 */
var kAPI_STATUS_MESSAGE = 'message';

/**
 * Trace.
 *
 * This tag indicates the exception trace.
 */
var kAPI_STATUS_TRACE = 'trace';

/*=======================================================================================
 *	PAGING																				*
 *======================================================================================*/

/**
 * Skip.
 *
 * This tag indicates the number of skipped records.
 */
var kAPI_PAGING_SKIP = 'skipped';

/**
 * Limit.
 *
 * This tag indicates the maximum number of returned records.
 */
var kAPI_PAGING_LIMIT = 'limit';

/**
 * Actual.
 *
 * This tag indicates the actual number of returned records.
 */
var kAPI_PAGING_ACTUAL = 'actual';

/**
 * Affected.
 *
 * This tag indicates the total number of affected records.
 */
var kAPI_PAGING_AFFECTED = 'affected';

/*=======================================================================================
 *	STATE																				*
 *======================================================================================*/

/**
 * Idle.
 *
 * Idle state.
 *
 * The service has not yet parsed the request.
 */
var kAPI_STATE_IDLE = 'idle';

/**
 * OK.
 *
 * Success state.
 *
 * The service has no errors.
 */
var kAPI_STATE_OK = 'ok';

/**
 * Error.
 *
 * Error state.
 *
 * The service encountered an error.
 */
var kAPI_STATE_ERROR = 'error';

/*=======================================================================================
 *	DICTIONARY																			*
 *======================================================================================*/

/**
 * Collection.
 *
 * This tag indicates the dictionary collection name.
 */
var kAPI_DICTIONARY_COLLECTION = 'collection';

/**
 * Tags cross reference.
 *
 * This tag indicates the dictionary tags cross references.
 */
var kAPI_DICTIONARY_TAGS = 'tags';

/**
 * IDs list.
 *
 * This tag indicates the dictionary list of identifiers.
 */
var kAPI_DICTIONARY_IDS = 'ids';

/*=======================================================================================
 *	OPERATIONS																			*
 *======================================================================================*/

/**
 * Ping.
 *
 * This tag defines the ping operation.
 *
 * This operation requires no parameters, it will return the string "pong" in the status
 * message field.
 */
var kAPI_OP_PING = 'ping';

/**
 * Match tag labels.
 *
 * This tag defines the match tag labels operation.
 *
 * The service will return a list of tag label strings corresponding to the provided
 * pattern, language, operator and limit.
 *
 * This operation expects the following parameters:
 *
 * <ul>
 *	<li><tt>{@link kAPI_PARAM_PATTERN}</tt>: <em>Pattern</em>. This required parameter
 *		contains the match pattern.
 *	<li><tt>{@link kAPI_REQUEST_LANGUAGE}</tt>: <em>Language</em>. If the parameter is
 *		omitted, the {@link kSTANDARDS_LANGUAGE} constant will be used. The value represents
 *		a language code.
 *	<li><tt>{@link kAPI_PARAM_OPERATOR}</tt>: <em>Operator</em>. This required parameter
 *		indicates what kind of match should be applied to the searched strings, it is an
 *		array that must contain one of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_EQUAL}</tt>: <em>Equality</em>. The two match terms must be
 *			equal.
 *		<li><tt>{@link kOPERATOR_EQUAL_NOT}</tt>: <em>Inequality</em>. The two match terms
 *			must be different.
 *		<li><tt>{@link kOPERATOR_PREFIX}</tt>: <em>Prefix</em>. The target string must start
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_CONTAINS}</tt>: <em>Contains</em>. The target string must
 *			contain the query pattern.
 *		<li><tt>{@link kOPERATOR_SUFFIX}</tt>: <em>Suffix</em>. The target string must end
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_REGEX}</tt>: <em>Regular expression</em>. The parameter is
 *			expected to contain a regular expression string.
 *	 </ul>
 *		and any of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_NOCASE}</tt>: <em>Case insensitive</em>. If provided, it
 *			means that the matching operation is case and accent insensitive.
 *	 </ul>
 *	<li><em>Flags</em>: The following optional parameters are flags which will generate
 *		additional query filters which will be chained in <tt>AND</tt>;
 *	 <ul>
 *		<li><tt>{@link kAPI_PARAM_HAS_TAG_REFS}</tt>: <em>Tag references</em>. Select only
 *			those objects which are or are not referenced by tag objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_TERM_REFS}</tt>: <em>Term references</em>. Select only
 *			those objects which are or are not referenced by term objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_NODE_REFS}</tt>: <em>Node references</em>. Select only
 *			those objects which are or are not referenced by node objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_EDGE_REFS}</tt>: <em>Edge references</em>. Select only
 *			those objects which are or are not referenced by edge objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_UNIT_REFS}</tt>: <em>Unit references</em>. Select only
 *			those objects which are or are not referenced by unit objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_ENTITY_REFS}</tt>: <em>Entity references</em>. Select
 *			only those objects which are or are not referenced by entity objects.
 *	 </ul>
 *	<li><tt>{@link kAPI_PAGING_LIMIT}</tt>: <em>Limit</em>. This required parameter
 *		indicates the maximum number of elements to be returned. If omitted, it will be
 *		set to the default constant {@link kSTANDARDS_STRINGS_LIMIT}.
 * </ul>
 */
var kAPI_OP_MATCH_TAG_LABELS = 'matchTagLabels';

/**
 * Match term labels.
 *
 * This tag defines the match term labels operation.
 *
 * The service will return a list of term label strings corresponding to the provided
 * pattern, language, operator and limit.
 *
 * This operation expects the following parameters:
 *
 * <ul>
 *	<li><tt>{@link kAPI_PARAM_PATTERN}</tt>: <em>Pattern</em>. This required parameter
 *		contains the match pattern.
 *	<li><tt>{@link kAPI_REQUEST_LANGUAGE}</tt>: <em>Language</em>. If the parameter is
 *		omitted, the {@link kSTANDARDS_LANGUAGE} constant will be used. The value represents
 *		a language code.
 *	<li><tt>{@link kAPI_PARAM_OPERATOR}</tt>: <em>Operator</em>. This required parameter
 *		indicates what kind of match should be applied to the searched strings, it is an
 *		array that must contain one of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_EQUAL}</tt>: <em>Equality</em>. The two match terms must be
 *			equal.
 *		<li><tt>{@link kOPERATOR_EQUAL_NOT}</tt>: <em>Inequality</em>. The two match terms
 *			must be different.
 *		<li><tt>{@link kOPERATOR_PREFIX}</tt>: <em>Prefix</em>. The target string must start
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_CONTAINS}</tt>: <em>Contains</em>. The target string must
 *			contain the query pattern.
 *		<li><tt>{@link kOPERATOR_SUFFIX}</tt>: <em>Suffix</em>. The target string must end
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_REGEX}</tt>: <em>Regular expression</em>. The parameter is
 *			expected to contain a regular expression string.
 *	 </ul>
 *		and any of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_NOCASE}</tt>: <em>Case insensitive</em>. If provided, it
 *			means that the matching operation is case and accent insensitive.
 *	 </ul>
 *	<li><em>Flags</em>: The following optional parameters are flags which will generate
 *		additional query filters which will be chained in <tt>AND</tt>;
 *	 <ul>
 *		<li><tt>{@link kAPI_PARAM_HAS_TAG_REFS}</tt>: <em>Tag references</em>. Select only
 *			those objects which are or are not referenced by tag objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_TERM_REFS}</tt>: <em>Term references</em>. Select only
 *			those objects which are or are not referenced by term objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_NODE_REFS}</tt>: <em>Node references</em>. Select only
 *			those objects which are or are not referenced by node objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_EDGE_REFS}</tt>: <em>Edge references</em>. Select only
 *			those objects which are or are not referenced by edge objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_UNIT_REFS}</tt>: <em>Unit references</em>. Select only
 *			those objects which are or are not referenced by unit objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_ENTITY_REFS}</tt>: <em>Entity references</em>. Select
 *			only those objects which are or are not referenced by entity objects.
 *	 </ul>
 *	<li><tt>{@link kAPI_PAGING_LIMIT}</tt>: <em>Limit</em>. This required parameter
 *		indicates the maximum number of elements to be returned. If omitted, it will be
 *		set to the default constant {@link kSTANDARDS_STRINGS_LIMIT}.
 * </ul>
 */
var kAPI_OP_MATCH_TERM_LABELS = 'matchTermLabels';

/**
 * Match tag by label.
 *
 * This tag defines the match tag by label operation.
 *
 * The service will return a list of tag objects whose label matches the provided pattern,
 * language, operator and limit.
 *
 * This operation expects the following parameters:
 *
 * <ul>
 *	<li><tt>{@link kAPI_PARAM_PATTERN}</tt>: <em>Pattern</em>. This required parameter
 *		contains the match pattern.
 *	<li><tt>{@link kAPI_REQUEST_LANGUAGE}</tt>: <em>Language</em>. If the parameter is
 *		omitted, the {@link kSTANDARDS_LANGUAGE} constant will be used. The value represents
 *		a language code.
 *	<li><tt>{@link kAPI_PARAM_OPERATOR}</tt>: <em>Operator</em>. This required parameter
 *		indicates what kind of match should be applied to the searched strings, it is an
 *		array that must contain one of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_EQUAL}</tt>: <em>Equality</em>. The two match terms must be
 *			equal.
 *		<li><tt>{@link kOPERATOR_EQUAL_NOT}</tt>: <em>Inequality</em>. The two match terms
 *			must be different.
 *		<li><tt>{@link kOPERATOR_PREFIX}</tt>: <em>Prefix</em>. The target string must start
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_CONTAINS}</tt>: <em>Contains</em>. The target string must
 *			contain the query pattern.
 *		<li><tt>{@link kOPERATOR_SUFFIX}</tt>: <em>Suffix</em>. The target string must end
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_REGEX}</tt>: <em>Regular expression</em>. The parameter is
 *			expected to contain a regular expression string.
 *	 </ul>
 *		and any of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_NOCASE}</tt>: <em>Case insensitive</em>. If provided, it
 *			means that the matching operation is case and accent insensitive.
 *	 </ul>
 *	<li><em>Flags</em>: The following optional parameters are flags which will generate
 *		additional query filters which will be chained in <tt>AND</tt>;
 *	 <ul>
 *		<li><tt>{@link kAPI_PARAM_HAS_TAG_REFS}</tt>: <em>Tag references</em>. Select only
 *			those objects which are or are not referenced by tag objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_TERM_REFS}</tt>: <em>Term references</em>. Select only
 *			those objects which are or are not referenced by term objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_NODE_REFS}</tt>: <em>Node references</em>. Select only
 *			those objects which are or are not referenced by node objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_EDGE_REFS}</tt>: <em>Edge references</em>. Select only
 *			those objects which are or are not referenced by edge objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_UNIT_REFS}</tt>: <em>Unit references</em>. Select only
 *			those objects which are or are not referenced by unit objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_ENTITY_REFS}</tt>: <em>Entity references</em>. Select
 *			only those objects which are or are not referenced by entity objects.
 *	 </ul>
 *	<li><tt>{@link kAPI_PAGING_LIMIT}</tt>: <em>Limit</em>. This required parameter
 *		indicates the maximum number of elements to be returned. If omitted, it will be
 *		set to the default constant {@link kSTANDARDS_STRINGS_LIMIT}.
 * </ul>
 */
var kAPI_OP_MATCH_TAG_BY_LABEL = 'matchTagByLabel';

/**
 * Match term by label.
 *
 * This tag defines the match term by label operation.
 *
 * The service will return a list of term objects whose label matches the provided pattern,
 * language, operator and limit.
 *
 * This operation expects the following parameters:
 *
 * <ul>
 *	<li><tt>{@link kAPI_PARAM_PATTERN}</tt>: <em>Pattern</em>. This required parameter
 *		contains the match pattern.
 *	<li><tt>{@link kAPI_REQUEST_LANGUAGE}</tt>: <em>Language</em>. If the parameter is
 *		omitted, the {@link kSTANDARDS_LANGUAGE} constant will be used. The value represents
 *		a language code.
 *	<li><tt>{@link kAPI_PARAM_OPERATOR}</tt>: <em>Operator</em>. This required parameter
 *		indicates what kind of match should be applied to the searched strings, it is an
 *		array that must contain one of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_EQUAL}</tt>: <em>Equality</em>. The two match terms must be
 *			equal.
 *		<li><tt>{@link kOPERATOR_EQUAL_NOT}</tt>: <em>Inequality</em>. The two match terms
 *			must be different.
 *		<li><tt>{@link kOPERATOR_PREFIX}</tt>: <em>Prefix</em>. The target string must start
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_CONTAINS}</tt>: <em>Contains</em>. The target string must
 *			contain the query pattern.
 *		<li><tt>{@link kOPERATOR_SUFFIX}</tt>: <em>Suffix</em>. The target string must end
 *			with the query pattern.
 *		<li><tt>{@link kOPERATOR_REGEX}</tt>: <em>Regular expression</em>. The parameter is
 *			expected to contain a regular expression string.
 *	 </ul>
 *		and any of the following:
 *	 <ul>
 *		<li><tt>{@link kOPERATOR_NOCASE}</tt>: <em>Case insensitive</em>. If provided, it
 *			means that the matching operation is case and accent insensitive.
 *	 </ul>
 *	<li><em>Flags</em>: The following optional parameters are flags which will generate
 *		additional query filters which will be chained in <tt>AND</tt>;
 *	 <ul>
 *		<li><tt>{@link kAPI_PARAM_HAS_TAG_REFS}</tt>: <em>Tag references</em>. Select only
 *			those objects which are or are not referenced by tag objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_TERM_REFS}</tt>: <em>Term references</em>. Select only
 *			those objects which are or are not referenced by term objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_NODE_REFS}</tt>: <em>Node references</em>. Select only
 *			those objects which are or are not referenced by node objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_EDGE_REFS}</tt>: <em>Edge references</em>. Select only
 *			those objects which are or are not referenced by edge objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_UNIT_REFS}</tt>: <em>Unit references</em>. Select only
 *			those objects which are or are not referenced by unit objects.
 *		<li><tt>{@link kAPI_PARAM_HAS_ENTITY_REFS}</tt>: <em>Entity references</em>. Select
 *			only those objects which are or are not referenced by entity objects.
 *	 </ul>
 *	<li><tt>{@link kAPI_PAGING_LIMIT}</tt>: <em>Limit</em>. This required parameter
 *		indicates the maximum number of elements to be returned. If omitted, it will be
 *		set to the default constant {@link kSTANDARDS_STRINGS_LIMIT}.
 * </ul>
 */
var kAPI_OP_MATCH_TERM_BY_LABEL = 'matchTermByLabel';

/*=======================================================================================
 *	PARAMETERS																			*
 *======================================================================================*/

/**
 * Pattern (string).
 *
 * This tag defines the requested pattern.
 *
 * This parameter represents a string match pattern, it is used to match strings.
 */
var kAPI_PARAM_PATTERN = 'pattern';

/**
 * Match operator (strings array).
 *
 * This tag defines the requested string match operator.
 *
 * These are the required choices:
 *
 * <ul>
 *	<li><tt>{@link kOPERATOR_EQUAL}</tt>: <em>Equality</em>. The two match terms must be
 *		equal.
 *	<li><tt>{@link kOPERATOR_EQUAL_NOT}</tt>: <em>Inequality</em>. The two match terms must
 *		be different.
 *	<li><tt>{@link kOPERATOR_PREFIX}</tt>: <em>Prefix</em>. The target string must start
 *		with the query pattern.
 *	<li><tt>{@link kOPERATOR_CONTAINS}</tt>: <em>Contains</em>. The target string must
 *		contain the query pattern.
 *	<li><tt>{@link kOPERATOR_SUFFIX}</tt>: <em>Suffix</em>. The target string must end with
 *		the query pattern.
 *	<li><tt>{@link kOPERATOR_REGEX}</tt>: <em>Regular expression</em>. The parameter is
 *		expected to contain a regular expression string.
 * </ul>
 *
 * The parameter must be an array which contains one of the above choices and optionally any
 * number of modifiers from the following list:
 *
 * <ul>
 *	<li><tt>{@link kOPERATOR_NOCASE}</tt>: <em>Case insensitive</em>. If provided, it means
 *		that the matching operation is case and accent insensitive.
 * </ul>
 */
var kAPI_PARAM_OPERATOR = 'operator';

/*=======================================================================================
 *	FLAG PARAMETERS																		*
 *======================================================================================*/

/**
 * Has tag references (boolean).
 *
 * This parameter adds a filter to the current query selecting all objects which are
 * referenced or not by <em>tag objects</em>.
 *
 * If the parameter is <tt>TRUE</tt>, it means that the service should only select objects
 * which have the {@link kTAG_TAG_COUNT} property <em>greater than zero</em>; if the value
 * is <tt>FALSE</tt>, it means that the service should only select objects which have the
 * {@link kTAG_TAG_COUNT} property <em>equal to zero</em>.
 *
 * If the parameter is omitted, the filter will not be used.
 */
var kAPI_PARAM_HAS_TAG_REFS = 'tag-refs';

/**
 * Has term references (boolean).
 *
 * This parameter adds a filter to the current query selecting all objects which are
 * referenced or not by <em>term objects</em>.
 *
 * If the parameter is <tt>TRUE</tt>, it means that the service should only select objects
 * which have the {@link kTAG_TERM_COUNT} property <em>greater than zero</em>; if the value
 * is <tt>FALSE</tt>, it means that the service should only select objects which have the
 * {@link kTAG_TERM_COUNT} property <em>equal to zero</em>.
 *
 * If the parameter is omitted, the filter will not be used.
 */
var kAPI_PARAM_HAS_TERM_REFS = 'term-refs';

/**
 * Has node references (boolean).
 *
 * This parameter adds a filter to the current query selecting all objects which are
 * referenced or not by <em>node objects</em>.
 *
 * If the parameter is <tt>TRUE</tt>, it means that the service should only select objects
 * which have the {@link kTAG_NODE_COUNT} property <em>greater than zero</em>; if the value
 * is <tt>FALSE</tt>, it means that the service should only select objects which have the
 * {@link kTAG_NODE_COUNT} property <em>equal to zero</em>.
 *
 * If the parameter is omitted, the filter will not be used.
 */
var kAPI_PARAM_HAS_NODE_REFS = 'node-refs';

/**
 * Has edge references (boolean).
 *
 * This parameter adds a filter to the current query selecting all objects which are
 * referenced or not by <em>edge objects</em>.
 *
 * If the parameter is <tt>TRUE</tt>, it means that the service should only select objects
 * which have the {@link kTAG_EDGE_COUNT} property <em>greater than zero</em>; if the value
 * is <tt>FALSE</tt>, it means that the service should only select objects which have the
 * {@link kTAG_EDGE_COUNT} property <em>equal to zero</em>.
 *
 * If the parameter is omitted, the filter will not be used.
 */
var kAPI_PARAM_HAS_EDGE_REFS = 'edge-refs';

/**
 * Has unit references (boolean).
 *
 * This parameter adds a filter to the current query selecting all objects which are
 * referenced or not by <em>unit objects</em>.
 *
 * If the parameter is <tt>TRUE</tt>, it means that the service should only select objects
 * which have the {@link kTAG_UNIT_COUNT} property <em>greater than zero</em>; if the value
 * is <tt>FALSE</tt>, it means that the service should only select objects which have the
 * {@link kTAG_UNIT_COUNT} property <em>equal to zero</em>.
 *
 * If the parameter is omitted, the filter will not be used.
 */
var kAPI_PARAM_HAS_UNIT_REFS = 'unit-refs';

/**
 * Has entity references (boolean).
 *
 * This parameter adds a filter to the current query selecting all objects which are
 * referenced or not by <em>entity objects</em>.
 *
 * If the parameter is <tt>TRUE</tt>, it means that the service should only select objects
 * which have the {@link kTAG_ENTITY_COUNT} property <em>greater than zero</em>; if the
 * value is <tt>FALSE</tt>, it means that the service should only select objects which have
 * the {@link kTAG_ENTITY_COUNT} property <em>equal to zero</em>.
 *
 * If the parameter is omitted, the filter will not be used.
 */
var kAPI_PARAM_HAS_ENTITY_REFS = 'entity-refs';
