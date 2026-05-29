import React from 'react'

export const PageHeader = ({ eyebrow, title, subtitle, right }) => {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-sm font-semibold tracking-wide uppercase text-primary mb-2">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold text-slate-950 truncate">{title}</h1>
        {subtitle ? (
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}
