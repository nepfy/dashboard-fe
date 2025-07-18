export const MOBILE_MENU_STYLES = `
  .mobile-menu-toggle:checked ~ .mobile-menu-overlay {
    opacity: 1 !important;
    visibility: visible !important;
  }
  .mobile-menu-toggle:checked + label .hamburger-line-1 {
    transform: rotate(45deg) translateY(6px);
  }
  .mobile-menu-toggle:checked + label .hamburger-line-2 {
    opacity: 0;
  }
  .mobile-menu-toggle:checked + label .hamburger-line-3 {
    transform: rotate(-45deg) translateY(-6px);
  }
  body:has(.mobile-menu-toggle:checked) {
    overflow: hidden !important;
  }
`;
