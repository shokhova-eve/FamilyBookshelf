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
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    if (!booksGrid) {
        console.error('Books grid not found!');
        return;
    }

    try {
        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        // Clear existing books but keep loading indicator
        booksGrid.innerHTML = '<div id="loading" class="loading-indicator">Loading books...</div>';

        // Create and append book elements
        for (const book of books) {
            // Create book element
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

            // Create and add shadow element inside the book element
            const shadowElement = document.createElement('img');
            shadowElement.src = 'assets/images/book-shadow.png';
            shadowElement.alt = '';
            shadowElement.className = 'book-shadow';
            bookElement.appendChild(shadowElement);

			bookElement.addEventListener('click', (event) => {
                if (window.bookClickHandler) {
                    window.bookClickHandler.handleBookClick(event, book);
                }
			});
            // Add book to grid
            booksGrid.appendChild(bookElement);
        }
    } finally {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing books...');
    const books = await listEpubBooks();
    await displayBooks(books);
});
