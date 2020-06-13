---
layout: post
title: Moving my serverless project to Ruby on Rails
image: /assets/back-to-rails/og-image.png
excerpt:
css: |
  .large {
    font-size: 1.5em;
    line-height: 1.3;
    padding: 50px;
    margin: 0px -50px;
    background-color: #eee;
    border-radius: 2px;
  }
---

I have a small side project: [digital gift cards for hackers](https://hacker.gifts). It uses Shopify for all the store-related stuff. But I wanted each card to be unique, so I made a few scripts that generate personalized images.

I started with serverless AWS Lambda. At the time it was a hot new word and I wanted to learn more. It seemed very fitting for my use-case: single-responsibility functions that can run at any time and don’t require server maintenance.

![](/assets/back-to-rails/simple-lambda.png)

It was super easy to get started. I built a function and deployed it to AWS Lambda, added Shopify web hook and it all sort of worked.

Time passed and my backend became more complex: I needed to store some state for each puzzle, send confirmation emails, show order details page. What started as a simple function, grew into a bunch of serverless functions, SNS topics, S3 buckets, DynamoDB tables. All bound together with plenty of YAML glue, schema-less JSON objects passed around and random hardcoded configs in AWS console.

It’s not bad, just a normal software development life-cycle: things grow organically, become a mess, and require some refactoring.

But this time it was different. I couldn’t refactor things as easily as I used to in the traditional monolithic apps. Here’s why.

<p class="large">When the building blocks are too simple, the complexity moves into the interaction between the blocks.</p>

And the interactions between the serverless blocks happen _outside_ my application. A lambda publishes a message to SNS, another one picks it up and writes something to DynamoDB, the third one takes that new record and sends an email...

I could test every single block in that flow, but I didn't have the confidence in the overall process. What if publishing fails, how would I know that? How would system recover? Can I rollback and try again?

Another swarm of problems was hiding in my configuration: bad Route 53 record, typos in SNS topics, wrong S3 bucket region. Tracing errors was a challenge, there's no single log output I can look into.

Of course one could sprinkle even more YAML to glue these things together, but it only covers the real issue: _with serverless, I was dealing with a distributed system_.

At this point I felt fooled.

<p class="large">I came for the quick and easy way to deploy simple code and not think about servers, but in the end had to design my system around the platform's limitations.</p>

—

It sucks to work on something that one hates working on. It is a side project I'm doing for fun, so I decided to rewrite it. The tech stack of choice — Ruby on Rails.

I haven’t used Rails since 2013, and for the last 7 years at Facebook I’ve been mostly doing JavaScript.

![](/assets/back-to-rails/logo.jpg)

The experience of picking Rails back up was really nice but uneventful. Nothing really changed that much. Few things got added, a few small things moved around.

Of course I did [hit some magical Ruby issues](https://github.com/rails/rails/issues/38060). But unlike JavaScript, I was quickly able to find solutions.

Everything worked out of the box, which was very usual for me. In JS, I got used to having to build your own framework for every project from the popular libraries.

For example, I rolled out my own routing, file storage wrappers, email preview pipeline, managing secrets, test setup with fixtures, database migrations, logging, performance reporting, deployment scripts.

Along the way I had to make dozens of small decisions — where to put what.

In JS, there’s a ton of nice and focused libraries for doing all these things. But the

Rails comes with these built-in, and configured. I didn’t have to think about all these details and could simply focus on making product-visible changes.

Rails console. Auth. Fixtures.

It was as like driving a Tesla after years of making my own scrappy cars. Similar components, but all configured and aligned to conventions.

—-

I feel like the giant tech swing is happening again. I’m skeptical that JS community can come up with something like Rails, but I’ll leave this for another post.

Microservices are like a black hole. They lure in with exciting promise of adventure, but the gravity sucks you in

In reality, the functions are only 20% of work.

When you code all your stuff inside a “monolith”, that complexity is easy to manage: all code is in one process space, you can test, mock, refactor and deploy your app as a single unit.

Call me old and uncool, but I decided to rewrite my backend in Ruby on Rails (it’s a side project, I’m doing this for fun).
