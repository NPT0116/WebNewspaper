function getMimeType(extension: string): string | undefined {
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.html': 'text/html'
    // Add more types as needed
  };

  return mimeTypes[extension.toLowerCase()];
}

export default getMimeType;
