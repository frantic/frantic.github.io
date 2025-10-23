---
pubDate: 2019-12-15
title: "How Not to Use Flux: SET Actions"
image: /assets/flux/flux-one-way.png
excerpt: Actions that are named `SET_*` is anti-pattern. It usually means that the code that should be in the reducer lives inside React component instead. This makes apps harder to reason about, debug and test.
tags:
  - javascript
  - redux
  - flux
---

_TL;DR: Instead of thinking about your actions as something that changes application state, consider them events instead._

In this article by Flux I mean one way data flow pattern implementations like Redux, useReducer or Elm Architecture

Every time I see an action with a name that starts with `SET_*`, I know there's a problem.

Consider this example:

```javascript
function Counter(props) {
  function onClick() {
    props.dispatch({
      type: "SET_VALUE",
      value: props.value + 1,
    });
  }
  return (
    <div>
      <div>Value: {props.value}</div>
      <button onClick={onClick}>+</button>
    </div>
  );
}

function reducer(state, action) {
  if (action.type === "SET_VALUE") {
    return { value: action.value };
  }
}
```

## Problem #1: Business logic inside the component

In this example the bussness logic is incrementing the value, i.e. `value = value + 1`. If we use `SET_*` action, the logic ends up inside the component. It's not great because the React component should not care about these details, its main purpose is rendering and dispatching actions.

As the application and the team grows, it's going to be very tempting to put more stuff into the component. E.g. if we wanted to have a max value for the counter, the most intuitive thing in this example would be to put it into the `onClick` handler.

## Problem #2: Not leaveraging reducer

Reducer is a beautiful pattern that's older than JavaScript itself. Given a state and an action reducer returns a new state. It's easy to type check, easy to test, easy to reason about.

When we put the business logic outside of reducer, we miss out on all these advantages. The `SET_*` actions essentially turn the predictable store into a global variable.

## Problem #3: Hard to debug and test

Imagine our counter component isn't behaving right: after pressing the `+` button the value is not what we expect. Let's check Redux devtools:

```
Old State: {value: 3}
Action:    {type: "SET_VALUE", value: 42}
New State: {value: 42}
```

This is correct, but not helpful. How did we compute `42` as the new value to be set? 🤷‍♂️

Writing tests for `SET_*` actions is also not great. The tests end up very dumb and the aren't really testing anything useful:

```javascript
test("SET_VALUE action", () => {
  store.dispatch({ type: "SET_VALUE", value: 3 });
  expect(store.getState().value).toEqual(3);
});
```

To test the business logic that lives inside React component we'd have to spend a lot of effort setting up mock renderer, simulating click event, etc.

# The Better Way

Let's think about our actions as objects describing user's intent. In the simple `Counter` component example from above, when the user clicks `+` the user wants the app to _increment_ the counter.

```javascript
function Counter(props) {
  function onClick() {
    props.dispatch({ type: "INCREMENT" });
  }
  return (
    <div>
      <div>Value: {props.value}</div>
      <button onClick={onClick}>+</button>
    </div>
  );
}

function reducer(state, action) {
  if (action.type === "INCREMENT") {
    return { value: state.value + 1 };
  }
}
```

Note that the React component in this case doesn't care how this event is handled, it just tells the system about what happened.

The reducer tests in this case are more meaningful, capturing the essense of the business logic:

```javascript
test("INCREMENT action", () => {
  const store = createStore({ value: 2 });
  store.dispatch({ type: "INCREMENT" });
  expect(store.getState().value).toEqual(3);
});
```

## Actions are events

The secret here is in the mindset. Instead of thinking about your actions as something that changes application state, consider them events instead. These events could represent user intent (clicking a button, typing, etc.) or a notification from external system (timers, HTTP response, etc.)

Examples:

- `SET_LOGGED_IN` → `GOT_ACCESS_TOKEN`
- `SET_TODOS_LIST` → `LOADED_TODOS_FROM_SERVER`

---

P.S. The "no `SET_*` actions" rule can be generalized: actions should not be derrived from state. If you need some information from state to construct an action, it's a sign that the action should be simpler and the computation you are trying to perform should probably live in the reducer.
