import { generateMetadataHTML } from './metadata.js';

class BookClickHandler {
    constructor() {
        this.overlay = new Overlay();
        this.handleBookClick = this.handleBookClick.bind(this);
    }

    handleBookClick(event, bookData) {
        event.preventDefault();
        
        // Extract metadata safely
        const metadata = bookData.metadata || {};
        
        // Use the new generateMetadataHTML function
        const metadataHtml = generateMetadataHTML(bookData.epubMetadata, bookData);

        // Display in overlay
        this.overlay.open(metadataHtml);
    }
}

// Create a global instance
window.bookClickHandler = new BookClickHandler();
