// Function to apply the theme
function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

// Function to toggle theme
function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("darkMode", !isDark);
    applyTheme(!isDark);
}

// Initialize theme from localStorage or system preference
function initTheme() {
    const themeToggle = document.getElementById("footerDarkToggle");

    // Check for saved user preference, if any, on initial load
    const savedTheme = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply theme based on saved preference or system preference
    const isDark = savedTheme === null ? systemPrefersDark : savedTheme === "true";

    // Update the toggle state and attach the event listener
    if (themeToggle) {
        themeToggle.checked = isDark;
        themeToggle.addEventListener("change", toggleTheme);
    }

    // Apply the theme
    applyTheme(isDark);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initTheme);

// ===================================== Mobile Menu (Offcanvas) =====================================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const offcanvasMenu = document.getElementById("offcanvasMenu");
const offcanvasOverlay = document.getElementById("offcanvasOverlay");
const closeOffcanvas = document.getElementById("closeOffcanvas");
const links = document.querySelectorAll(".link");

// Open Offcanvas Menu
mobileMenuBtn.addEventListener("click", () => {
    offcanvasMenu.classList.add("active");
    offcanvasOverlay.classList.add("active");
});

// Close Offcanvas Menu
closeOffcanvas.addEventListener("click", () => {
    offcanvasMenu.classList.remove("active");
    offcanvasOverlay.classList.remove("active");
});

// Close offcanvas when clicking outside (on the overlay)
offcanvasOverlay.addEventListener("click", () => {
    offcanvasMenu.classList.remove("active");
    offcanvasOverlay.classList.remove("active");
});

// Close offcanvas when clicking on any general link (Redundant with mobileMenuLinks, but kept for compatibility)
links.forEach((link) => {
    link.addEventListener("click", () => {
        offcanvasMenu.classList.remove("active");
        offcanvasOverlay.classList.remove("active");
    });
});

// Toggle submenu visibility with improved handling
const submenuToggles = document.querySelectorAll(".offcanvas-submenu-toggle");
const allSubmenus = document.querySelectorAll(".offcanvas-submenu");

submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const submenuId = toggle.getAttribute("data-submenu");
        const currentSubmenu = document.getElementById(submenuId);
        const isAlreadyActive = currentSubmenu.classList.contains("active");

        // Toggle current submenu
        currentSubmenu.classList.toggle("active", !isAlreadyActive);
        toggle.classList.toggle("active", !isAlreadyActive);
    });
});

// Close mobile menu when clicking on any link inside the menu
const mobileMenuLinks = document.querySelectorAll("#offcanvasMenu a");
mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
            // Only on mobile screen sizes
            // Close the mobile menu
            offcanvasMenu.classList.remove("active");
            offcanvasOverlay.classList.remove("active");
        }
    });
});
// ==============================================================================================

// ===================================== Mobile Sidebar Functionality (for content navigation) ======================================
const mobileMenuButton = document.getElementById("mobile-menu-button");
const closeSidebarButton = document.getElementById("close-sidebar");
const mobileSidebar = document.getElementById("mobile-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

// Toggle mobile sidebar visibility and overflow state
function toggleSidebar() {
    mobileSidebar.classList.toggle("translate-x-full");
    mobileSidebar.classList.toggle("sidebar-open");

    // Toggle backdrop visibility and scrolling
    if (mobileSidebar.classList.contains("sidebar-open")) {
        sidebarBackdrop.classList.remove("hidden");
        setTimeout(() => {
            sidebarBackdrop.classList.add("backdrop-visible");
        }, 10);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
        sidebarBackdrop.classList.remove("backdrop-visible");
        setTimeout(() => {
            sidebarBackdrop.classList.add("hidden");
        }, 300);
        document.body.style.overflow = "auto"; // Re-enable background scrolling
    }
}

// Event listeners for mobile menu toggle
if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", toggleSidebar);
}

if (closeSidebarButton) {
    closeSidebarButton.addEventListener("click", toggleSidebar);
}

if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", toggleSidebar);
}

// Close sidebar when clicking on a link (except dropdown toggles)
const mobileNavLinks = document.querySelectorAll("#mobile-sidebar a:not(.dropdown-btn)");
mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
            // Only close sidebar on mobile when a link is clicked
            toggleSidebar();
        }
    });
});

