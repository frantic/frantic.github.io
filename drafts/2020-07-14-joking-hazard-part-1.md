---
layout: post
title: "A side project story: Joking Hazard app (part 1)"
image: /assets/og-image.png
excerpt: Preview
css: |
  mark {
    background-color: transparent;
    border-bottom: 5px solid #ffe0ab;
  }
---

3 months ago I looked at an old prototype code and told myself: “I bet I could polish it a little and release it in a week or so”. Oh boy was I wrong…

This is a story about making [Joking Hazard app](https://get.jokinghazard.app/) for iOS and Android.

This part focuses on the technical aspects. I have another one in works about managing time, motivation, energy and product. [Subscribe](/subscribe) to know when it comes out.

## What is Joking Hazard?

So for these of you who don't know, [Joking Hazard](https://www.jokinghazardgame.com/) is an offline card game made by Explosm.net, the authors of Cyanide and Happiness. It's kind of like ["Cards Against Humanity"](https://cardsagainsthumanity.com/), dark humor that can be enjoyed in a circle of close friends.

The idea is to collectively assemble a comic panel from generic pieces. The funniest story wins. You can read the rules [here](https://www.jokinghazardgame.com/).

I've played this game many times. I even started building an app for it in 2017, but eventually put it on the long shelf of unfinished side projects. It was collecting dust up until the start of global pandemic when I figured it'd actually be somewhat relevant.

## Overall architecture

It’s funny, when I look back at the project in its current state -- it doesn’t look like much. The complexity hides in the details, an I'm hoping to capture some here.

<mark>The app is written in React Native</mark> using Expo. Even though I know React Native pretty well, using Expo allowed me to move fast and have amazing development experience without setting up much infrastructure.

<mark>The backend is a NodeJS app</mark> that uses Express and WebSockets. Packaged into a Docker container and deployed to Heroku.

The server holds the game state. After authentication clients send commands to the server, it updates the game state and notifies other clients.

Both the app and the server are coded both parts in TypeScript. Sharing some common types is pretty nice!

Both the client and the server live in a single repo.

## NodeJS Server

Setting up NodeJS with TypeScript and other tools is still not fun in 2020. For example, looking back at my `package.json` I see this:

```
"watch": "nodemon --ext ts,js,json --watch src --exec 'yarn start'",
"start": "babel-node --extensions '.ts' src/index.ts",
"build": "babel --extensions '.ts' src -d dist",
```

I feel like <mark>there’s a lot of cruft in there that my app should not care about, but for some reason it has to.</mark>

For example, I don’t like the `--extensions` flag, and the fact that I also need to set these flags for nodemon. Also, nodemon is a very primitive tool, there surely must be a way for the app to reload parts of itself without full restart.

Why did I use Babel instead of TypeScript compiler? Don’t remember for sure, but I think `babel` was a lot faster than `tsc`, and there were some inconsistencies between development and test environment. Or maybe some `node_modules` didn’t work?

Also, because of the `dist` folder for `build` command my tests were running twice, I had to configure Jest to not do that:

```
modulePathIgnorePatterns: ['<rootDir>/dist/'],
```

There are a lot more things like this: random configs that conflict with other libraries or workflows in non-obvious ways.

<mark>Setting up NodeJS project is like trying to convince a bunch of rockstars to play a song together.</mark> I still miss the good old Rails days of ~2010 where everything worked together as a symphony orchestra.

### From Flow to TypeScript

This project heavily relies on types. When I started in 2017 Flow was popular and I’ve already had experience using it on React Native team.

When I picked up the project in 2020, TypeScript clearly had more mindshare, so I’ve decided to convert. It took me less than an hour thanks to `flow-to-typescript` tool.

One big thing that I’ve lost a lot of time on later was this (inside `tsconfig.json`):

```
"strictNullChecks": true
```

By default it’s `false` and lets this kind of bugs happen:

```
async function f(): Promise<number> {
  return null; // no errors?!
}
```

<mark>Sharing the types between the client and the server is a superpower</mark> and definitely helped a lot. For example, I could add a field on my model on the server side and it just appeared on the client as well.

### Functional core, imperative shell

The game logic is implemented as a state machine and uses the reducer pattern (state, action → state). I actually run Redux on the server side (although I'm not proud of that).

```
function reducer(state: TableState, action: Action): TableState
```

Similarly, in-app notifications are driven by another pure function that takes old & new state + action and returns a list of push notifications to send:

```
function whatToSend(
  oldState: TableState,
  newState: TableState,
  action: Action
): Notification[]
```

Both functions are pure and extensively tested.

Around that is a thin layer of code that deals with WebSockets and push APIs.

Side note: Expo push API is amazing and saved me a lot of time!

### Testing

I used Jest to write a bunch of unit tests for the functional core. Most of the important logic was implemented as pure functions, so testing them was pretty straighforward.

### Bots

From the earliest implementations I wanted to have a bunch of tests for the server that exercised the logic end-to-end. The app wasn’t ready yet, so I wrote a simple bot “AI” that makes a random move when it’s their turn.

```
function move(state: TableState): Action | null
```

When I ran 3 bots together I found a few edge cases in my game implementation.

Later on, bots became super useful for testing the app as well — I didn’t have to have 3 simulators open to play a game.

### Authorization

In the app users can login via Facebook or Email magic links.

Facebook was pretty straightforward: get the access token from Expo Facebook SDK and exchange it with the server for our own access token. On the server I check if the Facebook token is valid, fetch user info and create a session.

The Email route was a bit more involved. I didn’t want to deal with passwords (storing, validating, changing, etc.) so I went with “magic link” approach. It’s a 3-step process: user enters their email address, we check if they are already registered, if so we send them an email with a “magic link”. Clicking that link will enable the new session, and when the user goes back to the app they should be logged in.

I implemented this as a table that holds 2 tokens: the first is sent to the client app, the second one is inside the “magic link” email. The client app keeps polling the server to check if its token has been validated, and if so gets back an actual access token.

```
export class PendingLogin extends Model {
  public id: string;
  public confirmation: string;
  public confirmed: boolean;
  public userId: string;
  public createdAt: Date;
  public updatedAt: Date;
}
```

I spent a lot of effort on trying to make this right, and many things went wrong. For example, a misconfigured Mailgun DNS delivered emails straight to the spam folder (or resulted in bounces). I also didn’t notice the “track link clicks” option in Mailgun and all the links I was sending on prod tier simply didn’t work.

Email auth on the client was a challenge too. If the user decided to check their email on the phone, the app could get killed by the OS, so I had to use some local storage and UX hacks (e.g. do you want to keep waiting for confirmation or start over?).

All in all email auth was a pain. The users who signed up with email had picked weird usernames, didn’t have profile pictures and didn’t do much inside the app.

There was a temptation to plug JWTs in, but really at this point there was no benefits for doing so.

### Database: Postgres with JSON fields

I picked PostgreSQL because I wanted to explore its JSON support and try LISTEN/NOTIFY APIs.

Here’s the basic models I used:

```js
export class User extends Model {
  public id: string;
  public name: string;
  public email: string | null;
  public pictureUrl: string | null;
	...
}

export class Table extends Model {
  public id: string;
  public name: string;
  public state: TableState;
  public joinCode: string;
  public nudgeCount: number;
	...
}
```

(I picked “table” as a name for a game room, and regretted this decision many times.)

Each player could participate in multiple tables, and tables could have multiple players. Many-to-many. However, I didn’t want to represent this relationship in typical “join table” way, because the information about who plays where is already stored in the table’s state!

So for each table I could get a list of users (easy, `table.state.players`) but how can I get a list of all tables the user is playing at?

In the end I spent way too much time fiddling with this. As a temporary solution I actually resorted to this:

```
SELECT * FROM "Tables" WHERE state::text LIKE '%"${userId}"%'
```

Eventually I did figure out how to properly do it:

```
SELECT t.*
FROM
  "Tables" t,
  jsonb_array_elements(state->'players') player
WHERE player->>'id' = '${userId}'
```

Despite all the praise, I found Postgres JSON support confusing. `->` vs `->>`, `json` vs `jsonb`, random functions that start with `json_`. Maybe I should have went the hard route and studied the manual. I bet if you are good at Postgres, it all makes sense, but as an engineer who rarely touches databases I was confused.

As for LISTEN/NOTIFY, I didn’t get to try it yet. Everything still runs in a single NodeJS instance.

### Data access layer: Prisma 2 vs Sequilze

I wanted to try something new for the database access layer. Prisma 2 seemed like the new hotness in this space, so I’ve decided to give it a shot. Unsurprisingly it didn’t work well.

The idea is really nice IMHO: you define a database schema in graphql-like syntax, the tool generates sql migrations for you and a typed client. I loved both aspects:

- Generating migrations means the source of truth is the current schema. Kind of like React — I tell the system what I want, and it figures out how to get there.
- Typed client was very useful. First, it knows the schema of your database, which gives you a very powerful autocomplete and type safety.

But bleeding edge is called this way for a reason. During the migrations I saw a bunch of scary messages about missing or duplicate indexes, invalid SQL statements, etc. Prisma 2 GitHub issues page is like a flood zone. It’s clear the tech is still very raw.

Fortunately I only spent a couple of hours on this detour. Switched back to master branch and decided to go with the proven, old and boring choice: Sequlize. I picked it because it had similar properties to Prisma 2: I define a schema and Sequilze can figure out how to mold the database. It was perfect for a small project.

Sequlize’s TypeScript support was pretty basic, definitely worse than Prisma 2. However I had zero problems with it.

### Deploying: Docker to Heroku

I could deploy the server to a VPS but I’ve decided to start small and simple. After deploying my NodeJS app to Heroku it suddenly felt "real": I could play a game with bots from my phone away from my laptop.

On the free tier Heroku shuts down the server when it’s not being used. The game is async, and the players check the app at random times throughout the day. And that meant the UX sucks, because in most cases the server is cold and it takes the client a long time to get connected. So I upgraded to the hobby tier \$7/mo.

Eventally I decided to decouple pushing code to Heroku

This is how the default Heroku deployment works. When I push git master branch, it detects the type of the app and triggers a thing called build pack of the corresponding type. The build pack is just a list of steps that produce a Docker container with all required stuff installed and configured.

```
$ heroku container:push web
```

```
$ heroku container:release web
```

I could further optimize this by splitting “build image” from the “prod image”.

In development I use babel-node, but in prod I pre-transform all TS files and run them with vanilla node. There were some inconsistencies with this, for example using `import` for JSON files works with babel-node but doesn’t work for vanilla node.

### Continuous Integration - Pipelines

For historical reasons I kept all my side projects in BitBucket. It's a nice service

Hard to config
Redeploys the server without a reason

### Domain name: jokinghazard.app

Expo
Monorepo
Open Source

### Notifications

Android is different

### Nudging

### Push token / access token duality

When user logs in, we give them an access token. They use this access token to talk to our server: get the game state, make moves, etc.

We also register a push token to send push notifications.

The problem is — access token is a property of a user, while push token is a property of a device. Apple or Google have no idea about our app’s “user”.

This means that if we are not careful, we could send push notifications to the wrong user! Consider this example:

Alice logs in, gets and registers the push token for her phone. Then she logs out, but we forget to unregister.

My initial design had this flaw: I was using

### User id generation

I wanted to try something different for user ID generation. It’s used in game state and a bunch of other places.

I started with a random UUID like that

Navigator problems

Presense

#blog
