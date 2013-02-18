/**
 * Renders charts
 * 
 * @param  {String} type  Type of chart to render
 * @param  {String} title Chart title
 * @param  {Object} data  Chart data
 * @return {Undefined}    undefined
 */
var chart = function (type, title, data, colors) {
	colors  = colors || d3.scale.category10().range();
	var obj = $("#charts"),
	    id  = $.genId(true),
	    arg, section;

	section = obj.removeClass("hidden").append("div", {"class": "chart"});
	section.append("h2").text(title);
	section.append("svg", {id: id});

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
	}

	return nv.addGraph(arg);
};
