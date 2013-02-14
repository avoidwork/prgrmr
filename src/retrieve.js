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
}