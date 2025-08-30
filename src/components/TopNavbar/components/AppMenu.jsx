import { findAllParent, findMenuItem, getAppMenuItems, getMenuItemFromURL } from '@/helpers/menu';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { FaEllipsis } from 'react-icons/fa6';
import { useAuthContext } from '@/context/useAuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import { CATEGORY_MENU_ITEMS } from '@/assets/data/menu-items';
import CategoryMegaMenu from './CategoryMegaMenu';
import ProfileDropdown from './ProfileDropdown'; // ✅ add this import

// ---------------- Menu Items ---------------- //

export const MenuItemWithChildren = ({ item, activeMenuItems, itemClassName, linkClassName, level }) => {
  const level1 = level === 1;
  const Icon = item.icon;
  return (
    <Dropdown as="li" className={itemClassName} drop={level >= 2 ? 'end' : undefined}>
      <DropdownToggle
        as={'a'}
        className={linkClassName}
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <div className="icons-center">
          {Icon && <Icon className="me-1 fa-fw me-1" />}
          {item.label}
        </div>
        {!Icon && level1 ? <FaChevronDown size={12} /> : !level1 ? <FaEllipsis size={14} /> : ''}
      </DropdownToggle>
      <DropdownMenu as="ul" renderOnMount className="custom-navbar-dropdown-menu">
        {(item.children ?? []).map((child, idx) => (
          <Fragment key={idx + child.key + idx}>
            {child.children ? (
              <MenuItemWithChildren
                item={child}
                level={level + 1}
                activeMenuItems={activeMenuItems}
                itemClassName="dropdown-submenu"
                linkClassName={clsx(
                  'dropdown-item dropdown-toggle arrow-none d-flex align-items-center justify-content-between',
                  { active: activeMenuItems?.includes(child.key) }
                )}
              />
            ) : (
              <>
                <MenuItem
                  item={child}
                  level={level + 1}
                  linkClassName={clsx(activeMenuItems?.includes(child.key) && 'active')}
                />
                {child.isMegaMenu && <CategoryMegaMenu />}
              </>
            )}
          </Fragment>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export const MenuItem = ({ item, linkClassName, level, itemClassName }) => (
  <>
    <li className={itemClassName}>
      <MenuItemLink item={item} linkClassName={linkClassName} level={level + 1} />
    </li>
    {item.divider && <li><DropdownDivider /></li>}
  </>
);

const MenuItemLink = ({ item, linkClassName }) => {
  const Icon = item.icon;
  return (
    <DropdownItem
      as={Link}
      to={item.url ?? ''}
      target={item.target}
      className={clsx(linkClassName, 'icons-center')}
    >
      {Icon && <Icon className="me-1 fa-fw me-1" />}
      {item.label}
    </DropdownItem>
  );
};

// ---------------- Main AppMenu ---------------- //

const AppMenu = ({ menuClassName, showCategories, searchInput }) => {
  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = getAppMenuItems();
  const { pathname } = useLocation();
  const { user } = useAuthContext();

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

  return (
    <>
      {/* ✅ Mobile hamburger */}
      <button className="btn d-lg-none" onClick={() => setMobileMenuOpen(true)}>
        <FaBars size={22} />
      </button>

      {/* ✅ Mobile slide-in menu (overlay) */}
      <div
        className={clsx("mobile-menu-overlay d-lg-none", { show: mobileMenuOpen })}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={clsx("mobile-menu", { show: mobileMenuOpen })}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="m-0">Eduglobal</h5>
            <button className="btn btn-link text-dark" onClick={() => setMobileMenuOpen(false)}>
              <FaTimes size={24} />
            </button>
          </div>

          {/* ✅ Profile (mobile) */}
          {user && (
            <div className="mb-3">
              <ProfileDropdown />
            </div>
          )}

          {/* categories */}
          {showCategories && (
            <ul className="navbar-nav me-auto mb-4">
              {CATEGORY_MENU_ITEMS.map((item, idx) => (
                <Fragment key={item.key + idx}>
                  {item.children ? (
                    <MenuItemWithChildren
                      item={item}
                      activeMenuItems={activeMenuItems}
                      level={1}
                      itemClassName="nav-item dropdown cursor-pointer"
                      linkClassName={clsx("nav-link d-flex justify-content-between", {
                        active: activeMenuItems.includes(item.key),
                      })}
                    />
                  ) : (
                    <MenuItem
                      item={item}
                      level={1}
                      linkClassName={clsx(activeMenuItems.includes(item.key) && 'active')}
                    />
                  )}
                </Fragment>
              ))}
            </ul>
          )}

          {/* main menu items */}
          <ul className="navbar-nav">
            {menuItems.map((item, idx) => {
              if (user && ['signIn', 'signUp'].includes(item.key)) return null;
              return (
                <Fragment key={item.key + idx}>
                  {item.children ? (
                    <MenuItemWithChildren
                      item={item}
                      activeMenuItems={activeMenuItems}
                      level={1}
                      itemClassName="nav-item cursor-pointer"
                      linkClassName={clsx("nav-link d-flex justify-content-between", {
                        active: activeMenuItems.includes(item.key),
                      })}
                    />
                  ) : (
                    <MenuItem
                      item={item}
                      level={1}
                      itemClassName="nav-item"
                      linkClassName={clsx({
                        'nav-link': !['signIn', 'signUp'].includes(item.key),
                        'btn btn-outline-primary btn-sm menu-btn': item.key === 'signIn',
                        'btn btn-primary btn-sm menu-btn': item.key === 'signUp',
                        active: activeMenuItems.includes(item.key),
                      })}
                    />
                  )}
                </Fragment>
              );
            })}
          </ul>

          {/* search (mobile) */}
          {searchInput && (
            <div className="mt-4">
              <form className="position-relative">
                <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search" />
                <button
                  className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                  type="button"
                >
                  <FaSearch className="fs-6 " />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Desktop menu stays the same */}
      <ul className={clsx('navbar-nav navbar-nav-scroll d-none d-lg-flex', menuClassName)}>
        {menuItems.map((item, idx) => {
          if (user && ['signIn', 'signUp'].includes(item.key)) return null;
          return (
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
          );
        })}
      </ul>

      {/* ✅ Desktop controls: search + profile (visible on lg+) */}
      <div className="d-none d-lg-flex align-items-center ms-6 gap-6">
        {searchInput && (
          <form className="position-relative">
            <input
              className="form-control pe-5 bg-transparent"
              type="search"
              placeholder="Search"
            />
            <button
              className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
              type="button"
            >
              <FaSearch className="fs-6" />
            </button>
          </form>
        )}

         {/* ✅ profile on desktop */}
      </div>
    </>
  );  
};

export default AppMenu;
