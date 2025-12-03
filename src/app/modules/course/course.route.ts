import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { addCourseBatch, addCourseModule, createCourseSchema, updateCourseSchema } from "./course.validation";
import { CourseControllers } from "./course.controller";

const router = Router()

router.post("/create", validateRequest(createCourseSchema), checkAuth(Role.ADMIN), CourseControllers.createCourse)

router.patch("/update/:courseId", validateRequest(updateCourseSchema), checkAuth(Role.ADMIN), CourseControllers.updateCourse)

router.patch("/add-module/:courseId", validateRequest(addCourseModule), checkAuth(Role.ADMIN), CourseControllers.addModule)

router.patch("/add-batch/:courseId", validateRequest(addCourseBatch), checkAuth(Role.ADMIN), CourseControllers.addBatch)

export const CourseRoutes = router