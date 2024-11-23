const BACKEND_URL = 'http://localhost:5500';

// Cache helper functions
async function getCachedBooks() {
    try {
        const cache = await caches.open('books-cache');
        const response = await cache.match(`${BACKEND_URL}/api/books/batch-metadata`);
        if (response) {
            console.log('Found cached books');
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Cache error:', error);
        return null;
    }
}

async function cacheBooks(books) {
    try {
        const cache = await caches.open('books-cache');
        await cache.put(
            `${BACKEND_URL}/api/books/batch-metadata`, 
            new Response(JSON.stringify(books))
        );
        console.log('Cached books list');
    } catch (error) {
        console.error('Cache error:', error);
    }
}

async function listEpubBooks() {
    try {
        // Try cache first
        const cachedBooks = await getCachedBooks();
        if (cachedBooks) {
            console.log('Using cached books');
            return cachedBooks;
        }

        // If not in cache, fetch from server
        const response = await fetch(`${BACKEND_URL}/api/books/batch-metadata`);
        if (!response.ok) throw new Error('Failed to fetch books');
        
        const books = await response.json();
        await cacheBooks(books);
        return books;
    } catch (error) {
        console.error('Error listing books:', error);
        return [];
    }
}

async function displayBooks(books) {
    const booksGrid = document.querySelector('.books-grid');
    
    if (!booksGrid) {
        console.error('Books grid not found!');
        return;
    }

    // Add loading indicator at the start
    booksGrid.innerHTML = '<div id="loading" class="loading-indicator">Loading books...</div>';

    try {
        // Wait a small moment to ensure loading indicator is visible
        await new Promise(resolve => setTimeout(resolve, 100));

        // Clear grid and remove loading indicator
        booksGrid.innerHTML = '';

        // Create and append book elements
        for (const book of books) {
            const bookElement = document.createElement('div');
            bookElement.className = 'epub-book';
            bookElement.dataset.bookId = book.id;

            // Add book cover if available
            if (book.coverUrl) {
                const coverImg = document.createElement('img');
                coverImg.src = book.coverUrl;
                coverImg.alt = book.name;
                coverImg.className = 'book-cover';
                bookElement.appendChild(coverImg);
            }

            // Create and add shadow element
            const shadowElement = document.createElement('img');
            shadowElement.src = 'assets/images/book-shadow.png';
            shadowElement.alt = '';
            shadowElement.className = 'book-shadow';
            bookElement.appendChild(shadowElement);

            // Add click handler
            bookElement.addEventListener('click', (event) => {
                if (window.bookClickHandler) {
                    window.bookClickHandler.handleBookClick(event, book);
                }
            });

            // Add book to grid
            booksGrid.appendChild(bookElement);
        }
    } catch (error) {
        console.error('Error displaying books:', error);
        // Show error in grid if something goes wrong
        booksGrid.innerHTML = '<div class="error-message">Error loading books</div>';
    }
}

// Modified initialization code
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we're on the bookshelf page by looking for the books-grid element
    const booksGrid = document.querySelector('.books-grid');
    const isBookshelfPage = window.location.pathname.includes('bookshelf.html');
    
    if (booksGrid && isBookshelfPage) {
        console.log('Initializing books on bookshelf page...');
        // Show loading indicator before fetching books
        booksGrid.innerHTML = '<div id="loading" class="loading-indicator">Loading books...</div>';
        
        const books = await listEpubBooks();
        await displayBooks(books);
    } else {
        console.log('Not on bookshelf page, skipping books initialization');
    }
});
