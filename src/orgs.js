/**
 * Sets up a few DataLists for organizations
 * 
 * @return {Undefined} undefined
 */
var orgs = function () {
	var obj = $("#orgs"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.orgs.datalist = $.datalist(obj, prgrmr.orgs.data, "{{id}}", callback);

	obj.removeClass("hidden");

	charts("orgs");
};
