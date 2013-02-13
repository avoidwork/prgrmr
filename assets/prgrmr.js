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
 * Renders charts
 * 
 * @param  {String} type Type of chart to render
 * @return {Undefined}   undefined
 */
var charts = function (type) {
	var obj = $("#charts");

	obj.removeClass("hidden");
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
	var obj = $("#events"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.events.datalist = $.datalist(obj, prgrmr.events.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("events");
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
	    main    = $("article")[0],
	    loading;

	// Setting up humane notifications
	global.humane.error = global.humane.spawn({addnCls: "humane-jackedup-error", timeout: 3000});

	// Decorating placeholders
	if (version !== "undefined") version.html(prgrmr.version);

	// Adding a spinner
	loading = spinner(main, "large");

	// Retrieving the config
	"assets/config.json".get(function (arg) {
		// Did you edit config.json?
		if (arg.github.isEmpty()) throw Error($.label.error.invalidArguments);

		// Setting config on namespace
		prgrmr.config = arg;

		// Decorating placeholders
		header.html(arg.name);
		title.html(arg.name);
	}, function (e) {
		error(e);
		throw e;
	}).then(function (arg) {
		// Updating API end points
		$.iterate(api, function (v, k) {
			api[k] = v.replace("{{user}}", arg.github);
		});

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
		prgrmr.events.data.setUri(api.events).then(function (arg) {
			loading.el.destroy();
			events(arg);
		}, function (e) {
			loading.el.destroy();
			error(e);
		});

		prgrmr.orgs.data.setUri(api.orgs).then(function (arg) {
			loading.el.destroy();
			orgs(arg);
		}, function (e) {
			loading.el.destroy();
			error(e);
		});

		prgrmr.repos.data.setUri(api.repos).then(function (arg) {
			loading.el.destroy();
			repos(arg);
		}, function (e) {
			loading.el.destroy();
			error(e);
		});

		// Setting expiration for a polling affect (5min)
		prgrmr.events.setExpires(300);
		prgrmr.orgs.setExpires(300);
		prgrmr.repos.setExpires(300);

		// Tumblr consumption is optional
		if (!arg.tumblr.isEmpty()) prgrmr.blog.data.setUri(arg.tumblr).then(function (arg) { tumblr(arg); }, function (e) { error(e); });
	}, function (e) {
		error("Could not consume APIs");
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
	var obj = $("#orgs"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.orgs.datalist = $.datalist(obj, prgrmr.orgs.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("orgs");
};

/**
 * Sets up recursive DataStores of repositories
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var repos = function (recs) {
	var obj = $("#repos"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.repos.datalist = $.datalist(obj, prgrmr.repos.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("repos");
};

/**
 * Creates a spinner inside an Element
 * 
 * @param  {Object} obj Element receiving the spinner
 * @return {Object}     Spinner
 */
var spinner = function (obj, size) {
	obj  = $.object(obj);
	size = size || "small"
	var spinner, opts;

	opts = {
		lines     : 13,
		length    : 5,
		width     : 2,
		radius    : 5,
		corners   : 1,
		rotate    : 0,
		color     : "#000",
		speed     : 1,
		trail     : 70,
		shadow    : true,
		hwaccel   : true,
		className : "spinner",
		zIndex    : 2e9,
		top       : "auto",
		left      : "auto"
	}

	switch (size) {
		case "small":
			opts.length = 4;
			opts.radius = 4;
			opts.width  = 2;
			break;
		case "medium":
			opts.length = 7;
			opts.radius = 7;
			opts.width  = 3;
			break;
		case "large":
		default:
			opts.length = 12;
			opts.radius = 12;
			opts.width  = 3;
			break;
	}

	spinner = new Spinner(opts).spin(obj);

	return spinner;
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
