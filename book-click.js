class BookClickHandler {
    constructor() {
        this.overlay = new Overlay();
        this.handleBookClick = this.handleBookClick.bind(this);
    }

    handleBookClick(event, bookData) {
        event.preventDefault();
        
        // Extract metadata safely
        const metadata = bookData.metadata || {};
        const title = metadata.title || bookData.name || 'Unknown Title';
        const author = metadata.creator || 'Unknown Author';
        let description = metadata.description || 'No description available';

        // Parse HTML content in description if it exists
        if (description) {
            const parser = new DOMParser();
            const decodedDescription = parser.parseFromString(
                description, 
                'text/html'
            ).body.innerHTML;
            description = decodedDescription;
        }

        // Create metadata content with updated structure
        const metadataHtml = `
            <div class="metadata-container">
                <div class="metadata-header">
                    <h1 class="book-title">${title}</h1>
                    <h2 class="book-author">${author}</h2>
                </div>
                <div class="metadata-body">
                    <div class="book-description">${description}</div>
                </div>
            </div>
        `;

        // Display in overlay
        this.overlay.open(metadataHtml);
    }
}

// Create a global instance
window.bookClickHandler = new BookClickHandler();
