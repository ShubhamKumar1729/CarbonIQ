/**
 * AI & ML Carbon Footprint Predictor
 * Professional Multi-Page Dashboard - JavaScript
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

let pieChartInstance = null;
let barChartInstance = null;
let lineChartInstance = null;
let radarChartInstance = null;

// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-theme');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });
}

// ============================================
// SIDEBAR TOGGLE
// ============================================

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.getElementById('mainContent').classList.toggle('expanded');
    });
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar || !mobileMenuToggle) {
            return;
        }

        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// ============================================
// CURRENT DATE DISPLAY
// ============================================

const currentDateElement = document.getElementById('currentDate');
if (currentDateElement) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
}

// ============================================
// ANIMATED COUNTER
// ============================================

function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Animate KPI values on page load
document.addEventListener('DOMContentLoaded', () => {
    const kpiValues = document.querySelectorAll('.kpi-value[data-target]');
    kpiValues.forEach((el, index) => {
        const target = parseFloat(el.dataset.target);
        if (!isNaN(target)) {
            setTimeout(() => {
                animateValue(el, 0, target, 2000);
            }, index * 100);
        }
    });
});

// ============================================
// TOOLTIP FUNCTIONALITY
// ============================================

document.querySelectorAll('.tooltip-icon').forEach(tooltip => {
    tooltip.addEventListener('mouseenter', (e) => {
        const text = e.currentTarget.getAttribute('data-tooltip');
        if (!text) return;
        
        const tooltipBox = document.createElement('div');
        tooltipBox.className = 'tooltip-box';
        tooltipBox.textContent = text;
        tooltipBox.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.85rem;
            z-index: 10000;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(tooltipBox);
        
        const rect = e.currentTarget.getBoundingClientRect();
        tooltipBox.style.top = `${rect.top - tooltipBox.offsetHeight - 8}px`;
        tooltipBox.style.left = `${rect.left + rect.width / 2 - tooltipBox.offsetWidth / 2}px`;
        
        e.currentTarget.tooltipBox = tooltipBox;
    });
    
    tooltip.addEventListener('mouseleave', (e) => {
        if (e.currentTarget.tooltipBox) {
            e.currentTarget.tooltipBox.remove();
            e.currentTarget.tooltipBox = null;
        }
    });
});

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// CHART UTILITIES
// ============================================

const chartColors = {
    primary: 'rgba(14, 165, 233, 0.85)',
    primaryBorder: 'rgba(14, 165, 233, 1)',
    secondary: 'rgba(139, 92, 246, 0.85)',
    secondaryBorder: 'rgba(139, 92, 246, 1)',
    success: 'rgba(16, 185, 129, 0.85)',
    successBorder: 'rgba(16, 185, 129, 1)',
    warning: 'rgba(245, 158, 11, 0.85)',
    warningBorder: 'rgba(245, 158, 11, 1)',
    danger: 'rgba(239, 68, 68, 0.85)',
    dangerBorder: 'rgba(239, 68, 68, 1)',
    info: 'rgba(59, 130, 246, 0.85)',
    infoBorder: 'rgba(59, 130, 246, 1)'
};

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#CBD5E1',
                padding: 15,
                font: {
                    family: 'Inter',
                    size: 12,
                    weight: '500'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: 16,
            titleFont: {
                size: 15,
                family: 'Inter',
                weight: '600'
            },
            bodyFont: {
                size: 14,
                family: 'Inter'
            },
            borderColor: 'rgba(14, 165, 233, 0.5)',
            borderWidth: 1,
            cornerRadius: 8
        }
    }
};

// ============================================
// EXPORT FUNCTIONS (if needed in other pages)
// ============================================

window.carbonApp = {
    animateValue,
    chartColors,
    commonChartOptions
};

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🌍 AI & ML Carbon Footprint Predictor', 'color: #0EA5E9; font-size: 20px; font-weight: bold;');
console.log('%cProfessional Multi-Page Dashboard', 'color: #8B5CF6; font-size: 14px;');
console.log('%cBuilt with Flask, Chart.js, and ❤️', 'color: #10B981; font-size: 12px;');