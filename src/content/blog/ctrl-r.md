---
pubDate: 2016-06-05
title: My Favorite Shell Shortcut
excerpt: CTRL+R → search history
tags:
  - tips
  - productivity
  - shell
---

If I had to name my favorite most awesome shell shortcut, that would be:

**`Ctrl+R`**

Reverse history search. It's supported by bash, zsh and maybe others. The idea is that you can press `Ctrl+R` and start typing, and the shell will search through every command that you've ever executed that contains given characters, starting from the most recent history record. Press `Ctrl+R` a couple of times while in this mode and the shell will continue the search backwards. Press `Enter` to execute the command as is or any cursor movement keys to edit the command line. `Ctrl+C` will cancel the search and bring you back to normal business.

By itself it doesn't seem like much. However if you think about it, your shell history is a very valuable resourse. For example, do you remember the correct arguments for the `tar` command to compress a folder into tar.gz archive? Me neither. However, if you've done this before at some point, press `Ctrl+R` and type ".gz". Or maybe you forgot the IP address of your Rapsberry Pi? `Ctrl+R`, "ssh " (or even "ssh 192" if you know it's on your local network).

I learned this approach from Jim Meyering, one of the authors and maintainers of GNU Coreutils. In one of his talks he mentioned he rarely writes shell scrips for one-offs. Instead, it's much easier to write the command directly into the terminal and then search for it when nessesary.

`Ctrl+R` is great as it is, however you can make it even more useful by increasing the limit of records your shell keeps in the history file. I have something like this in my shell's rc file:

```
HISTFILESIZE=1000000000
HISTSIZE=1000000
```
