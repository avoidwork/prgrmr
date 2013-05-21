/**
 * abaaso
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/abaaso/master/LICENSE>
 * @link http://abaaso.com
 * @module abaaso
 * @version 3.7.14
 */
( function ( global ) {

var document  = global.document,
    location  = global.location,
    navigator = global.navigator,
    server    = typeof exports !== "undefined",
    $, abaaso, http, https, url;

if ( global.abaaso !== undefined ) {
	return;
}

if ( server ) {
	url   = require( "url" );
	http  = require( "http" );
	https = require( "https" );

	if ( typeof Storage === "undefined" ) {
		localStorage = require( "localStorage" );
	}

	if ( typeof XMLHttpRequest === "undefined" ) {
		XMLHttpRequest = null;
	}
}

abaaso = (function () {
"use strict";

var $, bootstrap, error, external;

/**
 * Regex patterns used through abaaso
 *
 * `url` was authored by Diego Perini
 * 
 * @class regex
 * @namespace abaaso
 */
var regex = {
	android                 : /android/i,
	allow                   : /^allow$/i,
	allow_cors              : /^access-control-allow-methods$/i,
	alphanum                : /^[a-zA-Z0-9]+$/,
	auth                    : /\/\/(.*)\@/,
	blackberry              : /blackberry/i,
	"boolean"               : /^(0|1|true|false)?$/,
	boolean_number_string   : /boolean|number|string/,
	checked_disabled        : /checked|disabled/i,
	chrome                  : /chrome/i,
	complete_loaded         : /^(complete|loaded)$/i,
	csv_quote               : /^\s|\"|\n|,|\s$/,
	del                     : /^del/,
	decimal                 : /^\d+.(\d+)/,
	desc                    : /\s*desc$/i,
	domain                  : /^[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/,
	down                    : /down/,
	down_up                 : /down|up/,
	email                   : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	element_update          : /innerHTML|innerText|textContent|type|src/,
	firefox                 : /firefox/i,
	get_headers             : /^(head|get|options)$/,
	get_remove_set          : /get|remove|set/,
	hash                    : /\#/,
	hash_bang               : /^\#\!?/,
	header_replace          : /:.*/,
	header_value_replace    : /.*:\s+/,
	http_body               : /200|202|203|206/,
	http_ports              : /80|443/,
	ie                      : /msie|ie/i,
	input_button            : /button|submit|reset/,
	integer                 : /(^-?\d\d*$)/,
	ip                      : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	is_xml                  : /<[^>]+>[^<]*]+>/,
	ios                     : /ipad|iphone/i,
	json_maybe              : /json|plain|javascript/,
	json_wrap               : /^[\[\{]/,
	jsonp_wrap              : /([a-zA-Z0-9\.]+\()(.*)(\))$/,
	linux                   : /linux|bsd|unix/i,
	nil                     : /^null/i,
	no                      : /no/i,
	not_endpoint            : /.*\//,
	notEmpty                : /\w{1,}/,
	number                  : /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)|number/,
	number_format_1         : /.*\./,
	number_format_2         : /\..*/,
	number_present          : /\d{1,}/,
	number_string           : /number|string/i,
	number_string_object    : /number|object|string/i,
	null_undefined          : /null|undefined/,
	observer_allowed        : /click|error|key|mousedown|mouseup|submit/i,
	observer_globals        : /body|document|window/i,
	object_type             : /\[object Object\]/,
	object_undefined        : /object|undefined/,
	opera                   : /opera/i,
	osx                     : /macintosh/i,
	patch                   : /^patch$/,
	phone                   : /^([0-9\(\)\/\+ \-\.]+)$/,
	playbook                : /playbook/i,
	plural                  : /s$/,
	put_post                : /^(post|put)$/i,
	radio_checkbox          : /^(radio|checkbox)$/i,
	reflect                 : /function\s+\w*\s*\((.*?)\)/,
	root                    : /^\/[^\/]/,
	route_nget              : /^(head|options)$/i,
	route_methods           : /^(all|delete|get|put|post|head|options)$/i,
	safari                  : /safari/i,
	scheme                  : /.*\/\//,
	select                  : /select/i,
	selector_many           : /\:|\./,
	selector_complex        : /\s|\>/,
	sensitivity_types       : /ci|cs|ms/,
	set_del                 : /^(set|del|delete)$/,
	sort_needle             : /:::(.*)$/,
	space_hyphen            : /\s|-/,
	string_boolean          : /^(true|false)$/i,
	string_object           : /string|object/i,
	string_true             : /^true$/i,
	svg                     : /svg/,
	top_bottom              : /top|bottom/i,
	true_undefined          : /true|undefined/i,
	url                     : /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
	webos                   : /webos/i,
	windows                 : /windows/i,
	xml                     : /xml/i
};

/**
 * Array methods
 *
 * @class array
 * @namespace abaaso
 */
var array = {
	/**
	 * Adds 'arg' to 'obj' if it is not found
	 * 
	 * @method add
	 * @param  {Array} obj Array to receive 'arg'
	 * @param  {Mixed} arg Argument to set in 'obj'
	 * @return {Array}     Array that was queried
	 */
	add : function ( obj, arg ) {
		if ( !array.contains( obj, arg ) ) {
			obj.push( arg );
		}

		return obj;
	},

	/**
	 * Returns an Object ( NodeList, etc. ) as an Array
	 *
	 * @method cast
	 * @param  {Object}  obj Object to cast
	 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
	 * @return {Array}       Object as an Array
	 */
	cast : function ( obj, key ) {
		if ( server || (!client.ie || client.version > 8) ) {
			return function ( obj, key ) {
				key = ( key === true );
				var o = [];

				if ( !isNaN( obj.length ) ) {
					o = Array.prototype.slice.call( obj );
				}
				else {
					key ? o = array.keys( obj )
					    : utility.iterate( obj, function ( i ) {
					    	o.push( i );
					      });
				}

				return o;
			};
		}
		else {
			return function ( obj, key ) {
				key   = ( key === true );
				var o = [];

				if ( !isNaN( obj.length ) ) {
					try {
						o = Array.prototype.slice.call( obj );
					}
					catch ( e ) {
						utility.iterate( obj, function ( i, idx ) {
							if ( idx !== "length" ) {
								o.push( i );
							}
						});
					}
				}
				else {
					key ? o = array.keys( obj )
					    : utility.iterate(obj, function ( i ) {
					    	o.push(i);
					      });
				}

				return o;
			};
		}
	},

	/**
	 * Transforms an Array to a 2D Array of chunks
	 * 
	 * @method chunk
	 * @param  {Array}  obj  Array to parse
	 * @param  {Number} size Chunk size ( integer )
	 * @return {Array}       Chunked Array
	 */
	chunk : function ( obj, size ) {
		var result = [],
		    nth    = number.round( ( obj.length / size ), "up" ),
		    start  = 0,
		    i      = -1;

		while ( ++i < nth ) {
			start = i * size;
			result.push( array.limit( obj, start, size ) );
		}

		return result;
	},

	/**
	 * Clears an Array without destroying it
	 * 
	 * @method clear
	 * @param  {Array} obj Array to clear
	 * @return {Array}     Cleared Array
	 */
	clear : function ( obj ) {
		return obj.length > 0 ? array.remove( obj, 0, obj.length ) : obj;
	},

	/**
	 * Clones an Array
	 * 
	 * @method clone
	 * @param  {Array} obj Array to clone
	 * @return {Array}     Clone of Array
	 */
	clone : function ( obj ) {
		return utility.clone( obj );
	},

	/**
	 * Determines if obj contains arg
	 * 
	 * @method contains
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to look for
	 * @return {Boolean}   True if found, false if not
	 */
	contains : function ( obj, arg ) {
		return ( array.index( obj, arg ) > -1 );
	},

	/**
	 * Creates a new Array of the result of `fn` executed against every index of `obj`
	 * 
	 * @method collect
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute against indices
	 * @return {Array}        New Array
	 */
	collect : function ( obj, fn ) {
		var result = [];

		array.each( obj, function ( i ) {
			result.push( fn( i ) );
		});

		return result;
	},

	/**
	 * Compacts a Array by removing `null` or `undefined` indices
	 * 
	 * @method compact
	 * @param  {Array} obj    Array to compact
	 * @param  {Boolean} diff Indicates to return resulting Array only if there's a difference
	 * @return {Array}        Compacted copy of `obj`, or null ( if `diff` is passed & no diff is found )
	 */
	compact : function ( obj, diff ) {
		var result = [];

		result = obj.filter( function ( i ) {
			return !regex.null_undefined.test( i );
		});

		return !diff ? result : ( result.length < obj.length ? result : null );
	},

	/**
	 * Counts `value` in `obj`
	 * 
	 * @method count
	 * @param  {Array} obj   Array to search
	 * @param  {Mixed} value Value to compare
	 * @return {Array}       Array of counts
	 */
	count : function ( obj, value ) {
		return obj.filter( function ( i ) {
			return ( i === value );
		}).length;
	},

	/**
	 * Finds the difference between array1 and array2
	 *
	 * @method diff
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the differences
	 */
	diff : function ( array1, array2 ) {
		var result = [];

		array.each( array1, function ( i ) {
			if ( !array.contains( array2, i ) ) {
				array.add( result, i );
			}
		});

		array.each( array2, function ( i ) {
			if ( !array.contains( array1, i ) ) {
				array.add( result, i );
			}
		});

		return result;
	},

	/**
	 * Iterates obj and executes fn
	 * Parameters for fn are 'value', 'key'
	 * 
	 * @method each
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute on index values
	 * @return {Array}        Array
	 */
	each : function ( obj, fn ) {
		var nth = obj.length,
		    i   = -1;

		while ( ++i < nth ) {
			if ( fn.call( obj, obj[i], i ) === false ) {
				break;
			}
		}

		return obj;
	},

	/**
	 * Determines if an Array is empty
	 * 
	 * @method empty
	 * @param  {Array} obj Array to inspect
	 * @return {Boolean}   `true` if there's no indices
	 */
	empty : function ( obj ) {
		return ( obj.length === 0 );
	},

	/**
	 * Determines if `a` is equal to `b`
	 * 
	 * @method equal
	 * @param  {Array} a Array to compare
	 * @param  {Array} b Array to compare
	 * @return {Boolean} `true` if the Arrays match
	 */
	equal : function ( a, b ) {
		return ( json.encode( a ) === json.encode( b ) );
	},

	/**
	 * Fills `obj` with the evalution of `arg`, optionally from `start` to `offset`
	 * 
	 * @method fill
	 * @param  {Array}  obj   Array to fill
	 * @param  {Mixed}  arg   String, Number of Function to fill with
	 * @param  {Number} start [Optional] Index to begin filling at
	 * @param  {Number} end   [Optional] Offset from start to stop filling at
	 * @return {Array}        Filled Array
	 */
	fill : function ( obj, arg, start, offset ) {
		var fn  = typeof arg === "function",
		    l   = obj.length,
		    i   = !isNaN( start ) ? start : 0,
		    nth = !isNaN( offset ) ? i + offset : l - 1;

		if ( nth > ( l - 1) ) {
			nth = l - 1;
		}

		for ( ; i <= nth; i++ ) {
			obj[i] = fn ? arg( obj[i] ) : arg;
		}

		return obj;
	},

	/**
	 * Returns the first Array node
	 *
	 * @method first
	 * @param  {Array} obj The array
	 * @return {Mixed}     The first node of the array
	 */
	first : function ( obj ) {
		return obj[0];
	},

	/**
	 * Flattens a 2D Array
	 * 
	 * @method flat
	 * @param  {Array} obj 2D Array to flatten
	 * @return {Array}     Flatten Array
	 */
	flat : function ( obj ) {
		var result = [];

		result = obj.reduce( function ( a, b ) {
			return a.concat( b );
		}, result );

		return result;
	},

	/**
	 * Facade to indexOf for shorter syntax
	 *
	 * @method index
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Value to find index of
	 * @return {Number}    The position of arg in instance
	 */
	index : function ( obj, arg ) {
		return obj.indexOf( arg );
	},

	/**
	 * Returns an Associative Array as an Indexed Array
	 *
	 * @method indexed
	 * @param  {Array} obj Array to index
	 * @return {Array}     Indexed Array
	 */
	indexed : function ( obj ) {
		var indexed = [];

		utility.iterate( obj, function ( v, k ) {
			typeof v === "object" ? indexed = indexed.concat( array.indexed( v ) ) : indexed.push( v );
		});

		return indexed;
	},

	/**
	 * Finds the intersections between array1 and array2
	 *
	 * @method intersect
	 * @param  {Array} array1 Source Array
	 * @param  {Array} array2 Comparison Array
	 * @return {Array}        Array of the intersections
	 */
	intersect : function ( array1, array2 ) {
		var a = array1.length > array2.length ? array1 : array2,
		    b = a === array1 ? array2 : array1;

		return a.filter( function ( key ) {
			return array.contains( b, key );
		});
	},

	/**
	 * Keeps every element of `obj` for which `fn` evaluates to true
	 * 
	 * @method keep_if
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	keep_if : function ( obj, fn ) {
		if ( typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		var result = [],
		    remove = [];

		result = obj.filter( fn );
		remove = array.diff( obj, result );

		array.each( remove, function ( i, idx ) {
			array.remove( obj, array.index( obj, i ) );
		});

		return obj;
	},

	/**
	 * Returns the keys in an "Associative Array"
	 *
	 * @method keys
	 * @param  {Mixed} obj Array or Object to extract keys from
	 * @return {Array}     Array of the keys
	 */
	keys : function () {
		if ( typeof Object.keys === "function" ) {
			return function ( obj ) {
				return Object.keys( obj );
			};
		}
		else {
			return function ( obj ) {
				var keys = [];

				utility.iterate( obj, function ( v, k ) {
					keys.push( k );
				});

				return keys;
			};
		}
	}(),

	/**
	 * Returns the last index of the Array
	 *
	 * @method last
	 * @param  {Array}  obj Array
	 * @param  {Number} arg [Optional] Negative offset from last index to return
	 * @return {Mixed}      Last index( s ) of Array
	 */
	last : function ( obj, arg ) {
		var n = obj.length - 1;

		if ( arg >= ( n + 1 ) ) {
			return obj;
		}
		else {
			return isNaN( arg ) || arg === 1 ? obj[n] : array.limit( obj, n - --arg, n );
		}
	},

	/**
	 * Returns a limited range of indices from the Array
	 * 
	 * @method limit
	 * @param  {Array}  obj    Array to iterate
	 * @param  {Number} start  Starting index
	 * @param  {Number} offset Number of indices to return
	 * @return {Array}         Array of indices
	 */
	limit : function ( obj, start, offset ) {
		var result = [],
		    i      = start - 1,
		    nth    = start + offset,
		    max    = obj.length;

		if ( max > 0 ) {
			while ( ++i < nth && i < max ) {
				result.push( obj[i] );
			}
		}

		return result;
	},

	/**
	 * Finds the maximum value in an Array
	 * 
	 * @method max
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	max : function ( obj ) {
		return array.last( obj.sort( array.sort ) );
	},

	/**
	 * Finds the mean of an Array ( of numbers )
	 * 
	 * @method mean
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Mean of the Array ( float or integer )
	 */
	mean : function ( obj ) {
		return obj.length > 0 ? ( array.sum( obj ) / obj.length ) : undefined;
	},

	/**
	 * Finds the median value of an Array ( of numbers )
	 *
	 * @method median
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Median number of the Array ( float or integer )
	 */
	median : function ( obj ) {
		var nth    = obj.length,
		    mid    = number.round( nth / 2, "down" ),
		    sorted = obj.sort( array.sort );

		return number.odd( nth ) ? sorted[mid] : ( ( sorted[mid - 1] + sorted[mid] ) / 2 );
	},

	/**
	 * Merges `arg` into `obj`
	 * 
	 * @param  {Array} obj Array to receive indices
	 * @param  {Array} arg Array to merge
	 * @return {Array}     obj
	 */
	merge : function ( obj, arg ) {
		array.each( arg, function ( i ) {
			obj.push( i );
		});

		return obj;
	},

	/**
	 * Finds the minimum value in an Array
	 * 
	 * @method min
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Number, String, etc.
	 */
	min : function ( obj ) {
		return obj.sort( array.sort )[0];
	},

	/**
	 * Mingles Arrays and returns a 2D Array
	 *
	 * @method mingle
	 * @param  {Array} obj1 Array to mingle
	 * @param  {Array} obj2 Array to mingle
	 * @return {Array}      2D Array
	 */
	mingle : function ( obj1, obj2 ) {
		var result;

		result = obj1.map( function ( i, idx ) {
			return [i, obj2[idx]];
		});

		return result;
	},

	/**
	 * Finds the mode value of an Array
	 * 
	 * @method mode
	 * @param  {Array} obj Array to parse
	 * @return {Mixed}     Mode value of the Array
	 */
	mode : function ( obj ) {
		var values = {},
		    count  = 0,
		    nth    = 0,
		    mode   = [],
		    result;

		// Counting values
		array.each( obj, function ( i ) {
			!isNaN( values[i] ) ? ++values[i] : values[i] = 1;
		});

		// Finding the highest occurring count
		count = array.max( array.cast( values ) );

		// Finding values that match the count
		utility.iterate( values, function ( v, k ) {
			if ( v === count ) {
				mode.push( number.parse( k ) );
			}
		});

		// Determining the result
		nth = mode.length;

		if ( nth > 0 ) {
			result = nth === 1 ? mode[0] : mode;
		}

		return result;
	},

	/**
	 * Finds the range of the Array ( of numbers ) values
	 * 
	 * @method range
	 * @param  {Array} obj Array to parse
	 * @return {Number}    Range of the array ( float or integer )
	 */
	range : function ( obj ) {
		return array.max( obj ) - array.min( obj );
	},

	/**
	 * Searches a 2D Array `obj` for the first match of `arg` as a second index
	 * 
	 * @method rassoc
	 * @param  {Array} obj 2D Array to search
	 * @param  {Mixed} arg Primitive to find
	 * @return {Mixed}     Array or undefined
	 */
	rassoc : function ( obj, arg ) {
		var result;

		array.each( obj, function ( i, idx ) {
			if ( i[1] === arg ) {
				result = obj[idx];

				return false;
			}
		});

		return result;
	},

	/**
	 * Returns Array containing the items in `obj` for which `fn()` is not true
	 * 
	 * @method reject
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute against `obj` indices
	 * @return {Array}        Array of indices which fn() is not true
	 */
	reject : function ( obj, fn ) {
		return array.diff( obj, obj.filter( fn ) );
	},
	
	/**
	 * Replaces the contents of `obj` with `arg`
	 * 
	 * @method replace
	 * @param  {Array} obj Array to modify
	 * @param  {Array} arg Array to become `obj`
	 * @return {Array}     New version of `obj`
	 */
	replace : function ( obj, arg ) {
		array.remove( obj, 0, obj.length );
		array.each( arg, function ( i ) {
			obj.push( i );
		});

		return obj;
	},

	/**
	 * Removes indices from an Array without recreating it
	 *
	 * @method remove
	 * @param  {Array}  obj   Array to remove from
	 * @param  {Mixed}  start Starting index, or value to find within obj
	 * @param  {Number} end   [Optional] Ending index
	 * @return {Array}        Modified Array
	 */
	remove : function ( obj, start, end ) {
		if ( isNaN(start) ) {
			start = obj.index( start );
			if ( start === -1 ) return obj;
		}
		else {
			start = start || 0;
		}

		var length    = obj.length,
		    remaining = obj.slice( (end || start) + 1 || length );

		obj.length = start < 0 ? ( length + start ) : start;
		obj.push.apply( obj, remaining );

		return obj;
	},

	/**
	 * Deletes every element of `obj` for which `fn` evaluates to true
	 * 
	 * @method remove_if
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	remove_if : function ( obj, fn ) {
		if ( typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		var remove = [];

		remove = obj.filter( fn );
		array.each( remove, function ( i, idx ) {
			array.remove( obj, array.index ( obj, i ) );
		});

		return obj;
	},

	/**
	 * Deletes elements of `obj` until `fn` evaluates to false
	 * 
	 * @method remove_while
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to test indices against
	 * @return {Array}        Array
	 */
	remove_while : function ( obj, fn ) {
		if ( typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		var remove = [];

		array.each( obj, function ( i ) {
			if ( fn( i ) !== false) remove.push( i );
			else return false;
		});

		array.each( remove, function ( i, idx ) {
			array.remove( obj, array.index( obj, i) );
		});

		return obj;	
	},

	/**
	 * Returns the "rest" of `obj` from `arg`
	 * 
	 * @method rest
	 * @param  {Array}  obj Array to parse
	 * @param  {Number} arg [Optional] Start position of subset of `obj` ( positive number only )
	 * @return {Array}      Array of a subset of `obj`
	 */
	rest : function ( obj, arg ) {
		arg = arg || 1;

		if ( arg < 1 ) {
			arg = 1;
		}

		return array.limit( obj, arg, obj.length );
	},

	/**
	 * Finds the last index of `arg` in `obj`
	 * 
	 * @method rindex
	 * @param  {Array} obj Array to search
	 * @param  {Mixed} arg Primitive to find
	 * @return {Mixed}     Index or undefined
	 */
	rindex : function ( obj, arg ) {
		var result = -1;

		array.each( obj, function ( i, idx ) {
			if ( i === arg ) {
				result = idx;
			}
		});

		return result;
	},

	/**
	 * Returns new Array with `arg` moved to the first index
	 * 
	 * @method rotate
	 * @param  {Array}  obj Array to rotate
	 * @param  {Number} arg Index to become the first index, if negative the rotation is in the opposite direction
	 * @return {Array}      Newly rotated Array
	 */
	rotate : function ( obj, arg ) {
		var result = [],
		    nth    = obj.length;

		if ( arg === 0 ) {
			result = obj;
		}
		else {
			arg < 0 ? arg += nth : arg--;
			result = array.limit( obj, arg, nth );
			result = result.concat( array.limit( obj, 0, arg ) );
		}

		return result;
	},

	/**
	 * Generates a series Array
	 * 
	 * @method series
	 * @param  {Number} start  Start value the series
	 * @param  {Number} end    [Optional] The end of the series
	 * @param  {Number} offset [Optional] Offset for indices, default is 1
	 * @return {Array}         Array of new series
	 */
	series : function ( start, end, offset ) {
		start      = start  || 0;
		end        = end    || start;
		offset     = offset || 1;
		var result = [],
		    n      = -1,
		    nth    = Math.max( 0, Math.ceil( ( end - start ) / offset ) );

		while ( ++n < nth ) {
			result[n]  = start;
			start     += offset;
		}

		return result;
	},

	/**
	 * Splits an Array by divisor
	 * 
	 * @method split
	 * @param  {Array}  obj     Array to parse
	 * @param  {Number} divisor Integer to divide the Array by
	 * @return {Array}          Split Array
	 */
	split : function ( obj, divisor ) {
		var result  = [],
		    total   = obj.length,
		    nth     = Math.ceil( total / divisor ),
		    low     = Math.floor( total / divisor ),
		    lower   = Math.ceil( total / nth ),
		    lowered = false,
		    start   = 0,
		    i       = -1;

		// Finding the fold
		if ( number.diff( total, ( divisor * nth ) ) > nth ) {
			lower = total - ( low * divisor ) + low - 1;
		}

		while ( ++i < divisor ) {
			if ( !lowered && lower < divisor && i === lower ) {
				--nth;
				lowered = true;
			}

			if ( i > 0 ) {
				start = start + nth;
			}

			result.push( array.limit( obj, start, nth ) );
		}

		return result;
	},

	/**
	 * Sorts the Array by parsing values
	 * 
	 * @method sort
	 * @param  {Mixed} a Argument to compare
	 * @param  {Mixed} b Argument to compare
	 * @return {Boolean} Boolean indicating sort order
	 */
	sort : function ( a, b ) {
		var nums   = false,
		    result = 0;

		if ( !isNaN( a ) && !isNaN( b ) ) {
			nums = true;
		}

		a = nums ? number.parse( a ) : a.toString();
		b = nums ? number.parse( b ) : b.toString();

		if ( a < b ) {
			result = -1;
		}
		else if ( a > b ) {
			result = 1;
		}

		return result;
	},

	/**
	 * Gets the summation of an Array of numbers
	 * 
	 * @method sum
	 * @param  {Array} obj Array to sum
	 * @return {Number}    Summation of Array
	 */
	sum : function ( obj ) {
		var result = 0;

		if ( obj.length > 0 ) {
			result = obj.reduce( function ( prev, cur ) {
				return prev + cur;
			});
		}

		return result;
	},

	/**
	 * Takes the first `arg` indices from `obj`
	 * 
	 * @method take
	 * @param  {Array}  obj Array to parse
	 * @param  {Number} arg Offset from 0 to return
	 * @return {Array}      Subset of `obj`
	 */
	take : function ( obj, arg ) {
		return array.limit( obj, 0, arg );
	},

	/**
	 * Gets the total keys in an Array
	 *
	 * @method total
	 * @param  {Array} obj Array to find the length of
	 * @return {Number}    Number of keys in Array
	 */
	total : function ( obj ) {
		return array.indexed( obj ).length;
	},

	/**
	 * Casts an Array to Object
	 * 
	 * @method toObject
	 * @param  {Array} ar Array to transform
	 * @return {Object}   New object
	 */
	toObject : function ( ar ) {
		var obj = {},
		    i   = ar.length;

		while ( i-- ) {
			obj[i.toString()] = ar[i];
		}

		return obj;
	},

	/**
	 * Returns an Array of unique indices of `obj`
	 * 
	 * @method unique
	 * @param  {Array} obj Array to parse
	 * @return {Array}     Array of unique indices
	 */
	unique : function ( obj, fn ) {
		var result = [];

		array.each( obj, function ( i ) {
			array.add( result, i );
		});

		return result;
	},

	/**
	 * Converts any arguments to Arrays, then merges elements of `obj` with corresponding elements from each argument
	 * 
	 * @method zip
	 * @param  {Array} obj  Array to transform
	 * @param  {Mixed} args Argument instance or Array to merge
	 * @return {Array}      Array
	 */
	zip : function ( obj, args ) {
		var result = [];

		// Preparing args
		if ( !(args instanceof Array) ) {
			args = typeof args === "object" ? array.cast( args ) : [args];
		}

		array.each( args, function ( i, idx ) {
			if ( !( i instanceof Array ) ) {
				this[idx] = [i];
			}
		});

		// Building result Array
		array.each( obj, function ( i, idx ) {
			result[idx] = [i];
			array.each( args, function ( x ) {
				result[idx].push( x[idx] || null );
			});
		});

		return result;
	}
};

/**
 * Cache for RESTful behavior
 *
 * @class cache
 * @namespace abaaso
 * @private
 */
var cache = {
	// Collection URIs
	items : {},

	/**
	 * Garbage collector for the cached items
	 *
	 * @method clean
	 * @return {Undefined} undefined
	 */
	clean : function () {
		return utility.iterate( cache.items, function ( v, k ) {
			if ( cache.expired( k ) ) {
				cache.expire( k );
			}
		});
	},

	/**
	 * Expires a URI from the local cache
	 * 
	 * Events: expire    Fires when the URI expires
	 *
	 * @method expire
	 * @param  {String}  uri    URI of the local representation
	 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
	 * @return {Undefined}      undefined
	 */
	expire : function ( uri, silent ) {
		silent = ( silent === true );
		if ( cache.items[uri] !== undefined ) {
			delete cache.items[uri];

			if ( !silent ) {
				observer.fire( uri, "beforeExpire, expire, afterExpire" );
			}

			return true;
		}
		else {
			return false;
		}
	},

	/**
	 * Determines if a URI has expired
	 *
	 * @method expired
	 * @param  {Object} uri Cached URI object
	 * @return {Boolean}    True if the URI has expired
	 */
	expired : function ( uri ) {
		var item = cache.items[uri];

		return item !== undefined && item.expires !== undefined && item.expires < new Date();
	},

	/**
	 * Returns the cached object {headers, response} of the URI or false
	 *
	 * @method get
	 * @param  {String}  uri    URI/Identifier for the resource to retrieve from cache
	 * @param  {Boolean} expire [Optional] If 'false' the URI will not expire
	 * @param  {Boolean} silent [Optional] If 'true', the event will not fire
	 * @return {Mixed}          URI Object {headers, response} or False
	 */
	get : function ( uri, expire ) {
		uri    = utility.parse( uri ).href;
		expire = ( expire !== false );

		if ( cache.items[uri] === undefined ) {
			return false;
		}

		if ( expire && cache.expired( uri ) ) {
			cache.expire( uri );

			return false;
		}

		return utility.clone( cache.items[uri] );
	},

	/**
	 * Sets, or updates an item in cache.items
	 *
	 * @method set
	 * @param  {String} uri      URI to set or update
	 * @param  {String} property Property of the cached URI to set
	 * @param  {Mixed} value     Value to set
	 * @return {Mixed}           URI Object {headers, response} or undefined
	 */
	set : function ( uri, property, value ) {
		uri = utility.parse( uri ).href;

		if ( cache.items[uri] === undefined ) {
			cache.items[uri] = {};
			cache.items[uri].permission = 0;
		}

		property === "permission" ? cache.items[uri].permission |= value
		                          : (property === "!permission" ? cache.items[uri].permission &= ~value
		                                                        : cache.items[uri][property]   =  value);

		return cache.items[uri];
	}
};

/**
 * Client properties and methods
 *
 * @class client
 * @namespace abaaso
 */
var client = {
	activex : function () {
		var result = false;

		if ( typeof ActiveXObject !== "undefined" ) {
			try {
				new ActiveXObject( "Microsoft.XMLHTTP" );
				result = true;
			}
			catch ( e ) {
				void 0;
			}
		}

		return result;
	}(),
	android : function () {
		return !server && regex.android.test( navigator.userAgent );
	}(),
	blackberry : function () {
		return !server && regex.blackberry.test( navigator.userAgent );
	}(),
	chrome : function () {
		return !server && regex.chrome.test( navigator.userAgent );
	}(),
	firefox : function () {
		return !server && regex.firefox.test( navigator.userAgent );
	}(),
	ie : function () {
		return !server && regex.ie.test( navigator.userAgent );
	}(),
	ios : function () {
		return !server && regex.ios.test( navigator.userAgent );
	}(),
	linux : function () {
		return !server && regex.linux.test( navigator.userAgent );
	}(),
	mobile : function () {
		return !server && ( /blackberry|iphone|webos/i.test( navigator.userAgent ) || ( regex.android.test( navigator.userAgent ) && ( this.client.size.height < 720 || this.client.size.width < 720 ) ) );
	},
	playbook: function () {
		return !server && regex.playbook.test( navigator.userAgent );
	}(),
	opera : function () {
		return !server && regex.opera.test( navigator.userAgent );
	}(),
	osx : function () {
		return !server && regex.osx.test( navigator.userAgent );
	}(),
	safari : function () {
		return !server && regex.safari.test( navigator.userAgent.replace(/chrome.*/i, "") );
	}(),
	tablet : function () {
		return !server && ( /ipad|playbook|webos/i.test( navigator.userAgent ) || ( regex.android.test( navigator.userAgent ) && ( this.client.size.width >= 720 || this.client.size.width >= 720 ) ) );
	},
	webos : function () {
		return !server && regex.webos.test( navigator.userAgent );
	}(),
	windows : function () {
		return !server && regex.windows.test( navigator.userAgent );
	}(),
	version : function () {
		var version = 0;

		switch ( true ) {
			case this.chrome:
				version = navigator.userAgent.replace( /(.*chrome\/|safari.*)/gi, "" );
				break;
			case this.firefox:
				version = navigator.userAgent.replace( /(.*firefox\/)/gi, "" );
				break;
			case this.ie:
				version = number.parse( navigator.userAgent.replace(/(.*msie|;.*)/gi, ""), 10 );
				if ( document.documentMode < version ) version = document.documentMode;
				break;
			case this.opera:
				version = navigator.userAgent.replace( /(.*version\/|\(.*)/gi, "" );
				break;
			case this.safari:
				version = navigator.userAgent.replace( /(.*version\/|safari.*)/gi, "" );
				break;
			default:
				version = ( navigator !== undefined ) ? navigator.appVersion : 0;
		}

		version = number.parse( string.trim( version ) );

		if ( isNaN( version ) ) version = 0;

		return version;
	},

	/**
	 * Quick way to see if a URI allows a specific verb
	 *
	 * @method allows
	 * @param  {String} uri  URI to query
	 * @param  {String} verb HTTP verb
	 * @return {Boolean}     `true` if the verb is allowed, undefined if unknown
	 */
	allows : function ( uri, verb ) {
		if ( string.isEmpty( uri ) || string.isEmpty( verb ) ) {
			throw Error( label.error.invalidArguments );
		}

		uri        = utility.parse( uri ).href;
		verb       = verb.toLowerCase();
		var result = false,
		    bit    = 0;

		if ( !cache.get( uri, false ) ) {
			result = undefined;
		}
		else {
			if ( regex.del.test( verb ) ) {
				bit = 1;
			}
			else if ( regex.get_headers.test( verb ) ) {
				bit = 4;
			}
			else if ( regex.put_post.test( verb ) ) {
				bit = 2;
			}
			else if ( regex.patch.test( verb ) ) {
				bit = 8;
			}

			result = Boolean( client.permissions( uri, verb ).bit & bit );
		}

		return result;
	},

	/**
	 * Gets bit value based on args
	 *
	 * @method bit
	 * @param  {Array} args Array of commands the URI accepts
	 * @return {Number} To be set as a bit
	 * @private
	 */
	bit : function ( args ) {
		var result = 0;

		array.each( args, function ( a ) {
			switch ( a.toLowerCase() ) {
				case "head":
				case "get":
				case "options":
					result |= 4;
					break;
				case "post":
				case "put":
					result |= 2;
					break;
				case "patch":
					result |= 8;
					break;
				case "delete":
					result |= 1;
					break;
			}
		});

		return result;
	},

	/**
	 * Determines if a URI is a CORS end point
	 * 
	 * @method cors
	 * @param  {String} uri  URI to parse
	 * @return {Boolean}     True if CORS
	 */
	cors : function ( uri ) {
		return ( !server && uri.indexOf( "//" ) > -1 && uri.indexOf( "//" + location.host ) === -1 );
	},

	/**
	 * Caches the headers from the XHR response
	 * 
	 * @method headers
	 * @param  {Object} xhr  XMLHttpRequest Object
	 * @param  {String} uri  URI to request
	 * @param  {String} type Type of request
	 * @return {Object}      Cached URI representation
	 * @private
	 */
	headers : function ( xhr, uri, type ) {
		var headers = string.trim( xhr.getAllResponseHeaders() ).split( "\n" ),
		    items   = {},
		    o       = {},
		    allow   = null,
		    expires = new Date(),
		    cors    = client.cors( uri );

		array.each( headers, function ( i, idx ) {
			var header, value;

			value         = i.replace( regex.header_value_replace, "" );
			header        = i.replace( regex.header_replace, "" );
			header        = string.unhyphenate( header, true ).replace( /\s+/g, "-" );
			items[header] = value;

			if ( allow === null ) {
				if ( ( !cors && regex.allow.test( header) ) || ( cors && regex.allow_cors.test( header) ) ) {
					allow = value;
				}
			}
		});

		switch ( true ) {
			case regex.no.test( items["Cache-Control"] ):
			case regex.no.test( items["Pragma"] ):
				break;
			case items["Cache-Control"] !== undefined && regex.number_present.test( items["Cache-Control"] ):
				expires = expires.setSeconds( expires.getSeconds() + number.parse( regex.number_present.exec( items["Cache-Control"] )[0], 10 ) );
				break;
			case items["Expires"] !== undefined:
				expires = new Date( items["Expires"] );
				break;
			default:
				expires = expires.setSeconds( expires.getSeconds() + $.expires );
		}

		o.expires    = expires;
		o.headers    = items;
		o.permission = client.bit( allow !== null ? string.explode( allow ) : [type] );

		if ( type === "get" ) {
			cache.set( uri, "expires",    o.expires );
			cache.set( uri, "headers",    o.headers );
			cache.set( uri, "permission", o.permission );
		}

		return o;
	},

	/**
	 * Parses an XHR response
	 * 
	 * @param  {Object} xhr  XHR Object
	 * @param  {String} type [Optional] Content-Type header value
	 * @return {Mixed}       Array, Boolean, Document, Number, Object or String
	 */
	parse : function ( xhr, type ) {
		type = type || "";
		var result, obj;

		switch ( true ) {
			case ( regex.json_maybe.test( type ) || string.isEmpty( type ) ) && regex.json_wrap.test( xhr.responseText ) && Boolean( obj = json.decode( xhr.responseText, true ) ):
			case ( regex.json_maybe.test( type ) || string.isEmpty( type ) ) && ( obj = regex.jsonp_wrap.exec( xhr.responseText ) ) && obj !== null && Boolean( obj = json.decode( obj[2], true ) ):
				result = obj;
				break;
			case ( regex.xml.test( type ) && string.isEmpty( xhr.responseText  ) && xhr.responseXML !== undefined && xhr.responseXML !== null ):
				result = xml.decode( xhr.responseXML.xml !== undefined ? xhr.responseXML.xml : xhr.responseXML );
				break;
			case regex.is_xml.test( xhr.responseText ):
				result = xml.decode( xhr.responseText );
				break;
			default:
				result = xhr.responseText;
		}

		return result;
	},

	/**
	 * Returns the permission of the cached URI
	 *
	 * @method permissions
	 * @param  {String} uri URI to query
	 * @return {Object}     Contains an Array of available commands, the permission bit and a map
	 */
	permissions : function ( uri ) {
		var cached = cache.get( uri, false ),
		    bit    = !cached ? 0 : cached.permission,
		    result = {allows: [], bit: bit, map: {partial: 8, read: 4, write: 2, "delete": 1, unknown: 0}};

		if ( bit & 1) {
			result.allows.push( "DELETE" );
		}

		if ( bit & 2) {
			result.allows.push( "POST" );
			result.allows.push( "PUT" );
		}

		if ( bit & 4) {
			result.allows.push( "GET" );
		}

		if ( bit & 8) {
			result.allows.push( "PATCH" );
		}

		return result;
	},

	/**
	 * Creates a JSONP request
	 *
	 * @method jsonp
	 * @param  {String}   uri     URI to request
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    Custom JSONP handler parameter name, default is "callback"; or custom headers for GET request ( CORS )
	 * @return {Object}           Promise
	 */
	jsonp : function ( uri, success, failure, args ) {
		var deferred = promise.factory(),
		    callback, cbid, s;

		// Utilizing the sugar if namespace is not global
		if ( external === undefined ) {
			if ( global.abaaso === undefined ) utility.define( "abaaso.callback", {}, global );

			external = "abaaso";
		}

		switch ( true ) {
			case args === undefined:
			case args === null:
			case args instanceof Object && ( args.callback === null || args.callback === undefined ):
			case typeof args === "string" && string.isEmpty( args ):
				callback = "callback";
				break;
			case args instanceof Object && args.callback !== undefined:
				callback = args.callback;
				break;
			default:
				callback = "callback";
		}

		deferred.then( function (arg ) {
			if ( typeof success === "function") {
				success( arg );
			}
		}, function ( e ) {
			if ( typeof failure === "function") {
				failure( e );
			}

			throw e;
		});

		do cbid = utility.genId().slice( 0, 10 );
		while ( global.abaaso.callback[cbid] !== undefined );

		uri = uri.replace( callback + "=?", callback + "=" + external + ".callback." + cbid );

		global.abaaso.callback[cbid] = function ( arg ) {
			clearTimeout( utility.timer[cbid] );
			delete utility.timer[cbid];
			delete global.abaaso.callback[cbid];
			deferred.resolve( arg );
			element.destroy( s );
		};

		s = element.create( "script", {src: uri, type: "text/javascript"}, $( "head" )[0] );
		
		utility.defer( function () {
			deferred.reject( undefined );
		}, 30000, cbid );

		return deferred;
	},

	/**
	 * Creates an XmlHttpRequest to a URI ( aliased to multiple methods )
	 *
	 * Events: before[type]          Fires before the XmlHttpRequest is made, type specific
	 *         failed[type]          Fires on error
	 *         progress[type]        Fires on progress
	 *         progressUpload[type]  Fires on upload progress
	 *         received[type]        Fires on XHR readystate 2
	 *         timeout[type]         Fires when XmlHttpRequest times out
	 *
	 * @method request
	 * @param  {String}   uri     URI to query
	 * @param  {String}   type    Type of request ( DELETE/GET/POST/PUT/HEAD )
	 * @param  {Function} success A handler function to execute when an appropriate response been received
	 * @param  {Function} failure [Optional] A handler function to execute on error
	 * @param  {Mixed}    args    [Optional] Data to send with the request
	 * @param  {Object}   headers [Optional] Custom request headers ( can be used to set withCredentials )
	 * @param  {Number}   timeout [Optional] Timeout in milliseconds, default is 30000
	 * @return {Object}           Promise
	 * @private
	 */
	request : function ( uri, type, success, failure, args, headers, timeout ) {
		timeout = timeout || 30000;
		var cors, xhr, payload, cached, typed, contentType, doc, ab, blob, deferred, deferred2;

		if ( regex.put_post.test( type ) && args === undefined ) {
			throw Error( label.error.invalidArguments );
		}

		uri          = utility.parse( uri ).href;
		type         = type.toLowerCase();
		headers      = headers instanceof Object ? headers : null;
		cors         = client.cors( uri );
		xhr          = ( client.ie && client.version < 10 && cors ) ? new XDomainRequest() : ( !client.ie || ( client.version > 8 || type !== "patch")  ? new XMLHttpRequest() : new ActiveXObject( "Microsoft.XMLHTTP" ) );
		payload      = ( regex.put_post.test( type ) || regex.patch.test( type ) ) && args !== undefined ? args : null;
		cached       = type === "get" ? cache.get( uri ) : false;
		typed        = type.capitalize();
		contentType  = null;
		doc          = ( typeof Document !== "undefined" );
		ab           = ( typeof ArrayBuffer !== "undefined" );
		blob         = ( typeof Blob !== "undefined" );
		deferred     = promise.factory();

		// Using a promise to resolve request
		deferred2 = deferred.then( function ( arg ) {
			if ( typeof success === "function" ) {
				success.call( uri, arg, xhr );
			}

			xhr = null;
		}, function ( e ) {
			if ( typeof failure === "function" ) {
				failure.call( uri, e, xhr );
			}

			xhr = null;

			throw e;
		});

		uri.fire( "before" + typed );

		if ( !cors && !regex.get_headers.test( type ) && client.allows( uri, type ) === false ) {
			xhr.status = 405;
			deferred.reject( null );

			return uri.fire( "failed" + typed, null, xhr );
		}

		if ( type === "get" && Boolean( cached ) ) {
			// Decorating XHR for proxy behavior
			if ( server ) {
				xhr.readyState  = 4;
				xhr.status      = 200;
				xhr._resheaders = cached.headers;
			}

			deferred.resolve( cached.response );
			uri.fire( "afterGet", cached.response, xhr );
		}
		else {
			xhr[typeof xhr.onreadystatechange !== "undefined" ? "onreadystatechange" : "onload"] = function ( e ) {
				client.response( xhr, uri, type, deferred );
			};

			// Setting timeout
			try {
				if ( xhr.timeout !== undefined ) {
					xhr.timeout = timeout;
				}
			}
			catch ( e ) {
				void 0;
			}

			// Setting events
			if ( xhr.ontimeout  !== undefined ) {
				xhr.ontimeout = function ( e ) {
					uri.fire( "timeout"  + typed, e, xhr );
				};
			}

			if ( xhr.onprogress !== undefined ) {
				xhr.onprogress = function (e) {
					uri.fire( "progress" + typed, e, xhr );
				};
			}

			if ( xhr.upload !== undefined && xhr.upload.onprogress !== undefined ) {
				xhr.upload.onprogress = function ( e ) {
					uri.fire( "progressUpload" + typed, e, xhr );
				};
			}

			xhr.open( type.toUpperCase(), uri, true );

			// Setting Content-Type value
			if ( headers !== null && headers.hasOwnProperty( "Content-Type" ) ) {
				contentType = headers["Content-Type"];
			}

			if ( cors && contentType === null ) {
				contentType = "text/plain";
			}

			// Transforming payload
			if ( payload !== null ) {
				if ( payload.hasOwnProperty( "xml" ) ) {
					payload = payload.xml;
				}

				if ( doc && payload instanceof Document ) {
					payload = xml.decode( payload );
				}

				if ( typeof payload === "string" && regex.is_xml.test( payload ) ) {
					contentType = "application/xml";
				}

				if ( !( ab && payload instanceof ArrayBuffer ) && !( blob && payload instanceof Blob ) && payload instanceof Object ) {
					contentType = "application/json";
					payload = json.encode( payload );
				}

				if ( contentType === null && ((ab && payload instanceof ArrayBuffer) || (blob && payload instanceof Blob)) ) {
					contentType = "application/octet-stream";
				}

				if ( contentType === null ) {
					contentType = "application/x-www-form-urlencoded; charset=UTF-8";
				}
			}

			// Setting headers (using typeof for PATCH support in IE8)
			if ( typeof xhr.setRequestHeader !== "undefined" ) {
				if ( typeof cached === "object" && cached.headers.hasOwnProperty( "ETag" ) ) {
					xhr.setRequestHeader( "ETag", cached.headers.ETag );
				}

				if ( headers === null ) {
					headers = {};
				}

				if ( contentType !== null ) {
					headers["Content-Type"] = contentType;
				}

				if ( headers.hasOwnProperty( "callback" ) ) {
					delete headers.callback;
				}

				utility.iterate( headers, function ( v, k ) {
					if ( v !== null && k !== "withCredentials") {
						xhr.setRequestHeader( k, v );
					}
				});
			}

			// Cross Origin Resource Sharing ( CORS )
			if ( typeof xhr.withCredentials === "boolean" && headers !== null && typeof headers.withCredentials === "boolean" ) {
				xhr.withCredentials = headers.withCredentials;
			}

			// Firing event & sending request
			payload !== null ? xhr.send( payload ) : xhr.send();
		}

		return deferred2;
	},

	/**
	 * Caches the URI headers & response if received, and fires the relevant events
	 *
	 * If abaaso.state.header is set, an application state change is possible
	 *
	 * Permissions are handled if the ACCEPT header is received; a bit is set on the cached
	 * resource
	 *
	 * Events: after[type]  Fires after the XmlHttpRequest response is received, type specific
	 *         reset        Fires if a 206 response is received
	 *         failure      Fires if an exception is thrown
	 *         headers      Fires after a possible state change, with the headers from the response
	 *
	 * @method response
	 * @param  {Object} xhr      XMLHttpRequest Object
	 * @param  {String} uri      URI to query
	 * @param  {String} type     Type of request
	 * @param  {Object} deferred Promise to reconcile with the response
	 * @return {Undefined}       undefined
	 * @private
	 */
	response : function ( xhr, uri, type, deferred ) {
		var typed    = string.capitalize( type.toLowerCase() ),
		    l        = location,
		    xhrState = null,
		    xdr      = client.ie && xhr.readyState === undefined,
		    exception, o, r, t, x, redirect;

		// server-side exception handling
		exception = function ( e, xhr ) {
			deferred.reject( e );
			error( e, arguments, this, true );
			uri.fire( "failed" + typed, client.parse( xhr ), xhr );
		};

		if ( !xdr && xhr.readyState === 2) {
			uri.fire( "received" + typed, null, xhr );
		}
		else if ( !xdr && xhr.readyState === 4 ) {
			switch ( xhr.status ) {
				case 200:
				case 201:
				case 202:
				case 203:
				case 204:
				case 205:
				case 206:
					// Caching headers
					o = client.headers( xhr, uri, type );
					uri.fire( "headers", o.headers, xhr );

					if ( type === "head" ) {
						deferred.resolve( o.headers );

						return uri.fire( "afterHead", o.headers );
					}
					else if ( type === "options" ) {
						deferred.resolve( o.headers );

						return uri.fire( "afterOptions", o.headers );
					}
					else if ( type !== "delete" ) {
						if ( regex.http_body.test( xhr.status ) ) {
							t = o.headers["Content-Type"] || "";
							r = client.parse( xhr, t );

							if ( r === undefined ) {
								throw Error( label.error.serverError );
							}
						}

						if ( type === "get" ) {
							cache.set( uri, "response", ( o.response = utility.clone( r ) ) );
						}
						else {
							cache.expire( uri, true );
						}
					}
					else if ( type === "delete" ) {
						cache.expire( uri, true );
					}

					// Application state change triggered by hypermedia ( HATEOAS )
					if ( state.getHeader() !== null && Boolean( xhrState = o.headers[state.getHeader()]) && state.current !== xhrState ) {
						state.setCurrent( state );
					}

					switch ( xhr.status ) {
						case 200:
						case 202:
						case 203:
						case 206:
							deferred.resolve( r );
							uri.fire( "after" + typed, r, xhr );
							break;
						case 201:
							if ( ( o.headers.Location === undefined || string.isEmpty ( o.headers.Location ) ) && !string.isUrl ( r ) ) {
								exception( Error( label.error.invalidArguments ), xhr );
							}
							else {
								redirect = string.trim ( o.headers.Location || r );
								client.request( redirect, "GET", function ( arg ) {
									deferred.resolve ( arg );
									uri.fire( "after" + typed, arg, xhr );
								}, function ( e ) {
									exception( e, xhr );
								});
								break;
							}
						case 204:
							deferred.resolve( null );
							uri.fire( "after" + typed, null, xhr );
							break;
						case 205:
							deferred.resolve( null );
							uri.fire( "reset", null, xhr );
							break;
					}
					break;
				case 401:
					exception( !server ? Error( label.error.serverUnauthorized ) : label.error.serverUnauthorized, xhr );
					break;
				case 403:
					cache.set( uri, "!permission", client.bit( [type] ) );
					exception( !server ? Error( label.error.serverForbidden ) : label.error.serverForbidden, xhr );
					break;
				case 405:
					cache.set( uri, "!permission", client.bit( [type] ) );
					exception( !server ? Error( label.error.serverInvalidMethod ) : label.error.serverInvalidMethod, xhr );
					break
				default:
					exception( !server ? Error( label.error.serverError ) : label.error.serverError, xhr );
			}

			try {
				xhr.onreadystatechange = null;
			}
			catch ( e ) {
				void 0;
			}
		}
		else if ( xdr ) {
			r = client.parse( xhr );
			cache.set( uri, "permission", client.bit( ["get"] ) );
			cache.set( uri, "response", r );
			deferred.resolve( r );
			uri.fire( "afterGet", r, xhr );
		}
	},


	/**
	 * Returns the visible area of the View
	 *
	 * @method size
	 * @return {Object} Describes the View {x: ?, y: ?}
	 */
	size : function () {
		var view = !server ? ( document.documentElement !== undefined ? document.documentElement : document.body ) : {clientHeight: 0, clientWidth: 0};

		return {height: view.clientHeight, width: view.clientWidth};
	}
};

/**
 * Cookie methods
 *
 * @class cookie
 * @namespace abaaso
 */
var cookie = {
	/**
	 * Expires a cookie if it exists
	 *
	 * @method expire
	 * @param  {String} name   Name of the cookie to expire
	 * @param  {String} domain [Optional] Domain to set the cookie for
	 * @param  {Boolea} secure [Optional] Make the cookie only accessible via SSL
	 * @return {String}        Name of the expired cookie
	 */
	expire : function ( name, domain, secure ) {
		if ( cookie.get( name ) !== undefined ) {
			cookie.set( name, "", "-1s", domain, secure );
		}

		return name;
	},

	/**
	 * Gets a cookie
	 *
	 * @method get
	 * @param  {String} name Name of the cookie to get
	 * @return {Mixed}       Cookie or undefined
	 */
	get : function ( name ) {
		return utility.coerce( cookie.list()[name] );
	},

	/**
	 * Gets the cookies for the domain
	 *
	 * @method list
	 * @return {Object} Collection of cookies
	 */
	list : function () {
		var result = {};

		if ( document.cookie !== undefined && !string.isEmpty( document.cookie ) ) {
			array.each( string.explode( document.cookie, ";" ), function ( i ) {
				var item = string.explode( i, "=" );

				result[decodeURIComponent( item[0] )] = decodeURIComponent( item[1] );
			});
		}

		return result;
	},

	/**
	 * Creates a cookie
	 *
	 * The offset specifies a positive or negative span of time as day, hour, minute or second
	 *
	 * @method set
	 * @param  {String} name   Name of the cookie to create
	 * @param  {String} value  Value to set
	 * @param  {String} offset A positive or negative integer followed by "d", "h", "m" or "s"
	 * @param  {String} domain [Optional] Domain to set the cookie for
	 * @param  {Boolea} secure [Optional] Make the cookie only accessible via SSL
	 * @return {Object}        The new cookie
	 */
	set : function ( name, value, offset, domain, secure ) {
		value      = ( value || "" ) + ";"
		offset     = offset || "";
		domain     = typeof domain === "string" ? ( " domain=" + domain + ";" ) : "";
		secure     = ( secure === true ) ? "; secure" : "";
		var expire = "",
		    span   = null,
		    type   = null,
		    types  = ["d", "h", "m", "s"],
		    regex  = new RegExp(),
		    i      = types.length;

		if ( !string.isEmpty( offset ) ) {
			while ( i-- ) {
				utility.compile( regex, types[i] );

				if ( regex.test( offset ) ) {
					type = types[i];
					span = number.parse( offset, 10 );
					break;
				}
			}

			if ( isNaN( span ) ) {
				throw Error( label.error.invalidArguments );
			}

			expire = new Date();

			switch ( type ) {
				case "d":
					expire.setDate( expire.getDate() + span );
					break;
				case "h":
					expire.setHours( expire.getHours() + span );
					break;
				case "m":
					expire.setMinutes( expire.getMinutes() + span );
					break;
				case "s":
					expire.setSeconds( expire.getSeconds() + span );
					break;
			}
		}

		if ( expire instanceof Date) {
			expire = " expires=" + expire.toUTCString() + ";";
		}

		document.cookie = ( string.trim( name.toString() ) + "=" + value + expire + domain + " path=/" + secure );

		return cookie.get( name );
	}
};

/**
 * DataStore
 *
 * RESTful behavior is supported, by setting the 'key' & 'uri' properties
 *
 * @class data
 * @namespace abaaso
 */
var data = {
	/**
	 * Decorates a data store on an Object
	 *
	 * @method decorator
	 * @param  {Object} obj  Object to decorate
	 * @param  {Mixed}  recs [Optional] Data to set with this.batch
	 * @param  {Object} args [Optional] Arguments to set on the store
	 * @return {Object}      Object to decorate
	 */
	decorator : function ( obj, recs, args ) {
		obj = utility.object( obj );
		utility.genId( obj );

		// Decorating observer if not present in prototype chain
		if ( typeof obj.fire !== "function" ) {
			observer.decorate( obj );
		}

		// Creating store
		obj.data = new DataStore( obj );

		if ( args instanceof Object ) {
			utility.merge( obj.data, args );
		}

		if ( recs !== null && typeof recs === "object" ) {
			obj.data.batch( "set", recs );
		}

		return obj;
	},

	// Inherited by data stores
	methods : {
		/**
		 * Batch sets or deletes data in the store
		 *
		 * Events: beforeDataBatch  Fires before the batch is queued
		 *         afterDataBatch   Fires after the batch is queued
		 *         failedDataBatch  Fires when an exception occurs
		 *
		 * @method batch
		 * @param  {String}  type    Type of action to perform ( set/del/delete )
		 * @param  {Mixed}   data    Array of keys or indices to delete, or Object containing multiple records to set
		 * @param  {Boolean} sync    [Optional] Syncs store with data, if true everything is erased
		 * @param  {Number}  chunk   [Optional] Size to chunk Array to batch set or delete
		 * @return {Object}          Promise
		 */
		batch : function ( type, data, sync, chunk ) {
			type    = type.toString().toLowerCase();
			sync    = ( sync === true );
			chunk   = chunk || 1000;

			if ( !regex.set_del.test( type ) || ( sync && regex.del.test( type ) ) || typeof data !== "object" ) {
				throw Error( label.error.invalidArguments );
			}

			var self     = this,
			    events   = ( this.events === true ),
			    r        = 0,
			    nth      = data.length,
			    f        = false,
			    deferred = promise.factory(),
			    complete, deferred2, failure, key, set, del, success, parsed;

			deferred2 = deferred.then( function ( arg ) {
				self.loaded = true;

				if ( regex.del.test( type ) ) {
					self.reindex();
				}

				if ( self.autosave ) {
					self.save();
				}

				array.each( self.datalists, function ( i ) {
					i.refresh( true );
				});

				if ( events ) {
					observer.fire( self.parentNode, "afterDataBatch", arg );
				}
			}, function ( e ) {
				if ( events ) {
					observer.fire( self.parentNode, "failedDataBatch", e );
				}

				throw e;
			});

			complete = function ( arg ) {
				deferred.resolve( arg );
			};

			failure = function ( arg ) {
				deferred.reject( arg );
			};

			set = function ( arg, key ) {
				var data     = utility.clone( arg ),
				    deferred = promise.factory(),
				    rec      = {};

				if ( typeof data.batch !== "function" ) {
					rec = data;
				}
				else {
					utility.iterate( data, function ( v, k ) {
						if ( !array.contains( self.collections, k ) ) rec[k] = v;
					});
				}

				if ( self.key !== null && rec[self.key] !== undefined ) {
					key = rec[self.key];
					delete rec[self.key];
				}

				deferred.then( function ( arg ) {
					if ( ++r === nth ) {
						complete( self.records );
					}
				}, function ( e ) {
					if ( !f ) {
						f = true;
						failure( e );
					}
				});

				if ( rec instanceof Array && self.uri !== null ) {
					self.generate( key, undefined )
					    .then( function ( arg ) {
					    	deferred.resolve( arg );
					     }, function ( e ) {
					    	deferred.reject( e );
					     });
				}
				else {
					self.set( key, rec, true )
					    .then( function ( arg ) {
					    	deferred.resolve( arg );
					     }, function ( e ) {
					    	deferred.reject( e );
					     });
				}
			};

			del = function ( i ) {
				var deferred = promise.factory();

				deferred.then( function ( arg ) {
					if ( ++r === nth ) {
						complete( arg );
					}

					return arg;
				}, function ( arg ) {
					if ( !f ) {
						f = true;
						failure( arg );
					}

					return arg;
				});

				self.del( i, false, true )
				    .then( function ( arg ) {
				    	deferred.resolve( arg );
				     }, function ( e ) {
				    	deferred.reject( e );
				     });
			};

			if ( events ) {
				observer.fire( self.parentNode, "beforeDataBatch", data );
			}

			if ( sync ) {
				this.clear( sync );
			}

			if ( data.length === 0 ) {
				complete( [] );
			}
			else {
				if ( type === "set" ) {
					array.each( array.chunk( data, chunk ), function ( a, adx ) {
						utility.defer(function () {
							var offset = adx * chunk,
							    id;

							array.each( a, function ( i, idx ) {
								if ( array.contains ( self.ignore, i ) || array.contains ( self.leafs, i ) ) {
									id = i;
									i  = {};
								}

								if ( typeof i === "object" ) {
									set( i, id || utility.uuid() );
								}
								else if ( i.indexOf( "//" ) === -1 ) {
									// Relative path to store, i.e. a child
									if ( i.charAt( 0 ) !== "/" ) {
										i = self.uri + "/" + i;
									}

									// Root path, relative to store, i.e. a domain
									else if ( self.uri !== null && regex.root.test( i ) ) {
										parsed = utility.parse( self.uri );
										i      = parsed.protocol + "//" + parsed.host + i;
									}

									idx = i.replace( regex.not_endpoint, "" );

									if ( string.isEmpty( idx ) ) {
										return;
									}

									client.request( i, "GET", function ( arg ) {
										set( self.source === null ? arg : utility.walk( arg, self.source ), idx );
									}, failure, utility.merge( {withCredentials: self.credentials}, self.headers ) );
								}
								else {
									idx = i.replace( regex.not_endpoint, "" );

									if ( string.isEmpty( idx ) ) {
										return;
									}

									client.request( i, "GET", function ( arg ) {
										set( self.source === null ? arg : utility.walk( arg, self.source ), idx );
									}, failure, utility.merge( {withCredentials: self.credentials}, self.headers) );
								}
							});
						}, adx );
					});
				}
				else {
					array.each( data.sort( array.sort ).reverse(), function ( i ) {
						del( i );
					});
				}
			}

			return deferred2;
		},

		/**
		 * Clears the data object, unsets the uri property
		 *
		 * Events: beforeDataClear  Fires before the data is cleared
		 *         afterDataClear   Fires after the data is cleared
		 *
		 * @method clear
		 * @param  {Boolean} sync    [Optional] Boolean to limit clearing of properties
		 * @return {Object}          Data store
		 */
		clear : function ( sync ) {
			sync       = ( sync === true );
			var events = ( this.events === true );

			if ( !sync ) {
				if ( events ) {
					observer.fire( this.parentNode, "beforeDataClear" );
				}

				array.each( this.datalists, function ( i ) {
					i.teardown( true );
				});

				this.autosave    = false;
				this.callback    = null;
				this.collections = [];
				this.crawled     = false;
				this.credentials = null;
				this.datalists   = [];
				this.depth       = 0;
				this.events      = true;
				this.expires     = null;
				this.headers     = {Accept: "application/json"};
				this.ignore      = [];
				this.key         = null;
				this.keys        = {};
				this.leafs       = [];
				this.loaded      = false;
				this.maxDepth    = 0;
				this.pointer     = null;
				this.records     = [];
				this.recursive   = false;
				this.retrieve    = false;
				this.source      = null;
				this.total       = 0;
				this.views       = {};
				this.uri         = null;

				if ( events ) {
					observer.fire( this.parentNode, "afterDataClear" );
				}
			}
			else {
				this.collections = [];
				this.crawled     = false;
				this.keys        = {};
				this.loaded      = false;
				this.records     = [];
				this.total       = 0;
				this.views       = {};

				array.each( this.datalists, function ( i ) {
					i.refresh( true, true );
				});
			}

			return this;
		},

		/**
		 * Crawls a record's properties and creates data stores when URIs are detected
		 *
		 * Events: afterDataRetrieve  Fires after the store has retrieved all data from crawling
		 *         failedDataRetrieve Fires if an exception occurs
		 * 
		 * @method crawl
		 * @param  {Mixed}  arg Record, key or index
		 * @return {Object}     Promise
		 */
		crawl : function ( arg ) {
			var self     = this,
			    events   = ( this.events === true ),
			    record   = ( arg instanceof Object ) ? arg : this.get( arg ),
			    uri      = this.uri === null ? "" : this.uri,
			    deferred = promise.factory(),
			    i        = 0,
			    nth      = 0,
			    build, complete, deferred2, setup;

			if ( record === undefined ) {
				throw Error( label.error.invalidArguments );
			}

			this.crawled = true;

			deferred2 = deferred.then( function ( arg ) {
				return arg;
			});

			/**
			 * Concats URIs together
			 * 
			 * @method build
			 * @param  {String} entity Entity URI
			 * @param  {String} store  Data store URI
			 * @return {String}        URI
			 */
			build = function ( entity, store ) {
				var result = "",
				    parsed;

				if ( /\/\//.test( entity ) ) {
					result = entity;
				}
				else if ( entity.charAt( 0 ) === "/" && store.charAt( 0 ) !== "/" ) {
					parsed = utility.parse( store );
					result = parsed.protocol + "//" + parsed.host + entity;
				}
				else result = entity;

				return result;
			};

			/**
			 * Crawl complete handler
			 * 
			 * @method complete
			 * @return {Undefined} undefined
			 */
			complete = function () {
				if ( ++i === nth ) {
					deferred.resolve( nth );
				}
			};

			/**
			 * Sets up a data store
			 *
			 * Possibly a subset of the collection, so it relies on valid URI paths
			 * 
			 * @method setup
			 * @param  {String} key Record key
			 * @return {Object}     Data store
			 */
			setup = function ( key, self ) {
				var obj = {};

				if ( !array.contains( self.collections, key ) ) {
					self.collections.push( key );
				}

				obj = data.decorator( {id: record.key + "-" + key}, null, {key: self.key, pointer: self.pointer, source: self.source, ignore: utility.clone( self.ignore ), leafs: utility.clone( self.leafs ), depth: self.depth + 1, maxDepth: self.maxDepth} );
				obj.data.headers = utility.merge( obj.data.headers, self.headers );

				if ( !array.contains( self.leafs, key ) && self.recursive && self.retrieve && ( obj.data.maxDepth === 0 || obj.data.depth < obj.data.maxDepth ) ) {
					obj.data.recursive = true;
					obj.data.retrieve  = true;
				}

				return obj;
			};

			// Depth of recursion is controled by `maxDepth`
			utility.iterate( record.data, function ( v, k ) {
				var deferred, store, parsed;

				if ( array.contains( self.ignore, k ) || array.contains( self.leafs, k ) || self.depth >= self.maxDepth || ( !( v instanceof Array ) && typeof v !== "string" ) ) {
					return;
				}

				nth      = array.cast( record.data ).length;
				deferred = promise.factory();
				deferred.then( function ( arg ) {
					if ( events ) {
						observer.fire( record.data[k], "afterDataRetrieve", arg );
					}

					complete();
				}, function ( e ) {
					if ( events) {
						observer.fire( record.data[k], "failedDataRetrieve", e );
					}

					complete();
				});

				if ( ( v instanceof Array ) && v.length > 0 ) {
					record.data[k] = setup( k, self );

					if ( typeof v[0] === "string" ) {
						array.each( v, function ( i, idx ) {
							v[idx] = build( i, uri );
						});
					}

					record.data[k].data.batch( "set", v, true, undefined )
					                   .then( function ( arg ) {
					                   		deferred.resolve( arg );
					                   	}, function ( e ) {
					                   		deferred.reject( e );
					                   	});
				}
				// If either condition is satisified it's assumed that "v" is a URI because it's not ignored
				else if ( v.charAt( 0 ) === "/" || v.indexOf( "//" ) > -1 ) {
					record.data[k] = setup( k, self );
					v = build( v, uri );
					record.data[k].data.setUri( v )
					                   .then( function ( arg ) {
					                   		deferred.resolve( arg );
					                   	}, function ( e ) {
					                   		deferred.reject( e );
					                   	});
				}
			});

			return deferred2;
		},

		/**
		 * Deletes a record based on key or index
		 *
		 * Events: beforeDataDelete  Fires before the record is deleted
		 *         afterDataDelete   Fires after the record is deleted
		 *         failedDataDelete  Fires if the store is RESTful and the action is denied
		 *
		 * @method del
		 * @param  {Mixed}   record  Record key or index
		 * @param  {Boolean} reindex Default is true, will re-index the data object after deletion
		 * @param  {Boolean} batch   [Optional] True if called by data.batch
		 * @return {Object}          Promise
		 */
		del : function ( record, reindex, batch ) {
			if ( record === undefined || !regex.number_string.test( typeof record ) ) {
				throw Error( label.error.invalidArguments );
			}

			reindex      = ( reindex !== false );
			batch        = ( batch === true );
			var self     = this,
			    events   = ( this.events === true ),
			    deferred = promise.factory(),
			    deferred2, key, args, uri, p;

			deferred2 = deferred.then( function ( arg ) {
				var record = self.get( arg.record );

				self.records.remove( self.keys[arg.key] );
				delete self.keys[arg.key];
				self.total--;
				self.views = {};

				utility.iterate( record.data, function ( v, k ) {
					if ( v === null ) {
						return;
					}

					if ( v.data !== undefined && typeof v.data.teardown === "function") {
						v.data.teardown();
					}
				});

				if ( arg.reindex ) {
					self.reindex();
				}

				if ( !batch ) {
					if ( self.autosave ) {
						self.save();
					}

					array.each( self.datalists, function ( i ) {
						i.del( record );
					});
				}

				if ( events ) {
					observer.fire( self.parentNode, "afterDataDelete", record );
				}
			}, function ( e ) {
				if ( events ) {
					observer.fire( self.parentNode, "failedDataDelete", e );
				}

				throw e;
			});

			if ( typeof record === "string" ) {
				key    = record;
				record = this.keys[key];

				if ( record === undefined ) {
					throw Error( label.error.invalidArguments );
				}
			}
			else {
				key = this.records[record];

				if ( key === undefined ) {
					throw Error( label.error.invalidArguments );
				}

				key = key.key;
			}

			args   = {key: key, record: record, reindex: reindex};

			if ( !batch && this.callback === null && this.uri !== null ) {
				uri = this.uri + "/" + key;
				p   = ( client.cors( uri ) || client.allows( uri, "delete" ) );
			}

			if ( events ) {
				observer.fire( self.parentNode, "beforeDataDelete", args );
			}

			if ( batch || this.callback !== null || this.uri === null ) {
				deferred.resolve( args );
			}
			else if ( regex.true_undefined.test( p ) ) {
				client.request(uri, "DELETE", function ( arg ) {
					deferred.resolve( args );
				}, function ( e ) {
					deferred.reject( e );
				}, utility.merge( {withCredentials: this.credentials}, this.headers) );
			}
			else {
				deferred.reject( args );
			}

			return deferred2;
		},

		/**
		 * Exports a subset or complete record set of data store
		 * 
		 * @param  {Array} args   [Optional] Sub-data set of data store
		 * @param  {Array} fields [Optional] Fields to export, defaults to all
		 * @return {Array}        Records
		 */
		dump : function ( args, fields ) {
			args       = args || this.records;
			var self   = this,
			    custom = ( fields instanceof Array && fields.length > 0 ),
			    fn;

			if ( custom ) {
				fn = function ( i ) {
					var record = {};

					array.each( fields, function ( f ) {
						record[f] = f === self.key ? i.key : ( !array.contains( self.collections, f ) ? utility.clone( i.data[f] ) : i.data[f].data.uri );
					});

					return record;
				};
			}
			else {
				fn = function ( i ) {
					var record = {};

					record[self.key] = i.key;

					utility.iterate( i.data, function ( v, k ) {
						record[k] = !array.contains( self.collections, k ) ? utility.clone( v ) : v.data.uri;
					});

					return record;
				};
			}

			return args.map( fn );
		},

		/**
		 * Finds needle in the haystack
		 *
		 * @method find
		 * @param  {Mixed}  needle    String, Number, RegExp Pattern or Function
		 * @param  {String} haystack  [Optional] Commma delimited string of the field( s ) to search
		 * @param  {String} modifiers [Optional] Regex modifiers, defaults to "gi" unless value is null
		 * @return {Array}            Array of results
		 */
		find : function ( needle, haystack, modifiers ) {
			if ( needle === undefined ) {
				throw Error( label.error.invalidArguments );
			}

			var result = [],
			    keys   = [],
			    regex  = new RegExp(),
			    fn     = typeof needle === "function";

			// Blocking unnecessary ops
			if ( this.total === 0 ) {
				return result;
			}

			// Preparing parameters
			if ( !fn ) {
				needle = typeof needle === "string" ? string.explode( needle ) : [needle];

				if ( modifiers === undefined || string.isEmpty( modifiers ) ) {
					modifiers = "gi";
				}
				else if ( modifiers === null ) {
					modifiers = "";
				}
			}

			haystack = typeof haystack === "string" ? string.explode( haystack ) : null;

			// No haystack, testing everything
			if ( haystack === null ) {
				array.each( this.records, function ( r ) {
					if ( !fn ) {
						utility.iterate( r.data, function ( v, k ) {
							if ( array.contains( keys, r.key ) ) {
								return false;
							}

							if ( v === null || typeof v.data === "object" ) {
								return;
							}

							array.each( needle, function ( n ) {
								utility.compile( regex, n, modifiers );

								if ( regex.test( v ) ) {
									keys.push( r.key );
									result.push( r );

									return false;
								}
							});
						});
					}
					else if ( needle( r ) === true ) {
						keys.push( r.key );
						result.push( r );
					}
				});
			}
			// Looking through the haystack
			else {
				array.each( this.records, function ( r ) {
					array.each( haystack, function ( h ) {
						if ( array.contains( keys, r.key ) ) {
							return false;
						}

						if ( r.data[h] === undefined || typeof r.data[h].data === "object" ) {
							return;
						}

						if ( !fn ) {
							array.each( needle, function ( n ) {
								utility.compile( regex, n, modifiers );

								if ( regex.test( r.data[h] ) ) {
									keys.push( r.key );
									result.push( r );

									return false;
								}
							});
						}
						else if ( needle( r.data[h] ) === true ) {
							keys.push( r.key );
							result.push( r );

							return false;
						}
					});
				});
			}

			return result;
		},

		/**
		 * Generates a micro-format form from a record
		 * 
		 * If record is null, an empty form based on the first record is generated.
		 * The submit action is data.set() which triggers a POST or PUT
		 * from the data store.
		 * 
		 * @method form
		 * @param  {Mixed}   record null, record, key or index
		 * @param  {Object}  target Target HTML Element
		 * @param  {Boolean} test   [Optional] Test form before setting values
		 * @return {Object}         Generated HTML form
		 */
		form : function ( record, target, test ) {
			test       = ( test !== false );
			var empty  = ( record === null ),
			    self   = this,
			    events = ( this.events === true ),
			    entity, obj, handler, structure, key, data;

			if ( empty ) {
				record = this.get( 0 );
			}
			else if ( !( record instanceof Object ) ) {
				record = this.get( record );
			}

			if ( record === undefined ) {
				throw Error( label.error.invalidArguments );
			}
			else if ( this.uri !== null && !client.cors ( this.uri ) && !client.allows( this.uri, "post" ) ) {
				throw Error( label.error.serverInvalidMethod );
			}

			key  = record.key;
			data = record.data;

			if ( target !== undefined ) {
				target = utility.object( target );
			}

			if ( this.uri !== null ) {
				entity = this.uri.replace( regex.not_endpoint, "" ).replace( /\?.*/, "" )

				if ( string.isDomain( entity ) ) {
					entity = entity.replace( /\..*/g, "" );
				}
			}
			else {
				entity = "record";
			}

			/**
			 * Button handler
			 * 
			 * @method handler
			 * @param  {Object} event Window event
			 * @return {Undefined}    undefined
			 */
			handler = function ( e ) {
				var form    = utility.target( e ).parentNode,
				    nodes   = $( "#" + form.id + " input" ),
				    entity  = nodes[0].name.match( /(.*)\[/ )[1],
				    result  = true,
				    newData = {};

				utility.stop( e );

				if ( test ) {
					result = element.validate( form );
				}

				switch ( result ) {
					case true:
						array.each( nodes, function ( i ) {
							if ( i.type !== undefined && regex.input_button.test( i.type ) ) {
								return;
							}

							utility.define( i.name.replace( "[", "." ).replace( "]", "" ), i.value, newData );
						});

						self.set( key, newData[entity] ).then(function (arg) {
							element.destroy( form );
						}, function (e) {
							element.destroy ( form );
						});
						break;
				}
			};

			/**
			 * Data structure in micro-format
			 * 
			 * @method structure
			 * @param  {Object} record Data store record
			 * @param  {Object} obj    Element
			 * @param  {String} name   Property
			 * @return {Undefined}     undefined
			 */
			structure = function ( record, obj, name ) {
				var x, id;

				utility.iterate( record, function ( v, k ) {
					if ( v instanceof Array ) {
						x = 0;
						array.each( v, function ( o ) {
							structure( o, obj, name + "[" + k + "][" + ( x++ ) + "]" );
						});
					}
					else if ( v instanceof Object ) {
						structure( v, obj, name + "[" + k + "]" );
					}
					else {
						id = ( name + "[" + k + "]" ).replace( /\[|\]/g, "" );
						obj.create( "label", {"for": id, innerHTML: string.capitalize( k )} );
						obj.create( "input", {id: id, name: name + "[" + k + "]", type: "text", value: empty ? "" : v} );
					}
				});
			};

			obj = element.create( "form", { style: "display:none;"}, target );
			structure( data, obj, entity );

			observer.add( element.create( "input", {type: "button", value: label.common.submit}, obj ), "click", function ( e ) {
				handler( e );
			});

			element.create( "input", {type: "reset", value: label.common.reset}, obj );
			element.css( obj, "display", "inherit" );

			return obj;  
		},

		/**
		 * Generates a RESTful store ( replacing a record ) when consuming an API end point
		 *
		 * @param  {Object} key Record key
		 * @param  {Mixed}  arg [Optional] Array or URI String
		 * @return {Object}     Promise
		 */
		generate : function ( key, arg ) {
			var self     = this,
			    deferred = promise.factory(),
			    params   = {},
			    recs     = null,
			    deferred2, fn, idx;
			
			params = {
				depth     : this.depth + 1,
				headers   : this.headers,
				ignore    : array.clone( this.ignore ),
				leafs     : array.clone( this.leafs ),
				key       : this.key,
				maxDepth  : this.maxDepth,
				pointer   : this.pointer,
				recursive : this.recursive,
				retrieve  : this.retrieve,
				source    : this.source
			};

			deferred2 = deferred.then( function (arg ) {
				return arg;
			}, function ( e ) {
				throw e;
			});

			fn = function () {
				// Creating new child data store
				if ( typeof arg === "object" ) {
					recs = arg;
				}

				if ( params.maxDepth === 0 || params.depth <= params.maxDepth ) {
					self.records[idx] = data.decorator( {id: key}, recs, params );

					// Not batching in a data set
					if ( recs === null ) {
						// Constructing relational URI
						if ( self.uri !== null && arg === undefined && !array.contains( self.leafs, key ) ) {
							arg = self.uri + "/" + key;
						}
						
						// Conditionally making the store RESTful
						if ( arg !== undefined ) {
							self.records[idx].data.setUri( arg )
							                      .then( function (arg ) {
							                      		deferred.resolve( arg );
							                       }, function ( e ) {
							                      		deferred.reject( e );
							                       });
						}
						else {
							deferred.resolve( self.records[idx].data.records );
						}
					}
				}
			}

			// Create stub or teardown existing data store
			if ( this.keys[key] !== undefined ) {
				idx = this.keys[key];

				if ( typeof this.records[idx].data.teardown === "function" ) {
					this.records[idx].data.teardown();
				}

				fn();
			}
			else {
				this.set( key, {}, true).then( function ( arg ) {
					idx = self.keys[arg.key];
					self.collections.add( arg.key );
					fn();
				});
			}

			return deferred2;
		},

		/**
		 * Retrieves a record based on key or index
		 *
		 * If the key is an integer, cast to a string before sending as an argument!
		 *
		 * @method get
		 * @param  {Mixed}  record Key, index or Array of pagination start & end; or comma delimited String of keys or indices
		 * @param  {Number} offset [Optional] Offset from `record` for pagination
		 * @return {Mixed}         Individual record, or Array of records
		 */
		get : function ( record, offset ) {
			var records = this.records,
			    type    = typeof record,
			    self    = this,
			    r;

			if ( type === "undefined" || record.toString().length === 0 ) {
				r = records;
			}
			else if ( type === "string" && record.indexOf( "," ) > -1 ) {
				r = [];
				array.each( string.explode( record ), function ( i ) {
					if ( !isNaN( i )) {
						i = number.parse( i, 10 );
					}

					r.push( self.get( i ) );
				});
			}
			else if ( type === "string" && this.keys[record] !== undefined ) {
				r = records[this.keys[record]];
			}
			else if ( type === "number" && offset === undefined) {
				r = records[number.parse( record, 10 )];
			}
			else if ( type === "number" && typeof offset === "number") {
				r = records.limit( number.parse( record, 10 ), number.parse( offset, 10 ) );
			}

			return r;
		},

		/**
		 * Purges data store or record from localStorage
		 * 
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		purge : function ( arg ) {
			return this.storage( arg || this, "remove" );
		},

		/**
		 * Reindexes the data store
		 *
		 * @method reindex
		 * @return {Object} Data store
		 */
		reindex : function () {
			var nth = this.total,
			    i   = -1;

			this.views = {};

			if ( nth > 0 ) {
				while ( ++i < nth ) {
					this.records[i].index = i;
					this.keys[this.records[i].key] = i;
				}
			}

			return this;
		},

		/**
		 * Restores data store or record frome localStorage
		 * 
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		restore : function ( arg ) {
			return this.storage( arg || this, "get" );
		},

		/**
		 * Saves data store or record to localStorage
		 * 
		 * @param  {Mixed} arg  [Optional] String or Number for record
		 * @return {Object}     Record or store
		 */
		save : function ( arg ) {
			return this.storage( arg || this, "set" );
		},

		/**
		 * Selects records based on an explcit description
		 * 
		 * @param  {Object} where  Object describing the WHERE clause
		 * @return {Array}         Array of records
		 */
		select : function ( where ) {
			var result;

			if ( !( where instanceof Object ) ) {
				throw Error( label.error.invalidArguments );
			}

			result = this.records.filter( function ( rec ) {
				var match = true;

				utility.iterate( where, function ( v, k ) {
					var type = typeof v;

					if ( type !== "function" && rec.data[k] !== v ) {
						return ( match = false );
					}
					else if ( type === "function" && !v( rec.data[k] ) ) {
						return ( match = false );
					}
				});

				return match;
			});

			return result;
		},

		/**
		 * Creates or updates an existing record
		 *
		 * Events: beforeDataSet  Fires before the record is set
		 *         afterDataSet   Fires after the record is set, the record is the argument for listeners
		 *         failedDataSet  Fires if the store is RESTful and the action is denied
		 *
		 * @method set
		 * @param  {Mixed}   key   [Optional] Integer or String to use as a Primary Key
		 * @param  {Object}  arg   Key:Value pairs to set as field values
		 * @param  {Boolean} batch [Optional] True if called by data.batch
		 * @return {Object}        Promise
		 */
		set : function ( key, arg, batch ) {
			batch        = ( batch === true );
			var self     = this,
			    deferred = promise.factory(),
			    partial  = false,
			    data, deferred2, record, method, events, args, uri, p, success, failure;

			if ( !( arg instanceof Object ) ) {
				throw Error( label.error.invalidArguments );
			}

			// Chaining a promise to return
			deferred2 = deferred.then( function ( arg ) {
				var data     = {data: null, key: arg.key, record: arg.record, result: arg.result},
				    deferred = promise.factory(),
				    record, uri;

				// Making sure nothing is by reference
				data.data = utility.clone( arg.data );

				deferred.then( function ( arg ) {
					if ( self.retrieve ) {
						self.crawl( arg );
					}

					if ( !batch ) {
						if ( self.autosave ) {
							self.save();
						}

						array.each( self.datalists, function ( i ) {
							i.refresh();
						});
					}

					if ( events ) {
						observer.fire( self.parentNode, "afterDataSet", arg );
					}
				}, function ( e ) {
					if ( events ) {
						observer.fire( self.parentNode, "failedDataSet", e );
					}

					throw e;
				});

				self.views = {};

				// Getting the record again due to scheduling via promises, via data.batch()
				if ( data.key !== undefined ) {
					data.record = self.get( data.key );
				}

				if ( data.record === undefined ) {
					var index = self.total++;

					if ( data.key === undefined ) {
						if ( data.result === undefined ) {
							self.total--;
							deferred.reject( label.error.expectedObject );
						}
					
						if ( self.source !== null ) {
							data.result = utility.walk( data.result, self.source );
						}
					
						if ( self.key === null ) {
							data.key = utility.uuid();
						}
						else {
							data.key = data.result[self.key];
							delete data.result[self.key];
						}
					
						if ( typeof data.key !== "string" ) {
							data.key = data.key.toString();
						}

						data.data = data.result;
					}

					self.keys[data.key] = index;
					self.records[index] = {key: data.key, data: {}, index: index};
					record              = self.records[index];

					if ( self.pointer === null || data.data[self.pointer] === undefined ) {
						record.data = data.data;

						if ( self.key !== null && record.data.hasOwnProperty( self.key ) ) {
							delete record.data[self.key];
						}

						deferred.resolve( record );
					}
					else {
						uri  = data.data[self.pointer];

						if ( uri === undefined || uri === null ) {
							delete self.records[index];
							delete self.keys[data.key];
							deferred.reject( label.error.expectedObject );
						}

						record.data = {};

						client.request(uri, "GET", function ( args ) {
							if ( self.source !== null) {
								args = utility.walk( args, self.source );
							}

							if ( args[self.key] !== undefined ) {
								delete args[self.key];
							}

							record.data = args;
							deferred.resolve( record );
						}, function ( e ) {
							deferred.reject( e );
						}, self.headers );
					}
				}
				else {
					record = self.records[self.keys[data.record.key]];
					record.data = data.data;
					deferred.resolve( record );
				}

				return record;
			}, function ( e ) {
				if ( events) {
					observer.fire( self.parentNode, "failedDataSet", e );
				}

				throw e;
			});

			if ( key instanceof Object ) {
				batch = arg;
				arg   = key;
				key   = null;
			}

			// Cloning data to avoid `by reference` issues
			data = utility.clone( arg );

			// Finding or assigning the record key
			if ( key === null && this.uri === null ) {
				if ( this.key === null || data[this.key] === undefined ) {
					key = utility.uuid();
				}
				else {
					key = data[this.key];
					delete data[this.key];
				}
			}
			else if ( key === null ) {
				key = undefined;
			}

			// Generating a child store
			if ( data instanceof Array ) {
				return this.generate( key )
				           .then( function () {
				           		self.get( key ).data.batch( "set", data )
				           		                    .then( function ( arg ) {
				           		                    	deferred.resolve( arg );
				           		                     }, function ( e ) {
				           		                     	deferred.reject( e );
				           		                     });
				            });
			}

			// Setting variables for ops
			record = key === undefined ? undefined : this.get( key );
			method = key === undefined ? "post" : "put";
			events = ( this.events === true );
			args   = {data: {}, key: key, record: undefined};
			uri    = this.uri;

			// Determining permissions
			if ( !batch && this.callback === null && uri !== null ) {
				if ( record !== undefined && uri.replace( regex.not_endpoint, "" ) !== record.key ) {
					uri += "/" + record.key;
				}

				// Can we use a PATCH request?
				if ( method === "put" && client.allows( uri, "patch" ) && ( !client.ie || ( client.version > 8 || client.activex ) ) ) {
					method = "patch";
					p = partial = true;
				}

				if ( p === undefined ) {
					p = ( client.cors ( uri ) || client.allows( uri, method ) );
				}
			}

			// Setting the data to pass to the promise
			if ( record !== undefined ) {
				args.record = this.records[this.keys[record.key]];

				// Getting primitive values
				utility.iterate( args.record.data, function ( v, k ) {
					if ( !array.contains( self.ignore, k ) ) {
						args.data[k] = v;
					}
				});

				// Merging the difference with the record data
				utility.merge( args.data, data );

				// PATCH is not supported, send the entire record
				if ( !partial ) {
					data = args.data;
				}
			}
			else {
				args.data = data;
			}

			if ( events ) {
				observer.fire( self.parentNode, "beforeDataSet", {key: key, data: data} );
			}

			if ( batch || this.callback !== null || this.uri === null ) {
				deferred.resolve( args );
			}
			else if ( regex.true_undefined.test( p ) ) {
				client.request( uri, method.toUpperCase(), function ( arg ) {
					args.result = arg;
					deferred.resolve( args );
				}, function ( e ) {
					deferred.reject( e );
				}, data, utility.merge( {withCredentials: this.credentials}, this.headers ) );
			}
			else {
				deferred.reject( args );
			}

			return deferred2;
		},

		/**
		 * Gets or sets an explicit expiration of data
		 *
		 * @method setExpires
		 * @param  {Number} arg  Milliseconds until data is stale
		 * @return {Object}      Data store
		 */
		setExpires : function ( arg ) {
			// Expiry cannot be less than a second, and must be a valid scenario for consumption; null will disable repetitive expiration
			if ( ( arg !== null && this.uri === null ) || ( arg !== null && ( isNaN( arg ) || arg < 1000 ) ) ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.expires === arg ) {
				return;
			}

			this.expires = arg;

			var id      = this.parentNode.id + "DataExpire",
			    expires = arg,
			    self    = this;

			utility.clearTimers( id );

			if ( arg === null ) {
				return;
			}

			utility.repeat( function () {
				if ( self.uri === null ) {
					self.setExpires( null );
					return false;
				}

				if ( !cache.expire( self.uri ) ) {
					observer.fire( self.uri, "beforeExpire, expire, afterExpire" );
				}
			}, expires, id, false);
		},

		/**
		 * Sets the RESTful API end point
		 * 
		 * @method setUri
		 * @param  {String} arg [Optional] API collection end point
		 * @return {Object}     Promise
		 */
		setUri : function ( arg ) {
			var deferred = promise.factory(),
			    result;

			if ( arg !== null && string.isEmpty( arg ) ) {
				throw Error( label.error.invalidArguments );
			}

			arg = utility.parse( arg ).href;

			if ( this.uri === arg ) {
				result = this.uri;
			}
			else {
				if ( this.uri !== null) {
					observer.remove( this.uri );
				}

				result = this.uri = arg;

				if ( result !== null ) {
					observer.add( result, "expire", function () {
						this.sync( true );
					}, "dataSync", this);

					cache.expire( result, true );

					this.sync( true )
					    .then( function (arg ) {
					    	deferred.resolve( arg );
					     }, function ( e ) {
					    	deferred.reject( e );
					     });
				}
			}

			return deferred;
		},

		/**
		 * Returns a view, or creates a view and returns it
		 *
		 * @method sort
		 * @param  {String} query       SQL ( style ) order by
		 * @param  {String} create      [Optional, default behavior is true, value is false] Boolean determines whether to recreate a view if it exists
		 * @param  {String} sensitivity [Optional] Sort sensitivity, defaults to "ci" ( insensitive = "ci", sensitive = "cs", mixed = "ms" )
		 * @param  {Object} where       Object describing the WHERE clause
		 * @return {Array}              View of data
		 */
		sort : function ( query, create, sensitivity, where ) {
			if ( query === undefined || string.isEmpty( query ) ) {
				throw Error( label.error.invalidArguments );
			}

			if ( !regex.sensitivity_types.test( sensitivity ) ) {
				sensitivity = "ci";
			}

			create       = ( create === true );
			var view     = ( query.replace( /\s*asc/ig, "" ).explode().join( " " ).toCamelCase() ) + sensitivity.toUpperCase(),
			    queries  = string.explode( query ),
			    key      = this.key,
			    result   = [],
			    bucket, sort, crawl;

			array.each( queries, function ( query ) {
				if ( string.isEmpty( query ) ) {
					throw Error( label.error.invalidArguments );
				}
			});

			if ( !create && this.views[view] instanceof Array ) {
				return this.views[view];
			}

			if ( this.total === 0 ) {
				return [];
			}

			crawl = function ( q, data ) {
				var queries = utility.clone( q ),
				    query   = q[0],
				    sorted  = {},
				    result  = [];

				array.remove( queries, 0 );

				sorted = bucket( query, data, regex.desc.test( query ) );

				array.each( sorted.order, function ( i ) {
					if ( sorted.registry[i].length < 2 ) {
						return;
					}

					if ( queries.length > 0) {
						sorted.registry[i] = crawl( queries, sorted.registry[i] );
					}
				});

				array.each( sorted.order, function ( i ) {
					result = result.concat( sorted.registry[i] );
				});

				return result;
			}

			bucket = function ( query, records, reverse ) {
				query        = query.replace( /\s*asc/ig, "" );
				var prop     = query.replace( regex.desc, "" ),
				    pk       = ( key === prop ),
				    order    = [],
				    registry = {};

				array.each( records, function ( r ) {
					var val = pk ? r.key : r.data[prop],
					    k   = val === null ? "null" : val.toString();

					switch ( sensitivity ) {
						case "ci":
							k = string.toCamelCase( k );
							break;
						case "cs":
							k = string.trim( k );
							break;
						case "ms":
							k = string.trim( k ).slice(0, 1).toLowerCase();
							break;
					}

					if ( !( registry[k] instanceof Array ) ) {
						registry[k] = [];
						order.push( k );
					}

					registry[k].push( r );
				});

				order.sort( array.sort );

				if ( reverse) {
					order.reverse();
				}
				
				array.each( order, function ( k ) {
					if ( registry[k].length === 1 ) {
						return;
					}

					registry[k] = sort( registry[k], query, prop, reverse, pk );
				});

				return {order: order, registry: registry};
			};

			sort = function ( data, query, prop, reverse, pk ) {
				var tmp    = [],
				    sorted = [];

				array.each( data, function ( i, idx ) {
					var v  = pk ? i.key : i.data[prop];

					v = string.trim( v.toString() ) + ":::" + idx;
					tmp.push( v.replace(regex.nil, "\"\"") );
				});

				if ( tmp.length > 1 ) {
					tmp.sort( array.sort );

					if ( reverse) {
						tmp.reverse();
					}
				}

				array.each( tmp, function ( i ) {
					sorted.push( data[regex.sort_needle.exec( i )[1]] );
				});

				return sorted;
			};

			result           = crawl( queries, where === undefined ? this.records : this.select( where ) );
			this.views[view] = result;

			return result;
		},

		/**
		 * Storage interface
		 * 
		 * @param  {Mixed}  obj  Record ( Object, key or index ) or store
		 * @param  {Object} op   Operation to perform ( get, remove or set )
		 * @param  {String} type [Optional] Type of Storage to use ( local or session, default is local )
		 * @return {Object}      Record or store
		 */
		storage : function ( obj, op, type ) {
			var record  = false,
			    self    = this,
			    session = ( type === "session" && typeof sessionStorage !== "undefined" ),
			    result, key, data;

			if ( !regex.number_string_object.test( typeof obj ) || !regex.get_remove_set.test( op ) ) {
				throw Error( label.error.invalidArguments );
			}

			record = ( regex.number_string.test( obj ) || ( obj.hasOwnProperty( "key" ) && !obj.hasOwnProperty( "parentNode" ) ) );

			if ( record && !( obj instanceof Object ) ) {
				obj = this.get( obj );
			}

			key    = record ? obj.key : obj.parentNode.id;

			switch ( op ) {
				case "get":
					result = session ? sessionStorage.getItem( key ) : localStorage.getItem( key );

					if ( result === null ) {
						throw Error( label.error.invalidArguments );
					}

					result = json.decode( result );
					record ? this.set( key, result, true ) : utility.merge( this, result );
					result = record ? obj : this;
					break;
				case "remove":
					session ? sessionStorage.removeItem( key ) : localStorage.removeItem( key );
					result = this;
					break;
				case "set":
					data = json.encode( record ? obj.data : {total: this.total, keys: this.keys, records: this.records} );
					session ? sessionStorage.setItem( key, data ) : localStorage.setItem( key, data );
					result = this;
					break;
			}

			return result;
		},

		/**
		 * Syncs the data store with a URI representation
		 *
		 * Events: beforeDataSync  Fires before syncing the data store
		 *         afterDataSync   Fires after syncing the data store
		 *         failedDataSync  Fires when an exception occurs
		 *
		 * @method sync
		 * @param  {Boolean} reindex [Optional] True will reindex the data store
		 * @return {Object}          Promise
		 */
		sync : function ( reindex ) {
			if ( this.uri === null || string.isEmpty( this.uri ) ) {
				throw Error( label.error.invalidArguments );
			}

			reindex       = ( reindex === true );
			var self      = this,
			    events    = ( this.events === true ),
			    deferred1 = promise.factory(),
			    deferred2 = promise.factory(),
			    deferred3, success, failure;

			deferred1.then( function ( arg ) {
				if ( typeof arg !== "object" ) {
					throw Error( label.error.expectedObject );
				}

				var found = false,
				    data;

				if ( self.source !== null ) {
					arg = utility.walk( arg, self.source );
				}

				if ( arg instanceof Array ) {
					data = arg;
				}
				else utility.iterate( arg, function ( i ) {
					if ( !found && i instanceof Array ) {
						found = true;
						data  = i;
					}
				});

				if ( data === undefined ) {
					data = [arg];
				}

				self.batch( "set", data, true, undefined )
				    .then( function ( arg ) {
				    	deferred2.resolve( arg );
				     }, function ( e ) {
				    	deferred2.reject( e );
				     });

				return data;
			}, function ( e ) {
				deferred2.reject( e );
			});

			deferred3 = deferred2.then( function ( arg ) {
				if ( reindex ) {
					self.reindex();
				}

				if ( events ) {
					observer.fire( self.parentNode, "afterDataSync", arg );
				}
			}, function ( e ) {
				if ( events ) {
					observer.fire( self.parentNode, "failedDataSync", e );
				}

				throw e;
			});

			success = function ( arg ) {
				deferred1.resolve( arg );
			};

			failure = function ( e ) {
				deferred1.reject( e );
			};

			if ( events) {
				observer.fire( self.parentNode, "beforeDataSync" );
			}

			this.callback !== null ? client.jsonp( this.uri, success, failure, {callback: this.callback} )
			                       : client.request( this.uri, "GET", success, failure, null, utility.merge({withCredentials: this.credentials}, this.headers) );

			return deferred3;
		},

		/**
		 * Tears down a store & expires all records associated to an API
		 * 
		 * @return {Undefined} undefined
		 */
		teardown : function () {
			var uri = this.uri,
			    id;

			if ( uri !== null ) {
				cache.expire( uri, true );
				observer.remove( uri );

				id = this.parentNode.id + "DataExpire";
				utility.clearTimers( id );

				array.each( this.datalists, function (i ) {
					i.teardown();
				});

				array.each( this.records, function ( i ) {
					cache.expire( (uri + "/" + i.key), true );
					observer.remove( uri + "/" + i.key );
					utility.iterate( i.data, function ( v, k ) {
						if ( v === null ) {
							return;
						}

						if ( v.hasOwnProperty( "data" ) && typeof v.data.teardown === "function" ) {
							observer.remove( v.id );
							v.data.teardown();
						}
					});
				});
			}

			this.clear( true );
			observer.fire( this.parentNode, "afterDataTeardown" );

			return this;
		},

		/**
		 * Returns Array of unique values of `key`
		 * 
		 * @param  {String} key Field to compare
		 * @return {Array}      Array of values
		 */
		unique : function ( key ) {
			var results = [];

			array.each( this.records, function ( i ) {
				array.add( results, i.data[key] );
			});

			return results;
		},

		/**
		 * Updates an existing Record
		 *
		 * Use `data.set()` if the record contains child data stores
		 * 
		 * @param  {Mixed}  key  Integer or String to use as a Primary Key
		 * @param  {Object} data Key:Value pairs to set as field values
		 * @return {Object}      Promise
		 */
		update : function ( key, data ) {
			var record = this.get( key ),
			    self   = this,
			    args, deferred;

			if ( record === undefined ) {
				throw Error( label.error.invalidArguments );
			}

			args     = utility.merge( utility.clone ( record.data ) , data );
			deferred = promise.factory();

			this.set( key, args ).then( function ( arg ) {
				deferred.resolve( arg );
			}, function ( e ) {
				error( e, arguments, self );
			});

			return deferred;

		}
	}
};

/**
 * DataStore factory
 * 
 * @class DataStore
 * @namespace abaaso
 * @param  {Object} obj Object being decorated with a DataStore
 * @return {Object}     Instance of DataStore
 */
function DataStore ( obj ) {
	this.autosave    = false;
	this.callback    = null;
	this.collections = [];
	this.crawled     = false;
	this.credentials = null;
	this.datalists   = [];
	this.depth       = 0;
	this.events      = true;
	this.expires     = null;
	this.headers     = {Accept: "application/json"};
	this.ignore      = [];
	this.key         = null;
	this.keys        = {};
	this.leafs       = [];
	this.loaded      = false;
	this.maxDepth    = 0;
	this.parentNode  = obj;
	this.pointer     = null;
	this.records     = [];
	this.recursive   = false;
	this.retrieve    = false;
	this.source      = null;
	this.total       = 0;
	this.views       = {};
	this.uri         = null;
};

// Setting prototype & constructor loop
DataStore.prototype = data.methods;
DataStore.prototype.constructor = DataStore;

/**
 * DataList
 *
 * Provides a reactive View of a DataStore
 * Requires a CSS class named "hidden" to toggle "display:none" of list items
 *
 * @class datalist
 * @namespace abaaso
 */
var datalist = {
	/**
	 * Creates an instance of datalist
	 *           
	 * @method factory
	 * @param  {Object} target   Element to receive the DataList
	 * @param  {Object} store    Data store to feed the DataList
	 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
	 * @param  {Object} options  Optional parameters to set on the DataList
	 * @return {Object}          DataList instance
	 */
	factory : function ( target, store, template, options ) {
		var ref = [store],
		    obj, instance;

		if ( !( target instanceof Element ) || typeof store !== "object" || !regex.string_object.test( typeof template ) ) {
			throw Error( label.error.invalidArguments );
		}

		obj = element.create( "ul", {"class": "list", id: store.parentNode.id + "-datalist"}, target );

		// Creating instance
		instance = new DataList( obj, ref[0], template );

		if ( options instanceof Object) {
			utility.merge( instance, options );
		}

		instance.store.datalists.push( instance );

		// Rendering if not tied to an API or data is ready
		if ( instance.store.uri === null || instance.store.loaded ) {
			instance.refresh( true );
		}

		return instance;
	},

	// Inherited by DataLists
	methods : {
		/**
		 * Delete sync handler
		 * 
		 * @method del
		 * @param  {Object} rec Record
		 * @return {Object}     DataList instance
		 */
		del : function ( rec ) {
			if ( typeof this.pageIndex === "number" && typeof this.pageSize === "number" ) {
				this.refresh();
			}
			else {
				observer.fire( this.element, "beforeDataListRefresh" );
				
				array.each(this.element.find( "> li[data-key='" + rec.key + "']" ), function ( i ) {
					element.destroy( i );
				});

				observer.fire( this.element, "afterDataListRefresh" );
			}

			return this;
		},

		/**
		 * Exports data list records
		 * 
		 * @return {Array} Record set
		 */
		dump : function () {
			return this.store.dump( this.records );
		},

		/**
		 * Changes the page index of the DataList
		 * 
		 * @method page
		 * @return {Object}  DataList instance
		 */
		page : function ( arg ) {
			if ( isNaN( arg ) ) {
				throw Error( label.error.invalidArguments );
			}

			this.pageIndex = arg;
			this.refresh();

			return this;
		},

		/**
		 * Adds pagination Elements to the View
		 * 
		 * @method pages
		 * @return {Object}  DataList instance
		 */
		pages : function () {
			var obj   = this.element,
			    page  = this.pageIndex,
			    pos   = this.pagination,
			    range = this.pageRange,
			    mid   = number.round( number.half( range ), "down" ),
			    start = page - mid,
			    end   = page + mid,
			    self  = this,
			    total = datalist.pages.call( this ),
			    i     = 0,
			    diff, li, anchor;

			if ( !regex.top_bottom.test( pos ) ) {
				throw Error( label.error.invalidArguments );
			}

			// Removing the existing controls
			array.each( $( "#" + obj.id + "-pages-top, #" + obj.id + "-pages-bottom" ), function ( i ) {
				if ( i !== undefined ) {
					element.destroy( i );
				}
			});
			
			// Halting because there's 1 page, or nothing
			if ( this.total === 0 || total === 1 ) {
				return this;
			}

			// Getting the range to display
			if ( start < 1 ) {
				diff  = number.diff( start, 1 );
				start = start + diff;
				end   = end   + diff;
			}

			if ( end > total ) {
				end   = total;
				start = ( end - range ) + 1;
				if ( start < 1 ) start = 1;
			}

			array.each( string.explode(pos), function (i ) {
				var current = false,
				    more    = page > 1,
				    next    = ( page + 1 ) <= total,
				    last    = !( page < total ),
				    el;

				// Setting up the list
				el = element.create( "ul", {"class": "list pages " + i, id: obj.id + "-pages-" + i}, obj, i === "bottom" ? "after" : "before" );

				// First page
				element.create( more ? "a" : "span", {"class": "first page", "data-page": 1, innerHTML: "&lt;&lt;"}, element.create( "li", {}, el) );

				// Previous page
				element.create( more ? "a" : "span", {"class": "prev page", "data-page": (page - 1), innerHTML: "&lt;"}, element.create( "li", {}, el) );

				// Rendering the page range
				for ( i = start; i <= end; i++ ) {
					current = ( i === page );
					element.create( current ? "span" : "a", {"class": current ? "current page" : "page", "data-page": i, innerHTML: i}, element.create( "li", {}, el) );
				}

				// Next page
				element.create( next ? "a" : "span", {"class": "next page", "data-page": next ? (page + 1) : null, innerHTML: "&gt;"}, element.create( "li", {}, el) );

				// Last page
				element.create( last ? "span" : "a", {"class": "last page", "data-page": last ? null : total, innerHTML: "&gt;&gt;"}, element.create( "li", {}, el) );

				// Removing ( potentially ) existing click handler
				observer.remove( el, "click" );

				// Click handler scrolls to top the top of page
				observer.add( el, "click", function (e ) {
					var target = utility.target( e );

					utility.stop( e );

					if ( target.nodeName === "A" ) {
						self.page( element.data( target, "page") );
						window.scrollTo( 0, 0 );
					}
				}, "pagination");
			});

			return this;
		},

		/**
		 * Refreshes element
		 * 
		 * Events: beforeDataListRefresh  Fires from the element containing the DataList
		 *         afterDataListRefresh   Fires from the element containing the DataList
		 * 
		 * @method refresh
		 * @param  {Boolean} redraw [Optional] Boolean to force clearing the DataList ( default ), false toggles "hidden" class of items
		 * @param  {Boolean} create [Optional] Recreates cached View of data
		 * @return {Object}         DataList instance
		 */
		refresh : function ( redraw, create ) {
			redraw       = ( redraw !== false );
			create       = ( create === true );
			var el       = this.element,
			    template = ( typeof this.template === "object" ),
			    key      = ( !template && this.template.toString().replace( /\{\{|\}\}/g, "" ) === this.store.key ),
			    consumed = [],
			    items    = [],
			    self     = this,
			    callback = ( typeof this.callback === "function" ),
			    reg      = new RegExp(),
			    registry = [], // keeps track of records in the list ( for filtering )
			    limit    = [],
			    fn, obj, ceiling;

			observer.fire( el, "beforeDataListRefresh" );

			// Creating templates for the html rep
			if ( !template ) {
				fn = function ( i ) {
					var html  = self.template,
					    items = array.unique( html.match( /\{\{[\w\.]+\}\}/g ) );

					// Replacing record key
					html = html.replace( "{{" + self.store.key + "}}", i.key );
					
					// Replacing dot notation properties
					array.each( items, function ( attr ) {
						var key   = attr.replace( /\{\{|\}\}/g, "" ),
						    value = utility.walk( i.data, key );

						reg.compile( attr, "g" );
						html = html.replace( reg, value );
					});

					// Filling in placeholder value
					html = html.replace( /\{\{.*\}\}/g, self.placeholder );

					return {li: html};
				};
			}
			else {
				fn = function ( i ) {
					var obj   = json.encode( self.template ),
					    items = array.unique( obj.match( /\{\{[\w\.]+\}\}/g ) );

					// Replacing record key
					obj = obj.replace( "{{" + self.store.key + "}}", i.key );
					
					// Replacing dot notation properties
					array.each( items, function ( attr ) {
						var key   = attr.replace( /\{\{|\}\}/g, "" ),
						    value = utility.walk( i.data, key );

						reg.compile( attr, "g" );

						// Stripping first and last " to concat to valid JSON
						obj = obj.replace( reg, json.encode( value ).replace( /(^")|("$)/g, "" ) );
					});

					// Filling in placeholder value
					obj = json.decode( obj.replace( /\{\{.*\}\}/g, self.placeholder ) );

					return {li: obj};
				};
			}

			// Consuming records based on sort
			if ( this.where === null ) {
				consumed = string.isEmpty( this.order ) ? this.store.get() : this.store.sort( this.order, create, this.sensitivity );
			}
			else {
				consumed = string.isEmpty( this.order ) ? this.store.select( this.where ) : this.store.sort( this.order, create, this.sensitivity, this.where );
			}

			// Processing ( filtering ) records & generating templates
			array.each( consumed, function ( i ) {
				if ( self.filter === null || !( self.filter instanceof Object ) ) {
					items.push( {key: i.key, template: fn( i )} );
				}
				else {
					utility.iterate( self.filter, function ( v, k ) {
						var reg, key;

						if ( array.contains( registry, i.key ) ) {
							return;
						}
						
						v   = string.explode( v );
						reg = new RegExp(),
						key = ( k === self.store.key );

						array.each( v, function ( query ) {
							utility.compile( reg, query, "i" );
							if ( ( key && reg.test( i.key ) ) || ( i.data[k] !== undefined && reg.test( i.data[k] ) ) ) {
								registry.push( i.key );
								items.push( {key: i.key, template: fn( i )} );

								return false;
							}
						});
					});
				}
			});

			// Exposting records & total count of items in the list
			this.records = items;
			this.total   = items.length;

			// Pagination ( supports filtering )
			if ( typeof this.pageIndex === "number" && typeof this.pageSize === "number" ) {
				ceiling = datalist.pages.call( this );

				// Passed the end, so putting you on the end
				if ( ceiling > 0 && this.pageIndex > ceiling ) {
					return this.page( ceiling );
				}

				// Paginating the items
				else if ( this.total > 0 ) {
					limit = datalist.range.call( this );
					items = items.limit( limit[0], limit[1] );
				}
			}

			// Preparing the target element
			if ( redraw ) {
				element.clear( el );

				if ( this.total === 0 ) {
					element.create( "li", {innerHTML: this.emptyMsg}, el );
				}
				else {
					array.each( items, function ( i ) {
						var obj = utility.tpl( i.template, el );

						element.data( obj, "key", i.key );

						if ( callback ) {
							self.callback( obj );
						}
					});
				}
			}
			else {
				array.each( element.find( el, "> li" ), function ( i ) {
					element.addClass( i, "hidden" );
				});

				array.each( items, function ( i ) {
					array.each( element.find( el, "> li[data-key='" + i.key + "']" ), function ( o ) {
						element.removeClass( o, "hidden" );
					});
				});
			}

			// Rendering pagination elements
			if ( regex.top_bottom.test( this.pagination ) && typeof this.pageIndex === "number" && typeof this.pageSize === "number") {
				this.pages();
			}
			else {
				array.each( $( "#" + el.id + "-pages-top, #" + el.id + "-pages-bottom" ), function ( i ) {
					element.destroy( i );
				});
			}

			observer.fire( el, "afterDataListRefresh" );

			return this;
		},

		/**
		 * Sorts data list & refreshes element
		 * 
		 * Events: beforeDataListSort     Fires before the DataList sorts
		 *         beforeDataListRefresh  Fires before the DataList refreshes
		 *         afterDataListRefresh   Fires after the DataList refreshes
		 *         afterDataListSort      Fires after the DataList is sorted
		 * 
		 * @method sort
		 * @param  {String}  order       SQL "order by" statement
		 * @param  {String}  sensitivity [Optional] Defaults to "ci" ( "ci" = insensitive, "cs" = sensitive, "ms" = mixed sensitive )
		 * @param  {Boolean} create      [Optional] Recreates cached View of data store
		 * @return {Object}              DataList instance
		 */
		sort : function ( order, sensitivity, create ) {
			if ( typeof order !== "string" ) {
				throw Error( label.error.invalidArguments );
			}

			this.element.fire( "beforeDataListSort" );

			this.order       = order;
			this.sensitivity = sensitivity || "ci";

			this.refresh( true, create );

			this.element.fire( "afterDataListSort" );

			return this;
		},

		/**
		 * Tears down references to the DataList
		 * 
		 * @method teardown
		 * @param  {Boolean} destroy [Optional] `true` will remove the DataList from the DOM
		 * @return {Object}  DataList instance
		 */
		teardown : function ( destroy ) {
			destroy  = ( destroy === true );
			var self = this,
			    id   = this.element.id;

			observer.remove( id );

			array.each( $( "#" + id + "-pages-top, #" + id + "-pages-bottom" ), function ( i ) {
				observer.remove( i );
			});

			array.each( this.store.datalists, function ( i, idx ) {
				if ( i.id === self.id ) {
					this.remove( idx );

					return false;
				}
			});

			if ( destroy ) {
				element.destroy( this.element );
				this.element = null;
			}

			return this;
		}
	},

	/**
	 * Calculates the total pages
	 * 
	 * @method pages
	 * @return {Number} Total pages
	 */
	pages : function () {
		if ( isNaN( this.pageSize ) ) {
			throw Error( label.error.invalidArguments );
		}

		return number.round( this.total / this.pageSize, "up" );
	},

	/**
	 * Calculates the page size as an Array of start & finish
	 * 
	 * @method range
	 * @return {Array}  Array of start & end numbers
	 */
	range : function () {
		var start = ( this.pageIndex * this.pageSize ) - this.pageSize,
		    end   = this.pageSize;

		return [start, end];
	}
};

/**
 * DataList factory
 *
 * @class DataList
 * @namespace abaaso
 * @param  {Object} element  DataList element
 * @param  {Object} store    Data store to feed the DataList
 * @param  {Mixed}  template Record field, template ( $.tpl ), or String, e.g. "<p>this is a {{field}} sample.</p>", fields are marked with {{ }}
 * @return {Object}          Instance of DataList
 */
function DataList ( element, store, template ) {
	this.callback    = null;
	this.element     = element;
	this.emptyMsg    = "Nothing to display";
	this.filter      = null;
	this.id          = utility.genId();
	this.pageIndex   = 1;
	this.pageSize    = null;
	this.pageRange   = 5;
	this.pagination  = "bottom"; // "top" or "bottom|top" are also valid
	this.placeholder = "";
	this.order       = "";
	this.records     = [];
	this.template    = template;
	this.total       = 0;
	this.sensitivity = "ci";
	this.store       = store;
	this.where       = null;
};

// Setting prototype & constructor loop
DataList.prototype = datalist.methods;
DataList.prototype.constructor = DataList;

/**
 * Deferreds
 * 
 * @type {Object}
 */
var deferred = {
	/**
	 * Deferred factory
	 * 
	 * @method factory
	 * @return {Object} Deferred
	 */
	factory : function () {
		return new Deferred();
	},

	// Inherited by deferreds
	methods : {
		/**
		 * Registers a function to execute after Promise is reconciled
		 * 
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		always : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onAlways.push( arg );

			return this;
		},

		/**
		 * Registers a function to execute after Promise is resolved
		 * 
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		done : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onDone.push( arg );

			return this;
		},

		/**
		 * Registers a function to execute after Promise is rejected
		 * 
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred
		 */
		fail : function ( arg ) {
			if ( typeof arg !== "function" ) {
				throw Error( label.error.invalidArguments );
			}

			if ( this.promise.resolved() ) {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.promise.outcome ) );
			}

			this.onFail.push( arg );

			return this;
		},

		/**
		 * Determines if Deferred is rejected
		 * 
		 * @return {Boolean} `true` if rejected
		 */
		isRejected : function () {
			return ( this.promise.state === promise.state.broken );
		},

		/**
		 * Determines if Deferred is resolved
		 * 
		 * @return {Boolean} `true` if resolved
		 */
		isResolved : function () {
			return ( this.promise.state === promise.state.resolved );
		},

		/**
		 * Rejects the Promise
		 * 
		 * @param  {Mixed} arg Rejection outcome
		 * @return {Object}    Deferred
		 */
		reject : function ( arg ) {
			this.promise.reject.call( this.promise, arg );

			return this;
		},

		/**
		 * Resolves the Promise
		 * 
		 * @param  {Mixed} arg Resolution outcome
		 * @return {Object}    Deferred
		 */
		resolve : function ( arg ) {
			this.promise.resolve.call( this.promise, arg );

			return this;
		}
	}
};


/**
 * Deferred factory
 *
 * @class Deferred
 * @namespace abaaso
 * @return {Object} Instance of Deferred
 */
function Deferred () {
	var self      = this;

	this.promise  = promise.factory();
	this.onDone   = [];
	this.onAlways = [];
	this.onFail   = [];

	utility.when( this.promise ).then( function ( arg ) {
		array.each( self.onDone, function ( i ) {
			i( arg );
		});

		array.each( self.onAlways, function ( i ) {
			i( arg );
		});

		self.onAlways = [];
		self.onDone   = [];
		self.onFail   = [];
	}, function ( arg ) {
		array.each( self.onFail, function ( i ) {
			i( arg );
		});

		array.each( self.onAlways, function ( i ) {
			i( arg );
		});

		self.onAlways = [];
		self.onDone   = [];
		self.onFail   = [];
	});
};

// Setting prototype & constructor loop
Deferred.prototype = deferred.methods;
Deferred.prototype.constructor = Deferred;

/**
 * Element methods
 *
 * @class element
 * @namespace abaaso
 */
var element = {
	/**
	 * Gets or sets an Element attribute
	 * 
	 * @param  {Mixed}  obj   Element
	 * @param  {String} name  Attribute name
	 * @param  {Mixed}  value Attribute value
	 * @return {Object}       Element
	 */
	attr : function ( obj, key, value ) {
		var target, result;

		if ( regex.svg.test( obj.namespaceURI ) ) {
			if ( value === undefined ) {
				result = obj.getAttributeNS( obj.namespaceURI, key );

				if ( result === null || string.isEmpty( result ) ) {
					result = undefined;
				}
				else {
					result = utility.coerce( result );
				}
			}
			else {
				obj.setAttributeNS( obj.namespaceURI, key, value );
			}
		}
		else {
			if ( typeof value === "string" ) {
				value = string.trim( value );
			}

			if ( regex.checked_disabled.test( key ) && value === undefined ) {
				return utility.coerce( obj[key] );
			}
			else if ( regex.checked_disabled.test( key ) && value !== undefined ) {
				obj[key] = value;
			}
			else if ( obj.nodeName === "SELECT" && key === "selected" && value === undefined) {
				return $( "#" + obj.id + " option[selected=\"selected\"]" )[0] || $( "#" + obj.id + " option" )[0];
			}
			else if ( obj.nodeName === "SELECT" && key === "selected" && value !== undefined ) {
				target = $( "#" + obj.id + " option[selected=\"selected\"]" )[0];

				if ( target !== undefined ) {
					target.selected = false;
					target.removeAttribute( "selected" );
				}

				target = $( "#" + obj.id + " option[value=\"" + value + "\"]" )[0];
				target.selected = true;
				target.setAttribute( "selected", "selected" );
			}
			else if ( value === undefined ) {
				result = obj.getAttribute( key );

				if ( result === null || string.isEmpty( result ) ) {
					result = undefined;
				}
				else {
					result = utility.coerce( result );
				}

				return result;
			}
			else {
				obj.setAttribute( key, value );
			}
		}

		return obj;
	},

	/**
	 * Clears an object's innerHTML, or resets it's state
	 *
	 * @method clear
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	clear : function ( obj ) {
		if ( typeof obj.reset === "function" ) {
			obj.reset();
		}
		else if ( obj.value !== undefined ) {
			element.update( obj, {innerHTML: "", value: ""} );
		}
		else {
			element.update( obj, {innerHTML: ""} );
		}

		return obj;
	},

	/**
	 * Creates an Element in document.body or a target Element
	 *
	 * An id is generated if not specified with args
	 *
	 * @method create
	 * @param  {String} type   Type of Element to create
	 * @param  {Object} args   [Optional] Collection of properties to apply to the new element
	 * @param  {Mixed}  target [Optional] Target object or element.id value to append to
	 * @param  {Mixed}  pos    [Optional] "first", "last" or Object describing how to add the new Element, e.g. {before: referenceElement}
	 * @return {Object}        Element that was created or undefined
	 */
	create : function ( type, args, target, pos ) {
		var svg = false,
		    obj, uid, frag;

		if ( type === undefined || string.isEmpty( type ) ) {
			throw Error( label.error.invalidArguments );
		}

		if ( target !== undefined ) {
			target = utility.object( target );
			svg    = ( target.namespaceURI !== undefined && regex.svg.test( target.namespaceURI ) );
		}
		else if ( args !== undefined && ( typeof args === "string" || args.childNodes !== undefined ) ) {
			target = utility.object( args );
			svg    = ( target.namespaceURI !== undefined && regex.svg.test( target.namespaceURI ) );
		}
		else {
			target = document.body;
		}

		if ( target === undefined ) {
			throw Error( label.error.invalidArguments );
		}
		
		frag = !( target instanceof Element );
		
		uid  = args                   !== undefined
		        && typeof args        !== "string"
		        && args.childNodes    === undefined
		        && args.id            !== undefined
		        && $( "#" + args.id ) === undefined ? args.id : ( !svg ? utility.genId( undefined, true ) : undefined );

		if ( args !== undefined && args.id !== undefined ) {
			delete args.id;
		}

		if ( !svg && !regex.svg.test( type ) ) {
			obj = document.createElement( type );
		}
		else {
			obj = document.createElementNS( "http://www.w3.org/2000/svg", type );
		}

		if ( uid !== undefined ) {
			obj.id = uid;
		}

		if ( typeof args === "object" && args.childNodes === undefined ) {
			element.update( obj, args );
		}

		if ( pos === undefined || pos === "last" ) {
			target.appendChild( obj );
		}
		else if ( pos === "first" ) {
			element.prependChild( target, obj );
		}
		else if ( pos === "after" ) {
			pos = {};
			pos.after = target;
			target    = target.parentNode;
			target.insertBefore( obj, pos.after.nextSibling );
		}
		else if ( pos.after !== undefined ) {
			target.insertBefore( obj, pos.after.nextSibling );
		}
		else if ( pos === "before" ) {
			pos = {};
			pos.before = target;
			target     = target.parentNode;
			target.insertBefore( obj, pos.before );
		}
		else if ( pos.before !== undefined ) {
			target.insertBefore( obj, pos.before );
		}
		else {
			target.appendChild( obj );
		}
		
		return obj;
	},

	/**
	 * Gets or sets a CSS style attribute on an Element
	 *
	 * @method css
	 * @param  {Mixed}  obj   Element
	 * @param  {String} key   CSS to put in a style tag
	 * @param  {String} value [Optional] Value to set
	 * @return {Object}       Element
	 */
	css : function ( obj, key, value ) {
		obj = utility.object( obj );
		key = string.toCamelCase( key );
		var i, result;

		if ( value !== undefined ) {
			obj.style[key] = value;
			result = obj;
		}
		else {
			result = obj.style[key];
		}

		return result;
	},

	/**
	 * Data attribute facade acting as a getter (with coercion) & setter
	 *
	 * @method data
	 * @param  {Mixed}  obj   Element
	 * @param  {String} key   Data key
	 * @param  {Mixed}  value Boolean, Number or String to set
	 * @return {Mixed}        undefined, Element or value
	 */
	data : function ( obj, key, value ) {
		var dataset = typeof obj.dataset === "object",
		    result;

		if ( dataset ) {
			key = string.toCamelCase( key );
		}

		if ( value !== undefined ) {
			dataset ? obj.dataset[key] = value : element.attr( obj, "data-" + key, value );
			result = obj;
		}
		else {
			result = utility.coerce( dataset ? obj.dataset[key] : element.attr( obj, "data-" + key ) );
		}

		return result;
	},

	/**
	 * Destroys an Element
	 *
	 * @method destroy
	 * @param  {Mixed} obj Element
	 * @return {Undefined} undefined
	 */
	destroy : function ( obj ) {
		observer.remove( obj );

		if ( obj.parentNode !== null ) {
			obj.parentNode.removeChild( obj );
		}

		return undefined;
	},

	/**
	 * Disables an Element
	 *
	 * @method disable
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	disable : function ( obj ) {
		if ( typeof obj.disabled === "boolean" && !obj.disabled ) {
			obj.disabled = true;
		}

		return obj;
	},

	/**
	 * Dispatches a DOM Event from an Element
	 *
	 * `data` will appear as `Event.detail`
	 * 
	 * @param  {Object}  obj        Element which dispatches the Event
	 * @param  {String}  type       Type of Event to dispatch
	 * @param  {Object}  data       Data to include with the Event
	 * @param  {Boolean} bubbles    [Optional] Determines if the Event bubbles, defaults to `true`
	 * @param  {Boolean} cancelable [Optional] Determines if the Event can be canceled, defaults to `true`
	 * @return {Object}             Element which dispatches the Event
	 */
	dispatch : function () {
		if ( typeof CustomEvent === "function" ) {
			return function ( obj, type, data, bubbles, cancelable ) {
				var ev = new CustomEvent( type );

				bubbles    = ( bubbles    !== false );
				cancelable = ( cancelable !== false );

				ev.initCustomEvent( type, bubbles, cancelable, data || {} );

				obj.dispatchEvent(ev);

				return obj;
			};
		}
		else if ( document !== undefined && typeof document.createEvent === "function" ) {
			return function ( obj, type, data, bubbles, cancelable ) {
				var ev = document.createEvent( "HTMLEvents" );

				bubbles    = ( bubbles    !== false );
				cancelable = ( cancelable !== false );

				ev.initEvent( type, bubbles, cancelable );

				ev.detail = data || {};

				obj.dispatchEvent(ev);

				return obj;
			};
		}
		else if ( document !== undefined && typeof document.createEventObject === "object" ) {
			return function ( obj, type, data, bubbles, cancelable ) {
				var ev = document.createEventObject();

				ev.cancelBubble = ( bubbles !== false );
				ev.detail       = data || {};

				obj.fireEvent( "on" + type, ev );
			}
		}
		else {
			return function () {
				throw Error( label.error.notSupported );
			}
		}
	}(),

	/**
	 * Enables an Element
	 *
	 * @method enable
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	enable : function ( obj ) {
		if ( typeof obj.disabled === "boolean" && obj.disabled ) {
			obj.disabled = false;
		}

		return obj;
	},

	/**
	 * Finds descendant childNodes of Element matched by arg
	 *
	 * @method find
	 * @param  {Mixed}  obj Element to search
	 * @param  {String} arg Comma delimited string of descendant selectors
	 * @return {Mixed}      Array of Elements or undefined
	 */
	find : function ( obj, arg ) {
		var result = [];

		utility.genId( obj, true );

		array.each( string.explode( arg ), function ( i ) {
			result = result.concat( $( "#" + obj.id + " " + i ) );
		});

		return result;
	},

	/**
	 * Determines if Element has descendants matching arg
	 *
	 * @method has
	 * @param  {Mixed}   obj Element or Array of Elements or $ queries
	 * @param  {String}  arg Type of Element to find
	 * @return {Boolean}     True if 1 or more Elements are found
	 */
	has : function ( obj, arg ) {
		var result = element.find( obj, arg );

		return ( !isNaN( result.length ) && result.length > 0 );
	},

	/**
	 * Determines if obj has a specific CSS class
	 * 
	 * @method hasClass
	 * @param  {Mixed} obj Element
	 * @return {Mixed}     Element, Array of Elements or undefined
	 */
	hasClass : function ( obj, klass ) {
		return obj.classList.contains( klass );
	},

	/**
	 * Hides an Element if it's visible
	 *
	 * @method hide
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	hide : function ( obj ) {
		if ( typeof obj.hidden === "boolean" ) {
			obj.hidden = true;
		}
		else {
			obj["data-display"] = obj.style.display;
			obj.style.display = "none";
		}

		return obj;
	},

	/**
	 * Returns a Boolean indidcating if the Object is hidden
	 *
	 * @method hidden
	 * @param  {Mixed} obj Element
	 * @return {Boolean}   True if hidden
	 */
	hidden : function ( obj ) {
		return obj.style.display === "none" || ( typeof obj.hidden === "boolean" && obj.hidden );
	},

	/**
	 * Gets or sets an Elements innerHTML
	 * 
	 * @method html
	 * @param  {Object} obj Element
	 * @param  {String} arg [Optional] innerHTML value
	 * @return {Object}     Element
	 */
	html : function ( obj, arg ) {
		return arg === undefined ? string.trim( obj.innerHTML ) : element.update( obj, {innerHTML: string.trim( arg )} ); 
	},

	/**
	 * Determines if Element is equal to arg, supports nodeNames & CSS2+ selectors
	 *
	 * @method is
	 * @param  {Mixed}   obj Element
	 * @param  {String}  arg Property to query
	 * @return {Boolean}     True if a match
	 */
	is : function ( obj, arg ) {
		return /^:/.test( arg ) ? ( array.contains( element.find( obj.parentNode, obj.nodeName.toLowerCase() + arg ), obj ) ) : new RegExp( arg, "i" ).test( obj.nodeName );
	},

	/**
	 * Tests if Element value or text is alpha-numeric
	 *
	 * @method isAlphaNum
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isAlphaNum : function ( obj ) {
		return obj.nodeName === "FORM" ? false : validate.test( {alphanum  : obj.value || element.text( obj )} ).pass;
	},

	/**
	 * Tests if Element value or text is a boolean
	 *
	 * @method isBoolean
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isBoolean : function ( obj ) {
		return obj.nodeName === "FORM" ? false : validate.test( {"boolean" : obj.value || element.text( obj )} ).pass;
	},

	/**
	 * Tests if Element value or text is checked
	 *
	 * @method isChecked
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isChecked : function ( obj ) {
		return obj.nodeName !== "INPUT" ? false : element.attr( obj, "checked" );
	},

	/**
	 * Tests if Element value or text is a date
	 *
	 * @method isDate
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isDate : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isDate( obj.value   || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is disabled
	 *
	 * @method isDisabled
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isDisabled: function ( obj ) {
		return obj.nodeName !== "INPUT" ? false : element.attr( obj, "disabled" );
	},

	/**
	 * Tests if Element value or text is a domain
	 *
	 * @method isDomain
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isDomain : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isDomain( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is an email address
	 *
	 * @method isEmail
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isEmail  : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isEmail( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is empty
	 *
	 * @method isEmpty
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isEmpty  : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isEmpty( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is an IP address
	 *
	 * @method isIP
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isIP : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isIP( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is an integer
	 *
	 * @method isInt
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isInt : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isInt( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is numeric
	 *
	 * @method isNumber
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isNumber : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isNumber( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is a phone number
	 *
	 * @method isPhone
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isPhone : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isPhone( obj.value || element.text( obj ) );
	},

	/**
	 * Tests if Element value or text is a URL
	 *
	 * @method isUrl
	 * @param  {Object}  obj Element to test
	 * @return {Boolean}     Result of test
	 */
	isUrl : function ( obj ) {
		return obj.nodeName === "FORM" ? false : string.isUrl( obj.value || element.text( obj ) );
	},

	/**
	 * Adds or removes a CSS class
	 *
	 * @method clear
	 * @param  {Mixed}   obj Element
	 * @param  {String}  arg Class to add or remove ( can be a wildcard )
	 * @param  {Boolean} add Boolean to add or remove, defaults to true
	 * @return {Object}      Element
	 */
	klass : function ( obj, arg, add ) {
		var classes;

		add = ( add !== false );
		arg = string.explode( arg, " " );

		if ( add ) {
			array.each( arg, function ( i ) {
				obj.classList.add( i );
			});
		}
		else array.each( arg, function ( i ) {
			if ( i !== "*" ) {
				obj.classList.remove( i );
			}
			else {
				array.each( obj.classList, function ( x ) {
					this.remove( x );
				});

				return false;
			}
		});

		return obj;
	},

	/**
	 * Finds the position of an element
	 *
	 * @method position
	 * @param  {Mixed} obj Element
	 * @return {Object}    Object {top: n, right: n, bottom: n, left: n}
	 */
	position : function ( obj ) {
		var left, top, height, width;

		left   = top = 0;
		width  = obj.offsetWidth;
		height = obj.offsetHeight;

		if ( obj.offsetParent ) {
			top    = obj.offsetTop;
			left   = obj.offsetLeft;

			while ( obj = obj.offsetParent ) {
				left += obj.offsetLeft;
				top  += obj.offsetTop;
			}
		}

		return {
			top    : top,
			right  : document.documentElement.clientWidth  - ( left + width ),
			bottom : document.documentElement.clientHeight + global.scrollY - ( top + height ),
			left   : left
		};
	},

	/**
	 * Prepends an Element to an Element
	 * 
	 * @method prependChild
	 * @param  {Object} obj   Element
	 * @param  {Object} child Child Element
	 * @return {Object}       Element
	 */
	prependChild : function ( obj, child ) {
		return obj.childNodes.length === 0 ? obj.appendChild( child ) : obj.insertBefore( child, obj.childNodes[0] );
	},

	/**
	 * Removes an Element attribute
	 * 
	 * @param  {Mixed}  obj Element
	 * @param  {String} key Attribute name
	 * @return {Object}     Element
	 */
	removeAttr : function ( obj, key ) {
		var target;

		if ( regex.svg.test( obj.namespaceURI ) ) {
			obj.removeAttributeNS( obj.namespaceURI, key );
		}
		else {
			if ( obj.nodeName === "SELECT" && key === "selected") {
				target = $( "#" + obj.id + " option[selected=\"selected\"]" )[0];

				if ( target !== undefined ) {
					target.selected = false;
					target.removeAttribute( "selected" );
				}
			}
			else {
				obj.removeAttribute( key );
			}
		}

		return obj;
	},

	/**
	 * Serializes the elements of a Form, an Element, or Array of Elements or $ queries
	 * 
	 * @param  {Object}  obj    Form, individual Element, or $ query
	 * @param  {Boolean} string [Optional] true if you want a query string, default is false ( JSON )
	 * @param  {Boolean} encode [Optional] true if you want to URI encode the value, default is true
	 * @return {Mixed}          String or Object
	 */
	serialize : function ( obj, string, encode ) {
		obj          = utility.object( obj );
		string       = ( string === true );
		encode       = ( encode !== false );
		var children = [],
		    registry = {},
		    result;

		if ( obj instanceof Array ) {
			array.each( obj, function ( i ) {
				children.push( utility.object( i ) );
			});
		}
		else {
			children = obj.nodeName === "FORM" ? ( obj.elements !== undefined ? array.cast( obj.elements ) : obj.find( "button, input, select, textarea" ) ) : [obj];
		}

		array.each( children, function ( i ) {
			if ( i.nodeName === "FORM" ) {
				utility.merge( registry, json.decode( element.serialize( i ) ) )
			}
			else if ( registry[i.name] === undefined ) {
				registry[i.name] = element.val( i );
			}
		});

		if ( !string ) {
			result = json.encode( registry );
		}
		else {
			result = "";

			utility.iterate( registry, function ( v, k ) {
				encode ? result += "&" + encodeURIComponent( k ) + "=" + encodeURIComponent( v ) : result += "&" + k + "=" + v;
			});

			result = result.replace( /^&/, "?" );
		}

		return result;
	},

	/**
	 * Shows an Element if it's not visible
	 *
	 * @method show
	 * @param  {Mixed} obj Element
	 * @return {Object}    Element
	 */
	show : function ( obj ) {
		if ( typeof obj.hidden === "boolean" ) {
			obj.hidden = false;
		}
		else {
			obj.style.display = element.data( obj, "display" ) || "inherit";
		}

		return obj;
	},

	/**
	 * Returns the size of the Object
	 *
	 * @method size
	 * @param  {Mixed} obj Element
	 * @return {Object}    Size {height: n, width:n}
	 */
	size : function ( obj ) {
		var parse = function ( arg ) {
			return number.parse(arg, 10);
		};

		return {
			height : obj.offsetHeight + parse( obj.style.paddingTop  || 0 ) + parse( obj.style.paddingBottom || 0 ) + parse( obj.style.borderTop  || 0 ) + parse( obj.style.borderBottom || 0 ),
			width  : obj.offsetWidth  + parse( obj.style.paddingLeft || 0 ) + parse( obj.style.paddingRight  || 0 ) + parse( obj.style.borderLeft || 0 ) + parse( obj.style.borderRight  || 0 )
		};
	},

	/**
	 * Getter / setter for an Element's text
	 * 
	 * @param  {Object} obj Element
	 * @param  {String} arg [Optional] Value to set
	 * @return {Object}     Element
	 */
	text : function ( obj, arg ) {
		var key     = obj.textContent !== undefined ? "textContent" : "innerText",
		    payload = {},
		    set     = false;

		if ( typeof arg !== "undefined" ) {
			set          = true;
			payload[key] = arg;
		}

		return set ? element.update( obj, payload ) : obj[key];
	},

	/**
	 * Toggles a CSS class
	 * 
	 * @param  {Object} obj Element, or $ query
	 * @param  {String} arg CSS class to toggle
	 * @return {Object}     Element
	 */
	toggleClass : function ( obj, arg ) {
		obj.classList.toggle( arg );

		return obj;
	},

	/**
	 * Updates an Element
	 *
	 * @method update
	 * @param  {Mixed}  obj  Element
	 * @param  {Object} args Collection of properties
	 * @return {Object}      Element
	 */
	update : function ( obj, args ) {
		args = args || {};

		utility.iterate( args, function ( v, k ) {
			if ( regex.element_update.test( k ) ) {
				obj[k] = v;
			}
			else if ( k === "class" ) {
				!string.isEmpty( v ) ? element.klass( obj, v ) : element.klass( obj, "*", false );
			}
			else if ( k.indexOf( "data-" ) === 0) {
				element.data( obj, k.replace( "data-", "" ), v );
			}
			else if ( k === "id" ) {
				var o = observer.listeners;

				if ( o[obj.id] !== undefined ) {
					o[k] = utility.clone( o[obj.id] );
					delete o[obj.id];
				}
			}
			else {
				element.attr ( obj, k, v );
			}
		});

		return obj;
	},

	/**
	 * Gets or sets the value of Element
	 * 
	 * @param  {Mixed}  obj   Element
	 * @param  {Mixed}  value [Optional] Value to set
	 * @return {Object}       Element
	 */
	val : function ( obj, value ) {
		var event = "input",
		    output;

		if ( value === undefined ) {
			if ( regex.radio_checkbox.test( obj.type ) ) {
				if ( string.isEmpty( obj.name ) ) {
					throw Error( label.error.expectedProperty );
				}

				array.each( $( "input[name='" + obj.name + "']" ), function ( i ) {
					if ( i.checked ) {
						output = i.value;
						return false;
					}
				});
			}
			else if ( regex.select.test( obj.type ) ) {
				output = obj.options[obj.selectedIndex].value;
			}
			else {
				output = obj.value || element.text( obj );
			}

			if (output !== undefined ) {
				output = utility.coerce( output );
			}

			if ( typeof output === "string" ) {
				output = string.trim( output );
			}
		}
		else {
			value = value.toString();

			if ( regex.radio_checkbox.test( obj.type ) ) {
				event = "click";

				array.each( $( "input[name='" + obj.name + "']" ), function ( i ) {
					if ( i.value === value ) {
						i.checked = true;
						output = i;
						return false;
					}
				});
			}
			else if ( regex.select.test( obj.type ) ) {
				event = "change";

				array.each( element.find( obj, "> *" ), function ( i ) {
					if ( i.value === value ) {
						i.selected = true;
						output = i;
						return false;
					}
				});
			}
			else {
				obj.value !== undefined ? obj.value = value : element.text( obj, value );
			}

			element.dispatch( obj, event );

			output = obj;
		}

		return output;
	},

	/**
	 * Validates the contents of Element
	 * 
	 * @method validate
	 * @param  {Object} obj Element to test
	 * @return {Object}     Result of test
	 */
	validate : function ( obj ) {
		return obj.nodeName === "FORM" ? validate.test( obj ) : !string.isEmpty( obj.value || element.text( obj ) );
	}
};

/**
 * DataListFilter
 * 
 * @class filter
 * @namespace abaaso
 */
var filter = {
	/**
	 * DataListFilter factory
	 * 
	 * @param  {Object} obj      Element to receive the filter
	 * @param  {Object} datalist Data list linked to the data store
	 * @param  {String} filters  Comma delimited string of fields to filter by
	 * @param  {Number} debounce [Optional] Milliseconds to debounce
	 * @return {Object}          Filter instance
	 */
	factory : function ( obj, datalist, filters, debounce ) {
		debounce = debounce || 250;
		var ref  = [datalist];

		if ( !( obj instanceof Element ) || ( datalist !== undefined && datalist.store === undefined ) || ( typeof filters !== "string" || string.isEmpty( filters ) ) ) {
			throw Error( label.error.invalidArguments );
		}

		return new DataListFilter( obj, ref[0], debounce ).set( filters ).init();
	},

	// Inherited by DataListFilters
	methods : {
		/**
		 * Initiate all event listeners
		 *
		 * @returns {Undefined} undefined
		 */
		init : function () {
			observer.add( this.element, "keyup", this.update, "filter", this );
			observer.add( this.element, "input", this.update, "value",  this );

			return this;
		},

		/**
		 * Set the filters
		 * 
		 * Create an object based on comma separated key string
		 * 
		 * @param {String} fields Comma separated filters
		 * @returns {Undefined} undefined
		 */
		set : function ( fields ) {
			var obj = {};

			if ( typeof fields !== "string" || string.isEmpty( fields ) ) {
				throw Error( label.error.invalidArguments );
			}

			array.each( string.explode( fields ), function (v ) {
				obj[v] = "";
			});

			this.filters = obj;

			return this;
		},

		/**
		 * Cancel all event listeners
		 *
		 * @returns {Undefined} undefined
		 */
		teardown : function () {
			observer.remove( this.element, "keyup", "filter" );
			observer.remove( this.element, "input", "value" );

			return this;
		},

		/**
		 * Update the results list
		 *
		 * @returns {Undefined} undefined
		 */
		update : function ( e ) {
			var self = this;

			utility.defer( function () {
				var val = element.val( self.element );
				
				if ( !string.isEmpty( val ) ) {
					utility.iterate( self.filters, function ( v, k ) {
						var queries = string.explode( val );

						// Ignoring trailing commas
						queries = queries.filter( function ( i ) {
							return !string.isEmpty( i );
						});

						// Shaping valid pattern
						array.each( queries, function ( i, idx ) {
							this[idx] = "^" + string.escape( i ).replace( "\\*", ".*" );
						});

						this[k] = queries.join( "," );
					});

					self.datalist.filter = self.filters;
				}
				else {
					self.datalist.filter = null;
				}

				self.datalist.pageIndex = 1;
				self.datalist.refresh( true, ( self.datalist.store.datalists.length > 1 ) );
			}, this.debounce, this.element.id + "Debounce");

			return this;
		}
	}
};

/**
 * DataListFilter factory
 *
 * @class DataListFilter
 * @namespace abaaso
 * @param  {Object} obj      Element to receive the filter
 * @param  {Object} datalist Data list linked to the data store
 * @param  {Number} debounce [Optional] Milliseconds to debounce
 * @return {Object}          Filter instance
 */
function DataListFilter ( element, datalist, debounce ) {
	this.element  = element;
	this.datalist = datalist;
	this.debounce = debounce;
	this.filters  = {};
};

// Setting prototype & constructor loop
DataListFilter.prototype = filter.methods;
DataListFilter.prototype.constructor = DataListFilter;

/**
 * DataGrid
 * 
 * @class grid
 * @namespace abaaso
 */
var grid = {
	/**
	 * DataGrid factory
	 * 
	 * @param  {Object}  element     Element to receive DataGrid
	 * @param  {Object}  store       DataStore
	 * @param  {Array}   fields      Array of fields to display
	 * @param  {Array}   sortable    [Optional] Array of sortable columns/fields
	 * @param  {Object}  options     [Optional] DataList options
	 * @param  {Boolean} filtered    [Optional] Create an input to filter the data grid
	 * @param  {Number}  debounce    [Optional] DataListFilter input debounce, default is 250
	 * @return {Object}              Instance
	 */
	factory : function ( element, store, fields, sortable, options, filtered, debounce ) {
		var ref = [store];

		return new DataGrid( element, ref[0], fields, sortable, options, filtered ).init( debounce );
	},

	// Inherited by DataGrids
	methods : {
		/**
		 * Exports data grid records
		 * 
		 * @return {Array} Record set
		 */
		dump : function () {
			return this.store.dump( this.list.records, this.fields );
		},

		/**
		 * Initializes DataGrid
		 * 
		 * @param  {Number} debounce [Optional] Debounce value for DataListFilter, defaults to 250
		 * @return {Object}          Instance
		 */
		init : function ( debounce ) {
			var self, ref, template, container, header, width, css, sort;

			if ( !this.initialized ) {
				self      = this;
				ref       = [];
				template  = "";
				container = element.create( "section", {"class": "grid"}, this.element );
				header    = element.create( "ul", {"class": "header"}, container );
				width     = ( 100 / this.fields.length ) + "%";
				css       = "display:inline-block;width:" + width;
				sort      = string.explode( this.options.order );

				// Creating DataList template based on fields
				array.each( this.fields, function ( i ) {
					var obj = header.create( "span", {innerHTML: string.capitalize( string.unCamelCase( i ), true ), style: css, "class": i, "data-field": i} );

					// Adding CSS class if "column" is sortable
					if ( self.sortable.contains( i ) ) {
						element.klass( obj, "sortable", true );

						// Applying default sort, if specified
						if ( sort.filter( function ( x ) { return ( x.indexOf( i ) === 0 ); } ).length > 0 ) {
							element.data( obj, "sort", array.contains( sort, i + " desc" ) ? "desc" : "asc" );
						}
					}

					template += "<span class=\"" + i + "\" data-field=\"" + i + "\" style=\"" + css + "\">{{" + i + "}}</span>";
				});

				// Setting click handler on sortable "columns"
				if ( this.sortable.length > 0 ) {
					observer.add( header, "click", this.sort, "sort", this );
				}

				// Creating DataList
				ref.push( datalist.factory( container, this.store, template, this.options ) );

				// Setting by-reference DataList on DataGrid
				this.list = ref[0];

				if ( this.filtered === true ) {
					// Creating DataListFilter
					ref.push( filter.factory( element.create( "input", {"class": "filter"}, container, "first" ), ref[0], this.fields.join( "," ), debounce || 250 ) );
					
					// Setting by-reference DataListFilter on DataGrid
					this.filter = ref[1];
				}

				this.initialized = true;
			}

			return this;
		},

		/**
		 * Refreshes the DataGrid
		 * 
		 * @return {Object} Instance
		 */
		refresh : function () {
			var sort = [],
			    self = this;

			if ( this.sortOrder.length > 0 ) {
				array.each( this.sortOrder, function ( i ) {
					var obj = element.find( self.element, ".header span[data-field='" + i + "']" )[0];

					sort.push( i + " " + element.data( obj, "sort" ) );
				});

				this.list.order = sort.join(", ");
			}

			this.list.refresh();

			return this;
		},

		/**
		 * Sorts the DataGrid when a column header is clicked
		 * 
		 * @param  {Object} e Event
		 * @return {Object}   Instance
		 */
		sort : function ( e ) {
			var target = utility.target( e ),
			    field;

			// Stopping event propogation
			utility.stop( e );

			// Refreshing list if target is sortable
			if ( element.hasClass( target, "sortable" ) ) {
				field = element.data( target, "field" );

				element.data( target, "sort", element.data( target, "sort" ) === "asc" ? "desc" : "asc" );
				array.remove( this.sortOrder, field );
				this.sortOrder.splice( 0, 0, field );
				this.refresh();
			};

			return this;
		},

		/**
		 * Tears down the DataGrid
		 * 
		 * @return {Object} Instance
		 */
		teardown : function () {
			if ( this.filter !== null ) {
				this.filter.teardown();
			}

			this.list.teardown();

			// Removing click handler on DataGrid header
			observer.remove( element.find( this.element, ".header" )[0], "click", "sort" );

			// Destroying DataGrid (from DOM)
			element.destroy( element.find( this.element, ".grid" )[0] );

			return this;
		}
	}
};

/**
 * DataGrid factory
 * 
 * @class DataGrid
 * @namespace abaaso
 * @param  {Object}  element  Element to receive DataGrid
 * @param  {Object}  store    DataStore
 * @param  {Array}   fields   Array of fields to display
 * @param  {Array}   sortable [Optional] Array of sortable columns/fields
 * @param  {Object}  options  [Optional] DataList options
 * @param  {Boolean} filtered [Optional] Create an input to filter the DataGrid
 * @return {Object}           Instance
 */
function DataGrid ( element, store, fields, sortable, options, filtered ) {
	var sortOrder;

	if ( options !== undefined && !string.isEmpty( options.order ) ) {
		sortOrder = string.explode( options.order );

		sortOrder = sortOrder.map(function ( i ) {
			return i.replace( /\s+.*/, "" );
		});
	}

	this.element     = element;
	this.fields      = fields;
	this.filter      = null;
	this.filtered    = ( filtered === true );
	this.initialized = false;
	this.list        = null;
	this.options     = options   || {};
	this.store       = store;
	this.sortable    = sortable  || [];
	this.sortOrder   = sortOrder || sortable || [];
};

// Setting prototype & constructor loop
DataGrid.prototype = grid.methods;
DataGrid.prototype.constructor = DataGrid;

/**
 * JSON methods
 *
 * @class json
 * @namespace abaaso
 */
var json = {
	/**
	 * Transforms JSON to CSV
	 * 
	 * @param  {String}  arg JSON  string to transform
	 * @param  {String}  delimiter [Optional] Character to separate fields
	 * @param  {Boolean} header    [Optional] False to not include field names as first row
	 * @return {String}            CSV string
	 */
	csv : function ( arg, delimiter, header ) {
		delimiter  = delimiter || ",";
		header     = ( header !== false );
		var obj    = json.decode( arg, true ) || arg,
		    result = "",
		    prepare;

		// Prepares input based on CSV rules
		prepare = function ( input ) {
			var output;

			if ( input instanceof Array ) {
				output = "\"" + input.toString() + "\"";

				if ( regex.object_type.test( output ) ) {
					output = "\"" + json.csv( input, delimiter ) + "\"";
				}
			}
			else if ( input instanceof Object ) {
				output = "\"" + json.csv( input, delimiter ) + "\"";
			}
			else if ( regex.csv_quote.test( input ) ) {
				output = "\"" + input.replace( /\n/g, " " ).replace( /"/g, "\"\"" ) + "\"";
			}
			else {
				output = input;
			}

			return output;
		};

		if ( obj instanceof Array ) {
			if ( header ) {
				result  = ( array.keys( obj[0] ).join( delimiter ) + "\n" );
			}

			result += obj.map( function ( i ) {
				return json.csv( i, delimiter, false );
			}).join( "\n" );
		}
		else {
			if ( header ) {
				result = ( array.keys( obj ).join( delimiter ) + "\n" );
			}

			result += ( array.cast( obj ).map( prepare ).join( delimiter ) + "\n" );
		}

		return result.replace(/\n$/, "");
	},

	/**
	 * Decodes the argument
	 *
	 * @method decode
	 * @param  {String}  arg    String to parse
	 * @param  {Boolean} silent [Optional] Silently fail
	 * @return {Mixed}          Entity resulting from parsing JSON, or undefined
	 */
	decode : function ( arg, silent ) {
		try {
			return JSON.parse( arg );
		}
		catch ( e ) {
			if ( silent !== true ) {
				error( e, arguments, this );
			}

			return undefined;
		}
	},

	/**
	 * Encodes the argument as JSON
	 *
	 * @method encode
	 * @param  {Mixed}   arg    Entity to encode
	 * @param  {Boolean} silent [Optional] Silently fail
	 * @return {String}         JSON, or undefined
	 */
	encode : function ( arg, silent ) {
		try {
			return JSON.stringify( arg );
		}
		catch ( e ) {
			if ( silent !== true) {
				error( e, arguments, this );
			}

			return undefined;
		}
	}
};

/**
 * Labels for localization
 *
 * Override this with another language pack
 *
 * @class label
 * @namespace abaaso
 */
var label = {
	// Common labels
	common : {
		back    : "Back",
		cancel  : "Cancel",
		clear   : "Clear",
		close   : "Close",
		cont    : "Continue",
		create	: "Create",
		del     : "Delete",
		edit    : "Edit",
		find    : "Find",
		gen     : "Generate",
		go      : "Go",
		loading : "Loading",
		next    : "Next",
		login   : "Login",
		ran     : "Random",
		reset   : "Reset",
		save    : "Save",
		search  : "Search",
		submit  : "Submit"
	},

	// Days of the week
	day : {
		0 : "Sunday",
		1 : "Monday",
		2 : "Tuesday",
		3 : "Wednesday",
		4 : "Thursday",
		5 : "Friday",
		6 : "Saturday"
	},

	// Error messages
	error : {
		databaseNotOpen       : "Failed to open the Database, possibly exceeded Domain quota",
		databaseNotSupported  : "Client does not support local database storage",
		databaseWarnInjection : "Possible SQL injection in database transaction, use the &#63; placeholder",
		elementNotCreated     : "Could not create the Element",
		elementNotFound       : "Could not find the Element",
		expectedArray         : "Expected an Array",
		expectedArrayObject   : "Expected an Array or Object",
		expectedBoolean       : "Expected a Boolean value",
		expectedNumber        : "Expected a Number",
		expectedProperty      : "Expected a property, and it was not set",
		expectedObject        : "Expected an Object",
		invalidArguments      : "One or more arguments is invalid",
		invalidDate           : "Invalid Date",
		invalidFields         : "The following required fields are invalid: ",
		invalidRoute          : "The route could not be found",
		invalidStateNoHeaders : "INVALID_STATE_ERR: Headers have not been received",
		invalidStateNoSync    : "Synchronous XMLHttpRequest requests are not supported",
		invalidStateNotOpen   : "INVALID_STATE_ERR: Object is not open",
		invalidStateNotSending: "INVALID_STATE_ERR: Object is sending",
		invalidStateNotUsable : "INVALID_STATE_ERR: Object is not usable",
		notAvailable          : "Requested method is not available",
		notSupported          : "This feature is not supported by this platform",
		propertyNotFound      : "Could not find the requested property",
		promisePending        : "The promise cannot be resolved while pending result",
		promiseResolved       : "The promise has been resolved: {{outcome}}",
		serverError           : "Server error has occurred",
		serverForbidden       : "Forbidden to access URI",
		serverInvalidMethod   : "Method not allowed",
		serverUnauthorized    : "Authorization required to access URI",
		readOnly              : "Property is read only",
		upgrade               : "Your browser is too old to use abaaso, please upgrade"
	},

	// Months of the Year
	month : {
		0  : "January",
		1  : "February",
		2  : "March",
		3  : "April",
		4  : "May",
		5  : "June",
		6  : "July",
		7  : "August",
		8  : "September",
		9  : "October",
		10 : "November",
		11 : "December"
	}
};

/**
 * Messaging between iframes
 *
 * @class abaaso
 * @namespace abaaso
 */
var message = {
	/**
	 * Clears the message listener
	 *
	 * @method clear
	 * @return {Object} abaaso
	 */
	clear : function ( state ) {
		state = state || "all";

		return observer.remove( global, "message", "message", state );
	},

	/**
	 * Posts a message to the target
	 *
	 * @method send
	 * @param  {Object} target Object to receive message
	 * @param  {Mixed}  arg    Entity to send as message
	 * @return {Object}        target
	 */
	send : function ( target, arg ) {
		try {
			target.postMessage( arg, "*" );
		}
		catch ( e ) {
			error( e, arguments, this );
		}

		return target;
	},

	/**
	 * Sets a handler for recieving a message
	 *
	 * @method recv
	 * @param  {Function} fn Callback function
	 * @return {Object}      abaaso
	 */
	recv : function ( fn, state ) {
		state = state || "all";

		return observer.add( global, "message", fn, "message", global, state );
	}
};

/**
 * Mouse tracking
 *
 * @class mouse
 * @namespace abaaso
 */
var mouse = {
	//Indicates whether mouse tracking is enabled
	enabled : false,

	// Indicates whether to try logging co-ordinates to the console
	log : false,

	// Mouse coordinates
	diff : {x: null, y: null},
	pos  : {x: null, y: null},
	prev : {x: null, y: null},

	// Caching the view
	view    : function () {
		return client.ie && client.version < 9 ? "documentElement" : "body";
	},

	/**
	 * Enables or disables mouse co-ordinate tracking
	 *
	 * @method track
	 * @param  {Mixed} n Boolean to enable/disable tracking, or Mouse Event
	 * @return {Object}  mouse
	 */
	track : function ( e ) {
		var m  = mouse,
		    ev = "mousemove",
		    n  = "tracking";

		if ( typeof e === "object" ) {
			var v = document[m.view],
			    x = e.pageX ? e.pageX : ( v.scrollLeft + e.clientX ),
			    y = e.pageY ? e.pageY : ( v.scrollTop  + e.clientY ),
			    c = false;

			if ( m.pos.x !== x ) {
				c = true;
			}

			$.mouse.prev.x = m.prev.x = number.parse( m.pos.x, 10 );
			$.mouse.pos.x  = m.pos.x  = x;
			$.mouse.diff.x = m.diff.x = m.pos.x - m.prev.x;

			if ( m.pos.y !== y ) {
				c = true;
			}

			$.mouse.prev.y = m.prev.y = number.parse( m.pos.y, 10 );
			$.mouse.pos.y  = m.pos.y  = y;
			$.mouse.diff.y = m.diff.y = m.pos.y - m.prev.y;

			if ( c && m.log ) {
				utility.log( [m.pos.x, m.pos.y, m.diff.x, m.diff.y] );
			}
		}
		else if ( typeof e === "boolean" ) {
			e ? observer.add( document, ev, mouse.track, n ) : observer.remove( document, ev, n );
			$.mouse.enabled = m.enabled = e;
		}

		return m;
	}
};

/**
 * Number methods
 *
 * @class number
 * @namespace abaaso
 */
var number = {
	/**
	 * Returns the difference of arg
	 *
	 * @method odd
	 * @param {Number} arg Number to compare
	 * @return {Number}    The absolute difference
	 */
	diff : function ( num1, num2 ) {
		if ( isNaN( num1 ) || isNaN( num2 ) ) {
			throw Error( label.error.expectedNumber );
		}

		return Math.abs( num1 - num2 );
	},

	/**
	 * Tests if an number is even
	 *
	 * @method even
	 * @param {Number} arg Number to test
	 * @return {Boolean}   True if even, or undefined
	 */
	even : function ( arg ) {
		return arg % 2 === 0;
	},

	/**
	 * Formats a Number to a delimited String
	 * 
	 * @method format
	 * @param  {Number} arg       Number to format
	 * @param  {String} delimiter [Optional] String to delimit the Number with
	 * @param  {String} every     [Optional] Position to insert the delimiter, default is 3
	 * @return {String}           Number represented as a comma delimited String
	 */
	format : function ( arg, delimiter, every ) {
		if ( isNaN( arg ) ) {
			throw Error( label.error.expectedNumber );
		}

		arg       = arg.toString();
		delimiter = delimiter || ",";
		every     = every     || 3;

		var d = arg.indexOf( "." ) > -1 ? "." + arg.replace( regex.number_format_1, "" ) : "",
		    a = arg.replace( regex.number_format_2, "" ).split( "" ).reverse(),
		    p = Math.floor( a.length / every ),
		    i = 1, n, b;

		for ( b = 0; b < p; b++ ) {
			n = i === 1 ? every : ( every * i ) + ( i === 2 ? 1 : ( i - 1 ) );
			a.splice( n, 0, delimiter );
			i++;
		}

		a = a.reverse().join( "" );

		if ( a.charAt( 0 ) === delimiter ) {
			a = a.substring( 1 );
		}

		return a + d;
	},

	/**
	 * Returns half of a, or true if a is half of b
	 * 
	 * @param  {Number} a Number to divide
	 * @param  {Number} b [Optional] Number to test a against
	 * @return {Mixed}    Boolean if b is passed, Number if b is undefined
	 */
	half : function ( a, b ) {
		return b !== undefined ? ( ( a / b ) === .5 ) : ( a / 2 );
	},

	/**
	 * Tests if a number is odd
	 *
	 * @method odd
	 * @param {Number} arg Number to test
	 * @return {Boolean}   True if odd, or undefined
	 */
	odd : function ( arg ) {
		return !number.even( arg );
	},

	/**
	 * Parses the number
	 * 
	 * @param  {Mixed}  arg  Number to parse
	 * @param  {Number} base Integer representing the base or radix
	 * @return {Number}      Integer or float
	 */
	parse : function ( arg, base ) {
		return ( base === undefined ) ? parseFloat( arg ) : parseInt( arg, base );
	},

	/**
	 * Generates a random number between 0 and arg
	 * 
	 * @param  {Number} arg Ceiling for random number, default is 100
	 * @return {Number}     Random number
	 */
	random : function ( arg ) {
		arg = arg || 100;

		return Math.floor( Math.random() * ( arg + 1 ) );
	},

	/**
	 * Rounds a number up or down
	 * 
	 * @param  {Number} arg       Number to round
	 * @param  {String} direction [Optional] "up" or "down"
	 * @return {Number}           Rounded interger
	 */
	round : function ( arg, direction ) {
		arg = number.parse( arg );

		if ( direction === undefined || string.isEmpty ( direction ) ) {
			return number.parse( arg.toFixed( 0 ) );
		}
		else {
			return Math[!regex.down.test( direction ) ? "ceil" : "floor"]( arg );
		}
	}
};

/**
 * Global Observer wired to a State Machine
 *
 * @class observer
 * @namespace abaaso
 */
var observer = {
	// Collection of listeners
	listeners  : {},

	// Array copy of listeners for observer.fire()
	alisteners : {},

	// Event listeners
	elisteners : {},

	// Tracks count of listeners per event across all states
	clisteners : {},

	// Boolean indicating if events are logged to the console
	log : false,

	// Queue of events to fire
	queue : [],

	// If `true`, events are queued
	silent : false,

	// If `true`, events are ignored
	ignore : false,

	/**
	 * Adds a handler to an event
	 *
	 * @method add
	 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
	 * @param  {String}   event Event, or Events being fired ( comma delimited supported )
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] The id for the listener
	 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Entity, Array of Entities or undefined
	 */
	add : function ( obj, event, fn, id, scope, st ) {
		obj   = utility.object( obj );
		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( obj instanceof Array ) {
			return array.each( obj, function ( i ) {
				observer.add( i, event, fn, id, scope, st );
			});
		}

		if ( event !== undefined ) {
			event = string.explode( event );
		}

		id = id || utility.genId();

		var instance = null,
		    l        = observer.listeners,
		    a        = observer.alisteners,
		    ev       = observer.elisteners,
		    cl       = observer.clisteners,
		    gr       = regex.observer_globals,
		    ar       = regex.observer_allowed,
		    o        = observer.id( obj ),
		    n        = false,
		    c        = state.getCurrent(),
		    add, reg;

		if ( o === undefined || event === null || event === undefined || typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		if ( l[o] === undefined ) {
			l[o]  = {};
			a[o]  = {};
			cl[o] = {};
		}

		array.each( event, function ( i ) {
			var eid = o + "_" + i;

			if ( l[o][i] === undefined ) {
				l[o][i]  = {};
				a[o][i]  = {};
				cl[o][i] = 0;
			}

			if ( l[o][i][st] === undefined ) {
				l[o][i][st] = {};
				a[o][i][st] = [];
			}

			instance = ( gr.test( o ) || (!/\//g.test( o ) && o !== "abaaso" ) ) ? obj : null;

			// Setting up event listener if valid
			if ( instance !== null && instance !== undefined && i.toLowerCase() !== "afterjsonp" && ev[eid] === undefined && ( gr.test( o ) || typeof instance.listeners === "function" ) ) {
				add = ( typeof instance.addEventListener === "function" );
				reg = ( typeof instance.attachEvent === "object" || add );

				if ( reg ) {
					// Registering event listener
					ev[eid] = function ( e ) {
						if ( !ar.test( e.type ) ) {
							utility.stop( e );
						}

						observer.fire( obj, i, e );
					};

					// Hooking event listener
					instance[add ? "addEventListener" : "attachEvent"]( ( add ? "" : "on" ) + i, ev[eid], false );
				}
			}

			l[o][i][st][id] = {fn: fn, scope: scope};
			observer.sync( o, i, st );
			cl[o][i]++;
		});

		return obj;
	},

	/**
	 * Decorates `obj` with `observer` methods
	 * 
	 * @method decorate
	 * @param  {Object} obj Object to decorate
	 * @return {Object}     Object to decorate
	 */
	decorate : function ( obj ) {
		var methods = [
			["fire",      function () { return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) ); }],
			["listeners", function ( event ) { return observer.list(this, event ); }],
			["on",        function ( event, listener, id, scope, standby ) { return observer.add( this, event, listener, id, scope, standby ); }],
			["once",      function ( event, listener, id, scope, standby ) { return observer.once( this, event, listener, id, scope, standby ); }],
			["un",        function ( event, id ) { return observer.remove( this, event, id ); }]
		];

		array.each( methods, function ( i ) {
			utility.property( obj, i[0], {value: i[1], configurable: true, enumerable: true, writable: true} );
		});

		return obj;
	},

	/**
	 * Discard observer events
	 *
	 * @method discard
	 * @param {Boolean} arg [Optional] Boolean indicating if events will be ignored
	 * @return              Current setting
	 */
	discard : function ( arg ) {
		return arg === undefined ? observer.ignore : ( observer.ignore = ( arg === true ) );
	},

	/**
	 * Fires an event
	 *
	 * @method fire
	 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
	 * @param  {String} event Event, or Events being fired ( comma delimited supported )
	 * @return {Mixed}        Entity, Array of Entities or undefined
	 */
	fire : function ( obj, event ) {
		obj      = utility.object( obj );
		var quit = false,
		    a    = array.cast( arguments ).remove( 0, 1 ),
		    o, a, s, log, c, l, list;

		if ( observer.ignore ) {
			return obj;
		}

		if ( obj instanceof Array ) {
			array.each( obj, function (i ) {
				a = [i, event].concat( a );
				observer.fire.apply( observer, a );
			});

			return obj;
		}

		o = observer.id( obj );

		if ( o === undefined || event === undefined ) {
			throw Error( label.error.invalidArguments );
		}

		if ( observer.silent ) {
			observer.queue.push( {obj: obj, event: event} );
		}
		else {
			s   = state.getCurrent();
			log = $.logging;

			array.each( string.explode( event ), function ( e ) {
				if ( log ) {
					utility.log(o + " firing " + e );
				}

				list = observer.list( obj, e, observer.alisteners );

				if ( list.all !== undefined ) {
					array.each( list.all, function ( i ) {
						var result = i.fn.apply( i.scope, a );

						if ( result === false ) {
							quit = true;

							return result;
						}
					});
				}

				if ( !quit && s !== "all" && list[s] !== undefined ) {
					array.each( list[s], function ( i ) {
						return i.fn.apply( i.scope, a );
					});
				}
			});
		}

		return obj;
	},

	/**
	 * Gets the Observer id of arg
	 *
	 * @method id
	 * @param  {Mixed}  Object or String
	 * @return {String} Observer id
	 * @private
	 */
	id : function ( arg ) {
		var id;

		if ( arg === abaaso ) {
			id = "abaaso";
		}
		else if ( arg === global ) {
			id = "window";
		}
		else if ( !server && arg === document ) {
			id = "document";
		}
		else if ( !server && arg === document.body ) {
			id = "body";
		}
		else {
			utility.genId( arg );
			id = arg.id || ( typeof arg.toString === "function" ? arg.toString() : arg );
		}

		return id;
	},

	/**
	 * Gets the listeners for an event
	 *
	 * @method list
	 * @param  {Mixed}  obj    Entity or Array of Entities or $ queries
	 * @param  {String} event  Event being queried
	 * @param  {Object} target [Optional] Listeners collection to access, default is `observer.listeners`
	 * @return {Mixed}         Object or Array of listeners for the event
	 */
	list : function ( obj, event, target ) {
		obj   = utility.object( obj );
		var l = target || observer.listeners,
		    o = observer.id( obj ),
		    r;

		if ( l[o] === undefined && event === undefined ) {
			r = {};
		}
		else if ( l[o] !== undefined && ( event === undefined || string.isEmpty( event ) ) ) {
			r = l[o];
		}
		else if ( l[o] !== undefined && l[o][event] !== undefined ) {
			r = l[o][event];
		}
		else {
			r = {};
		}

		return r;
	},

	/**
	 * Adds a listener for a single execution
	 * 
	 * @method once
	 * @param  {Mixed}    obj   Entity or Array of Entities or $ queries
	 * @param  {String}   event Event being fired
	 * @param  {Function} fn    Event handler
	 * @param  {String}   id    [Optional / Recommended] The id for the listener
	 * @param  {String}   scope [Optional / Recommended] The id of the object or element to be set as 'this'
	 * @param  {String}   st    [Optional] Application state, default is current
	 * @return {Mixed}          Entity, Array of Entities or undefined
	 */
	once : function ( obj, event, fn, id, scope, st ) {
		var uuid = id || utility.genId();

		obj   = utility.object( obj );
		scope = scope || obj;
		st    = st    || state.getCurrent();

		if ( obj === undefined || event === null || event === undefined || typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		if ( obj instanceof Array ) {
			array.each( obj, function ( i ) {
				observer.once( i, event, fn, id, scope, st );
			});

			return obj;
		}

		observer.add( obj, event, function () {
			fn.apply( scope, arguments );
			observer.remove( obj, event, uuid, st );
		}, uuid, scope, st);

		return obj;
	},

	/**
	 * Pauses observer events, and queues them
	 * 
	 * @param  {Boolean} arg Boolean indicating if events will be queued
	 * @return {Boolean}     Current setting
	 */
	pause : function ( arg ) {
		if ( arg === true ) {
			observer.silent = arg;
		}
		else if ( arg === false ) {
			observer.silent = arg;

			array.each( observer.queue, function ( i ) {
				observer.fire( i.obj, i.event );
			});

			observer.queue = [];
		}

		return arg;
	},

	/**
	 * Removes listeners
	 *
	 * @method remove
	 * @param  {Mixed}  obj   Entity or Array of Entities or $ queries
	 * @param  {String} event [Optional] Event, or Events being fired ( comma delimited supported )
	 * @param  {String} id    [Optional] Listener id
	 * @param  {String} st    [Optional] Application state, default is current
	 * @return {Mixed}        Entity, Array of Entities or undefined
	 */
	remove : function ( obj, event, id, st ) {
		obj = utility.object( obj );
		st  = st || state.getCurrent()

		if ( obj instanceof Array ) {
			return array.each( obj, function ( i ) {
				observer.remove( i, event, id, st );
			});
		}

		var instance = null,
		    l        = observer.listeners,
		    a        = observer.alisteners,
		    ev       = observer.elisteners,
		    cl       = observer.clisteners,
		    o        = observer.id( obj ),
		    add      = ( typeof obj.addEventListener === "function" ),
		    reg      = ( typeof obj.attachEvent === "object" || add ),
		    fn;

		/**
		 * Removes DOM event hook
		 * 
		 * @method fn
		 * @param  {Mixed}  event String or null
		 * @param  {Number} i     Amount of listeners being removed
		 * @return {Undefined}    undefined
		 */
		fn = function ( event, i ) {
			var unhook = ( typeof i === "number" && ( cl[o][event] = ( cl[o][event] - i ) ) === 0 );

			if ( unhook && reg ) {
				obj[add ? "removeEventListener" : "detachEvent"]( ( add ? "" : "on" ) + event, ev[o + "_" + event], false );
				delete ev[o + "_" + event];
			}
		}

		if ( l[o] === undefined ) {
			return obj;
		}

		if ( event === undefined || event === null ) {
			if ( regex.observer_globals.test( o ) || typeof o.listeners === "function" ) {
				utility.iterate( ev, function ( v, k ) {
					if ( k.indexOf( o + "_" ) === 0) {
						fn( k.replace( /.*_/, "" ), 1 );
					}
				});
			}

			delete l[o];
			delete a[o];
			delete cl[o];
		}
		else {
			array.each( string.explode( event ), function ( e ) {
				var sync = false;

				if ( l[o][e] === undefined ) {
					return;
				}

				if ( id === undefined ) {
					if ( regex.observer_globals.test( o ) || typeof o.listeners === "function" ) {
						fn( e, array.keys( l[o][e][st] ).length );
					}

					l[o][e][st] = {};
					sync = true;
				}
				else if ( l[o][e][st][id] !== undefined ) {
					fn( e, 1 );
					delete l[o][e][st][id];
					sync = true;
				}

				if ( sync ) {
					observer.sync( o, e, st );
				}
			});
		}

		return obj;
	},

	/**
	 * Returns the sum of active listeners for one or all Objects
	 * 
	 * @method sum
	 * @param  {Mixed} obj [Optional] Entity
	 * @return {Object}     Object with total listeners per event
	 */
	sum : function ( obj ) {
		var result = {},
		    o;

		if ( obj !== undefined ) {
			obj    = utility.object( obj );
			o      = observer.id( obj );
			result = utility.clone( observer.clisteners[o] );
		}
		else {
			result = utility.clone( observer.clisteners );
		}

		return result;
	},

	/**
	 * Syncs `alisteners` with `listeners`
	 * 
	 * @method sync
	 * @param  {String} obj   Object ID 
	 * @param  {String} event Event
	 * @param  {String} st    Application state
	 * @return {Undefined}    undefined
	 */
	sync : function ( obj, event, st ) {
		observer.alisteners[obj][event][st] = array.cast( observer.listeners[obj][event][st] );
	}
};

/**
 * Promises/A+
 *
 * @class promise
 * @namespace abaaso
 */
var promise = {
	/**
	 * Promise factory
	 * 
	 * @method factory
	 * @return {Object} Instance of promise
	 */
	factory : function () {
		return new Promise();
	},

	// Caching if this function is available
	freeze : (function () {
		return (typeof Object.freeze === "function");
	})(),

	// Inherited by promises
	methods : {
		/**
		 * Breaks a Promise
		 * 
		 * @method reject
		 * @param  {Mixed} arg Promise outcome
		 * @return {Object} Promise
		 */
		reject : function ( arg ) {
			var self = this;

			utility.defer( function () {
				promise.resolve.call( self, promise.state.broken, arg );
			});

			return this;
		},

		/**
		 * Promise is resolved
		 * 
		 * @method resolve
		 * @param  {Mixed} arg Promise outcome
		 * @return {Object}    Promise
		 */
		resolve : function ( arg ) {
			var self = this;

			utility.defer( function () {
				promise.resolve.call( self, promise.state.resolved, arg );
			});

			return this;
		},

		/**
		 * Returns a boolean indicating state of the Promise
		 * 
		 * @method resolved
		 * @return {Boolean} `true` if resolved
		 */
		resolved : function () {
			return ( this.state === promise.state.broken || this.state === promise.state.resolved );
		},

		/**
		 * Registers handler( s ) for a Promise
		 * 
		 * @method then
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           New Promise instance
		 */
		then : function ( success, failure ) {
			var self     = this,
			    deferred = promise.factory(),
			    fn;

			fn = function ( yay ) {
				var handler = yay ? success : failure,
				    error   = yay ? false   : true,
				    result;

				try {
					result = handler( self.outcome );
					error  = false;
				}
				catch ( e ) {
					result = e;
					error  = true;
					if ( result !== undefined && !( result instanceof Error ) ) {
						// Encoding Array or Object as a JSON string for transmission
						if ( typeof result === "object" ) {
							result = json.encode( result );
						}

						// Casting to an Error to fix context
						result = Error( result );
					}
				}
				finally {
					// Not a Promise, passing result & chaining if applicable
					if ( !( result instanceof Promise ) ) {
						// This is clearly a mistake on the dev's part
						if ( error && result === undefined ) {
							throw Error( label.error.invalidArguments );
						}
						else {
							deferred[!error ? "resolve" : "reject"]( result || self.outcome );
						}
					}
					// Assuming a `pending` state until `result` is resolved
					else {
						self.state        = promise.state.pending;
						self.outcome      = null;
						result.parentNode = self;
						result.then( function ( arg ) {
							array.each( self.children, function ( i ) {
								i.resolve( arg );
							});
						}, function ( e ) {
							array.each( self.children, function ( i ) {
								i.reject( e );
							});
						});
					}

					return result;
				}
			};

			if ( typeof success === "function" ) {
				promise.vouch.call( this, promise.state.resolved, function () {
					return fn(true); 
				});
			}

			if ( typeof failure === "function" ) {
				promise.vouch.call( this, promise.state.broken, function () {
					return fn(false);
				});
			}

			// Setting references
			deferred.parentNode = self;
			self.children.push( deferred );

			return deferred;
		}
	},

	/**
	 * Resolves a Promise ( fulfilled or failed )
	 * 
	 * @method resolve
	 * @param  {String} state State to resolve
	 * @param  {String} val   Value to set
	 * @return {Object}       Promise instance
	 */
	resolve : function ( state, val ) {
		var handler = state === promise.state.broken ? "error" : "fulfill",
		    self    = this,
		    pending = false,
		    error   = false,
		    purge   = [],
		    i, reason, result;

		if ( this.state !== promise.state.pending ) {
			// Walking "forward" from a reverse chain or a fork, we've already been here...
			if ( ( this.parentNode !== null && this.parentNode.state === promise.state.resolved ) || this.children.length > 0 ) {
				return;
			}
			else {
				throw Error( label.error.promiseResolved.replace( "{{outcome}}", this.outcome ) );
			}
		}

		this.state   = state;
		this.outcome = val;

		// The state & outcome can mutate here
		array.each( this[handler], function ( fn, idx ) {
			result = fn.call( self, val );
			purge.push( idx );

			if ( result instanceof Promise ) {
				pending      = true;
				self.outcome = null;
				self.state   = promise.state.pending

				return false;
			}
			else if ( result instanceof Error ) {
				error  = true;
				reason = result;
				state  = promise.state.broken;
			}
		});

		if ( !pending ) {
			this.error   = [];
			this.fulfill = [];

			// Possible jump to 'resolve' logic
			if ( !error ) {
				result = reason;
				state  = promise.state.resolved;
			}

			// Reverse chaining
			if ( this.parentNode !== null && this.parentNode.state === promise.state.pending ) {
				this.parentNode[state === promise.state.resolved ? "resolve" : "reject"]( result || this.outcome );
			}

			// Freezing promise
			if ( promise.freeze ) {
				Object.freeze( this );
			}

			return this;
		}
		else {
			// Removing handlers that have run
			i = purge.length;
			while ( i-- ) {
				array.remove( self[handler], purge[i] );
			}

			return result;
		}
	},

	// States of a promise
	state : {
		broken   : "rejected",
		pending  : "pending",
		resolved : "fulfilled"
	},

	/**
	 * Vouches for a state
	 * 
	 * @method vouch
	 * @param  {String}   state Promise descriptor
	 * @param  {Function} fn    Function to execute
	 * @return {Object}         Promise instance
	 */
	vouch : function ( state, fn ) {
		if ( string.isEmpty( state ) ) {
			throw Error( label.error.invalidArguments );
		}

		if ( this.state === promise.state.pending ) {
			this[state === promise.state.resolved ? "fulfill" : "error"].push( fn );
		}
		else if ( this.state === state ) {
			fn( this.outcome );
		}

		return this;
	}
};

/**
 * Promise factory
 *
 * @class Promise
 * @namespace abaaso
 * @return {Object} Instance of Promise
 */
function Promise () {
	this.children   = [];
	this.error      = [];
	this.fulfill    = [];
	this.parentNode = null;
	this.outcome    = null;
	this.state      = promise.state.pending;
};

// Setting prototype & constructor loop
Promise.prototype = promise.methods;
Promise.prototype.constructor = Promise;

/**
 * URI routing via hashtag
 *
 * Client side routes will be in routes.all
 * 
 * @class route
 * @namespace abaaso
 */
var route = {
	// Current route ( Client only )
	current : "",

	// Initial / default route
	initial : null,

	// Reused regex object
	reg : new RegExp(),

	// Routing listeners
	routes : {},

	/**
	 * Determines which HTTP method to use
	 * 
	 * @param  {String} arg HTTP method
	 * @return {[type]}     HTTP method to utilize
	 */
	method : function ( arg ) {
		return regex.route_methods.test( arg ) ? arg.toLowerCase() : "all";
	},

	/**
	 * Deletes a route
	 * 
	 * @method del
	 * @param  {String} name  Route name
	 * @param  {String} verb  HTTP method
	 * @return {Mixed}        True or undefined
	 */
	del : function ( name, verb, host ) {
		host      = host || "all";
		verb      = route.method( verb );
		var error = ( name === "error" );

		if ( ( error && verb !== "all" ) || ( !error && route.routes[host][verb].hasOwnProperty( name ) ) ) {
			if ( route.initial === name ) {
				route.initial = null;
			}

			return ( delete route.routes[host][verb][name] );
		}
		else {
			throw Error( label.error.invalidArguments );
		}
	},

	/**
	 * Getter / setter for the hashbang
	 * 
	 * @method hash
	 * @param  {String} arg Route to set
	 * @return {String}     Current route
	 */
	hash : function ( arg ) {
		var output = "";

		if ( !server ) {
			if ( arg === undefined ) {
				output = document.location.hash.replace( regex.hash_bang, "" );
			}
			else {
				output = arg.replace( regex.hash_bang, "" );
				document.location.hash = "!" + output;
			}
		}

		return output;
	},

	/**
	 * Creates a hostname entry in the routes table
	 * 
	 * @param  {String} arg Hostname to route
	 * @return {Object}     Routes for hostname
	 */
	hostname : function ( arg ) {
		if ( !route.routes.hasOwnProperty( arg ) ) {
			route.routes[arg] = {
				all      : {},
				"delete" : {},
				get      : {},
				post     : {},
				put      : {}
			};
		}

		return route.routes[arg];
	},

	/**
	 * Initializes the routing by loading the initial OR the first route registered
	 * 
	 * @method init
	 * @return {Undefined} undefined
	 */
	init : function () {
		var val = document.location.hash;

		string.isEmpty( val ) ? route.hash( route.initial !== null ? route.initial : array.cast( route.routes.all.all, true ).remove( "error" )[0] ) : route.load( val );
	},

	/**
	 * Lists all routes
	 * 
	 * @set list
	 * @param {String} verb  HTTP method
	 * @return {Mixed}       Hash of routes if not specified, else an Array of routes for a method
	 */
	list : function ( verb, host ) {
		host = host || "all";
		var result;

		if ( !server ) {
			result = array.cast( route.routes.all.all, true );
		}
		else if ( verb !== undefined && route.routes.hasOwnProperty( host ) ) {
			result = array.cast( route.routes[host][route.method( verb )], true );
		}
		else {
			result = [];

			if ( route.routes.hasOwnProperty( host ) ) {
				utility.iterate( route.routes[host], function ( v, k ) {
					result[k] = [];
					utility.iterate( v, function ( fn, r ) {
						result[k].push( r );
					});
				});
			}
		}

		if ( !server && host !== "all" ) {
			utility.iterate( route.routes.all, function ( v, k ) {
				if ( result[k] === undefined ) {
					result[k] = [];
				}

				utility.iterate( v, function ( fn, r ) {
					result[k].push( r );
				});
			});
		}

		return result;
	},

	/**
	 * Loads the hash into the view
	 * 
	 * @method load
	 * @param  {String} name  Route to load
	 * @param  {Object} arg   [Optional] HTTP response ( node )
	 * @param  {String} req   [Optional] HTTP request ( node )
	 * @param  {String} host  [Optional] Hostname to query
	 * @return {Mixed}        True or undefined
	 */
	load : function ( name, res, req, host ) {
		req        = req  || "all";
		host       = host || "all";
		var active = "",
		    path   = "",
		    result = true,
		    found  = false,
		    verb   = route.method( req.method || req ),
		    crawl, find;

		// Not a GET, but assuming the route is smart enough to strip the entity body
		if ( regex.route_nget.test( verb ) ) {
			verb = "get";
		}

		// Public, private, local scope
		name = name.replace( /^\#\!?|\?.*|\#.*/g, "" );

		if ( !server ) {
			route.current = name;
		}

		// Crawls the hostnames
		crawl = function ( host, verb, name ) {
			if ( route.routes[host][verb][name] !== undefined ) {
				active = name;
				path   = verb;
			}
			else if ( verb !== "all" && route.routes[host].all[name] !== undefined ) {
				active = name;
				path   = "all";
			}
			else {
				utility.iterate( route.routes[host][verb], function ( v, k ) {
					return find( k, verb, name );
				});

				if ( string.isEmpty( active ) && verb !== "all" ) {
					utility.iterate( route.routes[host].all, function ( v, k ) {
						return find( k, "all", name );
					});
				}
			}
		};

		// Finds a match
		find = function ( pattern, method, arg ) {
			if ( utility.compile( route.reg, "^" + pattern + "$" ) && route.reg.test( arg ) ) {
				active = pattern;
				path   = method;

				return false;
			}
		};

		if ( host !== "all" && !route.routes.hasOwnProperty( host ) ) {
			array.each( array.cast( route.routes, true ), function ( i ) {
				var regex = new RegExp( i.replace(/^\*/g, ".*") );

				if ( regex.test( host ) ) {
					host  = i;
					found = true;

					return false;
				}
			});

			if ( !found ) {
				host = "all";
			}
		}

		crawl( host, verb, name );

		if ( string.isEmpty( active ) ) {
			if ( host !== "all" ) {
				host = "all";
				crawl( host, verb, name );
			}

			if ( string.isEmpty( active ) ) {
				active = "error";
				path   = "all";
				result = false;
			}
		}

		route.routes[host][path][active]( res || active, req );

		return result;
	},

	/**
	 * Resets the routes
	 * 
	 * @return {Undefined} undefined
	 */
	reset : function () {
		route.routes = {
			all : {
				all : {
					error : function () {
						if ( !server ) {
							if ( string.isEmpty( route.hash() ) ) {
								return history.go( -1 );
							}
							else {
								utility.error( label.error.invalidRoute );
								if ( route.initial !== null ) {
									route.hash( route.initial );
								}
							}
						}
						else {
							throw Error( label.error.invalidRoute );
						}
					}
				},
				"delete" : {},
				get      : {},
				put      : {},
				post     : {}
			}
		}
	},

	/**
	 * Creates a Server with URI routing
	 * 
	 * @method server
	 * @param  {Object}   arg  Server options
	 * @param  {Function} fn   Error handler
	 * @param  {Boolean}  ssl  Determines if HTTPS server is created
	 * @return {Object}        Server
	 */
	server : function ( args, fn, ssl ) {
		var maxConnections = 25,
		    handler, err, obj;

		if ( !server ) {
			throw Error( label.error.notSupported );
		}

		args = args || {};
		ssl  = ( ssl === true || args.port === 443 );

		// Request handler
		handler = function ( req, res ) {
			var parsed   = url.parse( req.url ),
			    hostname = req.headers.host.replace( regex.header_replace, "" );

			route.load( parsed.pathname, res, req, hostname );
		};

		// Error handler
		err = function ( e ) {
			error( e, this, arguments );

			if ( typeof fn === "function" ) {
				fn( e );
			}
		};

		// Enabling routing, in case it's not explicitly enabled prior to route.server()
		route.enabled = true;

		// Server parameters
		args.host = args.host || undefined;
		args.port = args.port || 8000;

		// Creating server
		if (!ssl) {
			// For proxy behavior
			http.globalAgent.maxConnections = args.maxConnections  || maxConnections;

			obj = http.createServer( handler ).on( "error", err ).listen( args.port, args.host );

			if (obj.maxConnections) {
				obj.maxConnections = args.maxConnections || maxConnections;
			}
		}
		else {
			// For proxy behavior
			https.globalAgent.maxConnections = args.maxConnections;

			obj = https.createServer( args, handler ).on( "error", err).listen( args.port );

			if (obj.maxConnections) {
				obj.maxConnections = args.maxConnections || maxConnections;
			}
		}
		
		return obj;
	},

	/**
	 * Sets a route for a URI
	 * 
	 * @method set
	 * @param  {String}   name  Regex pattern for the route
	 * @param  {Function} fn    Route listener
	 * @param  {String}   verb  HTTP method the route is for ( default is GET )
	 * @return {Mixed}          True or undefined
	 */
	set : function ( name, fn, verb, host ) {
		host = server ? ( host || "all" )    : "all";
		verb = server ? route.method( verb ) : "all";

		if ( typeof name !== "string" || string.isEmpty( name ) || typeof fn !== "function") {
			throw Error( label.error.invalidArguments );
		}

		route.hostname( host )[verb][name] = fn;

		return true;
	}
};

/**
 * Application state
 * 
 * @class state
 * @namespace abaaso
 */
var state = ( function () {
	var prop = {current: "active", previous: null, header: null},
	    getCurrent, setCurrent, getHeader, setHeader, getPrevious, setPrevious;

	/**
	 * Gets current application state
	 * 
	 * @method getCurrent
	 * @return {String} Application state
	 */
	getCurrent = function () {
		return prop.current;
	};

	/**
	 * Sets current application state
	 * 
	 * @method setCurrent
	 * @param  {String} arg New application state
	 * @return {String}     Application state
	 */
	setCurrent = function ( arg ) {
		if ( arg === null || typeof arg !== "string" || prop[0] === arg || string.isEmpty( arg ) ) {
			throw Error( label.error.invalidArguments );
		}

		prop.previous = prop.current
		prop.current  = arg;

		observer.fire( abaaso, "state", arg );

		return arg;
	};

	/**
	 * Gets current application state header
	 * 
	 * @method getHeader
	 * @return {String} Application state header
	 */
	getHeader = function () {
		return prop.header;
	};

	/**
	 * Sets current application state header
	 * 
	 * @method setHeader
	 * @param  {String} arg New application state header
	 * @return {String}     Application state header
	 */
	setHeader = function ( arg ) {
		if ( arg !== null && ( typeof arg !== "string" || prop.header === arg || string.isEmpty( arg ) ) ) {
			throw Error( label.error.invalidArguments );
		}

		prop.header = arg;

		return arg;
	};

	/**
	 * Gets previous application state
	 * 
	 * @method getPrevious
	 * @return {String} Previous application state
	 */
	getPrevious = function () {
		return prop.previous;
	};

	/**
	 * Exists because you can't mix accessor & data descriptors
	 *
	 * @method setPrevious
	 * @return {Undefined} undefined
	 */
	setPrevious = function () {
		throw Error( label.error.readOnly );
	};

	// interface
	return {
		getCurrent  : getCurrent,
		setCurrent  : setCurrent,
		getHeader   : getHeader,
		setHeader   : setHeader,
		getPrevious : getPrevious,
		setPrevious : setPrevious
	};
})();

/**
 * String methods
 * 
 * @class string
 * @namespace abaaso
 */
var string = {
	/**
	 * Capitalizes the String
	 * 
	 * @method capitalize
	 * @param  {String}  obj String to capitalize
	 * @param  {Boolean} all [Optional] Capitalize each word
	 * @return {String}      Capitalized String
	 */
	capitalize : function ( obj, all ) {
		obj = string.trim( obj );
		all = ( all === true );

		var result;

		if ( all ) {
			result = string.explode( obj, " " ).map( function ( i ) {
				return i.charAt( 0 ).toUpperCase() + i.slice( 1 );
			}).join(" ");
		}
		else {
			result = obj.charAt( 0 ).toUpperCase() + obj.slice( 1 );
		}

		return result;
	},

	/**
	 * Escapes meta characters within a string
	 * 
	 * @method escape
	 * @param  {String} obj String to escape
	 * @return {String}     Escaped string
	 */
	escape : function ( obj ) {
		return obj.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
	},

	/**
	 * Splits a string on comma, or a parameter, and trims each value in the resulting Array
	 * 
	 * @method explode
	 * @param  {String} obj String to capitalize
	 * @param  {String} arg String to split on
	 * @return {Array}      Array of the exploded String
	 */
	explode : function ( obj, arg ) {
		if ( arg === undefined || arg.toString() === "" ) {
			arg = ",";
		}

		return string.isEmpty( obj ) ? [] : string.trim( obj ).split( new RegExp( "\\s*" + arg + "\\s*" ) );
	},

	/**
	 * Replaces all spaces in a string with dashes
	 * 
	 * @method hyphenate
	 * @param  {String} obj   String to hyphenate
	 * @param {Boolean} camel [Optional] Hyphenate camelCase
	 * @return {String}       String with dashes instead of spaces
	 */
	hyphenate : function ( obj, camel ) {
		var result = string.trim( obj ).replace( /\s+/g, "-" );

		if ( camel === true ) {
			result = result.replace( /([A-Z])/g, "-\$1" ).toLowerCase();
		}

		return result;
	},

	/**
	 * Tests if a string is alpha-numeric
	 * 
	 * @method isAlphaNum
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isAlphaNum : function ( obj ) {
		return validate.test( {alphanum: obj} ).pass;
	},

	/**
	 * Tests if a string is a boolean
	 * 
	 * @method isBoolean
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isBoolean : function ( obj ) {
		return validate.test( {"boolean": obj} ).pass;
	},

	/**
	 * Tests if a string a date
	 * 
	 * @method isDate
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isDate : function ( obj ) {
		return validate.test( {date: obj} ).pass;
	},

	/**
	 * Tests if a string is a domain
	 * 
	 * @method isDomain
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isDomain : function ( obj ) {
		return validate.test( {domain: obj} ).pass;
	},

	/**
	 * Tests if a string is an email address
	 * 
	 * @method isEmail
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isEmail : function ( obj ) {
		return validate.test( {email: obj} ).pass;
	},

	/**
	 * Tests if a string is empty
	 * 
	 * @method isEmpty
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isEmpty : function ( obj ) {
		return obj !== undefined ? ( string.trim( obj ) === "" ) : true;
	},

	/**
	 * Tests if a string is an IP address
	 * 
	 * @method isIP
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isIP : function ( obj ) {
		return validate.test( {ip: obj} ).pass;
	},

	/**
	 * Tests if a string is an integer
	 * 
	 * @method isInt
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isInt : function ( obj ) {
		return validate.test( {integer: obj} ).pass;
	},

	/**
	 * Tests if a string is a number
	 * 
	 * @method isNumber
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isNumber : function ( obj ) {
		return validate.test( {number: obj} ).pass;
	},

	/**
	 * Tests if a string is a phone number
	 * 
	 * @method isPhone
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isPhone : function ( obj ) {
		return validate.test( {phone: obj} ).pass;
	},

	/**
	 * Tests if a string is a URL
	 * 
	 * @method isUrl
	 * @param  {String}  obj String to test
	 * @return {Boolean}     Result of test
	 */
	isUrl : function ( obj ) {
		return validate.test( {url: obj} ).pass;
	},

	/**
	 * Returns singular form of the string
	 * 
	 * @method singular
	 * @param  {String} obj String to transform
	 * @return {String}     Transformed string
	 */
	singular : function ( obj ) {
		return regex.plural.test( obj ) ? obj.slice( 0, -1 ) : obj;
	},

	/**
	 * Transforms the case of a String into CamelCase
	 * 
	 * @method toCamelCase
	 * @param  {String} obj String to capitalize
	 * @return {String}     Camel case String
	 */
	toCamelCase : function ( obj ) {
		var s = string.trim( obj ).replace( /\.|_|-|\@|\[|\]|\(|\)|\#|\$|\%|\^|\&|\*|\s+/g, " " ).toLowerCase().split( regex.space_hyphen ),
		    r = [];

		array.each( s, function ( i, idx ) {
			r.push( idx === 0 ? i : string.capitalize(i) );
		});

		return r.join( "" );
	},

	/**
	 * Trims the whitespace around a String
	 * 
	 * @method trim
	 * @param  {String} obj String to capitalize
	 * @return {String}     Trimmed String
	 */
	trim : function ( obj ) {
		return obj.toString().replace( /^(\s+|\t+)|(\s+|\t+)$/g, "" );
	},

	/**
	 * Uncamelcases the String
	 * 
	 * @method unCamelCase
	 * @param  {String} obj String to uncamelcase
	 * @return {String}     Uncamelcased String
	 */
	unCamelCase : function ( obj ) {
		return string.trim( obj.replace(/([A-Z])/g, " $1").toLowerCase() );
	},

	/**
	 * Uncapitalizes the String
	 * 
	 * @method uncapitalize
	 * @param  {String} obj String to uncapitalize
	 * @return {String}     Uncapitalized String
	 */
	uncapitalize : function ( obj ) {
		obj = string.trim( obj );

		return obj.charAt( 0 ).toLowerCase() + obj.slice( 1 );
	},

	/**
	 * Replaces all hyphens with spaces
	 * 
	 * @method unhyphenate
	 * @param  {String}  obj  String to unhypenate
	 * @param  {Boolean} caps [Optional] True to capitalize each word
	 * @return {String}       Unhyphenated String
	 */
	unhyphenate : function ( obj, caps ) {
		caps       = ( caps === true );
		var result = "";

		if ( obj.indexOf( "-" ) > -1 ) {
			array.each( string.trim( obj ).split( "-" ), function ( i ) {
				result += ( caps ? string.capitalize( i ) : i ) + " ";
			});
		}
		else {
			result = caps ? string.capitalize( obj ) : obj;
		}

		return string.trim( result );
	}
};

/**
 * Utilities
 *
 * @class utility
 * @namespace abaaso
 */
var utility = {
	// Collection of timers
	timer : {},

	// Collection of repeating functions
	repeating: {},

	/**
	 * Queries the DOM using CSS selectors and returns an Element or Array of Elements
	 * 
	 * Accepts comma delimited queries
	 *
	 * @method $
	 * @param  {String}  arg      Comma delimited string of target #id, .class, tag or selector
	 * @param  {Boolean} nodelist [Optional] True will return a NodeList ( by reference ) for tags & classes
	 * @return {Mixed}            Element or Array of Elements
	 */
	$ : function ( arg, nodelist ) {
		if ( document === undefined || arg === undefined ) {
			return undefined;
		}

		var queries = [],
		    result  = [],
		    tmp     = [];

		queries  = string.explode( arg );
		nodelist = ( nodelist === true );

		array.each( queries, function ( query ) {
			var obj, sel;

			if ( regex.selector_complex.test( query) ) {
				sel = array.last( query.split( " " ).filter( function ( i ) {
					if ( !string.isEmpty( i ) && i !== ">" ) {
						return true;
					}
				}));

				if ( regex.hash.test( sel ) && !regex.selector_many.test( sel ) ) {
					obj = document.querySelector( query );
				}
				else {
					obj = document.querySelectorAll( query );

					if ( !nodelist ) {
						obj = array.cast( obj );
					}
				}
			}
			else if ( regex.hash.test( query ) && !regex.selector_many.test( query ) ) {
				obj = document.querySelector( query )
			}
			else {
				obj = document.querySelectorAll( query );

				if ( !nodelist ) {
					obj = array.cast( obj );
				}
			}

			if ( obj !== null ) {
				tmp.push( obj );
			}
		});

		array.each( tmp, function ( i ) {
			result = result.concat( i );
		});

		if ( regex.hash.test( arg ) && !regex.selector_many.test( arg ) && !regex.selector_complex.test( arg ) ) {
			result = result[0];
		}

		return result;
	},

	/**
	 * Aliases origin onto obj
	 *
	 * @method alias
	 * @param  {Object} obj    Object receiving aliasing
	 * @param  {Object} origin Object providing structure to obj
	 * @return {Object}        Object receiving aliasing
	 */
	alias : function ( obj, origin ) {
		var o = obj,
		    s = origin;

		utility.iterate( s, function ( v, k ) {
			var getter, setter;

			if ( !( v instanceof RegExp ) && typeof v === "function" ) {
				o[k] = v.bind( o[k] );
			}
			else if ( !(v instanceof RegExp ) && !(v instanceof Array ) && v instanceof Object ) {
				if ( o[k] === undefined ) {
					o[k] = {};
				}

				utility.alias( o[k], s[k] );
			}
			else {
				getter = function () {
					return s[k];
				};

				setter = function ( arg ) {
					s[k] = arg;
				};

				utility.property( o, k, {enumerable: true, get: getter, set: setter, value: s[k]} );
			}
		});

		return obj;
	},

	/**
	 * Clears deferred & repeating functions
	 * 
	 * @param  {String} id ID of timer( s )
	 * @return {Undefined} undefined
	 */
	clearTimers : function ( id ) {
		if ( id === undefined || id.isEmpty() ) {
			throw Error( label.error.invalidArguments );
		}

		// deferred
		if ( utility.timer[id] !== undefined ) {
			clearTimeout( utility.timer[id] );
			delete utility.timer[id];
		}

		// repeating
		if ( utility.repeating[id] !== undefined ) {
			clearTimeout( utility.repeating[id] );
			delete utility.repeating[id];
		}
	},

	/**
	 * Clones an Object
	 *
	 * @method clone
	 * @param {Object}  obj Object to clone
	 * @return {Object}     Clone of obj
	 */
	clone : function ( obj ) {
		var clone;

		if ( obj instanceof Array ) {
			return obj.concat();
		}
		else if ( typeof obj === "boolean" ) {
			return Boolean( obj );
		}
		else if ( typeof obj === "function" ) {
			return obj;
		}
		else if ( typeof obj === "number" ) {
			return Number( obj );
		}
		else if ( typeof obj === "string" ) {
			return String( obj );
		}
		else if ( obj instanceof RegExp ) {
			return obj;
		}
		else if ( !server && !client.ie && obj instanceof Document ) {
			return xml.decode( xml.encode(obj) );
		}
		else if ( obj !== null && obj !== undefined && typeof obj.__proto__ !== "undefined" ) {
			return utility.extend( obj.__proto__, obj );
		}
		else if ( obj instanceof Object ) {
			// If JSON encoding fails due to recursion, the original Object is returned because it's assumed this is for decoration
			clone = json.encode( obj, true );

			if ( clone !== undefined ) {
				clone = json.decode( clone );

				// Decorating Functions that would be lost with JSON encoding/decoding
				utility.iterate( obj, function ( v, k ) {
					if ( typeof v === "function" ) {
						clone[k] = v;
					}
				});
			}
			else {
				clone = obj;
			}

			return clone;
		}
		else {
			return obj;
		}
	},

	/**
	 * Coerces a String to a Type
	 * 
	 * @param  {String} value String to coerce
	 * @return {Mixed}        Typed version of the String
	 */
	coerce : function ( value ) {
		var result = utility.clone( value ),
		    tmp;

		if ( string.isEmpty( result ) ) {
			result = undefined;
		}
		else if ( result === "undefined" ) {
			result = undefined;
		}
		else if ( result === "null" ) {
			result = null;
		}
		else if ( regex.string_boolean.test( result ) ) {
			result = regex.string_true.test( result );
		}
		else if ( (tmp = json.decode( result, true ) ) && tmp !== undefined ) {
			result = tmp;
		}
		else if ( result !== null && result !== undefined && !isNaN( Number( result ) ) ) {
			result = Number( result );
		}

		return result;
	},

	/**
	 * Recompiles a RegExp by reference
	 *
	 * This is ideal when you need to recompile a regex for use within a conditional statement
	 * 
	 * @param  {Object} regex     RegExp
	 * @param  {String} pattern   Regular expression pattern
	 * @param  {String} modifiers Modifiers to apply to the pattern
	 * @return {Boolean}          true
	 */
	compile : function ( reg, pattern, modifiers ) {
		reg.compile( pattern, modifiers );

		return true;
	},

	/**
	 * Creates a CSS stylesheet in the View
	 *
	 * @method css
	 * @param  {String} content CSS to put in a style tag
	 * @param  {String} media   [Optional] Medias the stylesheet applies to
	 * @return {Object}         Element created or undefined
	 */
	css : function ( content, media ) {
		var ss, css;

		ss = element.create( "style", {type: "text/css", media: media || "print, screen"}, $( "head" )[0] );

		if ( ss.styleSheet ) {
			ss.styleSheet.cssText = content;
		}
		else {
			css = document.createTextNode( content );
			ss.appendChild( css );
		}

		return ss;
	},

	/**
	 * Debounces a function
	 * 
	 * @method debounce
	 * @param  {Function} fn    Function to execute
	 * @param  {Number}   ms    Time to wait to execute in milliseconds, default is 1000
	 * @param  {Mixed}    scope `this` context during execution, default is `global`
	 * @return {Undefined}      undefined
	 */
	debounce : function ( fn, ms, scope ) {
		if ( typeof fn !== "function" ) {
			throw Error( label.error.invalidArguments );
		}

		ms    = ms    || 1000;
		scope = scope || global;

		return function debounced () {
			utility.defer( function () {
				fn.apply( scope, arguments );
			}, ms);
		};
	},

	/**
	 * Allows deep setting of properties without knowing
	 * if the structure is valid
	 *
	 * @method define
	 * @param  {String} args  Dot delimited string of the structure
	 * @param  {Mixed}  value Value to set
	 * @param  {Object} obj   Object receiving value
	 * @return {Object}       Object receiving value
	 */
	define : function ( args, value, obj ) {
		args    = args.split( "." );
		var p   = obj,
		    nth = args.length;

		if ( obj === undefined ) {
			obj = this;
		}

		if ( value === undefined ) {
			value = null;
		}

		array.each( args, function ( i, idx ) {
			var num = idx + 1 < nth && !isNaN( number.parse( args[idx + 1], 10 ) ),
			    val = value;

			if ( !isNaN( number.parse( i, 10 ) ) )  {
				i = number.parse( i, 10 );
			}
			
			// Creating or casting
			if ( p[i] === undefined ) {
				p[i] = num ? [] : {};
			}
			else if ( p[i] instanceof Object && num ) {
				p[i] = array.cast( p[i] );
			}
			else if ( p[i] instanceof Object ) {
				void 0;
			}
			else if ( p[i] instanceof Array && !num ) {
				p[i] = array.toObject( p[i] );
			}
			else {
				p[i] = {};
			}

			// Setting reference or value
			idx + 1 === nth ? p[i] = val : p = p[i];
		});

		return obj;
	},

	/**
	 * Defers the execution of Function by at least the supplied milliseconds
	 * Timing may vary under "heavy load" relative to the CPU & client JavaScript engine
	 *
	 * @method defer
	 * @param  {Function} fn Function to defer execution of
	 * @param  {Number}   ms Milliseconds to defer execution
	 * @param  {Number}   id [Optional] ID of the deferred function
	 * @return {String}      ID of the timer
	 */
	defer : function ( fn, ms, id ) {
		var op;

		ms = ms || 0;
		id = id || utility.uuid( true );

		op = function () {
			utility.clearTimers( id );
			fn();
		};

		utility.clearTimers( id );
		utility.timer[id] = setTimeout( op, ms );

		return id;
	},

	/**
	 * Encodes a UUID to a DOM friendly ID
	 *
	 * @method domId
	 * @param  {String} UUID
	 * @return {String} DOM friendly ID
	 * @private
	 */
	domId : function ( arg ) {
		return "a" + arg.replace( /-/g, "" ).slice( 1 );
	},

	/**
	 * Error handling, with history in .log
	 *
	 * @method error
	 * @param  {Mixed}   e       Error object or message to display
	 * @param  {Array}   args    Array of arguments from the callstack
	 * @param  {Mixed}   scope   Entity that was "this"
	 * @param  {Boolean} warning [Optional] Will display as console warning if true
	 * @return {Undefined}       undefined
	 */
	error : function ( e, args, scope, warning ) {
		warning = ( warning === true );
		var o   = {
			arguments : args,
			message   : e.message || e,
			number    : e.number !== undefined ? ( e.number & 0xFFFF ) : undefined,
			scope     : scope,
			stack     : e.stack   || undefined,
			timestamp : new Date().toUTCString(),
			type      : e.type    || "TypeError"
		};

		utility.log( o.stack || o.message, !warning ? "error" : "warn" );
		abaaso.error.log.push( o );
		observer.fire( abaaso, "error", o );

		return undefined;
	},

	/**
	 * Creates a "class" extending Object, with optional decoration
	 *
	 * @method extend
	 * @param  {Object} obj Object to extend
	 * @param  {Object} arg [Optional] Object for decoration
	 * @return {Object}     Decorated obj
	 */
	extend : function () {
		if ( typeof Object.create === "function" ) {
			return function ( obj, arg ) {
				var o;

				if ( obj === undefined ) {
					throw Error( label.error.invalidArguments );
				}

				o = Object.create( obj );

				if ( arg instanceof Object ) {
					utility.merge( o, arg );
				}

				return o;
			};
		}
		else {
			return function ( obj, arg ) {
				var o;

				if ( obj === undefined ) {
					throw Error( label.error.invalidArguments );
				}

				f = function () {};
				f.prototype = obj;
				o = new f();

				if ( arg instanceof Object ) {
					utility.merge( o, arg );
				}

				return o;
			};
		}
	}(),

	/**
	 * Generates an ID value
	 *
	 * @method genId
	 * @param  {Mixed}   obj [Optional] Object to receive id
	 * @param  {Boolean} dom [Optional] Verify the ID is unique in the DOM, default is false
	 * @return {Mixed}       Object or id
	 */
	genId : function ( obj, dom ) {
		dom = ( dom === true );
		var id;

		if ( obj !== undefined && ( ( obj.id !== undefined && obj.id !== "" ) || ( obj instanceof Array ) || ( obj instanceof String || typeof obj === "string" ) ) ) {
			return obj;
		}

		if ( dom ) {
			do {
				id = utility.domId( utility.uuid( true) );
			}
			while ( $( "#" + id ) !== undefined );
		}
		else {
			id = utility.domId( utility.uuid( true) );
		}

		if ( typeof obj === "object" ) {
			obj.id = id;

			return obj;
		}
		else {
			return id;
		}
	},

	/**
	 * Converts RGB to HEX
	 * 
	 * @param  {String} color RGB as `rgb(255, 255, 255)` or `255, 255, 255`
	 * @return {String}       Color as HEX
	 */
	hex : function ( color ) {
		var digits, red, green, blue, result, i, nth;

		if ( color.charAt( 0 ) === "#" ) {
		    result = color;
		}
		else {
			digits = string.explode( color.replace( /.*\(|\)/g, "" ) );
			red    = number.parse( digits[0] || 0 );
			green  = number.parse( digits[1] || 0 );
			blue   = number.parse( digits[2] || 0 );
			result = ( blue | ( green << 8 ) | ( red << 16 ) ).toString( 16 );

			if ( result.length < 6 ) {
				nth = number.diff( result.length, 6 );
				i   = -1;

				while ( ++i < nth ) {
					result = "0" + result;
				}
			}

			result = "#" + result;
		}

		return result;
	},

	/**
	 * Iterates an Object and executes a function against the properties
	 *
	 * Iteration can be stopped by returning false from fn
	 * 
	 * @method iterate
	 * @param  {Object}   obj Object to iterate
	 * @param  {Function} fn  Function to execute against properties
	 * @return {Object}       Object
	 */
	iterate : function () {
		if ( typeof Object.keys === "function" ) {
			return function ( obj, fn ) {
				if ( typeof fn !== "function" ) {
					throw Error( label.error.invalidArguments );
				}

				array.each( Object.keys( obj ), function ( i ) {
					return fn.call( obj, obj[i], i );
				});

				return obj;
			};
		}
		else {
			return function ( obj, fn ) {
				var has = Object.prototype.hasOwnProperty,
				    i, result;

				if ( typeof fn !== "function" ) {
					throw Error( label.error.invalidArguments );
				}

				for ( i in obj ) {
					if ( has.call( obj, i ) ) {
						result = fn.call( obj, obj[i], i );

						if ( result === false ) {
							break;
						}
					}
					else {
						break;
					}
				}

				return obj;
			};
		}
	}(),

	/**
	 * Renders a loading icon in a target element,
	 * with a class of "loading"
	 *
	 * @method loading
	 * @param  {Mixed} obj Entity or Array of Entities or $ queries
	 * @return {Mixed}     Entity, Array of Entities or undefined
	 */
	loading : function ( obj ) {
		var l = abaaso.loading;

		obj = utility.object( obj );

		if ( obj instanceof Array ) {
			return array.each( obj, function ( i ) {
				utility.loading( i );
			});
		}

		if ( l.url === null || obj === undefined ) {
			throw Error( label.error.invalidArguments );
		}

		// Setting loading image
		if ( l.image === undefined ) {
			l.image     = new Image();
			l.image.src = l.url;
		}

		// Clearing target element
		element.clear( obj );

		// Creating loading image in target element
		element.create( "img", {alt: label.common.loading, src: l.image.src}, element.create( "div", {"class": "loading"}, obj ) );

		return obj;
	},

	/**
	 * Writes argument to the console
	 *
	 * @method log
	 * @private
	 * @param  {String} arg    String to write to the console
	 * @param  {String} target [Optional] Target console, default is "log"
	 * @return {Undefined}     undefined
	 */
	log : function ( arg, target ) {
		var ts, msg;

		if ( typeof console !== "undefined" ) {
			ts  = typeof arg !== "object";
			msg = ts ? "[" + new Date().toLocaleTimeString() + "] " + arg : arg;
			console[target || "log"]( msg );
		}
	},

	/**
	 * Merges obj with arg
	 * 
	 * @method merge
	 * @param  {Object} obj Object to decorate
	 * @param  {Object} arg Object to decorate with
	 * @return {Object}     Object to decorate
	 */
	merge : function ( obj, arg ) {
		utility.iterate( arg, function ( v, k ) {
			obj[k] = utility.clone( v );
		});

		return obj;
	},
	
	/**
	 * Registers a module in the abaaso namespace
	 *
	 * IE8 will have factories ( functions ) duplicated onto $ because it will not respect the binding
	 * 
	 * @method module
	 * @param  {String} arg Module name
	 * @param  {Object} obj Module structure
	 * @return {Object}     Module registered
	 */
	module : function ( arg, obj ) {
		if ( $[arg] !== undefined || !obj instanceof Object ) {
			throw Error( label.error.invalidArguments );
		}
		
		$[arg] = obj;

		return $[arg];
	},

	/**
	 * Returns Object, or reference to Element
	 *
	 * @method object
	 * @param  {Mixed} obj Entity or $ query
	 * @return {Mixed}     Entity
	 * @private
	 */
	object : function ( obj ) {
		return typeof obj === "object" ? obj : ( obj.toString().charAt( 0 ) === "#" ? $( obj ) : obj );
	},

	/**
	 * Parses a URI into an Object
	 * 
	 * @method parse
	 * @param  {String} uri URI to parse
	 * @return {Object}     Parsed URI
	 */
	parse : function ( uri ) {
		var obj    = {},
		    parsed = {};

		if ( uri === undefined ) {
			uri = !server ? location.href : "";
		}

		if ( !server ) {
			obj = document.createElement( "a" );
			obj.href = uri;
		}
		else {
			obj = url.parse( uri );
		}

		if ( server ) {
			utility.iterate( obj, function ( v, k ) {
				if ( v === null ) {
					obj[k] = undefined;
				}
			});
		}

		parsed = {
			auth     : server ? null : regex.auth.exec( uri ),
			protocol : obj.protocol || "http:",
			hostname : obj.hostname || "localhost",
			port     : !string.isEmpty( obj.port ) ? number.parse( obj.port, 10 ) : "",
			pathname : obj.pathname,
			search   : obj.search   || "",
			hash     : obj.hash     || "",
			host     : obj.host     || "localhost"
		};

		// 'cause IE is ... IE; required for data.batch()
		if ( client.ie ) {
			if ( parsed.protocol === ":" ) {
				parsed.protocol = location.protocol;
			}

			if ( string.isEmpty( parsed.hostname ) ) {
				parsed.hostname = location.hostname;
			}

			if ( string.isEmpty( parsed.host ) ) {
				parsed.host = location.host;
			}

			if ( parsed.pathname.charAt( 0 ) !== "/" ) {
				parsed.pathname = "/" + parsed.pathname;
			}
		}

		parsed.auth  = obj.auth || ( parsed.auth === null ? "" : parsed.auth[1] );
		parsed.href  = obj.href || ( parsed.protocol + "//" + ( string.isEmpty( parsed.auth ) ? "" : parsed.auth + "@" ) + parsed.host + parsed.pathname + parsed.search + parsed.hash );
		parsed.path  = obj.path || parsed.pathname + parsed.search;
		parsed.query = utility.queryString( null, parsed.search );

		return parsed;
	},

	/**
	 * Sets a property on an Object, if defineProperty cannot be used the value will be set classically
	 * 
	 * @method property
	 * @param  {Object} obj        Object to decorate
	 * @param  {String} prop       Name of property to set
	 * @param  {Object} descriptor Descriptor of the property
	 * @return {Object}            Object receiving the property
	 */
	property : function () {
		if ( ( server || ( !client.ie || client.version > 8 ) ) && typeof Object.defineProperty === "function" ) {
			return function ( obj, prop, descriptor ) {
				if ( !( descriptor instanceof Object ) ) {
					throw Error( label.error.invalidArguments );
				}

				if ( descriptor.value !== undefined && descriptor.get !== undefined ) {
					delete descriptor.value;
				}

				Object.defineProperty( obj, prop, descriptor );
			};
		}
		else {
			return function ( obj, prop, descriptor ) {
				if ( !( descriptor instanceof Object ) ) {
					throw Error( label.error.invalidArguments );
				}

				obj[prop] = descriptor.value;

				return obj;
			};
		}
	},

	/**
	 * Sets methods on a prototype object
	 *
	 * @method proto
	 * @param  {Object} obj  Object receiving prototype extension
	 * @param  {String} type Identifier of obj, determines what Arrays to apply
	 * @return {Object}      obj or undefined
	 * @private
	 */
	proto : function ( obj, type ) {
		var methods, i;

		methods = {
			array : {
				add : function ( arg ) {
					return array.add( this, arg );
				},
				addClass : function ( arg ) {
					return array.each( this, function ( i ) {
						element.klass( i, arg );
					});
				},
				after : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "after" ) );
					});

					return result;
				},
				append : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "last" ) );
					});

					return result;
				},
				attr : function ( key, value ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.attr( i, key, value ) );
					});

					return result;
				},
				before : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "before" ) );
					});

					return result;
				},
				chunk : function ( size ) {
					return array.chunk( this, size );
				},
				clear : function () {
					return !server && ( this[0] instanceof Element ) ? array.each( this, function ( i ) {
						element.clear(i);
					}) : array.clear( this );
				},
				clone : function () {
					return utility.clone( this );
				},
				collect : function ( arg ) {
					return array.collect( this, arg );
				},
				compact : function () {
					return array.compact( this );
				},
				contains : function ( arg ) {
					return array.contains( this, arg );
				},
				count : function ( arg ) {
					return array.count( this, arg );
				},
				create : function ( type, args, position ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, position ) );
					});

					return result;
				},
				css : function ( key, value ) {
					return array.each( this, function ( i ) {
						element.css( i, key, value );
					});
				},
				data : function ( key, value ) {
					var result = [];

					array.each( this, function (i) {
						result.push( element.data( i, key, value ) );
					});

					return result;
				},
				diff : function ( arg ) {
					return array.diff( this, arg );
				},
				disable : function () {
					return array.each( this, function ( i ) {
						element.disable( i );
					});
				},
				dispatch : function ( event, data, bubbles, cancelable ) {
					return array.each( this, function ( i ) {
						element.dispatch( i, event, data, bubbles, cancelable );
					});
				},
				destroy : function () {
					array.each( this, function ( i ) {
						element.destroy( i );
					});

					return [];
				},
				each : function ( arg ) {
					return array.each( this, arg );
				},
				empty : function () {
					return array.empty( this );
				},
				enable : function () {
					return array.each( this, function ( i ) {
						element.enable( i );
					});
				},
				equal : function ( arg ) {
					return array.equal( this, arg );
				},
				fill : function ( arg, start, offset ) {
					return array.fill( this, arg, start, offset );
				},
				find : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						i.find( arg ).each( function ( r ) {
							result.add( r );
						});
					});

					return result;
				},
				fire : function () {
					var args = arguments;

					return array.each( this, function ( i ) {
						observer.fire.apply( observer, [i].concat( array.cast( args ) ) );
					});
				},
				first : function () {
					return array.first( this );
				},
				flat : function () {
					return array.flat( this );
				},
				genId : function () {
					return array.each( this, function ( i ) {
						utility.genId( i );
					});
				},
				get : function ( uri, headers ) {
					var result = [];

					array.each( this, function ( i, idx ) {
						i.get( uri, headers, function ( arg ) {
							result[idx] = arg;
						}, function ( e ) {
							result[idx] = e;
						});
					});

					return result;
				},
				has : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.has( i, arg ) );
					});

					return result;
				},
				hasClass : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.hasClass( i, arg ) );
					});

					return result;
				},
				hide : function () {
					return array.each( this, function ( i ) {
						element.hide( i );
					});
				},
				html : function ( arg ) {
					var result;

					if ( arg !== undefined ) {
						return array.each( this, function ( i ) {
							element.html( i, arg );
						});
					}
					else {
						result = [];
						array.each( this, function ( i ) {
							result.push( element.html( i ) );
						});

						return result;
					}
				},
				index : function ( arg ) {
					return array.index( this, arg );
				},
				indexed : function () {
					return array.indexed( this );
				},
				intersect : function ( arg ) {
					return array.intersect( this, arg );
				},
				is : function ( arg ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.is( i, arg ) );
					});

					return result;
				},
				isAlphaNum : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isAlphaNum() );
					});

					return result;
				},
				isBoolean : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isBoolean() );
					});

					return result;
				},
				isChecked : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isChecked() );
					});

					return result;
				},
				isDate : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isDate() );
					});

					return result;
				},
				isDisabled : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.isDisabled( i ) );
					});

					return result;
				},
				isDomain : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isDomain() );
					});

					return result;
				},
				isEmail : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isEmail() );
					});

					return result;
				},
				isEmpty : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isEmpty() );
					});

					return result;
				},
				isHidden : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.isHidden( i ) );
					});

					return result;
				},
				isIP : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isIP() );
					});

					return result;
				},
				isInt : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isInt() );
					});

					return result;
				},
				isNumber : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isNumber() );
					});

					return result;
				},
				isPhone : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isPhone() );
					});

					return result;
				},
				isUrl : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( i.isUrl() );
					});

					return result;
				},
				keep_if : function ( fn ) {
					return array.keep_if( this, fn );
				},
				keys : function () {
					return array.keys( this );
				},
				last : function ( arg ) {
					return array.last( this, arg );
				},
				limit : function ( start, offset ) {
					return array.limit( this, start, offset );
				},
				listeners: function ( event ) {
					var result = [];

					array.each( this, function ( i ) {
						array.merge(result, observer.listeners( i, event ) );
					});

					return result;
				},
				loading : function () {
					return array.each( this, function ( i ) {
						utility.loading( i );
					});
				},
				max : function () {
					return array.max( this );
				},
				mean : function () {
					return array.mean( this );
				},
				median : function () {
					return array.median( this );
				},
				merge : function ( arg ) {
					return array.merge( this, arg );
				},
				min : function () {
					return array.min( this );
				},
				mingle : function ( arg ) {
					return array.mingle( this, arg );
				},
				mode : function () {
					return array.mode( this );
				},
				on : function ( event, listener, id, scope, state ) {
					return array.each( this, function ( i ) {
						observer.add( i, event, listener, id, scope || i, state );
					});
				},
				once : function ( event, listener, id, scope, state ) {
					return array.each( this, function ( i ) {
						observer.once( i, event, listener, id, scope || i, state );
					});
				},
				position : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.position( i ) );
					});

					return result;
				},
				prepend : function ( type, args ) {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.create( type, args, i, "first" ) );
					});

					return result;
				},
				range : function () {
					return array.range( this );
				},
				rassoc : function ( arg ) {
					return array.rassoc( this, arg );
				},
				reject : function ( fn ) {
					return array.reject( this, fn );
				},
				remove : function ( start, end ) {
					return array.remove( this, start, end );
				},
				remove_if : function ( fn ) {
					return array.remove_if( this, fn );
				},
				remove_while: function ( fn ) {
					return array.remove_while( this, fn );
				},
				removeAttr : function ( key ) {
					array.each( this, function ( i ) {
						element.removeAttr( i, key );
					});

					return this;
				},
				removeClass: function ( arg ) {
					return array.each( this, function ( i ) {
						element.klass( i, arg, false );
					});
				},
				replace : function ( arg ) {
					return array.replace( this, arg );
				},
				rest : function ( arg ) {
					return array.rest( this, arg );
				},
				rindex : function ( arg ) {
					return array.rindex( this, arg );
				},
				rotate : function ( arg ) {
					return array.rotate( this, arg );
				},
				serialize : function ( string, encode ) {
					return element.serialize( this, string, encode );
				},
				series : function ( start, end, offset ) {
					return array.series( start, end, offset );
				},
				show : function () {
					return array.each( this, function ( i ) {
						element.show( i );
					});
				},
				size : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.size( i ) );
					});

					return result;
				},
				split : function ( size ) {
					return array.split( this, size );
				},
				sum : function () {
					return array.sum( this );
				},
				take : function ( arg ) {
					return array.take( this, arg );
				},
				text : function ( arg ) {
					return array.each( this, function ( node ) {
						if ( typeof node !== "object") {
							node = utility.object( node );
						}

						if ( typeof node.text === "function") {
							node.text( arg );
						}
					});
				},
				tpl : function ( arg ) {
					return array.each( this, function ( i ) {
						utility.tpl ( arg, i );
					});
				},
				toggleClass : function ( arg ) {
					return array.each( this, function ( i ) {
						element.toggleClass( i, arg );
					});
				},
				total : function () {
					return array.total( this );
				},
				toObject : function () {
					return array.toObject( this );
				},
				un : function ( event, id, state ) {
					return array.each( this, function ( i ) {
						observer.remove( i, event, id, state );
					});
				},
				unique : function () {
					return array.unique( this );
				},
				update : function ( arg ) {
					return array.each( this, function ( i ) {
						element.update( i, arg );
					});
				},
				val : function ( arg ) {
					var a    = [],
					    type = null,
					    same = true;

					array.each( this, function ( i ) {
						if ( type !== null ) {
							same = ( type === i.type );
						}

						type = i.type;

						if ( typeof i.val === "function" ) {
							a.push( i.val( arg ) );
						}
					});

					return same ? a[0] : a;
				},
				validate : function () {
					var result = [];

					array.each( this, function ( i ) {
						result.push( element.validate( i ) );
					});

					return result;
				},
				zip : function () {
					return array.zip( this, arguments );
				}
			},
			element : {
				addClass : function ( arg ) {
					return element.klass( this, arg, true );
				},
				after : function ( type, args ) {
					return element.create( type, args, this, "after" );
				},
				append : function ( type, args ) {
					return element.create( type, args, this, "last" );
				},
				attr : function ( key, value ) {
					return element.attr( this, key, value );
				},
				before : function ( type, args ) {
					return element.create( type, args, this, "before" );
				},
				clear : function () {
					return element.clear( this );
				},
				create : function ( type, args, position ) {
					return element.create( type, args, this, position );
				},
				css : function ( key, value ) {
					return element.css( this, key, value );
				},
				data : function ( key, value ) {
					return element.data( this, key, value );
				},
				destroy : function () {
					return element.destroy( this );
				},
				disable : function () {
					return element.disable( this );
				},
				dispatch : function ( event, data, bubbles, cancelable ) {
					return element.dispatch( this, event, data, bubbles, cancelable );
				},
				enable : function () {
					return element.enable( this );
				},
				find : function ( arg ) {
					return element.find( this, arg );
				},
				fire : function () {
					return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
				},
				genId : function () {
					return utility.genId( this );
				},
				get : function ( uri, success, failure, headers, timeout ) {
					var self     = this,
					    deferred = promise.factory(),
					    deferred2;

					deferred2 = deferred.then( function ( arg ) {
						element.html( self, arg );
						observer.fire( self, "afterGet" );

						if ( typeof success === "function") {
							success.call( self, arg );
						}

					}, function ( e ) {
						element.html( self, arg || label.error.serverError );
						observer.fire( self, "failedGet" );

						if ( typeof failure === "function") {
							failure.call( self, arg );
						}

						throw e;
					});

					observer.fire( this, "beforeGet" );

					uri.get( function (arg ) { 
						deferred.resolve( arg );
					}, function ( e ) {
						deferred.reject( e );
					}, headers, timeout);

					return deferred2;
				},
				has : function ( arg ) {
					return element.has( this, arg );
				},
				hasClass : function ( arg ) {
					return element.hasClass( this, arg );
				},
				hide : function () {
					return element.hide( this );
				},
				html : function ( arg ) {
					return element.html( this, arg );
				},
				is : function ( arg ) {
					return element.is( this, arg );
				},
				isAlphaNum : function () {
					return element.isAlphaNum( this );
				},
				isBoolean : function () {
					return element.isBoolean( this );
				},
				isChecked : function () {
					return element.isChecked( this );
				},
				isDate : function () {
					return element.isDate( this );
				},
				isDisabled : function () {
					return element.isDisabled( this );
				},
				isDomain : function () {
					return element.isDomain( this );
				},
				isEmail : function () {
					return element.isEmail( this );
				},
				isEmpty : function () {
					return element.isEmpty( this );
				},
				isHidden : function () {
					return element.hidden( this );
				},
				isIP : function () {
					return element.isIP( this );
				},
				isInt : function () {
					return element.isInt( this );
				},
				isNumber : function () {
					return element.isNumber( this );
				},
				isPhone : function () {
					return element.isPhone( this );
				},
				isUrl : function () {
					return element.isUrl( this );
				},
				jsonp : function ( uri, property, callback ) {
					var target = this,
					    arg    = property, fn,
					    deferred;

					fn = function ( response ) {
						var self = target,
						    node = response,
						    prop = arg,
						    i, nth, result;

						try {
							if ( prop !== undefined ) {
								prop = prop.replace( /\]|'|"/g , "" ).replace( /\./g, "[" ).split( "[" );

								prop.each( function ( i ) {
									node = node[!!isNaN( i ) ? i : number.parse( i, 10 )];

									if ( node === undefined ) {
										throw Error( label.error.propertyNotFound );
									}
								});

								result = node;
							}
							else result = response;
						}
						catch ( e ) {
							result = label.error.serverError;
							error( e, arguments, this );
						}

						element.html( self, result );
					};

					deferred = client.jsonp( uri, fn, function (e) {
						element.html( target, label.error.serverError );

						throw e;
					}, callback );

					return deferred;
				},
				listeners : function ( event ) {
					return observer.list( this, event );
				},
				loading : function () {
					return utility.loading( this );
				},
				on : function ( event, listener, id, scope, state ) {
					return observer.add(  this, event, listener, id, scope || this, state );
				},
				once : function ( event, listener, id, scope, state ) {
					return observer.once( this, event, listener, id, scope || this, state );
				},
				prepend : function ( type, args ) {
					return element.create( type, args, this, "first" );
				},
				prependChild : function ( child ) {
					return element.prependChild( this, child );
				},
				position : function () {
					return element.position( this );
				},
				removeAttr : function ( key ) {
					return element.removeAttr( this, key );
				},
				removeClass : function ( arg ) {
					return element.klass( this, arg, false );
				},
				serialize : function ( string, encode ) {
					return element.serialize( this, string, encode );
				},
				show : function () {
					return element.show( this );
				},
				size : function () {
					return element.size( this );
				},
				text : function ( arg ) {
					return element.text( this, arg );
				},
				toggleClass : function ( arg ) {
					return element.toggleClass( this, arg );
				},
				tpl : function ( arg ) {
					return utility.tpl( arg, this );
				},
				un : function ( event, id, state ) {
					return observer.remove( this, event, id, state );
				},
				update : function ( args ) {
					return element.update( this, args );
				},
				val : function ( arg ) {
					return element.val( this, arg );
				},
				validate : function () {
					return element.validate( this );
				}
			},
			"function": {
				reflect : function () {
					return utility.reflect( this );
				},
				debounce : function ( ms ) {
					return utility.debounce( this, ms );
				}
			},
			number : {
				diff : function ( arg ) {
					return number.diff( this, arg );
				},
				fire : function () {
					return observer.fire.apply( observer, [this.toString()].concat( array.cast( arguments ) ) );
				},
				format : function ( delimiter, every ) {
					return number.format( this, delimiter, every );
				},
				half : function ( arg ) {
					return number.half( this, arg );
				},
				isEven : function () {
					return number.even( this );
				},
				isOdd : function () {
					return number.odd( this );
				},
				listeners : function ( event ) {
					return observer.list( this.toString(), event );
				},
				on : function ( event, listener, id, scope, state ) {
					observer.add(  this.toString(), event, listener, id, scope || this, state );

					return this;
				},
				once : function ( event, listener, id, scope, state ) {
					observer.once( this.toString(), event, listener, id, scope || this, state );

					return this;
				},
				random : function () {
					return number.random( this );
				},
				round : function () {
					return number.round( this );
				},
				roundDown : function () {
					return number.round( this, "down" );
				},
				roundUp : function () {
					return number.round( this, "up" );
				},
				un : function ( event, id, state ) {
					observer.remove( this.toString(), event, id, state );

					return this;
				}
			},
			string : {
				allows : function ( arg ) {
					return client.allows( this, arg );
				},
				capitalize: function ( arg ) {
					return string.capitalize( this, arg );
				},
				del : function ( success, failure, headers ) {
					return client.request( this, "DELETE", success, failure, null, headers );
				},
				escape : function () {
					return string.escape(this );
				},
				expire : function ( silent ) {
					return cache.expire( this, silent );
				},
				explode : function ( arg ) {
					return string.explode( this, arg );
				},
				fire : function () {
					return observer.fire.apply( observer, [this].concat( array.cast( arguments ) ) );
				},
				get : function ( success, failure, headers ) {
					return client.request( this, "GET", success, failure, null, headers );
				},
				headers : function ( success, failure ) {
					return client.request( this, "HEAD", success, failure );
				},
				hyphenate : function ( camel ) {
					return string.hyphenate( this, camel );
				},
				isAlphaNum : function () {
					return string.isAlphaNum( this );
				},
				isBoolean : function () {
					return string.isBoolean( this );
				},
				isDate : function () {
					return string.isDate( this );
				},
				isDomain : function () {
					return string.isDomain( this );
				},
				isEmail : function () {
					return string.isEmail( this );
				},
				isEmpty : function () {
					return string.isEmpty( this );
				},
				isIP : function () {
					return string.isIP( this );
				},
				isInt : function () {
					return string.isInt( this );
				},
				isNumber : function () {
					return string.isNumber( this );
				},
				isPhone : function () {
					return string.isPhone( this );
				},
				isUrl : function () {
					return string.isUrl( this );
				},
				jsonp : function ( success, failure, callback ) {
					return client.jsonp( this, success, failure, callback );
				},
				listeners : function ( event ) {
					return observer.list( this, event );
				},
				patch : function ( success, failure, args, headers ) {
					return client.request( this, "PATCH", success, failure, args, headers );
				},
				post : function ( success, failure, args, headers ) {
					return client.request( this, "POST", success, failure, args, headers );
				},
				put : function ( success, failure, args, headers ) {
					return client.request( this, "PUT", success, failure, args, headers );
				},
				on : function ( event, listener, id, scope, state ) {
					return observer.add( this, event, listener, id, scope, state );
				},
				once : function ( event, listener, id, scope, state ) {
					return observer.add( this, event, listener, id, scope, state );
				},
				options : function ( success, failure ) {
					return client.request( this, "OPTIONS", success, failure );
				},
				permissions : function () {
					return client.permissions( this );
				},
				singular : function () {
					return string.singular( this );
				},
				toCamelCase : function () {
					return string.toCamelCase( this );
				},
				toNumber : function ( base ) {
					return number.parse( this, base );
				},
				trim : function () {
					return string.trim( this );
				},
				un : function ( event, id, state ) {
					return observer.remove( this, event, id, state );
				},
				unCamelCase : function () {
					return string.unCamelCase( this );
				},
				uncapitalize : function () {
					return string.uncapitalize( this );
				},
				unhyphenate: function ( arg ) {
					return string.unhyphenate( this, arg );
				}
			}
		};

		// Allowing hooks to be overwritten
		utility.iterate( methods[type], function ( v, k ) {
			utility.property( obj.prototype, k, {value: v, configurable: true, writable: true} );
		});

		return obj;
	},

	/**
	 * Parses a query string & coerces values
	 *
	 * @method queryString
	 * @param  {String} arg     [Optional] Key to find in the querystring
	 * @param  {String} qstring [Optional] Query string to parse
	 * @return {Mixed}          Value or Object of key:value pairs
	 */
	queryString : function ( arg, qstring ) {
		var obj    = {},
		    result = qstring !== undefined ? ( qstring.indexOf( "?" ) > -1 ? qstring.replace( /.*\?/, "" ) : null) : ( server || string.isEmpty( location.search ) ? null : location.search.replace( "?", "" ) ),
		    item;

		if ( result !== null && !string.isEmpty( result ) ) {
			result = result.split( "&" );
			array.each( result, function (prop ) {
				item = prop.split( "=" );

				if ( string.isEmpty( item[0] ) ) {
					return;
				}

				if ( item[1] === undefined || string.isEmpty( item[1] ) ) {
					item[1] = "";
				}
				else if ( string.isNumber( item[1] )) {
					item[1] = Number(item[1] );
				}
				else if ( string.isBoolean( item[1] )) {
					item[1] = (item[1] === "true" );
				}

				if ( obj[item[0]] === undefined ) {
					obj[item[0]] = item[1];
				}
				else if ( !(obj[item[0]] instanceof Array) ) {
					obj[item[0]] = [obj[item[0]]];
					obj[item[0]].push( item[1] );
				}
				else {
					obj[item[0]].push( item[1] );
				}
			});
		}

		if ( arg !== null && arg !== undefined ) {
			obj = obj[arg];
		}

		return obj;
	},

	/**
	 * Returns an Array of parameters of a Function
	 * 
	 * @method reflect
	 * @param  {Function} arg Function to reflect
	 * @return {Array}        Array of parameters
	 */
	reflect : function ( arg ) {
		if ( arg === undefined ) {
			arg = this || $;
		}

		arg = arg.toString().match( regex.reflect )[1];

		return string.explode( arg );
	},

	/**
	 * Creates a recursive function
	 * 
	 * Return false from the function to halt recursion
	 * 
	 * @method repeat
	 * @param  {Function} fn  Function to execute repeatedly
	 * @param  {Number}   ms  Milliseconds to stagger the execution
	 * @param  {String}   id  [Optional] Timeout ID
	 * @param  {Boolean}  now Executes `fn` and then setup repetition, default is `true`
	 * @return {String}       Timeout ID
	 */
	repeat : function ( fn, ms, id, now ) {
		ms  = ms || 10;
		id  = id || utility.uuid( true );
		now = ( now !== false );

		// Could be valid to return false from initial execution
		if ( now && fn() === false ) {
			return;
		}

		utility.defer( function () {
			var recursive = function ( fn, ms, id ) {
				var recursive = this;

				if ( fn() !== false ) {
					utility.repeating[id] = setTimeout( function () {
						recursive.call( recursive, fn, ms, id );
					}, ms );
				}
				else {
					delete utility.repeating[id];
				}
			};

			recursive.call( recursive, fn, ms, id );
		}, ms, id );

		return id;
	},

	/**
	 * Creates a script Element to load an external script
	 * 
	 * @method script
	 * @param  {String} arg    URL to script
	 * @param  {Object} target [Optional] Element to receive the script
	 * @param  {String} pos    [Optional] Position to create the script at within the target
	 * @return {Object}        Script
	 */
	script : function ( arg, target, pos ) {
		return element.create( "script", {type: "application/javascript", src: arg}, target || $( "head" )[0], pos );
	},

	/**
	 * Creates a link Element to load an external stylesheet
	 * 
	 * @method stylesheet
	 * @param  {String} arg   URL to stylesheet
	 * @param  {String} media [Optional] Medias the stylesheet applies to
	 * @return {Objecct}      Stylesheet
	 */
	stylesheet : function ( arg, media ) {
		return element.create( "link", {rel: "stylesheet", type: "text/css", href: arg, media: media || "print, screen"}, $( "head" )[0] );
	},

	/**
	 * Stops an Event from bubbling
	 * 
	 * @method stop
	 * @param  {Object} e Event
	 * @return {Object}   Event
	 */
	stop : function ( e ) {
		if ( e.cancelBubble !== undefined ) {
			e.cancelBubble = true;
		}

		if ( typeof e.preventDefault === "function" ) {
			e.preventDefault();
		}

		if ( typeof e.stopPropagation === "function" ) {
			e.stopPropagation();
		}

		// Assumed to always be valid, even if it's not decorated on `e` ( I'm looking at you IE8 )
		e.returnValue = false;

		return e;
	},

	/**
	 * Returns the Event target
	 * 
	 * @param  {Object} e Event
	 * @return {Object}   Event target
	 */
	target : function ( e ) {
		return e.target || e.srcElement;
	},

	/**
	 * Transforms JSON to HTML and appends to Body or target Element
	 *
	 * @method tpl
	 * @param  {Object} data   JSON Object describing HTML
	 * @param  {Mixed}  target [Optional] Target Element or Element.id to receive the HTML
	 * @return {Object}        New Element created from the template
	 */
	tpl : function ( arg, target ) {
		var frag;

		if ( typeof arg !== "object" || (!(regex.object_undefined.test( typeof target ) ) && ( target = target.charAt( 0 ) === "#" ? $( target ) : $( target )[0] ) === undefined ) ) {
			throw Error( label.error.invalidArguments );
		}

		if ( target === undefined ) {
			target = $( "body" )[0];
		}

		frag  = document.createDocumentFragment();

		if ( arg instanceof Array ) {
			array.each( arg, function ( i, idx ) {
				element.html(element.create( array.cast( i, true )[0], frag ), array.cast(i)[0] );
			});
		}
		else {
			utility.iterate( arg, function ( v, k ) {
				if ( typeof v === "string" ) {
					element.html( element.create( k, frag ), v );
				}
				else if ( ( v instanceof Array ) || ( v instanceof Object ) ) {
					utility.tpl( v, element.create( k, frag ) );
				}
			});
		}

		target.appendChild( frag );

		return array.last( target.childNodes );
	},

	/**
	 * Generates UUID Version 4
	 *
	 * @method uuid
	 * @param  {Boolean} safe [Optional] Strips - from UUID
	 * @return {String}       UUID
	 */
	uuid : function ( safe ) {
		var s = function () { return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 ); },
		    r = [8, 9, "a", "b"],
		    o;

		o = ( s() + s() + "-" + s() + "-4" + s().substr( 0, 3 ) + "-" + r[Math.floor( Math.random() * r.length )] + s().substr( 0, 3 ) + "-" + s() + s() + s() );

		if ( safe === true ) {
			o = o.replace( /-/g, "" );
		}

		return o;
	},

	/**
	 * Walks a structure and returns arg
	 * 
	 * @method  walk
	 * @param  {Mixed}  obj  Object or Array
	 * @param  {String} arg  String describing the property to return
	 * @return {Mixed}       arg
	 */
	walk : function ( obj, arg ) {
		array.each( arg.replace( /\]$/, "" ).replace( /\]/g, "." ).split( /\.|\[/ ), function ( i ) {
			obj = obj[i];
		});

		return obj;
	},

	/**
	 * Accepts 1 or more Promises as args or an Array, and returns a Promise which is reconciled
	 * after all input Promises have been reconciled
	 * 
	 * @method when
	 * @return {Object} Promise
	 */
	when : function () {
		var i        = 0,
		    deferred = promise.factory(),
		    promises = array.cast( arguments ),
		    nth;

		// Did we receive an Array? if so it overrides any other arguments
		if ( promises[0] instanceof Array ) {
			promises = promises[0];
		}

		// How many promises to observe?
		nth = promises.length;

		// Zero, end on next tick
		if ( nth === 0 ) {
			deferred.resolve( null );
		}
		// Setup and wait
		else {
			array.each( promises, function ( p ) {
				p.then( function ( arg) {
					if ( ++i === nth && !deferred.resolved()) {
						if ( promises.length > 1 ) {
							deferred.resolve( promises.map( function ( obj ) {
								return obj.outcome;
							}));
						}
						else {
							deferred.resolve( promises[0].outcome );
						}
					}
				}, function ( e ) {
					if ( !deferred.resolved() ) {
						if ( promises.length > 1 ) {
							deferred.reject( promises.map( function ( obj ) {
								return obj.outcome;
							}));
						}
						else {
							deferred.reject( promises[0].outcome );
						}
					}
				});
			});
		}

		return deferred;
	}
};

