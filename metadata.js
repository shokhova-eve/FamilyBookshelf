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
			
			const bookElements = booksMetadata.map(bookData => {
				const bookElement = document.createElement('div');
				bookElement.className = 'epub-book';
				
				// Parse HTML content if exists in metadata
				if (bookData.metadata && bookData.metadata.description) {
					const parser = new DOMParser();
					const decodedDescription = parser.parseFromString(
						bookData.metadata.description, 
						'text/html'
					).body.innerHTML;
					bookData.metadata.description = decodedDescription;
				}
				
				if (bookData.coverUrl) {
					bookElement.innerHTML = `
						<img src="${bookData.coverUrl}" 
							 alt="${bookData.name}" 
							 loading="lazy"
							 style="width: 100%; height: 100%; object-fit: cover;">
					`;
				} else {
					bookElement.innerHTML = `
						<div class="no-cover">
							<p>${bookData.name}</p>
						</div>
					`;
				}
				
				bookElement.addEventListener('click', (e) => window.bookClickHandler.handleBookClick(e, bookData));
				
				return bookElement;
			});
			
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
