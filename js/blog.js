// Blog Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogSearch();
    initializeLoadMore();
    initializeNewsletterSubscription();
    initializeReadMoreLinks();
});

// Blog Search and Filter Functionality
function initializeBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const blogPosts = document.querySelectorAll('.blog-post');

    if (searchInput) {
        searchInput.addEventListener('input', filterBlogPosts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBlogPosts);
    }

    function filterBlogPosts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';

        blogPosts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
            const author = post.querySelector('.author span').textContent.toLowerCase();
            const category = post.getAttribute('data-category');

            const matchesSearch = title.includes(searchTerm) || 
                                excerpt.includes(searchTerm) || 
                                author.includes(searchTerm);
            const matchesCategory = !selectedCategory || category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.3s ease';
            } else {
                post.style.display = 'none';
            }
        });

        // Show no results message if no posts match
        const visiblePosts = Array.from(blogPosts).filter(post => post.style.display !== 'none');
        showNoResultsMessage(visiblePosts.length === 0);
    }
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('noBlogResultsMessage');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noBlogResultsMessage';
        noResultsMsg.className = 'no-blog-results-message';
        noResultsMsg.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No Blog Posts Found</h3>
                <p>Try adjusting your search criteria or browse all categories.</p>
                <button onclick="clearBlogFilters()" class="clear-filters-btn">
                    <i class="fas fa-times"></i>
                    Clear Filters
                </button>
            </div>
        `;
        
        const blogGrid = document.getElementById('blogPostsGrid');
        blogGrid.parentNode.insertBefore(noResultsMsg, blogGrid.nextSibling);
        
        // Add styles for no results message
        const noResultsStyles = `
            .no-blog-results-message {
                text-align: center;
                padding: 60px 20px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                margin-top: 30px;
            }
            .no-blog-results-message .no-results-content i {
                font-size: 48px;
                color: #dcdcdc;
                margin-bottom: 20px;
            }
            .no-blog-results-message .no-results-content h3 {
                color: #1e753f;
                margin-bottom: 10px;
                font-size: 24px;
            }
            .no-blog-results-message .no-results-content p {
                color: #666;
                font-size: 16px;
                margin-bottom: 25px;
            }
            .clear-filters-btn {
                background: #d14438;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            .clear-filters-btn:hover {
                background: #b83c32;
                transform: translateY(-2px);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = noResultsStyles;
        document.head.appendChild(styleSheet);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

function clearBlogFilters() {
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    
    // Trigger filter function to show all posts
    const event = new Event('input');
    if (searchInput) searchInput.dispatchEvent(event);
}

// Load More Functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentPage = 1;
    const postsPerPage = 8;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMorePosts();
        });
    }
    
    function loadMorePosts() {
        // Show loading state
        const originalText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            // Generate additional blog posts
            const blogGrid = document.getElementById('blogPostsGrid');
            const newPosts = generateMorePosts(currentPage + 1);
            
            newPosts.forEach(post => {
                blogGrid.appendChild(post);
            });
            
            currentPage++;
            
            // Reset button
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.disabled = false;
            
            // Hide load more button after 3 pages
            if (currentPage >= 3) {
                loadMoreBtn.style.display = 'none';
                showEndMessage();
            }
            
            showNotification('New posts loaded successfully!', 'success');
        }, 1500);
    }
    
    function generateMorePosts(page) {
        const additionalPosts = [
            {
                category: 'news',
                categoryClass: 'news',
                date: 'November 28, 2024',
                title: 'New Parish Opens in Gicumbi Sector',
                excerpt: 'We are pleased to announce the opening of a new parish in Gicumbi Sector to better serve our growing community...',
                author: 'Diocese Communications',
                icon: 'fas fa-church'
            },
            {
                category: 'spiritual',
                categoryClass: 'spiritual',
                date: 'November 25, 2024',
                title: 'Finding Peace in Times of Uncertainty',
                excerpt: 'In our modern world filled with challenges, finding inner peace becomes essential for our spiritual well-being...',
                author: 'Fr. Joseph Nkurunziza',
                icon: 'fas fa-peace'
            },
            {
                category: 'events',
                categoryClass: 'events',
                date: 'November 22, 2024',
                title: 'Annual Pilgrimage to Kibeho Announced',
                excerpt: 'Join us for our annual pilgrimage to the Shrine of Our Lady of Kibeho. Registration is now open for all faithful...',
                author: 'Pilgrimage Committee',
                icon: 'fas fa-route'
            },
            {
                category: 'youth',
                categoryClass: 'youth',
                date: 'November 20, 2024',
                title: 'Youth Sports Tournament Results',
                excerpt: 'Congratulations to all participants in our inter-parish youth sports tournament. The event promoted unity and fellowship...',
                author: 'Youth Sports Coordinator',
                icon: 'fas fa-trophy'
            }
        ];
        
        return additionalPosts.map(postData => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            article.setAttribute('data-category', postData.category);
            article.style.animation = 'fadeIn 0.5s ease';
            
            article.innerHTML = `
                <div class="post-image">
                    <div class="image-placeholder">
                        <i class="${postData.icon}"></i>
                    </div>
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="category ${postData.categoryClass}">${postData.category.charAt(0).toUpperCase() + postData.category.slice(1)}</span>
                        <span class="date">${postData.date}</span>
                    </div>
                    <h3 class="post-title">${postData.title}</h3>
                    <p class="post-excerpt">${postData.excerpt}</p>
                    <div class="post-footer">
                        <div class="author">
                            <i class="fas fa-user"></i>
                            <span>${postData.author}</span>
                        </div>
                        <a href="#" class="read-more">Read More</a>
                    </div>
                </div>
            `;
            
            return article;
        });
    }
    
    function showEndMessage() {
        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.innerHTML = `
            <div class="end-content">
                <i class="fas fa-check-circle"></i>
                <p>You've reached the end of our blog posts. Check back soon for more updates!</p>
            </div>
        `;
        
        const loadMoreSection = document.querySelector('.load-more-section');
        loadMoreSection.appendChild(endMessage);
        
        // Add styles
        const endStyles = `
            .end-message {
                text-align: center;
                padding: 30px;
                background: #f0f0f0;
                border-radius: 15px;
                margin-top: 20px;
            }
            .end-content i {
                font-size: 32px;
                color: #1e753f;
                margin-bottom: 15px;
            }
            .end-content p {
                color: #666;
                margin: 0;
                font-size: 16px;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = endStyles;
        document.head.appendChild(styleSheet);
    }
}

// Newsletter Subscription
function initializeNewsletterSubscription() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value;
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate subscription process
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Clear input
                emailInput.value = '';
                
                // Show success message
                showNotification(`Successfully subscribed ${email} to our newsletter!`, 'success');
            }, 2000);
        });
    }
}

// Read More Links
function initializeReadMoreLinks() {
    const readMoreLinks = document.querySelectorAll('.read-more, .read-more-btn');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const post = this.closest('.blog-post, .featured-post');
            const title = post.querySelector('.post-title, .featured-title').textContent;
            
            showBlogPostModal(title);
        });
    });
}

function showBlogPostModal(title) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'blog-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="blog-modal-content">
            <div class="blog-modal-header">
                <h3>${title}</h3>
                <button class="blog-modal-close">&times;</button>
            </div>
            <div class="blog-modal-body">
                <div class="modal-post-meta">
                    <span class="modal-author">
                        <i class="fas fa-user"></i>
                        Diocese Communications
                    </span>
                    <span class="modal-date">
                        <i class="fas fa-calendar"></i>
                        December 20, 2024
                    </span>
                    <span class="modal-reading-time">
                        <i class="fas fa-clock"></i>
                        5 min read
                    </span>
                </div>
                
                <div class="modal-post-image">
                    <div class="modal-image-placeholder">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                
                <div class="modal-post-content">
                    <p>This is a detailed view of the blog post. In a real implementation, this would contain the full article content retrieved from a database or content management system.</p>
                    
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    
                    <h4>Key Points</h4>
                    <ul>
                        <li>Important information about the diocese</li>
                        <li>Community involvement and participation</li>
                        <li>Spiritual growth and development</li>
                        <li>Upcoming events and activities</li>
                    </ul>
                    
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    
                    <blockquote>
                        "Faith is taking the first step even when you don't see the whole staircase." - Martin Luther King Jr.
                    </blockquote>
                    
                    <p>We encourage all members of our diocese to stay engaged with our community and participate in the various programs and activities we offer throughout the year.</p>
                </div>
                
                <div class="modal-post-footer">
                    <div class="share-buttons">
                        <h4>Share this post:</h4>
                        <div class="share-links">
                            <a href="#" class="share-link facebook">
                                <i class="fab fa-facebook"></i>
                                Facebook
                            </a>
                            <a href="#" class="share-link twitter">
                                <i class="fab fa-twitter"></i>
                                Twitter
                            </a>
                            <a href="#" class="share-link whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add modal styles
    const modalStyles = `
        .blog-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            overflow-y: auto;
            padding: 20px;
        }
        .blog-modal-content {
            background: white;
            border-radius: 15px;
            width: 100%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .blog-modal-header {
            padding: 25px;
            border-bottom: 1px solid #dcdcdc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1e753f;
            color: white;
            border-radius: 15px 15px 0 0;
        }
        .blog-modal-header h3 {
            margin: 0;
            font-size: 20px;
        }
        .blog-modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: white;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .blog-modal-body {
            padding: 30px;
        }
        .modal-post-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }
        .modal-post-meta span {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-size: 14px;
        }
        .modal-post-meta i {
            color: #1e753f;
        }
        .modal-post-image {
            margin-bottom: 25px;
        }
        .modal-image-placeholder {
            height: 300px;
            background: linear-gradient(135deg, #1e753f, #2a8f4f);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: rgba(255, 255, 255, 0.3);
        }
        .modal-post-content {
            line-height: 1.8;
            color: #333;
        }
        .modal-post-content h4 {
            color: #1e753f;
            margin: 25px 0 15px;
        }
        .modal-post-content ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        .modal-post-content li {
            margin-bottom: 8px;
        }
        .modal-post-content blockquote {
            background: #f0f0f0;
            border-left: 4px solid #1e753f;
            padding: 20px;
            margin: 25px 0;
            font-style: italic;
            color: #666;
        }
        .modal-post-footer {
            margin-top: 30px;
            padding-top: 25px;
            border-top: 1px solid #f0f0f0;
        }
        .share-buttons h4 {
            color: #1e753f;
            margin-bottom: 15px;
        }
        .share-links {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .share-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .share-link.facebook {
            background: #1877f2;
            color: white;
        }
        .share-link.twitter {
            background: #1da1f2;
            color: white;
        }
        .share-link.whatsapp {
            background: #25d366;
            color: white;
        }
        .share-link:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    // Close modal functionality
    const closeBtn = modalOverlay.querySelector('.blog-modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
        document.head.removeChild(styleSheet);
    });

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
            document.head.removeChild(styleSheet);
        }
    });
}

// Utility function for notifications (if not already defined)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#1e753f' : type === 'error' ? '#d14438' : '#f2c97e'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}
