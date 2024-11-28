import type { z } from 'zod';

export function useForm<T extends z.ZodTypeAny>(schema: T) {
  const errors = ref<z.ZodFormattedError<z.input<T>, string>>();

  function validate(values: unknown): values is z.input<T> {
    const result = schema.safeParse(values);
    if (result.success) {
      errors.value = undefined;
      return true;
    }

    errors.value = result.error.format() as any;
    return false;
  }

  function parse(values: unknown): z.output<T> | null {
    const result = schema.safeParse(values);
    if (result.success) {
      errors.value = undefined;
      return result.data;
    }

    errors.value = result.error.format() as any;
    return null;
  }

  function clearErrors() {
    errors.value = undefined;
  }

  return { validate, parse, errors, clearErrors };
}
