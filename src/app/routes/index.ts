import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CourseRoutes } from "../modules/course/course.route";

export const router = Router()

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/courses",
        route: CourseRoutes
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
});