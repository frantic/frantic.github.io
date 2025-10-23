---
pubDate: 2019-05-19
title: Improving End to End Tests Reliability
excerpt: End-to-end tests are not flaky, if you cook them right.
image: /assets/chunchia-350094-unsplash.jpg
tags:
  - programming
  - testing
---

Are you trying to establish a good end-to-end testing infrastructure at your company? This is how Facebook does it.

## The problem

End-to-end (E2E) tests verify that the product works on the high level. For example, if you have an e-commerce website, E2E test could simulate an important user behavior: open the website in a browser, search for a product, add it to the cart and performing checkout.

It's hard to make end to end tests reliable, because (by definition) these tests rely on all components of your system. If each component has a reliability of 99%, the test that depends on ten systems has 10% chance to fail. This matters even more when you run hundreds of tests a day.

E2E tests often get bad reputation among developers due to this flakiness . See [Google Testing Blog: Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html).

When the engineering organization is growing, we have to scale our tooling. We can't expect thousands engineers to be experts in end-to-end testing. So whenever somebody is writing a new test or investigating a failure, it should not require prior experience dealing with E2E tests.

## The solution

Over the years engineers at Facebook figured ways to improve E2E testing practice. You can watch the tech talk linked at the end for more details. Here are some improvements that I think were really important.

## 1. Make testing API declarative

This is very basic trick, but many engineers writing test don't realize that testing code is also, eh, code, and it will benefit from a healthy amount of abstraction.

Most examples on the internet about how to write E2E tests are very basic and look something like this:

```
findElement('#email').enterText('user_1@domain.com');
findElement('#password').enterText('secret');
findElement('#submit').click();
```

This is a very low level code. If you stick to this API you'll end up with a lot of copy-pasted tests that rely on implementation details. The moment somebody changes your login sequence details all tests will fall apart.

Consider

```
loginWithAccount('user_1@domain.com', 'secret');
```

Now the API became much better. It communicates the intent well and abstracts away the implementation details. When an engineer changes something in the login sequence, they need to fix only one place.

Facebook went even further and built a very declarative `PageObject` abstraction. See the talk linked in the bottom of this article.

Another big improvement in the API was **replacing time-based waits with condition-based waits**. Consider this case:

```
findElement('#login').click();
sleep(10);
findElement('#logout').click();
```

This code assumes the login operation will take at most 10 seconds, and this assumption could be a big source of flakiness. CI machines have different configurations, and depending on network conditions, amount of available RAM space and CPU cycles, 10 seconds might not be enough.

The simplest approach to solve this is to increase the timeout from 10 to, say, 30 seconds. However, that makes the test much slower, to the point that engineers will try to avoid running them locally at all cost.

Try this instead:

```
findElement('#login').click();
waitForElement('#welcome');
findElement('#logout').click();
```

Now the code captures our intention better—we wait until login was completed.

The implementation of `waitForElement` could use a loop that tries to find the element, and if it fails, waits 100ms (or even better, some event-driven approach). This way the function will return as soon as the element is found.

## 2. Setup test data before each test

In the old days we used to create test users and their data manually. For example, to test if a user can join a public group we would create a user and a group and hardcode their IDs in our tests. This was convenient because we could use web UI to set everything up just right.

However, this was a terrible thing. When multiple tests run at the same time, they access the same IDs, and unexpected things could happen.

Nowadays each test creates its own set of entities before each run. We have a test-only server side API that allows creating special kind of users, not visible from the outside world. This made tests independent from each other.

## 3. Make failures inspectable

E2E test can fail for a lot of reasons. Some of these reasons are not related to the actual code or product being tested. For example, iOS simulator can crash or Chrome fails to start due to lack of free RAM on a test machine. We call these failures "infrastructure failures".

At first we treated legitimate test failures and infrastructure failures the same. Something went wrong and needed fixing. As the team grew, the complexity and the context required to debug infrastructure failures became too much for everybody to grasp in reasonable time, so we split the two very explicitly.

In the UI, we use red to signal that the test failed and it's probably your fault and yellow to show that the test failed but it's likely not your fault and the system is trying to re-run the test.

We also improved the test results page. Each test run has a webpage with video recording of the test, logs from different sources, UI and data dumps, etc. When a test fails (for whatever reason) it's easy to open a webpage and see what happened. Engineers could also send the link to other engineers so they can help investigate the problem.

## 4. Automatically find the cause of failure

As the engineering organization, codebase and number of E2E tests grow, it becomes impractical to run them for every single revision committed to the repo. Instead, they are moved to continuous runs. The whole test suite is running every 15-30-60 minutes.

When E2E test fails during continuous run, a new process is triggered that tries to bisect and find the commit that broke the tests. Then it creates a task assigned to the engineer who made that change and marks the test as "failing in master".

These tests marked as failing **won't be reported in test results until fixed**. Since we know the tests are broken in master branch, there's no point in spamming other pull requests with the unrelated failures.

## 5. Make failures easy to reproduce locally

It became very cumbersome to run end to end tests locally. Tests required installing some 3rd party dependencies and figuring out just right combination of the command line arguments. This would result in unproductive behavior, when people blindly fix what seems broken and re-submit the code for review. The CI system would run the tests again. Dealing with E2E failures got a bad reputation, because nobody wanted to go through this long feedback loop.

We started by adding instructions to the tests failure page (which did help). But then we found even better solution: for each test run we assigned a unique ID and added a command line tool (available on each developer's machine). Now, to re-run a failing end-to-end test one would simply need to run:

```
arc e2e <test-id>
```

(arc is a meta task-runner tool everybody has on their computer)

This would fetch information about the test to run, install missing dependencies and run the test in verbose mode.

## 6. Disable failing and flaky test

When an E2E test is failing consistently and nobody cares to fix it, that means the test isn't useful. There's no point in having it around. We have a system that creates a task when a test fails, but after a while if the test is still failing, the system just disables the test.

There's also a system in place that can detect if a test is "flaky". Flaky in this case means that the test can fail sporadically for unrelated reasons. For example, this often happens when the testing code has assumptions about time: "press button A, wait 2 seconds, press button B" (see API section above).

If a test flips between pass-fail without any code changes, the system considers it flaky and disables the test.

In fact, all end-to-end tests start in disabled mode and need to go though extensive load testing to be considered good.

## Conclusion

These improvements helped make E2E tests much more reliable. Not only that, they've also improved engineers' perception of E2E tests, which resulted in more tests being written and relied on.

**See Also:**

- [Stable, Useful, Easy. Pick Three](https://codeandtalk.com/v/seleniumconf-usa-2015/stable-useful-easy-pick-three) a talk by Remi Chaintron from Facebook going into details of some of the topics covered in this post.
