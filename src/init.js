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
		loading.el.destroy();
		loading = null;
		error("Configuration is not valid: " + (e.message || e));
		throw e;
	}).then(function (arg) {
		retrieve("me", null).then(function (rec) {
			var contact = $("#contact"),
			    header  = $("header > h1")[0],
			    title   = $("title")[0];

			if (prgrmr.config.name) {
				header.html(rec.data.name);
				title.html(rec.data.name);
			}

			contact.create("li").create("a", {"class": "github", href: "https://github.com/" + prgrmr.config.github, title: "GitHub"}).create("span", {"class": "icon icon-github"});
			if (prgrmr.config.email && !rec.data.email.isEmpty()) contact.create("li").create("a", {"class": "email", href: "mailto:" + rec.data.email, title: "Email"}).create("span", {"class": "icon icon-envelope-alt"});
			if (!prgrmr.config.twitter.isEmpty()) contact.create("li").create("a", {"class": "twitter", href: "http://twitter.com/" + prgrmr.config.twitter, title: "Twitter"}).create("span", {"class": "icon icon-twitter"});
			if (!prgrmr.config.linkedin.isEmpty()) contact.create("li").create("a", {"class": "linkedin", href: prgrmr.config.linkedin, title: "LinkedIn"}).create("span", {"class": "icon icon-linkedin"});
			if (prgrmr.config.blog && !rec.data.blog.isEmpty()) contact.create("li").create("a", {"class": "blog", href: rec.data.blog, title: "Blog"}).create("span", {"class": "icon icon-rss"});

			// Showing contact icons
			contact.parentNode.removeClass("hidden");

			// Retrieving data
			retrieve("events", loading);
			retrieve("orgs",   loading);
			retrieve("repos",  loading).then(function (arg) {
				repos(arg);
			});
		}, function (e) {
			loading.el.destroy();
			loading = null;
			error("Could not retrieve GitHub account information");
		});
	}, function (e) {
		loading.el.destroy();
		loading = null;
		error("Could not consume APIs");
	});
};
