-- Create onboardings table
CREATE TABLE IF NOT EXISTS onboardings (
  id SERIAL PRIMARY KEY,
  lob_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  onboard_type TEXT NOT NULL,
  sub_domain TEXT NOT NULL,
  volume_of_events TEXT,
  schema_name TEXT,
  topic_name TEXT,
  tentative_prod_date DATE,
  can_perform_pt BOOLEAN DEFAULT false,
  notification_email TEXT,
  contact_emails TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create onboarding_env_arns table
CREATE TABLE IF NOT EXISTS onboarding_env_arns (
  id SERIAL PRIMARY KEY,
  onboarding_id INTEGER REFERENCES onboardings(id) ON DELETE CASCADE,
  env TEXT NOT NULL,
  arn TEXT NOT NULL
);

-- Create schemas table
CREATE TABLE IF NOT EXISTS schemas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  environment TEXT NOT NULL,
  domain TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  namespace TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create schema_versions table
CREATE TABLE IF NOT EXISTS schema_versions (
  id SERIAL PRIMARY KEY,
  schema_id INTEGER REFERENCES schemas(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  schema_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
); 