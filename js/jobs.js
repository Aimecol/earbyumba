// Jobs Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeJobSearch();
    initializeJobApplications();
});

// Job Search and Filter Functionality
function initializeJobSearch() {
    const searchInput = document.getElementById('jobSearch');
    const jobTypeFilter = document.getElementById('jobTypeFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const jobCards = document.querySelectorAll('.job-card');

    if (searchInput) {
        searchInput.addEventListener('input', filterJobs);
    }
    
    if (jobTypeFilter) {
        jobTypeFilter.addEventListener('change', filterJobs);
    }
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterJobs);
    }

    function filterJobs() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedJobType = jobTypeFilter ? jobTypeFilter.value : '';
        const selectedDepartment = departmentFilter ? departmentFilter.value : '';

        jobCards.forEach(card => {
            const title = card.querySelector('.job-title').textContent.toLowerCase();
            const description = card.querySelector('.job-description').textContent.toLowerCase();
            const department = card.querySelector('.job-department').textContent.toLowerCase();
            const jobType = card.getAttribute('data-type');
            const jobDepartment = card.getAttribute('data-department');

            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                department.includes(searchTerm);
            const matchesJobType = !selectedJobType || jobType === selectedJobType;
            const matchesDepartment = !selectedDepartment || jobDepartment === selectedDepartment;

            if (matchesSearch && matchesJobType && matchesDepartment) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if no jobs match
        const visibleJobs = Array.from(jobCards).filter(card => card.style.display !== 'none');
        showNoResultsMessage(visibleJobs.length === 0);
    }
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noResultsMessage';
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No Jobs Found</h3>
                <p>Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
        `;
        
        const jobsGrid = document.getElementById('jobsGrid');
        jobsGrid.parentNode.insertBefore(noResultsMsg, jobsGrid.nextSibling);
        
        // Add styles for no results message
        const noResultsStyles = `
            .no-results-message {
                text-align: center;
                padding: 60px 20px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                margin-top: 30px;
            }
            .no-results-content i {
                font-size: 48px;
                color: #dcdcdc;
                margin-bottom: 20px;
            }
            .no-results-content h3 {
                color: #1e753f;
                margin-bottom: 10px;
                font-size: 24px;
            }
            .no-results-content p {
                color: #666;
                font-size: 16px;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = noResultsStyles;
        document.head.appendChild(styleSheet);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Job Application Functionality
function initializeJobApplications() {
    const applyButtons = document.querySelectorAll('.apply-job-btn');
    
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            const jobDepartment = jobCard.querySelector('.job-department').textContent;
            const jobType = jobCard.getAttribute('data-type');
            
            showJobApplicationModal(jobTitle, jobDepartment, jobType);
        });
    });
}

function showJobApplicationModal(jobTitle, department, jobType) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'job-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="job-modal-content">
            <div class="job-modal-header">
                <h3>Apply for ${jobTitle}</h3>
                <button class="job-modal-close">&times;</button>
            </div>
            <div class="job-modal-body">
                <div class="job-info-summary">
                    <p><strong>Position:</strong> ${jobTitle}</p>
                    <p><strong>Department:</strong> ${department}</p>
                    <p><strong>Type:</strong> ${jobType.replace('-', ' ').toUpperCase()}</p>
                </div>
                
                <form class="job-application-form">
                    <div class="form-section">
                        <h4>Personal Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="appFirstName">First Name *</label>
                                <input type="text" id="appFirstName" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="appLastName">Last Name *</label>
                                <input type="text" id="appLastName" name="lastName" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="appEmail">Email Address *</label>
                                <input type="email" id="appEmail" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="appPhone">Phone Number *</label>
                                <input type="tel" id="appPhone" name="phone" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="appAddress">Address</label>
                            <textarea id="appAddress" name="address" rows="2"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Education & Experience</h4>
                        <div class="form-group">
                            <label for="education">Highest Education Level *</label>
                            <select id="education" name="education" required>
                                <option value="">Select education level</option>
                                <option value="primary">Primary School</option>
                                <option value="secondary">Secondary School</option>
                                <option value="diploma">Diploma</option>
                                <option value="bachelor">Bachelor's Degree</option>
                                <option value="master">Master's Degree</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="experience">Years of Experience</label>
                            <select id="experience" name="experience">
                                <option value="">Select experience</option>
                                <option value="0-1">0-1 years</option>
                                <option value="2-3">2-3 years</option>
                                <option value="4-5">4-5 years</option>
                                <option value="6-10">6-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="skills">Relevant Skills</label>
                            <textarea id="skills" name="skills" rows="3" placeholder="List your relevant skills and qualifications..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Cover Letter</h4>
                        <div class="form-group">
                            <label for="coverLetter">Why are you interested in this position? *</label>
                            <textarea id="coverLetter" name="coverLetter" rows="4" placeholder="Tell us why you're the right fit for this role..." required></textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Documents</h4>
                        <div class="form-group">
                            <label for="resume">Resume/CV *</label>
                            <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
                            <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                        </div>
                        <div class="form-group">
                            <label for="coverLetterFile">Cover Letter (Optional)</label>
                            <input type="file" id="coverLetterFile" name="coverLetterFile" accept=".pdf,.doc,.docx">
                        </div>
                        <div class="form-group">
                            <label for="certificates">Certificates/Diplomas</label>
                            <input type="file" id="certificates" name="certificates" accept=".pdf,.jpg,.jpeg,.png" multiple>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="appTerms" name="terms" required>
                                <span class="checkmark"></span>
                                I confirm that all information provided is accurate and complete *
                            </label>
                        </div>
                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="dataConsent" name="dataConsent" required>
                                <span class="checkmark"></span>
                                I consent to the processing of my personal data for recruitment purposes *
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="submit-application-btn">
                        <i class="fas fa-paper-plane"></i>
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add modal styles
    const modalStyles = `
        .job-modal-overlay {
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
        .job-modal-content {
            background: white;
            border-radius: 15px;
            width: 100%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .job-modal-header {
            padding: 25px;
            border-bottom: 1px solid #dcdcdc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1e753f;
            color: white;
            border-radius: 15px 15px 0 0;
        }
        .job-modal-header h3 {
            margin: 0;
            font-size: 20px;
        }
        .job-modal-close {
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
        .job-modal-body {
            padding: 30px;
        }
        .job-info-summary {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .job-info-summary p {
            margin: 5px 0;
            color: #0f0f0f;
        }
        .form-section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
        }
        .form-section:last-child {
            border-bottom: none;
        }
        .form-section h4 {
            color: #1e753f;
            margin-bottom: 20px;
            font-size: 18px;
        }
        .submit-application-btn {
            width: 100%;
            background: linear-gradient(135deg, #1e753f, #2a8f4f);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        .submit-application-btn:hover {
            background: linear-gradient(135deg, #2a8f4f, #34a05a);
            transform: translateY(-2px);
        }
        .form-group small {
            color: #666;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        }
    `;

    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    // Close modal functionality
    const closeBtn = modalOverlay.querySelector('.job-modal-close');
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

    // Handle form submission
    const applicationForm = modalOverlay.querySelector('.job-application-form');
    applicationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = applicationForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#d14438';
            } else {
                field.style.borderColor = '#dcdcdc';
            }
        });
        
        if (isValid) {
            // Show success message
            showNotification('Application submitted successfully! You will receive a confirmation email shortly.', 'success');
            document.body.removeChild(modalOverlay);
            document.head.removeChild(styleSheet);
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });
}

// Utility function for notifications (if not already defined in main script)
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
