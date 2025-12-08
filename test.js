import { Kafka, logLevel } from "kafkajs";
import { oauthBearerTokenProvider } from "./auth/authProvider";
import { getGlueAssumeRole } from "./auth/assumeRoleProvider";
import winston from "winston";

// ---------------------------
// ✅ Logger configuration
// ---------------------------
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

// ---------------------------
// ✅ ECS Consumer Logic
// ---------------------------
export async function ecsConsumerApp({
  registryName,
  roleArn,
  bootstrapServers,
  topic,
  optionalConfigs = {},
}: {
  registryName: string;
  roleArn: string;
  bootstrapServers: string;
  topic: string;
  optionalConfigs?: Record<string, any>;
}) {
  logger.info(`🚀 Starting ECS Consumer for topic: ${topic}`);

  try {
    // Assume role to get temporary credentials for Glue or Schema Registry
    logger.info("Assuming IAM Role...");
    const credentials = await getGlueAssumeRole();

    // Create Kafka configuration for MSK IAM auth
    const kafka = new Kafka({
      clientId: "ecs-msk-consumer",
      brokers: bootstrapServers.split(","),
      ssl: true,
      sasl: {
        mechanism: "oauthbearer",
        oauthBearerProvider: async () => {
          const token = await oauthBearerTokenProvider();
          return {
            value: token,
            extensions: {},
          };
        },
      },
      logLevel: logLevel.INFO,
      connectionTimeout: 10000,
      requestTimeout: 30000,
      ...optionalConfigs,
    });

    // Consumer group and topic subscription
    const consumerGroupId = process.env.MSK_CONSUMER_GROUP_ID || "ecs-msk-consumer-group";
    const consumer = kafka.consumer({ groupId: consumerGroupId });

    await consumer.connect();
    logger.info("✅ Connected to MSK Cluster");

    await consumer.subscribe({ topic, fromBeginning: false });
    logger.info(`📩 Subscribed to topic: ${topic}`);

    // ---------------------------
    // ✅ Consume Messages
    // ---------------------------
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const eventValue = message.value?.toString();
        const offset = message.offset;
        const timestamp = message.timestamp;

        logger.info(`📥 [${topic}] Partition: ${partition} | Offset: ${offset} | Timestamp: ${timestamp}`);
        logger.info(`Message Received: ${eventValue}`);

        // Placeholder: process the message
        try {
          await processEvent(eventValue);
        } catch (err) {
          logger.error(`❌ Error processing message: ${err}`);
        }
      },
    });

    logger.info("🟢 Kafka consumer is actively polling messages...");
  } catch (error) {
    logger.error(`🚨 Error initializing consumer: ${error.stack || error}`);
  } finally {
    logger.info("🛑 Shutting down consumer gracefully...");
  }
}

// ---------------------------
// ✅ Business Logic Processor
// ---------------------------
async function processEvent(event: string | null) {
  if (!event) return;
  logger.info(`🔎 Processing event payload: ${event}`);
  // Add compliance or transformation logic here
}

// ---------------------------
// ✅ Entry Point for ECS
// ---------------------------
if (require.main === module) {
  const registryName = process.env.GLUE_REGISTRY_NAME || "default-registry";
  const roleArn = process.env.EBEH_CONSUMER_ROLE_ARN || "";
  const bootstrapServers = process.env.MSK_CLUSTER_BROKERS || "";
  const topic = process.env.MSK_TOPIC_NAME || "customers-communication-dev";

  logger.info("🔧 Environment Configuration:");
  logger.info(`GLUE_REGISTRY_NAME: ${registryName}`);
  logger.info(`ROLE_ARN: ${roleArn}`);
  logger.info(`MSK_BROKERS: ${bootstrapServers}`);
  logger.info(`TOPIC: ${topic}`);

  ecsConsumerApp({ registryName, roleArn, bootstrapServers, topic });
}