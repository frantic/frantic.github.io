---
pubDate: 2016-05-28
title: Using Redux with Flow
excerpt: How to use Flow to add type annotation to your Redux-powered app.
tags:
  - javascript
  - flow
  - redux
---

Redux is a great library for managing application's state. But JavaScript is still a dynamically typed language, which comes with a lot of surprises at runtime. In this post I'll show you how you can use Flow to embrace static type checking in your Redux-powered application. I choose to use Flow for the disjoint union support and the ability to convert the codebase incrementally. Read on to learn more.

This post assumes that you are already familiar with Redux: actions, action creators, reducers, etc.

## Init

Flow is a static type checker for JavaScript. It works by analyzing your source code, reading (and inferring) type information and making sure there are no conflicts. It's very easy to get started:

```sh
$ npm install --save-dev flow-bin
$ touch .flowconfig
$ ./node_modules/.bin/flow
```

Flow will check only the files that have special `/* @flow */` or `// @flow` comment in them. See [Flow's Getting Starget](http://flowtype.org/docs/getting-started.html) guide for more information.

## Reducers

Likely your store already has an implicit shape and you have a bunch of reducers controlling parts of it. We can use `type` statement to describe what it contains:

```javascript
// @flow
type State = {
  isLoggedIn: boolean,
  name: string,
};
```

Having individual reducers state defined, it's easy to add just a few type annotations to your reducer and start collecting benefits:

```javascript
function user(state: State = initialState, action: Object): State {}
```

Flow will make sure that your `initialState` and the return value of the `user` function always satisfy the `State` type.

As you've noticed, `action`'s type is `Object`. Redux makes no assumptions about the shape and the content on that object, however in most cases your app has a very specific idea what `action` is.

<small>See [adding Flow types for reducers](https://github.com/frantic/redux-flow-example/commit/350ded0f6f3146e8cb1b486f9774a1bc97bc275d) diff.</small>

## Actions

Of course, we can define `Action` type to be as simple as:

```javascript
type Action = { type: string, payload: Object };
```

I.e. any object that has `type` and `payload` properties can be an action. From what I've seen out there, people normally use constants for action types. This approach gives you some protection against typos in action names, however:

1. constants require extra export/import boilerplate
2. they don't help you with the particular action's `payload` -- it's still just a bag of untyped data.

We can do much better. Let's start by defining all possible actions flowing through our app. We will use a union type for this. Even if you've never seen them before, I think it's easy to figure out what it does by looking at example:

```javascript
type Action = { type: "LOGGED_IN", userName: string } | { type: "LOGGED_OUT" };
```

In this case, `{ type: 'LOGGED_IN', userName: 'frantic' }` is a valid `Action`, however

```javascript
{ type: 'LOGGED_IN', login: 'frantic' } // `login` is not `userName`
{ type: 'LOGGED_IN' }                   // no `userName`
{ type: 'TYPO_HERE' }                   // `type` doesn't exist
```

are not.

<small>Note: `type` is not some built-in magical field name for Flow, it can deal with any property name. See [Flow's documentation on Disjoint Unions](http://flowtype.org/docs/disjoint-unions.html) for more information.</small>

Having all possible actions typed like this is great, because it's very clear what can happen inside your app. Take a look at [actions/types.js](https://github.com/fbsamples/f8app/blob/master/js/actions/types.js) from the F8 app for example.

I understand it can be a bit controversial, for example what to do with dynamic actions, or `_LOADING`/`_SUCCESS`/`_FAILURE` "sub-actions". I'll try to share my approach to using Redux in a separate blog post.

The great thing about Flow's support for the tagged unions is that it can narrow down the action type depending on your code control flow:

```javascript
function user(state: State, action: Action): State {
  if (action.type === "LOGGED_IN") {
    // In this `if` branch Flow narrowed down the type
    // and it knows that action has `userName: string` field
    return { isLoggedIn: true, name: action.userName };
  }
}
```

(`switch` statement works just as well)

This is incredibly useful and ensures all payloads can be properly type checked, even if their content is different for each action type.

## Action Creators

This one is easy, we can just declare that our action creators return `Action`:

```javascript
function logOut(): Action {
  return { type: "LOGGED_OUT" };
}
```

To make the example a little more interesting, let's assume we are using a [custom Redux middleware](https://github.com/frantic/redux-flow-example/blob/7674bbb874c914d9ad4a75a0b12528e29230cdb5/store.js#L4) that supports dispatching `Promise`s of actions.

```javascript
async function logIn(login: string, pass: string): Promise<Action> {
  let response = await fetch(...);
  // Check response code, maybe do more fetching...
  return {
    type: 'LOGGED_IN',
    userName: login,
  };
}
```

<small>See [adding Flow types for actions](https://github.com/frantic/redux-flow-example/commit/c351616afc148840f762439c4404a86f65c44a95) diff.</small>

## Dispatch

We can take a step further and annotate our `dispatch` function. In the simplest case it's just a function that accepts `Action` and returns `void` (nothing):

```javascript
type Dispatch = (action: Action) => void;
```

However, depending on the list of the middleware you use, `dispatch` can support thunk actions, promises, arrays, etc. For our example we use `Promise` middleware so we can describe our `dispatch` function like this:

```javascript
type Dispatch = (action: Action | Promise<Action>) => Promise;
```

To use this in React components we can simply tell Flow about `dispatch` prop that `react-redux` module injects via `connect` API:

```javascript
class SettingsScreen extends React.Component {
  props: {
    isLoggedIn: boolean;
    dispatch: Dispatch;
  };

  render() { ... }
}
```

This code ensures that only `Action` or `Promise<Action>` can be passed into `this.props.dispatch()` call.

<small>See [adding Flow types for dispatch](https://github.com/frantic/redux-flow-example/commit/4c72149b4bc6008737c4e0975ff61ab4ff801eca) diff.</small>

## More

Flow is much more than just a type checker. It can power a lot of IDE-like features, for example auto-complete, jump-to-definition, etc. I highly recommend installing Flow plugin for your faviorite editor, this dramatically improves development experience.

## Wrapping up

Flow is great because it lets us incrementally add type annotations to our app. Its support for [disjoint unions](http://flowtype.org/docs/disjoint-unions.html) is perfectly suited for describing various Flux action types.

In the next part we'll explore how we can add types to `connect` function from `react-redux`.

All code is available on Github, take a look at [commit-by-commit history](https://github.com/frantic/redux-flow-example/commits/master) to see how Flow can be adopted incrementally. For a bigger example check out [the open-sourced F8 app](https://github.com/fbsamples/f8app).
