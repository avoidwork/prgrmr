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

var $, prgrmr = {blog: {}, config: {}, events: {}, orgs: {}, repos: {}, templates: {}, version: "0.1.0"};

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
 * Initialization
 *
 * Sets up primary DataStores
 * 
 * @return {Undefined} undefined
 */
var init = function () {
	var contact = $("#contact"),
	    header  = $("header > h1")[0],
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

		// Decorating icons
		contact.create("li").create("a", {href: "https://github.com/" + arg.github, title: "GitHub"}).create("span", {"class": "icon icon-github"});
		if (arg.email.isEmail()) contact.create("li").create("a", {href: "mailto:" + arg.email, title: "Email"}).create("span", {"class": "icon icon-envelope-alt"});
		if (!arg.twitter.isEmpty()) contact.create("li").create("a", {href: "http://twitter.com/" + arg.twitter, title: "Twitter"}).create("span", {"class": "icon icon-twitter"});
		if (!arg.blog.isEmpty()) contact.create("li").create("a", {href: arg.blog, title: "Blog"}).create("span", {"class": "icon icon-rss"});

		// Showing icons
		if (contact.childNodes.length > 0) contact.parentNode.removeClass("hidden");
		
	}, function (e) {
		loading.el.destroy();
		loading = null;
		error(e);
		throw e;
	}).then(function (arg) {
		// Updating API end points
		$.iterate(api, function (v, k) {
			api[k] = v.replace("{{user}}", arg.github);
		});

		// Creating DataStores
		$.iterate(prgrmr, function (v, k) {
			this[k] = $.data({id: k}, null, {key: "id", events: false});
		});

		// Decorating the global namespace with application
		global.prgrmr = prgrmr;
	}, function (e) {
		loading.el.destroy();
		loading = null;
		error("Configuration is not valid: " + (e.message || e));
		throw e;
	}).then(function (arg) {
		retrieve("events", loading);
		retrieve("orgs", loading);
		retrieve("repos", loading);
	}, function (e) {
		loading.el.destroy();
		loading = null;
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
 * Renders a DataList
 * 
 * @return {Undefined} undefined
 */
var render = function (arg) {
	var obj = $("#" + arg),
	    callback;

	/**
	 * DataList callback
	 *
	 * GitHub keys are ints, so they must cast to String for lookup
	 * 
	 * @param  {Object}   obj DataList Element
	 * @return {Undefined}    undefined
	 */
	callback = function (obj) {
		var moments = obj.find(".moment"),
		    rec, el;

		moments.forEach(function (i) {
			i.text(moment(i.text()).fromNow());
		});

		switch (arg) {
			case "events":
				rec = prgrmr[arg].data.get(obj.data("key").toString());
				obj.find("> span")[0].addClass(rec.data.type);
				obj.find("a")[0].attr("title", rec.data.type.replace("Event", "").replace(/([A-Z])/g, " $1").trim())
				break;
			case "repos":
				rec = prgrmr[arg].data.get(obj.data("key").toString());
				el  = obj.find("> a")[0];
				obj.find("> span")[0].addClass(rec.data.fork ? "icon-circle-blank" : "icon-circle");
				if (el.attr("href").isEmpty()) el.attr("href", rec.data.html_url);
				break;
		}
	};

	prgrmr[arg].datalist = $.datalist(obj, prgrmr[arg].data, prgrmr.templates[arg], {callback: callback});
	obj.removeClass("hidden");
	charts(arg);
};

/**
 * Consuming APIs and then executing presentation layer logic
 * 
 * @param  {String} arg     API to retrieve
 * @param  {Object} loading Spinner instance
 * @return {Object}         Promise
 */
var retrieve = function (arg, loading) {
	var deferred = $.promise();

	prgrmr[arg].data.setUri(api[arg]).then(function () {
		("templates/" + arg + ".html").get(function (tpl) {
			prgrmr.templates[arg] = tpl;
			if (loading !== null) {
				loading.el.destroy();
				loading = null;
			}
			render(arg);
			prgrmr[arg].setExpires(300);
			deferred.resolve(true);
		}, function (e) {
			deferred.reject(e);
			error(e);
		});
	}, function (e) {
		if (loading !== null) {
			loading.el.destroy();
			loading = null;
		}
		deferred.reject(e);
		error(e);
	});

	return deferred;
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

	return new Spinner(opts).spin(obj);
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

// Can prgrmr run?
if (typeof abaaso !== "undefined") {
	// Setting internal reference
	$ = global[abaaso.aliased];

	// Setting `render` listener
	$.on("render", function () {
		init();
	});
}

})(this);
