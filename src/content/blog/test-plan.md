---
pubDate: 2016-09-11
title: Test Plan
excerpt: On why test plan is useful when making changes to large codebases.
tags:
  - programming
---

At Facebook we use Phabricator to review and discuss each change to the codebase. I believe it has a lot of advantages compared to Github's pull request model. In this post I want to discuss a particular one -- the mandatory "test plan" field.

Initially I was very confused by it and used to spend either too much or too little time composing the test plan. With time I learned to appreciate it and found a couple of strategies that made it extremely useful.

[Phabricator](https://www.phacility.com/phabricator/)'s Differential product operates in terms of revisions. Revision is a meaningful change to the codebase that introduces a feature or fixes a bug. See [D16507](https://secure.phabricator.com/D16507) for example. Each revision has a bunch of information associated with it. Test plan is just another field on the revision where the author is supposed to write some text describing how the feature he wrote can be tested.

Reasonable question to ask is why not simply use unit tests for that? Shouldn't we all have 100% test coverage? Unfortunately we don't live in the perfect world.

First of all, writing test plan helps you notice edge cases and think about your feature from the external user's perspective. It also helps the reviewer find possible flaws in the code before actually looking into the changed lines.

When writing test plans I usually follow this guide:

1. Look at the feature you added and define possible scenarios. Example: "User has not configured the feature", "User has configured the feature properly".
2. Think about how many variations each scenario allows. In the first example case there is just one way to not configure the new feature, likely it's going to be the case for most people. Make sure it doesn't break. In the second example the config can be good or bad. Good opportunity to double-check your error messages.
3. Write down these scenarios and expected outcome, and then perform them. It's easy to get cough in assumptions. "What could go wrong, it's just a one-line change?". I can't overestimate how many bugs I've found in my code just by thinking about the test plan. I've found even more by executing though my own test plan.

If somebody else or the future you wants to modify this code, they can look at the test plan in the commit message and perform the steps without having much context about the feature and how it works.

It might seem that test plans are only useful in large codebases, but there are lots of benefits even in single-person projects. I noticed that the habit of writing test plans changes the way I think about atomic changes in the codebase. Commit is not "complete" unless I thought of the ways to test it.
