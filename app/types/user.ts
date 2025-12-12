export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "student" | "educator";
    university?: string | null;
    headline?: string | null;
    school_id_url?: string | null;
    is_verified: boolean;
    subscription_status?: string | null;
    created_at: Date;
}

export interface Session {
    session_id: string;
    user_id: string;
    expires_at: Date;
}
