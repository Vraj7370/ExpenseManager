const DISMISSED_KEY = 'dismissedAlerts';

export const getDismissedAlertIds = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const dismissAlertId = (id) => {
  const current = getDismissedAlertIds();
  if (!current.includes(id)) {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, id]));
  }
  window.dispatchEvent(new CustomEvent('alerts-updated'));
};

export const dismissAllAlertIds = (ids) => {
  const current = getDismissedAlertIds();
  const merged = [...new Set([...current, ...ids])];
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('alerts-updated'));
};

export const filterActiveAlerts = (alerts) => {
  const dismissed = getDismissedAlertIds();
  return alerts.filter((a) => !dismissed.includes(a.id));
};
