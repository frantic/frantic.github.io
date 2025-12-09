---
layout: post
title: JavaScript Gom Jabbar
image: /figma/og_js_gom_jabbar.png
excerpt: What's inside that package.json? Pain.
tags:
  - fun
---

You have been using JavaScript for 10 years. It's time for your test. You are sitting in front of a computer. The test is simple: you have to open a package.json file and read it. The `package.json` is full of pain. You have to read it all.

You look at `version`, you haven't reached 1.0 yet. Semver causes unpleasant memories, but you've learned to ignore them for so long that you don't even notice the tickling sensation in your skull.

You wish you used a different `name` for your package, but some random internet person has squatted that name 7 years ago and never updated their package since. It's only mildly discomforting. Maybe the test isn't so bad after all?

Both `main` and `browser` fields are present, you sense traces of Isomorphic JavaScript. In a flash, you remember requiring `fs` module from your browser bundle. These memories are very unpleasant. The hacks you had to do to make it work were even more unpleasant.

The `type` is set to `module`. This has something to do with the migration from `requires` to `imports`. Why do we have to care about this, again? The extensive pain you've experienced trying to importing ES5 modules from ESM modules and vice versa overwhelms you again.

You make your way to `scripts`. What a hot, painful mess it is. You can't look at them without your heart rate going to 150. lint, lintall, lintfast, lintdiff. Parallel runs, obscure arguments, double-escaping JSON-formatted arguments. Subcommands calling npm even through you switched to yarn and then pnpm. Thousands of variations, permutations and details make you shiver. Why do these things have to be here? Why do they need to be so complicated?

Some scripts still use `watchman`. Gotta remember to not use symlinks because it doesn't support them (and the issue has been open since 2015). There's also this gulp-based script that nobody has the guts to replace with anything else that's considered more modern. You think that there's actually no modern version of gulp but it feels outdated and you definitely want to get rid of it. The pains spreads from your head into your neck and shoulders.

The pain is barely tolerable when you reach `dependencies`. So, so many of them. There's `left-pad`, the legendary tiny package that broke all internet, collectively causing the amount of pain and drama comparable to the destruction of Alderaan.

Every time you modify dependency list, some of the dependencies print out screens-worth of messages to your console, asking for donations, warning about breaking changes. You gave up trying to understand these. You only hope none of them are malicious enough to steal your secrets or ruin your computer. The threat of potential pain of that magnitute is frighting.

There's also moment.js. You love that library, it has a really pleasant API. But the internet decided it's too "mutable", too fat, it doesn't support treeshaking and now you have to migrate to date-fns. You haven't started yet, but you already feel the painful refactoring in your bones.

Looking at every package in that list causes some amount of trauma recall. But what's even more concerning is that the version of these packages are way behind what's considered "current". You know that you should upgrade them. But you also have tried that before and you know how much suffering it brings. Things will break in so many ways, big and loud ways, small and subtle ways.

The next thing in this damn file is `resolutions`. Yes, you remember this one. It's a suffering you choose to avoid dealing with package upgrades.

You scroll down to `devDependencies`. You can't remember the time when you only needed non-dev dependencies. Why do we have this split? Yes, right, to cause more pain.

`eslint`. Its configuration got so strict that you can't even write code anymore. Any small misstep and you get an angry red underline. Your CI is configured to treat any lint problem as the end of the world. It gives a false sense of security to your junior engineers on the team. You survived several holy wars on which rules to enable. The pain is proportional to the amount of `eslint-ignore`s you have all over your codebase. There's a lot.

You also notice `postcss` hiding there. This package is a mystery to you. You don't use it directly, it's a requirement of a dependency of a dependency. But it's the package that's constantly causing you pain by throwing obscure C++ compilation errors on any new platform you try to `npm install` on. If CSS itself wasn't painful enough.

Oh, dear `jest`. It started as a fast test runner. But now it's big and fat, it depends on some babel packages while the rest of your app is transpiled by a mix of esbuild and swc. Properly configuring it with ESM and TypeScript was a PhD science project.

You stop to count how many tools and parsers work on your codebase: TypeScript, esbuild, swc, babel, eslint, prettier, jest, webpack, rollup, terser. You are not sure if you missed any. You are not sure if you want to know. The level of pain is so high you forget about anything else.

`engines` prominently lists `node`. And while you hate it with the depth of your soul, you are not going to Bun or Deno because you know this will not stop the pain. This will only make the pain worse.

It's the end of the file now. Final closing curly brace. You close the tab and take a breath. Look around. You are still alive, your hands and your brain intact. You survived. For now.
