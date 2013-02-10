/**
 * Transforms data for a specific NVD3 chart type
 * 
 * @param  {String} type Type of chart
 * @param  {Object} data Data to transform
 * @return {Object}      Promise
 */
var transform = function (type, data) {
	var deferred = $.promise();

	utility.defer(function () {
		var result = {};

		deferred.resolve(result);
	});

	return deferred;
};
