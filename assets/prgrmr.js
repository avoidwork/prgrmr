/**
 * prgrmr
 *
 * Programmer profile for GitHub projects
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/prgrmr/master/LICENSE>
 * @link https://github.com/avoidwork/prgrmr
 * @version 0.1.0
 */

(function (global) {
	"use strict";

	var $, prgrmr = {blog: {}, events: {}, orgs: {}, repos: {}};

/**
 * GitHub API end points
 * 
 * @type {Object}
 */
var api = {
	events   : "/",
	projects : "/"
};

/**
 * Error handler
 * 
 * @param  {Mixed} e Object or String
 * @return {Undefined} undefined
 */
var error = function (e) {
	$.log(e, "error");
	// humane notification?
};

/**
 * Sets up a GitHub event DataList
 * 
 * @return {Undefined} undefined
 */
var events = function () {
	void 0;
};

/**
 * Initialization
 *
 * Sets up primary DataStores
 * 
 * @return {Undefined} undefined
 */
var init = function () {
	// Setting year reference
	$("#year").html(new Date().getFullYear());

	// Retrieving the config
	"assets/config.json".get(function (arg) {
		prgrmr.config = arg;
	}, function (e) {
		error(e);
		throw e;
	}).then(function (arg) {
		// Config is not filled out
		if (arg.github.isEmpty()) throw Error($.label.error.invalidArguments);

		// Creating DataStores
		$.iterate(prgrmr, function (v, k) {
			this[k] = $.data({id: k}, null, {key: "id"});
		});

		// Decorating the global namespace with application
		global.prgrmr = prgrmr;
	}, function (e) {
		error("Configuration is not valid: " + (e.message || e));
		throw e;
	}).then(function (arg) {
		// Consuming APIs and then executing presentation layer logic
		prgrmr.events.data.setUri("").then(function (arg) { events(arg); }, function (e) { error(e); });
		prgrmr.orgs.data.setUri("").then(function (arg) { orgs(arg); }, function (e) { error(e); });
		prgrmr.repos.data.setUri("").then(function (arg) { repos(arg); }, function (e) { error(e); });

		// Tumblr consumption is optional
		if (!arg.tumblr.isEmpty()) prgrmr.blog.data.setUri(arg.tumblr).then(function (arg) { tumblr(arg); }, function (e) { error(e); });
	}, function (e) {
		error("Could not consume APIs: " + (e.message || e));
	});
};

/**
 * Sets up a few DataLists for organizations
 * 
 * @return {Undefined} undefined
 */
var orgs = function () {
	void 0;
};

/**
 * Sets up recursive DataStores of repositories
 * 
 * @return {Undefined} undefined
 */
var repos = function () {
	void 0;
};

/**
 * Transforms data for a specific NVD3 chart type
 * 
 * @param  {String} type Type of chart
 * @param  {Object} data Data to transform
 * @return {Object}      Promise
 */
var transform = function (type, data) {
	var deferred = $.promise();

	utility.defer(function () {
		var result = {};

		deferred.resolve(result);
	});

	return deferred;
};

// Setting internal reference
$ = global[abaaso.aliased];

// Setting `render` listener
$.on("render", function () {
	init();
});

})(this);
