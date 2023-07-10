---
layout: page
title: How to subscribe
permalink: /subscribe/
css: |
  button {
    cursor: pointer;
  }
  form {
    display: flex;
    flex: column;
  }
  input {
    font-weight: 500;
    font-size: 16px;
    line-height: 42px;
    font-family: body;
    height: 42px;
    margin: 12px 5px 12px 0;
    padding: 0 14px;
    text-decoration: none;
    border: solid 1px #ccc;
    border-radius: 3px;
    vertical-align: top;
  }
  #bd-email {
    flex: 1;
  }
---

## Email

Get an email every time I publish a new blog post (which means approximately 0.5 email/month). There's a one-click unsubscribe link in every message. Powered by <a href="https://buttondown.email/refer/frantic" target="_blank">Buttondown</a>.

<form
  action="https://buttondown.email/api/emails/embed-subscribe/frantic"
  method="post"
  target="popupwindow"
  onsubmit="window.open('https://buttondown.email/frantic', 'popupwindow')"
  class="embeddable-buttondown-form"
>
  <input type="email" name="email" id="bd-email" placeholder="curious.person@gmail.com" />
  <input type="submit" value="Subscribe" />
</form>

## RSS

Feed URL: `https://frantic.im/feed.xml`.

## Twitter

I don't tweet much, but you can follow [@alex_frantic](https://twitter.com/alex_frantic) to get updates when I write a new post or find something interesting.
