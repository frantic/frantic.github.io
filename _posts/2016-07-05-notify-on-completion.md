---
layout: post
title: Show OSX Notification When Long-Running Command Finishes and Your Terminal Is Not in Focus
excerpt: Fighting lack of attention span with some advanced tooling hacks
tags:
  - tips
  - productivity
  - shell
---

Sometimes I run commands that take a while to finish: `git pull`, `npm install`, etc. My attention span is pretty short, so I easily get distracted and forget about it. 15 minutes later (after reading Hacker News/Twitter/etc.) I come back to my terminal and discover that I forgot to `cd` into the correct folder. So I fix the problem, run the slow command again, get distracted and there my next 15 minutes go.

Sure, there must be a better way?

**Solution #1**. Make all tools fast and get more patient. Maybe that'd work in a parallel universe.

**Solution #2**. Write a short script that uses `terminal-notifier`, then append `; notify-me` to long running commands. From Googling around this appears to be the most common solution. However this approach has several problems:

1. You have to manually append the command -- it's easy to forget
2. You never know if the command is going to take a long time (hello `git pull` on slow network after weeks of not working on a project)
3. The notification fires even when your terminal is in focus and that's annoying because I can already see the command has finished.

**Solution #3**. Use [iTerm2 triggers](https://www.iterm2.com/documentation-triggers.html) to send OSX notification when it finds a match of a substring from your shell's `PS1`. Closer, but still suffers from unwanted notifications.

**Solution #4, the winner**. Build a script that can figure out if your terminal is in the foreground:

```osascript
#!/usr/bin/env osascript

on run argv
  tell application "System Events"
    set frontApp to name of first application process whose frontmost is true
    if frontApp is not "iTerm2" then
      set notifTitle to item 1 of argv
      set notifBody to "succeded"
      set errorCode to item 2 of argv
      if errorCode is not "0"
        set notifBody to "failed with error code " & errorCode
      end if
      display notification notifBody with title notifTitle
    end if
  end tell
end run

```

Then in my `.zshrc`:

```sh
function f_notifyme {
  LAST_EXIT_CODE=$?
  CMD=$(fc -ln -1)
  # No point in waiting for the command to complete
  notifyme "$CMD" "$LAST_EXIT_CODE" &
}

export PS1='$(f_notifyme)'$PS1
```

Now every time a command in my terminal finishes after I switched over to a different app, I'll get a nice notification:

![](/assets/notif.png)
