import React from 'react'
import './MentionsLegales.css'

export default function MentionsLegales() {
  return (
    <div className="ml-page">

      <div className="page-hero">
        <div className="container page-hero__inner">
          <span className="page-hero__label">Informations légales</span>
          <h1 className="page-hero__title">Mentions légales et confidentialité</h1>
          <p className="page-hero__sub">
            Informations relatives à l'éditeur du site, à l'hébergement et au traitement des données.
          </p>
        </div>
      </div>

      <section className="section section--white">
        <div className="container ml-page__content">

          {/* Éditeur */}
          <article className="ml-block">
            <h2 className="ml-block__title">1. Éditeur du site</h2>
            <table className="ml-table">
              <tbody>
                <tr><th>Nom de l'association</th><td>IPJBU – DUHINDURINGENDO</td></tr>
                <tr><th>Nom complet</th><td>Initiative pour l'Autopromotion Socio-économique de la Jeunesse au Burundi</td></tr>
                <tr><th>Statut juridique</th><td>Association agréée par Ordonnance Ministérielle n°&nbsp;530/1158 du 12/05/2025</td></tr>
                <tr><th>Adresse du siège</th><td>Quartier Mugoboka, Commune et Province de Gitega, Burundi</td></tr>
                <tr>
                  <th>Téléphones</th>
                  <td>
                    Président : <a href="tel:+25761737099">+257 61 737 099</a><br />
                    Vice-Président : <a href="tel:+25779050468">+257 79 050 468</a><br />
                    Secrétaire Général : <a href="tel:+25761053424">+257 61 053 424</a><br />
                    Représentant de la Diaspora : <a href="tel:+447842173523">+44 7842 173523</a>
                  </td>
                </tr>
                <tr><th>E-mail</th><td>[à compléter]</td></tr>
              </tbody>
            </table>
          </article>

          {/* Hébergement */}
          <article className="ml-block">
            <h2 className="ml-block__title">2. Hébergement</h2>
            <p className="ml-block__text">
              Ce site est hébergé par : [à compléter — nom, adresse et contact de l'hébergeur].
            </p>
          </article>

          {/* Propriété intellectuelle */}
          <article className="ml-block">
            <h2 className="ml-block__title">3. Propriété intellectuelle</h2>
            <p className="ml-block__text">
              L'ensemble du contenu de ce site (textes, images, logo, structure) est la propriété
              exclusive de l'IPJBU – DUHINDURINGENDO ou de ses ayants droit, sauf mention contraire.
              Toute reproduction, représentation, modification ou exploitation non autorisée est interdite.
            </p>
          </article>

          {/* Confidentialité */}
          <article className="ml-block">
            <h2 className="ml-block__title">4. Politique de confidentialité</h2>
            <h3 className="ml-block__subtitle">4.1 Données collectées</h3>
            <p className="ml-block__text">
              Ce site collecte uniquement les données que vous fournissez volontairement via le
              <strong> formulaire de contact</strong> : votre nom, votre adresse e-mail et votre message.
              Aucune autre donnée personnelle n'est collectée.
            </p>
            <h3 className="ml-block__subtitle">4.2 Utilisation des données</h3>
            <p className="ml-block__text">
              Les informations transmises via le formulaire de contact sont utilisées exclusivement
              pour répondre à votre demande. Elles ne sont ni revendues, ni transmises à des tiers,
              ni utilisées à des fins commerciales.
            </p>
            <h3 className="ml-block__subtitle">4.3 Conservation des données</h3>
            <p className="ml-block__text">
              Vos données sont conservées le temps nécessaire au traitement de votre demande
              et supprimées dès que celle-ci est clôturée.
            </p>
            <h3 className="ml-block__subtitle">4.4 Vos droits</h3>
            <p className="ml-block__text">
              Conformément à la législation applicable en matière de protection des données,
              vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              Pour exercer ces droits, contactez-nous à l'adresse postale ou au numéro de téléphone
              indiqués à la section 1 ci-dessus.
            </p>
            <h3 className="ml-block__subtitle">4.5 Cookies</h3>
            <p className="ml-block__text">
              Ce site n'utilise pas de cookies de traçage ni d'outils d'analyse comportementale.
            </p>
          </article>

          {/* Responsabilité */}
          <article className="ml-block">
            <h2 className="ml-block__title">5. Limitation de responsabilité</h2>
            <p className="ml-block__text">
              L'IPJBU – DUHINDURINGENDO s'efforce de maintenir les informations de ce site à jour
              et exactes. Cependant, elle ne peut garantir l'exhaustivité ou l'exactitude de toutes
              les informations publiées et décline toute responsabilité pour tout dommage résultant
              de leur utilisation.
            </p>
          </article>

          {/* Date */}
          <p className="ml-page__updated">
            Dernière mise à jour : mai 2025
          </p>

        </div>
      </section>

    </div>
  )
}
