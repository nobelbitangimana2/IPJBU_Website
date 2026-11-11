import React, { useState } from 'react'
import Button  from '../components/Button'
import { useData } from '../store/DataContext'
import { useLang } from '../store/LangContext'
import { submitContactForm } from '../data/contact'
import './Contact.css'

const INIT = { name: '', email: '', message: '' }

export default function Contact() {
  const { contact: info } = useData()
  const { t, lang }       = useLang()
  const [fields,  setFields]  = useState(INIT)
  const [errors,  setErrors]  = useState({})
  const [touched, setTouched] = useState({})
  const [status,  setStatus]  = useState('idle')

  function validate(f) {
    const e = {}
    const isFr = lang === 'fr'
    if (!f.name.trim())    e.name    = isFr ? 'Le nom est requis.'             : 'Name is required.'
    if (!f.email.trim())   e.email   = isFr ? "L'adresse e-mail est requise."  : 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                           e.email   = isFr ? 'Entrez une adresse e-mail valide.' : 'Enter a valid email address.'
    if (!f.message.trim()) e.message = isFr ? 'Le message est requis.'         : 'Message is required.'
    return e
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFields(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }
  const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }))
  const fieldErr   = n => touched[n] && errors[n] ? errors[n] : ''

  const handleSubmit = async e => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('submitting')
    try {
      await submitContactForm(fields)
      setStatus('success')
      setFields(INIT)
      setTouched({})
      setErrors({})
    } catch (err) {
      setStatus('error')
    }
  }

  const phonesList = info?.phones?.length
    ? info.phones
    : (info?.phone ? [{ label: lang === 'fr' ? 'Tel' : 'Phone', number: info.phone }] : [])

  const mapSrc = info?.mapEmbedUrl ||
    'https://www.openstreetmap.org/export/embed.html?bbox=29.90%2C-3.47%2C29.96%2C-3.42&layer=mapnik'

  return (
    <div className="contact-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('contact.hero.label')}</span>
          <h1 className="page-hero__title">{t('contact.hero.title')}</h1>
          <p className="page-hero__sub">{t('contact.hero.sub')}</p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container contact__grid">

          {/* Contact info */}
          <div className="contact__info">
            <h2 className="contact__heading">{t('contact.info.heading')}</h2>
            {info && (
              <>
                <div className="contact__items">
                  {info.address && (
                    <div className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">📍</span>
                      <div>
                        <p className="contact__item-label">{lang === 'fr' ? 'Adresse' : 'Address'}</p>
                        <div className="contact__item-value">{info.address}</div>
                      </div>
                    </div>
                  )}
                  {phonesList.map(({ label, number }) => (
                    <div key={number} className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">📞</span>
                      <div>
                        <p className="contact__item-label">{label || (lang === 'fr' ? 'Téléphone' : 'Phone')}</p>
                        <div className="contact__item-value">
                          <a href={`tel:${(number || '').replace(/\s/g, '')}`}>{number}</a>
                        </div>
                      </div>
                    </div>
                  ))}
                  {info.email && (
                    <div className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">✉️</span>
                      <div>
                        <p className="contact__item-label">E-mail</p>
                        <div className="contact__item-value">
                          <a href={`mailto:${info.email}`}>{info.email}</a>
                        </div>
                      </div>
                    </div>
                  )}
                  {info.officeHours && (
                    <div className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">🕐</span>
                      <div>
                        <p className="contact__item-label">{lang === 'fr' ? 'Horaires' : 'Hours'}</p>
                        <div className="contact__item-value">{info.officeHours}</div>
                      </div>
                    </div>
                  )}
                </div>

                {info.socialLinks && Object.values(info.socialLinks).some(Boolean) && (
                  <div className="contact__social">
                    <p className="contact__social-label">{lang === 'fr' ? 'Suivez-nous' : 'Follow us'}</p>
                    <div className="contact__social-pills">
                      {Object.entries(info.socialLinks).map(([p, url]) =>
                        url ? (
                          <a key={p} href={url} target="_blank" rel="noopener noreferrer"
                            className="contact__social-pill">
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="contact__map">
              <iframe
                title="Localisation IPJBU"
                src={mapSrc}
                width="100%" height="220"
                style={{ border: 'none', borderRadius: 'var(--radius)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="contact__form-wrap">
            <h2 className="contact__heading">{t('contact.form.heading')}</h2>

            {status === 'success' ? (
              <div className="contact__success" role="alert">
                <span className="contact__success-icon" aria-hidden="true">✅</span>
                <h3>{t('contact.success.title')}</h3>
                <p>{t('contact.success.body')}</p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  {t('contact.success.again')}
                </Button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                {[
                  { id: 'name',  label: t('contact.form.name'),  type: 'text',  autoComplete: 'name',  placeholder: lang === 'fr' ? 'Votre nom complet' : 'Your full name' },
                  { id: 'email', label: t('contact.form.email'), type: 'email', autoComplete: 'email', placeholder: lang === 'fr' ? 'vous@exemple.com'  : 'you@example.com' },
                ].map(({ id, label, type, autoComplete, placeholder }) => (
                  <div key={id} className={`cform-field${fieldErr(id) ? ' cform-field--error' : ''}`}>
                    <label htmlFor={id} className="cform-label">{label} <span aria-hidden="true">*</span></label>
                    <input id={id} name={id} type={type} className="cform-input"
                      value={fields[id]} onChange={handleChange} onBlur={handleBlur}
                      autoComplete={autoComplete} placeholder={placeholder}
                      aria-required="true" disabled={status === 'submitting'} />
                    {fieldErr(id) && <p className="cform-error" role="alert">{fieldErr(id)}</p>}
                  </div>
                ))}

                <div className={`cform-field${fieldErr('message') ? ' cform-field--error' : ''}`}>
                  <label htmlFor="message" className="cform-label">
                    {t('contact.form.message')} <span aria-hidden="true">*</span>
                  </label>
                  <textarea id="message" name="message" className="cform-input cform-textarea"
                    value={fields.message} onChange={handleChange} onBlur={handleBlur}
                    rows={6}
                    placeholder={lang === 'fr' ? 'Comment pouvons-nous vous aider ?' : 'How can we help you?'}
                    aria-required="true" disabled={status === 'submitting'} />
                  {fieldErr('message') && <p className="cform-error" role="alert">{fieldErr('message')}</p>}
                </div>

                {status === 'error' && (
                  <p className="cform-submit-error" role="alert">{t('error')}</p>
                )}

                <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
                  {status === 'submitting' ? t('contact.form.sending') : t('contact.form.submit')}
                </Button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
