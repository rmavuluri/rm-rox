import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { GlueClient, GetSchemaVersionCommand } from "@aws-sdk/client-glue";

const REGION = process.env.AWS_REGION || "us-east-1";
const SCHEMA_BUCKET = process.env.SCHEMA_CACHE_BUCKET;
const GLUE_REGISTRY = process.env.GLUE_REGISTRY_NAME;

const s3Client = new S3Client({ region: REGION });
const glueClient = new GlueClient({ region: REGION });

// Local (per-Lambda runtime) cache
const schemaCache = new Map();

/**
 * Fetch schema from AWS Glue
 */
async function getSchemaFromGlue(topicName, versionNumber, glueCreds) {
  try {
    console.log(`[Glue] Fetching schema for ${topicName} v${versionNumber}`);
    const params = {
      SchemaId: { RegistryName: GLUE_REGISTRY, SchemaName: topicName },
      SchemaVersionNumber: { LatestVersion: false, VersionNumber: versionNumber }
    };
    const command = new GetSchemaVersionCommand(params);
    const response = await glueClient.send(command);
    return JSON.parse(response.SchemaDefinition);
  } catch (err) {
    console.error(`[Glue] Failed to fetch schema for ${topicName}:`, err);
    throw err;
  }
}

/**
 * Get schema from S3 cache
 */
async function getSchemaFromS3(cacheKey) {
  try {
    const command = new GetObjectCommand({
      Bucket: SCHEMA_BUCKET,
      Key: `${cacheKey}.json`
    });
    const response = await s3Client.send(command);
    const body = await response.Body.transformToString();
    return JSON.parse(body);
  } catch (err) {
    if (err.name !== "NoSuchKey") {
      console.error(`[S3] Error getting schema ${cacheKey}:`, err);
    }
    return null;
  }
}

/**
 * Store schema in S3 cache
 */
async function putSchemaToS3(cacheKey, schema) {
  try {
    const command = new PutObjectCommand({
      Bucket: SCHEMA_BUCKET,
      Key: `${cacheKey}.json`,
      Body: JSON.stringify(schema),
      ContentType: "application/json"
    });
    await s3Client.send(command);
    console.log(`[S3] Cached schema ${cacheKey} to S3`);
  } catch (err) {
    console.error(`[S3] Failed to cache schema ${cacheKey}:`, err);
  }
}

/**
 * Initialize schema cache (multi-layer)
 */
export async function initializeCache(topicName, versionNumber, glueCreds) {
  const cacheKey = `${topicName}_${versionNumber}`;

  // 1️⃣ In-memory check
  if (schemaCache.has(cacheKey)) {
    console.log(`[Cache] Using in-memory schema for ${cacheKey}`);
    return schemaCache.get(cacheKey);
  }

  // 2️⃣ S3 cache check
  const s3Schema = await getSchemaFromS3(cacheKey);
  if (s3Schema) {
    console.log(`[Cache] Loaded schema from S3 for ${cacheKey}`);
    schemaCache.set(cacheKey, s3Schema);
    return s3Schema;
  }

  // 3️⃣ Fetch from Glue if not in cache
  console.log(`[Cache] Fetching schema from Glue for ${cacheKey}`);
  const glueSchema = await getSchemaFromGlue(topicName, versionNumber, glueCreds);
  schemaCache.set(cacheKey, glueSchema);

  // 4️⃣ Save to S3 for next invocation
  await putSchemaToS3(cacheKey, glueSchema);

  return glueSchema;
}

/**
 * Public function for external callers
 */
export async function getCachedSchemaDetails(topicName, versionNumber, glueCreds) {
  return await initializeCache(topicName, versionNumber, glueCreds);
}