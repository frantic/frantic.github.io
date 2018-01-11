---
layout: post
title: Why side projects are hard
image: /assets/side-projects/og-image.png
excerpt: Fun, misery and yak shaving expeditions
---

It’s been one hour already since I typed `git init`. Next step would be to start the X side-project I've been thinking a lot about. I need a frontend and a backend. I’ll start with the later. So what tech should I use?

That’s the question I spent an hour on without making any progress. See, I could use NodeJS, I know it reasonably well. But the project is about handling lots of concurrent connections with shared state between some of them. Making that work could be tricky, and if I mess up something the latency will get pretty bad. Go or Erlang seem like good candidates, they are used for similar systems. However, I haven’t used any of them before.

Maybe I should take this side project opportunity to learn Erlang (or Elixir)? That seems attractive and fun, but will take me 10x as much time to build. I don’t have a lot of free time, so going Elixir route could mean I never ship the project. 

Wait, I don’t even know that the thing I’m building is useful in the first place. Maybe I should build a landing webpage first and see how people react? This will also help me finally formulate what this project is about. Sounds like a reasonable idea, but I suck at copywriting. I should watch a couple of YouTube videos on the topic. 

Damn, it’s been 2 hours now with no progress at all. Who said side projects are fun? This is not fun at all. 

Back to the backend choice. I think I’ll go with NodeJS, it will help me explore the problem space faster, and then I can rewrite it later if need be.

Should I use an existing framework or build everything myself? I don’t want to pull large dependencies I don’t understand and trust. But without them I’d have to handle authentication, emails, all that stuff myself. Which is certainly doable, it’s just not something I’d want to spend the remaining one hour I have today. 

Wait, no. I don’t need accounts, my app will be very minimalistic and lightweight. This could save me time, but is this a proper long term solution? What’s my long term vision for this anyway? How do I build code in a way that will make it easy to change in the future?

Back to code. Where do I store my data? That’s a tough choice. MongoDB is very popular, so I can probably google a solution to any problem  fairly quickly. But I don’t really like its lack of schema, I prefer relational databases for this reason. But since I know the app is going to be focused on real-time, I might as well choose something more aligned with that. Redis sounds cool. I’m wondering how it persists data…

Another half an hour reading on stuff and not making any progress. I don’t think Redis is the way to go, I’ll have to denormalize the data structures, but I don’t have a good idea yet about what data I need.

Ok, screw all that. MongoDB it is. I just want to push it out and send a link to my friends to play with. How do I install MongoDB? Eww, but I don’t want to clutter my Mac with all these things. Gotta use VM. The last time I tried Vagrant it didn’t support efficient file watching and that’s the key for the fast iteration development environment I want.

So I roll with Docker, it’s also supposed to make deployment easier. Actually, how do I deploy with Docker? Let’s read up on that a little bit to be prepared…

```
$ git status
On branch master

Untracked files:
    Dockerfile
    main.js

Total time spent:
  3 hours 25 minutes

Mood:
  fuck my life
```

Am I alone in this? I remember side projects used to be fun in the past, what’s changed?

*To be continued…*