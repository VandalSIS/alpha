/** Safe post-login destinations for participants. */
export function resolveAuthRedirect(next?: string | null): "/portal" | "/workbook" {
  return next === "workbook" ? "/workbook" : "/portal";
}
