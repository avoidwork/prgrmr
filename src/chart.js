/**
 * Renders charts
 * 
 * @param  {String} type  Type of chart to render
 * @param  {String} title Chart title
 * @param  {Object} data  Chart data
 * @return {Undefined}    undefined
 */
var chart = function (type, title, data, obj, colors) {
	colors = colors || d3.scale.category10().range();
	var id = obj.id,
	    arg;

	$("#charts").removeClass("hidden");

	obj.parentNode.prepend("h2").text(title);

	switch (type) {
		case "pie":
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
				            .tooltipContent(function (key, y, e, graph) {
				            	return "<h3>" + key + "</h3>" + "<span>" + y + "%</span>";
				             })
				            .color(colors)
				            .showLabels(false);

				d3.select("#" + id)
				  .datum(data)
				  .transition().duration(1200)
				  .call(obj);

				return obj;
			};
			break;
		case "scatter":
			arg = function () {
				nv.addGraph(function() {
					var obj = nv.models.scatterChart()
					            .showDistX(true)
					            .showDistY(true)
					            .color(d3.scale.category10().range());

					obj.xAxis.tickFormat(d3.format('.02f'))
					obj.yAxis.tickFormat(d3.format('.02f'))

					d3.select("#" + id)
					  .datum(randomData(4,40))
					  .transition().duration(500)
					  .call(obj);

					nv.utils.windowResize(obj.update);

					return obj;
				});
			};
			break;
	}

	return nv.addGraph(arg);
};
