---
layout: post
title: Better way to switch between apps on macOS
image: /assets/macos-app-shortcuts/og-image.png
excerpt: (+ video tutorial!) ⌘-tab sucks when you have more than two apps running. In this blog post I explore how we can make switching between apps more efficient.
---

Does this look familiar? This happens to me all the time…

![](/assets/macos-app-shortcuts/cmd-tab.png)

I'm in the middle of a productive day and I need to run a few commands in my terminal. To do so I need to focus the iTerm app, which is already running.

So I press `⌘-tab` and get this giant list of apps. I need to find iTerm there and press `tab` 4 more times to get to it. The list is sorted by the most recently accessed apps, so every time I switch apps the list changes.

iTerm2 has [this feature](https://www.iterm2.com/documentation-one-page.html#documentation-hotkey.html) where it can be shown or hidden using a system-wide hotkey (like in the good old Quake days). But none of the other apps I use don't support this.

*Wouldn't it be great if each app had a shortcut that would activate it?*

Enter [Alfred](https://www.alfredapp.com/) Workflows. Here's how I set it up (text version below):

<iframe width="600" height="356" src="https://www.youtube.com/embed/dP664Ro8PPk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

1. Open Alfred settings → Workflows tab
2. Add (+) → Blank Workflow
3. Right click on the workflow area → Triggers → Hotkey
4. Record the hotkey. Make sure the "Trigger Behaviour" is set to "Pass through modifier keys" (this removes about 500ms latency). Press Save.
5. Right click on the workflow area → Actions → Launch App / Files
6. Drag & Drop the app you want into the list. Press Save.
7. Connect the trigger and the action.

I choose to use `⌥` (option) key combined with a single letter for my shortcuts. The keyboard has two `⌥` keys, they are easy to reach and I don't use the typography features which the `⌥` key is bound to on macOS.

![](/assets/macos-app-shortcuts/my-app-hotkeys.png)

This new approach definitely has a learning curve. I kept falling back to using `⌘-tab` many times. I couldn't find a way to temporarily disable `⌘-tab`, but I found [a way to hide a few apps](https://apple.stackexchange.com/questions/92004/is-there-a-way-to-hide-certain-apps-from-the-cmdtab-menu) from it.

But the benefit of switching apps this way is huge. When I need a terminal, I just press `⌥\`. It doesn't matter if the corresponding app is already running or not, Alfred will launch it if needed.