---
pubDate: 2025-10-12
title: Thoughts on Remix 3
image: /figma/og_remix.png
excerpt: The pendulum is about to swing the other direction
tags:
  - javascript
  - react
---

[Remix](https://remix.run/) is a web framework by ~~React underdogs~~ authors of the most popular React package. Few days ago at [Remix Jam 2025](https://remix.run/jam/2025), Ryan and Michael shared a sneak peak of Remix v3. There's no official blog post or documentation yet. Here's my attempt at explaining what it is about.

Remix v1 was a React framework that managed data loading and server-side rendering. Its biggest achievement was the [marketing website](https://remix.run/). Early Remix was interesting because it was viewed as the first real contender for Next.js's dominant position.

Remix v2 struggled with its messaging and identity. One of the authors [described it](https://x.com/ryanflorence/status/1791479313939976313) as _"Remix v2 is a Vite plugin that makes access to React Router v6 features more convenient through the Route Module API"_. This is definitely not how you beat Vercel's marketing machine. The framework had its users, but definitely not the trajectory to make a dent in Next.js's market share.

Remix v3 is… very different. It represents a broader shift in web development sentiment and could be worth paying attention to. To understand why, let's look at the state of modern React.

## Modern React

**In 2025, React feels complicated.** React Server Components introduced a more sophisticated way to render components on the server and hydrate them on client. The rules of what is allowed are nuanced: server components can be defined as `async` now and pass data to client components (but not all kinds data). Regular server-side functions can now be used on client via magic RPC actions. Developers need to learn [`"use client"`](https://react.dev/reference/rsc/use-client) vs [`"use server"`](https://react.dev/reference/rsc/use-server).

The speed, especially on big apps, started to be a common concern. Frameworks like Svelte introduced a way to sidestep virtual DOM diffing and produce the most efficient direct way of updating elements, while still looking reasonably declarative. So the React team opened access to the React compiler, a project that has been brewing up inside Meta for almost 8 years. It works by auto-memoizing your components and hooks. But not all components, because that could introduce subtle bugs. Now it's about [`"use memo"`](https://react.dev/reference/react-compiler/directives/use-memo) and [`"use no memo"`](https://react.dev/reference/react-compiler/directives/use-no-memo) (aliased as `"use forget"` and `"use no forget"` which doesn't help with the confusion).

The core API surface of React keep growing. React has added async rendering APIs ([`Suspense`](https://react.dev/reference/react/Suspense), [`startTransition`](https://react.dev/reference/react/startTransition), [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue), [`useActionState`](https://react.dev/reference/react/useActionState)) to make web apps more responsive -- now user interactions can be prioritized against less urgent but expensive component tree updates, but require you to reason about "active" and "pending" states. The other new APIs are also seen as complex and niche. Just look at the documentation for [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) (but try to guess what it's doing before you click).

**Nobody forces developer to use these features.** In fact even the oldest `createReactClass` with mixins work just fine with the official `create-react-class` npm package. You can still use that style of React today, you don't have to adopt any of the new modern features.

Except, [you kind of have to](https://react.dev/learn/creating-a-react-app) -- these features are shoved into developers' throats via [Next.js](https://nextjs.org/). React itself gave up attempts at being a framework. It was just too much work to keep up with fast paced JS tooling, and Facebook had their own setup not worth opensourcing.

Next.js itself went though some painful transitions ([pages router](https://nextjs.org/docs/pages) vs [app router](https://nextjs.org/docs/app/getting-started)) and left developers who live on the bleeding edge badly hurt. On top of the API churn, Next.js has a whole another layer of complexity caused by Vercel. Vercel deploys fullstack Next.js apps in its own special way -- some code runs in the browser, some in AWS Lambda (with 3x markup), and some in its proprietary worker runtime ("middleware" must be one of the biggest lies that caused developer-decades of confusion and frustration).

All this stuff is just… too much. In fact, even explaining the problems these features and frameworks are trying to fix took Dan several [conferences](https://overreacted.io/react-for-two-computers/) and [blog posts](https://overreacted.io/the-two-reacts/) to describe. People who get it, get it. RSC, Suspense, React Compiler are really powerful and solve real problems some companies have.

On top of that, LLMs suck at React. When asked to build an app, they all reach for React, but the resulting components are ugly soups of `useEffects` and random hacks to work around subtle bugs.

## Remix v3

So in this state of complexity and frustration, Remix v3 is born. You can watch the [Remix Jam](https://remix.run/jam/2025) recording (look for timestamps in the comments) + scroll through both authors' X accounts to get a sense of it.

On the frontend Remix still uses JSX, but there's no React runtime. It doesn't track state the way React does, but instead gives developers a `this.update()` function to call to tell Remix that something has changed. Instead of explicit state you can use anything, most commonly closure-captured variables:

```typescript
function Counter(this: Remix.Handle) {
  // State is just a closure
  let count = 0;

  return () => (
    <div>
      <div>{count}</div>
      <button
        class="p-2 text-green-500"
        on={dom.click((event, signal) => {
          count++;
          this.update();
        })}
      >
        Inc
      </button>
    </div>
  );
}
```

This makes code more imperative, mechanically simpler. Do this, then do that. Transitions, instead of React's promise of `view = f(state)`.

Events are first class and use web's built-in events mechanism. Instead of `onClick` there's a universal `"on"` prop and a library of standard `dom` events + developers can define their own [`CustomEvents`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

To control async work, Remix relies on [signals](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal). E.g. to cancel a `fetch` when component unmounts the developers can do this:

```
function Cities(this: Remix.Handle) {
  let list = [], isLoading = true;
  fetch("https://api.remix.run/cities.json", {
    signal: this.signal // <-
  })
    .then(response => response.json())
    .then(data => {
      list = data;
      isLoading = false;
      this.update();
    });

  return () => …
}
```

Remix will ship with a component library. React has a wide ecosystem of components that won't work in Remix, so to stay competitive the team is working on high quality built-in components. Things like menus and forms with attention to detail and accessibility support. It also introduces subtle but nice quality-of-life improvements over React: built-in `css` prop, `class` instead of `className`.

On the backend, Remix double-downs on Web Platform. The handlers take web [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and return [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response). It also brings things like [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) and others to the server. This makes the server runtime an implementation detail. Node, Deno, Bun -- all have either native support or adapters for these web APIs, so Remix can run anywhere.

In v3 the framework gave up on file-based routing. Just too much trouble to capture the range of things they want to support in just the file names. Instead it introduces a TypeScript-based way of defining the routes. TypeScript guarantees all routes are implemented and URL parameters are passed to handlers and links are never broken.

```typescript
let routes = route({
  home: "/",
  about: "/about",
  books: {
    index: { method: "GET", pattern: "/" },
    create: { method: "POST", pattern: "/" },
    show: "/books/:slug",
  },
});

// Implementation on server
router.map(routes.books, booksHandlers)

// Reference on clients
<a href={routes.home.href()}>…</a>;
```

The server also comes with built-in sane things like logging and file storage.

[The gap](https://www.youtube.com/watch?v=zqhE-CepH2g) is what happens between the client and the server. Remix v3's approach feels a lot less magical than RSC. There's no custom JSON hydration streams. Instead Remix reinvents iFrames by creating async loading boundaries and uses HTML as wire format, [HTMX](https://htmx.org/)-style. There are also hints of using [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) to bring together HTML and JS.

## Sumamry

Remix keeps leaning into the Web Platform and TypeScript, takes control of wider portion of the full stack, ditches nuanced parts of React for a simple `this.update()`, which makes the code less magical and easier to understand for humans and LLMs. Remix is the [Grug Brain](https://grugbrain.dev/) version of what Next.js should have been.

So what happens next?

You’ll hear a lot of noise and hot takes (including this post). YouTube influencers are already recording videos and generating surprised faces for video thumbnails to try to take advantage of the next hype wave. Grumpy Hacker News will complain about yet another JS framework.

It will seem like you have to learn Remix now and migrate all your projects to it. You don’t. React is still fine (nobody got fired for choosing React) and you can keep using the good parts (seems to be a [common JS thing](https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742)).

Remix v3 is a signal of stronger [frustrations](https://cassidoo.co/post/annoyed-at-react/) in React community and desire for a change. The functional ↔ imperative pendulum is starting to swing the other direction.

![](/figma/og_remix.png)
