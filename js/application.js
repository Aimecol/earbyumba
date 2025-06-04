// Certificate Application Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get certificate type from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const certificateType = urlParams.get('type');
    
    if (certificateType) {
        // Load the application form for the specified certificate type
        loadApplicationForm(certificateType);
    } else {
        // Show certificate selection if no type specified
        showCertificateSelection();
    }
});

// Load Application Form
function loadApplicationForm(certificateType) {
    const container = document.getElementById('applicationFormContainer');
    const certificateInfo = getCertificateInfo(certificateType);
    
    // Update page title and description
    updatePageHeader(certificateType);
    
    // Create the application form
    container.innerHTML = `
        <div class="application-form-wrapper">
            <!-- Application Progress -->
            <div class="application-progress">
                <div class="progress-step active" data-step="1">
                    <div class="step-number">1</div>
                    <span>Application Details</span>
                </div>
                <div class="progress-step" data-step="2">
                    <div class="step-number">2</div>
                    <span>Review & Submit</span>
                </div>
            </div>
            
            <!-- Certificate Information Panel -->
            <div class="certificate-info-panel">
                <div class="certificate-header">
                    <div class="certificate-icon">
                        <i class="${certificateInfo.icon}"></i>
                    </div>
                    <div class="certificate-details">
                        <h3>${certificateType}</h3>
                        <p>Complete the application form below</p>
                    </div>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Processing Time</strong>
                            <span>${certificateInfo.processingTime}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <div>
                            <strong>Application Fee</strong>
                            <span>${certificateInfo.fee} (Pay after approval)</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-file-alt"></i>
                        <div>
                            <strong>Required Documents</strong>
                            <span>${certificateInfo.documents.length} items</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Application Form -->
            <form class="certificate-application-form" id="certificateApplicationForm">
                <!-- Step 1: Application Details -->
                <div class="form-step active" data-step="1">
                    <h4 class="step-title">
                        <i class="fas fa-user"></i>
                        Personal Information
                    </h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="dateOfBirth">Date of Birth *</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" required>
                        </div>
                        <div class="form-group">
                            <label for="placeOfBirth">Place of Birth *</label>
                            <input type="text" id="placeOfBirth" name="placeOfBirth" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nationalId">National ID Number *</label>
                            <input type="text" id="nationalId" name="nationalId" required placeholder="1234567890123456">
                        </div>
                        <div class="form-group">
                            <label for="gender">Gender *</label>
                            <select id="gender" name="gender" required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" required placeholder="+250 788 123 456">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Current Address *</label>
                        <textarea id="address" name="address" rows="3" required placeholder="Province, District, Sector, Cell, Village"></textarea>
                    </div>
                    
                    <!-- Communication Preferences -->
                    <div class="communication-preferences">
                        <h5><i class="fas fa-bell"></i> Payment Code Notification Preferences</h5>
                        <p class="preference-description">Choose how you would like to receive your payment code after application approval:</p>
                        <div class="preference-options">
                            <label class="preference-option">
                                <input type="checkbox" name="notificationMethod" value="email" checked>
                                <span class="checkmark"></span>
                                <div class="option-content">
                                    <i class="fas fa-envelope"></i>
                                    <span>Email Notification</span>
                                    <small>Receive payment code via email</small>
                                </div>
                            </label>
                            <label class="preference-option">
                                <input type="checkbox" name="notificationMethod" value="sms">
                                <span class="checkmark"></span>
                                <div class="option-content">
                                    <i class="fas fa-sms"></i>
                                    <span>SMS Notification</span>
                                    <small>Receive payment code via SMS</small>
                                </div>
                            </label>
                            <label class="preference-option">
                                <input type="checkbox" name="notificationMethod" value="phone">
                                <span class="checkmark"></span>
                                <div class="option-content">
                                    <i class="fas fa-phone"></i>
                                    <span>Phone Call</span>
                                    <small>Receive payment code via phone call</small>
                                </div>
                            </label>
                        </div>
                        <div class="preference-note">
                            <i class="fas fa-info-circle"></i>
                            <span>You can select multiple notification methods. At least one method must be selected.</span>
                        </div>
                    </div>
                    
                    <!-- Certificate-specific fields -->
                    ${getCertificateSpecificFields(certificateType)}
                    
                    <!-- Documents Section -->
                    <div class="documents-section">
                        <h4 class="section-title">
                            <i class="fas fa-file-upload"></i>
                            Required Documents
                        </h4>
                        
                        <div class="documents-info">
                            <p>Please upload the following documents for your ${certificateType} application:</p>
                            <ul class="required-documents-list">
                                ${certificateInfo.documents.map(doc => `<li><i class="fas fa-check"></i> ${doc}</li>`).join('')}
                            </ul>
                            <div class="upload-progress-summary">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="uploadProgressFill" style="width: 0%"></div>
                                </div>
                                <span class="progress-text" id="uploadProgressText">0 of ${certificateInfo.documents.length} documents uploaded</span>
                            </div>
                        </div>
                        
                        <div class="document-uploads">
                            ${certificateInfo.documents.map((doc, index) => `
                                <div class="upload-group">
                                    <label for="document${index}">${doc} *</label>
                                    <div class="file-upload-area" data-upload="${index}">
                                        <input type="file" id="document${index}" name="document${index}" accept=".pdf,.jpg,.jpeg,.png" required>
                                        <div class="upload-placeholder">
                                            <i class="fas fa-cloud-upload-alt"></i>
                                            <span>Click to upload or drag and drop</span>
                                            <small>PDF, JPG, PNG (Max 5MB)</small>
                                        </div>
                                        <div class="upload-preview" style="display: none;">
                                            <i class="fas fa-file"></i>
                                            <span class="file-name"></span>
                                            <button type="button" class="remove-file">×</button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Step 2: Review -->
                <div class="form-step" data-step="2">
                    <h4 class="step-title">
                        <i class="fas fa-check-circle"></i>
                        Review & Submit
                    </h4>
                    
                    <div class="application-review">
                        <div class="review-section">
                            <h5>Personal Information</h5>
                            <div class="review-content" id="reviewPersonalInfo">
                                <!-- Will be populated dynamically -->
                            </div>
                        </div>
                        
                        <div class="review-section">
                            <h5>Documents</h5>
                            <div class="review-content" id="reviewDocuments">
                                <!-- Will be populated dynamically -->
                            </div>
                        </div>
                        
                        <div class="review-section">
                            <h5>Notification Preferences</h5>
                            <div class="review-content" id="reviewNotifications">
                                <!-- Will be populated dynamically -->
                            </div>
                        </div>
                        
                        <div class="payment-info-section">
                            <div class="payment-info-card">
                                <div class="payment-info-header">
                                    <i class="fas fa-info-circle"></i>
                                    <h5>Payment Information</h5>
                                </div>
                                <div class="payment-info-content">
                                    <p><strong>Application Fee:</strong> ${certificateInfo.fee}</p>
                                    <p><strong>Payment Process:</strong></p>
                                    <ol>
                                        <li>Submit your application with required documents</li>
                                        <li>Wait for application review and approval</li>
                                        <li>Receive payment code via your selected notification method(s)</li>
                                        <li>Make payment using the provided code</li>
                                        <li>Submit payment confirmation to complete the process</li>
                                    </ol>
                                    <div class="payment-note">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <span>Payment is only required after your application is approved and you receive the payment code.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="terms-agreement">
                        <label class="checkbox-label">
                            <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="#terms" target="_blank">Terms and Conditions</a> and confirm that all information provided is accurate *
                        </label>
                    </div>
                </div>
                
                <!-- Form Navigation -->
                <div class="form-navigation">
                    <button type="button" class="nav-btn prev-btn" id="prevBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i>
                        Previous
                    </button>
                    <button type="button" class="nav-btn next-btn" id="nextBtn">
                        Next
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button type="submit" class="nav-btn submit-btn" id="submitBtn" style="display: none;">
                        <i class="fas fa-paper-plane"></i>
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Initialize the form functionality
    initializeApplicationForm(certificateType);
}

