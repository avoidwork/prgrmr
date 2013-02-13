/**
 * Sets up a few DataLists for organizations
 * 
 * @param  {Array} recs DataStore records
 * @return {Undefined}  undefined
 */
var orgs = function (recs) {
	var obj = $("#orgs"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.orgs.datalist = $.datalist(obj, prgrmr.orgs.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("orgs");
};
