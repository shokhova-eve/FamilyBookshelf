# Family Library

A web-based family library application that allows you to browse and view books in a beautiful interface.

## Project Structure

```
/Bookshelf
├── assets/
│   ├── images/
│   │   ├── start-background.png
│   │   ├── start-bookshelf.png
│   │   └── bookshelf-background.png
│   ├── js/
│   │   └── book-click.js
│   └── styles/
│       └── style.css
├── backend/
│   └── server.js
├── index.html
├── bookshelf.html
├── main.js
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Bookshelf.git
cd Bookshelf
```

2. Backend setup (if running locally):
```bash
cd backend
npm install
# Create credentials.json if needed
cd ..
```

3. Running the application:
   - For development with backend:
     - Start the backend server: `cd backend && node server.js`
     - Open index.html in your browser
   - For GitHub Pages version:
     - Simply visit: https://YOUR_USERNAME.github.io/Bookshelf/

## Development vs Production
- The `main` branch contains the full version with backend functionality
- The `gh-pages` branch contains a static version for GitHub Pages hosting

## Notes
- Make sure to never commit sensitive information in credentials.json
- The GitHub Pages version uses static data instead of a backend server
