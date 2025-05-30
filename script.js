// Function to load blog posts (from localStorage or default)
function loadBlogPosts() {
    const saved = localStorage.getItem('hackStoriesPosts');
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Default posts if none saved
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

// Blog posts data
let blogPosts = loadBlogPosts();

// Function to render blog posts
function renderBlogPosts() {
    const container = document.getElementById('posts-container');
    
    const postsHTML = blogPosts.map(post => `
        <article class="post-card" onclick="openPost(${post.id})">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="post-read-time">${post.readTime}</span>
                </div>
            </div>
            <div class="post-excerpt">
                <p>${post.excerpt}</p>
            </div>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `).join('');
    
    container.innerHTML = postsHTML;
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to open a blog post
function openPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Create new page content
    const articleHTML = `
        <article class="article">
            <a href="#" class="back-button" onclick="goBack(event)">
                ← Back to Posts
            </a>
            <header class="article-header">
                <h1 class="article-title">${post.title}</h1>
                <div class="article-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="post-read-time">${post.readTime}</span>
                </div>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </header>
            <div class="article-content">
                ${convertMarkdownToHTML(post.content)}
            </div>
        </article>
    `;
    
    // Update page
    document.querySelector('.main-content').innerHTML = articleHTML;
    document.title = `${post.title} - Hack Stories`;
    
    // Re-run Prism syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Function to go back to home
function goBack(event) {
    event.preventDefault();
    location.reload(); // Simple way to go back to home
}

// Simple markdown to HTML converter (basic implementation)
function convertMarkdownToHTML(markdown) {
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

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an external link (like admin.html)
            if (href.includes('.html')) {
                // Let the browser handle the navigation normally
                return;
            }
            
            // Handle internal navigation with smooth scrolling
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    // Reload posts if they were updated in admin
    const lastUpdate = localStorage.getItem('hackStoriesPostsUpdated');
    if (lastUpdate) {
        blogPosts = loadBlogPosts();
    }
    
    renderBlogPosts();
    initSmoothScrolling();
    
    // Initialize Prism.js if available
    if (window.Prism) {
        Prism.highlightAll();
    }
});

// Handle navigation active states on scroll
window.addEventListener('scroll', function() {
    const sections = ['home', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link:not(.admin-link)');
    
    let current = '';
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100) {
                current = section;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
