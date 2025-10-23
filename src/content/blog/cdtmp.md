---
pubDate: 2017-03-21
title: cdtmp
excerpt: Create a temp directory and cd into it, and how it changed the way I try new things
tags:
  - tips
  - productivity
  - shell
---

I have this line in my `.zshrc`:

```sh
alias cdtmp='cd `mktemp -d /tmp/frantic-XXXXXX`'
```

It's a super simple alias that creates a temporary directory and then jumps into it. Here are a few examples of what I use it for:

1. Clone a random interesting git repo to experiment with
2. Fiddle with [Flow](https://flowtype.org/): `cdtmp && flow init` and I have a working environment to narrow down a bug
3. Play with unfamiliar node modules: `cdtmp && yarn add xyz && node`

I think `cdtmp` is partially a mental trick I use to reduce the barrier for trying new things and experimenting. I no longer need to make a name for my project or decide which folder to create it in. I also don't have to deal with it later if I consider it not worth paying attention to anymore – the OS will clean it up at some point automatically.
