import { Kafka, Producer, Admin } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

let producer: Producer;
let admin: Admin;

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";

export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: "auth-service",
            brokers: [KAFKA_BROKER],
            retry: {
                retries: 10
            }
        });

        // --- Admin (topic creation) ---
        admin = kafka.admin();
        await admin.connect();

        const topics = await admin.listTopics();
        if (!topics.includes("send-email")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-email",
                        numPartitions: 1,
                        replicationFactor: 1,
                    },
                ],
            });

            console.log("✅ topic 'send-email' created");
        }

        await admin.disconnect();

        // --- Producer ---
        producer = kafka.producer();
        await producer.connect();

        console.log("✅ connected to kafka producer");
    } catch (err) {
        console.error("❌ failed to connect to kafka", err);
    }
};

export const publishToTopic = async (topic: string, message: any) => {
    if (!producer) {
        console.warn("⚠️ kafka producer is not initialized");
        return;
    }

    try {
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });
    } catch (err) {
        console.error("❌ failed to send message", err);
    }
};

export const disconnectKafka = async () => {
    if (producer) {
        await producer.disconnect();
    }
};
