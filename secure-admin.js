// Admin functionality for managing blog posts
class BlogAdmin {
    constructor() {
        this.posts = this.loadPosts();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.renderPostsList();
        this.bindEvents();
        this.updateNavigation();
        this.updateSessionInfo();
        
        // Set today's date as default
        document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
    }

    // Update session information display
    updateSessionInfo() {
        const loginTime = localStorage.getItem('adminLoginTime');
        // const authMethod = localStorage.getItem('adminAuthMethod'); // No longer needed, always passkey
        // const userData = localStorage.getItem('adminUserData'); // No longer needed for display here
        const sessionInfo = document.getElementById('session-info');
        
        if (loginTime) {
            const loginDate = new Date(parseInt(loginTime));
            const hoursAgo = Math.floor((Date.now() - parseInt(loginTime)) / (1000 * 60 * 60));
            const minutesAgo = Math.floor(((Date.now() - parseInt(loginTime)) % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeText = '';
            if (hoursAgo > 0) {
                timeText = `${hoursAgo}h ${minutesAgo}m ago`;
            } else {
                timeText = `${minutesAgo}m ago`;
            }
            
            // Auth method is always Passkey now
            const authText = ' via Passkey';
            
            sessionInfo.textContent = `Session: ${timeText}${authText}`;
        } else {
            sessionInfo.textContent = 'Session: Active';
        }
    }

    // Calculate read time based on content
    calculateReadTime(content) {
        const wordsPerMinute = 200; // Average reading speed
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }

    // Load posts from localStorage
    loadPosts() {
        const saved = localStorage.getItem('hackStoriesPosts');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Return default posts if none saved
        return [
            {
                id: 1,
                title: "Building Secure APIs with Python",
                excerpt: "Learn how to implement authentication, rate limiting, and input validation in your Python APIs to protect against common vulnerabilities.",
                date: "2025-05-28",
                readTime: "8 min read",
                tags: ["Python", "Security", "API"],
                content: `# Building Secure APIs with Python

When building APIs, security should be your top priority. In this post, we'll explore essential security practices for Python APIs.

## Authentication & Authorization

First, let's implement JWT authentication:

\`\`\`python
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, 'your-secret-key', algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token.split(' ')[1], 'your-secret-key', algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated
\`\`\`

## Input Validation

Always validate and sanitize user inputs:

\`\`\`python
from marshmallow import Schema, fields, ValidationError

class UserSchema(Schema):
    username = fields.Str(required=True, validate=lambda x: len(x) >= 3)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 8)

@app.route('/register', methods=['POST'])
def register():
    schema = UserSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Process valid data
    return jsonify({'message': 'User created successfully'})
\`\`\`

## Rate Limiting

Implement rate limiting to prevent abuse:

\`\`\`python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/data')
@limiter.limit("10 per minute")
def get_data():
    return jsonify({'data': 'sensitive information'})
\`\`\`

Remember: Security is not an afterthought—build it into your API from the ground up!`
            },
            {
                id: 2,
                title: "Modern JavaScript Performance Optimization",
                excerpt: "Discover advanced techniques for optimizing JavaScript performance, including lazy loading, code splitting, and efficient DOM manipulation.",
                date: "2025-05-25",
                readTime: "12 min read",
                tags: ["JavaScript", "Performance", "Web Development"],
                content: `# Modern JavaScript Performance Optimization

Performance optimization is crucial for creating fast, responsive web applications. Let's explore some advanced techniques.

## Code Splitting and Lazy Loading

Modern bundlers like Webpack support dynamic imports for code splitting:

\`\`\`javascript
// Lazy load modules when needed
const loadUserModule = async () => {
    const { UserManager } = await import('./modules/UserManager.js');
    return new UserManager();
};

// Use it in your application
document.getElementById('load-users').addEventListener('click', async () => {
    const userManager = await loadUserModule();
    userManager.displayUsers();
});
\`\`\`

## Efficient DOM Manipulation

Minimize DOM operations by batching changes:

\`\`\`javascript
// Bad: Multiple DOM operations
function updateList(items) {
    const list = document.getElementById('list');
    list.innerHTML = ''; // Triggers reflow
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        list.appendChild(li); // Triggers reflow for each item
    });
}

// Good: Batch DOM operations
function updateListOptimized(items) {
    const list = document.getElementById('list');
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        fragment.appendChild(li); // No DOM reflow
    });
    
    list.innerHTML = '';
    list.appendChild(fragment); // Single reflow
}
\`\`\`

## Memory Management

Use WeakMap and WeakSet for better memory management:

\`\`\`javascript
class DataCache {
    constructor() {
        this.cache = new WeakMap();
    }
    
    get(key) {
        return this.cache.get(key);
    }
    
    set(key, value) {
        this.cache.set(key, value);
    }
    
    // Objects can be garbage collected even if still in cache
}
\`\`\`

These optimizations can significantly improve your application's performance and user experience!`
            },
            {
                id: 3,
                title: "Cybersecurity Fundamentals for Developers",
                excerpt: "Essential security concepts every developer should know, from secure coding practices to understanding common attack vectors.",
                date: "2025-05-22",
                readTime: "15 min read",
                tags: ["Security", "Development", "Best Practices"],
                content: `# Cybersecurity Fundamentals for Developers

Security isn't just the responsibility of security teams—developers play a crucial role in building secure applications.

## The OWASP Top 10

Understanding the OWASP Top 10 vulnerabilities is essential:

1. **Injection** - SQL, NoSQL, OS command injection
2. **Broken Authentication** - Session management issues
3. **Sensitive Data Exposure** - Inadequate protection of sensitive data
4. **XML External Entities (XXE)** - Processing untrusted XML
5. **Broken Access Control** - Restrictions not properly enforced

## Secure Coding Practices

### Input Validation

Always validate and sanitize user inputs:

\`\`\`python
import re
from html import escape

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(user_input):
    # Remove potential XSS vectors
    sanitized = escape(user_input)
    # Additional sanitization based on context
    return sanitized.strip()
\`\`\`

### SQL Injection Prevention

Use parameterized queries:

\`\`\`python
# Bad: Vulnerable to SQL injection
def get_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    return execute_query(query)

# Good: Using parameterized queries
def get_user_safe(username):
    query = "SELECT * FROM users WHERE username = %s"
    return execute_query(query, (username,))
\`\`\`

### Password Security

Implement proper password hashing:

\`\`\`python
import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)
\`\`\`

Remember: Security is everyone's responsibility. Start building security into your development process today!`
            }
        ];
    }

    // Save posts to localStorage
    savePosts() {
        localStorage.setItem('hackStoriesPosts', JSON.stringify(this.posts));
        // Also update the main blog data
        this.updateMainBlog();
    }

    // Update the main blog's script.js with new posts
    updateMainBlog() {
        // In a real implementation, you'd update the main script file
        // For now, we'll just store in localStorage and the main page can read from there
        localStorage.setItem('hackStoriesPostsUpdated', Date.now().toString());
    }

    // Generate new ID
    generateId() {
        return this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
    }

    // Render posts list
    renderPostsList() {
        const container = document.getElementById('admin-posts-list');
        
        if (this.posts.length === 0) {
            container.innerHTML = '<p class="text-center">No posts yet. <a href="#new" onclick="admin.showNewPost()">Create your first post</a>!</p>';
            return;
        }

        const postsHTML = this.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(post => `
                <div class="admin-post-card">
                    <div class="admin-post-info">
                        <h3>${post.title}</h3>
                        <div class="admin-post-meta">
                            <span>${this.formatDate(post.date)}</span>
                            <span>${post.readTime}</span>
                        </div>
                        <div class="admin-post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="admin-post-actions">
                        <button class="btn btn-outline btn-small" onclick="admin.editPost(${post.id})">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="admin.deletePost(${post.id})">Delete</button>
                    </div>
                </div>
            `).join('');

        container.innerHTML = postsHTML;
    }

    // Show new post form
    showNewPost() {
        this.currentEditId = null;
        document.getElementById('editor-title').textContent = 'Create New Post';
        document.getElementById('save-btn-text').textContent = 'Save Post';
        document.getElementById('post-form').reset();
        document.getElementById('post-date').value = new Date().toISOString().split('T')[0];
        this.showSection('editor-section');
        this.updateNavigation('new');
    }

    // Edit existing post
    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        this.currentEditId = id;
        document.getElementById('editor-title').textContent = 'Edit Post';
        document.getElementById('save-btn-text').textContent = 'Update Post';
        
        // Fill form with post data
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-excerpt').value = post.excerpt;
        document.getElementById('post-date').value = post.date;
        document.getElementById('post-read-time').value = post.readTime;
        document.getElementById('post-tags').value = post.tags.join(', ');
        document.getElementById('post-content').value = post.content;

        this.showSection('editor-section');
        this.updateNavigation('new');
    }

    // Delete post
    deletePost(id) {
        this.showDeleteModal(id);
    }

    // Show delete confirmation modal
    showDeleteModal(id) {
        document.getElementById('delete-modal').style.display = 'flex';
        document.getElementById('confirm-delete').onclick = () => {
            this.posts = this.posts.filter(p => p.id !== id);
            this.savePosts();
            this.renderPostsList();
            this.hideDeleteModal();
            this.showMessage('Post deleted successfully', 'success');
        };
    }

    // Hide delete modal
    hideDeleteModal() {
        document.getElementById('delete-modal').style.display = 'none';
    }

    // Save post
    savePost(formData) {
        const content = formData.get('content');
        const readTime = formData.get('readTime').trim();
        
        const postData = {
            title: formData.get('title'),
            excerpt: formData.get('excerpt'),
            date: formData.get('date'),
            readTime: readTime || this.calculateReadTime(content), // Auto-calculate if empty
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            content: content
        };

        if (this.currentEditId) {
            // Update existing post
            const index = this.posts.findIndex(p => p.id === this.currentEditId);
            if (index !== -1) {
                this.posts[index] = { ...this.posts[index], ...postData };
                this.showMessage('Post updated successfully', 'success');
            }
        } else {
            // Create new post
            const newPost = {
                id: this.generateId(),
                ...postData
            };
            this.posts.push(newPost);
            this.showMessage('Post created successfully', 'success');
        }

        this.savePosts();
        this.renderPostsList();
        this.showSection('posts-section');
        this.updateNavigation('posts');
    }

    // Show preview
    showPreview() {
        const title = document.getElementById('post-title').value;
        const date = document.getElementById('post-date').value;
        const readTime = document.getElementById('post-read-time').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const content = document.getElementById('post-content').value;

        const previewHTML = `
            <header class="article-header">
                <h1 class="article-title">${title}</h1>
                <div class="article-meta">
                    <span class="post-date">${this.formatDate(date)}</span>
                    <span class="post-read-time">${readTime}</span>
                </div>
                <div class="post-tags">
                    ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </header>
            <div class="article-content">
                ${this.convertMarkdownToHTML(content)}
            </div>
        `;

        document.getElementById('preview-content').innerHTML = previewHTML;
        this.showSection('preview-section');

        // Re-run Prism syntax highlighting
        if (window.Prism) {
            Prism.highlightAll();
        }
    }

    // Show specific section
    showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }

