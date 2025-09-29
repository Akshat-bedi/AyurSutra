// Enhanced JavaScript with Chatbot Integration and Improved Authentication - AyurSutra

// ===== GLOBAL VARIABLES =====
let currentTherapy = 'vamana';
let isMenuOpen = false;
let isChatbotOpen = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZATION =====
function initializeApp() {
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeProgressChart();
    initializeIntersectionObserver();
    initializeTherapyTabs();
    initializeForms();
    initializeChatbot();
    initializeAuthSystem();
    enhanceModals();
}

// ===== CHATBOT INTEGRATION =====
function initializeChatbot() {
    // Create chatbot toggle button
    const chatbotToggle = document.createElement('button');
    chatbotToggle.className = 'chatbot-toggle';
    chatbotToggle.innerHTML = '💬';
    chatbotToggle.setAttribute('aria-label', 'Open AyurBot Assistant');
    chatbotToggle.title = 'Chat with AyurBot - Your Ayurvedic Assistant';
    
    // Add floating animation and glow effect
    chatbotToggle.addEventListener('mouseenter', () => {
        chatbotToggle.style.transform = 'scale(1.15)';
        chatbotToggle.style.boxShadow = '0 8px 30px rgba(76, 175, 80, 0.5)';
    });
    
    chatbotToggle.addEventListener('mouseleave', () => {
        chatbotToggle.style.transform = 'scale(1)';
        chatbotToggle.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.3)';
    });
    
    chatbotToggle.addEventListener('click', toggleChatbot);
    document.body.appendChild(chatbotToggle);
    
    // Create chatbot container
    createChatbotInterface();
    
    // Show welcome notification after delay
    setTimeout(() => {
        if (!getCookie('chatbot_welcomed')) {
            showChatbotNotification();
            setCookie('chatbot_welcomed', 'true', 7);
        }
    }, 3000);
}

