'use strict'

/**
 * Script de configuration initiale — à exécuter une seule fois pour peupler la base de données avec :
 *  - Un utilisateur admin (identifiants lus depuis les variables d'environnement)
 *  - Le contenu de mission/vision de l'IPJBU
 *  - Les informations de contact de l'IPJBU
 *  - Un premier article d'actualité
 *
 * Usage :
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=votremotdepasse node scripts/seed.js
 *
 * Variables d'environnement requises :
 *   MONGO_URI          — chaîne de connexion MongoDB
 *   ADMIN_USERNAME     — nom d'utilisateur de l'administrateur
 *   ADMIN_PASSWORD     — mot de passe de l'administrateur (min. 8 caractères recommandé)
 *
 * Le script est idempotent : il passe les étapes si les données existent déjà.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const mongoose    = require('mongoose')
const bcrypt      = require('bcryptjs')
const Admin       = require('../models/Admin')
const Update      = require('../models/Update')
const SiteContent = require('../models/SiteContent')
const Contact     = require('../models/Contact')
const Category    = require('../models/Category')

async function seed() {
  // ── Vérification des variables d'environnement requises ─────────────────────
  if (!process.env.MONGO_URI) {
    console.error('✗ MONGO_URI est manquant. Définissez-le dans le fichier .env.')
    process.exit(1)
  }
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.error('✗ ADMIN_USERNAME et ADMIN_PASSWORD doivent être définis en variables d\'environnement.')
    console.error('  Exemple : ADMIN_USERNAME=admin ADMIN_PASSWORD=votremotdepasse node scripts/seed.js')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✓ Connecté à MongoDB')

  const categories = ['agriculture', 'formation', 'partenariats', 'communauté', 'infrastructure', 'général']
  for (const name of categories) {
    const slug = name.toLowerCase()
    await Category.updateOne({ slug }, { $setOnInsert: { name, slug } }, { upsert: true })
  }
  console.log('✓ Catégories vérifiées')

  // ── Utilisateur admin ──────────────────────────────────────────────────────
  const adminUsername = process.env.ADMIN_USERNAME.trim().toLowerCase()
  const existingAdmin = await Admin.findOne({ username: adminUsername })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
    await Admin.create({ username: adminUsername, passwordHash })
    console.log(`✓ Utilisateur admin créé  (username: ${adminUsername})`)
  } else {
    console.log(`– Utilisateur admin "${adminUsername}" déjà existant, ignoré`)
  }

  // ── Contenu du site ────────────────────────────────────────────────────────
  const existingContent = await SiteContent.findOne()
  if (!existingContent) {
    await SiteContent.create({
      mission: 'Promouvoir l\'autopromotion de la jeunesse et des femmes vulnérables par le développement agro-pastoral durable.',
      vision:  'Une jeunesse autonome, solidaire et actrice du développement socio-économique du Burundi.',
      partners: [],
    })
    console.log('✓ Contenu du site créé')
  } else {
    console.log('– Contenu du site déjà existant, ignoré')
  }

  // ── Informations de contact ────────────────────────────────────────────────
  const existingContact = await Contact.findOne()
  if (!existingContact) {
    await Contact.create({
      address:     'Quartier Mugoboka, Commune et Province de Gitega, Burundi',
      phone:       '+257 61 737 099',
      email:       '',
      officeHours: '',
      mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=29.88%2C-3.48%2C29.96%2C-3.42&layer=mapnik',
      phones: [
        { label: 'Président',                  number: '+257 61 737 099' },
        { label: 'Vice-Président',             number: '+257 79 050 468' },
        { label: 'Secrétaire Général',         number: '+257 61 053 424' },
        { label: 'Représentant de la Diaspora', number: '+44 7842 173523' },
      ],
      socialLinks: {
        facebook:  '',
        twitter:   '',
        instagram: '',
        linkedin:  '',
        youtube:   '',
      },
    })
    console.log('✓ Informations de contact créées')
  } else {
    console.log('– Informations de contact déjà existantes, ignorées')
  }

  // ── Premier article d'actualité ────────────────────────────────────────────
  const updateCount = await Update.countDocuments()
  if (updateCount === 0) {
    await Update.create({
      title:    'L\'IPJBU lance son site web officiel',
      date:     new Date().toISOString().slice(0, 10),
      excerpt:  'L\'Initiative pour l\'Autopromotion Socio-économique de la Jeunesse au Burundi (IPJBU – DUHINDURINGENDO) lance officiellement son site web pour mieux communiquer avec ses bénéficiaires et partenaires.',
      body:     'L\'IPJBU – DUHINDURINGENDO est fière d\'annoncer le lancement de son site web officiel.\n\nAgrée par Ordonnance Ministérielle n° 530/1158 du 12/05/2025, l\'association œuvre dans le secteur agro-pastoral au Burundi, avec pour mission de promouvoir l\'autopromotion de la jeunesse et des femmes vulnérables par le développement agro-pastoral durable.\n\nCe site est un espace d\'information sur nos programmes, nos activités et nos valeurs. Il permet également aux partenaires et bénéficiaires potentiels de prendre contact avec nous.\n\nSuivez nos actualités pour rester informé de nos prochaines activités de formation et de terrain.',
      imageUrl: '',
      category: 'général',
    })
    console.log('✓ Premier article créé')
  } else {
    console.log(`– Articles déjà existants (${updateCount} enregistrement(s)), ignorés`)
  }

  await mongoose.disconnect()
  console.log('✓ Configuration initiale terminée. Déconnecté.')
}

seed().catch((err) => {
  console.error('✗ Échec de la configuration initiale :', err)
  process.exit(1)
})
