class Overlay {
    constructor() {
        if (window.overlayInstance) {
            return window.overlayInstance;
        }

        this.overlay = document.querySelector('.overlay');
        this.arrowButton = document.querySelector('.arrow-button');
        this.closeButton = document.querySelector('.close-button');
        
        this.hasEventListeners = false;
        
        this.setupEventListeners();
        
        window.overlayInstance = this;
    }

    setupEventListeners() {
        if (this.hasEventListeners) {
            return;
        }

        this.arrowButton.addEventListener('click', (e) => {
            console.log('Arrow clicked');
            e.stopPropagation();
            e.preventDefault();
            this.toggleMinimize();
        });
        
        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        
        this.overlay.addEventListener('click', (e) => {
            if (this.overlay.classList.contains('minimized') && 
                !e.target.closest('.overlay-controls')) {
                this.expand();
            }
        });

        this.hasEventListeners = true;
    }

    open(content) {
        this.overlay.style.removeProperty('height');
        this.overlay.classList.remove('minimized');
        this.overlay.classList.add('open');
        
        const contentDiv = this.overlay.querySelector('.overlay-content');
        contentDiv.innerHTML = content;
        
        this.arrowButton.querySelector('i').classList.remove('fa-chevron-down');
        this.arrowButton.querySelector('i').classList.add('fa-chevron-up');
    }

    close() {
        this.overlay.classList.remove('open', 'minimized');
        const contentDiv = this.overlay.querySelector('.overlay-content');
        contentDiv.innerHTML = '';
    }

    minimize() {
        this.overlay.classList.add('minimized');
        this.overlay.classList.add('open');
        this.arrowButton.querySelector('i').classList.remove('fa-chevron-up');
        this.arrowButton.querySelector('i').classList.add('fa-chevron-down');
    }

    expand() {
        this.overlay.classList.remove('minimized');
        this.overlay.classList.add('open');
        this.arrowButton.querySelector('i').classList.remove('fa-chevron-down');
        this.arrowButton.querySelector('i').classList.add('fa-chevron-up');
    }

    toggleMinimize() {
        if (this.overlay.classList.contains('minimized')) {
            this.expand();
        } else {
            this.minimize();
        }
    }
}

// Create single instance
if (!window.overlay) {
    window.overlay = new Overlay();
}

// Example usage for book clicks:
document.querySelectorAll('.epub-book').forEach(book => {
    book.addEventListener('click', () => {
		const metadataHtml = generateMetadataHTML(metadata, bookData);
		window.overlay.open(metadataHtml);
		document.querySelector('.right-section .overlay').classList.add('active');
    });
});
