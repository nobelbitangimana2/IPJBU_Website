import React, { createContext, useContext, useState, useEffect } from 'react'

/* ─────────────────────────────────────────────────────────────
   All translatable strings for the site.
   Add keys here, then use t('key') in components.
───────────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  /* ── NavBar ── */
  'nav.home':          { fr: 'Accueil',      en: 'Home'         },
  'nav.about':         { fr: 'À propos',     en: 'About'        },
  'nav.gallery':       { fr: 'Galerie',      en: 'Gallery'      },
  'nav.contact':       { fr: 'Contact',      en: 'Contact'      },
  'nav.menu':          { fr: 'Menu',         en: 'Menu'         },
  'nav.programmes':    { fr: 'Programmes',   en: 'Programmes'   },
  'nav.partners':      { fr: 'Partenaires',  en: 'Partners'     },
  'nav.opportunities': { fr: 'Opportunités', en: 'Opportunities'},
  'nav.news':          { fr: 'Actualités',   en: 'News'         },
  'nav.donate':        { fr: 'Faire un don', en: 'Donate'       },

  /* ── Home hero ── */
  'home.eyebrow':   { fr: 'IPJBU – DUHINDURINGENDO — Organisation de la société civile burundaise', en: 'IPJBU – DUHINDURINGENDO — Burundian civil society organisation' },
  'home.title':     { fr: 'Jeunesse Burundaise,\nfaisons la différence', en: 'Burundian Youth,\nlet\'s make a difference' },
  'home.subtitle':  { fr: 'Lutter contre la pauvreté par le développement agro-pastoral à travers des actions concrètes de formation et de soutien aux jeunes, aux orphelins et aux femmes vulnérables.', en: 'Fighting poverty through agro-pastoral development with concrete training and support for youth, orphans and vulnerable women.' },
  'home.cta.programmes': { fr: 'Nos programmes', en: 'Our programmes' },
  'home.cta.about':      { fr: 'À propos',       en: 'About us'       },

  /* ── Home sections ── */
  'home.features.label':  { fr: 'Ce que nous faisons',  en: 'What we do'       },
  'home.values.label':    { fr: 'Nos valeurs',           en: 'Our values'       },
  'home.values.title':    { fr: 'Ce qui guide\nnotre action', en: 'What drives\nour work' },
  'home.values.intro':    { fr: "L'IPJBU – DUHINDURINGENDO fonde son action sur quatre valeurs fondamentales qui orientent chaque décision, de la formation sur le terrain aux partenariats stratégiques.", en: 'IPJBU – DUHINDURINGENDO bases its work on four core values that guide every decision, from field training to strategic partnerships.' },
  'home.values.cta':      { fr: 'En savoir plus', en: 'Learn more'    },
  'home.news.label':      { fr: 'Actualités',     en: 'News'          },
  'home.news.title':      { fr: 'Dernières nouvelles', en: 'Latest news'  },
  'home.news.cta':        { fr: 'Toutes les actualités', en: 'All news'  },
  'home.partners.label':  { fr: 'Ils nous accompagnent', en: 'Our partners' },
  'home.partners.title':  { fr: 'Nos partenaires',       en: 'Our partners' },

  /* ── Feature cards ── */
  'feat.1.title': { fr: 'Formation agro-pastorale',          en: 'Agro-pastoral training'         },
  'feat.1.desc':  { fr: 'Nous formons les jeunes et les femmes vulnérables aux techniques agro-pastorales modernes pour renforcer leur autonomie et améliorer leur productivité.', en: 'We train youth and vulnerable women in modern agro-pastoral techniques to strengthen their autonomy and improve productivity.' },
  'feat.1.cta':   { fr: 'Nos programmes', en: 'Our programmes' },
  'feat.2.title': { fr: 'Équipement et intrants',             en: 'Equipment & inputs'             },
  'feat.2.desc':  { fr: 'Distribution de semences sélectionnées et de bétail/volailles de qualité, accompagnée du renforcement des capacités en gestion des stocks et en conservation des récoltes.', en: 'Distribution of selected seeds and quality livestock/poultry, alongside capacity building in stock management and harvest conservation.' },
  'feat.2.cta':   { fr: 'En savoir plus', en: 'Learn more' },
  'feat.3.title': { fr: 'Transformation agroalimentaire',     en: 'Agri-food processing'           },
  'feat.3.desc':  { fr: 'Mise en place de micro-unités de transformation agroalimentaire pour valoriser les productions locales et créer de la valeur ajoutée au sein des communautés.', en: 'Setting up micro agri-food processing units to add value to local production and create economic opportunities within communities.' },
  'feat.3.cta':   { fr: 'En savoir plus', en: 'Learn more' },

  /* ── Values ── */
  'val.integrity.title': { fr: 'Intégrité',    en: 'Integrity'    },
  'val.integrity.desc':  { fr: 'Nous agissons avec honnêteté et transparence dans toutes nos actions et engagements.', en: 'We act with honesty and transparency in all our actions and commitments.' },
  'val.account.title':   { fr: 'Redevabilité', en: 'Accountability'},
  'val.account.desc':    { fr: 'Nous rendons compte de nos résultats aux bénéficiaires, partenaires et à la communauté.', en: 'We report our results to beneficiaries, partners and the community.' },
  'val.solidarity.title':{ fr: 'Solidarité',   en: 'Solidarity'   },
  'val.solidarity.desc': { fr: 'Nous unissons les forces des jeunes et des femmes pour un développement collectif et durable.', en: 'We unite the strengths of youth and women for collective and sustainable development.' },
  'val.empathy.title':   { fr: 'Empathie',     en: 'Empathy'      },
  'val.empathy.desc':    { fr: 'Nous plaçons au centre de notre action les besoins réels des orphelins et des personnes vulnérables.', en: 'We place the real needs of orphans and vulnerable people at the centre of our work.' },

  /* ── About ── */
  'about.hero.label':   { fr: 'À propos de l\'IPJBU – DUHINDURINGENDO', en: 'About IPJBU – DUHINDURINGENDO' },
  'about.hero.title':   { fr: 'Qui sommes-nous ?', en: 'Who are we?' },
  'about.hero.sub':     { fr: 'Une association burundaise agréée, dédiée à l\'autopromotion de la jeunesse et des femmes vulnérables par le développement agro-pastoral durable.', en: 'An approved Burundian association dedicated to the self-promotion of youth and vulnerable women through sustainable agro-pastoral development.' },
  'about.mission':      { fr: 'Notre Mission',  en: 'Our Mission'  },
  'about.vision':       { fr: 'Notre Vision',   en: 'Our Vision'   },

  /* ── News ── */
  'news.hero.label': { fr: 'Actualités', en: 'News' },
  'news.hero.title': { fr: 'Dernières nouvelles', en: 'Latest news' },
  'news.hero.sub':   { fr: 'Suivez les activités, les succès et les annonces de l\'IPJBU – DUHINDURINGENDO.', en: 'Follow the activities, achievements and announcements of IPJBU – DUHINDURINGENDO.' },
  'news.filter.all': { fr: 'Tous', en: 'All' },
  'news.empty':      { fr: 'Aucune actualité dans cette catégorie.', en: 'No news in this category.' },
  'news.loading':    { fr: 'Chargement des actualités…', en: 'Loading news…' },

  /* ── Contact ── */
  'contact.hero.label':    { fr: 'Contact',         en: 'Contact'       },
  'contact.hero.title':    { fr: 'Contactez-nous',  en: 'Contact us'    },
  'contact.hero.sub':      { fr: 'Pour toute question sur nos programmes, un partenariat ou un soutien, n\'hésitez pas à nous écrire.', en: 'For any question about our programmes, a partnership or support, feel free to write to us.' },
  'contact.info.heading':  { fr: 'Informations de contact', en: 'Contact information' },
  'contact.form.heading':  { fr: 'Envoyer un message',      en: 'Send a message'      },
  'contact.form.name':     { fr: 'Nom complet',             en: 'Full name'           },
  'contact.form.email':    { fr: 'Adresse e-mail',          en: 'Email address'       },
  'contact.form.message':  { fr: 'Message',                 en: 'Message'             },
  'contact.form.submit':   { fr: 'Envoyer le message',      en: 'Send message'        },
  'contact.form.sending':  { fr: 'Envoi en cours…',         en: 'Sending…'            },
  'contact.success.title': { fr: 'Message envoyé !',        en: 'Message sent!'       },
  'contact.success.body':  { fr: 'Merci de nous avoir contactés. Nous vous répondrons dans les meilleurs délais.', en: 'Thank you for contacting us. We will reply as soon as possible.' },
  'contact.success.again': { fr: 'Envoyer un autre message', en: 'Send another message' },

  /* ── Gallery ── */
  'gallery.hero.label': { fr: 'Galerie photo',  en: 'Photo gallery' },
  'gallery.hero.title': { fr: 'Galerie',         en: 'Gallery'       },
  'gallery.hero.sub':   { fr: 'Une fenêtre visuelle sur les activités et les communautés soutenues par l\'IPJBU – DUHINDURINGENDO.', en: 'A visual window into the activities and communities supported by IPJBU – DUHINDURINGENDO.' },
  'gallery.photos':     { fr: 'photos', en: 'photos' },
  'gallery.photo':      { fr: 'photo',  en: 'photo'  },
  'gallery.loading':    { fr: 'Chargement de la galerie…', en: 'Loading gallery…' },
  'gallery.empty':      { fr: 'Aucune photo dans cette catégorie.', en: 'No photos in this category.' },

  /* ── Programmes ── */
  'prog.hero.title':  { fr: 'Programmes',   en: 'Programmes'   },
  'prog.hero.sub':    { fr: "Découvrez les cinq objectifs spécifiques de l'IPJBU – DUHINDURINGENDO et les dix étapes de notre méthode d'intervention sur le terrain.", en: 'Discover the five specific objectives of IPJBU – DUHINDURINGENDO and the ten steps of our field intervention method.' },
  'prog.obj.label':   { fr: 'Objectifs spécifiques', en: 'Specific objectives' },
  'prog.obj.title':   { fr: 'Ce que nous visons',    en: 'What we aim for'     },
  'prog.how.label':   { fr: 'Notre méthode',         en: 'Our method'          },
  'prog.how.title':   { fr: 'Comment nous travaillons', en: 'How we work'      },
  'prog.how.sub':     { fr: 'Dix étapes structurées pour maximiser l\'impact sur le terrain.', en: 'Ten structured steps to maximise field impact.' },
  'prog.cta.title':   { fr: 'Intéressé par nos programmes ?', en: 'Interested in our programmes?' },
  'prog.cta.sub':     { fr: 'Contactez-nous pour en savoir plus sur nos formations et nos activités sur le terrain.', en: 'Contact us to learn more about our training programmes and field activities.' },
  'prog.cta.btn':     { fr: 'Contacter l\'IPJBU', en: 'Contact IPJBU' },

  /* ── Partners ── */
  'partners.hero.title': { fr: 'Partenaires',  en: 'Partners'   },
  'partners.hero.sub':   { fr: "L'IPJBU – DUHINDURINGENDO avance grâce au soutien d'organisations partageant la vision d'une jeunesse burundaise autonome et prospère.", en: 'IPJBU – DUHINDURINGENDO moves forward thanks to the support of organisations sharing the vision of an autonomous and prosperous Burundian youth.' },
  'partners.cta.btn':    { fr: 'Devenir partenaire', en: 'Become a partner' },
  'partners.empty.title':{ fr: 'Des partenariats en cours de construction', en: 'Partnerships under development' },

  /* ── Opportunities ── */
  'opp.hero.title':   { fr: 'Opportunités', en: 'Opportunities' },
  'opp.hero.sub':     { fr: "Téléchargez nos documents officiels et découvrez les postes ouverts pour rejoindre l'équipe de l'IPJBU – DUHINDURINGENDO.", en: 'Download our official documents and discover open positions to join the IPJBU – DUHINDURINGENDO team.' },
  'opp.docs.label':   { fr: 'Ressources',   en: 'Resources'     },
  'opp.docs.title':   { fr: 'Documents officiels', en: 'Official documents' },
  'opp.jobs.label':   { fr: "Rejoindre l'équipe", en: 'Join the team' },
  'opp.jobs.title':   { fr: "Offres d'emploi & bénévolat", en: 'Jobs & volunteering' },
  'opp.soon':         { fr: 'Bientôt disponible', en: 'Coming soon' },
  'opp.download':     { fr: 'Télécharger',  en: 'Download'      },
  'opp.apply':        { fr: 'Postuler via le formulaire', en: 'Apply via the form' },

  /* ── Footer ── */
  'footer.legal': { fr: 'Agréée par O.M. n° 530/1158 du 12/05/2025', en: 'Approved by M.O. no. 530/1158 of 12/05/2025' },
  'footer.rights':{ fr: 'Tous droits réservés.', en: 'All rights reserved.' },

  /* ── Generic ── */
  'loading': { fr: 'Chargement…', en: 'Loading…' },
  'error':   { fr: 'Une erreur s\'est produite.', en: 'An error occurred.' },
  'back':    { fr: '← Retour',    en: '← Back'   },
  'learnmore':{ fr: 'En savoir plus', en: 'Learn more' },
  'contactus':{ fr: 'Nous contacter', en: 'Contact us'  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Persist preference in localStorage
    return localStorage.getItem('ipjbu-lang') || 'fr'
  })

  const toggle = () => {
    setLang(l => {
      const next = l === 'fr' ? 'en' : 'fr'
      localStorage.setItem('ipjbu-lang', next)
      return next
    })
  }

  // Keep <html lang="…"> in sync
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Translate helper: t('key') returns the string in the active language
  function t(key) {
    const entry = TRANSLATIONS[key]
    if (!entry) return key   // return key as fallback so missing strings are visible
    return entry[lang] ?? entry['fr'] ?? key
  }

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
