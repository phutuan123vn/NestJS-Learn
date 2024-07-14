import { User } from "@prisma/client";
import { Request } from "express";

export type Request = Request & {
    authType: string | undefined;
    user: User | undefined;
}