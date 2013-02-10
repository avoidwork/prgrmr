module.exports = function (grunt) {
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
			banner : "/**\n" + 
			         " * <%= pkg.name %>\n" +
			         " *\n" +
			         " * <%= pkg.description %>\n" +
			         " *\n" +
			         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
			         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
			         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
			         " * @link <%= pkg.homepage %>\n" +
			         " * @version <%= pkg.version %>\n" +
			         " */"
		},
		concat: {
		  dist: {
			src : [
			  "<banner>",
			  "src/intro.js",
			  "src/api.js",
			  "src/init.js",
			  "src/outro.js"
			],
			dest : "assets/prgrmr.js"
		  }
		},
		min : {
			"assets/prgrmr.min.js" : ["<banner>", "assets/prgrmr.js"]
		},
		test : {
		  files : ["test/**/*.js"]
		}
	});

	// Replaces occurrances of {{VERSION}} with the value from package.json
	grunt.registerTask("version", function () {
		var ver = grunt.config("pkg").version,
		    fn  = grunt.config("concat").dist.dest,
		    fp  = grunt.file.read(fn);

		console.log("Setting version to: " + ver);
		grunt.file.write(fn, fp.replace(/\{\{VERSION\}\}/g, ver));
	});

	// Concatting, setting version & testing
	grunt.registerTask("default", "concat version min test");
};