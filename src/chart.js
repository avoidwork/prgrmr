/**
 * Renders charts
 * 
 * @param  {String} type Type of chart to render
 * @param  {Object} data Chart data
 * @return {Undefined}   undefined
 */
var chart = function (type, title, data) {
	var obj = $("#charts"),
	    id  = $.genId(true),
	    arg, section;

	section = obj.removeClass("hidden").append("section", {"class": "chart"});
	section.append("h2").text(title);
	section.append("svg", {id: id});

	switch (type) {
		case "pie":
			arg = function () {
				var obj = nv.models.pieChart()
				            .x(function (d) {
				            	return d.label;
				             })
				            .y(function (d) {
				            	return d.value;
				             })
				            .values(function (d) {
				            	return d;
				            })
				            .showLabels(false);

				d3.select("#" + id)
				  .datum(data)
				  .transition()
				  .duration(1200)
				  .call(obj);

				return obj;
			};
			break;

		case "stackedArea":
			arg = function () {
				var obj = nv.models.stackedAreaChart()
				                   .x(function (d) {
				                   		return d[0];
				                   	})
				                   .y(function (d) {
				                   		return d[1];
				                   	})
				                   .clipEdge(true);

				obj.xAxis
				   .tickFormat(function (d) {
				   		return d3.time.format('%x')(new Date(d));
				   	});

				obj.yAxis
				   .tickFormat(d3.format(',.2f'));

				d3.select("#" + id)
				  .datum(data)
				  .transition()
				  .duration(500)
				  .call(obj);

				nv.utils.windowResize(obj.update);
				return obj;
			};
			break;
	}

	return nv.addGraph(arg);
};
