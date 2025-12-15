import { Kafka, logLevel } from "kafkajs";
import { oauthBearerTokenProvider } from "./auth/authProvider";
import { getGlueAssumeRole } from "./auth/assumeRoleProvider";

// ---------------------------
// ✅ ECS Consumer Logic
// ---------------------------
export async function ecsConsumerApp({
  bootstrapServers,
  topic,
  optionalConfigs = {},
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
      eachMessage: async ({ topic: messageTopic, partition, message }) => {
        const offset = message.offset;
        const timestamp = message.timestamp;
        const headers = message.headers || {};
        
        // Extract message value safely
        let eventValue = null;
        try {
          eventValue = message.value ? message.value.toString() : null;
        } catch (parseError) {
          logger.error(`❌ Failed to parse message value at offset ${offset}: ${parseError.message}`);
          return;
        }

        // Log message metadata
        logger.info(`📥 Message received - Topic: ${messageTopic} | Partition: ${partition} | Offset: ${offset} | Timestamp: ${timestamp}`);
        
        if (Object.keys(headers).length > 0) {
          logger.info(`📋 Headers: ${JSON.stringify(headers)}`);
        }

        // Process the message
        if (!eventValue) {
          logger.warn(`⚠️ Empty message received at offset ${offset}, skipping...`);
          return;
        }

        logger.info(`📨 Message payload: ${eventValue}`);

        try {
          await processEvent(eventValue);
          logger.info(`✅ Successfully processed message at offset ${offset}`);
        } catch (err) {
          logger.error(`❌ Error processing message at offset ${offset}: ${err.message || err}`);
          logger.error(`Stack trace: ${err.stack || 'N/A'}`);
          // Consider implementing dead letter queue or retry logic here
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
async function processEvent(event) {
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



import { validate } from "@ally/fulcrum-nodejs-producer-util/dist/producer/validator/validatePayload";
import { sendEventsSync, cleanupProducer } from "../producer/sendEventsSync";
import { EventPayload } from "../interfaces/eventPayload.interface";

export const lambdaHandlerBatch = async (events: any) => {
  console.log("Batch Lambda triggered...");

  try {
    // Handle single or multiple events
    const eventArray: EventPayload[] = Array.isArray(events) ? events : [events];
    console.log(`Received ${eventArray.length} events`);

    const validEvents: EventPayload[] = [];
    const validationErrors: any[] = [];

    for (const event of eventArray) {
      const errors = await validate.validateEvent(event);
      if (errors.length > 0) {
        validationErrors.push({ key: event.metadata?.key, errors });
      } else {
        validEvents.push(event);
      }
    }

    if (validationErrors.length > 0) {
      console.error("Validation errors found:", validationErrors);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Validation failed", validationErrors }),
      };
    }

    const recordMetadata = await sendEventsSync(validEvents);
    const metadataDetails = recordMetadata?.[0] || {};

    console.log("Batch published successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "Batch sent successfully",
        totalEvents: validEvents.length,
        metadata: {
          topicName: metadataDetails.topicName || validEvents[0].metadata.topic,
          partition: metadataDetails.partition,
          offset: metadataDetails.baseOffset,
        },
      }),
    };
  } catch (error) {
    console.error("Error in batch handler:", error);
    await cleanupProducer();

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error while sending batch events",
        error: error.message,
      }),
    };
  }
};