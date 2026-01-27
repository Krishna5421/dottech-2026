// ============================================================================
// ULTIMATE CYBERPUNK DOTTECH INVITATION SYSTEM
// Complete JavaScript with UNIVERSAL STORAGE (Works on Vercel + Anywhere)
// ============================================================================

// ============================================================================
// PERFORMANCE OPTIMIZATION
// Disable heavy animations on low-end devices to improve performance
// ============================================================================

// Disable heavy animations on mobile and low-end devices
if (navigator.hardwareConcurrency <= 4 || window.innerWidth <= 768) {
    document.getElementById('particles').style.display = 'none';
    document.getElementById('matrix-rain').style.display = 'none';
    
    // Disable all background effects on mobile
    const effects = document.querySelectorAll('.cyber-grid, .scan-line, .scan-line-v, .holo-overlay, .glitch-overlay, .hex-container');
    effects.forEach(el => el.style.display = 'none');
}

// ============================================================================
// FIREBASE CONFIGURATION
// Replace with YOUR config from Firebase Console (Step 3)
// ============================================================================

// Wait for config to be loaded from API
function initializeFirebase() {
  const firebaseConfig = window.FIREBASE_CONFIG || {
    apiKey: "PLACEHOLDER_API_KEY",
    authDomain: "PLACEHOLDER.firebaseapp.com",
    databaseURL: "https://PLACEHOLDER-default-rtdb.firebaseio.com",
    projectId: "PLACEHOLDER",
    storageBucket: "PLACEHOLDER.appspot.com",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER"
  };

  console.log('🔥 Initializing Firebase with:', firebaseConfig);

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  window.database = firebase.database();
  
  console.log('✅ Firebase initialized successfully');
}

// Check if config is already loaded
if (window.FIREBASE_CONFIG) {
  initializeFirebase();
} else {
  // Wait for config to load
  let checkCount = 0;
  const checkInterval = setInterval(() => {
    checkCount++;
    if (window.FIREBASE_CONFIG) {
      console.log('✅ Firebase config detected, initializing...');
      clearInterval(checkInterval);
      initializeFirebase();
    } else if (checkCount > 50) { // 5 seconds timeout
      console.error('❌ Firebase config failed to load after 5 seconds');
      clearInterval(checkInterval);
      alert('Failed to load Firebase configuration. Please refresh the page.');
    }
  }, 100);
}

// ============================================================================
// UNIVERSAL STORAGE SYSTEM - NOW WITH FIREBASE REALTIME DATABASE!
// Works across ALL devices - PC, Mobile, Tablets, anywhere in the world!
// Data syncs instantly via Firebase Cloud ☁️
// ============================================================================

const UniversalStorage = {
    /**
     * Get data from Firebase Realtime Database
     * @param {string} key - The storage key to retrieve
     * @param {boolean} shared - Whether to use shared storage (always true for Firebase)
     * @returns {Promise<any>} Data object or null if not found
     */
    async get(key, shared = true) {
        try {
            const snapshot = await database.ref(key).once('value');
            const data = snapshot.val();
            
            if (data) {
                console.log(`✓ Loaded from Firebase: ${key}`);
                return data;
            }
            return null;
        } catch (error) {
            console.error('Firebase get error:', error);
            return null;
        }
    },

    /**
     * Set data in Firebase Realtime Database
     * @param {string} key - The storage key
     * @param {any} value - The value to store (object/array/string)
     * @param {boolean} shared - Whether to use shared storage (always true for Firebase)
     * @returns {Promise<boolean>} True if save was successful
     */
    async set(key, value, shared = true) {
        try {
            await database.ref(key).set(value);
            console.log(`✓ Saved to Firebase Cloud: ${key}`);
            return true;
        } catch (error) {
            console.error('Firebase set error:', error);
            alert('⚠️ Failed to save to cloud. Please check your internet connection.');
            return false;
        }
    },

    /**
     * Delete data from Firebase Realtime Database
     * @param {string} key - The storage key to delete
     * @param {boolean} shared - Whether to use shared storage (always true for Firebase)
     * @returns {Promise<boolean>} True if deletion was successful
     */
    async delete(key, shared = true) {
        try {
            await database.ref(key).remove();
            console.log(`✓ Deleted from Firebase: ${key}`);
            return true;
        } catch (error) {
            console.error('Firebase delete error:', error);
            return false;
        }
    },

    /**
     * List all keys with a given prefix
     * @param {string} prefix - The key prefix to filter by
     * @param {boolean} shared - Whether to use shared storage (always true for Firebase)
     * @returns {Promise<string[]>} Array of matching keys
     */
    async list(prefix = '', shared = true) {
        try {
            const snapshot = await window.database.ref(key).once('value');
            const data = snapshot.val() || {};
            const keys = Object.keys(data).filter(k => k.startsWith(prefix));
            console.log(`✓ Listed ${keys.length} keys from Firebase with prefix: ${prefix}`);
            return keys;
        } catch (error) {
            console.error('Firebase list error:', error);
            return [];
        }
    }
};

// ============================================================================
// CONFIGURATION
// Application-wide configuration constants
// ============================================================================

// Admin password hash (SHA-256) - prevents unauthorized access to admin panel
const ADMIN_PASSWORD_HASH = "929ba795df547ffa83fced5f9cdbb0381c1b841db6826cebf806e5bf620bd39a";

// In-memory cache of all departments for quick access
const departments = {};

// ============================================================================
// PROFESSIONAL INVITATION MESSAGE
// Default invitation text used when no custom message is provided
// ============================================================================

const PROFESSIONAL_INVITATION = `Dear Esteemed Participant,

We are honored to extend this exclusive invitation to you for DOTTECH 2026, the flagship technological symposium that brings together the brightest minds in innovation and engineering.

This prestigious event will showcase cutting-edge developments in artificial intelligence, robotics, quantum computing, and next-generation technologies. Join us for an immersive experience featuring expert-led workshops, competitive hackathons, industry insights, and unparalleled networking opportunities.

Your participation will contribute to shaping the future of technology and fostering collaborative innovation across disciplines. We look forward to welcoming you to this transformative gathering of visionaries and pioneers.

Mark your calendars and prepare to be part of technological excellence.

Warm Regards,
DOTTECH Organizing Committee`;

// ============================================================================
// URL PARAMETER HANDLING
// Extract department ID from URL query parameters for direct access
// ============================================================================

/**
 * Get department ID from URL parameter (?dept=CSE)
 * @returns {string|null} Department ID or null if not present
 */
function getDeptIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('dept');
}

// ============================================================================
// MATRIX RAIN EFFECT (Background Animation)
// Cyberpunk-style falling text animation inspired by The Matrix
// ============================================================================

