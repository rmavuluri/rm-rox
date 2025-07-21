# Backend API for Onboarding

## 1. Database Setup (Postgres)

Create the following tables:

```sql
CREATE TABLE onboardings (
  id SERIAL PRIMARY KEY,
  lob_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  onboard_type TEXT NOT NULL,
  sub_domain TEXT NOT NULL,
  volume_of_events TEXT,
  schema_name TEXT,
  topic_name TEXT,
  tentative_prod_date DATE,
  can_perform_pt BOOLEAN,
  notification_email TEXT,
  contact_emails TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE onboarding_env_arns (
  id SERIAL PRIMARY KEY,
  onboarding_id INTEGER REFERENCES onboardings(id) ON DELETE CASCADE,
  env TEXT NOT NULL,
  arn TEXT NOT NULL
);
```

## 2. Environment Variables

Create a `.env` file in the backend folder:

```
DATABASE_URL=postgresql://username:password@localhost:5432/yourdbname
PORT=4000
```

## 3. Running the Backend

```
cd backend
npm install
node index.js
```

The API will run on http://localhost:4000

## 4. API Endpoints

- `GET    /api/onboardings` - List all onboardings
- `GET    /api/onboardings/:id` - Get one onboarding (with env_arns)
- `POST   /api/onboardings` - Create onboarding (with env_arns)
- `PUT    /api/onboardings/:id` - Update onboarding (with env_arns)
- `DELETE /api/onboardings/:id` - Delete onboarding and env_arns 