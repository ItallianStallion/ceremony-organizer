export const formatPrice = (price) => {
  // Конвертуємо в число — захист від рядків та undefined
  const num = Number(price);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency', currency: 'UAH', maximumFractionDigits: 0,
  }).format(num);
};

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const shortEmail = (email) => {
  if (!email) return '';
  const [local] = email.split('@');
  return local.length > 14 ? local.slice(0, 14) + '…' : local;
};

// Повертає мінімально допустиму дату для бронювання (leadDays вперед від сьогодні)
export const getMinBookingDate = (leadDays = 1) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + leadDays);
  return d;
};

// Форматує Date → 'РРРР-ММ-ДД' для input[type=date]
export const toInputDateValue = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Форматує Date → 'ДД.ММ.РРРР' для відображення
export const formatDisplayDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('uk-UA').format(date);
};