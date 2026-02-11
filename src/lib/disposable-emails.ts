import domains from "disposable-email-domains";

const blocklist = new Set<string>(domains as string[]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? blocklist.has(domain) : false;
}
