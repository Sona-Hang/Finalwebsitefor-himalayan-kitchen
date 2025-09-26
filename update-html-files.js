const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
    'index.html',
    'about.html',
    'menu.html',
    'gallery.html',
    'contact.html'
];

// Mobile menu button to insert
const mobileMenuButton = '            <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false"></button>';

// Script tag to add
const mobileScript = '    <script src="js/mobile-menu.js" defer></script>';

// Update each HTML file
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if mobile menu button already exists
        if (!content.includes('mobile-menu-toggle')) {
            // Insert mobile menu button after the nav element
            content = content.replace(
                /(<\/nav>\s*<\/div>)/,
                `</nav>\n${mobileMenuButton}\n        </div>`
            );
        }
        
        // Add mobile menu script before the closing body tag if not already present
        if (!content.includes('mobile-menu.js')) {
            content = content.replace(
                /(<\/body>)/,
                `    ${mobileScript}\n$1`
            );
        }
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log('\n🎉 All HTML files have been updated with mobile menu support!');
