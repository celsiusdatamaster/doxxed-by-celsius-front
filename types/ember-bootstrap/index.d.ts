declare module 'ember-bootstrap' {
  export interface BsDropdown {
    openDropdown: () => void;
    closeDropdown: () => void;
    toggleDropdown: () => void;
  }

  export interface BsModal {
    close: () => void;
  }

  export interface BsNavbar {}
}
