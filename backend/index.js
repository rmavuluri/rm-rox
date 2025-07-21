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
    const result = await pool.query('SELECT * FROM onboardings ORDER BY created_at DESC');
    res.json(result.rows);
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

app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
}); 