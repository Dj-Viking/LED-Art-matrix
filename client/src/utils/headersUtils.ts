export function setInitialHeaders(headers: Record<string, string>): Record<string, string> {
    headers = {
        "Content-Type": "application/json",
    };
    return headers;
}
export function setAuthHeader(
    headers: Record<string, string>,
    token: string
): Record<string, string> {
    headers = {
        ...headers,
        authorization: `Bearer ${token}`,
    };
    return headers;
}
export function clearHeaders(headers: Record<string, string>): Record<string, string> {
    headers = {};
    return headers;
}
