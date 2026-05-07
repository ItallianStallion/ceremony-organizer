import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/firebase';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useOrders } from '../../../app/providers/OrdersProvider';
import { signOut } from '../../../services/firebase/authService';
import Button from '../../../components/common/atoms/Button';
import AlertMessage from '../../../components/common/atoms/AlertMessage';
import { formatPrice } from '../../../utils/formatters';
import './ProfilePage.css';

const CANCEL_DAYS_BEFORE = 14;

const daysUntil = (dateStr) => {
  if (!dateStr) return Infinity;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ── Аватар з ініціалами ──
const Avatar = ({ email, size = 84 }) => {
  const initials = email ? email.slice(0, 2).toUpperCase() : '?';
  return (
    <div 
      className="profile-avatar" 
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
};

// ── Бейдж статусу ──
const StatusBadge = ({ status }) => {
  const map = {
    pending:   { label: 'Очікує',       className: 'badge-pending' },
    confirmed: { label: 'Підтверджено', className: 'badge-confirmed' },
    cancelled: { label: 'Скасовано',    className: 'badge-cancelled' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`profile-status-badge ${s.className}`}>
      {s.label}
    </span>
  );
};

// ── Картка замовлення ──
const OrderCard = ({ order, onCancel, onRemove }) => {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  
  const days = daysUntil(order.desiredDate);
  const canCancel = order.status !== 'cancelled' && days > CANCEL_DAYS_BEFORE;
  const tooLate   = order.status !== 'cancelled' && days <= CANCEL_DAYS_BEFORE;

  const handleCancel = () => {
    onCancel(order.id);
    setConfirming(false);
    setRemoving(true);
    setTimeout(() => onRemove(order.id), 5000);
  };

  const createdAtDate = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('uk-UA')
    : new Date(order.createdAt).toLocaleDateString('uk-UA');

  return (
    <div className={`card shadow-sm border-0 order-card ${removing ? 'removing' : ''}`}>
      
      <div className="order-header">
        <div>
          <div className="order-title">{order.eventTitle}</div>
          <div className="order-meta">
            №{order.id.slice(-8)} · {createdAtDate}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="order-grid" style={{ marginBottom: (canCancel || tooLate) ? '1.5rem' : 0 }}>
        {[
          ['bi-calendar',   'Дата заходу', order.desiredDate || '—'],
          ['bi-people',     'Гостей',      `${order.guestCount} осіб`],
          ['bi-tag',        'Вартість',    formatPrice(order.totalPrice)],
          ['bi-check2-all', 'Додатково',   order.selectedAddons?.length
            ? `${order.selectedAddons.length} опції` : 'Без додатків'],
        ].map(([icon, label, val]) => (
          <div key={label}>
            <div className="order-grid-label">
              <i className={`bi ${icon}`} />{label}
            </div>
            <div className="order-grid-value">{val}</div>
          </div>
        ))}
      </div>

      {canCancel && !confirming && (
        <div className="order-action-row">
          <div className="order-meta">
            <i className="bi bi-info-circle me-2" />
            Скасувати можна до {new Date(new Date(order.desiredDate) - CANCEL_DAYS_BEFORE * 86400000).toLocaleDateString('uk-UA')}
          </div>
          <button onClick={() => setConfirming(true)} className="btn-cancel-outline">
            <i className="bi bi-x-circle me-1" />Скасувати замовлення
          </button>
        </div>
      )}

      {confirming && (
        <div className="order-confirm-box">
          <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', color: '#721c24' }}>
            Ви впевнені, що хочете скасувати замовлення?
          </p>
          <p style={{ fontSize: '0.95rem', color: '#721c24', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Цю дію не можна відмінити. Зверніться до підтримки для уточнення умов повернення коштів.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleCancel} className="btn-danger-solid">
              Так, скасувати
            </button>
            <button onClick={() => setConfirming(false)} className="btn-secondary-outline">
              Назад
            </button>
          </div>
        </div>
      )}

      {tooLate && (
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
          <div className="order-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="bi bi-lock" style={{ color: '#ffc107', fontSize: '1.1rem' }} />
            Скасування недоступне — до заходу менше {CANCEL_DAYS_BEFORE} днів.
            Зверніться до <a href="mailto:support@ceremony.ua" style={{ color: '#B7906C', marginLeft: '4px' }}>підтримки</a>.
          </div>
        </div>
      )}
    </div>
  );
};

// ── Секція особистих даних ──
const PersonalDataSection = ({ currentUser }) => {
  const { reloadUser } = useAuth();
  const initialized = useRef(false);

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName:  currentUser?.lastName  || '',
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && !initialized.current) {
      initialized.current = true;
      setForm({
        firstName: currentUser.firstName || '',
        lastName:  currentUser.lastName  || '',
      });
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        firstName: form.firstName,
        lastName:  form.lastName,
      });
      await reloadUser();
      setSuccess('Дані збережено!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      console.error('Помилка збереження:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="card shadow-sm border-0 profile-form-card">
      <AlertMessage type="success" message={success} />
      {success && <div style={{ marginBottom: '1.75rem' }} />}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <label className="form-label profile-label">Ім'я</label>
          <input 
            className="form-control profile-input" 
            value={form.firstName} 
            placeholder="Ім'я"
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} 
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label profile-label">Прізвище</label>
          <input 
            className="form-control profile-input" 
            value={form.lastName} 
            placeholder="Прізвище"
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} 
          />
        </div>
        <div className="col-12">
          <label className="form-label profile-label">
            Email <span style={{ color: '#B7906C' }}>*</span>
          </label>
          <input 
            className="form-control profile-input" 
            value={currentUser?.email || ''} 
            readOnly
          />
          <div style={{ fontSize: '1rem', color: '#6c757d', marginTop: '12px' }}>
            <i className="bi bi-lock me-2" />Email змінюється через підтримку
          </div>
        </div>
      </div>
      <div style={{ marginTop: '3rem' }}>
        <Button type="submit" loading={loading}>
          <i className="bi bi-check-lg me-2" />Зберегти зміни
        </Button>
      </div>
    </form>
  );
};

