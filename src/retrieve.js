/**
 * Consuming APIs and then executing presentation layer logic
 * 
 * @param  {String}   arg      API to retrieve
 * @param  {Object}   loading  Spinner instance
 * @param  {Function} callback [Optional] Callback function to execute after retrieving a template
 * @return {Object}            Promise
 */
var retrieve = function (arg, loading, callback) {
	var deferred = $.promise(),
	    contact, header, title;

	prgrmr[arg].data.setUri(api[arg]).then(function (args) {
		var rec;

		if (args.length === 1 && args[0].data.message !== undefined) {
			if (loading !== null) {
				loading.el.destroy();
				loading = null;
			}
			return error(args[0].data.message);
		}

		if (arg === "me") {
			rec     = args[0];
			contact = $("#contact");
			header  = $("header > h1")[0];
			title   = $("title")[0];

			if (prgrmr.config.name) {
				header.html(rec.data.name);
				title.html(rec.data.name);
			}

			contact.create("li").create("a", {"class": "github", href: "https://github.com/" + prgrmr.config.github, title: "GitHub"}).create("span", {"class": "icon icon-github"});
			if (prgrmr.config.email && !rec.data.email.isEmpty()) contact.create("li").create("a", {"class": "email", href: "mailto:" + rec.data.email, title: "Email"}).create("span", {"class": "icon icon-envelope-alt"});
			if (!prgrmr.config.twitter.isEmpty()) contact.create("li").create("a", {"class": "twitter", href: "http://twitter.com/" + prgrmr.config.twitter, title: "Twitter"}).create("span", {"class": "icon icon-twitter"});
			if (!prgrmr.config.linkedin.isEmpty()) contact.create("li").create("a", {"class": "linkedin", href: prgrmr.config.linkedin, title: "LinkedIn"}).create("span", {"class": "icon icon-linkedin"});
			if (prgrmr.config.blog && !rec.data.blog.isEmpty()) contact.create("li").create("a", {"class": "blog", href: rec.data.blog, title: "Blog"}).create("span", {"class": "icon icon-rss"});

			contact.parentNode.removeClass("hidden");
		}
		else {
			("templates/" + arg + ".html").get(function (tpl) {
				prgrmr.templates[arg] = tpl;
				
				if (loading !== null) {
					loading.el.destroy();
					loading = null;
				}

				render(arg);
				
				if (typeof callback === "function") callback(args);
				
				deferred.resolve(true);
			}, function (e) {
				deferred.reject(e);
				error(e);
			});
		}
	}, function (e) {
		if (loading !== null) {
			loading.el.destroy();
			loading = null;
		}
		deferred.reject(e);
		error(e);
	});

	return deferred;
};
