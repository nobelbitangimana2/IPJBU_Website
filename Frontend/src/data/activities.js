/**
 * Données IPJBU – Objectifs spécifiques et étapes de travail.
 * La page Programmes (/programmes) utilise ces données directement
 * en mode statique. Si une API programmes est ajoutée ultérieurement,
 * remplacer les corps de getObjectives() et getSteps() par des appels fetch().
 */

const OBJECTIVES = [
  {
    id: '1',
    icon: '📚',
    title: 'Formation en techniques agro-pastorales',
    description:
      'Former les jeunes et les femmes vulnérables aux techniques agro-pastorales modernes pour améliorer la productivité et assurer des moyens de subsistance durables.',
  },
  {
    id: '2',
    icon: '🌐',
    title: 'Échanges d\'expériences nationaux et internationaux',
    description:
      "Organiser des échanges d\u2019expériences aux niveaux national et international pour partager les bonnes pratiques agro-pastorales et renforcer les liens entre acteurs du secteur.",
  },
  {
    id: '3',
    icon: '🛠️',
    title: 'Renforcement des capacités et équipement',
    description:
      'Renforcer les compétences en gestion des stocks et équiper les bénéficiaires en matériel agro-pastoral adapté à leurs besoins et à leur contexte local.',
  },
  {
    id: '4',
    icon: '🏭',
    title: 'Micro-unités de transformation agroalimentaire',
    description:
      'Mettre en place des micro-unités de transformation agroalimentaire pour valoriser les productions locales, réduire les pertes post-récolte et créer de la valeur ajoutée.',
  },
  {
    id: '5',
    icon: '💡',
    title: 'Promotion des nouvelles technologies agro-pastorales',
    description:
      "Promouvoir l\u2019utilisation des nouvelles technologies agro-pastorales à travers le pays pour moderniser les pratiques et améliorer les rendements.",
  },
]

const STEPS = [
  'Ciblage et identification des bénéficiaires',
  'Formation des formateurs',
  'Renforcement des capacités en techniques agro-pastorales',
  'Implantation de points agro-pastoraux didactiques',
  'Distribution de semences sélectionnées et de bétail/volailles de qualité',
  'Encadrement de la population cible',
  'Initiation à la construction de stocks et à la conservation des récoltes',
  'Initiation à l\'effet boule de neige pour étendre la couverture à tout le pays',
  'Identification des marchés d\'écoulement',
  'Identification des sources d\'approvisionnement en semences et bétail de qualité',
]

/**
 * Retourne les objectifs spécifiques de l'IPJBU.
 * @returns {Promise<Array>}
 */
export async function getObjectives() {
  // TODO: remplacer par → return fetch('/api/programmes').then(r => r.json())
  return Promise.resolve(OBJECTIVES)
}

/**
 * Retourne les étapes de travail de l'IPJBU.
 * @returns {Promise<string[]>}
 */
export async function getSteps() {
  return Promise.resolve(STEPS)
}

// Maintenu pour rétrocompatibilité (ancienne page Activities)
export async function getActivities() {
  return Promise.resolve(OBJECTIVES)
}

export async function getActivityCategories() {
  return Promise.resolve([])
}
