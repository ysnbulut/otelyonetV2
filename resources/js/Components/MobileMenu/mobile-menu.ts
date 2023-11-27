import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { slideUp, slideDown } from "@/utils/helper";
import { FormattedMenu } from "@/types/side-menu";
import { router } from '@inertiajs/react'

const linkTo = (
  menu: FormattedMenu,
  setActiveMobileMenu: Dispatch<SetStateAction<boolean>>
) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pathname !== undefined) {
      setActiveMobileMenu(false);
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

export { linkTo, enter, leave };
