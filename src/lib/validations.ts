import { z } from "zod";

// Full question validation schema (for server-side)
export const questionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .refine((val) => {
      // Strip HTML tags and check actual text content
      const textContent = val.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 20;
    }, "Description must be at least 20 characters")
    .refine((val) => {
      // Check max length including HTML
      return val.length <= 5000;
    }, "Description must be less than 5000 characters"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed"),
});

// Client-side form validation schema (without description since it's handled separately)
export const clientQuestionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
});

// Answer validation schema
export const answerSchema = z.object({
  content: z
    .string()
    .refine((val) => {
      // Strip HTML tags and check actual text content
      const textContent = val.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 10;
    }, "Answer must be at least 10 characters")
    .refine((val) => {
      // Check max length including HTML
      return val.length <= 5000;
    }, "Answer must be less than 5000 characters"),
});

// Client-side answer form validation schema (empty since content is handled separately)
export const clientAnswerSchema = z.object({});

// Vote validation schema
export const voteSchema = z.object({
  value: z.number().refine((val) => val === 1 || val === -1, {
    message: "Vote value must be 1 or -1",
  }),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
export type ClientQuestionFormData = z.infer<typeof clientQuestionSchema>;
export type AnswerFormData = z.infer<typeof answerSchema>;
export type ClientAnswerFormData = z.infer<typeof clientAnswerSchema>;
export type VoteFormData = z.infer<typeof voteSchema>;
