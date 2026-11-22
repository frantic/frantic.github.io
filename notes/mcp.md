---
title: "I Changed My Opinion On MCP"
slug: "mcp"
date: 2026-11-22
---

I remember how it started. Late 2024, rumors of a hot new standard for exposing services to LLM models. What a stupid idea, I thought. OpenAPI (aka Swagger) is already a standard and it's just fine, why invent a new thing? Just give the model an HTTP client.

But then I started working on the enterprise side of ChatGPT and quickly understood the value of MCP. First, the hype made big companies actually pay attention and rethink how they approach AI. "We have an MCP" temporarily became "we know how to ride this AI wave". Second, very practically, it gave company admins a way to control what their employees using ChatGPT could and could not do. For example, only allow read actions but not write actions for the Gmail connector. MCP had a vocabulary that resonated with these who were in charge of rolling out AI at their companies.

But digging deep into the implementation and integration made me change my mind again. MCP at the time was a Wild West. Everyone had their own approach on how to implement it. Practically, the tool descriptions were too long to fit into context windows and models sucked at tool calling (which forced developers to make descriptions even longer). On top of that, MCP was still a stateful protocol and a pain in the ass to implement reliably for an audience of almost a billion people.

CLIs were becoming hot at the time because they mostly solved the context and composition problem. Models were already trained in a POSIX-like environment so they could easily grep, sort, awk and pipe different commands to duct tape a solution without actually dumping everything into the model's context.

Then, a new development changed my mind again. Code mode. [Pioneered by Cloudflare](https://blog.cloudflare.com/code-mode), the idea eventually made its way into research labs, where post-training taught the model to use JavaScript instead of bash to compose tool and perform complex data transformations. It was more reliable and token efficient. And it was trivial to expose MCP tools to the Code Mode engine, they simply became functions! On top of that models became better at exploring and finding the functions to call.

CLIs started to lose ground. There was no clean way to hide authentication tokens from the model because even if you call the CLI from a [sandbox](https://openai.com/index/inside-the-codex-sandbox/), it still needs to have the token readable somewhere, which means the model can read that token too and do things the CLI didn't expose. Also CLI needed Linux, and running a Linux container for a billion people is really hard.

Meanwhile MCP got much better in these 2 years. It can work over stateless HTTP now, supports events, authentication gateways and many other goodies that are very helpful for running AI at scale. Even the core agentic primitives can now be expressed as MCP servers.

I think MCP is a good example of [worse is better](https://www.dreamsongs.com/WorseIsBetter.html). It started rough, but gained enough momentum to get popular, which brought efforts to improve it to the point where it's actually really good.

It's also humbling to reflect back on my own assessment during its evolution, and how frequently I changed my opinion. It is still hard to predict how fast the models would learn to do things that seem insurmountable.