    // Update navigation active states
    updateNavigation(active = 'posts') {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        if (active === 'posts') {
            document.querySelector('[href="#posts"]')?.classList.add('active');
        } else if (active === 'new') {
            document.querySelector('[href="#new"]')?.classList.add('active');
        }
    }

    // Show message
    showMessage(text, type = 'success') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        const container = document.querySelector('.container');
        container.insertBefore(message, container.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Utility functions
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Simple markdown to HTML converter
    convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'javascript';
            return `<pre class="line-numbers"><code class="language-${language}">${code.trim()}</code></pre>`;
        });
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold text
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        
        return html;
    }

    // Bind event listeners
    bindEvents() {
        // Form submission
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.savePost(formData);
        });

        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.showSection('posts-section');
            this.updateNavigation('posts');
        });

        // Preview button
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showPreview();
        });

        // Close preview
        document.getElementById('close-preview').addEventListener('click', () => {
            this.showSection('editor-section');
        });

        // Delete modal events
        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.hideDeleteModal();
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                if (href === '#posts') {
                    this.showSection('posts-section');
                    this.updateNavigation('posts');
                } else if (href === '#new') {
                    this.showNewPost();
                }
            });
        });

        // Toolbar buttons
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleToolbarAction(action);
            });
        });

        // Close modal when clicking outside
        document.getElementById('delete-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideDeleteModal();
            }
        });

        // Auto-calculate read time when content changes
        document.getElementById('post-content').addEventListener('input', (e) => {
            const content = e.target.value;
            const readTimeField = document.getElementById('post-read-time');
            if (!readTimeField.value.trim()) {
                const calculatedTime = this.calculateReadTime(content);
                readTimeField.placeholder = `Auto: ${calculatedTime}`;
            }
        });
    }

    // Handle toolbar actions
    handleToolbarAction(action) {
        const textarea = document.getElementById('post-content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let replacement = '';
        let cursorOffset = 0;

        switch (action) {
            case 'bold':
                replacement = `**${selectedText}**`;
                cursorOffset = selectedText ? 0 : 2;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                cursorOffset = selectedText ? 0 : 1;
                break;
            case 'code':
                replacement = `\`${selectedText}\``;
                cursorOffset = selectedText ? 0 : 1;
                break;
            case 'link':
                replacement = `[${selectedText}](url)`;
                cursorOffset = selectedText ? -4 : -5;
                break;
            case 'preview':
                this.showPreview();
                return;
        }

        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.focus();
        
        const newCursorPos = start + replacement.length + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
}

// Initialize admin when page loads
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new BlogAdmin();
    
    // Update session info every minute
    // setInterval(() => {
    //     admin.updateSessionInfo(); // This might be too frequent or not needed if info doesn't change often
    // }, 60000);
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all authentication data
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminAuthMethod');
        localStorage.removeItem('adminSecretToken'); // Clear the session token
        // localStorage.removeItem('adminUserData'); // Already removed in login logic
        
        // IMPORTANT: Do NOT remove the ADMIN_PASSKEY_ID_KEY on logout.
        // This key identifies the *registered* admin passkey. Removing it would 
        // require the admin to re-register their passkey every time they log out and log back in,
        // which is not the desired behavior. It should only be cleared during a SETUP_MODE re-registration.
        // localStorage.removeItem('definedAdminPasskeyCredentialId'); 
        
        // Remove the old key if it somehow still exists
        localStorage.removeItem('adminPasskeyCredentialId'); 

        window.location.href = 'login.html';
    }
}
