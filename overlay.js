class Overlay {
    constructor() {
        this.overlay = document.querySelector('.overlay');
        this.arrowButton = document.querySelector('.arrow-button');
        this.closeButton = document.querySelector('.close-button');
        this.isFirstOpen = true;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.arrowButton.addEventListener('click', () => this.toggleMinimize());
        this.closeButton.addEventListener('click', () => this.close());
        
        // Allow clicking minimized overlay to expand it
        this.overlay.addEventListener('click', (e) => {
            if (this.overlay.classList.contains('minimized') && 
                !e.target.closest('.close-button')) {
                this.expand();
            }
        });
    }

    open(content) {
        this.overlay.classList.add('open');
        const contentDiv = this.overlay.querySelector('.overlay-content');
        contentDiv.innerHTML = content;
        
        if (this.isFirstOpen) {
            this.isFirstOpen = false;
        } else {
            this.minimize();
        }
    }

    close() {
        this.overlay.classList.remove('open', 'minimized');
        this.overlay.style.height = '0';
        const contentDiv = this.overlay.querySelector('.overlay-content');
        contentDiv.innerHTML = '';
    }

    minimize() {
        this.overlay.classList.add('minimized');
        this.overlay.classList.add('open');
    }

    expand() {
        this.overlay.classList.remove('minimized');
    }

    toggleMinimize() {
        if (this.overlay.classList.contains('minimized')) {
            this.expand();
        } else {
            this.minimize();
        }
    }
}

// Initialize overlay
const overlay = new Overlay();

// Example usage for book clicks:
document.querySelectorAll('.epub-book').forEach(book => {
    book.addEventListener('click', () => {
        overlay.open(`<h2>Book Details</h2>
                     <p>Content for ${book.dataset.title || 'Book'}</p>`);
    });
});
