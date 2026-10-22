import React from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

/**
 * Pill-shaped button/link component.
 * variant: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost'
 * size:    'sm' | 'md' | 'lg'
 */
export default function Button({
  variant = 'primary',
  size    = 'md',
  to,
  href,
  type     = 'button',
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full'     : '',
    disabled  ? 'btn--disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  if (to)   return <Link to={to} className={cls} aria-disabled={disabled} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
  return <button type={type} className={cls} disabled={disabled} {...rest}>{children}</button>
}
