async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // The JSON file you downloaded
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
  const authClient = await auth.getClient();
  return google.drive({ version: 'v3', auth: authClient });
}

async function listEpubBooks() {
  try {
    const drive = await authorize();
    const response = await drive.files.list({
      q: "mimeType='application/epub+zip'",
      fields: 'files(id, name, webContentLink)'
    });
    
    return response.data.files;
  } catch (err) {
    console.error('Error listing files:', err);
    return [];
  }
}

async function displayBookCover(bookId) {
    try {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}/metadata`);
        const metadata = await response.json();
        
        const bookContainer = document.querySelector('.epub-book');
        const coverImage = document.createElement('img');
        coverImage.src = metadata.coverUrl; // We'll need to add this to the backend
        coverImage.alt = metadata.name;
        bookContainer.appendChild(coverImage);
    } catch (error) {
        console.error('Error displaying book cover:', error);
        // Optionally show a placeholder image
        const bookContainer = document.querySelector('.epub-book');
        bookContainer.innerHTML = '<div class="no-cover">No Cover Available</div>';
    }
}
