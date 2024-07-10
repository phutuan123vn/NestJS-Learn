import { Request } from "express";

export type TRequest = Request & {
    authType: string | undefined;
}