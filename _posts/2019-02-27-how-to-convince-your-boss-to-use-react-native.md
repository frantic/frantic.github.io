---
layout: post
title: How to convince your boss to use React Native
excerpt: How to adopt React Native incrementally with little risk inside an existing native application and a team full of native engineers.
image: /assets/gunnar-sigurdarson-1368301-unsplash.jpg
---

Likely you landed on this article because you are excited about React Native. Awesome! If you have a team of web engineers and a brand new app, it’s easy to make a case for starting with React Native.

However, most companies already have apps in the stores. They used native stack to build their apps: Xcode or Android Studio. React Native can add value for these companies too, but making a hybrid app comes with some challenges.

During the last 4 years I helped integrate React Native into Facebook and Oculus apps. Here are a few lessons I learned.

<figure>
  <img src="/assets/gunnar-sigurdarson-1368301-unsplash.jpg" />
</figure>

# Start with Empathy

_Wait, start with what?_

Understand the people who work on your project—that's the first step to successful integration.

Your boss (project manager, director, CTO, etc.) is responsible for the app hitting the market with little risk, short timeline and maximum impact. Companies already operate in very competitive environment. To them any new technology is a risk.

Your colleagues have a different perspective as well. They have experience building apps with the “native” technology stack. They know how to format strings, build UIs, access network, write and debug code in the IDE. Switching to a completely different ecosystem is very uncomfortable. There’s natural resistance to getting out of the comfort zone.

<figure>
  <img src="/assets/maximilian-weisbecker-544039-unsplash.jpg" />
  <span class="label">
    Does React Native have layout inflaters? How do I change the text of this button?
  </span>
</figure>

Engineers might have existing opinions about React, React Native and JavaScript ecosystem. Or they’ve seen a React Native app somewhere and found it of bad quality. There are many common myths, e.g. “JS is slow”, or “frameworks come and go too fast”.

These myths are not specific to JavaScript. As humans we can’t experience every single tech stack and have a well-formed opinion. We have to rely on things we’ve heard from others.

This might not sound very encouraging, but **be willing to accept a defeat**. There are so many scenarios where React Native can be very beneficial. But there are also valid situations where it doesn’t make sense at a particular time. And it’s okay. Maybe in a few months you can revisit this decision. The last thing you want is to polarize your team and ruin constructive work relationships.

To fight existing misconceptions, prove them wrong on a real feature inside your app (without making other people feel stupid). Show, don’t tell.

# Be a champion 

_You can't just say "Let's use React Native" and hide in the bushes._

[TC39](https://github.com/tc39), a committee that evolves JavaScript the language, has [the following process](https://tc39.github.io/process-document/). Changes to the language are called "proposals". A member that leads a proposal is called a "champion". Their mission is to create spec drafts, work with the community and push the spec forward.

Become the React Native champion at your company. Take the responsibility to see this idea through.

The first step to becoming a champion is to get more familiar with React Native. Create a few prototypes (by [rebuilding some parts of your app](https://www.youtube.com/watch?v=I8b0v0uFXLs)), learn architecture, be ready to give demos and help people get started.

Engineers who are coming from native will most likely feel uncomfortable and overwhelmed by the new ecosystem. Create an environment where getting started with React Native is super easy:

- Have an internal wiki page with [step-by-step instructions](https://bitbucket.org/frantic/react-bnb) on how to get started. Think of it as a "landing page" of React Native in your organization.
- Build a script that automates environment setup: installs NodeJS and other dependencies, runs yarn install, etc.
- Setup good IDE defaults. You can't ask IntelliJ users to configure and use VIM. Document or commit configs that make it much easier to get started with React Native. For example: editor recommendations, plugins, syntax schemes, keyboard shortcuts, etc.
- Organize a tech talk or a small hackathon where your team can learn about React Native and try it together on a small project.
- Create a place to ask questions, have discussions and hang out. Maybe a `#react_native` channel on Slack, group, email list, etc. Be there to answer questions.

Super important: if there are people who don't want to deal with React Native, **make sure their development experience is not compromised**. They should be able to work the same way as before without having to know or do anything about React Native.

# Find value

This guide assumes you are integrating React Native into an existing application and already have a big chunk of functionality written using platform-dependent code. Rewriting it all is a huge risk with very little benefit to your users and business. That's why it will be extremely hard to convince your team and people responsible for the project to do so.

But you don't have to rewrite your application! **React Native can be adopted incrementally**.

Find an area in your application that will immediately get benefits from being implemented in React Native. For example, it could be a screen that is useful but but doesn't get much development attention or a surface that's implemented as a WebView. For example, Facebook started with Pokes, Instagram rebuilt "liked photos", etc.

It has to be with a scope that you can build yourself within few days. It will be a great campground to test different aspects of integration: build system, session sharing, logging, crash reporting, etc.

Bonus points for making the new feature run on both iOS and Android. Suddenly, something that used to take a lot of engineering time and coordination, was created by one person in a short time frame.

Show, don't tell.

<figure>
  <img src="/assets/hilthart-pedersen-602249-unsplash.jpg" />
</figure>

# Closing thoughts

If you want to convince somebody to use React Native, ship a feature in your app that wouldn't have been possible without it.

I hope this small guide gives you few ideas on how to get started. It's only the beginning.

Lots of big and small companies use React Native in their hybrid apps. Unfortunately, [very](https://medium.com/airbnb-engineering/react-native-at-airbnb-f95aa460be1c) [few](https://eng.uber.com/ubereats-react-native/) of them share the details. I think it's mostly because some aspects of the integration are specific to their infrastructure and it doesn't feel useful to talk about these.

But there are many common things. I hope to follow-up this blog post with "How to scale React Native at your organization".
