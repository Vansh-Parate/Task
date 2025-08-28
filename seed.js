import 'dotenv/config'
import { Sequelize, DataTypes } from 'sequelize'
import { seedTerms } from './server/seeders/terms.js'
import process from 'process'

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/terms'

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

async function runSeed() {
  try {
    console.log('🌱 Starting database seeding...')
    
    await sequelize.authenticate()
    console.log('✅ Database connection established')
    
    await Term.sync({ force: false })
    console.log('✅ Database model synced')
    
    await Term.destroy({ where: {} })
    console.log('✅ Cleared existing terms data')
    
    await seedTerms(Term)
    console.log('✅ Seeding completed successfully!')
    
    const count = await Term.count()
    console.log(`📊 Total terms records: ${count}`)
    
    const swedishTerms = await Term.findOne({ where: { lang: 'sv' } })
    const englishTerms = await Term.findOne({ where: { lang: 'en' } })
    
    if (swedishTerms) {
      console.log('🇸🇪 Swedish terms seeded successfully')
    }
    if (englishTerms) {
      console.log('🇬🇧 English terms seeded successfully')
    }
    
    console.log('🎉 All done! You can now restart your server to see the changes.')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

runSeed()
