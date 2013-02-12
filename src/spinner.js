/**
 * Creates a spinner inside an Element
 * 
 * @param  {Object} obj Element receiving the spinner
 * @return {Object}     Spinner
 */
var spinner = function (obj, size) {
	obj  = $.object(obj);
	size = size || "small"
	var spinner, opts;

	opts = {
		lines     : 13,
		length    : 5,
		width     : 2,
		radius    : 5,
		corners   : 1,
		rotate    : 0,
		color     : "#000",
		speed     : 1,
		trail     : 70,
		shadow    : true,
		hwaccel   : true,
		className : "spinner",
		zIndex    : 2e9,
		top       : "auto",
		left      : "auto"
	}

	switch (size) {
		case "small":
			opts.length = 4;
			opts.radius = 4;
			opts.width  = 2;
			break;
		case "medium":
			opts.length = 7;
			opts.radius = 7;
			opts.width  = 3;
			break;
		case "large":
		default:
			opts.length = 12;
			opts.radius = 12;
			opts.width  = 3;
			break;
	}

	spinner = new Spinner(opts).spin(obj);

	return spinner;
};