/**
 * Validation methods and patterns
 *
 * pattern.url is authored by Diego Perini
 *
 * @class validate
 * @namespace abaaso
 */
var validate = {
	/**
	 * Validates args based on the type or pattern specified
	 *
	 * @method test
	 * @param  {Object} args Object to test {( pattern[name] || /pattern/) : (value || #object.id )}
	 * @return {Object}      Results
	 */
	test : function ( args ) {
		var exception = false,
		    invalid   = [],
		    tracked   = {},
		    value     = null,
		    result    = [],
		    c         = [],
		    inputs    = [],
		    selects   = [],
		    i, p, o, x, nth;

		if ( args.nodeName !== undefined && args.nodeName === "FORM" ) {
			if ( string.isEmpty( args.id ) ) {
				utility.genId( args );
			}

			c = $( "#" + args.id + " input", "#" + args.id + " select" );

			array.each( c, function ( i ) {
				var z = {},
				    p, v, r;

				p = regex[i.nodeName.toLowerCase()] ? regex[i.nodeName.toLowerCase()] : ( ( !string.isEmpty( i.id ) && regex[i.id.toLowerCase()] ) ? regex[i.id.toLowerCase()] : "notEmpty" );
				v = i.val();

				if ( v === null ) v = "";

				z[p] = v;
				r    = validate.test( z )

				if ( !r.pass ) {
					invalid.push( {element: i, test: p, value: v} );
					exception = true;
				}
			});
		}
		else {
			utility.iterate( args, function ( i, k ) {
				if ( k === undefined || i === undefined ) {
					invalid.push( {test: k, value: i} );
					exception = true;

					return
				}

				value = i.toString().charAt( 0 ) === "#" ? ( $( i ) !== undefined ? $( i ).val() : "" ) : i;

				switch ( k ) {
					case "date":
						if ( isNaN( new Date( value ).getYear() ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
						break;
					case "domain":
						if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
						break;
					case "domainip":
						if ( !regex.domain.test( value.replace( regex.scheme, "" ) ) || !regex.ip.test( value ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
						break;
					default:
						p = regex[k] || k;

						if ( !p.test( value ) ) {
							invalid.push( {test: k, value: value} );
							exception = true;
						}
				}
			});
		}

		return {pass: !exception, invalid: invalid};
	}
};

/**
 * XMLHttpRequest shim for node.js
 * 
 * @return {Object} Instance of xhr
 */
var xhr = function () {
	var UNSENT           = 0,
	    OPENED           = 1,
	    HEADERS_RECEIVED = 2,
	    LOADING          = 3,
	    DONE             = 4,
	    ready            = RegExp( HEADERS_RECEIVED + "|" + LOADING ),
	    XMLHttpRequest, headers, handler, handlerError, state;

	headers = {
		"User-Agent"   : "abaaso/3.7.14 node.js/" + process.versions.node.replace( /^v/, "" ) + " (" + string.capitalize( process.platform ) + " V8/" + process.versions.v8 + " )",
		"Content-Type" : "text/plain",
		"Accept"       : "*/*"
	};

	/**
	 * Changes the readyState of an XMLHttpRequest
	 * 
	 * @param  {String} arg  New readyState
	 * @return {Object}      XMLHttpRequest
	 */
	state = function ( arg ) {
		if ( this.readyState !== arg ) {
			this.readyState = arg;
			this.dispatchEvent( "readystatechange" );

			if ( this.readyState === DONE && !this._error ) {
				this.dispatchEvent( "load" );
				this.dispatchEvent( "loadend" );
			}
		}

		return this;
	};

	handler = function ( res ) {
		var self = this;

		state.call( this, HEADERS_RECEIVED );

		this.status      = res.statusCode;
		this._resheaders = res.headers;

		if ( this._resheaders["set-cookie"] !== undefined && this._resheaders["set-cookie"] instanceof Array ) {
			this._resheaders["set-cookie"] = this._resheaders["set-cookie"].join( ";" );
		}

		res.on( "data", function ( arg ) {
			res.setEncoding( "utf8" );

			if ( self._send ) {
				if ( arg ) {
					self.responseText += arg;
				}

				state.call( self, LOADING );
			}
		});

		res.on( "end", function () {
			if ( self._send ) {
				state.call( self, DONE );
				self._send = false;
			}
		});

		res.on( "close", function ( e ) {
			handlerError.call( self, e );
		});
	};

	handlerError = function ( e ) {
		this.status       = 503;
		this.statusText   = e;
		this.responseText = e !== undefined ? ( e.stack || e ) : e;
		this._error       = true;
		this.dispatchEvent( "error" );
		state.call( this, DONE );
	};

	XMLHttpRequest = function () {
		this.onabort            = null;
		this.onerror            = null;
		this.onload             = null;
		this.onloadend          = null;
		this.onloadstart        = null;
		this.onreadystatechange = null;
		this.readyState         = UNSENT;
		this.response           = null;
		this.responseText       = "";
		this.responseType       = "";
		this.responseXML        = null;
		this.status             = UNSENT;
		this.statusText         = "";

		// Psuedo private for prototype chain
		this._id                = utility.genId();
		this._error             = false;
		this._headers           = {};
		this._listeners         = {};
		this._params            = {};
		this._request           = null;
		this._resheaders        = {};
		this._send              = false;
	};

	/**
	 * Aborts a request
	 * 
	 * @return {Object} XMLHttpRequest
	 */
	XMLHttpRequest.prototype.abort = function () {
		if ( this._request !== null ) {
			this._request.abort();
			this._request = null;
		}

		this.responseText = "";
		this.responseXML  = "";
		this._error       = true;
		this._headers     = {};

		if ( this._send === true || ready.test( this.readyState ) ) {
			this._send = false;
			state.call( this, DONE )
		}

		this.dispatchEvent( "abort" );
		this.readyState = UNSENT;

		return this;
	};

	/**
	 * Adds an event listener to an XMLHttpRequest instance
	 * 
	 * @param {String}   event Event to listen for
	 * @param {Function} fn    Event handler
	 * @return {Object}        XMLHttpRequest
	 */
	XMLHttpRequest.prototype.addEventListener = function ( event, fn ) {
		if ( !this._listeners.hasOwnProperty( event ) ) {
			this._listeners[event] = [];
		}

		this._listeners[event].add( fn );

		return this;
	};

	/**
	 * Dispatches an event
	 * 
	 * @param  {String} event Name of event
	 * @return {Object}       XMLHttpRequest
	 */
	XMLHttpRequest.prototype.dispatchEvent = function ( event ) {
		var self = this;

		if ( typeof this["on" + event] === "function" ) {
			this["on" + event]();
		}

		if ( this._listeners.hasOwnProperty( event )) {
			array.each( this._listeners[event], function ( i ) {
				if ( typeof i === "function" ) {
					i.call( self );
				}
			});
		}

		return this;
	};

	/**
	 * Gets all response headers
	 * 
	 * @return {Object} Response headers
	 */
	XMLHttpRequest.prototype.getAllResponseHeaders = function () {
		var result = "";

		if ( this.readyState < HEADERS_RECEIVED || this._error ) {
			throw Error( label.error.invalidStateNoHeaders );
		}

		utility.iterate( this._resheaders, function ( v, k ) {
			result += k + ": " + v + "\n";
		});

		return result;
	};

	/**
	 * Gets a specific response header
	 * 
	 * @param  {String} header Header to get
	 * @return {String}        Response header value
	 */
	XMLHttpRequest.prototype.getResponseHeader = function ( header ) {
		var result;

		if ( this.readyState < HEADERS_RECEIVED || this._error ) {
			throw Error( label.error.invalidStateNoHeaders );
		}

		result = this._resheaders[header] || this._resheaders[header.toLowerCase()];

		return result;
	};

	/**
	 * Prepares an XMLHttpRequest instance to make a request
	 * 
	 * @param  {String}  method   HTTP method
	 * @param  {String}  url      URL to receive request
	 * @param  {Boolean} async    [Optional] Asynchronous request
	 * @param  {String}  user     [Optional] Basic auth username
	 * @param  {String}  password [Optional] Basic auth password
	 * @return {Object}           XMLHttpRequest
	 */
	XMLHttpRequest.prototype.open = function ( method, url, async, user, password ) {
		var self = this;

		if ( async !== undefined && async !== true) {
			throw Error( label.error.invalidStateNoSync );
		}

		this.abort();
		this._error  = false;
		this._params = {
			method   : method,
			url      : url,
			async    : async    || true,
			user     : user     || null,
			password : password || null
		}

		utility.iterate( headers, function ( v, k ) {
			self._headers[k] = v;
		});

		this.readyState = OPENED;

		return this;
	};

	/**
	 * Overrides the Content-Type of the request
	 * 
	 * @param  {String} mime Mime type of the request ( media type )
	 * @return {Object}      XMLHttpRequest
	 */
	XMLHttpRequest.prototype.overrideMimeType = function ( mime ) {
		this._headers["Content-Type"] = mime;

		return this;
	};

	/**
	 * Removes an event listener from an XMLHttpRequest instance
	 * 
	 * @param {String}   event Event to listen for
	 * @param {Function} fn    Event handler
	 * @return {Object}        XMLHttpRequest
	 */
	XMLHttpRequest.prototype.removeEventListener = function ( event, fn ) {
		if ( !this._listeners.hasOwnProperty( event ) ) {
			return;
		}

		this._listeners[event].remove( fn );

		return this;
	};

	/**
	 * Sends an XMLHttpRequest request
	 * 
	 * @param  {Mixed} data [Optional] Payload to send with the request
	 * @return {Object}     XMLHttpRequest
	 */
	XMLHttpRequest.prototype.send = function ( data ) {
		data     = data || null;
		var self = this,
		    options, parsed, request, obj;

		if ( this.readyState < OPENED ) {
			throw Error( label.error.invalidStateNotOpen );
		}
		else if ( this._send ) {
			throw Error( label.error.invalidStateNotSending );
		}

		parsed      = utility.parse( this._params.url );
		parsed.port = parsed.port || ( parsed.protocol === "https:" ? 443 : 80 );

		if ( this._params.user !== null && this._params.password !== null ) {
			parsed.auth = this._params.user + ":" + this._params.password;
		}

		// Specifying Content-Length accordingly
		if ( regex.put_post.test( this._params.method ) ) {
			this._headers["Content-Length"] = data !== null ? Buffer.byteLength( data ) : 0;
		}

		this._headers["Host"] = parsed.hostname + ( !regex.http_ports.test( parsed.port ) ? ":" + parsed.port : "" );

		options = {
			hostname : parsed.hostname,
			path     : parsed.path,
			port     : parsed.port,
			method   : this._params.method,
			headers  : this._headers
		}

		if ( parsed.protocol === "https:" ) {
			options.rejectUnauthorized = false;
			options.agent              = false;
		}

		if ( parsed.auth !== undefined ) {
			options.auth = parsed.auth;
		}

		self._send = true;
		self.dispatchEvent( "readystatechange" );

		obj = parsed.protocol === "http:" ? http : https;

		request = obj.request( options, function ( arg ) {
			handler.call( self, arg );
		}).on( "error", function ( e ) {
			handlerError.call( self, e );
		});

		data === null ? request.setSocketKeepAlive( true, 10000 ) : request.write( data, "utf8" );
		this._request = request;
		request.end();

		self.dispatchEvent( "loadstart" );

		return this;
	};

	/**
	 * Sets a request header of an XMLHttpRequest instance
	 * 
	 * @param {String} header HTTP header
	 * @param {String} value  Header value
	 * @return {Object}       XMLHttpRequest
	 */
	XMLHttpRequest.prototype.setRequestHeader = function ( header, value ) {
		if ( this.readyState !== OPENED ) {
			throw Error( label.error.invalidStateNotUsable );
		}
		else if ( this._send ) {
			throw Error( label.error.invalidStateNotSending );
		}

		this._headers[header] = value;

		return this;
	};

	return XMLHttpRequest;
};

/**
 * XML methods
 *
 * @class xml
 * @namespace abaaso
 */
var xml = {
	/**
	 * Returns XML (Document) Object from a String
	 *
	 * @method decode
	 * @param  {String} arg XML String
	 * @return {Object}     XML Object or undefined
	 */
	decode : function ( arg ) {
		try {
			var x;

			if ( typeof arg !== "string" || string.isEmpty( arg ) ) throw Error( label.error.invalidArguments );

			if ( client.ie ) {
				x = new ActiveXObject( "Microsoft.XMLDOM" );
				x.async = "false";
				x.loadXML( arg );
			}
			else x = new DOMParser().parseFromString( arg, "text/xml" );

			return x;
		}
		catch ( e ) {
			error( e, arguments, this );

			return undefined;
		}
	},

	/**
	 * Returns XML String from an Object or Array
	 *
	 * @method encode
	 * @param  {Mixed} arg Object or Array to cast to XML String
	 * @return {String}    XML String or undefined
	 */
	encode : function ( arg, wrap ) {
		try {
			if ( arg === undefined ) throw Error( label.error.invalidArguments );

			wrap    = !( wrap === false );
			var x   = wrap ? "<xml>" : "",
			    top = !( arguments[2] === false ),
			    node, i;

			if ( arg !== null && arg.xml !== undefined ) arg = arg.xml;
			if ( arg instanceof Document ) arg = ( new XMLSerializer() ).serializeToString( arg );

			node = function ( name, value ) {
				var output = "<n>v</n>";
				if ( /\&|\<|\>|\"|\'|\t|\r|\n|\@|\$/g.test( value ) ) output = output.replace( "v", "<![CDATA[v]]>" );
				return output.replace( "n", name).replace( "v", value );
			}

			if ( regex.boolean_number_string.test( typeof arg ) ) x += node( "item", arg );
			else if ( typeof arg === "object" ) {
				utility.iterate( arg, function ( v, k ) {
					x += xml.encode( v, ( typeof v === "object" ), false ).replace( /item|xml/g, isNaN( k ) ? k : "item" );
				});
			}

			x += wrap ? "</xml>" : "";

			if ( top ) x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;

			return x;
		}
		catch ( e ) {
			error( e, arguments, this );

			return undefined;
		}
	}
};

// concated before outro.js
error     = utility.error;
bootstrap = function () {
	var self = this,
	    cleanup, fn;

	// Blocking multiple executions
	delete abaaso.bootstrap;

	// Removes references to deleted DOM elements, avoiding memory leaks
	cleanup = function ( obj ) {
		observer.remove( obj );
		array.each( array.cast( obj.childNodes ), function ( i ) {
			cleanup( i );
		});
	};

	fn = function ( e ) {
		if ( regex.complete_loaded.test( document.readyState ) ) {
			if ( typeof self.init === "function" ) {
				self.init.call(self );
			}

			return false;
		}
	};

	// Describing the Client
	if ( !server ) {
		this.client.size    = client.size();
		this.client.version = client.version = client.version();
		this.client.mobile  = client.mobile.call( this );
		this.client.tablet  = client.tablet.call( this );

		// IE7 and older is not supported
		if ( client.ie && client.version < 8 ) {
			throw Error( label.error.upgrade );
		}

		// Curried
		this.array.cast = array.cast();
		this.mouse.view = mouse.view       = mouse.view();
		this.property   = utility.property = utility.property();

		if ( Array.prototype.filter === undefined ) {
			Array.prototype.filter = function ( fn ) {
				if ( this === void 0 || this === null || typeof fn !== "function" ) throw Error( label.error.invalidArguments );

				var i      = null,
				    t      = Object( this ),
				    nth    = t.length >>> 0,
				    result = [],
				    prop   = arguments[1],
				    val    = null;

				for ( i = 0; i < nth; i++ ) {
					if ( i in t ) {
						val = t[i];

						if ( fn.call( prop, val, i, t ) ) {
							result.push( val );
						}
					}
				}

				return result;
			};
		}

		if ( Array.prototype.forEach === undefined ) {
			Array.prototype.forEach = function ( callback, thisArg ) {
				if ( this === null || typeof callback !== "function" ) throw Error( label.error.invalidArguments );

				var T,
				    k   = 0,
				    O   = Object( this ),
				    len = O.length >>> 0;

				if ( thisArg ) {
					T = thisArg;
				}

				while ( k < len ) {
					var kValue;

					if ( k in O ) {
						kValue = O[k];
						callback.call( T, kValue, k, O );
					}
					k++;
				}
			};
		}

		if ( Array.prototype.indexOf === undefined ) {
			Array.prototype.indexOf = function( obj, start ) {
				for ( var i = (start || 0 ), j = this.length; i < j; i++ ) {
					if ( this[i] === obj ) {
						return i;
					}
				}

				return -1;
			}
		}

		if ( Array.prototype.map === undefined ) {
			Array.prototype.map = function ( callback, thisArg ) {
				var T, A, k;

				if ( this == null ) {
					throw new TypeError( "this is null or not defined" );
				}

				var O = Object( this );
				var len = O.length >>> 0;

				if ( {}.toString.call( callback ) != "[object Function]" ) {
					throw new TypeError( callback + " is not a function" );
				}

				if ( thisArg ) {
					T = thisArg;
				}

				A = new Array( len );
				k = 0;

				while ( k < len ) {
					var kValue, mappedValue;

					if ( k in O ) {
						kValue = O[k];
						mappedValue = callback.call( T, kValue, k, O );
						A[k] = mappedValue;
					}
					k++;
				}

				return A;
			}
		}

		if ( Array.prototype.reduce === undefined ) {
			Array.prototype.reduce = function ( accumulator ) {
				if ( this === null || this === undefined ) {
					throw new TypeError( "Object is null or undefined" );
				}

				var i = 0, l = this.length >> 0, curr;

				if ( typeof accumulator !== "function") {
					throw new TypeError( "First argument is not callable" );
				}

				if ( arguments.length < 2 ) {
					if ( l === 0) {
						throw new TypeError( "Array length is 0 and no second argument" );
					}

					curr = this[0];
					i = 1; // start accumulating at the second element
				}
				else {
					curr = arguments[1];
				}

				while ( i < l ) {
					if ( i in this) {
						curr = accumulator.call(undefined, curr, this[i], i, this );
					}

					++i;
				}

				return curr;
			};
		}

		if ( document.documentElement.classList === undefined ) {
			( function (view ) {
				var ClassList, getter, proto, target, descriptor;

				if ( !( "HTMLElement" in view ) && !( "Element" in view ) ) {
					return;
				}

				ClassList = function ( obj ) {
					var classes = !string.isEmpty( obj.className ) ? obj.className.explode( " " ) : [],
					    self    = this;

					array.each( classes, function (i) {
						self.push( i );
					});

					this.updateClassName = function () {
						obj.className = this.join( " " );
					};
				};

				getter = function () {
					return new ClassList( this );
				};

				proto  = ClassList["prototype"] = [];
				target = ( view.HTMLElement || view.Element )["prototype"];

				proto.add = function ( arg ) {
					if ( !array.contains( this, arg ) ) {
						this.push( arg );
						this.updateClassName();
					}
				};

				proto.contains = function ( arg ) {
					return array.contains( this, arg );
				};

				proto.remove = function ( arg ) {
					if ( array.contains(this, arg) ) {
						array.remove( this, arg );
						this.updateClassName();
					}
				};

				proto.toggle = function ( arg ) {
					array[array.contains( this, arg) ? "remove" : "add"]( this, arg );
					this.updateClassName();
				};

				if ( Object.defineProperty ) {
					descriptor = {
						get          : getter,
						enumerable   : !client.ie || client.version > 8 ? true : false,
						configurable : true
					};

					Object.defineProperty( target, "classList", descriptor );
				}
				else if ( Object.prototype.__defineGetter__) {
					target.__defineGetter__( "classList", getter );
				}
				else {
					throw Error( "Could not create classList shim" );
				}
			})( global );
		}

		if ( Function.prototype.bind === undefined ) {
			Function.prototype.bind = function ( arg ) {
				var fn    = this,
				    slice = Array.prototype.slice,
				    args  = slice.call( arguments, 1 );

				return function () {
					return fn.apply( arg, args.concat( slice.call( arguments ) ) );
				};
			};
		}
	}
	else {
		// Cookie class is not relevant for server environment
		delete this.cookie;

		// Curried
		this.array.cast = array.cast();
		this.property   = utility.property = utility.property();

		// XHR shim
		XMLHttpRequest = xhr();
	}

	// Binding helper & namespace to $
	$ = utility.$;
	utility.merge( $, this );
	delete $.$;
	delete $.bootstrap;
	delete $.init;
	delete $.loading;

	// Setting default routes
	route.reset();

	// Shortcut to loading.create
	$.loading   = this.loading.create.bind( $.loading );

	// Unbinding observer methods to maintain scope
	$.fire      = this.fire;
	$.on        = this.on;
	$.once      = this.once;
	$.un        = this.un;
	$.listeners = this.listeners;

	// Hooking abaaso into native Objects
	utility.proto( Array, "array" );

	if ( typeof Element !== "undefined" ) {
		utility.proto( Element, "element" );
	}

	if ( client.ie && client.version === 8 ) {
		utility.proto( HTMLDocument, "element" );
	}

	utility.proto( Function, "function" );
	utility.proto( Number, "number" );
	utility.proto( String, "string" );

	// Creating error log
	$.error.log = this.error.log = [];

	// Setting events & garbage collection
	if ( !server ) {
		observer.add( global, "error", function ( e ) {
			observer.fire( abaaso, "error", e );
		}, "error", global, "all");

		observer.add( global, "hashchange", function (e )  {
			var hash = location.hash.replace( /^\#\!?|\?.*|\#.*/g, "" );

			if ( $.route.current !== hash || self.route.current !== hash ) {
				self.route.current = hash;

				if ( $.route.current !== self.route.current ) {
					$.route.current = self.route.current;
				}

				observer.fire( abaaso, "beforeHash, hash, afterHash", location.hash );
			}
		}, "hash", global, "all");

		observer.add( global, "resize", function ( e )  {
			$.client.size = self.client.size = client.size();
			observer.fire( abaaso, "resize", self.client.size );
		}, "resize", global, "all");

		observer.add( global, "load", function ( e )  {
			observer.fire( abaaso, "render" );
			observer.remove( abaaso, "render" );
			observer.remove( this, "load" );
		});

		if ( typeof Object.observe === "function" ) {
			observer.add( global, "DOMNodeInserted", function ( e ) {
				var obj = utility.target( e );

				Object.observe( obj, function ( arg ) {
					observer.fire( obj, "change", arg );
				});
			}, "mutation", global, "all");
		}

		observer.add( global, "DOMNodeRemoved", function (e ) {
			var obj = utility.target( e );

			if ( obj.id !== undefined && !string.isEmpty( obj.id ) && ( e.relatedNode instanceof Element ) ) {
				cleanup( obj );
			}
		}, "mutation", global, "all");

		// Routing listener
		observer.add( abaaso, "hash", function (arg ) {
			if ( $.route.enabled || self.route.enabled ) {
				route.load( arg );
			}
		}, "route", this.route, "all");
	}

	// Creating a public facade for `state`
	if ( !client.ie || client.version > 8 ) {
		utility.property( this.state, "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
		utility.property( this.state, "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
		utility.property( this.state, "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
		utility.property( $.state,    "current",  {enumerable: true, get: state.getCurrent,  set: state.setCurrent} );
		utility.property( $.state,    "previous", {enumerable: true, get: state.getPrevious, set: state.setPrevious} );
		utility.property( $.state,    "header",   {enumerable: true, get: state.getHeader,   set: state.setHeader} );
	}
	else {
		// Pure hackery, only exists when needed
		$.state.current   = self.state.current   = self.state._current;
		$.state.change    = this.state.change    = function ( arg) { return self.state.current = state.setCurrent(arg ); };
		$.state.setHeader = this.state.setHeader = function ( arg) { return self.state.header  = state.setHeader(arg ); };
	}

	$.ready = true;

	// Preparing init()
	switch ( true ) {
		case typeof exports !== "undefined":
		case typeof define === "function":
			this.init();
			break;
		case ( regex.complete_loaded.test( document.readyState ) ):
			this.init();
			break;
		case typeof document.addEventListener === "function":
			document.addEventListener( "DOMContentLoaded" , function () {
				self.init.call( self );
			}, false);
			break;
		case typeof document.attachEvent === "function":
			document.attachEvent( "onreadystatechange" , fn );
			break;
		default:
			utility.repeat( fn );
	}

	return $;
};

return {
	// Classes
	array           : array,
	callback        : {},
	client          : {
		// Properties
		activex : client.activex,
		android : client.android,
		blackberry : client.blackberry,
		chrome  : client.chrome,
		firefox : client.firefox,
		ie      : client.ie,
		ios     : client.ios,
		linux   : client.linux,
		mobile  : client.mobile,
		opera   : client.opera,
		osx     : client.osx,
		playbook: client.playbook,
		safari  : client.safari,
		tablet  : client.tablet,
		size    : {height: 0, width: 0},
		version : 0,
		webos   : client.webos,
		windows : client.windows,

		// Methods
		del     : function ( uri, success, failure, headers, timeout ) {
			return client.request( uri, "DELETE", success, failure, null, headers, timeout );
		},
		get     : function ( uri, success, failure, headers, timeout ) {
			return client.request( uri, "GET", success, failure, null, headers, timeout );
		},
		headers : function ( uri, success, failure, timeout ) {
			return client.request( uri, "HEAD", success, failure, null, null, timeout );
		},
		patch   : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "PATCH", success, failure, args, headers, timeout );
		},
		post    : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "POST", success, failure, args, headers, timeout );
		},
		put     : function ( uri, success, failure, args, headers, timeout ) {
			return client.request( uri, "PUT", success, failure, args, headers, timeout );
		},
		jsonp   : function ( uri, success, failure, callback ) {
			return client.jsonp(uri, success, failure, callback );
		},
		options : function ( uri, success, failure, timeout ) {
			return client.request(uri, "OPTIONS", success, failure, null, null, timeout );
		},
		permissions : client.permissions
	},
	cookie          : cookie,
	element         : element,
	json            : json,
	label           : label,
	loading         : {
		create  : utility.loading,
		url     : null
	},
	message         : message,
	mouse           : mouse,
	number          : number,
	regex           : regex,
	route           : {
		enabled : false,
		current : route.current,
		del     : route.del,
		hash    : route.hash,
		init    : route.init,
		initial : route.initial,
		list    : route.list,
		load    : route.load,
		reset   : route.reset,
		server  : route.server,
		set     : route.set
	},
	state           : {},
	string          : string,
	xml             : xml,

	// Methods & Properties
	$               : utility.$,
	alias           : utility.alias,
	aliased         : "abaaso",
	allows          : client.allows,
	append          : function ( type, args, obj ) {
		if ( obj instanceof Element ) {
			obj.genId();
		}

		return element.create( type, args, obj, "last" );
	},
	bootstrap       : bootstrap,
	clear           : element.clear,
	clearTimer      : utility.clearTimers,
	clone           : utility.clone,
	coerce          : utility.coerce,
	compile         : utility.compile,
	create          : element.create,
	css             : utility.css,
	data            : data.decorator,
	datalist        : datalist.factory,
	discard         : function ( arg ) {
		return observer.discard( arg );
	},
	debounce        : utility.debounce,
	decode          : json.decode,
	defer           : deferred.factory,
	define          : utility.define,
	del             : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "DELETE", success, failure, null, headers, timeout );
	},
	delay           : utility.defer,
	destroy         : element.destroy,
	encode          : json.encode,
	error           : utility.error,
	expire          : cache.clean,
	expires         : 120000,
	extend          : utility.extend,
	filter          : filter.factory,
	fire            : function ( obj, event ) {
		var all  = typeof obj === "object",
		    o    = all ? obj   : ( this !== $ ? this : abaaso ),
		    e    = all ? event : obj,
		    args = [o, e].concat( array.cast( arguments ).remove( 0, !all ? 0 : 1 ) );

		return observer.fire.apply( observer, args );
	},
	genId           : utility.genId,
	get             : function ( uri, success, failure, headers, timeout ) {
		return client.request( uri, "GET", success, failure, null, headers, timeout );
	},
	grid            : grid.factory,
	guid            : function () {
		return utility.uuid().toUpperCase();
	},
	hash            : route.hash,
	headers         : function ( uri, success, failure, timeout ) {
		return client.request( uri, "HEAD", success, failure, null, {}, timeout );
	},
	hex             : utility.hex,
	hidden          : element.hidden,
	hook            : observer.decorate,
	id              : "abaaso",
	init            : function () {
		// Stopping multiple executions
		delete abaaso.init;

		// Firing events to setup
		return observer.fire( this, "init, ready").un(this, "init, ready" );
	},
	iterate         : utility.iterate,
	jsonp           : function ( uri, success, failure, callback) { return client.jsonp(uri, success, failure, callback ); },
	listeners       : function ( obj, event ) {
		obj = typeof obj === "object" ? obj : ( this !== $ ? this : abaaso );

		return observer.list( obj, event );
	},
	listenersTotal  : observer.sum,
	log             : utility.log,
	logging         : observer.log,
	merge           : utility.merge,
	module          : utility.module,
	object          : utility.object,
	observerable    : observer.decorate,
	on              : function ( obj, event, listener, id, scope, state ) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if ( all ) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = ( this !== $ ? this : abaaso );
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if ( s === undefined ) s = o;

		return observer.add( o, e, l, i, s, st );
	},
	once            : function ( obj, event, listener, id, scope, state ) {
		var all = typeof obj === "object",
		    o, e, l, i, s, st;

		if ( all ) {
			o  = obj;
			e  = event;
			l  = listener;
			i  = id;
			s  = scope;
			st = state;
		}
		else {
			o  = ( this !== $ ? this : abaaso );
			e  = obj;
			l  = event;
			i  = listener;
			s  = id;
			st = scope;
		}

		if ( s === undefined ) s = o;

		return observer.once( o, e, l, i, s, st );
	},
	options         : function ( uri, success, failure, timeout ) {
		return client.request( uri, "OPTIONS", success, failure, null, null, timeout );
	},
	parse           : utility.parse,
	patch           : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PATCH", success, failure, args, headers, timeout );
	},
	pause           : function ( arg ) {
		return observer.pause( ( arg !== false ) );
	},
	permissions     : client.permissions,
	position        : element.position,
	post            : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "POST", success, failure, args, headers, timeout );
	},
	prepend         : function ( type, args, obj ) {
		if ( obj instanceof Element ) obj.genId();
		return element.create( type, args, obj, "first" );
	},
	promise         : promise.factory,
	property        : utility.property,
	put             : function ( uri, success, failure, args, headers, timeout ) {
		return client.request( uri, "PUT", success, failure, args, headers, timeout );
	},
	queryString     : function ( key, string ) {
		return utility.queryString( key, string );
	},
	random          : number.random,
	ready           : false,
	reflect         : utility.reflect,
	repeat          : utility.repeat,
	stylesheet      : utility.stylesheet,
	script          : utility.script,
	stop            : utility.stop,
	store           : data.decorator,
	target          : utility.target,
	tpl             : utility.tpl,
	un              : function ( obj, event, id, state ) {
		var all = typeof obj === "object",
		    o, e, i, s;

		if ( all ) {
			o = obj;
			e = event;
			i = id;
			s = state;
		}
		else {
			o = ( this !== $ ? this : abaaso );
			e = obj;
			i = event;
			s = id;
		}

		return observer.remove( o, e, i, s );
	},
	update          : element.update,
	uuid            : utility.uuid,
	validate        : validate.test,
	version         : "3.7.14",
	walk            : utility.walk,
	when            : utility.when
};

})();

// Bootstrapping the framework
$ = abaaso.bootstrap();

// Node, AMD & window supported
if ( typeof exports !== "undefined" ) {
	module.exports = $;
}
else if ( typeof define === "function" ) {
	define( "abaaso", function () {
		return $;
	});
}
else {
	global.abaaso = $;
}
})( this );
