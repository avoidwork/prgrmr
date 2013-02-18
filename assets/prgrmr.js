/**
 * prgrmr
 *
 * Single page JavaScript dashboard of a Programmer's activity on GitHub
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/prgrmr/master/LICENSE>
 * @link https://github.com/avoidwork/prgrmr
 * @version 0.1.0
 */

(function (global) {
"use strict";

var $,
    dColors = ["#FF0000", "#FF7400", "#009999", "#00CC00", "#FFF141", "#A1F73F", "#FFBB00", "#A7A500", "#7B005D", "#450070", "#5F15F6", "#EA0043", "#2AF000", "#41D988", "#3FA9CD", "#046889", "#F09C45", "#7BB000"],
    eColors = ["CommitCommentEvent", "CreateEvent", "DeleteEvent", "DownloadEvent", "FollowEvent", "ForkEvent", "ForkApplyEvent", "GistEvent", "GollumEvent", "IssueCommentEvent", "IssuesEvent", "MemberEvent", "PublicEvent", "PullRequestEvent", "PullRequestReviewCommentEvent", "PushEvent", "TeamAddEvent", "WatchEvent"],
    prgrmr  = {blog: {}, config: {}, events: {}, orgs: {}, repos: {}, templates: {}, version: "0.1.0"};

/**
 * GitHub API end points
 * 
 * @type {Object}
 */
var api = {
	events : "https://api.github.com/users/{{user}}/events?callback=?",
	orgs   : "https://api.github.com/users/{{user}}/orgs?callback=?",
	repos  : "https://api.github.com/users/{{user}}/repos?callback=?"
};

/**
 * Renders charts
 * 
 * @param  {String} type  Type of chart to render
 * @param  {String} title Chart title
 * @param  {Object} data  Chart data
 * @return {Undefined}    undefined
 */
var chart = function (type, title, data, colors) {
	colors  = colors || d3.scale.category10().range();
	var obj = $("#charts"),
	    id  = $.genId(true),
	    arg, section;

	section = obj.removeClass("hidden").append("div", {"class": "chart"});
	section.append("h2").text(title);
	section.append("svg", {id: id});

	switch (type) {
		case "pie":
			arg = function () {
				var obj = nv.models.pieChart()
				            .x(function (d) {
				            	return d.key;
				             })
				            .y(function (d) {
				            	return d.y;
				             })
				            .values(function (d) {
				            	return d;
				             })
				            .tooltipContent(function (key, y, e, graph) {
				            	return "<h3>" + key + "</h3>" + "<span>" + y + "%</span>";
				             })
				            .color(colors)
				            .showLabels(false);

				d3.select("#" + id)
				  .datum(data)
				  .transition().duration(1200)
				  .call(obj);

				return obj;
			};
			break;
	}

	return nv.addGraph(arg);
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
		contact.create("li").create("a", {"class": "github", href: "https://github.com/" + arg.github, title: "GitHub"}).create("span", {"class": "icon icon-github"});
		if (arg.email.isEmail()) contact.create("li").create("a", {"class": "email", href: "mailto:" + arg.email, title: "Email"}).create("span", {"class": "icon icon-envelope-alt"});
		if (!arg.twitter.isEmpty()) contact.create("li").create("a", {"class": "twitter", href: "http://twitter.com/" + arg.twitter, title: "Twitter"}).create("span", {"class": "icon icon-twitter"});
		if (!arg.linkedin.isEmpty()) contact.create("li").create("a", {"class": "linkedin", href: arg.blog, title: "LinkedIn"}).create("span", {"class": "icon icon-linkedin"});
		if (!arg.blog.isEmpty()) contact.create("li").create("a", {"class": "blog", href: arg.blog, title: "Blog"}).create("span", {"class": "icon icon-rss"});

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
			this[k] = $.data({id: k}, null, {key: "id", events: false, callback: "callback", source: "data"});
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
	    callback, colors, data;

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
		    el, rec;

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
				obj.find("> span")[0].addClass(rec.data.fork ? "icon-circle-blank forked" : "icon-circle authored");
				if (el.attr("href").isEmpty()) el.attr("href", rec.data.html_url);
				break;
		}
	};

	prgrmr[arg].datalist = $.datalist(obj, prgrmr[arg].data, prgrmr.templates[arg], {callback: callback});
	obj.removeClass("hidden");
	
	switch (arg) {
		case "events":
			colors = [];
			data   = transform("pie", prgrmr[arg].data.get(), arg);

			// Syncing colors
			data[0].forEach(function (i) {
				colors.push(dColors[eColors.index(i.key + "Event")] || dColors.last());
			});

			chart("pie", "Recent Activities", data, colors);
			break;
		case "orgs":
			break;
		case "repos":
			chart("pie", "Repositories", transform("pie", prgrmr[arg].data.get(), arg), ["#009999", "#9FEE00"]);
			break;
	}
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
 * @return {Array}       NVD3 chart data
 */
var transform = function (chartType, data, type) {
	var result = [],
	    series = [],
	    tmp    = {},
	    total  = 0;

	switch (chartType) {
		case "pie":
			if (type === "events") {
				data.forEach(function (i) {
					var prop = i.data.type;

					tmp[prop] = tmp[prop] + 1 || 1;
					total++;
				});

				$.iterate(tmp, function (v, k) {
					series.push({
						key : k.replace("Event", "").replace(/([A-Z])/g, " $1").trim(),
						y   : ((v / total) * 100)
					});
				});
			}
			else if (type === "repos") {
				data.forEach(function (i) {
					var prop = i.data.fork ? "Forked" : "Authored";

					tmp[prop] = tmp[prop] + 1 || 1;
					total++;
				});

				$.iterate(tmp, function (v, k) {
					series.push({
						key : k,
						y   : ((v / total) * 100)
					});
				});
			}

			result = [series];
			break;
	}

	return result;
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
