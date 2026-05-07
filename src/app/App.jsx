import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { OrdersProvider } from './providers/OrdersProvider';
import { EventsProvider } from './providers/EventsProvider';

// Компоненти
import AppNavbar from '../components/common/organisms/AppNavbar';
import AppFooter from '../components/common/organisms/AppFooter';
import Spinner from '../components/common/atoms/Spinner';

// Сторінки
import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import EventsPage from '../features/events/pages/EventsPage';
import RsvpPage from '../features/rsvp/pages/RsvpPage';
import GalleryPage from '../features/gallery/pages/GalleryPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import AdminPage from '../admin/AdminPage';

import './App.css'; 

// ─── Домашня сторінка ───────────────────────────
const HomePage = ({ onNavigate }) => (
  <main>
    {/* Hero секція */}
    <section className="home-hero-section">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="home-hero-subtitle">Організація урочистостей</p>
            <h1 className="home-hero-title">
              Перетворюємо моменти<br />
              <span className="home-hero-title-highlight">на спогади</span>
            </h1>
            <p className="home-hero-desc">
              Від інтимних вечорів до масштабних весіль — ми організовуємо події,
              які залишаються в серцях назавжди.
            </p>
            <div className="home-hero-actions">
              <button className="btn-primary-custom" onClick={() => onNavigate('events')}>
                <i className="bi bi-calendar-heart me-2" />
                Переглянути пакети
              </button>
              <button className="btn-outline-custom" onClick={() => onNavigate('rsvp')}>
                Оформити замовлення
              </button>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block">
            <div className="home-hero-mosaic">
              {['home_a', 'home_b', 'home_c', 'home_d'].map((seed, i) => (
                <div 
                  key={seed} 
                  className={`card-ceremony home-hero-mosaic-item ${i % 2 !== 0 ? 'offset' : ''}`}
                >
                  <img
                    src={`https://picsum.photos/seed/${seed}/300/400`}
                    alt=""
                    loading="lazy"
                    width={300}
                    height={400}
                    className="home-hero-mosaic-img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Лічильники */}
    <section className="home-stats-section">
      <div className="container">
        <div className="row g-4 text-center">
          {[
            ['500+', 'Успішних подій'],
            ['98%',  'Задоволених клієнтів'],
            ['12',   'Років досвіду'],
            ['24/7', 'Підтримка'],
          ].map(([n, l]) => (
            <div key={l} className="col-6 col-md-3">
              <div className="home-stat-number">{n}</div>
              <div className="home-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA-банер */}
    <section className="home-cta-section">
      <div className="container text-center">
        <h2 className="home-cta-title">Готові створити незабутнє торжество?</h2>
        <p className="home-cta-desc">Розкажіть нам про вашу подію — ми зробимо все інше.</p>
        <button
          className="btn-primary-custom home-cta-btn"
          onClick={() => onNavigate('rsvp')}
        >
          <i className="bi bi-envelope-heart me-2" />
          Зв'язатися з нами
        </button>
      </div>
    </section>
  </main>
);

const AppRoutes = () => {
  const { authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [preselectedEvent, setPreselectedEvent] = useState(null);

  const handleNavigate = (path) => navigate(`/${path}`);

  if (authLoading) {
    return (
      <div className="app-loading-container">
        <Spinner size="lg" text="Ініціалізація..." />
      </div>
    );
  }

  const isStandalonePage = ['/login', '/signup', '/admin'].includes(location.pathname);
  
  const currentPage = location.pathname.replace('/', '') || 'home';

  return (
    <div className="app-layout">
      {!isStandalonePage && <AppNavbar currentPage={currentPage} onNavigate={handleNavigate} />}
      
      <div className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
          
          <Route path="/events" element={
            <EventsPage
              onNavigate={handleNavigate}
              onBookEvent={(event) => {
                setPreselectedEvent(event);
                handleNavigate('rsvp');
              }}
            />
          } />
          
          <Route path="/gallery" element={<GalleryPage />} />
          
          <Route path="/rsvp" element={
            <RsvpPage
              key={preselectedEvent?.id ?? 'rsvp'}
              onNavigate={handleNavigate}
              preselectedEvent={preselectedEvent}
            />
          } />
          
          <Route path="/profile" element={<ProfilePage onNavigate={handleNavigate} />} />
          
          
          <Route path="/login" element={<LoginPage onSuccess={() => handleNavigate('home')} onGoSignUp={() => handleNavigate('signup')} />} />
          <Route path="/signup" element={<SignUpPage onSuccess={() => handleNavigate('home')} onGoLogin={() => handleNavigate('login')} />} />
          <Route path="/admin" element={<AdminPage onNavigate={handleNavigate} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isStandalonePage && <AppFooter onNavigate={handleNavigate} />}
    </div>
  );
};

// ─── Root з провайдерами ─────────────────────────
const App = () => (
  <AuthProvider>
    <EventsProvider>
      <OrdersProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </OrdersProvider>
    </EventsProvider>
  </AuthProvider>
);

export default App;