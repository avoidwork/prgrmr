/**
 * Prepares the GUI by retrieving a template
 * 
 * @param  {String} arg API end point
 * @return {Object}     Promise
 */
var prepare = function (arg) {
	var deferred = ("templates/" + arg + ".html").get(function (tpl) {
		prgrmr.templates[arg] = tpl;
	}, function (e) {
		throw e;
	});

	return deferred;
};
