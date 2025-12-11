// i18n.js
const translations = {};
let currentLanguage = 'en';

// Function to fetch translation files
async function fetchTranslations() {
    const languages = ['en', 'ar', 'fr'];
    for (const lang of languages) {
        try {
            const response = await fetch(`js/i18n/${lang}.json`);
            translations[lang] = await response.json();
        } catch (error) {
            console.error(`Could not load translation file for ${lang}:`, error);
        }
    }
}

// Function to apply translations to the page
function applyTranslations(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang] ? translations[lang][key] : key;
        if (translation) {
            // Check for a nested span with data-i18n-text to preserve icons/HTML structure
            const textSpan = element.querySelector('[data-i18n-text]');
            if (textSpan) {
                textSpan.textContent = translation;
            } else {
                // Otherwise, replace the entire text content
                element.textContent = translation;
            }
        }
    });

    // Handle RTL for Arabic
    const htmlElement = document.querySelector('html');
    if (lang === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
    } else {
        htmlElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
    }
    
    // Update the selected option in the dropdown
    const select = document.getElementById('languageSelect');
    if (select) {
        select.value = lang;
    }
}

// Event listener for language selection change
function setupLanguageSelector() {
    const select = document.getElementById('languageSelect');
    if (select) {
        select.addEventListener('change', (event) => {
            const newLang = event.target.value;
            localStorage.setItem('selectedLanguage', newLang);
            applyTranslations(newLang);
        });
    }
}

// Initialization function
async function initI18n() {
    await fetchTranslations();
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    applyTranslations(savedLang);
    setupLanguageSelector();
}

// Run initialization
document.addEventListener('DOMContentLoaded', initI18n);
