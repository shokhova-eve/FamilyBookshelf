# Family Library

A web-based family library application that allows you to browse and view books.

Powered on NodeJS + Firebase + Bootstrap + EPUB.js

## Project Structure

```
/Family-Library
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── animation/
│   │   │   │   └── flame.png
│   │   │   ├── backup/
│   │   │   │   ├── start-background.png
│   │   │   │   ├── start-bookshelf.png
│   │   │   │   ├── bookshelf-background.jpg
│   │   │   │   └── bookshelf-background2.png
│   │   │   ├── start-background.png
│   │   │   ├── start-bookshelf.png
│   │   │   ├── bookshelf-background.png
│   │   │   ├── book-stack.png
│   │   │   └── google-icon.png
│   │   └── styles/
│   │       ├── auth.css
│   │       ├── start-page.css
│   │       └── right-section.css
│   │       └── audio.css
│   │       └── bookshelf-page.css
│   ├── auth-handler.js
│   ├── index.html
│   └── firebase.json
├── backend/
│   └── server.js
├── .gitignore
└── .gitattributes
```

## Features

- Display books
- Display metadata: author, title, description
- Login with Google, Sign up with Google
- Responsive design

## Planned Features
- Read books in the browser
- Download books in EPUB format

## Credits
Music:
- https://lofigirl.com/releases/better-together/

Images:
- <a href="https://www.freepik.com/free-vector/hand-drawn-bookcase-with-books_23667818.htm#fromView=search&page=1&position=20&uuid=97378b77-26a6-40ea-aeb6-799b82dfdf89">Bookshelf image by freepik</a>
- <a href="https://www.freepik.com/free-vector/flat-style-audio-player-control-button-symbol_149280203.htm#fromView=search&page=1&position=51&uuid=ed033f62-e76c-433e-bfcb-8fbbddadeab0">Image by starline on Freepik</a>

## Current issues:
- Book grid is not responsive enough
- Metadata is loading too slowly
- Need to add control over cache size
- Bind books to bookshelves, add second bookshelf
- Add more animations on the first screen
- Add borrow/return functionality
- Show player on all pages and work all the time, not only on the main page
- Fix the shadows under books, and under bookshelfs on index page
- Fix login form
- Separate audio and login to components of index.html
