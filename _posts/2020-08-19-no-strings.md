---
layout: post
title: Things that are not strings
image: /assets/no-strings/og-image.png
excerpt: As programmers, we have a collective delusion that anything that can be represented as a string, is a string. This thinking causes a whole bunch of problems.
css: |
  em {
    font-size: 150%;
    line-height: 1.3;
    margin: 40px 0px;
    display: block;
  }
  .hint {
    opacity: 0.5;
    cursor: pointer;
  }
---

As programmers, we have a collective delusion that anything that can be represented as a string, is a string. This thinking causes a whole bunch of problems.

Let’s take SQL for example. Every API in every programming language that I’ve seen considers SQL statement a string.

```
function execute(sql: string): Promise<Result>
```

The problem with this API is that not every string is a valid SQL (nor sometimes it is the SQL you actually want to run).

Here’s a classic example of the misuse:

```
const query = 'SELECT * FROM posts WHERE id = '
  + params.id;
```

In this example `params.id` can be anything, including invalid or malicious SQL.

The root problem here is not the lack of sanitization. The problem is that SQL is treated as a string.

Think about JSON for another example. You could certainly implement adding an item to a hash by doing this (I hope this code makes you cringe):

```
function addKeyValue(json, key, value) {
  return json.substr(0, json.length - 1)
    + ', "' + key + '": "' + value + '"}';
}
```

As with the SQL example, you could add escaping and sanitization, but it’s just hacks hiding the real problem:

<em>A string can be a representation of a thing, but it’s not the thing itself.</em>

And it’s not only about concatenating strings. Can you spot the problem with this function? <span class="hint" onclick="event.target.innerText = 'This URL will be marked as safe by the code below https://evil.com/https://safe.com/'">(see answer)</span>

```
function isSafeDomain(url: string): boolean {
  return url.includes('https://safe.com/');
}
```

Or in this one? <span class="hint" onclick="event.target.innerText = 'This code is prone to timing attacks'">(see answer)</span>

```
function checkPassword(pass: string, hash: string): boolean {
  return sha1(pass) === hash;
}
```

Strings are lower level, and thus are much more flexible than they need to be to properly implement valid operations on the higher level concepts.

Incomplete list of things that are not strings:

- SQL
- HTML
- JSON
- URL
- File path
- Password

## Things are… things

You can save yourself a lot of headache if you stop treating everything that can be represented as a string, as a string.

Both OO and FP styles allow for abstracting away something as a type or a class. You can make a closed opaque structure for the thing and limit the ways it can be constructed.

For example, for SQL, you might want to make sure it’s only created from static string literals.

```
// Allowed
new SQL('SELECT * FROM posts WHERE id = ?');

// No allowed (e.g. via a lint rule)
new SQL('SELECT * FROM posts' + filter);
```

Of course, at some point, you will need to serialize the thing into a string to pass it into an API that was designed to consume a string. Do it at the last possible moment and try to limit it to a single place in the codebase.

```
function execute(sql: SQL): Promise<Result> {
  return unsafeExecute(sql.toString());
}
```

Strings are coming into your app from the outer world. Don't trust them to be what they seem they are. Convert them into proper things as soon as possible, and convert them back to strings as late as possible.

Here’s a few libraries for inspiration of how to treat things as… things:

- SQL: [Slonik](https://github.com/gajus/slonik), [LINQ](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/basic-linq-query-operations)
- HTML: React, Elm, [rum](https://github.com/tonsky/rum)
- JSON: a dictionary in any programming language
- URL: [url - Rust](https://docs.rs/url/2.1.1/url/)
- File paths: [std::path::Path - Rust](https://doc.rust-lang.org/std/path/struct.Path.html)
- Passwords: [secstr](https://github.com/myfreeweb/secstr), [securemem](https://hackage.haskell.org/package/securemem)

---

Good discussions on [reddit](https://www.reddit.com/r/programming/comments/ie3dqz/things_that_are_not_strings/), [lobsters](https://lobste.rs/s/wjpj6n/things_are_not_strings).

2020-08-23: Added password library example
