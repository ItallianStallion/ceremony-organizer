import React from 'react';
import RsvpForm from '../components/RsvpForm';
import { useAuth } from '../../../app/providers/AuthProvider';
import './RsvpPage.css';

const RsvpPage = ({ onNavigate, preselectedEvent }) => {
  const { currentUser } = useAuth();
  
  return (
    <main>
      <section className="rsvp-page-header">
        <div className="container">
          <p className="rsvp-page-subtitle">
            Підтвердження участі
          </p>
          <h1 className="rsvp-page-title">
            Оформити замовлення
          </h1>
          <p className="rsvp-page-desc">
            Оберіть пакет, налаштуйте деталі та надішліть заявку — ми зв'яжемось протягом 24 годин.
          </p>
        </div>
      </section>
      
      <section className="rsvp-page-body">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              
              {!currentUser && (
                <div className="rsvp-info-banner">
                  <i className="bi bi-info-circle rsvp-info-icon" />
                  <p className="rsvp-info-text">
                    <button 
                      onClick={() => onNavigate('login')}
                      className="rsvp-info-btn"
                    >
                      Увійдіть в акаунт
                    </button>{' '}
                    — і ваші дані заповняться автоматично, а замовлення збережеться в профілі.
                  </p>
                </div>
              )}
              
              <div className="card-ceremony rsvp-card-container">
                <RsvpForm
                  onGoProfile={currentUser ? () => onNavigate('profile') : null}
                  preselectedEvent={preselectedEvent}
                />
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RsvpPage;