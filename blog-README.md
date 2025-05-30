# Hack Stories Blog

A modern, responsive static blog website with admin functionality for sharing technical content with beautiful code syntax highlighting.

## Features

### Blog Features
- **Modern, Clean Design**: Professional and responsive layout
- **Syntax Highlighting**: Beautiful code blocks with Prism.js
- **Mobile-Friendly**: Fully responsive design
- **Fast Loading**: Lightweight static files
- **Easy to Customize**: Simple HTML, CSS, and JavaScript
- **SEO-Friendly**: Semantic HTML structure

### Admin Features
- **Secure Authentication**: Login-protected admin panel
- **Post Management**: Create, edit, and delete blog posts
- **Markdown Editor**: Built-in markdown editor with toolbar
- **Live Preview**: Real-time preview of posts
- **Auto Read Time**: Automatic calculation of reading time
- **Session Management**: 24-hour session timeout
- **Local Storage**: Persistent post storage

## Getting Started

1. Open the project folder in VS Code
2. Install the Live Server extension (if not already installed)
3. Right-click on `index.html` and select "Open with Live Server"
4. Your blog will open in the browser at `http://localhost:5500`

## Authentication System

### Admin Access
- **Login URL**: `login.html`
- **Default Credentials**:
  - Username: `admin`
  - Password: `hackstories2025!`
- **Session Duration**: 24 hours
- **Auto-logout**: Sessions expire automatically

### Security Features
- Authentication required for admin access
- Session timeout protection
- Admin link only visible to authenticated users
- Logout functionality with confirmation

## Admin Panel Usage

### Creating Posts
1. Navigate to the admin panel (login required)
2. Click "New Post" in the navigation
3. Fill in the post details:
   - **Title**: Post title
   - **Excerpt**: Brief description
   - **Date**: Publication date
   - **Read Time**: Auto-calculated from content (or manual override)
   - **Tags**: Comma-separated tags
   - **Content**: Markdown content with toolbar assistance

### Managing Posts
- View all posts in the "Manage Posts" section
- Edit existing posts by clicking "Edit"
- Delete posts with confirmation dialog
- Posts are automatically saved to localStorage

### Read Time Calculation
- Automatically calculated based on content length
- Uses 200 words per minute reading speed
- Updates in real-time as you type
- Can be manually overridden if needed

## File Structure

```
/
├── index.html          # Main blog page
├── login.html          # Admin login page
├── admin.html          # Admin panel (protected)
├── styles.css          # Main CSS styles
├── admin-styles.css    # Admin-specific styles
├── script.js           # Blog functionality
├── admin.js            # Admin functionality
└── blog-README.md      # This documentation
```

## Customization

### Changing Admin Credentials
Edit the credentials in `login.html`:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'your-username',
    password: 'your-secure-password'
};
```

### Modifying Read Time Calculation
Adjust the reading speed in `admin.js`:

```javascript
calculateReadTime(content) {
    const wordsPerMinute = 200; // Change this value
    // ... rest of function
}
```

### Styling Customization
- Edit CSS variables in `styles.css` for colors and spacing
- Modify `admin-styles.css` for admin panel appearance
- Add new components by extending existing CSS classes

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Dynamic content and interactions
- **Prism.js**: Syntax highlighting for code blocks
- **Google Fonts**: Inter and JetBrains Mono fonts
- **LocalStorage**: Client-side data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

- Authentication is client-side only (suitable for personal/demo use)
- For production use, implement server-side authentication
- Change default credentials before deployment
- Consider implementing password hashing for production

## License

This project is open source and available under the MIT License.
