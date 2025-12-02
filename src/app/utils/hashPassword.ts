import bcrypt from "bcryptjs"
import { envVars } from "../config/env"

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND))
}