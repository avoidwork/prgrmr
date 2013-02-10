/**
 * Initialization
 *
 * Sets up primary DataStores
 * 
 * @return {Undefined} undefined
 */
var init = function () {
	// Setting year reference
	$("#year").html(new Date().getFullYear());

	// Creating DataStores
	$.iterate(prgrmr, function (v, k) {
		prgrmr[k] = $.data({id: k}, null, {key: "id"});
	});

	// Decorating the global namespace with the app structure
	global.prgrmr = prgrmr;
};
