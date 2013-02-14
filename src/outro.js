// Can prgrmr run?
if (typeof abaaso !== "undefined") {
	// Setting internal reference
	$ = global[abaaso.aliased];

	// Setting `render` listener
	$.on("render", function () {
		init();
	});
}

})(this);
