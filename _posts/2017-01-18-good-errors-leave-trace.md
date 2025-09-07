---
layout: post
title: Good Errors Leave Trace
excerpt: Errors with extra informaton can help locate and fix the problems faster.
tags:
  - programming
---

The value of an error is in the information it carries. Bad errors carry very little information, good errors provide enough to know what went wrong and how to fix it.

Errors are usually classified by:

- target audience: made for developers or users
- severity: from minor to critical
- outcome: recoverable and non-recoverable

But let's try organizing errors _by the amount of information they contain_. Hopefully this way will open another dimension for you to reason about your code.

**Level 0. No information at all**. Errors are least useful when they are completely silenced and the only way to detect them is to notice that something else is broken.

**Level 1. Information that fits one bit**. At the very extreme end of information there are errors that only report their existence, providing no additional information whatsoever. For example, an API that returns `false` when it fails or a unix command that returns non-zero exit code without printing anything. While not extremely helpful, it's still much better than nothing.

**Level 2. Error with a message**. Having a good error message is the simplest and most efficient way to add value. Unique error messages are great because they can be traced back to the source code. `git grep` (or similar) can be used to locate the code that throws the error even if the stack trace is not available.

It's also helpful for people who are not directly working on the project's source code (library users, your app's users, etc.). They can search online for "[app/library][error message]" and find some useful information, like a GitHub issue or a StackOverflow answer.

There is a temptation to include instructions about how to solve the problem into the error message. But don't try to make error messages too smart. In fact, the code that throws the error by definition doesn't know how to fix it and by design has very little context on what's going on.

**Level 3. Stack trace**. When developing a software product, the stack trace is the second most useful piece of data. Almost all scripting languages are great examples of how this is helpful -- they print the stack trace right after the error message. It's also easy to collect this information from the scripting environment itself. On the other hand, compiled languages make it much harder to extract the stack trace.

In some cases conventional stack traces are not very useful. For example, when dealing with asynchronous Promise-based code in JavaScript, the stack trace doesn't include pointers to the code that caused the problem. Fortunately, modern developer tools can keep track of function calls across async call boundaries.

**Level 4. Context**. While the stack trace tells us "where" and "how" the error occurred, it doesn't help much with "why". We need the content of the scope chain -- the values of the variables and arguments at the time the error occurred. However, it's hard to include them into a crash report because they can be too big and the data needs to be serialized.

It's good when errors include some additional context information. For example, "Index out of bounds" is not super helpful, however "Index -1 is out of bounds" is a bit better.

**Level 5. Environment**. Errors can also include some extra information about the environment where the error has occurred. This information, when logged and aggregated and can be used to pinpoint the error's source.

For example, for massive scale backend systems it's almost impossible to look at an error reported by one of hundreds of services and figure out what went wrong. To help pinpoint the cause, it's a good idea to log a lot of additional information with the crash report and then aggregate and display that information. For example, server OS version, service version, arguments, queries per second, memory and CPU utilization, free disk space, active thread etc.

## Errors while reporting errors

The nastiest errors happen during error reporting.

When error reporting code tries to be smart and has untrivial amounts of logic, it will inevitably have bugs on its own. Erros while reporting error are the worst, because they usually hide the original cause.

Unfortunately they are easy to miss too, because the error path is not usually the common path. The error reporting code gets less coverage in terms of automated and manual tests.

However, a few languages do have good tools to help with this case -- Chained Exceptions. For example, when an exception is thrown when processing another exception, [Java](https://docs.oracle.com/javase/tutorial/essential/exceptions/chained.html) and [Python 3](https://www.python.org/dev/peps/pep-3134/) will report both original and new errors:

```
Traceback (most recent call last):
  File "test.py", line 11, in <module>
    baz()
  File "test.py", line 8, in baz
    bar()
  File "test.py", line 5, in bar
    foo()
  File "test.py", line 2, in foo
    raise Exception('Original problem')
Exception: Original problem

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "test.py", line 13, in <module>
    raise Exception('Error while reporting error') from e
Exception: Error while reporting error
```

## Performance

Be aware of the perf cost of including additional information. In particular, often times the error message is formated using some kind of `sprintf` function. Make sure the error message is prepared only when the error has actually been triggered. We had this funny bug in React Native in the early days:

    invariant(
      VALID[name],
      'Bad style name ' + name + '. Valid styles: ' + JSON.stringify(VALID)
    );

As you can see, the error message argument string is computed every time before the function call, even when the invarian doesn't fire.

## Errors visibility

Depending on severity and environment, error can be silenced completely or very loud.

In React Native, for example, we make development errors very visible and actionable information when possible. There are systems out there that do even better! Ruby on Rails has a plugin called [better_errors](https://github.com/charliesome/better_errors) that can show a helpful webpage with stack trace, source code and REPL. It's one of the best error UX I've seen.

In some cases to get the details about a crash one needs to use special tools that recover core dumps and do symbolication. This makes it harder to get to the cause, especially if you are not familiar with the system.

That's why the solutions that make error details visible and/or jump into the debugger are very nice. E.g. Chrome devtools, Visual Studio and any other IDE that runs the code under the debugger. Obviously this is not helpful in production.

Takeaways:

1. Choose unique and helpful error messages
2. Include more information about which piece of data was wrong
3. But don't try to be too clever about the advice above, its will lead to even worse errors.
4. Make sure your [Test Plan](/test-plan) includes code path that triggers errors.

Errors are tools. Use them.
