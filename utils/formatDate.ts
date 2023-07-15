export function formatDate(dateString: string): string {
  const date: Date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString("en-CA", options).replace(/\//g, "-");
}
