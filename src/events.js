/**
 * Sets up a GitHub event DataList
 * 
 * @return {Undefined} undefined
 */
var events = function () {
	var obj = $("#events"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.events.datalist = $.datalist(obj, prgrmr.events.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("events");
};
