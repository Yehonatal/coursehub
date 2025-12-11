export const mockDelay = (ms = 10) =>
    new Promise((resolve) => setTimeout(resolve, ms));
