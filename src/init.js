/**
 * Initialization
 *
 * Sets up primary DataStores
 * 
 * @return {Undefined} undefined
 */
var init = function () {
	var version = $("#version"),
	    main    = $("article")[0],
	    tpl     = {key: "id", events: false, callback: "callback", source: "data"},
	    loading;

	// Setting up humane notifications
	global.humane.error = global.humane.spawn({addnCls: "humane-jackedup-error", timeout: 3000});

	// Decorating placeholders
	if (version !== "undefined") version.html(prgrmr.version);

	// Adding a spinner
	loading = spinner(main, "large");

	// Retrieving the config
	"assets/config.json".get(function (config) {
		// Did you edit config.json?
		if (config.github.isEmpty()) throw Error($.label.error.invalidArguments);

		// Setting config on namespace
		prgrmr.config = config;
	}, function (e) {
		loading.el.destroy();
		loading = null;
		error(e);
		throw e;
	}).then(function (config) {
		// Updating API end points & creating DataStores
		$.iterate(api, function (v, k) {
			api[k]    = v.replace("{{user}}", config.github);
			prgrmr[k] = $.data({id: k}, null, tpl);
		});

		// Decorating the global namespace with application
		global.prgrmr = prgrmr;
	}, function (e) {
		if (loading !== null) {
			loading.el.destroy();
			loading = null;
		}
		error("Configuration is not valid: " + (e.message || e));
		throw e;
	}).then(function (config) {
		retrieve("me").then(function (recs) {
			var rec     = recs[0],
			    contact = $("#contact"),
			    header  = $("header > h1")[0],
			    title   = $("title")[0];

			// Decorating header & window
			if (config.name) {
				header.html(rec.data.name);
				title.html(rec.data.name);
			}

			// Showing contact icons
			contact.create("li").create("a", {"class": "github", href: "https://github.com/" + config.github, title: "GitHub"}).create("span", {"class": "icon icon-github"});
			if (config.email && rec.data.email !== null) contact.create("li").create("a", {"class": "email", href: "mailto:" + rec.data.email, title: "Email"}).create("span", {"class": "icon icon-envelope-alt"});
			if (!config.gplus.isEmpty()) contact.create("li").create("a", {"class": "gplus", href: "https://plus.google.com/" + config.gplus, title: "Google Plus"}).create("span", {"class": "icon icon-google-plus"});
			if (!config.twitter.isEmpty()) contact.create("li").create("a", {"class": "twitter", href: "http://twitter.com/" + config.twitter, title: "Twitter"}).create("span", {"class": "icon icon-twitter"});
			if (!config.linkedin.isEmpty()) contact.create("li").create("a", {"class": "linkedin", href: config.linkedin, title: "LinkedIn"}).create("span", {"class": "icon icon-linkedin"});
			if (config.blog && rec.data.blog !== null) contact.create("li").create("a", {"class": "blog", href: rec.data.blog, title: "Blog"}).create("span", {"class": "icon icon-rss"});

			contact.parentNode.removeClass("hidden");

			// Removing spinner
			loading.el.destroy();
			loading = null;

			// Retrieving data
			["events", "orgs", "repos"].forEach(function (i) {
				prgrmr[i].data.restore();

				if (prgrmr[i].data.total > 0) {
					prepare(i).then(function () {
						render(i);
					}, function (e) {
						error(e);
					});
				}

				retrieve(i).then(function () {
					prepare(i).then(function () {
						render(i);
					}, function (e) {
						error(e);
					});
				}, function (e) {
					error(e);
				});	
			});
		}, function (e) {
			loading.el.destroy();
			loading = null;
			error("Could not retrieve GitHub account: " + e.message);
		});
	}, function (e) {
		error("Could not consume APIs");
	});
};
