---
pubDate: 2021-02-23
title: "A Side Project Story: Octave Cloud"
image: /assets/octave.im/og-image.png
excerpt: A story about my attempt at SaaS
tags:
  - projects
---

It all started around 2013: I was going through a course on [Machine Learning by Andrew Ng](https://www.coursera.org/learn/machine-learning).

The practical part of the course depended on GNU Octave (open source math toolkit), but installing it on a Mac was a huge pain. I did manage to do it, but noticed that many people on forums complanied about the same thing.

So I had a brilliant idea — wouldn't it be great if Octave was available via SaaS model? With fancy features like built in code editor, command line and plots?

# Node, React & Docker

I built the first prototype in one night on June 8, 2013. I used NodeJS 0.10-ish with socket.io on the server side and CodeMirror with some plugins on the frontend.

In October that year I rewrote the frontend in React — the experience of doing so was amazing! React was young (`createClass`/`autobind`/`mixins`) but its programming model "clicked" with me. I remember hanging out in their IRC channel looking for help with autoscrolling. I was really impressed at how quick and friendly the response was (thanks [@sophiebits](https://twitter.com/sophiebits)!).

The initial version of the backend would just run `octave` in a dedicated folder. My second iteration ued Docker, which at the time was very new and unproven. It all ran on a Digital Ocean 2GB RAM droplet.

The killer feature was displaying plots inline in a REPL. You can see it on this gif:

![](/assets/octave.im/octave-demo.gif)

It worked through a clever hack: I pre-configured Octave to use gnuplot with special arguments that made it save the graph to a file (instead of showing it on the screen). My NodeJS backend listened to filesystem changes and notified the frontend when it detected the update.

# Product market fit

I tried to promote octave.im for the students of the ML course. I posted the link on forums couple of times and added it to the course wiki page (that was surprisingly very hidden). The reception among students has been really positive, but the course moderators weren't happy: they wanted some kind of validation that it's a serious thing (which it wasn't).

Overall I had more than 3500 people sign up over the course of several years. Unfortunately I didn't keep any metrics screenshots. The twitter account, [@OctaveCloud](https://twitter.com/OctaveCloud), got 57 followers (organically).

Speaking of which, I used Mixpanel and loved its simple API and dashboards. They even sent me a free T-shirt :)

# Total profit: -$420

As every other hacker out there I also hoped to make it sustainable, so in October 2015 I added $4 monthly subscription with 2 weeks trial. To be honest I wasn't very serious about it at that point. I just wanted to play with Stripe, see if people would actually pay. And they did! Overall I have collected about $300 in revenue.

An interesting thing that I noticed was that people subscribe and then stop using the product, without unsubscribing (I did have the unsubscribe button on the profile, no questions asked). I ended up manually cancelling a bunch of subscriptions on Stripe without updating the app DB, so people could still use the service (which they didn't anyways).

# In numbers

- 308 commits
- 3,500 accounts created
- 450,000 commands executed
- $300 total revenue
- $720 spent on hosting

Screenshot, for posterity:

![](/assets/octave.im/screenshot.png)
