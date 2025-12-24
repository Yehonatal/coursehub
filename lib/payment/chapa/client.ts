import { Chapa } from "chapa-nodejs";
import { error } from "@/lib/logger";

if (!process.env.CHAPA_SECRET_KEY) {
    throw new Error("CHAPA_SECRET_KEY is not set in environment variables");
}

export const chapa = new Chapa({
    secretKey: process.env.CHAPA_SECRET_KEY,
});

export interface InitializeOptions {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    currency: string;
    amount: string;
    tx_ref: string;
    callback_url?: string;
    return_url?: string;
    customization?: {
        title?: string;
        description?: string;
        logo?: string;
    };
}

export async function genTxRef(opts?: { prefix?: string; size?: number }) {
    return chapa.genTxRef(opts);
}

export async function initializeTransaction(options: InitializeOptions) {
    try {
        const response = await chapa.initialize(options);
        return response;
    } catch (err: any) {
        // Log detailed error for debugging
        error("Chapa initialization failed:", {
            message: err.message,
            status: err.status,
            response: err.response?.data || err.response,
            errors: err.errors,
            options: { ...options, tx_ref: options.tx_ref }, // Log options but keep tx_ref visible
        });
        throw err;
    }
}

export async function verifyTransaction(tx_ref: string) {
    try {
        const response = await chapa.verify({ tx_ref });
        return response;
    } catch (err) {
        error("Chapa verification failed:", err);
        throw err;
    }
}
