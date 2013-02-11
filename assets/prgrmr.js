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

var $, prgrmr = {blog: {}, config: {}, events: {}, orgs: {}, repos: {}, version: "0.1.0"};

/**
 * GitHub API end points
 * 
 * @type {Object}
 */
var api = {
	events : "https://api.github.com/users/{{user}}/events",
	orgs   : "https://api.github.com/users/{{user}}/orgs",
	repos  : "https://api.github.com/users/{{user}}/repos"
};

/**
 * Error handler
 * 
 * @param  {Mixed} e Object or String
 * @return {Undefined} undefined
 */
var error = function (e) {
	var msg = e.message || e;

	$.log(msg, "error");
	global.humane.error(msg);
};

/**
 * Sets up a GitHub event DataList
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var events = function (recs) {
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
	var header  = $("header > h1")[0],
	    title   = $("title")[0],
	    version = $("#version"),
	    year    = $("#year");

	// Setting up humane notifications
	global.humane.error = global.humane.spawn({addnCls: "humane-jackedup-error", timeout: 3000});

	// Decorating placeholders
	version.html(prgrmr.version);
	year.html(new Date().getFullYear());
	$("header > h1").text()

	// Retrieving the config
	"assets/config.json".get(function (arg) {
		// Setting config on namespace
		prgrmr.config = arg;

		// Decorating placeholders
		header.html(header.html() + ": " + arg.name);
		title.html(title.html() + ": " + arg.name);
	}, function (e) {
		error(e);
		throw e;
	}).then(function (arg) {
		if (arg.github.isEmpty()) throw Error($.label.error.invalidArguments);
		else {
			$.iterate(api, function (v, k) {
				api[k] = v.replace("{{user}}", arg.github);
			});
		}

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
		prgrmr.events.data.setUri(api.events).then(function (arg) { events(arg); }, function (e) { error(e); });
		prgrmr.orgs.data.setUri(api.orgs).then(function (arg) { orgs(arg); }, function (e) { error(e); });
		prgrmr.repos.data.setUri(api.repos).then(function (arg) { repos(arg); }, function (e) { error(e); });

		// Setting expiration for a polling affect (5min)
		prgrmr.events.setExpires(300);
		prgrmr.orgs.setExpires(300);
		prgrmr.repos.setExpires(300);

		// Tumblr consumption is optional
		if (!arg.tumblr.isEmpty()) prgrmr.blog.data.setUri(arg.tumblr).then(function (arg) { tumblr(arg); }, function (e) { error(e); });
	}, function (e) {
		error("Could not consume APIs: " + (e.message || e));
	});
};

/**
 * Logs a message
 * 
 * @param  {String}  msg    Message to notify
 * @param  {Boolean} silent Boolean indicating if the user should be notified
 * @return {Undefined}      undefined
 */
var log = function (msg, silent) {
	silent = (silent === true);

	$.log(msg);
	if (!silent) humane.log(msg);
};

/**
 * Sets up a few DataLists for organizations
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var orgs = function (recs) {
	void 0;
};

/**
 * Sets up recursive DataStores of repositories
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var repos = function (recs) {
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
