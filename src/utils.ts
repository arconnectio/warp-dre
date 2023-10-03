/**
 * Stringify object values
 */
export function stringifyRecordValues(obj: Record<string, boolean | string | number>) {
  const record = {...obj};

  for (const key in record) {
    record[key] = obj[key].toString();
  }

  return record;
}
