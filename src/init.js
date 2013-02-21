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
		retrieve("me",     null);
		retrieve("events", loading);
		retrieve("orgs",   loading);
		retrieve("repos",  loading, repos);
	}, function (e) {
		loading.el.destroy();
		loading = null;
		error("Could not consume APIs");
	});
};
