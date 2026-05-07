import React from 'react';
import './AppFooter.css'; 

const AppFooter = ({ onNavigate }) => (
  <footer className="footer-ceremony">
    <div className="container">
      <div className="row g-4">
        
        {/* Блок Бренду */}
        <div className="col-lg-4">
          <div className="footer-brand-title">
            <span className="footer-brand-icon">✦</span> Ceremony
          </div>
          <p className="footer-brand-desc">
            Перетворюємо ваші найважливіші моменти на незабутні спогади.
          </p>
        </div>

        {/* Блок Навігації */}
        <div className="col-6 col-lg-2">
          <p className="footer-heading">
            Навігація
          </p>
          <ul className="footer-list">
            {[
              ['home', 'Головна'],
              ['events', 'Заходи'],
              ['gallery', 'Галерея'],
              ['rsvp', 'Замовлення']
            ].map(([path, label]) => (
              <li key={path}>
                <button 
                  onClick={() => onNavigate(path)}
                  className="footer-nav-btn"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Блок Контактів */}
        <div className="col-6 col-lg-3">
          <p className="footer-heading">
            Контакти
          </p>
          <ul className="footer-list footer-contact-list">
            <li><i className="bi bi-telephone me-2" />+38 (067) 000-00-00</li>
            <li><i className="bi bi-envelope me-2" />info@ceremony.ua</li>
            <li><i className="bi bi-geo-alt me-2" />Івано-Франківськ, Україна</li>
          </ul>
        </div>

      </div>

      {/* Нижній колонтитул */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Ceremony Organizer. Усі права захищені.
      </div>
      
    </div>
  </footer>
);

export default AppFooter;