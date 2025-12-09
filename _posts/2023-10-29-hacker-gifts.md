---
layout: post
title: "A Side Project Story: Hacker Gifts"
image: /figma/og_hacker_gifts.png
excerpt: This is a story about a side project that I started in 2018, and the reasons I'm shutting it down.
tags:
  - projects
---

_This is a story about a side project, [Hacker Gifts](https://hacker.gifts/), that I started in 2018, and the reasons I'm shutting it down._

February 2018. London, 9 pm. It's dark outside and raining. Vlad is holding a flashlight and is looking for... something. One hour ago a girl he didn't know gave him two numbers over the phone and hung up. The numbers looked like GPS coordinates not too far from his house, so Vlad decided to check it out. The people on the street are gazing at Vlad suspiciously, and all he can think about is "How did I get into all of this?"

He got into all of that because of me.

Vlad is my close friend. He has everything (or means of getting everything) that most people would consider a "birthday gift". I wanted to give him something special that he'll remember for the rest of his life.

At first, the idea was simple — write a greetings message, encode it as a QR code and send it via mail. But that would have been too easy for Vlad. So, inspired by great movies like [The Game (1997)](https://www.imdb.com/title/tt0119174/), [Ready Player One (2018)](https://www.imdb.com/title/tt1677720/) and [Mr. Robot](https://www.imdb.com/title/tt4158110/), I dialed it up.

In the QR-encoded letter I had a link to a file with a private SSH key and an IP address (encoded as an obscure Japanese poem). The server had a Tetris game running on it (Vlad _loves_ Tetris), and once he got through that he saw instructions to send 1 satoshi to a Bitcoin address. After verifying the transaction a script gave him the next SSH key, but this time it was encrypted with a password, and the password was inside of an armv6 binary hosted on IPFS that required a PIN. Bruteforcing the PIN took more than 4 hours on a Raspberry Pi. This time the note instructed Vlad to wait for a phone call. I put the third key on a flash drive and hid it under a bench in a park in London, and asked my cousin to give Vlad a call and tell him the GPS coordinates. The password to the last key was encoded as a Branf\*ck program in a BMP file. Using the third key Vlad got to a VNC session on a virtual machine running Windows 3.1, where he had to find a file hidden on a virtual floppy drive. The file had a link to 90s-style webpage with a birthday greeting on it. Happy Birthday, Vlad!

![Early version of hacker.gifts website](/assets/hacker-gifts/happy-birthday.jpg)

It took me more than 2 months to set this all up. Vlad really liked the experience. I was proud.

## Into production

If Vlad liked it, maybe others will like it too?

I've decided to productionalize my learning and make it so anyone could get a similar puzzle. I really wanted to make the puzzle feel personal: it should know the name of the person who's solving it, and at the end should reveal a secret message.

At first, I wanted to send physical postcards, but I stumbled on way too many issues. The printing quality was always a problem. During the delivery, USPS scratched the postcard with the QR code and it didn't always read correctly. Delivery sometimes took more than a week. In addition, many people didn't want to leave their physical address, and the recipient could mistake the postcard for spam.

I decided to shift the focus exclusively to the digital aspect. Buyers can print it themselves, transfer it to their phone, or hide it on their desktop.

![Early version of hacker.gifts website](/assets/hacker-gifts/01-Hacker-Gifts.png)

## Tech stack

I remember wasting _a lot_ of time on which framework to use to build the website. The classic software engineering side project dilemmas. I was agonizing about this until one night I forked $32 for a Shopify store. It wasn't perfect by my standards, but it definitely unlocked everything else.

At first, I processed all orders manually. Shopify sends me a push notification, I run to the computer and quickly enter the data into a local script, then send the result by mail.

In early days the adrenaline from every $20 brought a thrill. But I quickly got tired of getting up in the middle of the night. In addition, I wanted to create a pleasant impression and instant free delivery.

It was time for _Automation_. Shopify can call a webhook for each order, and there I can generate a new postcard and send it by mail.

I started with a microservice zoo — a script in Ruby, an AWS lambda in Node.js, order data in DynamoDB, files in S3, Mailchimp, all seasoned with a bit of Zapier. I tried to keep each individual thing very simple, but the result turned out to be a complexity monster. Debugging stuck orders was hell.

When the COVID hit, I [rewrote everything in Ruby on Rails](/back-to-rails). Because Rails is an established framework, I didn't need to reinvent the wheel at every step. I've got proper tests, queues, database, caching — all working in a nice consistent setup that didn't rely on 3rd party services.

![Sweet Rails tests](/assets/hacker-gifts/tests.png)

## Growth and marketing

When I started, I knew absolutely nothing about growth and marketing.

I remember spending my first $250 on ads — it got me ~200 likes on Facebook and zero orders. I tuned creative, targeting, copy — all with virtually no results. The problem was that I didn't know how to position and explain my product. But I also [didn't know I didn't know that](https://medium.com/@andreamantovani/known-knowns-known-unknowns-unknown-unknowns-leadership-367f346b0953). Frustrating times.

I found my first customers in a local Bay Area group for spouses of software engineers who worked for tech companies. Posting there felt very uncomfortable, but 30 minutes later I sold my first item!

Since then, the product has grown mostly through word-of-mouth and organic Google search.

I struggled with positioning the product until I read [The Mom Test](https://www.momtestbook.com/). That book really opened my eyes to what questions to ask, and I've made many improvements to the website since then.

After much trial and error, I have identified two target audiences:

- Nerds who love side projects and fun puzzles. My product resonated with them once they dug deeper, but getting them to notice it was a challenge — these folks are completely blind to advertising and popular social media.
- Regular people who don’t understand the technology, but who want a thoughtful gift for a programmer. They look at Facebook and click on ads, but it’s difficult to convey the value of such a gift.

![Improved hacker.gifts landing page](/assets/hacker-gifts/latest-landing-page.png)

## Costs and profits

Technically the project is profitable. Here are some numbers from 2020, recent years were in the same ballpark.

Typically I charged $19.99 for a puzzle, sometimes giving a discount.

For the period from September 1, 2019 to September 1, 2020, there were 170 orders, with a total revenue of $3,162.50.

![Improved hacker.gifts landing page](/assets/hacker-gifts/03-Revenue.png)

Shopify eats ~4% from each transaction, charges $32/mo for the service and $36 for the domain.

The backend needs a server on Heroku ($7/mo), Postgres DB ($10/mo) and one VPS ($10/mo) for the quest + domain ($13/y).

Total expenses: $757.

Profit $3,162.50 - 4% - $757 = $2,279.

On the one hand, it’s very good for a pet project. In 2019, the project barely broke even. 2021-2023 were similar to 2020.

But there's one set of numbers that I'm really proud of.

![Improved hacker.gifts landing page](/assets/hacker-gifts/02-Survey.png)

At the end of the puzzle I have a small form for feedback. Not everyone fills it out, but this is what the statistics look like. Reading the feedback always made me smile. I've collected some on the [testimonials](https://hacker.gifts/blogs/guides/testimonials) page.

## Shutting It Down

For the last few years, I haven't touched the project much. But there's no such thing as a truly passive side project.

I'm always anxious something is going to break and users won't get their order. I have alerts for errors and watchdogs, but still feel the responsibility to deliver a great experience hanging over my shoulders.

The tech is also not helping: every bit of my stack is aging fast, and without constant support the cost of any change grows. "The Heroku-18 stack is end-of-life" is April next year, but I know if I start updating it, something else will pop up — new Rails version, DB upgrade, certificates, etc. Even with fewer moving pieces than before, maintenance is not trivial.

But the most important reason I'm shutting it down is to give space for new ideas to grow. In its current state, [Hacker Gifts](https://hacker.gifts) still occupies my headspace that I could use for other things.

Looking back, this project definitely fits the category of "a solution in search of a problem". But I don't blame myself. IMHO the solution is really clever, I haven't seen anything like this anywhere before. I also really enjoyed building it, and I learned a ton about marketing, customer interviews, ads, and many other things.

If you read this far and would like to try it out for free, use code `FRANTIC` at checkout [here](https://hacker.gifts/). I'll keep the servers up until Jan 2024. Also check out [Roberto Vaccari's](https://robertovaccari.com/blog/2021_02_14_hacker_gifts/) review (spoilers!)
