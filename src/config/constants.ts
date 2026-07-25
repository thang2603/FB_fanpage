import "dotenv/config";
function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const BASE_URL = required("BASE_URL");
export const STORAGE_PATH = required("STORAGE_PATH");
export const PAGE_URL = required("PAGE_URL");
export const ACCOUNT = required("ACCOUNT");
export const PASSWORD = required("PASSWORD");
