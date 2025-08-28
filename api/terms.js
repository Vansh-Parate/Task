import 'dotenv/config'
import { Sequelize, DataTypes } from 'sequelize'

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/terms'

// Initialize Sequelize with serverless-optimized settings
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  pool: {
    max: 1, // Reduced for serverless
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

// Define Terms model
const Term = sequelize.define('Term', {
  lang: { type: DataTypes.STRING(2), allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'terms',
  indexes: [
    { unique: false, fields: ['lang'] },
    { unique: true, fields: ['lang', 'slug'] },
  ],
})

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test database connection
    await sequelize.authenticate()
    
    // Sync the model
    await Term.sync({ force: false })
    
    // Check if we have data, if not, seed it with basic data
    const count = await Term.count()
    if (count === 0) {
      console.log('No terms found, seeding basic data...')
      
      // Basic seed data without importing the seeder
      const basicTerms = [
        {
          lang: 'sv',
          slug: 'terms',
          title: 'Villkor',
          content: '<p class=""><b>GENOM ATT</b> klicka på Fakturera Nu så väljer ni att registrera enligt den information som ni har lagt in och texten på registrerings sidan och villkoren här, och accepterar samtidigt villkoren här.</p><p class="center-text">Ni kan använda programmet GRATIS i 14 dagar.</p>'
        },
        {
          lang: 'en',
          slug: 'terms',
          title: 'Terms',
          content: '<p class=""><b>BY</b> clicking Invoice Now, you choose to register according to the information that you have typed in and the text on the registration page and the terms here, and you at the same time accept the terms here.</p><p class="center-text">You can use the program FOR FREE for 14 days.</p>'
        }
      ]
      
      await Term.bulkCreate(basicTerms, {
        ignoreDuplicates: true
      })
      console.log('Basic terms seeded successfully')
    }

    const lang = (req.query.lang || 'sv').toString().slice(0, 2)
    
    // Get terms from database
    const terms = await Term.findOne({ 
      where: { lang, slug: 'terms' },
      attributes: ['title', 'content']
    })
    
    if (!terms) {
      return res.status(404).json({ 
        error: 'Terms not found for language: ' + lang
      })
    }
    
    const result = {
      lang,
      title: terms.title,
      content: terms.content,
      sections: [{
        slug: 'terms',
        title: terms.title,
        content: terms.content
      }]
    }
    
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ 
      error: 'Database error: ' + error.message
    })
  } finally {
    // Close connection for serverless
    await sequelize.close()
  }
}
