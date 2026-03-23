---
layout: post
title: "A Side Project Story: Music Player"
image: /figma/og_music_player.png
excerpt: One of my most successful side projects had exactly 2 daily active users.
tags:
  - projects
---

One of my most successful side projects had exactly 2 daily active users.

When I was growing up I loved listening to music, especially my parents' cassette tapes and CDs. Back then music had a physical form. You had to take a magical artifact and carefully put it into a special machine that would produce sounds.

My kids growing up experience none of that. From their perspective, we do something with our phones and music just appears from a speaker. The cause and effect far apart.

I wanted to change that. I wanted to give them agency over what's playing, and create an association between a physical medium, label, picture and song.

So here are the principles I had in mind:

- One physical object == one song
- Adding new songs should be cheap and easy

I did a brief research online and couldn't find anything that fits the requirements. And I'll be honest -- I was delighted, it meant I can actually craft something novel and useful for my family and not just buy off-the-shelf solution.

A few days later, I had the "Music Player" (this was way before I started understanding that a good name is important). Each record was an RFID card with an image and title printed on it. You had to take this simple artifact, tap it at a special device and the music would play.

![Components of the project: RFID cards, Raspberry Pi, Spotify and Sonos](/figma/music_player_components.png)

It was powered by an old Raspberry Pi, simple RFID card reader and my existing Sonos speaker. Spotify served as the music library, and adding new songs there was very easy. Here's how it worked.

The playback part was pretty [simple](https://github.com/frantic/miniplayer/blob/master/scripts/daemon.js): read RFID tag, find a song, send it to play on Sonos (this was the simplest setup because we already had an old Sonos speaker that we used for playing music).

But what made this project successful was how easy it was to add new songs. When we found a song we liked we'd just add it to a playlist on Spotify.

Which brings me to the secret sauce -- the admin panel (not an overkill, I promise). It was a React app that used Spotify API to pull a list of songs from a hardcoded playlist ID. It compared the list with the existing database (stored in Firebase) of RFID ID <> song ID mapping, and if the song was missing from the DB, it would pull artwork, name and artist information from the song metadata. Then it rendered the grid of new songs that had a printer-friendly layout that I printed on a sticker paper, cut into individual labels and stuck them to new RFID cards. Then I used a separate RFID card reader plugged into my computer to quickly associate each card with corresponding song.

This process took me about 10 minutes and my kids would help with it too! After a year we had more than 200 RFID-records.

My kids played music on this Music Player every day for years. The youngest user was less than one year old and barely walked, but took no time to learn that tapping with a card plays the song that's pictured on the card.

Many friends (with families) that visited our house asked for a system like that. I gave them the instructions but nobody ended up building it. I can't blame them -- this project can feel like too much work to fit into a busy parenting life. If you want to try, the source code (with the shopping list of materials) is here [https://github.com/frantic/miniplayer](https://github.com/frantic/miniplayer).

I loved building it, and my 2 favorite customers loved using it.

P.S. As I was polishing this post I saw a [similar project by Jordan Fulghum](https://fulghum.io/album-cards), he used NFC tags & Plex instead of RFIDs & Spotify. Check it out!
