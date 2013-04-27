/**
 * Hooking a DataStore to an API end point
 * 
 * @param  {String} arg API to retrieve
 * @return {Object}     Promise
 */
var retrieve = function (arg) {
	var deferred = prgrmr[arg].data.setUri(api[arg]).then(function (args) {
		if (args.length === 1 && args[0].data.message !== undefined) {
			throw Error(args[0].data.message);
		}

		prgrmr[arg].data.save();
	}, function (e) {
		throw e;
	});

	return deferred;
};
