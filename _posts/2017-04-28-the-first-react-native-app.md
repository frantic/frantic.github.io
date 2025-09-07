---
layout: post
title: The Very First React Native App on the AppStore
image: /assets/atscale/og-image.png
excerpt: A little known story about the first React Native app that was published on the AppStore.
tags:
  - react-native
css: |
  video {
    height: 100vh;
    max-width: 100%;
  }
  .screenshot {
    display: inline-block;
    width: 300px;
  }
---

_In September 2014 we published an app to the AppStore. It was the first React Native app ever shipped to production. You probably haven't heard about it._

<img src="/assets/atscale/og-image.png">

It was only the beginning, the React Native team had about 6 people working on it. React Native wasn't even called React Native back then. The first ReactConf wasn't announced, Android support wasn't available. No Animated API, no Flow types support, no ES6 classes.

Not many people believed in React Native's future. [Burned by the web technologies in 2012](https://techcrunch.com/2012/09/11/mark-zuckerberg-our-biggest-mistake-with-mobile-was-betting-too-much-on-html5/) engineers were skeptical that another JavaScript-based solution was going to solve the mobile problem. Only two teams were using React Native, but their release dates were still far out.

At Facebook we often ask

> What Would You Do, If You Weren't Afraid?

For us the answer then was to "ship a React Native app". Around that time Facebook was scheduled to hold a conference for engineers working on very large systems -- [@Scale](https://atscaleconference.com/). We decided to build a conference app for it, but the time frame was very short.

The @Scale app was built during all-night hackathon. It was very reassuring to be able to use the technology you work on and confirm that it really delivered on the promise -- building a native feeling apps in 10% of the time.

As you can see on the screenshots and the video below, we didn't have designers. Fortunately the [Sketch](https://www.sketchapp.com/) app existed and I was able to steal some styles and colors from the official website.

Video demo (notice the easter egg at the end):

<video controls>
  <source src="/assets/atscale/demo.mp4" type="video/mp4">
</video>

A couple of screenshots:

<a href="/assets/atscale/screen01.png">
  <img class="screenshot" src="/assets/atscale/screen01.png" alt="The landing screen of the app, contained general information about the conference – date and venue">
</a>
<a href="/assets/atscale/screen02.png">
  <img class="screenshot" src="/assets/atscale/screen02.png" alt="Schedule screen for one of the tracks. User could swipe left/right to switch between the tracks or tap the corresponding but
ton at the top."></a>
<a href="/assets/atscale/screen03.png">
  <img class="screenshot" src="/assets/atscale/screen03.png" alt="Screen with the details of the selected talk. Contained time, duration, title, description and the list of speakers">
</a>
<a href="/assets/atscale/screen04.png">
  <img class="screenshot" src="/assets/atscale/screen04.png" alt="Flow was announced at this conference!">
</a>

The @Scale app inspired the F8 conference apps to be built with React Native for 2015, 2016 and 2017 years. The 2016 version was [open sourced](https://github.com/fbsamples/f8app) and [documented](http://makeitopen.com/).
