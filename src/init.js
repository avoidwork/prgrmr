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
	"assets/config.json".get(function (arg) {
		// Did you edit config.json?
		if (arg.github.isEmpty()) throw Error($.label.error.invalidArguments);

		// Setting config on namespace
		prgrmr.config = arg;
	}, function (e) {
		loading.el.destroy();
		loading = null;
		error(e);
		throw e;
	}).then(function (arg) {
		// Updating API end points & creating DataStores
		$.iterate(api, function (v, k) {
			api[k]    = v.replace("{{user}}", arg.github);
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
	}).then(function (arg) {
		retrieve("me").then(function (args) {
			var rec     = args[0],
			    contact = $("#contact"),
			    header  = $("header > h1")[0],
			    title   = $("title")[0];

			// Decorating header & window
			if (prgrmr.config.name) {
				header.html(rec.data.name);
				title.html(rec.data.name);
			}

			// Showing contact icons
			contact.create("li").create("a", {"class": "github", href: "https://github.com/" + prgrmr.config.github, title: "GitHub"}).create("span", {"class": "icon icon-github"});
			if (prgrmr.config.email && !rec.data.email.isEmpty()) contact.create("li").create("a", {"class": "email", href: "mailto:" + rec.data.email, title: "Email"}).create("span", {"class": "icon icon-envelope-alt"});
			if (!prgrmr.config.twitter.isEmpty()) contact.create("li").create("a", {"class": "twitter", href: "http://twitter.com/" + prgrmr.config.twitter, title: "Twitter"}).create("span", {"class": "icon icon-twitter"});
			if (!prgrmr.config.linkedin.isEmpty()) contact.create("li").create("a", {"class": "linkedin", href: prgrmr.config.linkedin, title: "LinkedIn"}).create("span", {"class": "icon icon-linkedin"});
			if (prgrmr.config.blog && !rec.data.blog.isEmpty()) contact.create("li").create("a", {"class": "blog", href: rec.data.blog, title: "Blog"}).create("span", {"class": "icon icon-rss"});
			contact.parentNode.removeClass("hidden");

			// Removing spinner
			loading.el.destroy();
			loading = null;

			// Retrieving data
			retrieve("events").then(function () {
				prepare("events").then(function () {
					render("events");
				}, function (e) {
					error(e);
				});
			}, function (e) {
				error(e);
			});

			retrieve("orgs").then(function () {
				prepare("orgs").then(function () {
					render("orgs");
				}, function (e) {
					error(e);
				});
			}, function (e) {
				error(e);
			});

			retrieve("repos").then(function () {
				prepare("repos").then(function () {
					render("repos");
					repos();
				}, function (e) {
					error(e);
				});
			}, function (e) {
				error(e);
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
