/**
 * GitHub API end points
 * 
 * @type {Object}
 */
var api = {
	events : "https://api.github.com/users/{{user}}/events?callback=?",
	me     : "https://api.github.com/users/{{user}}?callback=?",
	orgs   : "https://api.github.com/users/{{user}}/orgs?callback=?",
	repos  : "https://api.github.com/users/{{user}}/repos?callback=?"
};
