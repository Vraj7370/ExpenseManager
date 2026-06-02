import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAlerts } from '../api/alertService';
import {
  dismissAlertId,
  dismissAllAlertIds,
  filterActiveAlerts,
} from '../utils/alertStorage';

const levelConfig = {
  danger: {
    icon: AlertCircle,
    card: 'border-red-200 bg-red-50',
    badge: 'bg-red-100 text-red-800',
    label: 'Important',
  },
  warning: {
    icon: AlertTriangle,
    card: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-800',
    label: 'Warning',
  },
  info: {
    icon: Info,
    card: 'border-sky-200 bg-sky-50',
    badge: 'bg-sky-100 text-sky-800',
    label: 'Info',
  },
};

export const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAlerts();
      setAlerts(filterActiveAlerts(data));
    } catch {
      toast.error('Could not load alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    const onUpdate = () => loadAlerts();
    window.addEventListener('alerts-updated', onUpdate);
    return () => window.removeEventListener('alerts-updated', onUpdate);
  }, [loadAlerts]);

  const handleDismiss = (id) => {
    dismissAlertId(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.info('Alert dismissed');
  };

  const handleDismissAll = async () => {
    try {
      const data = await fetchAlerts();
      dismissAllAlertIds(data.map((a) => a.id));
      setAlerts([]);
      toast.success('All alerts dismissed');
    } catch {
      toast.error('Could not dismiss alerts');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-1">Alerts</p>
          <h1 className="text-3xl font-semibold text-slate-950">Notifications</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Simple reminders from your budgets and monthly activity.
          </p>
        </div>
        {alerts.length > 0 && (
          <button
            type="button"
            onClick={handleDismissAll}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-3 py-2 rounded-md"
          >
            Dismiss all
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-500">
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <CheckCircle className="mx-auto text-primary mb-3" size={40} />
          <h2 className="text-lg font-semibold text-slate-950">All clear</h2>
          <p className="text-slate-500 text-sm mt-2">
            No active alerts. We notify you when a budget is almost full, exceeded, or spending is high.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const config = levelConfig[alert.level] || levelConfig.info;
            const Icon = config.icon;
            return (
              <li
                key={alert.id}
                className={`rounded-lg border p-4 ${config.card}`}
              >
                <div className="flex gap-3">
                  <Icon className="shrink-0 mt-0.5" size={22} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-950">{alert.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${config.badge}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{alert.message}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {alert.actionPath && (
                        <Link
                          to={alert.actionPath}
                          className="text-sm font-medium text-primary hover:text-primary-hover"
                        >
                          View details →
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDismiss(alert.id)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-500 flex gap-2">
        <Bell size={18} className="shrink-0 text-primary" />
        <p>
          Alerts are checked when you open this page or refresh the app. Dismissed alerts stay hidden on this device.
        </p>
      </div>
    </div>
  );
};
