// Bug fixes and enhancements for Study Room Application
// Author: Shadi Sbaih

// Fix for potential timing issues in subject list rendering
export function debounce(func, wait) {
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

// Enhanced error handling
export function handleError(error, operation) {
    console.error(`Error in ${operation}:`, error);
    
    // User-friendly error messages
    const errorMessages = {
        'auth/popup-closed-by-user': 'تم إغلاق نافذة تسجيل الدخول. حاول مرة أخرى.',
        'auth/network-request-failed': 'فشل الاتصال بالشبكة. تحقق من اتصال الإنترنت.',
        'permission-denied': 'ليس لديك صلاحية للوصول لهذه البيانات.',
        'not-found': 'البيانات المطلوبة غير موجودة.',
        'default': 'حدث خطأ غير متوقع. حاول مرة أخرى.'
    };
    
    const message = errorMessages[error.code] || errorMessages['default'];
    showMessage(message, 'error');
}

// Show user messages
export function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at top of main content
    const main = document.querySelector('article') || document.body;
    main.insertBefore(message, main.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Enhanced form validation
export function validateSubjectName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'اسم المادة مطلوب' };
    }
    
    if (name.trim().length < 2) {
        return { valid: false, message: 'اسم المادة يجب أن يكون حرفين على الأقل' };
    }
    
    if (name.trim().length > 50) {
        return { valid: false, message: 'اسم المادة طويل جداً (أقصى حد 50 حرف)' };
    }
    
    // Check for invalid characters
    const invalidChars = /[<>\"'&]/;
    if (invalidChars.test(name)) {
        return { valid: false, message: 'اسم المادة يحتوي على رموز غير مسموحة' };
    }
    
    return { valid: true, message: '' };
}

// Check for duplicate subjects
export function checkDuplicateSubject(newSubjectName, existingSubjects) {
    const normalizedNew = newSubjectName.trim().toLowerCase();
    const isDuplicate = existingSubjects.some(subject => 
        subject.name.trim().toLowerCase() === normalizedNew
    );
    
    return isDuplicate;
}

// Local storage safety
export function safeLocalStorage() {
    return {
        getItem: (key) => {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('LocalStorage not available:', e);
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn('LocalStorage not available:', e);
                return false;
            }
        },
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('LocalStorage not available:', e);
                return false;
            }
        }
    };
}

// Network status check
export function checkNetworkStatus() {
    return navigator.onLine;
}

// Auto-save functionality
export function setupAutoSave(callback, interval = 30000) {
    if (!callback || typeof callback !== 'function') return;
    
    return setInterval(() => {
        if (checkNetworkStatus()) {
            callback();
        }
    }, interval);
}

// Performance monitoring
export function measurePerformance(label, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
}

// Keyboard shortcuts
export function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N: Add new subject
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const addBtn = document.getElementById('add-subject-btn');
            if (addBtn) addBtn.click();
        }
        
        // Escape: Close any open modal/form
        if (e.key === 'Escape') {
            const overlay = document.getElementById('form-overlay');
            if (overlay && overlay.style.display === 'block') {
                overlay.click();
            }
        }
    });
}

// Initialize enhanced features
export function initEnhancedFeatures() {
    setupKeyboardShortcuts();
    
    // Add loading states to buttons
    document.querySelectorAll('button[type="submit"], .form-submit').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-loading');
            setTimeout(() => {
                this.classList.remove('btn-loading');
            }, 2000);
        });
    });
}

// Browser compatibility check
export function checkBrowserSupport() {
    const requiredFeatures = [
        'localStorage',
        'fetch',
        'Promise',
        'addEventListener'
    ];
    
    const unsupported = requiredFeatures.filter(feature => {
        return !(feature in window);
    });
    
    if (unsupported.length > 0) {
        showMessage(
            `متصفحك لا يدعم بعض الميزات المطلوبة: ${unsupported.join(', ')}. 
            يرجى تحديث المتصفح للحصول على أفضل تجربة.`, 
            'error'
        );
        return false;
    }
    
    return true;
}