function createChatbotInterface() {
    const chatbotHTML = `
        <div id="chatbot-container" class="chatbot-overlay" style="display: none;">
            <div class="chatbot-container">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="bot-avatar">
                        <div class="avatar-icon">🤖</div>
                        <div class="status-indicator"></div>
                    </div>
                    <div class="bot-info">
                        <h3>AyurBot</h3>
                        <p>Your Ayurvedic Wellness Assistant</p>
                    </div>
                    <button class="close-button" onclick="toggleChatbot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Messages Area -->
                <div class="messages-container" id="chatbot-messages">
                    <div class="message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <div class="message-bubble">
                                <div class="message-text">🙏 Namaste! I'm AyurBot, your Ayurvedic wellness assistant at AyurSutra. How can I help you today?</div>
                                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="quick-actions">
                        <p class="quick-actions-title">Choose a topic to get started:</p>
                        <div class="quick-actions-grid">
                            <button class="quick-action-button" onclick="handleQuickAction('dosha')">
                                <span class="action-icon">🧘</span>
                                <span class="action-text">Find my Dosha</span>
                            </button>
                            <button class="quick-action-button" onclick="handleQuickAction('remedies')">
                                <span class="action-icon">💊</span>
                                <span class="action-text">Natural Remedies</span>
                            </button>
                            <button class="quick-action-button" onclick="handleQuickAction('booking')">
                                <span class="action-icon">📅</span>
                                <span class="action-text">Book Therapy</span>
                            </button>
                            <button class="quick-action-button" onclick="handleQuickAction('diet')">
                                <span class="action-icon">🥗</span>
                                <span class="action-text">Diet Advice</span>
                            </button>
                            <button class="quick-action-button" onclick="handleQuickAction('herbs')">
                                <span class="action-icon">🌿</span>
                                <span class="action-text">Herb Guide</span>
                            </button>
                            <button class="quick-action-button" onclick="handleQuickAction('faq')">
                                <span class="action-icon">❓</span>
                                <span class="action-text">FAQ</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="input-container">
                    <div class="input-wrapper">
                        <textarea
                            id="chatbot-input"
                            placeholder="Ask me about Ayurveda, book therapies, or get wellness advice..."
                            class="message-input"
                            rows="1"
                            onkeypress="handleChatbotKeyPress(event)"
                        ></textarea>
                        <button class="send-button" onclick="sendChatMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="input-footer">
                        <span class="disclaimer">
                            🌿 For serious health concerns, please consult with our certified practitioners at AyurSutra
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    
    isChatbotOpen = !isChatbotOpen;
    
    if (isChatbotOpen) {
        chatbotContainer.style.display = 'flex';
        chatbotToggle.style.display = 'none';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);
    } else {
        chatbotContainer.style.display = 'none';
        chatbotToggle.style.display = 'flex';
        document.body.style.overflow = 'auto';
    }
}

function handleQuickAction(action) {
    const userMessage = getQuickActionText(action);
    addChatMessage(userMessage, 'user');
    hideQuickActions();
    
    setTimeout(() => {
        const botResponse = getBotResponse(action);
        addChatMessage(botResponse.text, 'bot', botResponse.followUp);
    }, 1000);
}

function getQuickActionText(action) {
    const actionTexts = {
        'dosha': 'Find my Dosha',
        'remedies': 'Natural Remedies',
        'booking': 'Book Therapy',
        'diet': 'Diet Advice',
        'herbs': 'Herb Guide',
        'faq': 'FAQ'
    };
    return actionTexts[action] || action;
}

function getBotResponse(action) {
    const responses = {
        'dosha': {
            text: "I'd love to help you discover your Dosha! Your Dosha (Vata, Pitta, or Kapha) determines your unique constitution. There are three types:\n\n🌬️ **Vata** - Air & Space (Creative, energetic)\n🔥 **Pitta** - Fire & Water (Focused, driven)\n🌍 **Kapha** - Earth & Water (Calm, steady)\n\nWould you like to start a quick assessment? 🌟",
            followUp: ['Start Dosha Quiz', 'Learn about Doshas', 'Book consultation']
        },
        'remedies': {
            text: "Ayurveda offers wonderful natural remedies! What specific condition would you like help with? Here are some common ones:",
            followUp: ['Digestive issues', 'Stress & anxiety', 'Sleep problems', 'Joint pain', 'Skin concerns']
        },
        'booking': {
            text: "Excellent choice! Our AyurSutra Panchakarma therapies can transform your wellness journey. Which therapy interests you? 🌸",
            followUp: ['Abhyanga (Oil Massage)', 'Shirodhara (Oil Pouring)', 'Swedana (Steam Therapy)', 'Basti (Medicated Enema)', 'See all therapies']
        },
        'diet': {
            text: "Ayurvedic nutrition is personalized based on your Dosha! Tell me about your concerns:",
            followUp: ['Weight management', 'Digestive health', 'Energy levels', 'Seasonal eating', 'Food combinations']
        },
        'herbs': {
            text: "Ayurvedic herbs are nature's pharmacy! Which category interests you? 🌱",
            followUp: ['Immunity boosters', 'Stress relievers', 'Digestive aids', 'Beauty herbs', 'Energy enhancers']
        },
        'faq': {
            text: "Here are answers to common questions about Ayurveda and our AyurSutra services:",
            followUp: ['What is Panchakarma?', 'How long is treatment?', 'Is it safe?', 'Pricing information', 'Contact specialist']
        }
    };
    
    return responses[action] || {
        text: "I'm here to help with your Ayurvedic wellness journey at AyurSutra! How can I assist you today?",
        followUp: []
    };
}

function handleChatbotKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    hideQuickActions();
    
    // Show typing indicator
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addChatMessage(response.text, 'bot', response.followUp);
    }, 1500);
}

function addChatMessage(text, sender, followUp = null) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageHTML = `
        <div class="message ${sender}-message">
            ${sender === 'bot' ? '<div class="message-avatar">🤖</div>' : ''}
            <div class="message-content">
                <div class="message-bubble">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${timestamp}</div>
                </div>
                ${followUp ? createFollowUpButtons(followUp) : ''}
            </div>
            ${sender === 'user' ? '<div class="message-avatar user-avatar">👤</div>' : ''}
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollChatToBottom();
}

