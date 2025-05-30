# Hack Stories Blog

A modern, responsive static blog website for sharing technical content with beautiful code syntax highlighting.

## Features

- **Modern, Clean Design**: Professional and responsive layout
- **Syntax Highlighting**: Beautiful code blocks with Prism.js
- **Mobile-Friendly**: Fully responsive design
- **Fast Loading**: Lightweight static files
- **Easy to Customize**: Simple HTML, CSS, and JavaScript
- **SEO-Friendly**: Semantic HTML structure

## Getting Started

1. Open the project folder in VS Code
2. Install the Live Server extension (if not already installed)
3. Right-click on `index.html` and select "Open with Live Server"
4. Your blog will open in the browser at `http://localhost:5500`

## Adding New Blog Posts

To add new blog posts, edit the `blogPosts` array in `script.js`:

```javascript
const blogPosts = [
    {
        id: 4, // Unique ID
        title: "Your New Post Title",
        excerpt: "A brief description of your post...",
        date: "2025-05-30", // YYYY-MM-DD format
        readTime: "5 min read",
        tags: ["JavaScript", "Tutorial"],
        content: `
# Your Post Title

Your markdown content goes here...

## Code Example

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`
        `
    },
    // ... existing posts
];
```

## Supported Code Languages

The blog supports syntax highlighting for many programming languages:

- JavaScript
- Python
- HTML
- CSS
- JSON
- Bash/Shell
- SQL
- And many more!

## Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --accent-color: #f59e0b;
    /* ... other variables */
}
```

### Adding New Sections

Add new sections to `index.html` and update the navigation accordingly.

### Modifying the Layout

The blog uses CSS Grid and Flexbox for layout. Modify the styles in `styles.css` to change the appearance.

## File Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Dynamic content and interactions
- **Prism.js**: Syntax highlighting for code blocks
- **Google Fonts**: Inter and JetBrains Mono fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.
