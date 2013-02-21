/**
 * Consuming APIs and then executing presentation layer logic
 * 
 * @param  {String}   arg      API to retrieve
 * @param  {Object}   loading  Spinner instance
 * @param  {Function} callback [Optional] Callback function to execute after retrieving a template
 * @return {Object}            Promise
 */
var retrieve = function (arg, loading, callback) {
	var deferred = $.promise();

	prgrmr[arg].data.setUri(api[arg]).then(function (args) {
		if (args.length === 1 && args[0].data.message !== undefined) {
			if (loading !== null) {
				loading.el.destroy();
				loading = null;
			}
			return error(args[0].data.message);
		}

		("templates/" + arg + ".html").get(function (tpl) {
			prgrmr.templates[arg] = tpl;
			
			if (loading !== null) {
				loading.el.destroy();
				loading = null;
			}

			render(arg);
			
			// Expires in 10 minutes
			prgrmr[arg].data.setExpires(600000);
			
			if (typeof callback === "function") callback(args);
			
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
