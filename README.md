# DOTTECH 2026 - Digital Invitation System

A cyberpunk-themed digital invitation website for the DOTTECH 2026 tech fest. Features a fully responsive design with animated backgrounds, department-specific invitations, QR code generation, Firebase cloud storage, and a password-protected admin panel for managing event details.

## Features

* Cyberpunk design with neon colors and immersive animations
* Responsive design for all devices (mobile, tablet, desktop)
* Firebase Realtime Database for cloud storage and sync
* Admin panel to create and manage department invitations
* QR code generator for easy sharing
* Department-specific invitation URLs
* Public and private invitation options
* Matrix rain and particle effects
* Smooth parallax scrolling
* Performance optimized for low-end devices
* Export/import data backup

## Live Demo

Visit: `https://event-invitation.vercel.app`

Admin Access: Add `?secret=admin` to URL or press `Ctrl+Shift+A`

## Technology Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Firebase Realtime Database
* QRCode.js
* Web Crypto API (SHA-256)
* Canvas API (animations)

## Setup

1. Create Firebase project and enable Realtime Database
2. Add Firebase config to `api/firebase-config.js`
3. Upload files to GitHub
4. Deploy on Vercel
5. Access admin panel to create invitations
6. Generate QR codes for departments
7. Share with students

## Files

* `index.html` - Main structure
* `script.js` - Functionality, Firebase integration, and logic
* `style.css` - Styling, animations, and responsive design
* `api/firebase-config.js` - Firebase configuration endpoint

## Admin Features

* Create/edit/delete department invitations
* Create/edit public invitation
* Generate separate QR codes (public and department-specific)
* Customize event details (date, time, venue, message, highlights)
* Export/import data backup (JSON)
* Real-time cloud sync across all devices

## Usage

### For Students
* Scan QR code or visit invitation link
* View personalized department invitation
* Click event boxes to expand descriptions

### For Admins
* Access with `Ctrl+Shift+A` or `?secret=admin`
* Create departments (BSc CS/IT, BMS, BBA, custom)
* Edit public invitation
* Generate and download QR codes
* Backup/restore data

## Performance

* Auto-disables heavy animations on low-end devices
* GPU-accelerated rendering
* 60fps on modern devices
* Mobile-optimized with reduced effects

Made for DOTTECH 2026 College Tech Fest
