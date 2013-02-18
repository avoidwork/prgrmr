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

	section = obj.removeClass("hidden").append("div", {"class": "chart"});
	section.append("h2").text(title);
	section.append("svg", {id: id});

	switch (type) {
		case "pie":
			var width = 500,
			    height = 500;

			arg = function () {
				var obj = nv.models.pieChart()
				            .x(function (d) {
				            	return d.key;
				             })
				            .y(function (d) {
				            	return d.y;
				             })
				            .values(function (d) {
				            	return d;
				            })
				            .showLabels(false)
				            .width(width)
				            .height(height);

				d3.select("#" + id)
				  .datum(data)
				  .transition().duration(1200)
				  .attr("width", width)
				  .attr("height", height)
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
				  .transition().duration(500)
				  .call(obj);

				nv.utils.windowResize(obj.update);
				return obj;
			};
			break;
	}

	return nv.addGraph(arg);
};
