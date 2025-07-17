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

/**
 * Job application interfaces
 */
export interface JobApplicationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: "backend-engineer" | "ai-developer" | "quantitative-analyst";
  experience: string;
  coverLetter?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  startDate: string;
  salary?: string;
}

export interface JobApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}

export interface JobApplication extends JobApplicationRequest {
  id: string;
  resumeFilename?: string;
  appliedAt: string;
  status: "pending" | "reviewing" | "interviewing" | "rejected" | "hired";
}
