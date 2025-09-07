---
layout: post
title: Who's Watching the Watchdog?
image: /figma/og_watchdog.png
excerpt: Making reliable systems that expect things to go wrong
---

At my current company we have an automated pipeline for processing customer's orders. It's pretty complex — talking to multiple different services, training models, storing large files, updating the database, sending emails and push notifications.

Sometimes things get stuck because of a temporary 3rd party outage or a bug in our code.

So we built a watchdog service: it monitors the stream of orders and makes sure the orders get processed within reasonable timeframe (3 hours). The watchdog only looks at the final invariant — was the order fulfilled and delivered to the customer? It doesn't care about any intermediary steps.

This system has saved us many times. When the watchdog finds a stuck order, it posts in our special channel in Slack. We investigate the problem and address the root cause, so hopefully we won't see new orders stuck for the same reason.

But who's watching the watchdog? What if it fails to run?

It actually happened to us once. The watchdog is running on the job scheduling system, and that system went down. That meant no orders were getting processed and watchdog also wasn't running. The alerts channel in Slack was blissfully silent.

To address this case, we need a system that can watch the watchdog. We are using these two:

- [Sentry Cron](https://docs.sentry.io/product/crons/)
- [Checkly Heartbeat](https://www.checklyhq.com/blog/heartbeat-monitoring-with-checkly/)

The idea behind both systems is the same: they expect a regular cron job to "check in" on a pre-defined schedule. If it misses a check-in, there's likely a problem and we get an alert in Slack.

Complex systems always find surprising ways to fail. When adding an end-to-end quality watchdog (and ways to watch the watchdog) you can create a positive loop of detecting issues and hardening the system.