// Get canvas element and 2D rendering context
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters to display in the rain
const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-={}[]|:;<>?,./~`";
const matrixArray = matrix.split("");

// Configuration
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

// Initialize drop positions (start at random negative heights)
for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -200;
}

/**
 * Draw one frame of the matrix rain animation
 * Creates trailing effect with semi-transparent overlay
 */
function drawMatrix() {
    // Fade previous frame slightly (creates trail effect)
    ctx.fillStyle = 'rgba(5, 8, 22, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text style
    ctx.fillStyle = '#00f3ff';
    ctx.font = fontSize + 'px monospace';

    // Draw each column of falling text
    for (let i = 0; i < drops.length; i++) {
        // Pick random character
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top when it reaches bottom (with random chance)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Run animation loop (slower on mobile devices)
setInterval(drawMatrix, window.innerWidth < 768 ? 120 : 80);

// ============================================================================
// PARTICLE SYSTEM (Floating Connected Particles)
// Creates interconnected floating particles with glowing connections
// ============================================================================

// Get particle canvas and context
const particlesCanvas = document.getElementById('particles');
const pCtx = particlesCanvas.getContext('2d');

// Set canvas to full window size
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

// Particle configuration
const particles = [];
const particleCount = 50;

/**
 * Particle class - represents a single floating particle
 */
class Particle {
    constructor() {
        // Random starting position
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        
        // Random velocity
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        
        // Random neon color
        this.color = ['#00f3ff', '#ff00ff', '#00ff9d'][Math.floor(Math.random() * 3)];
    }

    /**
     * Update particle position and bounce off edges
     */
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off horizontal edges
        if (this.x > particlesCanvas.width || this.x < 0) this.speedX *= -1;
        // Bounce off vertical edges
        if (this.y > particlesCanvas.height || this.y < 0) this.speedY *= -1;
    }

    /**
     * Draw particle with glow effect
     */
    draw() {
        pCtx.fillStyle = this.color;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();

        // Add glow effect
        pCtx.shadowBlur = 15;
        pCtx.shadowColor = this.color;
    }
}

// Initialize all particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

/**
 * Main animation loop for particle system
 * Updates positions, draws particles, and connects nearby ones with lines
 */
function animateParticles() {
    // Clear canvas
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    // Update and draw each particle
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles with lines
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Draw connection line if particles are close
            if (distance < 100) {
                pCtx.strokeStyle = `rgba(0, 243, 255, ${0.2 - distance / 500})`;
                pCtx.lineWidth = 1;
                pCtx.beginPath();
                pCtx.moveTo(particles[i].x, particles[i].y);
                pCtx.lineTo(particles[j].x, particles[j].y);
                pCtx.stroke();
            }
        }
    }

    // Continue animation loop
    requestAnimationFrame(animateParticles);
}

// Start particle animation
animateParticles();

// ============================================================================
// WINDOW RESIZE HANDLER
// Adjust canvas sizes when window is resized
// ============================================================================

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
});

// ============================================================================
// ADMIN PANEL FUNCTIONS
// Functions to control admin panel visibility and authentication
// ============================================================================

/**
 * Show the admin login modal
 */
function showAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
}

/**
 * Close the admin login modal and clear password field
 */
function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
}

/**
 * Verify admin password using SHA-256 hash comparison
 * Opens admin panel if password is correct
 */
function verifyAdmin() {
    const password = document.getElementById('adminPassword').value;

    // Hash the entered password using Web Crypto API
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
        .then(hashBuffer => {
            // Convert hash buffer to hex string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Compare with stored hash
            if (hashHex === ADMIN_PASSWORD_HASH) {
                closeAdminLogin();
                document.getElementById('adminPanel').classList.add('active');
                loadAllDepartments();
            } else {
                alert('❌ ACCESS DENIED: INVALID CREDENTIALS');
                document.getElementById('adminPassword').value = '';
            }
        })
        .catch(error => {
            console.error('Authentication error:', error);
            alert('❌ AUTHENTICATION ERROR');
        });
}

/**
 * Close the admin panel
 */
function closeAdmin() {
    document.getElementById('adminPanel').classList.remove('active');
}

// ============================================================================
// DEPARTMENT MANAGEMENT (Using Universal Storage)
// Functions to load, save, and manage department data
// ============================================================================

/**
 * Load all departments from storage and populate dropdown selector
 * Fetches data from UniversalStorage and rebuilds department cache
 */
async function loadAllDepartments() {
    const selector = document.getElementById('deptSelector');
    selector.innerHTML = '<option value="">-- CREATE NEW --</option>';

    // Load all department keys from storage (keys start with 'dept:')
    const keys = await UniversalStorage.list('dept:', true);

    if (keys && keys.length > 0) {
        // Load each department's data
        for (let key of keys) {
            const deptId = key.replace('dept:', '');
            const deptData = await UniversalStorage.get(key, true);

            if (deptData) {
                // Store in memory cache
                departments[deptId] = deptData;

                // Add to dropdown
                const option = document.createElement('option');
                option.value = deptId;
                option.textContent = deptId + ' - ' + deptData.name;
                selector.appendChild(option);
            }
        }
    }

    console.log('📊 Departments loaded:', Object.keys(departments).length);
}

/**
 * Load selected department data into form fields
 * Called when user selects a department from dropdown
 */
function loadDeptData() {
    const selector = document.getElementById('deptSelector');
    const deptId = selector.value;

    // If no selection, clear form
    if (!deptId) {
        clearForm();
        return;
    }

    // Populate form with department data
    const dept = departments[deptId];
    if (dept) {
        document.getElementById('deptId').value = deptId;
        document.getElementById('deptName').value = dept.name;
        document.getElementById('eventName').value = dept.eventName;
        document.getElementById('eventTagline').value = dept.tagline;
        document.getElementById('eventDate').value = dept.date;
        document.getElementById('eventTime').value = dept.time;
        document.getElementById('eventVenue').value = dept.venue;
        document.getElementById('invitationMsg').value = dept.message;
        document.getElementById('highlights').value = dept.highlights.join(', ');
    }
}

/**
 * Clear all form fields and reset to new department mode
 */
function clearForm() {
    document.getElementById('deptId').value = '';
    document.getElementById('deptName').value = '';
    document.getElementById('eventName').value = '';
    document.getElementById('eventTagline').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventVenue').value = '';
    document.getElementById('invitationMsg').value = '';
    document.getElementById('highlights').value = '';
    document.getElementById('qrDisplay').classList.remove('active');
    document.getElementById('deptId').disabled = false;
    document.getElementById('deptName').disabled = false;
}

/**
 * Switch to new department creation mode
 */
function addNewDept() {
    clearForm();
    document.getElementById('deptSelector').value = '';
}

/**
 * Save invitation data to storage
 * Handles both PUBLIC invitations and department-specific invitations
 * Includes comprehensive validation and error handling
 */
// Replace the saveInvitation function with this updated version:

async function saveInvitation() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    const deptId = document.getElementById('deptId').value.trim().toUpperCase();
    const deptName = document.getElementById('deptName').value.trim();
    const eventName = document.getElementById('eventName').value.trim();
    const tagline = document.getElementById('eventTagline').value.trim();
    const date = document.getElementById('eventDate').value.trim();
    const time = document.getElementById('eventTime').value.trim();
    const venue = document.getElementById('eventVenue').value.trim();
    const message = document.getElementById('invitationMsg').value.trim();
    const highlightsInput = document.getElementById('highlights').value.trim();

    // Validation
    if (!deptId) {
        alert('⚠️ DEPARTMENT ID IS REQUIRED');
        return;
    }

    if (!/^[A-Z0-9]+$/.test(deptId)) {
        alert('⚠️ INVALID DEPARTMENT ID\n\nOnly letters and numbers allowed.');
        return;
    }

    if (deptId.length > 20) {
        alert('⚠️ DEPARTMENT ID TOO LONG (max 20 chars)');
        return;
    }

    if (deptId !== 'PUBLIC' && !deptName) {
        alert('⚠️ DEPARTMENT NAME IS REQUIRED');
        return;
    }

    const highlights = highlightsInput.split(',').map(h => h.trim()).filter(h => h);

    btn.innerHTML = '<span>⏳ SAVING DATA...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'not-allowed';

    try {
        if (deptId === 'PUBLIC') {
            const publicData = {
                eventName: eventName || 'DOTTECH',
                tagline: tagline || 'INNOVATE • DOMINATE • ELEVATE',
                date: date || 'JANUARY 30-31, 2026',
                time: time || '07:00 AM - 6:00 PM',
                venue: venue || 'MAIN AUDITORIUM NEXUS',
                message: message || PROFESSIONAL_INVITATION,
                highlights: highlights.length ? highlights : [
                    'HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 
                    'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING'
                ]
            };

            departments['PUBLIC'] = publicData;
            const saveSuccess = await UniversalStorage.set('dept:PUBLIC', publicData, true);
            
            if (!saveSuccess) {
                throw new Error('Failed to save PUBLIC invitation to storage');
            }

            btn.innerHTML = '<span>✓ PUBLIC INVITATION SAVED</span>';
            btn.style.background = 'linear-gradient(135deg, #00ff9d, #00f3ff)';
            btn.style.opacity = '1';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.cursor = 'pointer';
                btn.disabled = false;
                document.getElementById('deptId').disabled = false;
                document.getElementById('deptName').disabled = false;
            }, 2500);

            // **FIX: Force immediate reload of public page**
            const currentDeptId = getDeptIdFromURL();
            if (!currentDeptId) {
                // Reload PUBLIC data immediately
                const freshPublicData = await UniversalStorage.get('dept:PUBLIC', true);
                if (freshPublicData) {
                    displayInvitation(freshPublicData, 'PUBLIC');
                }
            }

            console.log('✅ Public invitation saved and reloaded');
            
        } else {
            const deptData = {
                name: deptName,
                eventName: eventName || 'DOTTECH',
                tagline: tagline || 'INNOVATE • DOMINATE • ELEVATE',
                date: date || 'JANUARY 30-31, 2026',
                time: time || '09:00 AM - 6:00 PM',
                venue: venue || 'MAIN AUDITORIUM NEXUS',
                message: message || PROFESSIONAL_INVITATION,
                highlights: highlights.length ? highlights : [
                    'HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 
                    'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING'
                ]
            };

            departments[deptId] = deptData;
            const saveSuccess = await UniversalStorage.set(`dept:${deptId}`, deptData, true);
            
            if (!saveSuccess) {
                throw new Error('Failed to save department to storage');
            }

            btn.innerHTML = '<span>✓ SAVED SUCCESSFULLY</span>';
            btn.style.background = 'linear-gradient(135deg, #00ff9d, #00f3ff)';
            btn.style.opacity = '1';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.cursor = 'pointer';
                btn.disabled = false;
            }, 2500);

            // **FIX: Reload dropdown and force display update**
            await loadAllDepartments();
            
            // Force immediate reload from storage to ensure fresh data
            const freshDeptData = await UniversalStorage.get(`dept:${deptId}`, true);
            
            const currentDeptId = getDeptIdFromURL();
            if (currentDeptId === deptId && freshDeptData) {
                // Viewing this department - update immediately with fresh data
                displayInvitation(freshDeptData, deptId);
            } else if (!currentDeptId && freshDeptData) {
                // On public page - also update if this is the displayed dept
                displayInvitation(freshDeptData, deptId);
            }

            console.log('✅ Department saved and display updated:', deptId);
        }

    } catch (error) {
        console.error('❌ Save error:', error);
        
        btn.innerHTML = '<span>❌ SAVE FAILED</span>';
        btn.style.background = 'linear-gradient(135deg, #ff0055, #ff6b00)';
        btn.style.opacity = '1';
        
        alert('❌ FAILED TO SAVE DATA\n\nError: ' + error.message);
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.cursor = 'pointer';
            btn.disabled = false;
            btn.style.opacity = '1';
        }, 3000);
    }
}
/**
 * Delete selected department from storage
 * Includes multiple confirmation steps and prevents accidental deletion
 */
async function deleteDept() {
    const deptId = document.getElementById('deptId').value;

    // ========================================================================
    // VALIDATION - Ensure department is selected
    // ========================================================================
    
    if (!deptId) {
        alert('⚠️ NO DEPARTMENT SELECTED\n\nPlease select a department from the dropdown first.');
        return;
    }

    // ========================================================================
    // SPECIAL HANDLING FOR PUBLIC INVITATION
    // Extra confirmation for deleting public invitation
    // ========================================================================
    
    if (deptId === 'PUBLIC') {
        if (!confirm('⚠️ DELETE PUBLIC INVITATION?\n\nThis will remove the general invitation that visitors see without a department code.\n\nAre you sure you want to delete it?')) {
            return;
        }
    }

    // ========================================================================
    // FIRST CONFIRMATION
    // Warn user about permanent deletion
    // ========================================================================
    
    if (!confirm(`🗑️ DELETE DEPARTMENT: ${deptId}?\n\nThis will permanently delete:\n• All department details\n• Event information\n• QR codes will no longer work\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?`)) {
        return;
    }

    // ========================================================================
    // SECOND CONFIRMATION - Type Department ID
    // Prevent accidental deletion by requiring exact ID match
    // ========================================================================
    
    const confirmation = prompt(`⚠️ FINAL CONFIRMATION\n\nType "${deptId}" exactly to confirm deletion:`);
    
    if (confirmation !== deptId) {
        alert('❌ Deletion cancelled\n\nConfirmation text did not match department ID.');
        return;
    }

    // ========================================================================
    // SHOW LOADING STATE
    // ========================================================================
    
    const deleteBtn = event.target;
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<span>⏳ DELETING...</span>';
    deleteBtn.disabled = true;

    try {
        // ====================================================================
        // PERFORM DELETION
        // Remove from storage, memory cache, and UI
        // ====================================================================
        
        // Delete from persistent storage
        await UniversalStorage.delete(`dept:${deptId}`, true);
        
        // Delete from in-memory cache
        delete departments[deptId];
        
        // Clear form fields
        clearForm();
        
        // Reload department list dropdown
        await loadAllDepartments();
        
        // Show success message
        deleteBtn.innerHTML = '<span>✓ DELETED</span>';
        deleteBtn.style.background = 'linear-gradient(135deg, #ff0055, #ff6b00)';
        
        // Reset button after delay
        setTimeout(() => {
            deleteBtn.innerHTML = originalText;
            deleteBtn.style.background = '';
            deleteBtn.disabled = false;
        }, 2000);
        
        // Show success alert
        alert('✅ DEPARTMENT DELETED SUCCESSFULLY\n\nDepartment: ' + deptId + '\n\nAll associated data has been removed.');
        
        console.log('✅ Department deleted:', deptId);
        
    } catch (error) {
        // ====================================================================
        // ERROR HANDLING
        // ====================================================================
        
        console.error('❌ Delete error:', error);
        
        // Show error message
        deleteBtn.innerHTML = '<span>❌ DELETE FAILED</span>';
        
        // Alert user
        alert('❌ FAILED TO DELETE DEPARTMENT\n\nError: ' + error.message + '\n\nPlease try again.');
        
        // Reset button after delay
        setTimeout(() => {
            deleteBtn.innerHTML = originalText;
            deleteBtn.disabled = false;
        }, 2000);
    }
}

// ============================================================================
// ENHANCED QR CODE GENERATION WITH PUBLIC & DEPARTMENT OPTIONS
// Creates modal dialog for selecting QR code type (public or department-specific)
// ============================================================================

/**
 * Generate QR Code modal with option to create public or department QR
 * Shows different options based on whether a department is currently selected
 */
function generateQR() {
    const deptId = document.getElementById('deptId').value;

    // ========================================================================
    // CREATE MODAL CONTAINER
    // Full-screen overlay with backdrop blur
    // ========================================================================
    
    const modal = document.createElement('div');
    modal.id = 'qrOptionsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(5, 8, 22, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100002;
        animation: fadeIn 0.3s;
        padding: 20px;
    `;

    // ========================================================================
    // MODAL CONTENT
    // Contains title, close button, and QR type selection buttons
    // ========================================================================
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgba(10, 14, 39, 0.95), rgba(15, 20, 50, 0.9));
            border: 3px solid var(--neon-cyan);
            padding: clamp(30px, 5vw, 40px);
            max-width: 500px;
            width: 100%;
            clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
            box-shadow: 0 0 80px rgba(0, 243, 255, 0.6);
            position: relative;
        ">
            <!-- Close button (X) with hover effect -->
            <div style="
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 35px;
                cursor: pointer;
                color: var(--neon-pink);
                line-height: 1;
                transition: all 0.3s;
            " onmouseover="this.style.transform='rotate(90deg) scale(1.2)'" onmouseout="this.style.transform=''" onclick="this.parentElement.parentElement.remove()">×</div>
            
            <!-- Modal title -->
            <h2 style="
                font-family: 'Orbitron', sans-serif;
                color: var(--neon-cyan);
                text-align: center;
                margin-bottom: 30px;
                font-size: clamp(20px, 5vw, 24px);
                text-shadow: 0 0 20px var(--neon-cyan);
            ">SELECT QR CODE TYPE</h2>
            
            <!-- Button container -->
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <!-- Public QR Code button (always available) -->
                <button onclick="generatePublicQR()" style="
                    background: linear-gradient(135deg, var(--neon-green), var(--neon-cyan));
                    border: none;
                    color: #fff;
                    padding: clamp(14px, 3vw, 18px) clamp(25px, 5vw, 35px);
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(14px, 3vw, 16px);
                    font-weight: 700;
                    cursor: pointer;
                    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
                    box-shadow: 0 5px 30px rgba(0, 255, 157, 0.5);
                    transition: all 0.3s;
                    width: 100%;
                ">
                    🌐 GENERATE PUBLIC QR CODE
                    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9; font-weight: 400;">
                        General invitation for all departments
                    </div>
                </button>
                
                <!-- Department-specific QR button (only if dept is selected and saved) -->
                ${deptId && departments[deptId] ? `
                <button onclick="generateDeptQR('${deptId}')" style="
                    background: linear-gradient(135deg, var(--neon-purple), var(--neon-pink));
                    border: none;
                    color: #fff;
                    padding: clamp(14px, 3vw, 18px) clamp(25px, 5vw, 35px);
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(14px, 3vw, 16px);
                    font-weight: 700;
                    cursor: pointer;
                    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
                    box-shadow: 0 5px 30px rgba(157, 0, 255, 0.5);
                    transition: all 0.3s;
                    width: 100%;
                ">
                    🎯 GENERATE ${deptId} DEPT QR CODE
                    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9; font-weight: 400;">
                        Department-specific invitation
                    </div>
                </button>
                ` : `
                <!-- Warning message when no department is saved -->
                <div style="
                    padding: 20px;
                    background: rgba(255, 189, 46, 0.1);
                    border: 2px solid var(--neon-yellow);
                    border-radius: 10px;
                    text-align: center;
                    color: var(--neon-yellow);
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                ">
                    ⚠️ Please save department data first to generate department-specific QR code
                </div>
                `}
            </div>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);
}


