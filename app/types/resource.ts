export type Resource = {
    resource_id: string;
    uploader_id: string;
    course_code: string;
    semester: string;
    university: string | null;
    title: string;
    description: string | null;
    file_url: string;
    mime_type?: string | null;
    file_size?: number | null;
    resource_type?: string | null;
    upload_date: string;
};
