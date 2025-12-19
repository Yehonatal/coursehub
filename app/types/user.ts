export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "student" | "educator";
    university?: string | null;
    university_id?: number | null;
    headline?: string | null;
    school_id_url?: string | null;
    profile_image_url?: string | null;
    banner_url?: string | null;
    is_verified: boolean;
    subscription_status?: string | null;
    subscription_expiry?: Date | null;
    created_at: Date;
}

export interface Session {
    session_id: string;
    user_id: string;
    expires_at: Date;
}
