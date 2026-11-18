import React from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal'
import './MentionsLegales.css'

export default function MentionsLegales() {
  const { t } = useTranslation()

  return (
    <div className="ml-page">
      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">{t('legal.hero.label')}</span>
          <h1 className="page-hero__title">{t('legal.hero.title')}</h1>
          <p className="page-hero__sub">{t('legal.hero.sub')}</p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container ml-page__content">
          <Reveal as="article" className="ml-block">
            <h2 className="ml-block__title">{t('legal.editor.title')}</h2>
            <table className="ml-table">
              <tbody>
                <tr><th>{t('legal.association')}</th><td>IPJBU – DUHINDURINGENDO</td></tr>
                <tr><th>{t('legal.fullName')}</th><td>{t('legal.association.full')}</td></tr>
                <tr><th>{t('legal.status')}</th><td>{t('legal.association.status')}</td></tr>
                <tr><th>{t('legal.address')}</th><td>{t('legal.address.value')}</td></tr>
                <tr>
                  <th>{t('legal.phones')}</th>
                  <td>
                    {t('legal.phone.president')}: <a href="tel:+25761737099">+257 61 737 099</a><br />
                    {t('legal.phone.vicePresident')}: <a href="tel:+25779050468">+257 79 050 468</a><br />
                    {t('legal.phone.secretary')}: <a href="tel:+25761053424">+257 61 053 424</a><br />
                    {t('legal.phone.diaspora')}: <a href="tel:+447842173523">+44 7842 173523</a>
                  </td>
                </tr>
                <tr><th>{t('legal.email')}</th><td>{t('legal.email.value')}</td></tr>
              </tbody>
            </table>
          </Reveal>

          <Reveal as="article" className="ml-block" delay={60}>
            <h2 className="ml-block__title">{t('legal.hosting.title')}</h2>
            <p className="ml-block__text">{t('legal.hosting.body')}</p>
          </Reveal>

          <Reveal as="article" className="ml-block" delay={90}>
            <h2 className="ml-block__title">{t('legal.ip.title')}</h2>
            <p className="ml-block__text">{t('legal.ip.body')}</p>
          </Reveal>

          <Reveal as="article" className="ml-block" delay={120}>
            <h2 className="ml-block__title">{t('legal.privacy.title')}</h2>
            <h3 className="ml-block__subtitle">{t('legal.data.collected.title')}</h3>
            <p className="ml-block__text">{t('legal.data.collected.body')}</p>
            <h3 className="ml-block__subtitle">{t('legal.data.use.title')}</h3>
            <p className="ml-block__text">{t('legal.data.use.body')}</p>
            <h3 className="ml-block__subtitle">{t('legal.data.retention.title')}</h3>
            <p className="ml-block__text">{t('legal.data.retention.body')}</p>
            <h3 className="ml-block__subtitle">{t('legal.data.rights.title')}</h3>
            <p className="ml-block__text">{t('legal.data.rights.body')}</p>
            <h3 className="ml-block__subtitle">{t('legal.cookies.title')}</h3>
            <p className="ml-block__text">{t('legal.cookies.body')}</p>
          </Reveal>

          <Reveal as="article" className="ml-block" delay={150}>
            <h2 className="ml-block__title">{t('legal.liability.title')}</h2>
            <p className="ml-block__text">{t('legal.liability.body')}</p>
          </Reveal>

          <p className="ml-page__updated">{t('legal.updated')}</p>
        </div>
      </section>
    </div>
  )
}
