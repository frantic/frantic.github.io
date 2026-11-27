---
title: "Source Control From Hell"
slug: "git"
date: 2026-11-27
---

My first office job was at an enterprise that built software for a big telecom: a massive Delphi help desk application on Windows.

Let me tell you about how we managed source control process at the time.

First, you download the code from a shared folder (hosted on a trusted Windows server in a locked room). Build your thing, run the app, test it locally. Then you upload your changes to the shared folder and create a new ticket in the internal task tracker (also a Windows app). The ticket should have a list of the changes you've made, in a rich text editor, in a manual format somewhat resembling a patch. But it wasn't a patch; it couldn't simply be applied with a tool. Instead, the tech lead looks at the shared folder and your task and copies the relevant changes to his own integration folder. This usually took him a full day because the shared folder had a lot of changes, not all of them were ready to be integrated. Needless to say, if you simply pull a snapshot of the code from the shared folder, it would most likely fail to compile.

The most common problem was two people overwriting each other's work. So if you wanted to upload your stuff to the shared folder, you had to stand up and announce in a loud voice that you were using the shared folder. No chat apps back in the day.

Imagine starting your career with this development experience! I did my best to improve it. At the time, almost everyone used [FAR Manager](https://en.wikipedia.org/wiki/Far_Manager), so I built a plugin that locked the folder when someone was using it, so others would get a warning. It became very popular because nobody really liked the old yelling system.

Then in 2009 I found git. It was still early days, way before GitHub went mainstream, but my tiny little brain was blown away. Holy shit, it maintains old versions. And you can work locally. And you can sync and exchange deltas. And it was insanely fast (compared to the very aptly named TortoiseSVN I'd experimented with earlier). I must have rewatched [Linus' talk](https://www.youtube.com/watch?v=4XpnKHJAok8) a billion times. I created git repos for every project I had, preached it to my friends, and even gave my first tech talk about git at my university.

Sadly, my diplomatic skills were extremely rudimentary, and I couldn't convince our tech lead to adopt git. He mumbled something about business value and how this new git thing lacked one. I left the company after two years but kept meeting up with old colleagues for beer. They were still using the shared folder process many years later. It was crude, it was hellish, and it worked for them just fine.