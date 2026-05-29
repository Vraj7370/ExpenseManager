import React from 'react'
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

const icons = {
  loading: Loader2,
  empty: Inbox,
  error: AlertTriangle
}

export const StateCard = ({
  variant = 'empty',
  title,
  description,
  action
}) => {
  const Icon = icons[variant] || Inbox

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm py-14 px-6 text-center">
      <Icon
        className={`mx-auto mb-3 ${
          variant === 'loading'
            ? 'animate-spin text-slate-400'
            : variant === 'error'
              ? 'text-amber-500'
              : 'text-slate-400'
        }`}
        size={28}
        aria-hidden="true"
      />
      <p className="text-slate-900 font-semibold">{title}</p>
      {description ? (
        <p className="text-slate-500 text-sm mt-2">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}
