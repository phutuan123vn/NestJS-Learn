import { Request } from "express";

export type Request = Request & {
    authType: string | undefined;
}