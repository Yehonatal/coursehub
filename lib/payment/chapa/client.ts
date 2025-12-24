import axios from "axios";
import { error } from "@/lib/logger";
import crypto from "crypto";

if (!process.env.CHAPA_SECRET_KEY) {
    throw new Error("CHAPA_SECRET_KEY is not set in environment variables");
}

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_API_URL = "https://api.chapa.co/v1";

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
    const prefix = opts?.prefix || "CH";
    return `${prefix}-${crypto.randomUUID()}`;
}

export async function initializeTransaction(options: InitializeOptions) {
    try {
        // Ensure amount is a string with 2 decimal places
        const formattedOptions = {
            ...options,
            amount: Number(options.amount).toFixed(2),
        };

        const response = await axios.post(
            `${CHAPA_API_URL}/transaction/initialize`,
            formattedOptions,
            {
                headers: {
                    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err: any) {
        // Log detailed error for debugging
        const errorData = err.response?.data;
        error("Chapa initialization failed:", {
            message: err.message,
            status: err.response?.status,
            data: errorData,
            options: { ...options, tx_ref: options.tx_ref },
        });
        throw err;
    }
}

export async function verifyTransaction(tx_ref: string) {
    try {
        const response = await axios.get(
            `${CHAPA_API_URL}/transaction/verify/${tx_ref}`,
            {
                headers: {
                    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                },
            }
        );
        return response.data;
    } catch (err: any) {
        error("Chapa verification failed:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            tx_ref,
        });
        throw err;
    }
}
