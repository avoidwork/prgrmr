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
