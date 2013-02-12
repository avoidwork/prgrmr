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
	    year    = $("#year"),
	    main    = $("article")[0],
	    loading;

	// Setting up humane notifications
	global.humane.error = global.humane.spawn({addnCls: "humane-jackedup-error", timeout: 3000});

	// Decorating placeholders
	version.html(prgrmr.version);
	year.html(new Date().getFullYear());

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
