require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- CRUD for Onboarding ---

// Get all onboardings
app.get('/api/onboardings', async (req, res) => {
  try {
    const onboardingsResult = await pool.query('SELECT * FROM onboardings ORDER BY created_at DESC');
    const onboardings = onboardingsResult.rows;
    // Fetch all env_arns in one query
    const envArnsResult = await pool.query('SELECT * FROM onboarding_env_arns');
    const envArnsByOnboarding = {};
    for (const row of envArnsResult.rows) {
      if (!envArnsByOnboarding[row.onboarding_id]) envArnsByOnboarding[row.onboarding_id] = [];
      envArnsByOnboarding[row.onboarding_id].push(row);
    }
    // Attach env_arns to each onboarding
    const onboardingsWithArns = onboardings.map(ob => ({
      ...ob,
      env_arns: envArnsByOnboarding[ob.id] || []
    }));
    res.json(onboardingsWithArns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one onboarding (with env_arns)
app.get('/api/onboardings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const onboarding = await pool.query('SELECT * FROM onboardings WHERE id = $1', [id]);
    const env_arns = await pool.query('SELECT * FROM onboarding_env_arns WHERE onboarding_id = $1', [id]);
    if (onboarding.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ...onboarding.rows[0], env_arns: env_arns.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create onboarding
app.post('/api/onboardings', async (req, res) => {
  try {
    console.log('POST /api/onboardings req.body:', JSON.stringify(req.body, null, 2));
    const {
      lobName, domain, onboardType, subDomain, volumeOfEvents, schemaName, topicName,
      tentativeProdDate, canPerformPT, notificationEmail, contactEmails, envARNs
    } = req.body;
    const result = await pool.query(
      `INSERT INTO onboardings (lob_name, domain, onboard_type, sub_domain, volume_of_events, schema_name, topic_name, tentative_prod_date, can_perform_pt, notification_email, contact_emails, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW()) RETURNING *`,
      [lobName, domain, onboardType, subDomain, volumeOfEvents, schemaName, topicName, tentativeProdDate, canPerformPT, notificationEmail, contactEmails]
    );
    const onboardingId = result.rows[0].id;
    // Insert env_arns
    if (Array.isArray(envARNs)) {
      for (const row of envARNs) {
        if (row.env && row.arn) {
          await pool.query(
            'INSERT INTO onboarding_env_arns (onboarding_id, env, arn) VALUES ($1, $2, $3)',
            [onboardingId, row.env, row.arn]
          );
        }
      }
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update onboarding
app.put('/api/onboardings/:id', async (req, res) => {
  try {
    console.log('PUT /api/onboardings/:id req.body:', JSON.stringify(req.body, null, 2));
    const { id } = req.params;
    const {
      lobName, domain, onboardType, subDomain, volumeOfEvents, schemaName, topicName,
      tentativeProdDate, canPerformPT, notificationEmail, contactEmails, envARNs
    } = req.body;
    const result = await pool.query(
      `UPDATE onboardings SET lob_name=$1, domain=$2, onboard_type=$3, sub_domain=$4, volume_of_events=$5, schema_name=$6, topic_name=$7, tentative_prod_date=$8, can_perform_pt=$9, notification_email=$10, contact_emails=$11, updated_at=NOW() WHERE id=$12 RETURNING *`,
      [lobName, domain, onboardType, subDomain, volumeOfEvents, schemaName, topicName, tentativeProdDate, canPerformPT, notificationEmail, contactEmails, id]
    );
    // Update env_arns: delete old, insert new
    await pool.query('DELETE FROM onboarding_env_arns WHERE onboarding_id = $1', [id]);
    if (Array.isArray(envARNs)) {
      for (const row of envARNs) {
        if (row.env && row.arn) {
          await pool.query(
            'INSERT INTO onboarding_env_arns (onboarding_id, env, arn) VALUES ($1, $2, $3)',
            [id, row.env, row.arn]
          );
        }
      }
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete onboarding
app.delete('/api/onboardings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM onboarding_env_arns WHERE onboarding_id = $1', [id]);
    await pool.query('DELETE FROM onboardings WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SCHEMA MANAGEMENT ---

// Create schema (optionally with first version)
app.post('/api/schemas', async (req, res) => {
  try {
    const { environment, domain, subdomain, namespace, version, schema_json } = req.body;
    if (!environment || !domain || !subdomain) {
      return res.status(400).json({ error: 'environment, domain, and subdomain are required' });
    }
    const name = `ebeh-ob-${environment}-${domain}-${subdomain}-schema`;
    // Insert schema
    const schemaResult = await pool.query(
      'INSERT INTO schemas (name, environment, domain, subdomain, namespace, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [name, environment, domain, subdomain, namespace || null]
    );
    const schema = schemaResult.rows[0];
    let versionRow = null;
    if (version && schema_json) {
      const versionResult = await pool.query(
        'INSERT INTO schema_versions (schema_id, version, schema_json, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [schema.id, version, schema_json]
      );
      versionRow = versionResult.rows[0];
    }
    res.status(201).json({ ...schema, version: versionRow });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new version to an existing schema
app.post('/api/schemas/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;
    const { version, schema_json } = req.body;
    const versionResult = await pool.query(
      'INSERT INTO schema_versions (schema_id, version, schema_json, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [id, version, schema_json]
    );
    res.status(201).json(versionResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all schemas (optionally with latest version)
app.get('/api/schemas', async (req, res) => {
  try {
    const schemasResult = await pool.query('SELECT * FROM schemas ORDER BY name ASC');
    res.json(schemasResult.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get schema details and all versions
app.get('/api/schemas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const schemaResult = await pool.query('SELECT * FROM schemas WHERE id = $1', [id]);
    if (schemaResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const versionsResult = await pool.query('SELECT * FROM schema_versions WHERE schema_id = $1 ORDER BY created_at DESC', [id]);
    res.json({ ...schemaResult.rows[0], versions: versionsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific version of a schema
app.get('/api/schemas/:id/versions/:version', async (req, res) => {
  try {
    const { id, version } = req.params;
    const versionResult = await pool.query('SELECT * FROM schema_versions WHERE schema_id = $1 AND version = $2', [id, version]);
    if (versionResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(versionResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
}); 