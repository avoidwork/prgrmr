/**
 * prgrmr
 *
 * Programmer profile for GitHub projects
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/prgrmr/master/LICENSE>
 * @link https://github.com/avoidwork/prgrmr
 * @version 0.1.0
 */

(function (global) {
	"use strict";

	var $;

/**
 * GitHub API end points
 * 
 * @type {Object}
 */
var api = {
	events   : "/",
	projects : "/"
};

/**
 * Initialization
 * 
 * @return {Undefined} undefined
 */
var init = function () {
	$("#year").html(new Date().getFullYear());
};

// Setting internal reference
$ = global[abaaso.aliased];

// Setting `render` listener
$.on("render", function () {
	init();
});

})(this);
