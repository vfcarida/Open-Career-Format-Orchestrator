/**
 * @module domain/schemas
 * @description Zod validation schemas for OKF document types and OCF profiles.
 */

import { z } from 'zod';

export const OKFDocumentType = {
  Skill: 'Skill',
  Experience: 'Experience',
  Education: 'Education',
  Preference: 'Preference',
  Application: 'Application',
  Certificate: 'Certificate',
  Project: 'Project',
} as const;

export type OKFDocumentType = (typeof OKFDocumentType)[keyof typeof OKFDocumentType];

export const ApplicationStatus = {
  Saved: 'Saved',
  Applied: 'Applied',
  Screening: 'Screening',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Rejected',
  Withdrawn: 'Withdrawn',
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const SkillLevel = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Expert: 'Expert',
} as const;

export type SkillLevel = (typeof SkillLevel)[keyof typeof SkillLevel];

/**
 * Base frontmatter schema per OKF v0.1 spec §4.1.
 * Only `type` is required; other core fields are optional.
 */
export const OKFFrontmatterSchema = z
  .object({
    type: z.string().min(1, 'The "type" field is required by OKF v0.1 spec §4.1'),
    title: z.string().optional(),
    description: z.string().optional(),
    resource: z.string().optional(),
    tags: z.array(z.string()).optional(),
    timestamp: z.string().optional(),
    schemaVersion: z.string().optional(),
    bundleVersion: z.string().optional(),
  })
  .passthrough();

/**
 * Extended frontmatter for Skill documents.
 */
export const SkillFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Skill),
  level: z.nativeEnum(SkillLevel).optional(),
  yearsOfExperience: z.number().optional(),
  category: z.string().optional(),
});

/**
 * Extended frontmatter for Experience documents.
 */
export const ExperienceFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Experience),
  company: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  location: z.string().optional(),
});

/**
 * Extended frontmatter for Education documents.
 */
export const EducationFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Education),
  institution: z.string().optional(),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  location: z.string().optional(),
});

/**
 * Extended frontmatter for Certificate documents.
 */
export const CertificateFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Certificate),
  issuer: z.string().optional(),
  dateObtained: z.string().optional(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
});

/**
 * Extended frontmatter for Project documents.
 */
export const ProjectFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Project),
  technologies: z.array(z.string()).optional(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Extended frontmatter for Preference documents.
 */
export const PreferenceFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Preference),
  locations: z.array(z.string()).optional(),
  remote: z.boolean().optional(),
  salaryRange: z.string().optional(),
  roles: z.array(z.string()).optional(),
  companySize: z.string().optional(),
});

/**
 * Extended frontmatter for Application documents.
 */
export const ApplicationFrontmatterSchema = OKFFrontmatterSchema.extend({
  type: z.literal(OKFDocumentType.Application),
  company: z.string().optional(),
  position: z.string().optional(),
  url: z.string().url().optional(),
  platform: z.string().optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  appliedAt: z.string().optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
});

/**
 * Discriminated union for OCF career profile validations.
 */
export const CareerFrontmatterSchema = z.discriminatedUnion('type', [
  SkillFrontmatterSchema,
  ExperienceFrontmatterSchema,
  EducationFrontmatterSchema,
  CertificateFrontmatterSchema,
  ProjectFrontmatterSchema,
  PreferenceFrontmatterSchema,
  ApplicationFrontmatterSchema,
]);
