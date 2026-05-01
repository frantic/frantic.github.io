---
title: "Building Symphony"
slug: "symphony"
excerpt: "Behind-the-scenes notes about the agent orchestrator I built at OpenAI"
date: 2026-05-01
---

We just published a [blog post about Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) -- an agent orchestrator I built for my team at OpenAI. Here I wanted to share a few behind-the-scenes bits that didn't make the cut.

Earlier this year I joined a team that had gone all-in on Codex. And it worked! It worked because we designed the software in a way that maximizes the benefits and keeps technical debt under control.

Now we were constrained on human attention. Even the smartest engineers lose track of parallel Codex sessions after working on half a dozen tasks for hours.

Symphony started as a way to make my teammates happier and break the ceiling of the 5 Codex sessions per person.

## Basic Idea

In short, Symphony is an orchestrator -- it takes a [Linear](https://linear.app/) board, and for each open unblocked task it makes sure an agent is running. Think Kubernetes for agents where the task board is the control plane. On top of that it allows us to define success criteria and shift from steering agents to reviewing their "proof of work" packets.

There's a lot more detail on what it is and how it works in the [blog post](https://openai.com/index/open-source-codex-orchestration-symphony/) and the [Github repo](https://github.com/openai/symphony/). Both have a video that explains the idea in 60 seconds (I enjoyed recording that piece very much).

## How I Use Symphony

In practice I use Symphony for all sorts of things.

First, the bug fixes from our backlog, implementing basic features, all the obvious stuff that could be easily delegated. The tricky part was unrelated to Symphony itself -- I had to set up some infrastructure to allow us to record videos from the model's testing process (think playwright but with a few extra hoops). But once that was in place, I felt like I finally got control over my time and ended the doom of context switching.

Second, I had Symphony orchestrate massive migrations, for example from a homegrown framework to tRPC. I started with a ticket to analyze the codebase and make a plan, then after review Symphony created a tree of tasks. Tasks from phase C depended on phase B which depended on phase A. 20+ tasks organized in a tree that naturally unfolds: as it was done with tasks from phase A, the tasks from phase B got unlocked and it started working on that.

Third, I use Symphony for speculative work, things like "What if we rewrite our backend in Rust?". In the past I wouldn't even start this work because it had a cost -- I had to spend my time and context switching on an interactive session. Now I can just file a task and see where it ends up. Sometimes it's throwaway work, but sometimes it yields very useful information.

I often hear this question: "How do you steer Codex?" My answer is: not at the session level! One just has to admit that interactive steering doesn't work in the long run, just like micromanaging doesn't work at scale. You have to shift focus to systems, not individual sessions. If Codex often gets something wrong or doesn't test its work in the way you want, that means some context wasn't encoded in your codebase.

In practice, if a task is defined too loosely and I see Codex go absolutely sideways, I sometimes use an escape hatch: I have a special ticket state named "Rework". I modify the ticket description and send it to Rework, my workflow instructs Codex to start from scratch and avoid taking the old approach.

I wish I could tell more about how other teams use Symphony. Many people surprised and delighted me in the cleverness, some having as many as 12 different ticket states to track work across a much larger [SDLC](https://en.wikipedia.org/wiki/Systems_development_life_cycle), others using Symphony for non-programming work.

But Symphony is definitely not magic and doesn't allows you sidestep good system design. Here's an example of that.

To stress-test Symphony, I made a simple TODO app without any agent-specific setup. I created a ticket called "Manage This Project" with instructions to check on the board every so often and file feature requests in an infinite loop. These tickets got picked up by Symphony and put to work.

The result was a total chaos. Without good engineering setup, parallel agents constantly broke each other's work, got stuck resolving conflicts and struggled to get a working dev environment.

(On the bright side Symphony itself worked just fine under the load, easily chewing through millions of tokens per second, which was the main point of the test.)

This highlights that even the best agent orchestration harness doesn't automagically solve software engineering problems. We have a lot of interesting work to do!

If [Harness Engineering](https://openai.com/index/harness-engineering/) is step one, Symphony is step two. But you can't get to step two without the solid foundations of step one!

## Spec

Symphony is open sourced as a spec. It's not really a novel idea, software design docs and waterfall have been around forever, and since the AI boom many people talked about markdown becoming the next programming language.

But I find open-sourcing a spec a really interesting pragmatic point on [the spectrum of specificity](https://frantic.im/plotting-ideas/). It's definitely more than just the idea, it includes a useful level of detail (e.g. about non-obvious edge cases, or clever design choices that make the system more elegant). But it's also not as rigid as an off-the-shelf implementation. It invites hackers to make it theirs -- implemented in the language and ecosystem they already use with additional features only they care about.

Here are a few of things we've added to the spec that weren't so obvious to us from the beginning:

- Workspaces are decoupled from Git. The initial versions tried to add enough configuration to support worktrees vs full checkouts, but we realized shell script hooks give more flexibility without raising the complexity.
- The split between deterministic configuration and free-form model instructions. I think we landed on a useful and pragmatic split inside `WORKFLOW.md`, but it took a few iterations to get there.
- Giving the model a limited number of turns before we restart the thread. In practice this avoids awkward situations where the existing context gets the model to spin its wheels forever.
- Making sure the agent only works on tasks that are not blocked by other tasks, this unlocks more complex workflows while being easy to grasp.

Compare that to the core idea: "Orchestrator that guarantees a running agent for every open task". Useful, but not really enough to turn this into usable software as-is.

Also compare that to the existing [reference implementation](https://github.com/openai/symphony/tree/main/elixir): it's built in Elixir which might not be your cup of tea.

A note on Elixir: it's awesome. I always wanted to build something on Erlang's runtime and this was a perfect fit. Agent threads map really well into BEAM processes, the state is explicit and it's nice to know that supervision trees will make sure things are chugging along despite bugs and runtime problems. Hot reloading is magical, I could change system behavior without stopping the agents. Also, Codex is really good not only at writing Elixir but also at the interactive REPL -- it's so cool to connect it to your running system and let it inspect the state to figure out problems.

As for building the spec, I started from the reference implementation and tried to extract useful concepts into textual description. I iterated on it multiple times, asking Codex to implement the spec in different programming languages, then evaluating each one and fixing gaps.

The spec is not perfect, and maybe it's not the ultimate AI software form yet, but I like thinking about the wide spectrum of specificity. See also my post about [plotting ideas](https://frantic.im/plotting-ideas/).


## Shoutouts

I'm grateful for to [Ryan](https://x.com/_lopopolo), [Zach](https://x.com/z) and the team for letting me experiment. I also want to thank [Victor Zhu](https://www.linkedin.com/in/victorszhu/) for being the champion of open sourcing and talking publicly about Symphony.
