const fs = require('fs');
const path = require('path');

// Favicon HTML to insert
const faviconHtml = `
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">
    <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
`;

// List of HTML files to update
const htmlFiles = [
    'about.html',
    'contact.html',
    'gallery.html',
    'menu.html'
];

// Function to update a single file
function updateFile(fileName) {
    const filePath = path.join(__dirname, fileName);
    
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if favicon already exists
        if (content.includes('favicon/apple-touch-icon.png')) {
            console.log(`Skipping ${fileName} - already has favicon links`);
            return;
        }
        
        // Insert favicon HTML after the meta description tag
        const updatedContent = content.replace(
            /(<meta\s+name=\"description\".*?>)/,
            `$1\n${faviconHtml}`
        );
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated ${fileName} with favicon links`);
        
    } catch (error) {
        console.error(`Error processing ${fileName}:`, error.message);
    }
}

// Update all HTML files
htmlFiles.forEach(updateFile);

console.log('Favicon update complete!');
