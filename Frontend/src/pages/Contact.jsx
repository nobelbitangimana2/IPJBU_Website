import React, { useEffect, useState } from 'react'
import Button  from '../components/Button'
import { useData } from '../store/DataContext'
import { getContactInfo, submitContactForm } from '../data/contact'
import './Contact.css'

const INIT = { name: '', email: '', message: '' }

function validate(f) {
  const e = {}
  if (!f.name.trim())    e.name    = 'Le nom est requis.'
  if (!f.email.trim())   e.email   = 'L\'adresse e-mail est requise.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Entrez une adresse e-mail valide.'
  if (!f.message.trim()) e.message = 'Le message est requis.'
  return e
}

export default function Contact() {
  const { contact: liveContact } = useData()
  const [info,    setInfo]    = useState(null)
  const [fields,  setFields]  = useState(INIT)
  const [errors,  setErrors]  = useState({})
  const [touched, setTouched] = useState({})
  const [status,  setStatus]  = useState('idle')

  useEffect(() => { getContactInfo(liveContact).then(setInfo) }, [liveContact])

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
      console.error('Erreur formulaire de contact :', err.message)
      setStatus('error')
    }
  }

  /* Résolution des numéros de téléphone (nouveau format phones[] ou ancien phone) */
  const phonesList = info?.phones?.length
    ? info.phones
    : (info?.phone ? [{ label: 'Téléphone', number: info.phone }] : [])

  /* Résolution de l'URL de la carte */
  const mapSrc = info?.mapEmbedUrl ||
    'https://www.openstreetmap.org/export/embed.html?bbox=29.90%2C-3.47%2C29.96%2C-3.42&layer=mapnik'

  return (
    <div className="contact-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Contact</span>
          <h1 className="page-hero__title">Contactez-nous</h1>
          <p className="page-hero__sub">
            Pour toute question sur nos programmes, un partenariat ou un soutien,
            n'hésitez pas à nous écrire.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container contact__grid">

          {/* Informations de contact */}
          <div className="contact__info">
            <h2 className="contact__heading">Informations de contact</h2>
            {info && (
              <>
                <div className="contact__items">
                  {/* Adresse */}
                  {info.address && (
                    <div className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">📍</span>
                      <div>
                        <p className="contact__item-label">Adresse</p>
                        <div className="contact__item-value">{info.address}</div>
                      </div>
                    </div>
                  )}

                  {/* Téléphones (format tableau) */}
                  {phonesList.length > 0 && phonesList.map(({ label, number }) => (
                    <div key={number} className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">📞</span>
                      <div>
                        <p className="contact__item-label">{label || 'Téléphone'}</p>
                        <div className="contact__item-value">
                          <a href={`tel:${(number || '').replace(/\s/g, '')}`}>{number}</a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* E-mail (masqué si vide) */}
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

                  {/* Horaires */}
                  {info.officeHours && (
                    <div className="contact__item">
                      <span className="contact__item-icon" aria-hidden="true">🕐</span>
                      <div>
                        <p className="contact__item-label">Horaires</p>
                        <div className="contact__item-value">{info.officeHours}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Réseaux sociaux — masqués si tous vides */}
                {info.socialLinks && Object.values(info.socialLinks).some(Boolean) && (
                  <div className="contact__social">
                    <p className="contact__social-label">Suivez-nous</p>
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

            {/* Carte */}
            <div className="contact__map">
              <iframe
                title="Localisation IPJBU – DUHINDURINGENDO"
                src={mapSrc}
                width="100%" height="220"
                style={{ border: 'none', borderRadius: 'var(--radius)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Formulaire */}
          <div className="contact__form-wrap">
            <h2 className="contact__heading">Envoyer un message</h2>

            {status === 'success' ? (
              <div className="contact__success" role="alert">
                <span className="contact__success-icon" aria-hidden="true">✅</span>
                <h3>Message envoyé&nbsp;!</h3>
                <p>Merci de nous avoir contactés. Nous vous répondrons dans les meilleurs délais.</p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                {[
                  { id: 'name',  label: 'Nom complet',       type: 'text',  autoComplete: 'name',  placeholder: 'Votre nom complet'   },
                  { id: 'email', label: 'Adresse e-mail',    type: 'email', autoComplete: 'email', placeholder: 'vous@exemple.com'    },
                ].map(({ id, label, type, autoComplete, placeholder }) => (
                  <div key={id} className={`cform-field${fieldErr(id) ? ' cform-field--error' : ''}`}>
                    <label htmlFor={id} className="cform-label">{label} <span aria-hidden="true">*</span></label>
                    <input
                      id={id} name={id} type={type}
                      className="cform-input"
                      value={fields[id]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      aria-required="true"
                      disabled={status === 'submitting'}
                    />
                    {fieldErr(id) && <p className="cform-error" role="alert">{fieldErr(id)}</p>}
                  </div>
                ))}

                <div className={`cform-field${fieldErr('message') ? ' cform-field--error' : ''}`}>
                  <label htmlFor="message" className="cform-label">Message <span aria-hidden="true">*</span></label>
                  <textarea
                    id="message" name="message"
                    className="cform-input cform-textarea"
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={6}
                    placeholder="Comment pouvons-nous vous aider ?"
                    aria-required="true"
                    disabled={status === 'submitting'}
                  />
                  {fieldErr('message') && <p className="cform-error" role="alert">{fieldErr('message')}</p>}
                </div>

                {status === 'error' && (
                  <p className="cform-submit-error" role="alert">
                    Une erreur s'est produite. Veuillez réessayer.
                  </p>
                )}

                <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Envoi en cours…' : 'Envoyer le message'}
                </Button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
