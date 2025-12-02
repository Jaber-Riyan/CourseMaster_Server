import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { hashPassword } from "./hashPassword";
import { Role, type IUser } from "../modules/user/user.interface";

export const seedAdmin = async () => {
    try {
        const isAdminExist = await User.findOne({ email: envVars.ADMIN_EMAIL })

        if (isAdminExist) {
            console.log("Admin Already Exists!");
            return;
        }

        console.log("Trying to create Super Admin...");

        const hashedPassword = await hashPassword(envVars.ADMIN_PASSWORD)

        const payload: IUser = {
            name: "Admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
        }

        const superAdmin = await User.create(payload)
        console.log("Admin Created Successfully! \n");
        // console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
}