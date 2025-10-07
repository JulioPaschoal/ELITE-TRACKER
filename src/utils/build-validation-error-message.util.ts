import { type ZodIssue } from 'zod';

export const buildValidationErrorMessage = (issues: ZodIssue[]) => {
  const errors = issues.map(
    (item) => `${item.path.join('.')}: ${item.message}`,
  );
  return errors;
};
