---
layout: post
title: Copying code with syntax highlighting
tags:
  - tips
  - projects
  - productivity
---

When preparing presentations I often want to include a few code blocks in the slides, with proper syntax highlighting. However, what sounds like a very strightforward task always turns out to be complicated.

You see, none of the code editors I use (Sublime Text, Atom, VSCode) preserve colorful syntax highlighting of the code. Press ⌘C/⌘V and you get only text. There are plugins for these editors that try to help with that, but what happens under the hood is completely different: they rely on [pygments](http://pygments.org/). This solution is not great, as it uses a different tool to actually do highlighting that produces different result.

For a while I've been using different hacks to add code to my slides:

1. Taking a screenshot (pain to change in the future)
2. Coloring the code manually (too much work)
3. Copying the code to Github gist and then copying it from there from Safari (doesn't have the same color scheme / syntax as my editor).

Recently I came up with [a plugin for Atom](https://github.com/frantic/copy-with-syntax). The idea is simple: Atom's text editor is based on web technology, which means I can just fetch the formatting information from the DOM and put it into pasteboard in a format that can be used by other apps on the system.

[This is how it works](https://github.com/frantic/copy-with-syntax/blob/master/lib/copy-with-syntax.js). I look for the DOM element of the text editor and iterate over each text node recursively. I use [getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) API to get the resulting set of styles for each node, then use that information to manually craft an RTF document with corresponding colors and font styles.

One interesting gotcha -- some DOM nodes appear out of order, likely that's because for performance reasons Atom splits the content into several absolutely positioned `div`s.

Is it pretty? Nope. Stable? Nope. Useful? Yes! _A typical hack_. The result can be found here: [frantic/copy-with-syntax](https://github.com/frantic/copy-with-syntax).

I'm sure there is a better way to do this. Both Atom and Sublime have APIs that allow you to get "scope" or "context" for each location in the text that has all information needed to do proper syntax highlighting. Maybe some day I'll have enough curiosity to look into it.

P.S. Over the weekend I was experimenting with WebStorm, and it handles copying syntax-highlighted code correctly. Awesome job, JetBrains!
