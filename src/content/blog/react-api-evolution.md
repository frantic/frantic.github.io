---
pubDate: 2021-03-11
title: React API Evolution
image: /assets/react-api-evolution/og-image.png
excerpt: "From React.createClass to hooks: why React is at odds with JavaScript"
tags:
  - javascript
  - react
---

React is ~8 years old. I remember the day when I saw the first demo — I was amazed at how genius yet how simple it was! I still carry that excitement to this day.

During this time React changed a bunch, but its core ideas have stayed the same. It's still all about thinking about your UI code as a function of state, bringing state front and center, immutable data, one-directional data flows, composition over inheritance.

In this post I'll share how the developer APIs have evolved, specifically we'll talk about defining components and sharing common code between components.

<iframe style="max-width: 100%" width="560" height="315" src="https://www.youtube-nocookie.com/embed/QEGbuc-sKtE?rel=0" frameborder="0" allowfullscreen></iframe>

## 2013, [React v0.3.0](https://web.archive.org/web/20130607112820/http://facebook.github.io/react/): `React.createClass`

```js
/** @jsx React.DOM */
var Timer = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
  },
  getInitialState: function () {
    return { seconds: 0 };
  },
  tick: React.autoBind(function () {
    this.setState({ seconds: this.state.seconds + 1 });
  }),
  componentDidMount: function () {
    setInterval(this.tick, 1000);
  },
  render: function () {
    return (
      <div>
        Hello, {this.props.name}! It's been {this.state.seconds} seconds
      </div>
    );
  },
});

React.renderComponent(<Timer name="Alex" />, document.getElementById("main"));
```

Initeresting things to note here:

