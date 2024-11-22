const CACHE_KEY = 'epub_metadata_cache';
const CACHE_TIMESTAMP_KEY = 'epub_metadata_timestamp';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function getBookMetadata(bookData) {
    try {
        // Check cache first
        const cachedMetadata = getCachedMetadata();
        if (cachedMetadata) {
            const cachedBook = cachedMetadata.find(book => book.id === bookData.id);
            if (cachedBook?.metadata) {
                console.log('Using cached metadata for:', bookData.name);
                return cachedBook.metadata;
            }
        }

        // If not in cache, fetch from your backend API
        console.log('Fetching fresh metadata for:', bookData.name);
        const response = await fetch(`http://localhost:5500/api/book/${bookData.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received book data:', data);

        // Extract metadata from the response
        const metadata = {
            title: data.metadata?.title || bookData.name,
            creator: data.metadata?.creator || 'Unknown Author',
            description: data.metadata?.description || 'No description available'
        };

        // Cache the metadata
        const enrichedBook = {
            id: bookData.id,
            metadata: metadata
        };
        
        // Update cache
        const currentCache = getCachedMetadata() || [];
        const updatedCache = [...currentCache.filter(book => book.id !== bookData.id), enrichedBook];
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        
        return metadata;
    } catch (error) {
        console.error('Error loading book metadata:', error);
        return null;
    }
}

export function generateMetadataHTML(metadata, bookData) {
    console.log('Generating metadata HTML:', { metadata, bookData });
    
    // Create a temporary div to decode HTML entities and parse HTML
    let sanitizedDescription = 'No description available';
    if (metadata?.description) {
        // First decode HTML entities
        const parser = new DOMParser();
        const decodedDescription = parser.parseFromString(metadata.description, 'text/html').body.textContent;
        
        // Now create the HTML structure
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = decodedDescription;
        
        sanitizedDescription = tempDiv.innerHTML;
    }

    // Create the HTML content
    const htmlContent = `
        <div class="metadata-container">
            <h1 class="book-title">${metadata.title || bookData.name}</h1>
            <h2 class="book-author">${metadata.creator || 'Unknown Author'}</h2>
            <div class="book-details">
                <div class="book-annotation">
                    ${sanitizedDescription}
                </div>
            </div>
        </div>
    `;

    return htmlContent;
}

function getCachedMetadata() {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        
        if (!cachedData || !timestamp) {
            return null;
        }
        
        // Check if cache is expired
        if (Date.now() - parseInt(timestamp) > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);
            return null;
        }
        
        return JSON.parse(cachedData);
    } catch (error) {
        console.error('Error reading metadata cache:', error);
        return null;
    }
}

export async function handleBookClick(bookData) {
    try {
        const metadata = await getBookMetadata(bookData);
        console.log('Retrieved metadata:', metadata);
        return generateMetadataHTML(metadata, bookData);
    } catch (error) {
        console.error('Error in handleBookClick:', error);
        return generateMetadataHTML(null, bookData);
    }
}
