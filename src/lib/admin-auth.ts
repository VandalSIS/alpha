export function isAdminPassword(password: string | null | undefined) {
  return !!password && password === process.env.ADMIN_PASSWORD;
}
