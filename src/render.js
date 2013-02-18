/**
 * Renders a DataList
 * 
 * @return {Undefined} undefined
 */
var render = function (arg) {
	var obj = $("#" + arg),
	    callback;

	/**
	 * DataList callback
	 *
	 * GitHub keys are ints, so they must cast to String for lookup
	 * 
	 * @param  {Object}   obj DataList Element
	 * @return {Undefined}    undefined
	 */
	callback = function (obj) {
		var moments = obj.find(".moment"),
		    rec, el;

		moments.forEach(function (i) {
			i.text(moment(i.text()).fromNow());
		});

		switch (arg) {
			case "events":
				rec = prgrmr[arg].data.get(obj.data("key").toString());
				obj.find("> span")[0].addClass(rec.data.type);
				obj.find("a")[0].attr("title", rec.data.type.replace("Event", "").replace(/([A-Z])/g, " $1").trim())
				break;
			case "repos":
				rec = prgrmr[arg].data.get(obj.data("key").toString());
				el  = obj.find("> a")[0];
				obj.find("> span")[0].addClass(rec.data.fork ? "icon-circle-blank" : "icon-circle");
				if (el.attr("href").isEmpty()) el.attr("href", rec.data.html_url);
				break;
		}
	};

	prgrmr[arg].datalist = $.datalist(obj, prgrmr[arg].data, prgrmr.templates[arg], {callback: callback});
	obj.removeClass("hidden");
	
	switch (arg) {
		case "events":
			chart("pie", "Types of Events", transform("pie", prgrmr[arg].data.get(), arg));
			break;
		case "orgs":
			break;
		case "repos":
			chart("pie", "Types of Repositories", transform("pie", prgrmr[arg].data.get(), arg));
			break;
	}
};
