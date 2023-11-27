import { NavigateFunction } from "react-router-dom";
import { Menu } from "@/stores/sideMenuSlice";
import { slideUp, slideDown } from "@/utils/helper";
import { router } from '@inertiajs/react'
import _ from 'lodash'

export interface FormattedMenu extends Menu {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
  permission?: string[];
}

// Setup side menu
const findActiveMenu = (subMenu: Menu[], location: string | undefined): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (location !== undefined && item.pathname?.endsWith(location) && !item.ignore) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, location);
    }
  });
  return match;
};

const nestedMenu = (menu: Array<Menu | "divider">, location: string | undefined, role: string, permissions: string[], pricingPolicy: string,) => {
  const formattedMenu: Array<FormattedMenu | "divider"> = [];
  menu.forEach((item) => {
    if (typeof item !== "string") {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        pathname: item.pathname,
        subMenu: item.subMenu,
        ignore: item.ignore,
        permission: item.permission,
      };
      menuItem.active = location !== undefined && (menuItem.pathname?.endsWith(location) || (menuItem.subMenu && findActiveMenu(menuItem.subMenu, location))) && !menuItem.ignore;

      if (menuItem.subMenu) {

        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, location);

        // Nested menu
        const subMenu: Array<FormattedMenu> = [];
        if(pricingPolicy === 'person_based' && menuItem.title === 'Fiyatlandırma') {
          subMenu.push({
            icon: 'UserPlus2',
              title: 'Misafir Varyasyonları',
              pathname: 'hotel.possibilities_of_guests.index',
              permission: ['possibilities_of_guests.index'],
          });
          subMenu.push({
            icon: 'Percent',
              title: 'Varyasyon Çarpanları',
            pathname: 'hotel.possibilities_multipliers.index',
            permission: ['possibilities_multipliers.index'],
          });
        }
        nestedMenu(menuItem.subMenu, location, role, permissions, pricingPolicy).map(
          (menu) => typeof menu !== "string" && subMenu.push(menu)
        );
        menuItem.subMenu = subMenu;
      }
      if(role !== 'Super Admin') {
        if(permissions && permissions.find((permission) =>  _.includes(menuItem.permission, permission))) {
          formattedMenu.push(menuItem);
        }
      } else {
        formattedMenu.push(menuItem);
      }
    } else {
      formattedMenu.push(item);
    }
  });
  return formattedMenu;
};

const linkTo = (menu: FormattedMenu) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pathname !== undefined) {
        router.visit(menu.pathname);
    }
  }
};

const enter = (el: HTMLElement) => {
  slideDown(el, 300);
};

const leave = (el: HTMLElement) => {
  slideUp(el, 300);
};

export { nestedMenu, linkTo, enter, leave };
