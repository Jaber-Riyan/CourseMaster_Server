import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createEnrollmentSchema } from "./enrollment.validation";
import { EnrollmentControllers } from "./enrollment.controller";

const router = Router()

router.post("/enroll", validateRequest(createEnrollmentSchema), checkAuth(...Object.values(Role)), EnrollmentControllers.makeEnroll)

router.get("/me", checkAuth(...Object.values(Role)), EnrollmentControllers.enrollMe)

router.patch("/:enrollmentId/progress", checkAuth(...Object.values(Role)), EnrollmentControllers.enrollProgress)

router.patch("/mark/progress/:courseId/:batch/:moduleId/:lessonId/:enrollmentId", checkAuth(...Object.values(Role)), EnrollmentControllers.markProgress)

router.get("/admin/enrollments", checkAuth(Role.ADMIN), EnrollmentControllers.getEnrollments)

router.post("/submit/assignment/:enrollmentId/:moduleId", checkAuth(...Object.values(Role)), EnrollmentControllers.submitAssignment)

export const EnrollmentRoutes = router