function createFollowUpButtons(followUp) {
    const buttons = followUp.map(text => 
        `<button class="follow-up-button" onclick="handleFollowUp('${text}')">${text}</button>`
    ).join('');
    
    return `<div class="follow-up-actions">${buttons}</div>`;
}

function handleFollowUp(text) {
    addChatMessage(text, 'user');
    hideQuickActions();
    
    setTimeout(() => {
        const response = generateBotResponse(text);
        addChatMessage(response.text, 'bot', response.followUp);
    }, 1000);
}

function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detailed responses for specific queries
    const responses = {
        'digestive issues': {
            text: "For digestive harmony, try these Ayurvedic remedies:\n\n🫖 **Ginger Tea**: Boosts Agni (digestive fire)\n🌿 **Triphala**: Gentle detox and regularity\n🥄 **Cumin-Coriander-Fennel Tea**: Reduces bloating\n🍯 **Warm water with honey & lemon**: Morning detox\n\nWould you like specific recipes or want to book a consultation at AyurSutra?",
            followUp: ['Get recipes', 'Book consultation', 'More remedies']
        },
        'stress & anxiety': {
            text: "Ayurveda views stress as Vata imbalance. Here's your calming toolkit:\n\n🧘 **Pranayama**: Deep breathing exercises\n💆 **Abhyanga**: Self-massage with warm oil\n🌿 **Ashwagandha**: Adaptogenic herb for stress\n🛁 **Warm baths with Epsom salt**: Evening ritual\n🎵 **Meditation**: 10-15 minutes daily\n\nShall I guide you through a quick breathing exercise?",
            followUp: ['Breathing exercise', 'Meditation guide', 'Book therapy']
        },
        'what is panchakarma?': {
            text: "Panchakarma is Ayurveda's ultimate detox and rejuvenation program! 🌟\n\n**5 Main Therapies:**\n1. **Vamana** - Therapeutic vomiting\n2. **Virechana** - Purgation therapy\n3. **Basti** - Medicated enemas\n4. **Nasya** - Nasal administration\n5. **Raktamokshana** - Blood purification\n\n**Benefits:**\n✨ Deep detoxification\n💪 Improved immunity\n🧠 Mental clarity\n⚡ Increased energy\n\nReady to start your transformation journey with AyurSutra?",
            followUp: ['Book consultation', 'Learn more', 'See packages']
        }
    };
    
    // Check for specific responses
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Keyword-based responses
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        return {
            text: "I'd be happy to help you book an appointment at AyurSutra! 📅\n\nOur available services:\n🌿 Consultation with Ayurvedic doctor\n💆 Panchakarma therapies\n🧘 Yoga & meditation sessions\n📚 Lifestyle counseling\n\nWhich service interests you?",
            followUp: ['Doctor consultation', 'Panchakarma package', 'Yoga sessions']
        };
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return {
            text: "Our AyurSutra therapy packages are designed to be accessible: 💰\n\n🌟 **Basic Consultation**: ₹1,500\n🌸 **Panchakarma (3 days)**: ₹12,000\n🌺 **Complete Package (7 days)**: ₹28,000\n💎 **Luxury Retreat (14 days)**: ₹55,000\n\n*Prices include consultation, therapies, medicines & meals*\n\nWould you like to know more about any package?",
            followUp: ['Package details', 'Book now', 'Payment options']
        };
    } else if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
        return {
            text: "We're located in the heart of Kerala, India's Ayurveda capital! 📍\n\n🏥 **AyurSutra Wellness Center**\nKumarakom, Kottayam District\nKerala, India 686563\n\n📞 Phone: +91-9876543210\n📧 Email: info@ayursutra.com\n\n🚗 Free pickup available from Cochin Airport\n🏨 On-site accommodation available\n\nNeed directions or transport arrangement?",
            followUp: ['Get directions', 'Book transport', 'Accommodation options']
        };
    } else if (lowerMessage.includes('thank')) {
        return {
            text: "You're most welcome! 🙏 It's my pleasure to help you on your wellness journey with AyurSutra. Remember, Ayurveda is about creating harmony between mind, body, and spirit.\n\nIs there anything else I can assist you with today?",
            followUp: ['Book appointment', 'More questions', 'End chat']
        };
    }
    
    // Default response
    return {
        text: "I understand you're interested in Ayurvedic wellness! While I may not have a specific answer to that question, I can help with:\n\n🌿 Dosha assessment & constitution analysis\n💊 Natural remedies for common ailments\n📅 Booking Panchakarma therapies\n🥗 Personalized diet recommendations\n🧘 Lifestyle guidance based on Ayurvedic principles\n\nWhat would you like to explore at AyurSutra?",
        followUp: ['Find my Dosha', 'Natural remedies', 'Book therapy', 'Diet advice']
    };
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingHTML = `
        <div class="message bot-message typing-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span class="typing-text">AyurBot is typing...</span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    scrollChatToBottom();
}

function hideTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

function hideQuickActions() {
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.style.display = 'none';
    }
}

function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showChatbotNotification() {
    const notification = document.createElement('div');
    notification.className = 'chatbot-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-avatar">🤖</div>
            <div class="notification-text">
                <strong>Hi! I'm AyurBot from AyurSutra</strong>
                <p>Ask me about Ayurvedic remedies, book therapies, or get wellness advice!</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #66BB6A);
        color: white;
        padding: 16px;
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        max-width: 300px;
        z-index: 9998;
        animation: notification-slide-in 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'notification-slide-out 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 8000);
}

// ===== ENHANCED AUTHENTICATION SYSTEM =====
function initializeAuthSystem() {
    // Check for existing session
    checkAuthState();
    
    // Initialize password toggle functionality
    initializePasswordToggles();
    
    // Initialize social login buttons
    initializeSocialLogin();
    
    // Initialize form validation
    initializeFormValidation();
}

function initializePasswordToggles() {
    // Add password toggle buttons to password fields
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('password-toggle')) {
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'password-toggle';
            toggle.innerHTML = '<i class="fas fa-eye"></i>';
            toggle.onclick = () => togglePasswordVisibility(field, toggle);
            
            field.parentNode.appendChild(toggle);
        }
    });
}

function togglePasswordVisibility(field, button) {
    const isPassword = field.type === 'password';
    field.type = isPassword ? 'text' : 'password';
    button.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    
    // Add animation
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function initializeSocialLogin() {
    // Add social login options to forms
    const forms = document.querySelectorAll('.modal-form');
    forms.forEach(form => {
        if (!form.querySelector('.social-login')) {
            const socialHTML = `
                <div class="social-login">
                    <div class="social-divider">
                        <span>or continue with</span>
                    </div>
                    <div class="social-buttons">
                        <button type="button" class="social-btn google" onclick="socialLogin('google')">
                            <i class="fab fa-google"></i>
                        </button>
                        <button type="button" class="social-btn facebook" onclick="socialLogin('facebook')">
                            <i class="fab fa-facebook-f"></i>
                        </button>
                        <button type="button" class="social-btn apple" onclick="socialLogin('apple')">
                            <i class="fab fa-apple"></i>
                        </button>
                    </div>
                </div>
            `;
            
            const submitButton = form.querySelector('.btn-primary');
            submitButton.insertAdjacentHTML('afterend', socialHTML);
        }
    });
}

function socialLogin(provider) {
    // Simulate social login
    showLoadingState(`Connecting to ${provider}...`);
    
    setTimeout(() => {
        hideLoadingState();
        showNotification(`${provider} login will be available soon in AyurSutra!`, 'info');
    }, 2000);
}

function initializeFormValidation() {
    const forms = document.querySelectorAll('.modal-form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const isRequired = field.hasAttribute('required');
    
    clearFieldError(field);
    
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (type === 'password' && value) {
        if (value.length < 8) {
            showFieldError(field, 'Password must be at least 8 characters');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: #f44336;
        font-size: 12px;
        margin-top: 4px;
        animation: shake 0.3s ease-in-out;
    `;
    
    field.parentNode.appendChild(error);
    field.style.borderColor = '#f44336';
}

function clearFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    field.style.borderColor = '';
}

function checkAuthState() {
    const token = localStorage.getItem('auth_token');
    if (token) {
        // Update UI for logged-in state
        updateAuthUI(true);
    }
}

function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        if (isLoggedIn) {
            authButtons.innerHTML = `
                <button class="btn-secondary" onclick="showUserMenu()">
                    <i class="fas fa-user"></i> Profile
                </button>
                <button class="btn-primary" onclick="logout()">Logout</button>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="btn-secondary" onclick="openModal('login')">Login</button>
                <button class="btn-primary" onclick="openModal('signup')">Sign Up</button>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    updateAuthUI(false);
    showNotification('You have been logged out successfully from AyurSutra', 'success');
}

// ===== ENHANCED MODAL FUNCTIONS =====
function enhanceModals() {
    // Add enhanced animations and interactions to existing modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        // Add backdrop click to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const modalId = modal.id.replace('Modal', '');
                closeModal(modalId);
            }
        });
        
        // Add escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                const modalId = modal.id.replace('Modal', '');
                closeModal(modalId);
            }
        });
    });
}

// Enhanced form submission with validation
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors below', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Simulate successful response
        const isLogin = form.closest('#loginModal');
        const isSignup = form.closest('#signupModal');
        
        if (isLogin) {
            // Store auth token
            localStorage.setItem('auth_token', 'demo_token_' + Date.now());
            localStorage.setItem('user_data', JSON.stringify({
                email: formData.get('email'),
                name: 'Demo User'
            }));
            
            updateAuthUI(true);
            showNotification('Welcome back to AyurSutra! Login successful.', 'success');
        } else if (isSignup) {
            // Store auth token
            localStorage.setItem('auth_token', 'demo_token_' + Date.now());
            localStorage.setItem('user_data', JSON.stringify({
                email: formData.get('email'),
                name: formData.get('name')
            }));
            
            updateAuthUI(true);
            showNotification('Account created successfully! Welcome to AyurSutra.', 'success');
        }
        
        // Reset form and close modal
        form.reset();
        const modal = form.closest('.modal');
        if (modal) {
            const modalId = modal.id.replace('Modal', '');
            closeModal(modalId);
        }
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
    }, 2000);
}

// ===== NAVIGATION FUNCTIONS =====
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            updateActiveNavLink(link);
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 248, 225, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(46, 125, 50, 0.1)';
    } else {
        header.style.background = 'rgba(255, 248, 225, 0.95)';
        header.style.boxShadow = 'none';
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 70;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '70px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'var(--cream)';
        navMenu.style.boxShadow = '0 5px 15px var(--shadow)';
        navMenu.style.padding = 'var(--spacing-md)';
        navMenu.style.zIndex = '1000';
        
        hamburger.classList.add('active');
    } else {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Floating cards animation
    animateFloatingCards();
    
    // Particle animation
    createFloatingParticles();
    
    // Lotus animation
    animateLotus();
}

function animateFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 15px 40px rgba(46, 125, 50, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 30px rgba(46, 125, 50, 0.1)';
        });
    });
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: var(--light-green);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: particle-float ${Math.random() * 20 + 15}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        particleContainer.appendChild(particle);
    }
}

function animateLotus() {
    const lotus = document.querySelector('.lotus-animation');
    if (lotus) {
        lotus.addEventListener('mouseenter', () => {
            lotus.style.transform = 'scale(1.1)';
            lotus.style.filter = 'drop-shadow(0 0 20px var(--secondary-green))';
        });
        
        lotus.addEventListener('mouseleave', () => {
            lotus.style.transform = 'scale(1)';
            lotus.style.filter = 'none';
        });
    }
}

// ===== COUNTERS =====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== PROGRESS CHART =====
function initializeProgressChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Sample data for demo
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Overall Health',
                data: [65, 72, 78, 85],
                color: '#2E7D32'
            },
            {
                label: 'Sleep Quality',
                data: [70, 75, 85, 92],
                color: '#4CAF50'
            },
            {
                label: 'Energy Levels',
                data: [60, 68, 72, 78],
                color: '#81C784'
            }
        ]
    };

    drawChart(ctx, data, canvas.width, canvas.height);
}

function drawChart(ctx, data, width, height) {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw data lines
    data.datasets.forEach((dataset, index) => {
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        dataset.data.forEach((value, i) => {
            const x = padding + (chartWidth / (data.labels.length - 1)) * i;
            const y = padding + chartHeight - (value / 100) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw points
            ctx.fillStyle = dataset.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '12px var(--font-primary)';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, i) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * i;
        ctx.fillText(label, x, height - 10);
    });
}

// ===== INTERSECTION OBSERVER =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ===== THERAPY TABS =====
function initializeTherapyTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const therapyName = tab.textContent.toLowerCase();
            showTherapy(therapyName);
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function showTherapy(therapyName) {
    // Hide all panels
    document.querySelectorAll('.therapy-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Show selected panel
    const selectedPanel = document.getElementById(therapyName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
        currentTherapy = therapyName;
        
        // Animate panel entrance
        selectedPanel.style.opacity = '0';
        selectedPanel.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            selectedPanel.style.transition = 'all 0.5s ease';
            selectedPanel.style.opacity = '1';
            selectedPanel.style.transform = 'translateX(0)';
        }, 50);
    }
}

// ===== MODAL FUNCTIONS =====
function openModal(modalType) {
    const modal = document.getElementById(`${modalType}Modal`);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Animate modal entrance
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.7) translateY(-50px)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transition = 'all 0.3s ease';
            modalContent.style.transform = 'scale(1) translateY(0)';
            modalContent.style.opacity = '1';
        }, 50);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalType) {
    const modal = document.getElementById(`${modalType}Modal`);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.7) translateY(-50px)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// ===== FORM HANDLING =====
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Initialize floating labels
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
        });
    });
}

function handleInputFocus(e) {
    const input = e.target;
    const label = input.nextElementSibling;
    if (label && label.tagName === 'LABEL') {
        label.style.transform = 'translateY(-25px) translateX(-10px) scale(0.8)';
        label.style.color = 'var(--primary-green)';
    }
}

function handleInputBlur(e) {
    const input = e.target;
    const label = input.nextElementSibling;
    if (label && label.tagName === 'LABEL' && !input.value) {
        label.style.transform = 'translateY(0) translateX(0) scale(1)';
        label.style.color = 'var(--earth-brown)';
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--white);
        color: var(--dark-gray);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        box-shadow: 0 10px 30px var(--shadow-dark);
        z-index: var(--z-tooltip);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        border-left: 4px solid var(--${type === 'success' ? 'secondary-green' : type === 'error' ? 'saffron' : 'primary-green'});
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ===== UTILITY FUNCTIONS =====
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showLoadingState(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="lotus-loader">🪷</div>
            <p>${message}</p>
        </div>
    `;
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(46, 125, 50, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        color: white;
        font-family: var(--font-primary);
    `;
    
    document.body.appendChild(loader);
}

function hideLoadingState() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.remove();
    }
}

// Add CSS animations for new features
const additionalStyles = `
    <style>
    @keyframes notification-slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes notification-slide-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .lotus-loader {
        font-size: 3rem;
        animation: lotus-spin 2s ease-in-out infinite;
    }
    
    @keyframes lotus-spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .chatbot-notification {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .chatbot-notification:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-avatar {
        font-size: 24px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}