1. `/** @jsx React.DOM */` was required for the JSXTransformer to convert XML-in-JS syntax (like `<div>Hello</div>`) to function calls (like `React.DOM.div({}, 'Hello')`)
2. `React.createClass` was used to create a component. I think in hindsight naming it `Class` and not `Component` was a big marketing mistake: with ES6 classes many people were pushing for React to adopt the "standard" way, although it had a lot of problems (more on that later).
3. In development, React performed `props` validation at runtime (Flow and TypeScript didn't exist back then), and the `PropTypes` API allowed for pretty complex definitions with nested objects and arrays.
4. Initially, without `React.autoBind` the methods on the components had dynamically scoped `this`, which was pretty confusing: calling `this.tick` would result in something like "Can't call `setState` of unndefined". `autoBind` was doing something like `fn.bind(this)` to fix it on per-function basis, and eventually this behavior was moved directly into `React.createClass`.
5. React focused on a pure, functional, declarative approach to bulding UIs, but also had escape hatches that allowed programmers take imperative actions or talk to DOM when needed via lifecycle methods and refs.

If you look carefully at the example above, you'll notice that there's a memory leak! We `setInterval` without `clearInterval`-ing it. To fix the problem we'd have to call `clearInterval` from `componentWillUnmount`, however that wasn't obvious from the APIs and programmers had to watch out for patterns like this.

That was a common pitfall: managing resources and making sure parts that were not managed by React were in sync with the UI.

It was clear there's a need for a way for the components to share behavior traits. Early versions of React shipped with a solution to this problem: mixins.

### Mixins

```js
/** @jsx React.DOM */

var SetIntervalMixin = {
  componentWillMount: function () {
    this.intervals = [];
  },
  setInterval: function (callback, interval) {
    this.intervals.push(setInterval(callback, interval));
  },
  componentWillUnmount: function () {
    this.intervals.map(clearInterval);
  },
};

var TickTock = React.createClass({
  mixins: [SetIntervalMixin],

  getInitialState: function () {
    return { seconds: 0 };
  },
  componentDidMount: function () {
    this.setInterval(this.tick, 1000);
  },
  tick: function () {
    this.setState({ seconds: this.state.seconds + 1 });
  },
  render: function () {
    return <p>It's been {this.state.seconds} seconds</p>;
  },
});
```

The code above fixes the memory leak and makes it easier to avoid this problem in the future: just include `SetIntervalMixin` and you are good to go!

Mixins fixed some problems, but intruduced others: implicit dependencies, name clashes and snowballing complexities. [Read more on the official blog post (2016)](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html).

## 2015, [React v0.13](https://reactjs.org/blog/2015/01/27/react-v0.13.0-beta-1.html): `class extends React.Component`

The big feature of this release was ES6 class support:

> JavaScript originally didn’t have a built-in class system. Every popular framework built their own, and so did we. This means that you have a learn slightly different semantics for each framework.

> We figured that we’re not in the business of designing a class system. We just want to use whatever is the idiomatic JavaScript way of creating classes.

```js
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {seconds: 0};
  }
  tick() {
    this.setState({seconds: this.state.seconds + 1});
  }
  componentDidMount() {
    setInterval(this.tick.bind(this), 1000);
  }
  render() {
    return (
      <div>
        Hello, {this.props.name}! It's been {this.state.seconds} seconds
      </div>
    );
  }
});

Counter.propTypes = {
  name: React.PropTypes.string.isRequired,
};
```

However, in my opinion ES6 classes didn't fix the problem, but made it worse.

First, the benefits weren't super valuable. React shipped `Component` and `PureComponent` to inherit from, inheriting other components was discouraged (in favor of [composition](https://reactjs.org/docs/composition-vs-inheritance.html)).

Second, the semantics resulted in a bunch of ergonomics problems.

In the example above, if you forgot to do `this.tick.bind(this)`, you'll get the same "Can't call `setState` of unndefined" as in pre-`autoBind` days. There were several popular ways to address this, none of them seemed ideal though:

- Do it inline: easy to forget, `bind` returns a new function instance for every call (which hurts if you rely on `shouldComponentUpdate`):

```js
<button onClick={this.increment.bind(this)} />
```

- Do it in the constructor: verbose, easy to miss:

```js
constructor(props) {
  // ...
  this.tick = this.tick.bind(this);
}
```

- Arrow functions + E7 property initializers: its syntax is inconsistent with method definitions in subtle ways (also note `;` at the end of `tick`):

```js
class Timer extends React.Component {
  tick = () => {
    // ...
  };

  componentDidMount() {
    setInterval(this.tick, 1000);
  }
}
```

### Higher-order components

As mixing were goin away, the developers needed to fill the gap: find a way to reuse common functionality across components.

HoC became a popular replacement for mixins. You can think of the pattern as writing a function that takes a component as its argument, and returns a new component that wraps it with some useful enhancement.

Here's an example of HoC that does the same thing as the `SetIntervalMixin` from the earlier example:

```js
function withTimer(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.intervals = [];
    }
    setInterval = (callback, interval) => {
      this.intervals.push(setInterval(callback, interval));
    };
    componentWillUnmount() {
      this.intervals.map(clearInterval);
    }
    render() {
      // Render the original component with some additional props
      return <Component {...this.props} setInterval={this.setInterval} />
    }
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {seconds: 0};
  }
  tick() {
    this.setState({seconds: this.state.seconds + 1});
  }
  componentDidMount() {
    this.props.setInterval(this.tick.bind(this));
  }
  render() {
    return (
      <div>
        Hello, {this.props.name}! It's been {this.state.seconds} seconds
      </div>
    );
  }
});
```

HoC promise is to use functional composition to solve the trait problem. But they do come with their own drawbacks too, especially around the ergonomics:

1. Creating and using them is verbose, it's not uncommon to end up with wrappers on top of wrappers, e.g. `withTranslations(withTimer(connect()(Timer)))`.
2. This indirection breaks `refs` and makes writing pure components harder, unless implemented carefully.
3. Devtools show very deep wrapped component hierarchies that hurt readability:

![](/assets/react-api-evolution/deep-hocs.png)

### Render props

React community kept looking for better ways to reuse logic in components and for some time a pattern called "render props" gained a bunch of popularity. I'm not going to dive into these dark ages, but the idea was similar to HoC.

## 2019, [React v16.8](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html): Hooks

Around the time the release with ES6 was published, the React team made it possible to define components as simple functions, aka "stateless functional components":

```js
function Timer(props) {
  return <div>Hello, {props.name}!</div>;
}

ReactDOM.render(<Timer name="Alex" />, document.getElementById("main"));
```

This was very popular: simple, concise, idiomatic. However, how do you get access to state or lifecycle methods?

After a bunch of prototyping and explorations, the React team presented the way -- hooks.

```js
function Timer(props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      Hello, {props.name}! It's been {seconds} seconds
    </div>
  );
}
```

Programmers familiar with algebraic effects saw the striking similarities.

Notably, the mental model of hooks shifted from "lifecycle methods" to "sync things outside React's control with UI".

For example, `useEffect` is built in a way that makes it easy to colocate resource acquisition and release, making memory leaks much easier to avoid. The second argument to `useEffect` is a list of dependencies, if any of them change between calls to the same `useEffect`, React will clean up the previous one and will recreate a new one. Getting this right with `componentDidMount` / `componentWillReceiveProps` / `componentWillUnmount` was hard.

Hooks have solved the problem of sharing common functionality across components in a very elegant, composable ways:

```js
function useInterval(callback, ms) {
  useEffect(() => {
    const interval = setInterval(callback, ms);
    return () => {
      clearInterval(interval);
    };
  }, [callback, ms]);
}

function Timer(props) {
  const [seconds, setSeconds] = useState(0);
  useInterval(() => setSeconds((s) => s + 1), 1000);

  return (
    <div>
      Hello, {props.name}! It's been {seconds} seconds
    </div>
  );
}
```

But hooks were not without problems either: in the example above there's a subtle problem with the callback we pass to `useInterval`: since it's a new referance every time (in JS, `() => {}` !== `() => {}`) we end up re-creating interval every render. The solution looks like this:

```js
function Timer(props) {
  const [seconds, setSeconds] = useState(0);
  const increment = useCallback(() => setSeconds((s) => s + 1), []);
  useInterval(increment, 1000);

  // ...
}
```

Compared to `React.Component` and mixins, React Hooks traded `this` and related class gotchas for JS scope gotchas. I think it was a good trade to make.

# Conclusions

1. React did an awesome job keeping the API surface very small. Watching the documentation across all these years felt like the team is actively _removing_ things that are non-essential.
2. React evolved in a steady, backwards-compatible way. You can still use `React.createClass` APIs via a package, if you want to. Facebook code written in 2013 still works fine (after applying minor codemods).
3. React is at odds with JavaScript: from JSX syntax, ES6 class method bindings gotchas to reinvention of algebraic effects.
