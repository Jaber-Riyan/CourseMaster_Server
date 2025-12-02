import z from "zod";

export const createUserZodSchema = z.object({
    name: z
        .string()
        .refine(val => typeof val === "string", { message: "Name must be a string value" })
        .min(2, { message: "Name too short. Minimum characters 2 long" })
        .max(50, { message: "Name too long. Maximum 50 characters" }),
    email: z
        .string()
        .email({ message: "Invalid email format, try with correct one" }),
    password: z
        .string()
        .refine(val => typeof val === "string", { message: "Password must be a string value" })
        .trim(),
})

export const updateUserZodSchema = z.object({
    name: z
        .string()
        .refine(val => typeof val === "string", { message: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
})