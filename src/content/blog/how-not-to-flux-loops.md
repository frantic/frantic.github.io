---
pubDate: 2018-08-27
title: "How Not to Use Flux: Mini Cycles"
image: /assets/flux/flux-one-way.png
tags:
  - javascript
  - redux
  - flux
---

This his how the data flows in a typical Flux architecture: React components subscribe to updates in the store. When something happens, the components dispatch actions, the store updates its state in response and notifies React components, which re-render with the new data. Redux and all other Flux implementations work this way.

Actions generally don't return anything, because all the updates are supposed to come from the store. All arrows point in the same direction. Nice and clean.

![](/assets/flux/flux-one-way.png)

However, I've seen (and built myself) applications that use some middleware that turns actions into more sophisticated objects, e.g. `redux-thunk` and `redux-promise`. The middleware makes it possible to write actions like this:

```
async function signIn(credentials) {
  const result = await fetch('/api/login', {params: credentials});
  if (result.success) {
    return result.userId;
  } else {
    throw new Error(result.error.message);
  }
}
```

and then in React component

```
_handleClickLogin = () => {
  this.props.dispatch(signIn(this.state.credentials))
    .then(result => this.props.openDashboard(result.userId))
    .catch(error => this.setState({error}));
};
```

There are three things that are wrong about this example. I'm going to focus on one of them in this post.

Notice how our data flow has changed. Not only we now get data from the store, we also pull it from the action as well:

![](/assets/flux/flux-loop.png)

That callback arrow will cause a lot of trouble: spaghetti code, inconsistent state, memory leaks and strange behaviors of the app that will be hard to debug.

Can we avoid this?

## Solution 1. Never cross the streams

In our example: handle everything in the action, [epic](https://github.com/redux-observable/redux-observable) or [saga](https://github.com/redux-saga/redux-saga), not in the React component. This might mean putting `error` into the store and handling `openDashboard` in another action.

You know that you succeeded with this solution when the code from React component looks like this:

```
_handleClickLogin = () => {
  this.props.dispatch(signIn(this.state.credentials));
};
```

## Solution 2. Pretend you are not crossing the streams

Personally, I'm not a big fan of Solution 1 because I hate putting everything into the global store.

So I cheat: I make my React code look _as if_ I'm properly using Flux: dispatching actions and get data via props.

![](/assets/flux/flux-hoc.png)

I've built a [higher order component](https://reactjs.org/docs/higher-order-components.html) that handles all async stuff properly and passes `loading` and `error` state of the async action back as props. The action is invoked the same way as in Solution 1, however now in my component's `render` I get access to `loading` and `error` props that I can use to conditionally render the UI.

```
render() {
  if (this.props.loading) {
    return <Spinner />;
  }
  if (this.props.error) {
    return <ErrorView error={this.props.error} />;
  }
  return <SignupForm ... />;
}
```
