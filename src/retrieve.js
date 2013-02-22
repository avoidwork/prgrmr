/**
 * Consuming APIs and then executing presentation layer logic
 * 
 * @param  {String} arg     API to retrieve
 * @param  {Object} loading Spinner instance
 * @return {Object}         Promise
 */
var retrieve = function (arg, loading) {
	var deferred = $.promise();

	prgrmr[arg].data.setUri(api[arg]).then(function (args) {
		if (args.length === 1 && args[0].data.message !== undefined) {
			if (loading !== null) {
				loading.el.destroy();
				loading = null;
			}
			return error(args[0].data.message);
		}

		if (arg === "me") deferred.resolve(args[0]);
		else {
			("templates/" + arg + ".html").get(function (tpl) {
				prgrmr.templates[arg] = tpl;
				
				if (loading !== null) {
					loading.el.destroy();
					loading = null;
				}

				render(arg);
				deferred.resolve(args);
			}, function (e) {
				error(e);
				deferred.reject(e);
			});
		}
	}, function (e) {
		if (loading !== null) {
			loading.el.destroy();
			loading = null;
		}
		error(e);
		deferred.reject(e);
	});

	return deferred;
};
