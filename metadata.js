import 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js';
import 'https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js';

document.addEventListener('DOMContentLoaded', async () => {
	const booksContainer = document.querySelector('.books-grid');
	const CACHE_KEY = 'books_metadata';
	const CACHE_TIMESTAMP_KEY = 'books_metadata_timestamp';
	const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
	
	async function fetchAndCacheBooks() {
		try {
			console.log('Fetching books from server...');
			const response = await fetch('http://localhost:3000/api/books/batch-metadata');
			
			if (!response.ok) {
				throw new Error(`Server responded with status: ${response.status}`);
			}
			
			const booksMetadata = await response.json();
			console.log('Received books metadata:', booksMetadata);
			
			// Store the data and timestamp
			localStorage.setItem(CACHE_KEY, JSON.stringify(booksMetadata));
			localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
			
			return booksMetadata;
		} catch (error) {
			console.error('Error in fetchAndCacheBooks:', error);
			throw error; // Re-throw to handle in main try-catch
		}
	}
	
	function getCachedBooks() {
		try {
			console.log('Checking cached data...');
			const cachedData = localStorage.getItem(CACHE_KEY);
			const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
			
			if (!cachedData || !timestamp) {
				console.log('No cached data found');
				return null;
			}
			
			// Check if cache is expired
			if (Date.now() - parseInt(timestamp) > CACHE_DURATION) {
				console.log('Cache is expired');
				localStorage.removeItem(CACHE_KEY);
				localStorage.removeItem(CACHE_TIMESTAMP_KEY);
				return null;
			}
			
			const parsedData = JSON.parse(cachedData);
			console.log('Using cached data:', parsedData);
			return parsedData;
		} catch (error) {
			console.error('Error reading cache:', error);
			return null;
		}
	}
	
	async function displayBooks(booksMetadata) {
		try {
			console.log('Displaying books:', booksMetadata);
			booksContainer.innerHTML = ''; // Clear loading indicator
			
			if (!Array.isArray(booksMetadata)) {
				throw new Error('Books metadata is not an array');
			}
			
			const bookElements = await Promise.all(booksMetadata.map(async bookData => {
				const bookElement = document.createElement('div');
				bookElement.className = 'epub-book';
				
				// Create a temporary Book instance to get metadata
				const book = ePub(bookData.filePath);
				try {
					const metadata = await book.loaded.metadata;
					console.log('EPub metadata:', metadata);
					
					// Store the full metadata for later use
					bookData.epubMetadata = {
						title: metadata.title,
						creator: metadata.creator,
						description: metadata.description,
						language: metadata.language,
						publisher: metadata.publisher,
						// Add any other metadata fields you need
					};
					
					if (bookData.coverUrl) {
						bookElement.innerHTML = `
							<img src="${bookData.coverUrl}" 
								 alt="${metadata.title || bookData.name}" 
								 loading="lazy"
								 style="width: 100%; height: 100%; object-fit: cover;">
						`;
					} else {
						bookElement.innerHTML = `
							<div class="no-cover">
								<p>${metadata.title || bookData.name}</p>
							</div>
						`;
					}
					
					// Add click handler with full metadata
					bookElement.addEventListener('click', (e) => {
						const metadataHtml = `
							<div class="metadata-container">
								<h1 class="book-title">${metadata.title || bookData.name}</h1>
								<h2 class="book-author">${metadata.creator || 'Unknown Author'}</h2>
								<div class="book-description">
									${metadata.description || 'No description available'}
								</div>
								${metadata.publisher ? `<p class="book-publisher">Publisher: ${metadata.publisher}</p>` : ''}
								${metadata.language ? `<p class="book-language">Language: ${metadata.language}</p>` : ''}
							</div>
						`;
						window.overlay.open(metadataHtml);
					});
					
				} catch (error) {
					console.error('Error loading epub metadata:', error);
					// Fallback to basic display if metadata loading fails
					bookElement.innerHTML = `
						<div class="no-cover">
							<p>${bookData.name}</p>
						</div>
					`;
				}
				
				return bookElement;
			}));
			
			booksContainer.append(...bookElements);
		} catch (error) {
			console.error('Error in displayBooks:', error);
			throw error;
		}
	}
	
	try {
		// Try to get cached data first
		let booksMetadata = getCachedBooks();
		
		if (booksMetadata) {
			console.log('Using cached book data');
			await displayBooks(booksMetadata);
		} else {
			console.log('Fetching fresh book data');
			booksMetadata = await fetchAndCacheBooks();
			await displayBooks(booksMetadata);
		}
		
	} catch (error) {
		console.error('Main error:', error);
		booksContainer.innerHTML = `
			<div class="error">
				Error loading books: ${error.message}
				<br>
				<button onclick="window.location.reload()">Retry</button>
			</div>`;
	}
});
