/**
 * Retries a function with exponential backoff.
 * @param fn The async function to retry.
 * @param retries Max number of retries (default: 3).
 * @param delay Initial delay in ms (default: 100).
 * @returns The result of the function.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 100
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;

        // Check if error is a connection error or timeout (optional refinement)
        // For now, retry on any error that might be transient

        await new Promise((resolve) => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
    }
}
