/**
 * Initialization
 *
 * Sets up primary DataStores
 * 
 * @return {Undefined} undefined
 */
var init = function () {
	// Setting year reference
	$("#year").html(new Date().getFullYear());

	// Setting up humane notifications
	global.humane.error = global.humane.spawn({addnCls: "humane-jackedup-error", timeout: 3000});

	// Retrieving the config
	"assets/config.json".get(function (arg) {
		prgrmr.config = arg;
	}, function (e) {
		error(e);
		throw e;
	}).then(function (arg) {
		// Config is not filled out
		if (arg.github.isEmpty()) throw Error($.label.error.invalidArguments);

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
		prgrmr.events.data.setUri("").then(function (arg) { events(arg); }, function (e) { error(e); });
		prgrmr.orgs.data.setUri("").then(function (arg) { orgs(arg); }, function (e) { error(e); });
		prgrmr.repos.data.setUri("").then(function (arg) { repos(arg); }, function (e) { error(e); });

		// Tumblr consumption is optional
		if (!arg.tumblr.isEmpty()) prgrmr.blog.data.setUri(arg.tumblr).then(function (arg) { tumblr(arg); }, function (e) { error(e); });
	}, function (e) {
		error("Could not consume APIs: " + (e.message || e));
	});
};
