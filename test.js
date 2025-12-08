import { Kafka } from "kafkajs";
import AWS from "aws-sdk";
import LRU from "lru-cache";

// Logger configuration
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

// MSK Token Provider (assumed custom module)
import { getMskTokenProvider } from "./mskTokenProvider.js";

async function ecsConsumerApp({ registryName, roleArn, bootstrapServers, topic, optionalConfigs = {} }) {
  logger.info("ECS Task triggered successfully inside consumer");

  const schemaCache = new LRU({ max: 20 });
  const session = new AWS.STS();
  const glue = new AWS.Glue();

  try {
    // Assume Role
    logger.info("Assuming role for Glue client...");
    const assumedRole = await session
      .assumeRole({
        RoleArn: roleArn,
        RoleSessionName: "GlueSession",
      })
      .promise();

    AWS.config.update({
      accessKeyId: assumedRole.Credentials.AccessKeyId,
      secretAccessKey: assumedRole.Credentials.SecretAccessKey,
      sessionToken: assumedRole.Credentials.SessionToken,
    });

    logger.info("Glue client session established successfully");

    // Kafka Client setup
    const kafka = new Kafka({
      clientId: "msk-consumer-client",
      brokers: bootstrapServers.split(","),
      ssl: true,
      sasl: getMskTokenProvider(roleArn),
      ...optionalConfigs,
    });

    const consumer = kafka.consumer({ groupId: process.env.MSK_CONSUMER_GROUP_ID });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    logger.info(`Subscribed to topic: ${topic}`);

    // Poll messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const eventData = message.value.toString();
        logger.info(`Received event from ${topic} partition ${partition}`);
        logger.info(`Recently received event: ${eventData}`);

        // Compliance logic simulation
        logger.info("Checking compliance status recently...");
        await traverseEventMsg(eventData);
        logger.info("Completed the compliance check recently.");
      },
    });
  } catch (error) {
    logger.error(`An unexpected error occurred: ${error.stack || error}`);
  } finally {
    logger.info("Shutting down consumer...");
  }
}

async function traverseEventMsg(event) {
  // Placeholder for compliance or transformation logic
  logger.info(`Processing event payload: ${event}`);
}

// --- Entry Point ---
if (process.argv[1] === new URL(import.meta.url).pathname) {
  logger.info("Consumer started recently...");
  logger.info("ECS Task triggered successfully outside consumer");

  const registryName = process.env.GLUE_REGISTRY_NAME;
  const roleArn = process.env.EBEH_CONSUMER_ROLE_ARN;
  const bootstrapServers = process.env.MSK_CLUSTER_BROKERS;
  const topic = "customers-communication-dev";

  logger.info(`Glue Registry: ${registryName}`);
  logger.info(`Role ARN: ${roleArn}`);
  logger.info(`MSK Brokers: ${bootstrapServers}`);

  ecsConsumerApp({ registryName, roleArn, bootstrapServers, topic });
}