// Update Page Header
function updatePageHeader(certificateType) {
    const pageTitle = document.querySelector('.page-title');
    const pageDescription = document.querySelector('.page-description');
    
    if (pageTitle) {
        pageTitle.textContent = `${certificateType} Application`;
    }
    
    if (pageDescription) {
        pageDescription.textContent = `Complete the form below to apply for your ${certificateType}`;
    }
    
    // Update document title
    document.title = `${certificateType} Application - Diocese of Byumba`;
}

// Show Certificate Selection
function showCertificateSelection() {
    const container = document.getElementById('applicationFormContainer');
    
    container.innerHTML = `
        <div class="certificate-selection">
            <h3>Select Certificate Type</h3>
            <p>Choose the type of certificate you would like to apply for:</p>
            
            <div class="certificate-types-grid">
                <div class="certificate-type-card" data-type="Baptism Certificate">
                    <div class="certificate-icon">
                        <i class="fas fa-cross"></i>
                    </div>
                    <h4>Baptism Certificate</h4>
                    <p>Official record of baptism</p>
                    <span class="fee">RWF 2,000</span>
                </div>
                
                <div class="certificate-type-card" data-type="Confirmation Certificate">
                    <div class="certificate-icon">
                        <i class="fas fa-hands-praying"></i>
                    </div>
                    <h4>Confirmation Certificate</h4>
                    <p>Official record of confirmation</p>
                    <span class="fee">RWF 2,500</span>
                </div>
                
                <div class="certificate-type-card" data-type="Marriage Certificate">
                    <div class="certificate-icon">
                        <i class="fas fa-ring"></i>
                    </div>
                    <h4>Marriage Certificate</h4>
                    <p>Official record of marriage</p>
                    <span class="fee">RWF 5,000</span>
                </div>
                
                <div class="certificate-type-card" data-type="Ordination Certificate">
                    <div class="certificate-icon">
                        <i class="fas fa-church"></i>
                    </div>
                    <h4>Ordination Certificate</h4>
                    <p>Official record of ordination</p>
                    <span class="fee">RWF 10,000</span>
                </div>
                
                <div class="certificate-type-card" data-type="Membership Certificate">
                    <div class="certificate-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h4>Membership Certificate</h4>
                    <p>Parish membership record</p>
                    <span class="fee">RWF 1,500</span>
                </div>
                
                <div class="certificate-type-card" data-type="Good Standing Certificate">
                    <div class="certificate-icon">
                        <i class="fas fa-certificate"></i>
                    </div>
                    <h4>Good Standing Certificate</h4>
                    <p>Certificate of good standing</p>
                    <span class="fee">RWF 1,500</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers for certificate selection
    const certificateCards = container.querySelectorAll('.certificate-type-card');
    certificateCards.forEach(card => {
        card.addEventListener('click', function() {
            const certificateType = this.getAttribute('data-type');
            // Update URL and load form
            const newUrl = `${window.location.pathname}?type=${encodeURIComponent(certificateType)}`;
            window.history.pushState({}, '', newUrl);
            loadApplicationForm(certificateType);
        });
    });
}

// Initialize Application Form
function initializeApplicationForm(certificateType) {
    let currentStep = 1;
    const totalSteps = 2;
    
    // Get form elements
    const form = document.querySelector('#certificateApplicationForm');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const submitBtn = document.querySelector('#submitBtn');
    
    if (!form || !prevBtn || !nextBtn || !submitBtn) return;
    
    // Navigation button events
    prevBtn.addEventListener('click', () => navigateStep(-1));
    nextBtn.addEventListener('click', () => navigateStep(1));
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Initialize file uploads and communication preferences
    initializeFileUploads(document);
    initializeCommunicationPreferences(document);
    updateUploadProgress(document);
    
    // Step navigation functions
    function navigateStep(direction) {
        if (direction === 1 && !validateCurrentStep()) {
            return;
        }
        
        const newStep = currentStep + direction;
        if (newStep >= 1 && newStep <= totalSteps) {
            showStep(newStep);
        }
    }
    
    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = document.querySelector(`[data-step="${step}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
            if (index + 1 <= step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
        nextBtn.style.display = step === totalSteps ? 'none' : 'inline-flex';
        submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
        
        // Update review section if on last step
        if (step === totalSteps) {
            updateReviewSection(certificateType);
        }
        
        currentStep = step;
    }
    
    function validateCurrentStep() {
        const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Validate communication preferences and documents on step 1
        if (currentStep === 1) {
            // Check notification methods
            const notificationMethods = document.querySelectorAll('input[name="notificationMethod"]:checked');
            if (notificationMethods.length === 0) {
                showNotification('Please select at least one notification method for receiving your payment code', 'error');
                isValid = false;
            }
            
            // Check document uploads
            const certificateInfo = getCertificateInfo(certificateType);
            const uploadedFiles = document.querySelectorAll('.upload-preview:not([style*="display: none"])');
            const requiredDocuments = certificateInfo.documents.length;
            
            if (uploadedFiles.length < requiredDocuments) {
                showNotification(`Please upload all ${requiredDocuments} required documents before proceeding`, 'error');
                isValid = false;
            }
        }
        
        if (!isValid && requiredFields.length > 0) {
            showNotification('Please fill in all required fields', 'error');
        }
        
        return isValid;
    }
    
    function updateReviewSection(certificateType) {
        // Update personal info review
        const personalInfo = document.querySelector('#reviewPersonalInfo');
        const formData = new FormData(form);
        
        if (personalInfo) {
            personalInfo.innerHTML = `
                <div class="review-item">
                    <span>Name:</span>
                    <span>${formData.get('firstName')} ${formData.get('lastName')}</span>
                </div>
                <div class="review-item">
                    <span>Date of Birth:</span>
                    <span>${formData.get('dateOfBirth')}</span>
                </div>
                <div class="review-item">
                    <span>Email:</span>
                    <span>${formData.get('email')}</span>
                </div>
                <div class="review-item">
                    <span>Phone:</span>
                    <span>${formData.get('phone')}</span>
                </div>
            `;
        }
        
        // Update documents review
        const documentsReview = document.querySelector('#reviewDocuments');
        const uploadedFiles = document.querySelectorAll('.upload-preview:not([style*="display: none"])');
        const certificateInfo = getCertificateInfo(certificateType);
        
        let documentsHtml = '';
        
        if (uploadedFiles.length > 0) {
            documentsHtml = `
                <div class="review-item">
                    <span>Total Documents:</span>
                    <span>${uploadedFiles.length} of ${certificateInfo.documents.length} uploaded</span>
                </div>
            `;
            
            // Show individual uploaded documents
            uploadedFiles.forEach((preview) => {
                const fileName = preview.querySelector('.file-name').textContent;
                const uploadGroup = preview.closest('.upload-group');
                const documentLabel = uploadGroup.querySelector('label').textContent.replace(' *', '');
                
                documentsHtml += `
                    <div class="review-item">
                        <span>${documentLabel}:</span>
                        <span class="document-file">
                            <i class="fas fa-file"></i>
                            ${fileName}
                        </span>
                    </div>
                `;
            });
        } else {
            documentsHtml = `
                <div class="review-item">
                    <span>Documents:</span>
                    <span class="no-documents">No documents uploaded yet</span>
                </div>
            `;
        }
        
        if (documentsReview) {
            documentsReview.innerHTML = documentsHtml;
        }
        
        // Update notification preferences review
        const notificationsReview = document.querySelector('#reviewNotifications');
        const selectedNotifications = document.querySelectorAll('input[name="notificationMethod"]:checked');
        const notificationMethods = Array.from(selectedNotifications).map(input => {
            const labels = {
                'email': 'Email',
                'sms': 'SMS',
                'phone': 'Phone Call'
            };
            return labels[input.value] || input.value;
        });
        
        if (notificationsReview) {
            notificationsReview.innerHTML = `
                <div class="review-item">
                    <span>Notification Methods:</span>
                    <span>${notificationMethods.length > 0 ? notificationMethods.join(', ') : 'None selected'}</span>
                </div>
                <div class="review-item">
                    <span>Application Fee:</span>
                    <span>${getCertificateInfo(certificateType).fee} (Pay after approval)</span>
                </div>
            `;
        }
    }
    
    function handleFormSubmission(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Application submitted successfully! You will receive your payment code via your selected notification method(s) after approval.', 'success');
            
            // Redirect to success page or reset form
            setTimeout(() => {
                window.location.href = 'index.html?success=true';
            }, 2000);
        }, 2000);
    }
}