// ============================================================================
// QR CODE GENERATION FUNCTIONS
// Functions to create QR codes for public and department-specific invitations
// ============================================================================

/**
 * Generate QR code for public (general) invitation
 * Creates a QR code without department parameter - accessible to all
 */
function generatePublicQR() {
    // Get base URL without any query parameters
    const baseUrl = window.location.origin + window.location.pathname;
    const url = baseUrl;

    // Display QR code with public label
    showQRDisplay(url, 'PUBLIC - General Invitation', 'public');
    
    // Close the selection modal
    document.getElementById('qrOptionsModal').remove();
}

/**
 * Generate QR code for department-specific invitation
 * @param {string} deptId - Department ID to encode in QR code
 */
function generateDeptQR(deptId) {
    // Get base URL and append department parameter
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?dept=${encodeURIComponent(deptId)}`;

    // Get department name for display
    const deptName = departments[deptId]?.name || deptId;
    
    // Display QR code with department-specific label
    showQRDisplay(url, `${deptId} - ${deptName}`, deptId);
    
    // Close the selection modal
    document.getElementById('qrOptionsModal').remove();
}

/**
 * Display QR code in the admin panel
 * Uses QRCode.js library to generate the actual QR code image
 * @param {string} url - The URL to encode in the QR code
 * @param {string} title - Display title for the QR code
 * @param {string} type - Type identifier (public/department ID) for filename
 */
function showQRDisplay(url, title, type) {
    // Get container element
    const qrContainer = document.getElementById('qrContainer');
    qrContainer.innerHTML = '';

    try {
        // ====================================================================
        // VALIDATE QR CODE LIBRARY
        // Check if QRCode.js library is loaded
        // ====================================================================
        
        if (typeof QRCode === 'undefined') {
            alert('❌ QR Code library failed to load. Please refresh the page.');
            return;
        }

        // ====================================================================
        // GENERATE QR CODE
        // Create QR code with high error correction level
        // ====================================================================
        
        new QRCode(qrContainer, {
            text: url,                              // URL to encode
            width: 256,                             // QR code width in pixels
            height: 256,                            // QR code height in pixels
            colorDark: "#000000",                   // Dark color (modules)
            colorLight: "#ffffff",                  // Light color (background)
            correctLevel: QRCode.CorrectLevel.H    // High error correction (30%)
        });

        // Display the URL below the QR code
        document.getElementById('qrUrl').textContent = url;

        // ====================================================================
        // ADD TITLE TO QR DISPLAY
        // Remove existing title if present and add new one
        // ====================================================================
        
        const qrDisplay = document.getElementById('qrDisplay');
        const existingTitle = qrDisplay.querySelector('.qr-title');
        if (existingTitle) existingTitle.remove();

        // Create styled title element
        const titleEl = document.createElement('div');
        titleEl.className = 'qr-title';
        titleEl.style.cssText = `
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(16px, 3.5vw, 20px);
            color: var(--neon-cyan);
            margin-bottom: 15px;
            text-align: center;
            letter-spacing: 2px;
            text-shadow: 0 0 15px var(--neon-cyan);
        `;
        titleEl.textContent = `QR CODE: ${title}`;

        // Insert title at the top
        qrDisplay.insertBefore(titleEl, qrDisplay.firstChild);
        
        // Show QR display section
        qrDisplay.classList.add('active');
        
        // Store QR type for download filename
        qrDisplay.dataset.qrType = type;

        // Log success
        console.log('QR Code generated:', title);
        console.log('URL:', url);
        
    } catch (error) {
        // ====================================================================
        // ERROR HANDLING
        // ====================================================================
        
        console.error('QR generation error:', error);
        alert('❌ Failed to generate QR code. Please try again.');
    }
}

/**
 * Download the generated QR code as a PNG image
 * Converts canvas element to downloadable image file
 */
function downloadQR() {
    // Get the QR code canvas element
    const qrCanvas = document.querySelector('#qrContainer canvas');
    
    // Validate canvas exists
    if (!qrCanvas) {
        alert('⚠️ NO QR CODE TO DOWNLOAD');
        return;
    }

    // Get QR type for filename (public or department ID)
    const qrDisplay = document.getElementById('qrDisplay');
    const qrType = qrDisplay.dataset.qrType || 'qr';

    // Generate filename with current date
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `DOTTECH-2026-${qrType}-invitation-${timestamp}.png`;

    // Create download link and trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrCanvas.toDataURL();  // Convert canvas to base64 PNG
    link.click();

    console.log('QR Code downloaded:', filename);
}

// ============================================================================
// LOADING SCREEN & INVITATION DISPLAY
// Animated loading sequence and invitation content display logic
// ============================================================================

/**
 * Show animated loading screen, then display invitation
 * Fetches department data if URL parameter is present
 * Includes progressive loading animation with status messages
 */
async function showInvitation() {
    const deptId = getDeptIdFromURL();
    
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingStatus = document.getElementById('loadingStatus');
    const invitationWrapper = document.getElementById('invitationWrapper');

    const statuses = [
        'LOADING DOTTECH MATRIX...',
        'SCANNING QUANTUM SIGNATURES...',
        'DECRYPTING INVITATION DATA...',
        'ESTABLISHING HOLOGRAPHIC CONNECTION...',
        'SYNCHRONIZING CYBERNETIC PROTOCOLS...',
        'LOADING COMPLETE...'
    ];

    let progress = 0;
    let statusIndex = 0;
    let dataLoaded = false;
    let invitationData = null;

    // ========================================================================
    // PARALLEL LOADING: Fetch data WHILE showing animation (non-blocking)
    // ========================================================================
    
    const loadData = async () => {
        try {
            if (deptId) {
                // Load department-specific data
                const freshDeptData = await UniversalStorage.get(`dept:${deptId}`, true);
                
                if (freshDeptData) {
                    departments[deptId] = freshDeptData;
                    invitationData = { type: 'dept', data: freshDeptData, id: deptId };
                    console.log('✅ Loaded FRESH data for:', deptId);
                } else {
                    console.warn('⚠️ Department not found:', deptId);
                    invitationData = { type: 'default' };
                }
            } else {
                // Load PUBLIC invitation
                invitationData = { type: 'public' };
            }
            dataLoaded = true;
        } catch (error) {
            console.error('❌ Data loading error:', error);
            invitationData = { type: 'default' };
            dataLoaded = true;
        }
    };

    // Start loading data in parallel (don't wait for it)
    loadData();

    // ========================================================================
    // FAST LOADING ANIMATION (Completes in ~2 seconds max)
    // ========================================================================
    
    const loadingInterval = setInterval(() => {
        // Faster progress increment
        progress += Math.random() * 25 + 10; // 10-35% per tick (faster)
        
        if (progress > 100) progress = 100;

        loadingProgress.style.width = progress + '%';

        // Update status messages
        if (statusIndex < statuses.length && progress > (statusIndex * 16)) {
            loadingStatus.textContent = statuses[statusIndex];
            statusIndex++;
        }

        // ====================================================================
        // Complete loading when EITHER:
        // 1. Progress reaches 100% OR
        // 2. Data is loaded (whichever comes first)
        // ====================================================================
        
        if (progress >= 100 || (dataLoaded && progress > 60)) {
            clearInterval(loadingInterval);
            
            // Force to 100% if data loaded early
            loadingProgress.style.width = '100%';
            loadingStatus.textContent = 'LOADING COMPLETE...';

            setTimeout(async () => {
                loadingScreen.classList.add('hidden');
                invitationWrapper.style.display = 'block';

                setTimeout(async () => {
                    // Wait for data if not loaded yet (rare case)
                    let waitCount = 0;
                    while (!dataLoaded && waitCount < 20) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        waitCount++;
                    }

                    // Display the invitation
                    if (invitationData) {
                        if (invitationData.type === 'dept') {
                            displayInvitation(invitationData.data, invitationData.id);
                        } else if (invitationData.type === 'public') {
                            await displayDefaultInvitation();
                        } else {
                            await displayDefaultInvitation();
                        }
                    } else {
                        await displayDefaultInvitation();
                    }
                }, 100);
            }, 300);
        }
    }, 150); // Faster interval: 150ms instead of 200ms
}

function displayInvitation(dept, deptId) {
    // Hide department section for department-specific invitations
    const deptSection = document.getElementById('deptSection');
    if (deptSection) deptSection.style.display = 'none';
    
    // ========================================================================
    // UPDATE EVENT NAME (Hero Section)
    // ========================================================================
    
    document.getElementById('displayEventName').textContent = dept.eventName;
    document.getElementById('displayEventName').setAttribute('data-text', dept.eventName);

    // ========================================================================
    // UPDATE TAGLINE (Hero Section)
    // ========================================================================
    
    const taglineParts = dept.tagline.split('•').map(word => word.trim());
    const taglineHTML = taglineParts.map(word =>
        `<span class="subtitle-word">${word}</span>`
    ).join('<span class="subtitle-dot">•</span>');
    document.getElementById('displayTagline').innerHTML = taglineHTML;

    // ========================================================================
    // UPDATE DEPARTMENT INFO (Department Section)
    // ========================================================================
    
    document.getElementById('displayDept').innerHTML = `<span class="dept-text">${dept.name}</span>`;
    document.getElementById('displayDeptId').textContent = deptId;

    // ========================================================================
    // UPDATE EVENT DETAILS (Details Section)
    // ========================================================================
    
    document.getElementById('displayDate').textContent = dept.date;
    document.getElementById('displayTime').textContent = dept.time;
    document.getElementById('displayVenue').textContent = dept.venue;

    // ========================================================================
    // UPDATE MESSAGE (Message Section)
    // ========================================================================
    
const displayMessage = dept.message || PROFESSIONAL_INVITATION;

// Format as "To: Department Name"
const departmentPrefix = `To: <span class="dept-highlight">${dept.name}</span>\n\n`;
const fullMessage = departmentPrefix + displayMessage;

document.getElementById('displayMsg').innerHTML = fullMessage;

    // ========================================================================
    // UPDATE HIGHLIGHTS (Highlights Section) - WITH DESCRIPTIONS
    // ========================================================================

    const highlightsList = document.getElementById('highlightsList');
    highlightsList.innerHTML = '';

    const icons = ['🧠', '🔓', '📈', '⚡', '🔍', '🎮', '💻'];

    const descriptions = {
        'HACK_A_MIN': 'A lightning-fast one-minute challenge where every second counts. Race against the clock to build, debug, or solve problems in just 60 seconds of pure adrenaline.',
        'UNLOCK_VERSE': 'An immersive escape room challenge with mind-bending puzzles and brain teasers. Race against time to crack codes, solve riddles, and escape before the clock runs out.',
        'VIRTUAL_STOCK_MARKET': 'Real-time trading simulation with virtual currency and live market dynamics. Compete to build the most profitable portfolio using strategic analysis.',
        'CODE_EVOLUTION': 'Progressive coding competition with escalating difficulty levels. Solve algorithmic challenges that grow from basics to advanced problems.',
        'QR_TECH_HUNT': 'Technology-driven treasure hunt using QR codes and tech riddles. Scan codes and solve challenges to progress through this interactive adventure.',
        'LAN_GAMING': 'Competitive gaming tournaments featuring popular titles including Mini Militia, Asphalt 8, and Valorant. Showcase your skills and dominate the competition.'
    };

    dept.highlights.forEach((highlight, index) => {
    const normalizedName = highlight.toUpperCase().replace(/ /g, '_');
    const description = descriptions[normalizedName] || 'An exciting event awaits! More details coming soon.';
    
    const box = document.createElement('div');
    box.className = 'highlight-box';
    
    // ✅ USE EVENT LISTENER INSTEAD OF ONCLICK ATTRIBUTE
    box.addEventListener('click', function() {
        window.toggleEventDescription(this);
    });
    
    box.innerHTML = `
        <div class="box-border"></div>
        <div class="box-glow"></div>
        <div class="box-icon">${icons[index % icons.length]}</div>
        <span class="box-text">${normalizedName}</span>
        <div class="box-description">${description}</div>
        <div class="expand-indicator">▼</div>
        <div class="box-pulse"></div>
        <button class="register-btn" onclick="event.stopPropagation(); window.open('https://docs.google.com/forms/d/e/1FAIpQLSckiudsm6emWhm5OwGeyQF0TVPpX-5oEnIF3gNjbM0xunYYJg/viewform', '_blank')">
            <span class="btn-text">REGISTER NOW</span>
            <span class="btn-icon">→</span>
        </button>
    `;
    highlightsList.appendChild(box);
});
}

/**
 * Display default/public invitation when no department is specified
 * Tries to load PUBLIC invitation first, then falls back to first saved department,
 * or uses hardcoded defaults as last resort
 */
async function displayDefaultInvitation() {
    // Event descriptions object (used in all three scenarios)
    const descriptions = {
    'HACK_A_MIN': 'A lightning-fast one-minute challenge where every second counts. Race against the clock to build, debug, or solve problems in just 60 seconds of pure adrenaline.',
    'UNLOCK_VERSE': 'An immersive escape room challenge with mind-bending puzzles and brain teasers. Race against time to crack codes, solve riddles, and escape before the clock runs out.',
    'VIRTUAL_STOCK_MARKET': 'Real-time trading simulation with virtual currency and live market dynamics. Compete to build the most profitable portfolio using strategic analysis.',
    'CODE_EVOLUTION': 'Progressive coding competition with escalating difficulty levels. Solve algorithmic challenges that grow from basics to advanced problems.',
    'QR_TECH_HUNT': 'Technology-driven treasure hunt using QR codes and tech riddles. Scan codes and solve challenges to progress through this interactive adventure.',
    'LAN_GAMING': 'Competitive gaming tournaments featuring popular titles including Mini Militia, Asphalt 8, and Valorant. Showcase your skills and dominate the competition.'
};

    // ========================================================================
    // SCENARIO 1: Load PUBLIC invitation
    // ========================================================================
    const publicData = await UniversalStorage.get('dept:PUBLIC', true);
    
    if (publicData) {
        departments['PUBLIC'] = publicData;
        
        const deptSection = document.getElementById('deptSection');
        if (deptSection) deptSection.style.display = 'none';
        
        document.getElementById('displayEventName').textContent = publicData.eventName;
        document.getElementById('displayEventName').setAttribute('data-text', publicData.eventName);

        const taglineParts = publicData.tagline.split('•').map(word => word.trim());
        const taglineHTML = taglineParts.map(word =>
            `<span class="subtitle-word">${word}</span>`
        ).join('<span class="subtitle-dot">•</span>');
        document.getElementById('displayTagline').innerHTML = taglineHTML;

        document.getElementById('displayDate').textContent = publicData.date;
        document.getElementById('displayTime').textContent = publicData.time;
        document.getElementById('displayVenue').textContent = publicData.venue;
        document.getElementById('displayMsg').textContent = publicData.message;

        const highlightsList = document.getElementById('highlightsList');
        highlightsList.innerHTML = '';
        const icons = ['🧠', '🔓', '📈', '⚡', '🔍', '🎮'];

        // ✅ FIXED: Add descriptions and click handlers
        publicData.highlights.forEach((highlight, index) => {
            const normalizedName = highlight.toUpperCase().replace(/ /g, '_');
            const description = descriptions[normalizedName] || 'An exciting event awaits! More details coming soon.';
            
            const box = document.createElement('div');
            box.className = 'highlight-box';
            
            box.addEventListener('click', function() {
                window.toggleEventDescription(this);
            });
            
            box.innerHTML = `
    <div class="box-border"></div>
    <div class="box-glow"></div>
    <div class="box-icon">${icons[index % icons.length]}</div>
    <span class="box-text">${normalizedName}</span>
    <div class="box-description">${description}</div>
    <div class="expand-indicator">▼</div>
    <div class="box-pulse"></div>
    <button class="register-btn" onclick="event.stopPropagation(); window.open('https://docs.google.com/forms/d/e/1FAIpQLSckiudsm6emWhm5OwGeyQF0TVPpX-5oEnIF3gNjbM0xunYYJg/viewform', '_blank')">
        <span class="btn-text">REGISTER NOW</span>
        <span class="btn-icon">→</span>
    </button>
`;
            highlightsList.appendChild(box);
        });

        console.log('✅ Loaded FRESH PUBLIC data:', publicData);
        return;
    }
    
    // ========================================================================
    // SCENARIO 2: Load first department
    // ========================================================================
    const deptKeys = await UniversalStorage.list('dept:', true);
    
    if (deptKeys && deptKeys.length > 0) {
        for (let key of deptKeys) {
            const deptId = key.replace('dept:', '');
            if (deptId !== 'PUBLIC') {
                const freshData = await UniversalStorage.get(key, true);
                if (freshData) {
                    departments[deptId] = freshData;
                }
            }
        }
        
        const firstDeptId = Object.keys(departments).filter(k => k !== 'PUBLIC')[0];
        const firstDept = departments[firstDeptId];
        
        if (firstDept) {
            const deptSection = document.getElementById('deptSection');
            if (deptSection) deptSection.style.display = 'none';
            
            document.getElementById('displayEventName').textContent = firstDept.eventName || 'DOTTECH';
            document.getElementById('displayEventName').setAttribute('data-text', firstDept.eventName || 'DOTTECH');

            const taglineParts = (firstDept.tagline || 'INNOVATE • DOMINATE • ELEVATE').split('•').map(word => word.trim());
            const taglineHTML = taglineParts.map(word =>
                `<span class="subtitle-word">${word}</span>`
            ).join('<span class="subtitle-dot">•</span>');
            document.getElementById('displayTagline').innerHTML = taglineHTML;

            document.getElementById('displayDate').textContent = firstDept.date;
            document.getElementById('displayTime').textContent = firstDept.time;
            document.getElementById('displayVenue').textContent = firstDept.venue;
            document.getElementById('displayMsg').textContent = firstDept.message || PROFESSIONAL_INVITATION;

            const highlightsList = document.getElementById('highlightsList');
            highlightsList.innerHTML = '';
            const icons = ['🧠', '🔓', '📈', '⚡', '🔍', '🎮'];

            // ✅ FIXED: Add descriptions and click handlers
            firstDept.highlights.forEach((highlight, index) => {
                const normalizedName = highlight.toUpperCase().replace(/ /g, '_');
                const description = descriptions[normalizedName] || 'An exciting event awaits! More details coming soon.';
                
                const box = document.createElement('div');
                box.className = 'highlight-box';
                
                box.addEventListener('click', function() {
                    window.toggleEventDescription(this);
                });
                
                box.innerHTML = `
    <div class="box-border"></div>
    <div class="box-glow"></div>
    <div class="box-icon">${icons[index % icons.length]}</div>
    <span class="box-text">${normalizedName}</span>
    <div class="box-description">${description}</div>
    <div class="expand-indicator">▼</div>
    <div class="box-pulse"></div>
`;
                highlightsList.appendChild(box);
            });

            console.log('✅ Loaded FRESH first department:', firstDeptId);
            return;
        }
    }
    
    // ========================================================================
    // SCENARIO 3: Fallback defaults
    // ========================================================================
    const deptSection = document.getElementById('deptSection');
    if (deptSection) deptSection.style.display = 'none';
    
    document.getElementById('displayEventName').textContent = 'DOTTECH';
    document.getElementById('displayEventName').setAttribute('data-text', 'DOTTECH');

    const defaultTagline = 'INNOVATE • DOMINATE • ELEVATE';
    const taglineParts = defaultTagline.split('•').map(word => word.trim());
    const taglineHTML = taglineParts.map(word =>
        `<span class="subtitle-word">${word}</span>`
    ).join('<span class="subtitle-dot">•</span>');
    document.getElementById('displayTagline').innerHTML = taglineHTML;

    document.getElementById('displayDate').textContent = 'MARCH 15-17, 2026';
    document.getElementById('displayTime').textContent = '09:00 - 18:00 HRS';
    document.getElementById('displayVenue').textContent = 'MAIN AUDITORIUM NEXUS';
    document.getElementById('displayMsg').textContent = PROFESSIONAL_INVITATION;

    const highlightsList = document.getElementById('highlightsList');
    highlightsList.innerHTML = '';
    const defaultHighlights = [
        'HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET',
        'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING'
    ];
    const icons = ['🧠', '🔓', '📈', '⚡', '🔍', '🎮'];

    // ✅ FIXED: Add descriptions and click handlers
    defaultHighlights.forEach((highlight, index) => {
        const normalizedName = highlight.toUpperCase().replace(/ /g, '_');
        const description = descriptions[normalizedName] || 'An exciting event awaits! More details coming soon.';
        
        const box = document.createElement('div');
        box.className = 'highlight-box';
        
        box.addEventListener('click', function() {
            window.toggleEventDescription(this);
        });
        
        box.innerHTML = `
        <div class="box-border"></div>
        <div class="box-glow"></div>
        <div class="box-icon">${icons[index]}</div>
        <span class="box-text">${normalizedName}</span>
        <div class="box-description">${description}</div>
        <div class="expand-indicator">▼</div>
        <div class="box-pulse"></div>
        <button class="register-btn" onclick="event.stopPropagation(); window.open('https://docs.google.com/forms/d/e/1FAIpQLSckiudsm6emWhm5OwGeyQF0TVPpX-5oEnIF3gNjbM0xunYYJg/viewform', '_blank')">
            <span class="btn-text">REGISTER NOW</span>
            <span class="btn-icon">→</span>
        </button>
    `;
        highlightsList.appendChild(box);
    });

    console.log('⚠️ Using fallback defaults');
}

// ============================================================================
// PARALLAX SCROLL EFFECTS
// Creates depth and motion effects when scrolling through sections
// ============================================================================

// Performance optimization variables
let ticking = false;
let scrollPosition = 0;

/**
 * Scroll event listener with RAF (RequestAnimationFrame) throttling
 * Prevents excessive function calls for better performance
 */
window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;

    // Only update once per frame using RAF
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

/**
 * Update parallax effects for all sections based on scroll position
 * Each section has different transform and opacity animations
 */
function updateParallax() {
    const scrolled = scrollPosition;

    // ========================================================================
    // HERO SECTION PARALLAX
    // Elements move at different speeds creating depth effect
    // ========================================================================
    
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

        if (heroVisible) {
            const heroTitle = document.querySelector('.hero-title');
            const yearDisplay = document.querySelector('.year-display');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const scrollIndicator = document.querySelector('.scroll-indicator');

            // Title moves slower and fades as user scrolls
            if (heroTitle) {
                heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroTitle.style.opacity = Math.max(0.4, 1 - scrolled * 0.0015);
            }

            // Year display moves faster than title
            if (yearDisplay) {
                yearDisplay.style.transform = `translateY(${scrolled * 0.4}px)`;
                yearDisplay.style.opacity = Math.max(0.3, 1 - scrolled * 0.0018);
            }

            // Subtitle moves slightly slower
            if (heroSubtitle) {
                heroSubtitle.style.transform = `translateY(${scrolled * 0.25}px)`;
                heroSubtitle.style.opacity = Math.max(0.3, 1 - scrolled * 0.0015);
            }

            // Scroll indicator fades out quickly
            if (scrollIndicator) {
                scrollIndicator.style.opacity = Math.max(0, 1 - scrolled * 0.003);
            }
        }
    }

    // ========================================================================
    // DEPARTMENT SECTION PARALLAX
    // Scale and fade in effect when scrolling into view
    // ========================================================================
    
    const deptSection = document.getElementById('deptSection');
    if (deptSection) {
        const deptRect = deptSection.getBoundingClientRect();
        const deptVisible = deptRect.top < window.innerHeight && deptRect.bottom > 0;

        if (deptVisible) {
            // Calculate progress (0 to 1) based on visibility
            const deptProgress = Math.max(0, Math.min(1, (window.innerHeight - deptRect.top) / window.innerHeight));
            const deptName = document.querySelector('.dept-name');
            const deptFrame = document.querySelector('.dept-frame');

            // Department name slides up and fades in
            if (deptName) {
                deptName.style.transform = `translateY(${(1 - deptProgress) * 50}px)`;
                deptName.style.opacity = deptProgress;
            }

            // Frame scales up as it comes into view
            if (deptFrame) {
                deptFrame.style.transform = `scale(${0.9 + deptProgress * 0.1})`;
            }
        }
    }

    // ========================================================================
    // MESSAGE SECTION PARALLAX
    // 3D rotation effect for terminal window
    // ========================================================================
    
    const messageSection = document.getElementById('messageSection');
    if (messageSection) {
        const msgRect = messageSection.getBoundingClientRect();
        const msgVisible = msgRect.top < window.innerHeight && msgRect.bottom > 0;

        if (msgVisible) {
            const msgProgress = Math.max(0, Math.min(1, (window.innerHeight - msgRect.top) / window.innerHeight));
            const terminal = document.querySelector('.terminal-window');

            // Terminal rotates into view with 3D perspective
            if (terminal) {
                terminal.style.transform = `
                    translateY(${(1 - msgProgress) * 80}px) 
                    rotateX(${(1 - msgProgress) * 25}deg) 
                    rotateZ(${(1 - msgProgress) * -5}deg)
                `;
                terminal.style.opacity = msgProgress;
            }
        }
    }

    // ========================================================================
    // DETAILS SECTION PARALLAX
    // Staggered card animations from different directions
    // ========================================================================
    
    const detailsSection = document.getElementById('detailsSection');
    if (detailsSection) {
        const detailsRect = detailsSection.getBoundingClientRect();
        const detailsVisible = detailsRect.top < window.innerHeight && detailsRect.bottom > 0;

        if (detailsVisible) {
            const detailsProgress = Math.max(0, Math.min(1, (window.innerHeight - detailsRect.top) / window.innerHeight));
            const cards = document.querySelectorAll('.detail-card');

            // Each card animates with a delay and alternating direction
            cards.forEach((card, index) => {
                const delay = index * 0.15;  // Stagger animation
                const cardProgress = Math.max(0, Math.min(1, (detailsProgress - delay) * 1.8));

                // Alternate left/right direction
                const direction = index % 2 === 0 ? -1 : 1;
                
                // Cards slide in from sides with 3D rotation
                card.style.transform = `
                    translateX(${(1 - cardProgress) * direction * 120}px) 
                    translateY(${(1 - cardProgress) * 80}px)
                    rotateY(${(1 - cardProgress) * direction * 30}deg)
                `;
                card.style.opacity = cardProgress;
            });
        }
    }

    // ========================================================================
    // HIGHLIGHTS SECTION PARALLAX
    // Title scales and boxes slide up with stagger
    // ========================================================================
    
    const highlightsSection = document.getElementById('highlightsSection');
    if (highlightsSection) {
        const highlightsRect = highlightsSection.getBoundingClientRect();
        const highlightsVisible = highlightsRect.top < window.innerHeight && highlightsRect.bottom > 0;

        if (highlightsVisible) {
            const highlightsProgress = Math.max(0, Math.min(1, (window.innerHeight - highlightsRect.top) / window.innerHeight));
            const sectionTitle = document.querySelector('.section-title');
            const boxes = document.querySelectorAll('.highlight-box');

            // Title scales and slides into view
            if (sectionTitle) {
                sectionTitle.style.transform = `scale(${0.6 + highlightsProgress * 0.4}) translateY(${(1 - highlightsProgress) * 50}px)`;
                sectionTitle.style.opacity = highlightsProgress;
            }

            // Each highlight box slides up with delay
            boxes.forEach((box, index) => {
                const delay = index * 0.08;  // Shorter delay for faster cascade
                const boxProgress = Math.max(0, Math.min(1, (highlightsProgress - delay) * 1.5));
                
                box.style.transform = `
                    translateY(${(1 - boxProgress) * 120}px) 
                    scale(${0.7 + boxProgress * 0.3})
                `;
                box.style.opacity = boxProgress;
            });
        }
    }

    // ========================================================================
    // FOOTER SECTION PARALLAX
    // Final section fade-in and slide-up effects
    // ========================================================================
    
    const footerSection = document.getElementById('footerSection');
    if (footerSection) {
        const footerRect = footerSection.getBoundingClientRect();
        const footerVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;

        if (footerVisible) {
            const footerProgress = Math.max(0, Math.min(1, (window.innerHeight - footerRect.top) / window.innerHeight));
            const footerText = document.querySelector('.footer-text');
            const binaryBlocks = document.querySelectorAll('.binary-block');

            // Footer text slides up
            if (footerText) {
                footerText.style.transform = `translateY(${(1 - footerProgress) * 60}px)`;
                footerText.style.opacity = footerProgress;
            }

            // Binary blocks scale horizontally with stagger
            binaryBlocks.forEach((block, index) => {
                const delay = index * 0.1;
                const blockProgress = Math.max(0, Math.min(1, (footerProgress - delay) * 1.5));
                block.style.transform = `translateY(${(1 - blockProgress) * 40}px) scaleX(${blockProgress})`;
                block.style.opacity = blockProgress;
            });
        }
    }
}

// ============================================================================
// GLITCH EFFECTS
// Random glitch animation triggers for cyberpunk aesthetic
// ============================================================================

/**
 * Randomly trigger glitch effects on elements with .glitch class
 * Creates brief visual distortion for cyberpunk feel
 */
setInterval(() => {
    const glitchElements = document.querySelectorAll('.glitch');
    
    // 30% chance to trigger glitch effect
    if (glitchElements.length > 0 && Math.random() > 0.7) {
        // Pick random glitch element
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        
        // Reset animation to trigger it again
        randomElement.style.animation = 'none';
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 10);
    }
}, 8000); // Check every 8 seconds

// ============================================================================
// CURSOR TRAIL
// Creates glowing particle trail that follows mouse cursor
// ============================================================================

/**
 * Mouse move event listener that creates particle trail effect
 * Particles fade out and float upward
 */
document.addEventListener('mousemove', (e) => {
    // Only create particle 8% of the time (performance optimization)
    if (Math.random() > 0.92) {
        // Create trail particle element
        const trail = document.createElement('div');
        
        // Random neon color
        const colors = ['#00f3ff', '#ff00ff', '#00ff9d'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Style particle at cursor position
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.width = '6px';
        trail.style.height = '6px';
        trail.style.background = randomColor;
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';  // Don't interfere with clicks
        trail.style.zIndex = '9999';
        trail.style.boxShadow = `0 0 15px ${randomColor}`;
        trail.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

        document.body.appendChild(trail);

        // Animate particle (fade out and float up)
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0) translateY(-30px)';
        }, 10);

        // Remove from DOM after animation completes
        setTimeout(() => {
            document.body.removeChild(trail);
        }, 600);
    }
});

// ============================================================================
// DEFAULT DEPARTMENTS
// Pre-defined department data used on first launch
// ============================================================================

const defaultDepartments = {
    // BSc Computer Science & IT Department
    'BSCCSIT': {
        name: 'BSc COMPUTER SCIENCE & IT',
        eventName: 'DOTTECH',
        tagline: 'CODE • INNOVATE • TRANSFORM',
        date: 'JANUARY 30-31, 2026',
        time: '07:00 AM - 6:00 PM',
        venue: 'BSc CS/IT COMPUTER LAB',
        message: `Dear BSc CS/IT Student,

The Department of Computer Science & Information Technology cordially invites you to DOTTECH 2026, where innovation meets implementation.

Engage with cutting-edge developments in artificial intelligence, machine learning, web development, cybersecurity, and software engineering. Participate in intensive coding challenges, technical workshops, and collaborative projects that will enhance your skills and expand your professional network.

This is your opportunity to contribute to the future of computing and showcase your technical prowess alongside industry leaders and academic pioneers.

We eagerly await your participation.

Best Regards,
BSc CS/IT Department, DOTTECH 2026`,
        highlights: ['HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING']
    },
    
    // Bachelor of Management Studies Department
    'BMS': {
        name: 'BACHELOR OF MANAGEMENT STUDIES',
        eventName: 'DOTTECH',
        tagline: 'LEAD • MANAGE • SUCCEED',
        date: 'JANUARY 30-31, 2026',
        time: '07:00 AM - 6:00 PM',
        venue: 'BMS SEMINAR HALL',
        message: `Dear BMS Student,

The Bachelor of Management Studies Department is delighted to invite you to DOTTECH 2026, a premier technology and management symposium.

Explore the intersection of technology and business management. Participate in business simulations, leadership workshops, digital marketing sessions, and entrepreneurship forums. Learn how technology is transforming modern business practices and develop skills essential for tomorrow's business leaders.

Your participation will help bridge the gap between technology and management excellence.

Looking forward to welcoming you.

With Best Wishes,
BMS Department, DOTTECH 2026`,
        highlights: ['HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING']
    },
    
    // Bachelor of Business Administration Department
    'BBA': {
        name: 'BACHELOR OF BUSINESS ADMINISTRATION',
        eventName: 'DOTTECH',
        tagline: 'STRATEGIZE • EXECUTE • EXCEL',
        date: 'JANUARY 30-31, 2026',
        time: '07:00 AM - 6:00 PM',
        venue: 'BBA CONFERENCE ROOM',
        message: `Dear BBA Student,

The Bachelor of Business Administration Department extends a warm invitation to DOTTECH 2026, celebrating the fusion of business acumen and technological innovation.

Experience how emerging technologies are reshaping business landscapes. Join interactive sessions on digital transformation, fintech innovations, business analytics, and tech-driven entrepreneurship. Network with industry professionals and academic experts.

Your insights and participation will enrich this convergence of business and technology.

We look forward to your valuable presence.

Sincerely,
BBA Department, DOTTECH 2026`,
        highlights: ['HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING']
    }
};

// ============================================================================
// INITIALIZATION
// Main application startup sequence
// ============================================================================

/**
 * Window load event - initializes the entire application
 * Loads department data from storage or creates defaults
 */
window.addEventListener('load', async () => {
    console.log('🚀 DOTTECH Invitation System Initialized');

    const deptId = getDeptIdFromURL();
    const adminPortal = document.getElementById('adminPortal');

    // ========================================================================
    // ADMIN PORTAL VISIBILITY
    // Always hide admin button by default for security
    // ========================================================================
    
    adminPortal.style.display = 'none';
    
    // ========================================================================
    // SECRET ADMIN ACCESS FOR MOBILE
    // Allow admin access via URL parameter: ?secret=admin
    // Useful when keyboard shortcuts don't work (mobile devices)
    // ========================================================================
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('secret') === 'admin') {
        showAdminLogin();
    }

    // ========================================================================
    // LOAD DEPARTMENTS FROM STORAGE
    // Check if any saved departments exist
    // ========================================================================
    
    const keys = await UniversalStorage.list('dept:', true);
    
    if (keys && keys.length > 0) {
        // Saved data exists - load all departments
        console.log('✅ Loading saved departments...');
        
        for (let key of keys) {
            const storedDeptId = key.replace('dept:', '');
            const savedData = await UniversalStorage.get(key, true);
            
            if (savedData) {
                departments[storedDeptId] = savedData;
                console.log(`Loaded ${storedDeptId}`);
            }
        }
        
        console.log('📊 Total departments loaded:', Object.keys(departments).length);
    } else {
        // ====================================================================
        // FIRST TIME SETUP
        // No saved data - create default departments
        // ====================================================================
        
        console.log('📝 No saved data, creating defaults...');
        
        // Create default departments: BSc CS/IT, BMS, BBA
        for (let id in defaultDepartments) {
            departments[id] = defaultDepartments[id];
            await UniversalStorage.set(`dept:${id}`, defaultDepartments[id], true);
        }
        
        console.log('💾 Defaults saved: BSc CS/IT, BMS, BBA');
    }

    // ========================================================================
    // START INVITATION DISPLAY
    // Show loading animation and then invitation content
    // ========================================================================
    
    console.log('🎯 Final departments:', Object.keys(departments));
    showInvitation();
});

// ============================================================================
// KEYBOARD SHORTCUTS
// Ctrl+Shift+A to open admin panel (desktop only)
// ============================================================================

/**
 * Keyboard event listener for admin panel shortcut
 * Ctrl+Shift+A opens admin login
 */
document.addEventListener('keydown', (e) => {
    // Check for Ctrl+Shift+A combination
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();  // Prevent default browser behavior
        document.getElementById('adminPortal').style.display = 'block';
        showAdminLogin();
    }
});

// ============================================================================
// PUBLIC INVITATION MANAGEMENT
// Functions to edit the general public invitation (no department)
// ============================================================================

/**
 * Load PUBLIC invitation data into admin form for editing
 * PUBLIC invitation is shown when no department parameter is in URL
 */
function editPublicInvitation() {
    console.log('🌐 Edit Public Invitation');
    
    let publicData;
    
    // ========================================================================
    // PRIORITY 1: Load existing PUBLIC invitation
    // ========================================================================
    
    if (departments['PUBLIC']) {
        publicData = departments['PUBLIC'];
    } 
    // ========================================================================
    // PRIORITY 2: Copy from first saved department
    // ========================================================================
    else {
        const deptKeys = Object.keys(departments).filter(k => k !== 'PUBLIC');
        
        if (deptKeys.length > 0) {
            // Clone first department's data for public invitation
            const firstDept = departments[deptKeys[0]];
            publicData = {
                eventName: firstDept.eventName,
                tagline: firstDept.tagline,
                date: firstDept.date,
                time: firstDept.time,
                venue: firstDept.venue,
                message: firstDept.message,
                highlights: [...firstDept.highlights]  // Clone array
            };
        } 
        // ====================================================================
        // PRIORITY 3: Use default values
        // ====================================================================
        else {
            publicData = {
                eventName: 'DOTTECH',
                tagline: 'INNOVATE • DOMINATE • ELEVATE',
                date: 'JANUARY 30-31, 2026',
                time: '07:00 AM - 6:00 PM',
                venue: 'NEW BUILDING',
                message: PROFESSIONAL_INVITATION,
                highlights: ['HACK A MIN', 'UNLOCK VERSE', 'VIRTUAL STOCK MARKET', 'CODE EVOLUTION', 'QR TECH HUNT', 'LAN GAMING']
            };
        }
    }

    // ========================================================================
    // POPULATE FORM WITH PUBLIC INVITATION DATA
    // Lock Department ID and Name fields since it's PUBLIC
    // ========================================================================
    
    document.getElementById('deptSelector').value = '';
    document.getElementById('deptId').value = 'PUBLIC';
    document.getElementById('deptId').disabled = true;  // Prevent editing
    document.getElementById('deptName').value = '-- PUBLIC INVITATION --';
    document.getElementById('deptName').disabled = true;  // Prevent editing
    document.getElementById('eventName').value = publicData.eventName;
    document.getElementById('eventTagline').value = publicData.tagline;
    document.getElementById('eventDate').value = publicData.date;
    document.getElementById('eventTime').value = publicData.time;
    document.getElementById('eventVenue').value = publicData.venue;
    document.getElementById('invitationMsg').value = publicData.message;
    document.getElementById('highlights').value = publicData.highlights.join(', ');

    // Show instruction alert
    alert('📝 Now editing PUBLIC INVITATION\n\nThis is what visitors see without a department code.\n\nClick "SAVE DATA" when done.');
}

// ============================================================================
// BACKUP/EXPORT FUNCTIONS
// Functions to export and import all department data as JSON
// ============================================================================

/**
 * Export all department data to a JSON file
 * Creates a downloadable backup of all invitations
 */
async function exportAllData() {
    try {
        const allData = {};
        
        // Get all department keys from storage
        const keys = await UniversalStorage.list('dept:', true);
        
        // Validate data exists
        if (!keys || keys.length === 0) {
            alert('⚠️ NO DATA TO EXPORT\n\nPlease create some departments first.');
            return;
        }
        
        // ====================================================================
        // COLLECT ALL DEPARTMENT DATA
        // ====================================================================
        
        for (let key of keys) {
            const data = await UniversalStorage.get(key, true);
            if (data) {
                allData[key] = data;
            }
        }
        
        // ====================================================================
        // CREATE AND DOWNLOAD JSON FILE
        // ====================================================================
        
        // Convert to formatted JSON string
        const dataStr = JSON.stringify(allData, null, 2);
        
        // Create blob from JSON string
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Generate filename with current date
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Create and trigger download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `DOTTECH-backup-${timestamp}.json`;
        link.click();
        
        // Clean up object URL
        URL.revokeObjectURL(url);
        
        // Show success message
        alert('✅ BACKUP EXPORTED SUCCESSFULLY\n\nFile: DOTTECH-backup-' + timestamp + '.json\n\nDepartments exported: ' + keys.length);
        
        console.log('✅ Backup exported:', keys.length, 'departments');
        
    } catch (error) {
        // ====================================================================
        // ERROR HANDLING
        // ====================================================================
        
        console.error('❌ Export error:', error);
        alert('❌ FAILED TO EXPORT BACKUP\n\nError: ' + error.message);
    }
}

// ============================================================================
// HELPER FUNCTION: Import Data from Backup
// Allows restoring departments from a previously exported JSON file
// ============================================================================

/**
 * Import department data from a JSON backup file
 * Opens file picker and restores all departments
 */
function importData() {
    // Create hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    // Handle file selection
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            // ================================================================
            // READ AND PARSE JSON FILE
            // ================================================================
            
            const text = await file.text();
            const data = JSON.parse(text);
            
            // ================================================================
            // VALIDATE DATA STRUCTURE
            // ================================================================
            
            if (typeof data !== 'object') {
                throw new Error('Invalid backup file format');
            }
            
            // ================================================================
            // CONFIRMATION DIALOG
            // Warn user about overwriting existing data
            // ================================================================
            
            const deptCount = Object.keys(data).length;
            if (!confirm(`📥 IMPORT BACKUP?\n\nThis will import ${deptCount} department(s).\n\nExisting departments with the same ID will be overwritten.\n\nContinue?`)) {
                return;
            }
            
            // ================================================================
            // IMPORT ALL DEPARTMENTS
            // ================================================================
            
            let importedCount = 0;
            
            for (let key in data) {
                // Only import keys with 'dept:' prefix
                if (key.startsWith('dept:')) {
                    await UniversalStorage.set(key, data[key], true);
                    
                    const deptId = key.replace('dept:', '');
                    departments[deptId] = data[key];
                    importedCount++;
                }
            }
            
            // ================================================================
            // RELOAD UI AND SHOW SUCCESS
            // ================================================================
            
            // Reload dropdown selector in admin panel
            await loadAllDepartments();
            
            // Show success message
            alert(`✅ BACKUP IMPORTED SUCCESSFULLY\n\nDepartments imported: ${importedCount}\n\nRefresh the page to see all changes.`);
            
            console.log('✅ Backup imported:', importedCount, 'departments');
            
        } catch (error) {
            // ================================================================
            // ERROR HANDLING
            // ================================================================
            
            console.error('❌ Import error:', error);
            alert('❌ FAILED TO IMPORT BACKUP\n\nError: ' + error.message + '\n\nPlease ensure you selected a valid DOTTECH backup file.');
        }
    };
    
    // Trigger file picker
    input.click();
}

// ============================================================================
// MOBILE PERFORMANCE - WITH SCROLL BRIGHTNESS CONTROL
// ============================================================================

if (window.innerWidth <= 768) {
    // Kill heavy animation functions
    window.updateParallax = function() {};
    window.drawMatrix = function() {};
    window.animateParticles = function() {};
    
    // Remove heavy event listeners
    window.removeEventListener('scroll', updateParallax);
    window.removeEventListener('mousemove', () => {});
    
    // Clear intervals (keep only essential ones)
    const highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
        if (i > 10) { // Keep first 10 for essential functions
            clearInterval(i);
        }
    }
    
    // ========================================================================
    // SCROLL BRIGHTNESS CONTROL - Lighter up, Darker down
    // ========================================================================
    
    let lastScrollY = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        if (currentScrollY < lastScrollY) {
            // Scrolling UP - Lighter theme
            document.body.classList.add('scrolled-up');
            document.body.classList.remove('scrolled-down');
        } else if (currentScrollY > lastScrollY) {
            // Scrolling DOWN - Darker theme
            document.body.classList.add('scrolled-down');
            document.body.classList.remove('scrolled-up');
        }
        
        lastScrollY = currentScrollY;
        
        // Optimize pointer events during scroll
        document.body.style.pointerEvents = 'none';
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.style.pointerEvents = 'auto';
            
            // Reset classes after scroll stops
            setTimeout(() => {
                document.body.classList.remove('scrolled-up', 'scrolled-down');
            }, 300);
        }, 50);
    }, { passive: true });
    
    // Force everything visible on load
    document.addEventListener('DOMContentLoaded', function() {
        // Make all sections visible
        const sections = document.querySelectorAll('section, .section-content, .detail-card, .highlight-box, .terminal-window');
        sections.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        
        // Fix body background
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundColor = '#05081a';
    });
    
    // Disable RAF loops except essential ones
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        // Allow cursor blink and loading animations
        if (callback && (callback.toString().includes('cursor') || callback.toString().includes('loading'))) {
            return originalRAF(callback);
        }
        return null;
    };
}

/**
 * Toggle individual event description
 * Only the clicked box expands/collapses without affecting others
 */
window.toggleEventDescription = function(box) {
    // Simply toggle the 'expanded' class on THIS box only
    box.classList.toggle('expanded');
}

// ============================================================================
// SPONSOR BADGE CLICK HANDLER - MOBILE OPTIMIZED (NO ANIMATION)
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    const sponsorBadge = document.querySelector('.sponsor-badge-oneline');
    
    if (sponsorBadge) {
        sponsorBadge.addEventListener('click', function() {
            // Mobile: Instant toggle without animation
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
                
                // Force instant display (no transition)
                const description = this.querySelector('.sponsor-description');
                if (description) {
                    if (this.classList.contains('expanded')) {
                        description.style.display = 'block';
                        description.style.maxHeight = 'none';
                        description.style.opacity = '1';
                    } else {
                        description.style.display = 'none';
                        description.style.maxHeight = '0';
                        description.style.opacity = '0';
                    }
                }
            } else {
                // Desktop: Keep smooth animation
                this.classList.toggle('expanded');
            }
        });
    }
});