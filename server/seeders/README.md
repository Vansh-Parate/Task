# Database Seeders

This directory contains database seeders for the 123 Fakturera application. Seeders are used to populate the database with initial data.

## Structure

```
seeders/
├── README.md          # This file
└── terms.js          # Terms and conditions seeder
```

## Usage

### Automatic Seeding
The application automatically runs seeders when it starts if the database is empty. This is handled in `server/index.js`.

### Manual Seeding
You can also run seeders manually:

```javascript
import { seedTerms } from './seeders/terms.js'
import { Term } from '../models/Term.js' // Import your model

// Run the seeder
await seedTerms(Term)
```

## Adding New Seeders

1. **Create a new seeder file** (e.g., `users.js`, `products.js`)
2. **Export a function** that takes the model as a parameter
3. **Use `bulkCreate`** with `ignoreDuplicates: true` to avoid conflicts
4. **Import and call** the seeder in your main application file

### Example Seeder Structure

```javascript
// seeders/example.js
export const seedExample = async (ExampleModel) => {
  const seedData = [
    {
      field1: 'value1',
      field2: 'value2'
    }
  ]

  try {
    await ExampleModel.bulkCreate(seedData, {
      ignoreDuplicates: true
    })
    console.log(`✅ Seeded ${seedData.length} example records`)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    throw error
  }
}
```

## Best Practices

- **Use `ignoreDuplicates: true`** to prevent errors when re-running seeders
- **Include error handling** in your seeder functions
- **Log success/failure** for debugging
- **Keep seed data separate** from business logic
- **Use meaningful names** for seeder functions

## Current Seeders

### Terms Seeder (`terms.js`)
- **Purpose**: Populates terms and conditions content
- **Languages**: Swedish (sv) and English (en)
- **Content**: Full terms with HTML formatting
- **Usage**: Automatically runs on app startup if database is empty
