// Bishop Meeting Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMeetingForm();
    initializeDateValidation();
    initializeFormValidation();
});

// Meeting Form Initialization
function initializeMeetingForm() {
    const meetingForm = document.getElementById('meetingForm');
    
    if (meetingForm) {
        meetingForm.addEventListener('submit', handleMeetingSubmission);
    }
    
    // Set minimum date to today
    const preferredDateInput = document.getElementById('preferredDate');
    const alternativeDateInput = document.getElementById('alternativeDate');
    
    if (preferredDateInput) {
        const today = new Date().toISOString().split('T')[0];
        preferredDateInput.min = today;
        
        // Set minimum date to 3 days from now for better planning
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        preferredDateInput.min = threeDaysFromNow.toISOString().split('T')[0];
    }
    
    if (alternativeDateInput) {
        const today = new Date().toISOString().split('T')[0];
        alternativeDateInput.min = today;
    }
}

// Date Validation
function initializeDateValidation() {
    const preferredDateInput = document.getElementById('preferredDate');
    const alternativeDateInput = document.getElementById('alternativeDate');
    const preferredTimeSelect = document.getElementById('preferredTime');
    
    if (preferredDateInput) {
        preferredDateInput.addEventListener('change', function() {
            validateSelectedDate(this.value);
            updateAvailableTimeSlots(this.value);
        });
    }
    
    if (alternativeDateInput) {
        alternativeDateInput.addEventListener('change', function() {
            validateSelectedDate(this.value);
        });
    }
}

function validateSelectedDate(dateString) {
    if (!dateString) return;
    
    const selectedDate = new Date(dateString);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if it's Sunday (day 0)
    if (dayOfWeek === 0) {
        showNotification('Sunday meetings are by appointment only. Please call the office to arrange.', 'info');
    }
    
    // Check if it's Saturday afternoon (limited hours)
    if (dayOfWeek === 6) {
        showNotification('Saturday meetings are available only from 9:00 AM to 12:00 PM.', 'info');
    }
}

function updateAvailableTimeSlots(dateString) {
    const preferredTimeSelect = document.getElementById('preferredTime');
    if (!preferredTimeSelect || !dateString) return;
    
    const selectedDate = new Date(dateString);
    const dayOfWeek = selectedDate.getDay();
    
    // Clear existing options except the first one
    while (preferredTimeSelect.children.length > 1) {
        preferredTimeSelect.removeChild(preferredTimeSelect.lastChild);
    }
    
    let timeSlots = [];
    
    if (dayOfWeek === 0) { // Sunday
        timeSlots = [
            { value: 'appointment', text: 'By Appointment Only' }
        ];
    } else if (dayOfWeek === 6) { // Saturday
        timeSlots = [
            { value: '09:00', text: '9:00 AM' },
            { value: '10:00', text: '10:00 AM' },
            { value: '11:00', text: '11:00 AM' }
        ];
    } else { // Monday to Friday
        timeSlots = [
            { value: '09:00', text: '9:00 AM' },
            { value: '10:00', text: '10:00 AM' },
            { value: '11:00', text: '11:00 AM' },
            { value: '14:00', text: '2:00 PM' },
            { value: '15:00', text: '3:00 PM' },
            { value: '16:00', text: '4:00 PM' }
        ];
    }
    
    // Add time slots to select
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;
        option.textContent = slot.text;
        preferredTimeSelect.appendChild(option);
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('meetingForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Please select a future date.';
        }
    }
    
    // Purpose validation (minimum length)
    if (field.id === 'purpose' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Please provide more details about the purpose of your meeting.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#d14438';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #d14438;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#dcdcdc';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Handle Meeting Form Submission
function handleMeetingSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check required checkboxes
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        isFormValid = false;
        showNotification('Please accept the terms and conditions.', 'error');
    }
    
    if (!isFormValid) {
        showNotification('Please correct the errors in the form before submitting.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('.submit-meeting-btn');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showSuccessModal(formData);
        
        // Reset form
        form.reset();
        
        // Clear any remaining errors
        const errors = form.querySelectorAll('.field-error');
        errors.forEach(error => error.remove());
        
        // Reset field styles
        inputs.forEach(input => {
            input.style.borderColor = '#dcdcdc';
        });
        
    }, 2000);
}

function showSuccessModal(formData) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const preferredDate = formData.get('preferredDate');
    const preferredTime = formData.get('preferredTime');
    const meetingType = formData.get('meetingType');
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'success-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="success-modal-content">
            <div class="success-modal-header">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Meeting Request Submitted Successfully!</h3>
            </div>
            <div class="success-modal-body">
                <p>Dear ${firstName} ${lastName},</p>
                <p>Your meeting request has been received and will be reviewed by the Bishop's office.</p>
                
                <div class="request-summary">
                    <h4>Request Summary:</h4>
                    <ul>
                        <li><strong>Meeting Type:</strong> ${meetingType}</li>
                        <li><strong>Preferred Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</li>
                        <li><strong>Preferred Time:</strong> ${preferredTime}</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <ol>
                        <li>You will receive a confirmation email within 24-48 hours</li>
                        <li>The Bishop's office will review your request</li>
                        <li>You will be contacted to confirm the final appointment details</li>
                        <li>If your preferred time is not available, alternative times will be suggested</li>
                    </ol>
                </div>
                
                <div class="contact-reminder">
                    <p><strong>For urgent matters:</strong> Please call +250 788 123 456</p>
                </div>
            </div>
            <div class="success-modal-footer">
                <button class="close-success-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Add modal styles
    const modalStyles = `
        .success-modal-overlay {
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
            padding: 20px;
        }
        .success-modal-content {
            background: white;
            border-radius: 15px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }
        .success-modal-header {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #1e753f, #2a8f4f);
            color: white;
            border-radius: 15px 15px 0 0;
        }
        .success-icon {
            font-size: 48px;
            margin-bottom: 15px;
            color: #f2c97e;
        }
        .success-modal-header h3 {
            margin: 0;
            font-size: 24px;
        }
        .success-modal-body {
            padding: 30px;
        }
        .success-modal-body p {
            margin-bottom: 15px;
            color: #0f0f0f;
            line-height: 1.6;
        }
        .request-summary,
        .next-steps,
        .contact-reminder {
            margin: 25px 0;
            padding: 20px;
            background: #f0f0f0;
            border-radius: 10px;
        }
        .request-summary h4,
        .next-steps h4 {
            color: #1e753f;
            margin-bottom: 15px;
        }
        .request-summary ul,
        .next-steps ol {
            margin: 0;
            padding-left: 20px;
        }
        .request-summary li,
        .next-steps li {
            margin-bottom: 8px;
            color: #666;
        }
        .contact-reminder {
            background: #fff3cd;
            border-left: 4px solid #f2c97e;
        }
        .contact-reminder p {
            margin: 0;
            color: #856404;
        }
        .success-modal-footer {
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #f0f0f0;
        }
        .close-success-btn {
            background: #1e753f;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .close-success-btn:hover {
            background: #2a8f4f;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Close modal functionality
    const closeBtn = modalOverlay.querySelector('.close-success-btn');
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
