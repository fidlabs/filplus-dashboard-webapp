import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cn from 'classnames';

import { Svg } from 'components/Svg';

import s from './s.module.css';

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handlerShowMenu = () => {
    setShowMenu(true);
  };

  const handlerCloseMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.target.innerWidth > 768) {
        handlerCloseMenu();
      }
    };

    if (showMenu) {
      window.addEventListener('resize', handler, false);
    } else {
      return window.removeEventListener('resize', handler);
    }
  }, [showMenu]);

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.navWrap}>
          <Link to="/" className={s.logoLink}>
            <Svg
              id="logo"
              width={40}
              height={40}
              aria-label="Filecoin Plus logo"
            />
            <Svg
              id="filecoin-plus"
              width={88}
              height={28}
              className={s.filecoinPlus}
              aria-label="Filecoin Plus"
            />
          </Link>
          <button type="button" className={s.menu} onClick={handlerShowMenu}>
            <Svg id="menu" />
          </button>
          <nav className={cn(s.nav, { [s.active]: showMenu })}>
            <div className={s.navHeader}>
              <Link to="/" className={s.logoLink} onClick={handlerCloseMenu}>
                <Svg
                  id="logo"
                  width={40}
                  height={40}
                  aria-label="Filecoin Plus logo"
                />
              </Link>
              <button
                type="button"
                className={s.close}
                onClick={handlerCloseMenu}
              >
                <Svg id="close" />
              </button>
            </div>
            <NavLink
              exact
              to="/"
              className={s.navLink}
              activeClassName={s.active}
              onClick={handlerCloseMenu}
            >
              Dashboard
            </NavLink>
            <NavLink
              exact
              to="/notaries"
              className={s.navLink}
              activeClassName={s.active}
              onClick={handlerCloseMenu}
            >
              Allocators
            </NavLink>
            {/* <NavLink
              exact
              to="/large-datasets"
              className={s.navLink}
              activeClassName={s.active}
              onClick={handlerCloseMenu}
            >
              Large datasets
            </NavLink> */}
            <NavLink
              exact
              to="/clients"
              className={s.navLink}
              activeClassName={s.active}
              onClick={handlerCloseMenu}
            >
              Clients
            </NavLink>
            <NavLink
              exact
              to="/storage-providers"
              className={s.navLink}
              activeClassName={s.active}
              onClick={handlerCloseMenu}
            >
              Storage Providers
            </NavLink>
            <NavLink
              exact
              to="/about"
              className={s.navLink}
              activeClassName={s.active}
              onClick={handlerCloseMenu}
            >
              About
            </NavLink>
            {/*<a*/}
            {/*  href="https://docs.filecoin.io/store/filecoin-plus/"*/}
            {/*  className={cn(s.navLink, s.externalLink)}*/}
            {/*  rel="noopener noreferrer"*/}
            {/*  target="_blank"*/}
            {/*  onClick={handlerCloseMenu}*/}
            {/*>*/}
            {/*  <span>Filecoin</span>*/}
            {/*  <Svg id="external-link" width={6} height={6} />*/}
            {/*</a>*/}
          </nav>
        </div>
      </div>
    </header>
  );
};
