---
layout: post
title: Understanding "Taming the Meta Language"
image: /assets/meta-language/og-image.png
excerpt: I think I *finally* understood it
---

I think I finally understood [Cheng Lou](https://twitter.com/_chenglou)'s talk at the ReactConf '17. If you have 20 minutes to spare, watch this first:

<iframe style="max-width: 100%" width="560" height="315" src="https://www.youtube-nocookie.com/embed/_0T5OSSzxms?rel=0" frameborder="0" allowfullscreen></iframe>

**TL;DR**: there's a language and there is a meta language. Language is the actual source code. Meta language is everything above the language: tests, comments, IDE features, documentation, examples, tutorials, blog posts, books, videos, tech talks and conferences. We use meta language to learn the language. Things get more fluid when we move concepts from meta language down to the language itself, which in turn allow us to make the new meta-language even more high level and richer for the same amount of energy spent.

<img src="/assets/meta-language/flow.png" width="600">

To help better understand this, I came up with a bunch of examples.

## Assembly instructions → Variable Names

Let's look at this piece of code from space industry that calculates escape velocity of a planet:


```asm
.SUB_0_21:
    ; Computes escape velocity
    ; register xmm0 - planet mass
    ; retister xmm1 - planet radius
    mulsd   xmm0, qword ptr [rip + .LCPI0_0]
    divsd   xmm0, xmm1
    xorps   xmm1, xmm1
    sqrtsd  xmm1, xmm0
    ucomisd xmm1, xmm1
    jp      .LBB0_2
    movapd  xmm0, xmm1
    ret
.LBB0_2:
    jmp     sqrt                    ; TAILCALL
.LCPI0_0:
    .quad   4459223850755291651     ; double 1.334816E-10
```

A lot about this code resides in meta language -- the comments and the documentation (not shown) to this code. Compare the previous example with this one written in C:

```c
#define GRAVITY_CONSTANT 6.67408e-11
double escape_velocity(double mass, double radius) {
    return sqrt(2 * GRAVITY_CONSTANT * mass / radius);
}
```

Just by *naming* the variables we were able to pull down information that used to reside in meta language into the language itself.

## Variable names → advanced types

The C version of our code contains much more information than the assembly one and its meta language can be more high level. Now it doesn't have to duplicate and document what's already in the code, like the fact that the function takes 2 arguments, the first is mass and the second is radius.

However, there is still some context missing from the code -- the units which the function operates on. These would have to reside in the documentation for the library (meta language).

We can use a simple trick and rename arguments to `mass_kilograms` and `radius_meters`, but there is no language built-in system in place that can guarantee that only kilograms and meters are passed into this function.

Let's take a look at an example of a language that supports more complex types. I used OCaml but pretty much all <abbr title="Turns out ML originally stood for Meta Language. Well played, Cheng Lou, well played">ML</abbr>-family languages like Haskell, Swift, etc. support this kind of stuff (and [F# even has first-class support for units](https://docs.microsoft.com/en-us/dotnet/articles/fsharp/language-reference/units-of-measure)):

```ocaml
let gravity_constant = 6.67408e-11

type mass = Kilograms of float
type length = Meters of float
type velocity = MetersPerSecond of float

let escape_velocity (Kilograms mass) (Meters radius) =
    MetersPerSecond (2.0 *. gravity_constant *. mass /. radius |> sqrt)
```

<small>By the way, not a joke, when calculating Earth's escape velocity I found a bug in my implementation because of OCaml types -- I was passing mass in a wrong unit.</small>

In this example `length` and `mass` are not just numbers but first class citizens. It also makes it safe and easy to maintain and evolve the code. For example, if we wanted to support imperial system (*I don't know why*), we could change the `mass` type to:

```ocaml
type mass =
  | Kilograms of float
  | Pounds of float
```

The type checker will point us to every place in the source code that needs to be changed in order to support the new units.

## Deprecations and other meta information

Let's imagine there was a new fundamental discovery in physics that makes our naїve escape velocity calculation obsolete. How do we deprecate the old function?

We can put this fact into meta language by adding a comment to the documentation or writing a provoking Medium post. But it's much more constructive to bring this information down into the code itself.

We can use the same trick as before with the C function and rename `escape_velocity` to `escape_velocity_DEPRECATED` or something [bizarre like that](https://github.com/facebook/react/blob/80bff5397bf854750dbe7c286f61654ea58938c5/src/umd/ReactUMDEntry.js#L21). However it will mean our API change will break client code, it's also non-standard (anyone can have their custom suffixes) and it doesn't really suggest a better method to use.

What if there was language support for pushing this information from meta into the language itself? Something like

```
let escape_velocity = ...
[@ocaml.deprecated "Please use `quantum_escape` instead"]
```


## More examples

This shows one possible route of embedding more and more information from meta space into the language itself. Here come more examples:

**Visitor Pattern and `for` loops → `map`/`filter`/`reduce`**. In university I was taught about the Visitor Pattern, but now it's super simple and is part of many languages standard library.

**Loading state**. Often times I see people build React components that have something like this as their state:

```javascript
state = {
  data: null,
  error: null,
  loading: true,
};
```

There's information that lives only in meta language that declares that when `loading` is `false`, one of `data` or `error` should not be `null`. Instead, we can use Flow or Typescript to bring this constraint into the language itself:

```javascript
type State =
  { progress: 'loading' } |
  { progress: 'done', data: Object } |
  { progress: 'error', error: Error };

```

**Redux and immutability**. Currently the fact that [Redux](http://redux.js.org/) assumes lack of direct mutations lives in documentation, blog posts, videos and conference talks. Wouldn't it be great if JavaScript natively supported immutable data types and type annotations so that these constraints could be expressed in the code itself?

**Promises and Observables**. In JavaScript, promises made it from being a library functionality to being a core language concept. Same process is ongoing for [observables](https://github.com/tc39/proposal-observable).

![No, it's not a coffee stain](/assets/meta-language/aliens.png)

## Conclusion

It's good to keep in mind that no amount of lowering things into a language will solve the human communication part. However, by evolving the language we are opening opportunities of a much more efficient communication.

Complexity has to reside somewhere. If a language is super simple, then the complexity settles in the meta language

*See also:* [Sebastian Markbåge's talk on minimal API surface area](https://www.youtube.com/watch?v=4anAwXYqLG8), [Jared Forsyth's talk on type systems](https://www.youtube.com/watch?v=V1po0BT7kac). Oh, and the [Arrival](http://www.imdb.com/title/tt2543164/) movie, it's really, really good!
