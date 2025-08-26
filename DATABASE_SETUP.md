# Database Setup Guide

This guide will help you set up the PostgreSQL database for your 123 Fakturera Terms application. The application now uses Sequelize ORM for all database operations, making setup much simpler.

## Prerequisites

1. **PostgreSQL installed** on your system
2. **Node.js and npm** installed
3. **The project dependencies** installed (`npm install`)

## Step 1: Create the Database

### Option A: Using psql command line
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE terms;

# Exit psql
\q
```

### Option B: Using pgAdmin or other GUI tool
1. Open your PostgreSQL GUI tool
2. Create a new database named `terms`
3. Make sure you have the connection details ready

## Step 2: Set Up Database Connection

### Environment Variables (Optional)
Create a `.env` file in your project root:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/terms
PORT=5174
```

### Default Connection
If you don't set environment variables, the app will use:
- **Host**: localhost
- **Port**: 5432
- **Database**: terms
- **Username**: postgres
- **Password**: postgres

## Step 3: Start the Application

That's it! The application will automatically:

1. **Connect to the database**
2. **Create the table** if it doesn't exist
3. **Seed the data** if the table is empty
4. **Start the server**

```bash
# Start both frontend and backend
npm run dev
```

The application will:
- Frontend: http://localhost:5173
- Backend: http://localhost:5174

## Step 4: Verify the Setup

### Check the console output
When you start the application, you should see:
```
✅ Database connection established successfully.
✅ Database table synced successfully.
📝 No terms data found. Seeding database...
✅ Database seeded successfully with terms data.
```

### Test the API endpoints
```bash
# Health check
curl http://localhost:5174/api/health

# Swedish terms
curl http://localhost:5174/api/terms?lang=sv

# English terms
curl http://localhost:5174/api/terms?lang=en
```

## Database Schema

The application automatically creates a `terms` table with this structure:

```sql
CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    lang VARCHAR(2) NOT NULL,           -- Language code (sv, en)
    slug VARCHAR(255) NOT NULL,         -- Content identifier
    title VARCHAR(255) NOT NULL,        -- Page title
    content TEXT NOT NULL,              -- Full terms content (HTML)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lang, slug)
);
```

## How It Works

### Sequelize ORM Benefits
- **No raw SQL needed**: All database operations use Sequelize models
- **Automatic table creation**: `Term.sync()` creates the table if it doesn't exist
- **Automatic seeding**: Data is inserted if the table is empty
- **Type safety**: JavaScript objects instead of SQL strings
- **Migrations**: Easy to modify schema in the future

### Data Seeding
The application includes seed data for both Swedish and English terms:
- **Swedish**: Complete terms with HTML formatting
- **English**: Translated terms content
- **Automatic**: Runs only if no data exists

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Make sure PostgreSQL is running
   - Check if the port 5432 is correct
   - Verify username/password

2. **Database doesn't exist**
   - Create the database first: `CREATE DATABASE terms;`

3. **Permission denied**
   - Make sure your user has access to the database
   - Check if you're using the correct username

4. **Seeding fails**
   - Check the console output for specific error messages
   - Ensure the database connection is working

### Useful Commands

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Connect to database to verify data
psql -U postgres -d terms

# List all tables
\dt

# View table structure
\d terms

# View sample data
SELECT * FROM terms LIMIT 1;
```

## Updating Content

### Option 1: Edit the seed data in code
1. **Modify the seed data** in `server/index.js`
2. **Restart the application** - it will update existing records

### Option 2: Use Sequelize directly
```javascript
// In your application code
await Term.update(
  { content: 'New content here' },
  { where: { lang: 'sv', slug: 'terms' } }
)
```

### Option 3: Database management tool
Use pgAdmin or any PostgreSQL client to directly edit the content.

## Production Deployment

For production, make sure to:

1. **Use environment variables** for database connection
2. **Set up proper database credentials**
3. **Enable SSL** for database connections
4. **Set up database backups**
5. **Use connection pooling** for better performance

Example production DATABASE_URL:
```
DATABASE_URL=postgres://username:password@host:5432/terms?ssl=true
```

## Advantages of This Approach

✅ **No manual SQL scripts needed**
✅ **Automatic database setup**
✅ **Type-safe database operations**
✅ **Easy to maintain and modify**
✅ **Consistent with modern Node.js practices**
✅ **Built-in error handling and validation**