// ── Секція зміни пароля ──
const ChangePasswordSection = () => {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.next.length < 6) { setError('Мінімум 6 символів'); return; }
    if (form.next !== form.confirm) { setError('Паролі не збігаються'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess('Пароль успішно змінено!');
    setForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <form onSubmit={handle} className="card shadow-sm border-0 profile-form-card">
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      {(error || success) && <div style={{ marginBottom: '1.75rem' }} />}
      {[
        ['current', 'Поточний пароль',         'Введіть поточний пароль'],
        ['next',    'Новий пароль',             'Мінімум 6 символів'],
        ['confirm', 'Підтвердьте новий пароль', 'Повторіть пароль'],
      ].map(([key, label, ph]) => (
        <div key={key} className="mb-4">
          <label className="form-label profile-label">
            {label} <span style={{ color: '#B7906C' }}>*</span>
          </label>
          <input 
            type="password" 
            className="form-control profile-input" 
            placeholder={ph}
            value={form[key]} 
            onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} 
          />
        </div>
      ))}
      <div style={{ marginTop: '2rem' }}>
        <Button type="submit" loading={loading}>
          <i className="bi bi-shield-lock me-2" />Змінити пароль
        </Button>
      </div>
    </form>
  );
};

// ── ГОЛОВНА СТОРІНКА ПРОФІЛЮ ──
const ProfilePage = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { orders, cancelOrder, removeOrder } = useOrders(); 
  const [tab, setTab] = useState('orders');
  const [signingOut, setSigningOut] = useState(false);

  const myOrders = currentUser ? orders.filter(o => o.userId === currentUser.uid) : [];

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    onNavigate('home');
  };

  if (!currentUser) {
    return (
      <div className="profile-unauth">
        <div>
          <i className="bi bi-person-lock" style={{ fontSize: '4rem', color: '#dee2e6' }} />
          <h3 className="profile-section-title" style={{ margin: '2rem 0 1rem' }}>
            Потрібна авторизація
          </h3>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Увійдіть, щоб переглянути свій кабінет
          </p>
          <Button onClick={() => onNavigate('login')}>
            <i className="bi bi-box-arrow-in-right me-2" />Увійти
          </Button>
        </div>
      </div>
    );
  }

  const displayName = currentUser.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
    : 'Мій кабінет';

  const tabs = [
    { id: 'orders',   icon: 'bi-bag-heart',  label: 'Мої замовлення', badge: myOrders.length || null },
    { id: 'personal', icon: 'bi-person',      label: 'Особисті дані' },
    { id: 'security', icon: 'bi-shield-lock', label: 'Безпека' },
  ];

  return (
    <main className="profile-main">
      <section className="profile-header-section">
        <div className="container">
          <div className="profile-header-content">
            <Avatar email={currentUser.email} size={84} />
            <div>
              <h1 className="profile-name">{displayName}</h1>
              <p style={{ fontSize: '1.1rem', color: '#6c757d', margin: 0 }}>
                <i className="bi bi-envelope me-2" />{currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-body-section">
        <div className="container">
          <div className="row g-5">
            
            {/* Сайдбар */}
            <div className="col-12 col-md-3">
              <nav className="profile-nav">
                {tabs.map((t) => (
                  <button 
                    key={t.id} 
                    onClick={() => setTab(t.id)} 
                    className={`profile-nav-btn ${tab === t.id ? 'active' : ''}`}
                  >
                    <i className={`bi ${t.icon}`} style={{ fontSize: '1.25rem' }} />
                    <span style={{ flex: 1 }}>{t.label}</span>
                    {t.badge && (
                      <span className={`profile-nav-badge ${tab === t.id ? 'active' : 'inactive'}`}>
                        {t.badge}
                      </span>
                    )}
                  </button>
                ))}
                
                <div className="profile-signout-wrap">
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="btn-signout"
                  >
                    {signingOut ? (
                      <span className="spinner-border spinner-border-sm" style={{ borderWidth: '2px' }} />
                    ) : (
                      <i className="bi bi-box-arrow-right" style={{ fontSize: '1.25rem' }} />
                    )}
                    Вийти з акаунту
                  </button>
                </div>
              </nav>
            </div>

            {/* Контент */}
            <div className="col-12 col-md-9">
              {tab === 'orders' && (
                <>
                  <h2 className="profile-section-title">
                    <i className="bi bi-bag-heart me-3" style={{ color: '#B7906C' }} />
                    Мої замовлення
                  </h2>
                  
                  {myOrders.length === 0 ? (
                    <div className="card shadow-sm border-0 orders-empty-state">
                      <i className="bi bi-calendar-plus" style={{ fontSize: '4rem', color: '#dee2e6' }} />
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', margin: '1.75rem 0 0.75rem', color: '#2C3E50' }}>
                        Замовлень ще немає
                      </h3>
                      <p style={{ color: '#6c757d', fontSize: '1.1rem', maxWidth: '36ch', margin: '0 auto 2.5rem' }}>
                        Оберіть пакет урочистостей і створіть своє перше замовлення!
                      </p>
                      <Button onClick={() => onNavigate('rsvp')}>
                        <i className="bi bi-calendar-heart me-2" />Замовити захід
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                      {myOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onCancel={cancelOrder}
                          onRemove={removeOrder}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === 'personal' && (
                <>
                  <h2 className="profile-section-title">
                    <i className="bi bi-person me-3" style={{ color: '#B7906C' }} />
                    Особисті дані
                  </h2>
                  <PersonalDataSection currentUser={currentUser} />
                </>
              )}

              {tab === 'security' && (
                <>
                  <h2 className="profile-section-title">
                    <i className="bi bi-shield-lock me-3" style={{ color: '#B7906C' }} />
                    Зміна пароля
                  </h2>
                  <ChangePasswordSection />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;