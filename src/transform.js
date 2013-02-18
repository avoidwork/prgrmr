/**
 * Transforms data for a specific NVD3 chart type
 * 
 * @param  {String} type Type of chart
 * @param  {Object} data Data to transform
 * @return {Array}       NVD3 chart data
 */
var transform = function (chartType, data, type) {
	var result = [],
	    series = [],
	    tmp    = {},
	    total  = 0;

	switch (chartType) {
		case "pie":
			if (type === "events") {
				data.forEach(function (i) {
					var prop = i.data.type;

					tmp[prop] = tmp[prop] + 1 || 1;
					total++;
				});

				$.iterate(tmp, function (v, k) {
					series.push({
						key : k.replace("Event", "").replace(/([A-Z])/g, " $1").trim(),
						y   : ((v / total) * 100)
					});
				});
			}
			else if (type === "repos") {
				data.forEach(function (i) {
					var prop = i.data.fork ? "Forked" : "Authored";

					tmp[prop] = tmp[prop] + 1 || 1;
					total++;
				});

				$.iterate(tmp, function (v, k) {
					series.push({
						key : k,
						y   : ((v / total) * 100)
					});
				});
			}

			result = [series];
			break;
	}

	return result;
};
