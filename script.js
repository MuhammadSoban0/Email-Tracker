// Company Email Tracker Dashboard
class EmailTracker {
    constructor() {
        this.companies = this.loadFromStorage('companies') || [];
        this.emails = this.loadFromStorage('emails') || [];
        this.currentFilter = 'all';
        
        this.initializeEventListeners();
        this.renderDashboard();
    }

    // Local Storage Methods
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Event Listeners
    initializeEventListeners() {
        // Toggle add company form
        document.getElementById('toggleAddForm').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Cancel form
        document.getElementById('cancelForm').addEventListener('click', () => {
            this.hideAddForm();
        });

        // Add email input
        document.getElementById('addEmailBtn').addEventListener('click', () => {
            this.addEmailInput();
        });

        // Company form submission
        document.getElementById('companyForm').addEventListener('submit', (e) => {
            this.handleCompanySubmit(e);
        });

        // Search companies
        document.getElementById('searchCompanies').addEventListener('input', (e) => {
            this.searchCompanies(e.target.value);
        });

        // Email filter buttons
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterEmails(e.target.dataset.filter);
            });
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelSendEmail').addEventListener('click', () => {
            this.closeModal();
        });

        // Send email form
        document.getElementById('sendEmailForm').addEventListener('submit', (e) => {
            this.handleSendEmail(e);
        });

        // Close modal when clicking outside
        document.getElementById('sendEmailModal').addEventListener('click', (e) => {
            if (e.target.id === 'sendEmailModal') {
                this.closeModal();
            }
        });
    }

    // Form Management
    toggleAddForm() {
        const form = document.getElementById('addCompanyForm');
        const isVisible = form.style.display !== 'none';
        
        if (isVisible) {
            this.hideAddForm();
        } else {
            this.showAddForm();
        }
    }

    showAddForm() {
        const form = document.getElementById('addCompanyForm');
        form.style.display = 'block';
        form.classList.add('fade-in');
        document.getElementById('toggleAddForm').innerHTML = '<i class="fas fa-times"></i> Cancel';
    }

    hideAddForm() {
        const form = document.getElementById('addCompanyForm');
        form.style.display = 'none';
        document.getElementById('toggleAddForm').innerHTML = '<i class="fas fa-plus"></i> Add Company';
        this.resetCompanyForm();
    }

    resetCompanyForm() {
        document.getElementById('companyForm').reset();
        const emailInputs = document.getElementById('emailInputs');
        emailInputs.innerHTML = `
            <div class="email-input-group">
                <input type="email" class="email-input" placeholder="Enter email address" required>
                <button type="button" class="btn-remove-email" onclick="removeEmailInput(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    addEmailInput() {
        const emailInputs = document.getElementById('emailInputs');
        const newInput = document.createElement('div');
        newInput.className = 'email-input-group';
        newInput.innerHTML = `
            <input type="email" class="email-input" placeholder="Enter email address" required>
            <button type="button" class="btn-remove-email" onclick="removeEmailInput(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        emailInputs.appendChild(newInput);
        newInput.classList.add('slide-in');
    }

    // Company Management
    handleCompanySubmit(e) {
        e.preventDefault();
        
        const companyName = document.getElementById('companyName').value.trim();
        const emailInputs = document.querySelectorAll('.email-input');
        const emails = Array.from(emailInputs)
            .map(input => input.value.trim())
            .filter(email => email !== '');

        if (!companyName || emails.length === 0) {
            alert('Please enter company name and at least one email address.');
            return;
        }

        // Check for duplicate emails across all companies
        const existingEmails = this.companies.flatMap(company => company.emails);
        const duplicateEmails = emails.filter(email => existingEmails.includes(email));
        
        if (duplicateEmails.length > 0) {
            alert(`The following email(s) already exist: ${duplicateEmails.join(', ')}`);
            return;
        }

        const newCompany = {
            id: this.generateId(),
            name: companyName,
            emails: emails,
            createdAt: new Date().toISOString(),
            emailsSent: 0
        };

        this.companies.push(newCompany);
        this.saveToStorage('companies', this.companies);
        this.hideAddForm();
        this.renderDashboard();
        
        this.showNotification(`Company "${companyName}" added successfully!`, 'success');
    }

    deleteCompany(companyId) {
        if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
            this.companies = this.companies.filter(company => company.id !== companyId);
            this.emails = this.emails.filter(email => email.companyId !== companyId);
            
            this.saveToStorage('companies', this.companies);
            this.saveToStorage('emails', this.emails);
            this.renderDashboard();
            
            this.showNotification('Company deleted successfully!', 'success');
        }
    }

    searchCompanies(searchTerm) {
        const companies = document.querySelectorAll('.company-card');
        const term = searchTerm.toLowerCase();

        companies.forEach(card => {
            const companyName = card.querySelector('.company-name').textContent.toLowerCase();
            const emails = Array.from(card.querySelectorAll('.email-item'))
                .map(item => item.textContent.toLowerCase());
            
            const matches = companyName.includes(term) || 
                          emails.some(email => email.includes(term));
            
            card.style.display = matches ? 'block' : 'none';
        });
    }

    // Email Management
    sendEmailDirectly(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (!company) return;

        // Create email tracking record with default subject
        const emailRecord = {
            id: this.generateId(),
            companyId: companyId,
            companyName: company.name,
            recipients: company.emails, // Send to all emails
            subject: `Business Communication - ${company.name}`,
            message: 'Email sent via Email Tracker Dashboard',
            status: 'pending',
            sentAt: new Date().toISOString(),
            deliveredAt: null
        };

        this.emails.push(emailRecord);
        
        // Update company email count
        company.emailsSent += 1;
        
        this.saveToStorage('companies', this.companies);
        this.saveToStorage('emails', this.emails);
        
        // Simulate email sending (in real app, this would be an API call)
        setTimeout(() => {
            this.markEmailAsSent(emailRecord.id);
        }, Math.random() * 5000 + 2000); // Random delay between 2-7 seconds

        this.renderDashboard();
        
        this.showNotification(`Email sent to ${company.emails.length} recipient(s) at ${company.name}!`, 'success');
    }

    openSendEmailModal(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (!company) return;

        document.getElementById('selectedCompanyId').value = companyId;
        document.getElementById('selectedCompanyName').value = company.name;
        
        // Populate email checkboxes
        const emailCheckboxes = document.getElementById('emailCheckboxes');
        emailCheckboxes.innerHTML = company.emails.map(email => `
            <div class="email-checkbox">
                <input type="checkbox" id="email_${email}" value="${email}" checked>
                <label for="email_${email}">${email}</label>
            </div>
        `).join('');

        document.getElementById('sendEmailModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('sendEmailModal').classList.remove('active');
        document.getElementById('sendEmailForm').reset();
    }

    handleSendEmail(e) {
        e.preventDefault();
        
        const companyId = document.getElementById('selectedCompanyId').value;
        const subject = document.getElementById('emailSubject').value.trim();
        const message = document.getElementById('emailMessage').value.trim();
        const selectedEmails = Array.from(document.querySelectorAll('#emailCheckboxes input:checked'))
            .map(checkbox => checkbox.value);

        if (!subject || selectedEmails.length === 0) {
            alert('Please enter a subject and select at least one email address.');
            return;
        }

        const company = this.companies.find(c => c.id === companyId);
        
        // Create email tracking record
        const emailRecord = {
            id: this.generateId(),
            companyId: companyId,
            companyName: company.name,
            recipients: selectedEmails,
            subject: subject,
            message: message,
            status: 'pending',
            sentAt: new Date().toISOString(),
            deliveredAt: null
        };

        this.emails.push(emailRecord);
        
        // Update company email count
        company.emailsSent += 1;
        
        this.saveToStorage('companies', this.companies);
        this.saveToStorage('emails', this.emails);
        
        // Simulate email sending (in real app, this would be an API call)
        setTimeout(() => {
            this.markEmailAsSent(emailRecord.id);
        }, Math.random() * 5000 + 2000); // Random delay between 2-7 seconds

        this.closeModal();
        this.renderDashboard();
        
        this.showNotification(`Email sent to ${selectedEmails.length} recipient(s)!`, 'success');
    }

    markEmailAsSent(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (email) {
            email.status = 'sent';
            email.deliveredAt = new Date().toISOString();
            this.saveToStorage('emails', this.emails);
            this.renderEmailTracker();
            this.updateStats();
        }
    }

    filterEmails(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderEmailTracker();
    }

    // Rendering Methods
    renderDashboard() {
        this.updateStats();
        this.renderCompanies();
        this.renderEmailTracker();
    }

    updateStats() {
        const totalCompanies = this.companies.length;
        const totalEmails = this.emails.length;
        const pendingEmails = this.emails.filter(email => email.status === 'pending').length;

        document.getElementById('totalCompanies').textContent = totalCompanies;
        document.getElementById('totalEmails').textContent = totalEmails;
        document.getElementById('pendingEmails').textContent = pendingEmails;
    }

    renderCompanies() {
        const companiesGrid = document.getElementById('companiesGrid');
        
        if (this.companies.length === 0) {
            companiesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-building"></i>
                    <h3>No Companies Yet</h3>
                    <p>Add your first company to start tracking emails</p>
                </div>
            `;
            return;
        }

        companiesGrid.innerHTML = this.companies.map(company => {
            const companyEmails = this.emails.filter(email => email.companyId === company.id);
            const pendingCount = companyEmails.filter(email => email.status === 'pending').length;
            
            return `
                <div class="company-card fade-in">
                    <div class="company-header">
                        <h3 class="company-name">${this.escapeHtml(company.name)}</h3>
                        <div class="company-actions">
                            <button class="btn-icon btn-send" onclick="emailTracker.sendEmailDirectly('${company.id}')" title="Send Quick Email">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                            <button class="btn-icon btn-compose" onclick="emailTracker.openSendEmailModal('${company.id}')" title="Compose Email">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete" onclick="emailTracker.deleteCompany('${company.id}')" title="Delete Company">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="company-emails">
                        <h4>Email Addresses (${company.emails.length})</h4>
                        <div class="email-list">
                            ${company.emails.map(email => `
                                <div class="email-item">${this.escapeHtml(email)}</div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="company-stats">
                        <span>Emails Sent: ${company.emailsSent}</span>
                        <span>Pending: ${pendingCount}</span>
                        <span>Added: ${this.formatDate(company.createdAt)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEmailTracker() {
        const emailTrackerList = document.getElementById('emailTrackerList');
        
        let filteredEmails = this.emails;
        if (this.currentFilter !== 'all') {
            filteredEmails = this.emails.filter(email => email.status === this.currentFilter);
        }

        // Sort by date (newest first)
        filteredEmails.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

        if (filteredEmails.length === 0) {
            const filterText = this.currentFilter === 'all' ? 'emails' : `${this.currentFilter} emails`;
            emailTrackerList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope"></i>
                    <h3>No ${filterText.charAt(0).toUpperCase() + filterText.slice(1)}</h3>
                    <p>Send your first email to start tracking</p>
                </div>
            `;
            return;
        }

        emailTrackerList.innerHTML = filteredEmails.map(email => `
            <div class="email-tracker-item ${email.status} fade-in">
                <div class="email-header">
                    <div class="email-info">
                        <h4>${this.escapeHtml(email.subject)}</h4>
                        <p>To: ${this.escapeHtml(email.companyName)} (${email.recipients.length} recipient${email.recipients.length > 1 ? 's' : ''})</p>
                    </div>
                    <div class="email-status ${email.status}">
                        <i class="fas fa-${email.status === 'pending' ? 'clock' : 'check-circle'}"></i>
                        ${email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                    </div>
                </div>
                
                <div class="email-details">
                    ${email.message ? `<p><strong>Message:</strong> ${this.escapeHtml(email.message)}</p>` : ''}
                    <div class="email-recipients">
                        <strong>Recipients:</strong> ${email.recipients.map(r => this.escapeHtml(r)).join(', ')}
                    </div>
                    <p><strong>Sent:</strong> ${this.formatDateTime(email.sentAt)}</p>
                    ${email.deliveredAt ? `<p><strong>Delivered:</strong> ${this.formatDateTime(email.deliveredAt)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Utility Methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export/Import Data (for backup)
    exportData() {
        const data = {
            companies: this.companies,
            emails: this.emails,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.companies && data.emails) {
                    this.companies = data.companies;
                    this.emails = data.emails;
                    this.saveToStorage('companies', this.companies);
                    this.saveToStorage('emails', this.emails);
                    this.renderDashboard();
                    this.showNotification('Data imported successfully!', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('Error importing data: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Global function for removing email inputs (called from HTML)
function removeEmailInput(button) {
    const emailInputGroup = button.parentElement;
    const emailInputs = document.getElementById('emailInputs');
    
    // Don't remove if it's the last input
    if (emailInputs.children.length > 1) {
        emailInputGroup.remove();
    } else {
        emailTracker.showNotification('At least one email address is required', 'error');
    }
}

// Initialize the application
let emailTracker;
document.addEventListener('DOMContentLoaded', () => {
    emailTracker = new EmailTracker();
});

// Service Worker Registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}