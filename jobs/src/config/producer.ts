import { Kafka, Producer, Admin } from "kafkajs"
import dotenv from "dotenv"
dotenv.config()
let producer: Producer;

let admin: Admin
export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: "auth-service",
            brokers: [process.env.KAFKA_BROKER || "kafka:9092"]
        })
        admin = kafka.admin()
        await admin.connect()

        const topics = await admin.listTopics();
        if (!topics.includes("send-email")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-email",
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ]
            })

            console.log("✅ topic 'send-mail' created")


        }
        await admin.disconnect()

        producer = kafka.producer()
        await producer.connect();

        console.log("✅ connected to kafka producer")
    } catch (err: any) {
        console.log("failed to connect to kafka")
    }
};

export const publishToTopic = async (topic: string, message: any) => {
    if (!producer) {
        console.log("kafka producer is not initailzed");
        return;
    }

    try {
        await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(message)
                },
            ]
        })
    } catch (err: any) {
        console.log("failed to send message", err)
    }
}

export const disconneckafka = async () => {
    if (producer) {
        producer.disconnect()
    }
}