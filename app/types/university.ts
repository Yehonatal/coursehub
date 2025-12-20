export interface University {
    university_id: number;
    name: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
    is_official?: boolean;
}
