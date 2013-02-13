/**
 * Sets up recursive DataStores of repositories
 * 
 * @return {Undefined} undefined
 */
var repos = function () {
	var obj = $("#repos"),
	    callback;

	callback = function (arg) {
		void 0;
	};

	prgrmr.repos.datalist = $.datalist(obj, prgrmr.repos.data, prgrmr.templates.repos, callback);
	obj.removeClass("hidden");
	charts("repos");
};
