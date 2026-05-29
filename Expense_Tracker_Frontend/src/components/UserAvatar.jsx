import React from 'react';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-10 w-10 text-base',
};

const getInitials = (user) => {
  const first = user?.firstName?.charAt(0) || '';
  const last = user?.lastName?.charAt(0) || '';
  if (first || last) return `${first}${last}`.toUpperCase();
  return user?.email?.charAt(0)?.toUpperCase() || 'U';
};

export const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const dim = sizeClasses[size] || sizeClasses.md;

  if (user?.profilePic) {
    return (
      <img
        src={user.profilePic}
        alt={user.firstName ? `${user.firstName}'s profile` : 'Profile'}
        className={`rounded-full object-cover border border-slate-200 bg-white shrink-0 ${dim} ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-primary-50 text-primary font-semibold border border-primary-100 shrink-0 ${dim} ${className}`}
      aria-hidden="true"
    >
      {getInitials(user)}
    </span>
  );
};
