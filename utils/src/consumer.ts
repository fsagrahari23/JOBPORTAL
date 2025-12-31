import { Kafka } from "kafkajs";
import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()
export const startSendMailConsume = async () => {
    try {
        const kafka = new Kafka({
            clientId: "mailservice",
            brokers: [process.env.Kafka_broker || "localhost:9092"]
        });

        const consumer = kafka.consumer({ groupId: "mail-service-group" })
        await consumer.connect()
        const topicName = "send-email";

        await consumer.subscribe({ topic: topicName, fromBeginning: false })

        console.log("✅ mail service cosumer started, listening sending mail")

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { to, subject, html } = JSON.parse(message.value?.toString() || "{}");
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.USER_EMAIL,
                            pass: process.env.USER_PASS
                        }
                    })

                    await transporter.sendMail({
                        from: process.env.USER_EMAIL,
                        to,
                        subject,
                        html
                    });

                    console.log(`Mail has been sent to ${to}`);

                } catch (err: any) {
                    console.log("Failed to send mail", err)
                }
            }
        })

    } catch (err: any) {
        console.log("Failed to start kafka", err)
    }
}