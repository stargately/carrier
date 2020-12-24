export function formatString(
  str?: string,
  data?: Record<string, string | undefined>
): string {
  if (!str || !data) {
    return str || "";
  }

  let processed = str;
  Object.keys(data).forEach((key) => {
    processed = processed.replace(`\${${key}}`, data[key] || "");
  });

  return processed || "";
}
