import Fastify from 'fastify'
import cors from '@fastify/cors'
import { Sequelize, DataTypes } from 'sequelize'
import process from 'process'

const PORT = process.env.PORT || 5174
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/terms'

const fastify = Fastify({ logger: true })
await fastify.register(cors, { origin: true })

// Initialize Sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
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

async function ensureDb() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
    
    // Sync the model with the database (creates table if it doesn't exist)
    await Term.sync({ force: false }) // force: false means don't drop existing tables
    console.log('✅ Database table synced successfully.')
    
    // Check if we have data, if not, seed it
    const count = await Term.count()
    if (count === 0) {
      console.log('📝 No terms data found. Seeding database...')
      // Import and run the seeder
      const { seedTerms } = await import('./seeders/terms.js')
      await seedTerms(Term)
      console.log('✅ Database seeded successfully with terms data.')
    } else {
      console.log(`✅ Found ${count} terms records in database`)
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    throw error
  }
}

fastify.get('/api/health', async () => ({ ok: true }))

fastify.get('/api/terms', async (request, reply) => {
  const lang = (request.query.lang || 'sv').toString().slice(0, 2)
  
  try {
    const terms = await Term.findOne({ 
      where: { lang, slug: 'terms' },
      attributes: ['title', 'content']
    })
    
    if (!terms) {
      return reply.code(404).send({ 
        error: 'Terms not found for language: ' + lang,
        message: 'Please ensure the database is populated with terms data'
      })
    }
    
    return {
      lang,
      title: terms.title,
      content: terms.content,
      sections: [{
        slug: 'terms',
        title: terms.title,
        content: terms.content
      }]
    }
  } catch (error) {
    console.error('Database error:', error)
    return reply.code(500).send({ 
      error: 'Database error',
      message: 'Failed to fetch terms from database'
    })
  }
})

// startup
ensureDb()
  .then(() => fastify.listen({ port: PORT, host: '0.0.0.0' }))
  .catch((err) => {
    fastify.log.error(err)
    process.exit(1)
  })


