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

	var $, prgrmr = {blog: {}, events: {}, orgs: {}, repos: {}};

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

// Setting internal reference
$ = global[abaaso.aliased];

// Setting `render` listener
$.on("render", function () {
	init();
});

})(this);
