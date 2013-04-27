/**
 * Logs a message
 * 
 * @param  {String}  msg    Message to notify
 * @param  {Boolean} silent Boolean indicating if the user should be notified
 * @return {Undefined}      undefined
 */
var log = function (msg, silent) {
	silent = (silent === true);

	$.log(msg);

	if (!silent) {
		humane.log(msg);
	}
};
