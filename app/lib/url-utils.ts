/**
 * URL Utilities for stateless URL shortener
 * Uses Base64 URL-safe encoding (no database required)
 */

/**
 * Encode a URL to Base64 URL-safe format
 * Replaces: + → -, / → _, removes trailing =
 */
export function encodeUrl(url: string): string {
    const base64 = Buffer.from(url, 'utf-8').toString('base64');
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Decode a Base64 URL-safe string back to original URL
 */
export function decodeUrl(encoded: string): string {
    // Restore Base64 standard format
    let base64 = encoded
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Add back padding if needed
    const padding = base64.length % 4;
    if (padding) {
        base64 += '='.repeat(4 - padding);
    }

    return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Validate URL - must be http or https, not javascript: or data:
 */
export function isValidUrl(url: string): { valid: boolean; error?: string } {
    try {
        const parsed = new URL(url);

        // Block dangerous schemes
        const blockedSchemes = ['javascript:', 'data:', 'vbscript:', 'file:'];
        if (blockedSchemes.some(scheme => url.toLowerCase().startsWith(scheme))) {
            return { valid: false, error: 'URL scheme tidak diizinkan' };
        }

        // Only allow http and https
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { valid: false, error: 'Hanya HTTP dan HTTPS yang diizinkan' };
        }

        return { valid: true };
    } catch {
        return { valid: false, error: 'Format URL tidak valid' };
    }
}

/**
 * Generate the shortened URL path
 */
export function generateShortUrl(baseUrl: string, originalUrl: string): string {
    const encoded = encodeUrl(originalUrl);
    return `${baseUrl}/u/${encoded}`;
}
