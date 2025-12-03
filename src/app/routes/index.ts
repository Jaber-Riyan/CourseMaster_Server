import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CourseRoutes } from "../modules/course/course.route";
import { EnrollmentRoutes } from "../modules/enrollment/enrollment.route";

export const router = Router()

export interface IModuleRoutes {
    path: string
    route: Router
}

const moduleRoutes: IModuleRoutes[] = [
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
    {
        path: "/enrollment",
        route: EnrollmentRoutes
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
});