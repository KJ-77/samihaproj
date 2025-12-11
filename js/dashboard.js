// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const contentSections = document.querySelectorAll('.content-sections .content-section');
    const pageTitle = document.getElementById('pageTitle');
    const currentDateElement = document.getElementById('currentDate');
    const welcomeDateElement = document.getElementById('welcomeDate');

    // ============================================
    // DATE FUNCTIONALITY
    // ============================================
    function updateDate() {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        
        if (currentDateElement) {
            currentDateElement.textContent = today;
        }
        if (welcomeDateElement) {
            welcomeDateElement.textContent = today;
        }
    }

    // Update date on load
    updateDate();

    // ============================================
    // HAMBURGER MENU FUNCTIONALITY
    // ============================================
    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // ============================================
    // SIDEBAR NAVIGATION FUNCTIONALITY
    // ============================================
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Update active state in sidebar
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // 2. Show/Hide content sections
            const targetSectionId = item.getAttribute('data-section');
            
            // Get the text content of the item, excluding the icon
            const textElement = item.querySelector('span:not(.icon)');
            let newTitle = textElement ? textElement.textContent.trim() : item.textContent.trim();

            contentSections.forEach(section => {
                if (section.id === targetSectionId) {
                    section.classList.add('active');
                    section.classList.remove('hidden');
                } else {
                    section.classList.remove('active');
                    section.classList.add('hidden');
                }
            });

            // 3. Update header title
            if (pageTitle) {
                // Use the data-i18n attribute for the title so it gets translated
                const translationKey = item.getAttribute('data-i18n');
                if (translationKey) {
                    pageTitle.setAttribute('data-i18n', translationKey);
                    // Manually trigger translation update for the title if the i18n object is available
                    if (typeof applyTranslations === 'function') {
                        applyTranslations(localStorage.getItem('selectedLanguage') || 'en');
                    } else {
                        // Fallback to plain text if i18n is not loaded yet
                        pageTitle.textContent = newTitle;
                    }
                } else {
                    pageTitle.textContent = newTitle;
                }
            }

            // 4. Close sidebar on mobile after click
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('open');
            }
        });
    });

    // ============================================
    // LOGIN PAGE DEMO BUTTONS (Only for login.html)
    // ============================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const demoButtonsContainer = document.createElement('div');
        demoButtonsContainer.style.marginTop = '20px';
        demoButtonsContainer.style.textAlign = 'center';

        const adminDemoBtn = document.createElement('a');
        adminDemoBtn.href = 'admin-dashboard.html';
        adminDemoBtn.textContent = 'View Admin Dashboard (Demo)';
        adminDemoBtn.className = 'btn-full';
        adminDemoBtn.style.marginBottom = '10px';

        const userDemoBtn = document.createElement('a');
        userDemoBtn.href = 'user-dashboard.html';
        userDemoBtn.textContent = 'View User Dashboard (Demo)';
        userDemoBtn.className = 'btn-full';

        demoButtonsContainer.appendChild(adminDemoBtn);
        demoButtonsContainer.appendChild(userDemoBtn);

        // Find the main login button to insert the demo buttons after it
        const loginButton = loginForm.querySelector('button[type="submit"]');
        if (loginButton) {
            loginButton.parentNode.insertBefore(demoButtonsContainer, loginButton.nextSibling);
        }
    }

    // ============================================
    // LOGIN PAGE DEMO BUTTONS REDIRECTION
    // ============================================
    const demoAdmin = document.getElementById('demoAdmin');
    const demoUser = document.getElementById('demoUser');

    if (demoAdmin) {
        demoAdmin.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'admin-dashboard.html';
        });
    }

    if (demoUser) {
        demoUser.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'user-dashboard.html';
        });
    }
});
