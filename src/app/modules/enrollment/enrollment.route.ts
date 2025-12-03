import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createEnrollmentSchema } from "./enrollment.validation";
import { EnrollmentControllers } from "./enrollment.controller";

const router = Router()

router.post("/enroll", validateRequest(createEnrollmentSchema), checkAuth(...Object.values(Role)),EnrollmentControllers.makeEnroll)

export const EnrollmentRoutes = router