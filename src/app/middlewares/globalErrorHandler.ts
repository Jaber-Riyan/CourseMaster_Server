import type { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import type { TErrorSources } from "../interfaces/error.type";
import httpStatus from "http-status-codes"
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log(err);
    }

    let errorsSources: TErrorSources[] = []
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR
    let message = `Something went wrong!!`

    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }

    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }

    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)

        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorsSources = simplifiedError.errorsSources!
    }

    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err)

        statusCode = simplifiedError.statusCode
        errorsSources = simplifiedError.errorsSources!
        message = simplifiedError.message
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorsSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}