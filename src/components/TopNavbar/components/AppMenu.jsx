import { findAllParent, findMenuItem, getAppMenuItems, getMenuItemFromURL } from '@/helpers/menu';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Col, Collapse, Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle, FormControl, Row } from 'react-bootstrap';
import { FaChevronDown, FaEllipsisH, FaSearch } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { FaEllipsis } from 'react-icons/fa6';

import { CATEGORY_MENU_ITEMS } from '@/assets/data/menu-items';

import CategoryMegaMenu from './CategoryMegaMenu';
export const MenuItemWithChildren = ({
  item,
  activeMenuItems,
  itemClassName,
  linkClassName,
  level
}) => {
  const level1 = level === 1;
  const Icon = item.icon;
  return <Dropdown as="li" className={itemClassName} drop={level >= 2 ? 'end' : undefined}>
      <DropdownToggle as={'a'} className={linkClassName} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <div className="icons-center">
          {Icon && <Icon className="me-1 fa-fw me-1" />}
          {item.label}
        </div>
        {!Icon && level1 ? <FaChevronDown size={12} /> : !level1 ? <FaEllipsis size={14} /> : ''}
      </DropdownToggle>
      <DropdownMenu as="ul" renderOnMount className="custom-navbar-dropdown-menu">
        {(item.children ?? []).map((child, idx) => <Fragment key={idx + child.key + idx}>
            {child.children ? <MenuItemWithChildren item={child} level={level + 1} activeMenuItems={activeMenuItems} itemClassName="dropdown-submenu" linkClassName={clsx('dropdown-item dropdown-toggle arrow-none d-flex align-items-center justify-content-between', {
          active: activeMenuItems?.includes(child.key)
        })} /> : <>
                <MenuItem item={child} level={level + 1} linkClassName={clsx(activeMenuItems?.includes(child.key) && 'active')} />
                {child.isMegaMenu && <CategoryMegaMenu />}
              </>}
          </Fragment>)}
      </DropdownMenu>
    </Dropdown>;
};
export const MenuItem = ({
  item,
  linkClassName,
  level
}) => {
  return <>
      <li>
        <MenuItemLink item={item} linkClassName={linkClassName} level={level + 1} />
      </li>
      {item.divider && <li>
          <DropdownDivider />
        </li>}
    </>;
};
const MenuItemLink = ({
  item,
  linkClassName
}) => {
  const Icon = item.icon;
  return <DropdownItem as={Link} to={item.url ?? ''} target={item.target} className={clsx(linkClassName, 'icons-center')}>
      {Icon && <Icon className="me-1 fa-fw me-1" />}
      {item.label}
    </DropdownItem>;
};
const AppMenu = ({
  mobileMenuOpen,
  menuClassName,
  showExtraPages,
  showCategories,
  searchInput,
  startSearchInput
}) => {
  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const menuItems = getAppMenuItems();
  const {
    pathname
  } = useLocation();

  /**
   * activate the menuitems
   */
  const activeMenu = useCallback(() => {
    const trimmedURL = pathname?.replaceAll('', '');
    const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);
    if (matchingMenuItem) {
      const activeMt = findMenuItem(menuItems, matchingMenuItem.key);
      if (activeMt) {
        setActiveMenuItems([activeMt.key, ...findAllParent(menuItems, activeMt)]);
      }
    }
  }, [pathname, menuItems]);
  useEffect(() => {
    activeMenu();
  }, [activeMenu, menuItems]);

  return <Collapse in={mobileMenuOpen} className="navbar-collapse collapse">
      <div>
   
        {showCategories && <ul className="navbar-nav navbar-nav-scroll me-auto">
            {CATEGORY_MENU_ITEMS.map((item, idx) => {
          return <Fragment key={item.key + idx}>
                  {item.children ? <MenuItemWithChildren item={item} activeMenuItems={activeMenuItems} level={1} itemClassName="nav-item dropdown-menu-shadow-stacked cursor-pointer" linkClassName={clsx('arrow-none nav-link bg-primary bg-opacity-10 rounded-3 text-primary px-3 py-3 py-xl-0', {
              active: activeMenuItems.includes(item.key)
            })} /> : <MenuItem item={item} level={1} linkClassName={clsx(activeMenuItems.includes(item.key) && 'active')} />}
                </Fragment>;
        })}
          </ul>}
         <ul className={clsx('navbar-nav navbar-nav-scroll', menuClassName)}>
      {(menuItems ?? []).map((item, idx) => (
        <Fragment key={item.key + idx}>
          {item.children ? (
            <MenuItemWithChildren
              item={item}
              activeMenuItems={activeMenuItems}
              level={1}
              itemClassName="nav-item cursor-pointer mx-2"
              linkClassName={clsx(
                'nav-link arrow-none d-flex align-items-center gap-1 justify-content-between',
                { active: activeMenuItems.includes(item.key) }
              )}
            />
          ) : (
            <MenuItem
              item={item}
              level={1}
              itemClassName="nav-item mx-2 d-flex align-items-center"
              linkClassName={clsx({
                'nav-link': !['signIn', 'signUp'].includes(item.key),
                'btn btn-outline-primary btn-sm menu-btn': item.key === 'signIn',
                'btn btn-primary btn-sm menu-btn': item.key === 'signUp',
                active: activeMenuItems.includes(item.key),
              })}
            />
          )}
        </Fragment>
      ))}
    </ul>

        {searchInput && <div className="nav my-3 my-xl-0 px-4 flex-nowrap align-items-center">
            <div className="nav-item w-100">
              <form className="position-relative">
                <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
                <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="button">
                  <FaSearch className="fs-6 " />
                </button>
              </form>
            </div>
          </div>}
      </div>
    </Collapse>;
};
export default AppMenu;
