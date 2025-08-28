import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { Sequelize, DataTypes } from 'sequelize'
import process from 'process'

const PORT = process.env.PORT || 5174
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/terms'

const fastify = Fastify({ logger: false })
await fastify.register(cors, { origin: true })

// Database configuration
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
  pool: {
    max: 5,
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

// Terms model definition
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

// Cache for terms data
const termsCache = new Map()

async function ensureDb() {
  try {
    await sequelize.authenticate()
    await Term.sync({ force: false })
    
    const count = await Term.count()
    if (count === 0) {
      const { seedTerms } = await import('./seeders/terms.js')
      await seedTerms(Term)
    }
    
    // Pre-load terms into cache
    const allTerms = await Term.findAll({
      attributes: ['lang', 'title', 'content']
    })
    
    allTerms.forEach(term => {
      termsCache.set(term.lang, {
        lang: term.lang,
        title: term.title,
        content: term.content,
        sections: [{
          slug: 'terms',
          title: term.title,
          content: term.content
        }]
      })
    })
    
  } catch (error) {
    console.error('Database setup failed:', error.message)
    throw error
  }
}

fastify.get('/api/health', async () => ({ ok: true }))

// Terms API endpoint
fastify.get('/api/terms', async (request, reply) => {
  const lang = (request.query.lang || 'sv').toString().slice(0, 2)
  
  try {
    if (termsCache.has(lang)) {
      return termsCache.get(lang)
    }
    
    const terms = await Term.findOne({ 
      where: { lang, slug: 'terms' },
      attributes: ['title', 'content']
    })
    
    if (!terms) {
      return reply.code(404).send({ 
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
    
    termsCache.set(lang, result)
    
    return result
  } catch (error) {
    console.error('Database error:', error)
    return reply.code(500).send({ 
      error: 'Database error'
    })
  }
})

ensureDb()
  .then(() => fastify.listen({ port: PORT, host: '0.0.0.0' }))
  .catch((err) => {
    console.error('Server startup failed:', err)
    process.exit(1)
  })