// ===================================== Desktop Dropdowns ======================================
const allDropdownBtns = document.querySelectorAll(".dropdown-btn");
const allDropdownMenus = document.querySelectorAll(".dropdown-menu");

allDropdownBtns.forEach((dropdownBtn) => {
    let dropdownMenu = dropdownBtn.nextElementSibling;
    if (!dropdownMenu || !dropdownMenu.classList.contains("dropdown-menu")) {
        // Fallback to searching within parent if the menu is not an immediate sibling
        dropdownMenu = dropdownBtn.parentElement.querySelector(".dropdown-menu");
    }

    dropdownBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isAlreadyActive = dropdownBtn.classList.contains("active");

        // Close all other dropdowns
        allDropdownBtns.forEach((btn) => {
            if (btn !== dropdownBtn) {
                btn.classList.remove("active");
            }
        });

        allDropdownMenus.forEach((menu) => {
            if (menu !== dropdownMenu) {
                menu.classList.remove("active");
            }
        });

        // Toggle current dropdown
        if (dropdownMenu) {
            dropdownMenu.classList.toggle("active", !isAlreadyActive);
            dropdownBtn.classList.toggle("active", !isAlreadyActive);
        }
    });

    if (dropdownMenu) {
        // Prevent closing when clicking inside the dropdown menu itself
        dropdownMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }
});

// Close all open dropdowns when clicking anywhere outside
document.addEventListener("click", () => {
    allDropdownBtns.forEach((btn) => btn.classList.remove("active"));
    allDropdownMenus.forEach((menu) => menu.classList.remove("active"));
});
// ==============================================================================================

// 2. --- Modals Logic ---
const signInModal = document.getElementById("sign-in-modal");
const createAccountModal = document.getElementById("create-account-modal");
const resetPasswordModal = document.getElementById("reset-password-modal");

// Open and close buttons/elements
const openSignInBtnDesktop = document.getElementById("open-sign-in-modal-desktop");
const openSignInBtnMobile = document.getElementById("open-sign-in-modal-mobile");
const closeButtons = document.querySelectorAll("[data-modal-close]");
const switchLinks = document.querySelectorAll("[data-modal-switch]");

function openModal(modal) {
    // Stop background scrolling when the modal is open
    document.body.style.overflow = "hidden";

    // Hide all modals first
    [signInModal, createAccountModal, resetPasswordModal].forEach((m) => {
        if (m) {
            m.classList.add("hidden", "opacity-0");
        }
    });

    // Show the requested modal
    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        setTimeout(() => {
            modal.classList.remove("opacity-0");
        }, 10);
    }
}

// Link opening the Sign In modal from the header/buttons
if (openSignInBtnDesktop) {
    openSignInBtnDesktop.addEventListener("click", () => openModal(signInModal));
}
if (openSignInBtnMobile) {
    openSignInBtnMobile.addEventListener("click", () => openModal(signInModal));
}

// Link closing the modals
closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const modalId = btn.closest(".fixed").id;
        closeModal(document.getElementById(modalId));
    });
});

function closeModal(modal) {
    if (!modal) return;
    modal.classList.add("opacity-0");
    setTimeout(() => {
        modal.classList.add("hidden");
        // Check if any other modal is open
        const anyModalOpen = [signInModal, createAccountModal, resetPasswordModal].some((m) => m && !m.classList.contains("hidden"));
        // Re-enable scrolling only if no modals are open
        if (!anyModalOpen) {
            document.body.style.overflow = "auto";
        }
    }, 300); // Hide after transition ends
}

// Link switching between modals (Sign In <-> Create Account <-> Reset Password)
switchLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetModalId = link.getAttribute("data-modal-switch");

        if (targetModalId === "sign-in") openModal(signInModal);
        else if (targetModalId === "create-account") openModal(createAccountModal);
        else if (targetModalId === "reset-password") openModal(resetPasswordModal);
    });
});

// Close when clicking on the backdrop
[signInModal, createAccountModal, resetPasswordModal].forEach((modal) => {
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
});
