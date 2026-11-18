import React, { useEffect, useRef, useState } from 'react'
import './Reveal.css'

export default function Reveal({ children, animation = 'fade-up', delay = 0, as: Element = 'div', className = '', style = {}, ...props }) {
  const elementRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) return undefined

    const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!motionAllowed) {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setRevealed(true)
      observer.unobserve(entry.target)
    }, { threshold: 0.12 })

    observer.observe(element)
    setReady(true)
    return () => observer.disconnect()
  }, [])

  return (
    <Element
      ref={elementRef}
      className={`reveal${ready ? ' reveal--ready' : ''}${revealed ? ' reveal--visible' : ''} reveal--${animation}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Element>
  )
}
