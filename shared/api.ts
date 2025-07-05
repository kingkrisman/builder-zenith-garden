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
 * Academic Resource types
 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  category: ResourceCategory;
  subject: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  tags: string[];
}

export enum ResourceCategory {
  LECTURE_NOTES = "lecture_notes",
  ASSIGNMENT = "assignment",
  PAST_QUESTIONS = "past_questions",
  REFERENCE_MATERIAL = "reference_material",
  SYLLABUS = "syllabus",
}

export interface CreateResourceRequest {
  title: string;
  description: string;
  category: ResourceCategory;
  subject: string;
  tags: string[];
}

export interface ResourcesResponse {
  resources: Resource[];
  totalCount: number;
}

export interface UploadResponse {
  success: boolean;
  resource?: Resource;
  message: string;
}
