---
layout: post
title: Reconsidering the way I explain programming
image: /assets/explain-programming/recursion-2.png
excerpt: "Successful communication is so much about understanding the context and the people on the receiving end"
---

"Do you know a recipe for a recursive salad?" - I asked. "It consists of tomatoes, olives and a recursive salad".

My joke falls flat. Michael's eyes confused and waiting for the explanation. I regroup and try a different strategy - sketching:

![](/assets/explain-programming/recursion-1.png)

<small>One of my failed attempts at explaining recursion</small>

—

I've explained a lot of programming concepts to different people. From high school students who are just getting started, to experienced engineers who are quickly diving into a new programming language.

I used to take a lot of pride in the clever explanations I used to come up with. "Your UI is just a function of state", "the closure hugs your variables in scope", "Prolog function arguments can be in or out". I also loved the visuals, formatting code and showing clever animations.

But many times the people on the receiving end would not be as excited. I thought my delivery was poor.

Now after so many years, it finally hit me.

Programming is complex and abstract. Like advanced math, it's removed from everyday things we deal with normally. What I was describing was only _my_ mental model. Words, pictures and a lot of hand-waving is the way I internalized these abstract concepts.

Unfortunately, understanding them is not enough to explain them.

Andy Matuschak recently had a [beautiful piece](https://andymatuschak.org/books/) on the status quo format of lectures:

> “the lecturer says words describing an idea; the class hears the words and maybe scribbles in a notebook; then the class understands the idea.” In learning sciences, we call this model “transmissionism.” It’s the notion that knowledge can be directly transmitted from teacher to student, like transcribing text from one page onto another. If only! The idea is so thoroughly discredited that “transmissionism” is only used pejoratively, in reference to naive historical teaching practices. Or as an ad-hominem in juicy academic spats.

All my "perfect" models were beautiful only in my head. They did strike a chord with others, sometimes, but it was sheer luck - their intuition was in tune with mine for that particular problem.

# So what do I do differently now?

## Listen very carefully

First, I try to listen very carefully to their question. If they are not talking much I'll ask questions and keep listening. I'll keep notes on how they explain themselves:

1. What names do they use to refer to abstract concepts? I'll try to use the same.
2. What kind of [modality](https://www.nlpworld.co.uk/nlp-glossary/m/modalities/) do they operate in? Do they "see" things or "listen" to them?
3. How deep do they need to go? Just fix something and move on, or trying to understand it on a more fundamental level?

## Operate within their mental model

Second, I resist the urge to explain it exactly how I understand it. I try to accept their mental model of the world, even if I believe it's not super accurate. As long as it's not hurting their understanding, I'm willing to skip over non-essential bits.

I also adopt their language and use the same names in my examples.

## Let them explore

If the environment allows for it, I'll encourage them to use the debugger, logs or experiment with the code. For this to work, sometimes I need to reduce the problem space to a much smaller one.

They key is to let them poke the real world (in this case, the way the compiler or the programming language runtime works) and tune their own model. The goal is to help them develop their own intuition, instead of conveying my own.

This can be generalized: successful communication is so much about understanding the context and the people on the receiving end.

—

Back to Michael. I showed him the IntelliJ debugger and asked to trace a very simple recursive program he wrote.

"So it's like the staircase!", he exclaimed. "Every time we go in is like taking a step, and then we return all the way down". Well, I guess _it is_ kind of like staircase... I never thought about recursion this way myself. Now I think I can explain tail call optimization via an escalator analogy.

![](/assets/explain-programming/recursion-2.png)
<small>This is not the model I had in my mind, but I'll definitely use it in the future</small>
