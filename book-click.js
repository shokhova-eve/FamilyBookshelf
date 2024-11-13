let selectedBook = null;

function handleBookClick(bookData) {
    // Deselect previously selected book if any
    const previouslySelected = document.querySelector('.epub-book.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Select the clicked book
    const clickedElement = event.currentTarget;
    clickedElement.classList.add('selected');
    selectedBook = bookData;

    // Update the right section with book metadata
    const rightSection = document.querySelector('.right-section');
    
    // Extract metadata safely
    const metadata = bookData.metadata || {};
    const title = metadata.title || bookData.name || 'Unknown Title';
    const author = metadata.creator || 'Unknown Author';
    const description = metadata.description || 'No description available';
    const publisher = metadata.publisher || 'Unknown Publisher';
    const pubDate = metadata.pubdate || 'Unknown Date';
    
    rightSection.innerHTML = `
        <div class="metadata-container">
            <h2 class="book-title">${title}</h2>
            <div class="metadata-grid">
                <div class="metadata-item">
                    <span class="label">Author:</span>
                    <span class="value">${author}</span>
                </div>
                <div class="metadata-item">
                    <span class="label">Publisher:</span>
                    <span class="value">${publisher}</span>
                </div>
                <div class="metadata-item">
                    <span class="label">Publication Date:</span>
                    <span class="value">${pubDate}</span>
                </div>
            </div>
            <div class="description">
                <h3>Description</h3>
                <p>${description}</p>
            </div>
            <div class="action-buttons">
                <button class="read-button" onclick="openReader('${bookData.id}')">
                    Read Book
                </button>
                <button class="download-button" onclick="downloadBook('${bookData.id}')">
                    Download
                </button>
            </div>
        </div>
    `;
}

function openReader(bookId) {
    if (!selectedBook) return;
    // Store the selected book in localStorage for the reader page
    localStorage.setItem('currentBook', JSON.stringify(selectedBook));
    // Navigate to the reader page
    window.location.href = `reader.html?id=${bookId}`;
}

function downloadBook(bookId) {
    if (!selectedBook) return;
    
    // Create a download link
    const downloadUrl = `http://localhost:3000/api/books/download/${bookId}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = selectedBook.name || 'book.epub';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
