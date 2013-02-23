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
	    total  = data.length;

	switch (chartType) {
		case "pie":
			if (type === "events") {
				data.forEach(function (i) {
					var prop = i.data.type;

					tmp[prop] = tmp[prop] + 1 || 1;
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
				});

				series.push({key: "Authored", y: ((tmp["Authored"] / total) * 100)});
				series.push({key: "Forked",   y: ((tmp["Forked"] / total)   * 100)});
			}

			result = [series];
			break;
	}

	return result;
};
