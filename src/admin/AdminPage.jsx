import React, { useState, useRef } from 'react';
import { useOrders } from '../app/providers/OrdersProvider';
import { useEvents } from '../app/providers/EventsProvider';
import { useAuth }   from '../app/providers/AuthProvider';
import { formatPrice } from '../utils/formatters';
import GalleryManager from './components/GalleryManager';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/firebase'; 

import './AdminPage.css';

// ─── Константи ───
const STATUS_MAP = {
  pending:   { label: 'Очікує',        className: 'status-pending' },
  confirmed: { label: 'Підтверджено', className: 'status-confirmed' },
  cancelled: { label: 'Скасовано',    className: 'status-cancelled' },
};

// ─── Утиліти ───
const uid = () => Math.random().toString(36).slice(2, 10);

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className={`admin-status-badge ${s.className}`}>
      {s.label}
    </span>
  );
};

const InputField = ({ label, value, onChange, type = 'text', readOnly = false, customClass = '' }) => (
  <div className={`admin-input-wrapper ${customClass}`}>
    <label className="admin-input-label">{label}</label>
    <input 
      type={type} value={value} onChange={onChange} readOnly={readOnly}
      className={`admin-input-field ${readOnly ? 'readonly' : ''}`}
    />
  </div>
);

// ─── Секція: Замовлення ───
const OrdersSection = () => {
  const { orders, cancelOrder, removeOrder } = useOrders();
  const { events } = useEvents();
  const [selected, setSelected] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [search, setSearch] = useState('');

  const setStatus = async (id, status) => {
    // 1. Оновлюємо візуально миттєво
    setStatusMap((p) => ({ ...p, [id]: status }));
    
    // 2. Якщо скасовано, відпрацьовуємо стару логіку
    if (status === 'cancelled') cancelOrder(id);

    // 3. Зберігаємо новий статус у Firebase (для всіх статусів)
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status: status });
    } catch (error) {
      console.error("Помилка при збереженні статусу в базу:", error);
      alert("Не вдалося зберегти статус у базі даних.");
    }
  };

  const getStatus = (order) => statusMap[order.id] || order.status;

  const handleRemove = (id) => {
    if (!window.confirm('Видалити замовлення назавжди?')) return;
    if (selected?.id === id) setSelected(null);
    removeOrder(id);
  };

  const filtered = orders
    .filter((o) =>
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.eventTitle?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.includes(search)
    )
    .sort((a, b) => {
      // Задаємо "вагу" статусів (чим менше число, тим вище в списку)
      const weight = { pending: 1, confirmed: 2, cancelled: 3 };
      
      // Визначаємо поточний статус для кожного замовлення
      const statusA = getStatus(a) || 'pending';
      const statusB = getStatus(b) || 'pending';
      
      // Сортуємо: 1 (Очікує) йде наверх, 3 (Скасовано) - вниз
      return (weight[statusA] || 4) - (weight[statusB] || 4);
    });

  const getAddonLabels = (addonIds, eventId) => {
    if (!addonIds || addonIds.length === 0) return 'Немає';
    const event = events.find(e => e.id === eventId);
    if (!event) return addonIds.join(', ');
    return addonIds.map(id => {
      const addon = event.addons?.find(a => a.id === id);
      return addon ? addon.label : id;
    }).join(', ');
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Замовлення ({orders.length})</h2>
        <input
          placeholder="Пошук за email, подією, №..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty-state">
          <i className="bi bi-inbox admin-empty-icon" />
          <p>Замовлень не знайдено</p>
        </div>
      ) : (
        <div className="admin-list-container">
          {filtered.map((order) => (
            <div key={order.id} className={`admin-card ${selected?.id === order.id ? 'selected' : ''}`}>
              <div className="admin-card-header">
                <div>
                  <div className="admin-card-title">{order.eventTitle}</div>
                  <div className="admin-card-subtitle">
                    <i className="bi bi-envelope me-1" />{order.email}
                    <span className="mx-2">·</span>
                    <i className="bi bi-hash me-1" />{order.id.slice(-8)}
                  </div>
                  <div className="admin-card-subtitle">
                    <i className="bi bi-calendar me-1" />{order.desiredDate || '—'}
                    <span className="mx-2">·</span>
                    <i className="bi bi-people me-1" />{order.guestCount} гостей
                    <span className="mx-2">·</span>
                    <strong className="text-color-dark">{formatPrice(order.totalPrice)}</strong>
                  </div>
                </div>
                <div className="admin-card-actions">
                  <StatusBadge status={getStatus(order)} />
                  <button onClick={() => setSelected(selected?.id === order.id ? null : order)} className="admin-btn-outline">
                    {selected?.id === order.id ? 'Сховати' : 'Деталі'}
                  </button>
                  <button onClick={() => handleRemove(order.id)} title="Видалити замовлення" className="admin-btn-danger">
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              </div>

              {selected?.id === order.id && (
                <div className="admin-details-section">
                  <div className="admin-details-grid">
                    {[
                      ['Пакет', order.eventTitle],
                      ['Email', order.email],
                      ['Дата заходу', order.desiredDate || '—'],
                      ['Гостей', order.guestCount],
                      ['Загальна сума', formatPrice(order.totalPrice)],
                      ['Додаткові послуги', getAddonLabels(order.selectedAddons, order.eventId)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="admin-details-label">{k}</div>
                        <div className="admin-details-value">{v}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="admin-section-subtitle">Змінити статус:</div>
                    <div className="admin-card-actions">
                      {/* ОНОВЛЕНО: Блок кнопок з новими CSS класами */}
                      {Object.entries(STATUS_MAP).map(([key, val]) => {
                        const isCurrent = getStatus(order) === key;
                        return (
                          <button 
                            key={key} 
                            onClick={() => setStatus(order.id, key)}
                            className={`status-btn-action ${key} ${isCurrent ? 'active' : ''}`}
                          >
                            {val.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Секція: Пакети подій ───
const EventsSection = () => {
  const {
    events, updateEvent, addEvent, removeEvent, uploadEventImage,
    addAddon, updateAddon, removeAddon,
    addInclude, removeInclude, resetToDefault,
  } = useEvents();

  const [selected, setSelected]             = useState(null);
  const [editForm, setEditForm]             = useState({});
  const [newAddon, setNewAddon]             = useState({ label: '', price: '' });
  const [newInclude, setNewInclude]         = useState('');
  const [saved, setSaved]                   = useState(false);
  const [editingAddon, setEditingAddon]     = useState(null);
  const [editingInclude, setEditingInclude] = useState(null); 
  const [imgUploading, setImgUploading]     = useState(false);
  const fileInputRef = useRef(null);

  const openEvent = (ev) => {
    setSelected(ev);
    setEditForm({
      title: ev.title, description: ev.description,
      price: ev.price, guestRange: ev.guestRange,
      minGuests: ev.minGuests, maxGuests: ev.maxGuests,
    });
    setNewAddon({ label: '', price: '' });
    setNewInclude('');
    setEditingAddon(null);
    setEditingInclude(null); 
    setSaved(false);
  };

  const handleSave = () => {
    updateEvent(selected.id, {
      title: editForm.title,
      description: editForm.description,
      price: Number(editForm.price),
      guestRange: editForm.guestRange,
      minGuests: Number(editForm.minGuests),
      maxGuests: Number(editForm.maxGuests),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddEvent = () => {
    const newId = addEvent({});
    const created = { id: newId, title: 'Новий пакет', description: '',
                      price: 0, guestRange: '10–50', minGuests: 10, maxGuests: 50,
                      includes: [], addons: [], imageUrl: null };
    openEvent(created);
  };

  const handleRemoveEvent = (id) => {
    if (!window.confirm('Видалити пакет назавжди?')) return;
    setSelected(null);
    removeEvent(id);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    setImgUploading(true);
    try {
      await uploadEventImage(selected.id, file);
    } finally {
      setImgUploading(false);
      e.target.value = '';
    }
  };

  const handleAddAddon = () => {
    if (!newAddon.label.trim() || !newAddon.price) return;
    addAddon(selected.id, { id: uid(), label: newAddon.label.trim(), price: Number(newAddon.price) });
    setNewAddon({ label: '', price: '' });
  };

  const handleSaveAddon = () => {
    if (!editingAddon) return;
    updateAddon(selected.id, editingAddon.id, {
      label: editingAddon.label, price: Number(editingAddon.price),
    });
    setEditingAddon(null);
  };

  const handleAddInclude = () => {
    if (!newInclude.trim()) return;
    addInclude(selected.id, newInclude.trim());
    setNewInclude('');
  };

  const currentEvent = selected ? events.find((e) => e.id === selected.id) : null;

  const handleSaveInclude = () => {
    if (!editingInclude || !currentEvent) return;
    const updated = [...currentEvent.includes];
    updated[editingInclude.index] = editingInclude.value;
    updateEvent(selected.id, { includes: updated });
    setEditingInclude(null);
  };

  return (
    <div className={`admin-events-layout ${selected ? 'with-sidebar' : ''}`}>
      <div>
        <div className="admin-section-header">
          <h2 className="admin-section-title">Пакети</h2>
          <div className="admin-card-actions">
            <button onClick={handleAddEvent} className="admin-btn-primary">
              <i className="bi bi-plus-lg me-1" />Новий
            </button>
            <button onClick={() => { if (window.confirm('Скинути всі зміни до початкових?')) { resetToDefault(); setSelected(null); } }} className="admin-btn-secondary">
              <i className="bi bi-arrow-counterclockwise me-1" />Скинути
            </button>
          </div>
        </div>

        <div className="admin-list-container">
          {events.map((ev) => (
            <div key={ev.id} className={`admin-event-list-item ${selected?.id === ev.id ? 'selected' : ''}`}>
              <div onClick={() => openEvent(ev)} className="admin-item-input-large">
                <div className="admin-card-title">{ev.title}</div>
                <div className="admin-card-subtitle">{formatPrice(ev.price)} · {ev.guestRange}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleRemoveEvent(ev.id); }} title="Видалити пакет" className="admin-btn-text-danger">
                <i className="bi bi-trash3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && currentEvent && (
        <div className="admin-event-editor">
          <div className="admin-editor-header">
            <h3 className="admin-editor-title">{currentEvent.title}</h3>
            <button onClick={() => setSelected(null)} className="admin-btn-close">×</button>
          </div>

          <div className="admin-image-section">
            <div className="admin-section-subtitle"><i className="bi bi-image me-2 admin-logo-icon" />Фото заставки</div>
            <div className="admin-image-controls">
              <div className="admin-img-preview-box">
                {currentEvent.imageUrl
                  ? <img src={currentEvent.imageUrl} alt="cover" className="admin-cover-img" />
                  : <i className="bi bi-image admin-image-icon-placeholder" />
                }
              </div>
              <div className="admin-image-actions">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden-input" onChange={handleImageUpload} />
                <button onClick={() => fileInputRef.current?.click()} disabled={imgUploading} className="admin-btn-primary">
                  {imgUploading ? <><span className="spinner-border spinner-border-sm spinner-btn" />Завантаження...</> : <><i className="bi bi-upload" />Завантажити фото</>}
                </button>
                {currentEvent.imageUrl && (
                  <button onClick={() => updateEvent(selected.id, { imageUrl: null })} className="admin-btn-icon-danger">
                    <i className="bi bi-trash3 me-1" />Видалити фото
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="admin-grid-2">
            <InputField label="Назва пакету" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
            <InputField label="Базова ціна (грн)" type="number" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} />
            <InputField label="Мін. гостей" type="number" value={editForm.minGuests} onChange={(e) => setEditForm((p) => ({ ...p, minGuests: e.target.value }))} />
            <InputField label="Макс. гостей" type="number" value={editForm.maxGuests} onChange={(e) => setEditForm((p) => ({ ...p, maxGuests: e.target.value }))} />
          </div>
          <div className="admin-input-wrapper">
            <label className="admin-input-label">Опис</label>
            <textarea value={editForm.description} rows={3} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} className="admin-input-field admin-textarea" />
          </div>

          {saved && (
            <div className="admin-save-message">
              <i className="bi bi-check-circle me-2" />Збережено!
            </div>
          )}
          <button onClick={handleSave} className="admin-btn-primary admin-save-btn">
            <i className="bi bi-floppy me-2" />Зберегти пакет
          </button>

          {/* Що включено */}
          <div className="admin-items-section">
            <div className="admin-section-subtitle text-bold text-color-dark"><i className="bi bi-check2-all me-2 admin-logo-icon" />Що включено</div>
            <div className="admin-items-list">
              {currentEvent.includes?.map((item, i) => (
                <div key={i} className="admin-item-row">
                  {editingInclude?.index === i ? (
                    <>
                      <input value={editingInclude.value} onChange={(e) => setEditingInclude((p) => ({ ...p, value: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && handleSaveInclude()} autoFocus className="admin-input-field admin-item-input-large" />
                      <button onClick={handleSaveInclude} className="admin-btn-success">✓</button>
                      <button onClick={() => setEditingInclude(null)} className="admin-btn-close">×</button>
                    </>
                  ) : (
                    <>
                      <span className="admin-item-text">{item}</span>
                      <button onClick={() => setEditingInclude({ index: i, value: item })} className="admin-btn-edit">✏️</button>
                      <button onClick={() => removeInclude(selected.id, i)} className="admin-btn-text-danger">×</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="admin-add-row">
              <input placeholder="Нова позиція..." value={newInclude} onChange={(e) => setNewInclude(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddInclude()} className="admin-input-field admin-item-input-large" />
              <button onClick={handleAddInclude} className="admin-btn-primary">+</button>
            </div>
          </div>

          {/* Додаткові послуги */}
          <div className="admin-items-section">
            <div className="admin-section-subtitle text-bold text-color-dark"><i className="bi bi-stars me-2 admin-logo-icon" />Додаткові послуги (addons)</div>
            <div className="admin-items-list">
              {currentEvent.addons?.map((addon) => (
                <div key={addon.id} className="admin-item-row">
                  {editingAddon?.id === addon.id ? (
                    <>
                      <input value={editingAddon.label} onChange={(e) => setEditingAddon((p) => ({ ...p, label: e.target.value }))} className="admin-input-field admin-item-input-large" />
                      <input type="number" value={editingAddon.price} onChange={(e) => setEditingAddon((p) => ({ ...p, price: e.target.value }))} className="admin-input-field admin-item-input-small" />
                      <button onClick={handleSaveAddon} className="admin-btn-success">✓</button>
                      <button onClick={() => setEditingAddon(null)} className="admin-btn-close">×</button>
                    </>
                  ) : (
                    <>
                      <span className="admin-item-text admin-item-input-large">{addon.label}</span>
                      <span className="admin-item-price admin-item-input-small">{formatPrice(addon.price)}</span>
                      <button onClick={() => setEditingAddon({ ...addon })} className="admin-btn-edit">✏️</button>
                      <button onClick={() => removeAddon(selected.id, addon.id)} className="admin-btn-text-danger">×</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="admin-add-row">
              <input placeholder="Назва послуги..." value={newAddon.label} onChange={(e) => setNewAddon((p) => ({ ...p, label: e.target.value }))} className="admin-input-field admin-item-input-large" />
              <input type="number" placeholder="Ціна" value={newAddon.price} onChange={(e) => setNewAddon((p) => ({ ...p, price: e.target.value }))} className="admin-input-field admin-item-input-small" />
              <button onClick={handleAddAddon} className="admin-btn-primary">+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ГОЛОВНА СТОРІНКА АДМІН-ПАНЕЛІ ───
const AdminPage = ({ onNavigate }) => {
  const { currentUser, isAdmin, authLoading } = useAuth();
  const [tab, setTab] = useState('orders');
  const { orders } = useOrders();

  if (authLoading) return (
    <div className="admin-loading-wrapper">
      <span className="spinner-border spinner-auth" />
    </div>
  );

  if (!currentUser) return (
    <div className="admin-auth-wrapper">
      <i className="bi bi-lock auth-icon" />
      <h3 className="admin-logo-title text-color-dark">Потрібна авторизація</h3>
      <p className="auth-text">Увійдіть, щоб отримати доступ до панелі</p>
      <button onClick={() => onNavigate('login')} className="admin-btn-primary mt-2">
        <i className="bi bi-box-arrow-in-right me-2" />Увійти
      </button>
    </div>
  );

  if (!isAdmin) return (
    <div className="admin-auth-wrapper">
      <i className="bi bi-shield-x auth-icon-danger" />
      <h3 className="admin-logo-title text-color-dark">Доступ заборонено</h3>
      <p className="auth-text">У вас немає прав адміністратора</p>
      <button onClick={() => onNavigate('home')} className="admin-btn-secondary mt-2">
        <i className="bi bi-house me-2" />На головну
      </button>
    </div>
  );

  const pendingCount = orders.filter((o) => (o.status || 'pending') === 'pending').length;

  const tabs = [
    { id: 'orders', icon: 'bi-bag-heart',      label: 'Замовлення',  badge: pendingCount || null },
    { id: 'events', icon: 'bi-calendar-event', label: 'Пакети подій' },
    { id: 'gallery', icon: 'bi-images',         label: 'Портфоліо' },
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <div className="admin-logo-group">
          <i className="bi bi-shield-lock admin-logo-icon" />
          <span className="admin-logo-title">Адмін-панель</span>
        </div>
        <div className="admin-user-group">
          <span className="admin-user-email"><i className="bi bi-person-circle me-1" />{currentUser.email}</span>
          <button onClick={() => onNavigate('home')} className="admin-nav-btn">
            <i className="bi bi-house me-1" />На сайт
          </button>
        </div>
      </div>

      <div className="container py-4">
        <div className="admin-tabs-container">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`admin-tab-btn ${tab === t.id ? 'active' : ''}`}>
              <i className={`bi ${t.icon}`} />
              {t.label}
              {t.badge ? <span className="admin-tab-badge">{t.badge}</span> : null}
            </button>
          ))}
        </div>

        {tab === 'orders' && <OrdersSection />}
        {tab === 'events' && <EventsSection />}
        {tab === 'gallery' && <GalleryManager />}
      </div>
    </div>
  );
};

export default AdminPage;