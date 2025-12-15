export const isDev = process.env.NODE_ENV !== "production";

export function debug(...args: any[]) {
    if (isDev) console.debug(...args);
}
export function info(...args: any[]) {
    if (isDev) console.info(...args);
}
export function warn(...args: any[]) {
    if (isDev) console.warn(...args);
}
export function error(...args: any[]) {
    // Always log errors so they are available in production logs
    console.error(...args);
}
