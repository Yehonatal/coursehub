import { format, formatDistanceToNow } from "date-fns";

/**
 * Formats a date to a human-readable string in local time.
 * @param date The date to format (Date object, string, or number)
 * @param formatStr Optional format string (default: "MMM d, yyyy h:mm a")
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | string | number,
    formatStr: string = "MMM d, yyyy h:mm a"
): string {
    const d = new Date(date);
    return format(d, formatStr);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago").
 * @param date The date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
    const d = new Date(date);
    return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Formats a date to a concise local format.
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatLocalTime(date: Date | string | number): string {
    const d = new Date(date);
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
