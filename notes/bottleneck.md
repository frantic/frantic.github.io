---
title: "I'm the Bottleneck"
slug: "bottleneck"
excerpt: "Who knew wielding a great power will be so exhausting?"
date: 2026-11-09
---

I really enjoy programming with AI agents. This is the closest I've ever come to having magical superpowers. Today's AI is already smart, capable, resourceful and agentic enough to bring me joy.

This post is about the flip side of that: for most people I know, this fun turns into a death march. We have these powerful tools, but we feel more exhausted and overworked than ever. We ship more, but enjoy it less.

Why is that? What can we do about it?

## Side Effects

**Context Switching**. Context switching is bad for our brains (a lot of research papers back this up). But there seems to be no way to work with agents without context switching between several different threads. Ultrafast mode does help, but only a little, because the agents still need to compile, test, deploy and monitor their changes which takes time and forces us to switch to something else.

**Addictive Interactions**. The interfaces we have today for interacting with agents are built like social apps: messages, unread indicators, push notifications. These features add a sense of urgency and the thrill of pulling a slot-machine lever.

**Complexity Overload**. For decades we built abstractions upon abstractions to make it easier to fit complex systems in our heads. This helps, but ultimately production systems outgrow our ability to understand them at a glance. Agents seem to navigate messy systems a lot better than we do and make them even more complex.

**Reading Slop**. Models like to write. They write a lot. And sadly, most of that writing is not good. Reading walls of text (while context switching) takes a lot of effort.

**Detecting Bullshit**. LLMs used to hallucinate a lot, and everyone made fun of how full of nonsense their answers were. This problem is a lot more nuanced today. The answers are mostly technically correct, but you still need to continuously question the output.

**Decision Fatigue**. When building systems, we're constantly weighing trade-offs. When implementation was expensive, these decisions were spread apart by long stretches of execution. Now implementation is fast and almost free, and we have to make decisions a lot more frequently.

**Idle Agent Anxiety**. When I step away from my computer and I know no agents are running in the background, I feel an urge to kick off some work. Any work. Just to somehow use the idle time.

**Going Past the Point of Exhaustion**. In the good old days of coding by hand, it was easier to stop. Once your brain was toasted enough, you lost the ability to write code, so you naturally wrapped up and ended your day. With agents it's different: because the bar for kicking off a new prompt is so much lower, we start more work when we're already very tired.

## Outcomes

These side effects lead to cognitive surrender — when we stop trying to understand what's going on in enough detail and yield to the model to make decisions.

This causes a lot of trouble. We end up working on things that don't really matter, or overcomplicate systems in a way that creates more busy work.

Models get bogged down in their own output, and we get stuck in it as well.

## So, what do we do?

It would be great to slow down and reflect on our current experiences and where the trend is leading us. Things will likely only get faster from here. Models will get smarter, and tokens-per-second throughput will get higher. Expectations to ship will also only get larger.

I highly recommend reading Eliyahu M. Goldratt's book [The Goal](https://en.wikipedia.org/wiki/The_Goal_(novel)). It was written in 1984, but it's still very relevant today.

So far, by inertia, we've been optimizing our work output (lines of code or PRs shipped). Instead, the book prompts us to think about goals and bottlenecks (constraints).

Our bottleneck today is our attention. So we need to optimize our systems around our attention, not around agents producing more stuff.

First, I believe we have to take our own recovery a lot more seriously. Even the basics (good sleep, healthy food, physical activity) are negatively affected by our chase of agentic productivity (ironically I'm writing this post instead of going to sleep).

Then we should audit where our attention goes. It's hard because it's not as exciting as kicking off a new agentic task. Tracking attention requires attention, so if you are reading this after an exhausting day of managing agents, it's unlikely to be very successful. We can start with the list above.

Next, we need to design our workflow around our limited attention. For example, I noticed I spend a lot of attention on interruptions and on supervising agents. Interruptions come from my colleagues and from AI threads. Both can benefit from additional tooling, filtering, workflows and expectation setting.

I feel like agent supervision is still required because I don't trust agents to do the right thing. This can be further decomposed into "trust" and "the right thing". Both deserve a lot more digging. Trust is about model capabilities, evidence and closing the feedback loops. The right thing is about missing or implicit context and expectations.

I believe we should build systems to protect our attention in this exciting, exhausting, and constantly changing environment.
