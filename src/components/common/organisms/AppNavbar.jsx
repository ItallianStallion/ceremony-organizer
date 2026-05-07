import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { signOut } from '../../../services/firebase/authService';
import { shortEmail } from '../../../utils/formatters';

const getDisplayName = (currentUser) => {
  if (!currentUser) return '';
  if (currentUser.firstName) {
    return currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName;
  }
  return shortEmail(currentUser.email);
};

const AppNavbar = ({ currentPage, onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [displayName, setDisplayName] = useState(() => getDisplayName(currentUser));

  useEffect(() => {
    setDisplayName(getDisplayName(currentUser));
  }, [currentUser]);

  useEffect(() => {
    setDisplayName(getDisplayName(currentUser));
  }, [currentPage, currentUser]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try { 
      await signOut(); 
      onNavigate('home'); 
    }
    finally { 
      setSigningOut(false); 
      setMenuOpen(false); 
    }
  };

  // Оновлена функція генерації посилань меню
  const navLink = (page, label) => {
    const path = page === 'home' ? '/' : `/${page}`;
    return (
      <li className="nav-item" key={page}>
        <Link
          to={path}
          className={`nav-link nav-link-custom btn ${currentPage === page ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', textDecoration: 'none' }}
          onClick={() => setMenuOpen(false)}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <nav className="navbar navbar-ceremony navbar-expand-lg sticky-top" aria-label="Головна навігація">
      <div className="container">
        {/* Логотип */}
        <Link
          to="/"
          className="navbar-brand navbar-brand-text btn p-0"
          style={{ background: 'none', border: 'none', textDecoration: 'none' }}
          onClick={() => setMenuOpen(false)}
        >
          <span style={{ color: 'var(--color-primary)', marginRight: 6 }}>✦</span>Ceremony
        </Link>

        <button
          className="navbar-toggler border-0" type="button"
          aria-label="Відкрити меню" aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ boxShadow: 'none' }}
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}
             style={{ fontSize: '1.4rem', color: 'var(--color-text)' }} />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            {navLink('home',    'Головна')}
            {navLink('events',  'Заходи')}
            {navLink('gallery', 'Галерея')}
            {navLink('rsvp',    'Замовлення')}

            {/* Кнопка адмін-панелі */}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link nav-link-custom btn ${currentPage === 'admin' ? 'active' : ''}`}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--color-primary)', fontWeight: 700,
                    textDecoration: 'none', display: 'inline-block'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="bi bi-shield-lock me-1" />Адмін
                </Link>
              </li>
            )}

            {currentUser ? (
              <>
                {/* Кнопка кабінету */}
                <li className="nav-item ms-2">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: currentPage === 'profile'
                        ? 'var(--color-primary-light)'
                        : 'var(--color-surface)',
                      border: `1.5px solid ${currentPage === 'profile'
                        ? 'var(--color-primary)'
                        : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-full)',
                      padding: '5px 14px',
                      color: 'var(--color-text)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all var(--transition)',
                      maxWidth: 180,
                      overflow: 'hidden',
                    }}
                  >
                    <i className="bi bi-person-circle"
                       style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <span style={{
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {displayName}
                    </span>
                  </Link>
                </li>

                <li className="nav-item ms-1">
                  <button
                    className="btn-outline-custom"
                    style={{ padding: '5px 14px' }}
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut
                      ? <span className="spinner-border spinner-border-sm" style={{ borderWidth: '2px' }} />
                      : <><i className="bi bi-box-arrow-right me-1" />Вийти</>}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-2">
                  <Link
                    to="/login"
                    className="btn-outline-custom" style={{ padding: '5px 14px', textDecoration: 'none', display: 'inline-block' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Увійти
                  </Link>
                </li>
                <li className="nav-item ms-1">
                  <Link
                    to="/signup"
                    className="btn-primary-custom" style={{ padding: '5px 14px', textDecoration: 'none', display: 'inline-block' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Реєстрація
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;