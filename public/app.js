/* EcoCart Logistics CRM - Shared JavaScript Functions */

// Utility functions
function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'order_placed': 'Order Placed',
        'picked_up': 'Picked Up',
        'in_transit': 'In Transit',
        'out_for_delivery': 'Out for Delivery',
        'delivered': 'Delivered',
        'failed_delivery': 'Failed Delivery',
        'returned': 'Returned',
        'active': 'Active',
        'inactive': 'Inactive'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getStatusColor(status) {
    const colorMap = {
        'pending': '#ffc107',
        'picked_up': '#17a2b8',
        'in_transit': '#007bff',
        'out_for_delivery': '#6f42c1',
        'delivered': '#28a745',
        'failed_delivery': '#dc3545',
        'returned': '#fd7e14',
        'active': '#28a745',
        'inactive': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
}

// API helper functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Notification system
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        `;

        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
            </div>
        `;

        // Add click to close functionality
        notification.addEventListener('click', () => this.hide(notification));

        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }

        return notification;
    }

    hide(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getBackgroundColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }
}

// Initialize notification system
const notifications = new NotificationSystem();

// Loading overlay
class LoadingOverlay {
    constructor() {
        this.overlay = null;
    }

    show(message = 'Loading...') {
        this.hide(); // Remove any existing overlay

        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(2px);
        `;

        this.overlay.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4CAF50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem auto;
                "></div>
                <p style="margin: 0; color: #333; font-size: 1.1rem;">${message}</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        document.body.appendChild(this.overlay);
    }

    hide() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }
}

// Initialize loading overlay
const loading = new LoadingOverlay();

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Data export utilities
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        notifications.show('No data to export', 'warning');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(','))
    ].join('\n');

    downloadFile(csvContent, filename + '.csv', 'text/csv');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return defaultValue;
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }

    startTimer(name) {
        this.metrics[name] = performance.now();
    }

    endTimer(name) {
        if (this.metrics[name]) {
            const duration = performance.now() - this.metrics[name];
            console.log(`${name} took ${duration.toFixed(2)}ms`);
            delete this.metrics[name];
            return duration;
        }
        return 0;
    }

    measureFunction(fn, name) {
        return (...args) => {
            this.startTimer(name);
            const result = fn.apply(this, args);
            this.endTimer(name);
            return result;
        };
    }
}

// Initialize performance monitor
const perfMonitor = new PerformanceMonitor();

// Debounce utility for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality
function createSearchFilter(data, searchFields) {
    return function(searchTerm) {
        if (!searchTerm) return data;
        
        const term = searchTerm.toLowerCase();
        return data.filter(item => {
            return searchFields.some(field => {
                const value = item[field];
                if (value === null || value === undefined) return false;
                return value.toString().toLowerCase().includes(term);
            });
        });
    };
}

// Animation utilities
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(element.style.opacity) || 1;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(initialOpacity - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Error handling
function handleError(error, userMessage = 'An error occurred') {
    console.error('Error:', error);
    notifications.show(userMessage, 'error');
    
    // Report to analytics/monitoring service
    if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('Error', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
}

// Network status monitoring
class NetworkMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];
        
        window.addEventListener('online', () => this.handleStatusChange(true));
        window.addEventListener('offline', () => this.handleStatusChange(false));
    }

    handleStatusChange(isOnline) {
        this.isOnline = isOnline;
        this.listeners.forEach(listener => listener(isOnline));
        
        if (isOnline) {
            notifications.show('Connection restored', 'success', 3000);
        } else {
            notifications.show('No internet connection', 'warning', 0);
        }
    }

    onStatusChange(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }
}

// Initialize network monitor
const networkMonitor = new NetworkMonitor();

// Responsive design helpers
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
    }

    loadTheme() {
        return loadFromLocalStorage('theme', 'light');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        saveToLocalStorage('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        return newTheme;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Real-time updates simulation
class RealTimeUpdates {
    constructor() {
        this.subscribers = new Map();
        this.updateInterval = 30000; // 30 seconds
        this.intervalId = null;
    }

    subscribe(eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType).push(callback);
        
        // Start polling if this is the first subscription
        if (this.subscribers.size === 1 && !this.intervalId) {
            this.startPolling();
        }
    }

    unsubscribe(eventType, callback) {
        if (this.subscribers.has(eventType)) {
            const callbacks = this.subscribers.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) {
                this.subscribers.delete(eventType);
            }
        }
        
        // Stop polling if no more subscribers
        if (this.subscribers.size === 0 && this.intervalId) {
            this.stopPolling();
        }
    }

    startPolling() {
        this.intervalId = setInterval(() => {
            this.checkForUpdates();
        }, this.updateInterval);
    }

    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    async checkForUpdates() {
        try {
            // Simulate checking for updates
            const updates = await this.fetchUpdates();
            this.notifySubscribers(updates);
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }

    async fetchUpdates() {
        // This would typically fetch from a real-time API or WebSocket
        // For now, we'll simulate random updates
        const updateTypes = ['order_status', 'agent_location', 'performance_metrics'];
        const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
        
        return {
            type: randomType,
            data: {
                timestamp: new Date().toISOString(),
                message: `Simulated ${randomType} update`
            }
        };
    }

    notifySubscribers(update) {
        if (this.subscribers.has(update.type)) {
            this.subscribers.get(update.type).forEach(callback => {
                try {
                    callback(update.data);
                } catch (error) {
                    console.error('Error in update callback:', error);
                }
            });
        }
    }
}

// Initialize real-time updates
const realTimeUpdates = new RealTimeUpdates();

// Initialize global event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });

    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Loading...';
                
                // Re-enable after 5 seconds (fallback)
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Submit';
                }, 5000);
            }
        });
    });

    // Initialize tooltips (simple implementation)
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
});

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        document.body.removeChild(e.target._tooltip);
        delete e.target._tooltip;
    }
}

// Export utilities for use in other scripts
window.EcoCartUtils = {
    formatStatus,
    formatDate,
    formatCurrency,
    getStatusColor,
    apiRequest,
    notifications,
    loading,
    validateEmail,
    validatePhone,
    validateRequired,
    exportToCSV,
    saveToLocalStorage,
    loadFromLocalStorage,
    perfMonitor,
    debounce,
    createSearchFilter,
    handleError,
    networkMonitor,
    themeManager,
    realTimeUpdates,
    isMobile,
    isTablet,
    isDesktop
};