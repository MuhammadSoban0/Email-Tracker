# Company Email Tracker Dashboard

A responsive web dashboard for managing companies and tracking email communications with offline storage capabilities.

## Features

### 📊 Dashboard Overview
- Real-time statistics showing total companies, emails sent, and pending emails
- Clean, modern interface with responsive design
- Offline functionality with local storage

### 🏢 Company Management
- Add companies with multiple email addresses
- Search and filter companies
- Edit and delete company information
- Duplicate email validation across companies

### 📧 Email Tracking
- Send emails to selected company contacts
- Track email status (Pending/Sent)
- Filter emails by status
- View detailed email history with timestamps
- Simulated email delivery tracking

### 📱 Mobile Responsive
- Fully responsive design for mobile and tablet devices
- Touch-friendly interface
- Optimized layouts for different screen sizes

### 💾 Offline Storage
- All data stored locally using localStorage
- Works completely offline
- Data persistence across browser sessions
- Export/import functionality for data backup

## Getting Started

1. **Open the Dashboard**
   - Simply open `index.html` in your web browser
   - No server setup required - runs entirely in the browser

2. **Add Your First Company**
   - Click "Add Company" button
   - Enter company name and email addresses
   - Save to start tracking

3. **Send and Track Emails**
   - Click the send button on any company card
   - Select recipients and compose your message
   - Track delivery status in the Email Tracker section

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── sw.js              # Service Worker for offline functionality
├── manifest.json      # PWA manifest for mobile installation
└── README.md          # This file
```

## Technical Features

### Local Storage
- Companies and emails are stored in browser's localStorage
- Automatic data persistence
- No external database required

### Progressive Web App (PWA)
- Can be installed on mobile devices
- Offline functionality via Service Worker
- App-like experience on mobile

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-optimized controls
- Adaptive typography and spacing

### Email Simulation
- Simulates email sending with random delays (2-7 seconds)
- Status tracking from "Pending" to "Sent"
- Realistic email delivery simulation

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Management

### Export Data
```javascript
emailTracker.exportData(); // Downloads JSON backup file
```

### Import Data
```javascript
// Use file input to select backup file
emailTracker.importData(file);
```

### Clear All Data
```javascript
localStorage.clear(); // Clears all stored data
```

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layouts
- CSS custom properties for easy theme customization
- Responsive breakpoints can be adjusted

### Functionality
- Extend `script.js` to add new features
- Integrate with real email APIs
- Add additional company fields

## Security Notes

- All data is stored locally in the browser
- No data is sent to external servers
- Email "sending" is simulated - integrate with real email service for production use

## Future Enhancements

- Integration with real email APIs (SendGrid, Mailgun, etc.)
- Email templates and scheduling
- Advanced analytics and reporting
- Team collaboration features
- Cloud synchronization options

## License

This project is open source and available under the MIT License.