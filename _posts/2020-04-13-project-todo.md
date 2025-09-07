---
layout: post
title: TODO File for Personal Projects
image: /assets/project-todo/TODO_file.png
excerpt: "In most of my personal projects I have a file called TODO. I use it like this…"
---

If you know me, you know that I'm not a very organized person. I hate rigid productivity systems. I've tried many things: Trello, Things, Github Issues, Pivotal Tracker, etc. But they all end up in the same state — detached from the real work I'm doing.

Here's what worked for me.

In most of my personal projects I have a file called **TODO**. I use it like this.

When I have an idea about a feature or a bug, I just open the TODO file (Cmd+P → TODO → Enter), go to the end (Cmd+↓) and start typing.

If I'm away from my computer, I'll use [Things](https://culturedcode.com/things/) to capture the ideas and then move the to the TODO file.

My TODO file captures a whole bunch of things related to the project. I don't have to actually do anything about these things at the moment, just capture items in my backlog.

Later on, when I have time to reflect on the progress, I plan a new milestone from the backlog.

A milestone is just a section in the TODO file that looks like this

```
## v1.5 Polished in-game UI

The game screen looks tidy and clean, the player should
be able to figure out what state the game is in and what
should happen next. No new features!
```

A milestone has a title and a short description. The text describes the desired outcome, not how to get there. This that helps me narrow down my focus.

I force myself to have only one milestone active at a time. All random items I want to do go to the Backlog section first.

I add milestones in the reverse order, the newest one is always at the top. This way when I open the file I see the most important thing first. Also I can still use the append workflow to add items to my backlog (which is always at the end).

Inside each milestone I have a bunch of todos, they look like this:

```
[ ] *•• Display user avatars
```

The first pair of square brackets is a "checkbox". I don't remove items when they are done, instead I put "x" into the space between square brackets.

Then goes the estimate of how much effort I think the task will take. The scale is logarithmic: one star for simple straightforward tasks, two for cross-file change or little refactoring, three for a task that will take me a couple of hours. If the task needs four stars, I should break it down.

To make text of the todos align nicely, I prepend a corresponding number of dots or spaces.

Here's what it looks like in one of the projects I work on:

![](/assets/project-todo/TODO_file.png)

## Why does this work for me?

1. There's no context switch. TODO file is much faster to open than any external tool I've used, and all my editor shortcuts just work there the same way they work in my code.
2. Gives me sense of progress. As I mentioned earlier, I don't delete done items, they just get a nice X next to them
3. The history is maintained with the project via the same source control. I can blame the file and see what I did when.
4. When I'm about to commit something, the message is ready (I just copy-paste the TODO line)
5. It's better than inlined // TODO comments because I can organize my file the way I want. Also different editors have different plugins for this, and I don't want to depend on a concrete IDE plugin for this.

## When does it not work?

For one, sometimes I just want to explore and have fun. I don't have a TODO item for that, and I let myself poke and learn new things in unstructured way.

I've also noticed that the milestones don't work for me when I keep adding new items to the milestone I've already started. I'm still trying to get better at this.
