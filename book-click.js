class BookClickHandler {
    constructor() {
        this.overlay = new Overlay();
        this.metadataHandler = new MetadataHandler();
        this.setupBookClickListeners();
        
        // Bind the method to the class instance
        this.handleBookClick = this.handleBookClick.bind(this);
    }

    setupBookClickListeners() {
        document.querySelectorAll('.epub-book').forEach(book => {
            book.addEventListener('click', (e) => this.handleBookClick(e, book.bookData));
        });
    }

    handleBookClick(event, bookData) {
        // Deselect previously selected book if any
        const previouslySelected = document.querySelector('.epub-book.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }

        // Select the clicked book
        const clickedElement = event.currentTarget;
        clickedElement.classList.add('selected');

        // Extract metadata safely
        const metadata = bookData.metadata || {};
        const title = metadata.title || bookData.name || 'Unknown Title';
        const author = metadata.creator || 'Unknown Author';
        const description = metadata.description || 'No description available';

        // Create metadata content
        const metadataHtml = `
            <div class="metadata-container">
                <h2 class="book-title">${title}</h2>
                <p class="book-author">Author: ${author}</p>
                <p class="book-description">${description}</p>
            </div>
        `;

        // Display in overlay
        this.overlay.open(metadataHtml);
    }
}

// Create a global instance
const bookClickHandler = new BookClickHandler();

// Export the handler for use in other files
window.bookClickHandler = bookClickHandler;
