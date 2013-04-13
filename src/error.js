/**
 * Error handler
 * 
 * @param  {Mixed} e Object or String
 * @return {Undefined} undefined
 */
var error = function (e) {
	var msg = e.message || e;

	$.log(msg, "error");
	window.humane.error(msg);
};
