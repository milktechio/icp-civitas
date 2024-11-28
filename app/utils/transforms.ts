import { z } from 'zod';

export function formatList(list: string[], options?: Intl.ListFormatOptions) {
  const v = z.array(z.string()).safeParse(list);
  if (!v.success) return 'Err.';

  const formatter = new Intl.ListFormat(undefined, options);
  return formatter.format(list);
}
