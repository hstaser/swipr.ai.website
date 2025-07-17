/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form interfaces
 */
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Waitlist interfaces
 */
export interface WaitlistRequest {
  email: string;
  name?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}
