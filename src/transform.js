/**
 * Transforms data for a specific NVD3 chart type
 * 
 * @param  {String} type Type of chart
 * @param  {Object} data Data to transform
 * @return {Array}       NVD3 chart data
 */
var transform = function (type, data, args) {
	var result     = [],
	    epochs     = [],
	    types      = [],
	    categories = [],
	    series     = [],
	    records    = {},
	    pie        = [],
	    tmp        = {},
	    total      = 0;

	switch (type) {
		case "pie":
			if (args.type === "events") {
				data.forEach(function (i) {
					tmp[i.data.type] = tmp[i.data.type] + 1 || 0;
					total++;
				});

				$.iterate(tmp, function (v, k) {
					series.push({
						label : k.replace("Event", "").replace(/([A-Z])/g, " $1").trim(),
						value : ((v / total) * 100)
					});
				});
			}

			result = [series];
			break;

		case "stackedArea":
			/**
			 * {
			 * 		key: "label",
			 * 		values: [[epoch, value]]
			 * }
			 */
			break;
	}

	return result;
};
