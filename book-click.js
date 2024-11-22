import { handleBookClick } from './metadata.js';

class BookClickHandler {
    constructor() {
        this.overlay = new Overlay();
        this.handleBookClick = this.handleBookClick.bind(this);
    }

    async handleBookClick(event, bookData) {
        event.preventDefault();
        console.log('Book clicked:', bookData);
        
        // Get the HTML content
        const htmlContent = await handleBookClick(bookData);
        
        // Use the existing open method with the content
        this.overlay.open(htmlContent);
    }
}

window.bookClickHandler = new BookClickHandler();
