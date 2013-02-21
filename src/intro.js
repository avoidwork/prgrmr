(function (global) {
"use strict";

var $,
    dColors = ["#FF0000", "#FF7400", "#009999", "#00CC00", "#FFF141", "#A1F73F", "#FFBB00", "#A7A500", "#7B005D", "#450070", "#5F15F6", "#EA0043", "#2AF000", "#41D988", "#3FA9CD", "#046889", "#F09C45", "#7BB000"],
    eColors = ["CommitCommentEvent", "CreateEvent", "DeleteEvent", "DownloadEvent", "FollowEvent", "ForkEvent", "ForkApplyEvent", "GistEvent", "GollumEvent", "IssueCommentEvent", "IssuesEvent", "MemberEvent", "PublicEvent", "PullRequestEvent", "PullRequestReviewCommentEvent", "PushEvent", "TeamAddEvent", "WatchEvent"],
    prgrmr  = {config: {}, events: {}, orgs: {}, repos: {}, me: {}, templates: {}, version: "{{VERSION}}"};
