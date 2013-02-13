/**
 * Sets up a GitHub event DataList
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var events = function (recs) {
	var obj = $("#events"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.events.datalist = $.datalist(obj, prgrmr.events.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("events");
};
