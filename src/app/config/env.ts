import dotenv from "dotenv"

dotenv.config()

interface IEnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",

    BCRYPT_SALT_ROUND: string,

    JWT_ACCESS_SECRET: string,
    JWT_ACCESS_EXPIRES: string,

    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,

    EXPRESS_SESSION_SECRET: string

    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,

    FRONTEND_URL: string

    EMAIL_SENDER: {
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_PORT: string;
        SMTP_HOST: string;
        SMTP_FROM: string;
    };
}

const loadEnvVariables = (): IEnvConfig => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",

        "BCRYPT_SALT_ROUND",

        "JWT_ACCESS_EXPIRES",
        "JWT_ACCESS_SECRET",

        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",

        "EXPRESS_SESSION_SECRET",

        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",

        "FRONTEND_URL",

        "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_FROM",
    ];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT!,
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",

        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND!,

        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,

        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES!,

        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET!,

        ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,

        FRONTEND_URL: process.env.FRONTEND_URL!,

        // EMAIL SENDER
        EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
    }
}

export const envVars = loadEnvVariables()
