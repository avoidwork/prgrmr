/**
 * Sets up recursive DataStores of repositories
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var repos = function (recs) {
	var obj = $("#repos"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.repos.datalist = $.datalist(obj, prgrmr.repos.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("repos");
};
