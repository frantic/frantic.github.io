---
layout: post
title: Provide Context When Writing Blog Posts
excerpt: One practical tip that will make your technical blog posts more useful.
tags:
  - meta
  - blog
  - writing
---

I enjoy reading technical blog posts, even on the subject that is not directly related to my field of work. However I've noticed that in most cases one particular thing is always missing.

When writing a blog post you have something that your readers don't -- it's the context, the "why" and the "how" you got to the subject.

When looking for the intro many people start with some generic definitions of the subject copied from the Wikipedia. "Neural network is a computer system ..."

But I believe it's the wrong thing to start your post with. By not having the context you have the reader will miss a very important piece of information. What is the problem you are solving? How did you come to the solution described?

I think blog posts without much context can lead to lots of trouble. One particularly nasty type of trouble in our technical community is hype. Say a few people write posts about deploying NodeJS with Docker and how awesome it is. Thousands of people read it and now consider it the canonical way to do it. The complexity of our systems grows and after a couple of months we see tons of fatigue posts. All because they've read about a beautifully presented solution to the problem they don't have!

The missing context makes it extremely difficult to judge if the content is actually relevant to our problem at hand.

To fix this problem try setting the stage with some context. Here's 1-2-3 plan that works for me:

1. What problem are you trying to solve
2. Other solutions you've considered and why they didn't work
3. Your solution

Example:

- Problem: I want to learn how to use containers
- Other solutions: Went through Docker tutorial on their website, but found few gotchas that I want to share
- My solution: ...here goes your blog post about Docker

vs

- Problem: I want to deploy several apps that use different NodeJS versions to a single server
- Other solutions: Tried nvm with some shell scripts, but had to deal with conflicting `libssl` dependencies
- My solution: ...here goes your blog post about Docker

This approach gives the reader more context about your perspective and helps them make their own conclusions. It also lets them contribute much better in the comments. For example, in case #1 they may point you to a better tutorial and in case #2 will show you new `nvm` option you missed that will solve your problem.

I try to follow this structure in my writings as well, e.g. [Copy With Syntax](/copy-with-syntax), [Terminal Notifications](/notify-on-completion).

At some point in the future our blog posts will become irrelevant -- there will be better solutions. Having some context about the problem you were solving and other things you've tried will help future readers judge the relevance of your artwork.
