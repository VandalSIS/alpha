import fieldLabels from "@/lib/workbook-labels.json";

const labels = fieldLabels as Record<string, string>;

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function labelFor(key: string): string {
  if (labels[key]) return labels[key];
  if (key.includes("::")) {
    const [base, rest] = key.split("::");
    return `${labels[base] || base} — ${rest}`;
  }
  if (key.endsWith("_other")) {
    const base = key.slice(0, -6);
    return `${labels[base] || base} (other)`;
  }
  return key;
}

function formatValue(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "object" && v && "name" in v ? String((v as { name: string }).name) : String(v)))
      .join("; ");
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Two-column CSV: Question, Answer — opens cleanly in Excel. */
export function answersToCsv(
  answers: Record<string, unknown>,
  meta?: { name?: string; email?: string; reference?: string; code?: string }
): string {
  const rows: string[][] = [["Question", "Answer"]];
  if (meta?.name) rows.push(["Participant name", meta.name]);
  if (meta?.email) rows.push(["Participant email", meta.email]);
  if (meta?.code) rows.push(["Invitation code", meta.code]);
  if (meta?.reference) rows.push(["Reference", meta.reference]);
  rows.push(["", ""]);

  for (const [key, value] of Object.entries(answers)) {
    if (key === "__files") continue;
    const formatted = formatValue(value);
    if (!formatted) continue;
    rows.push([labelFor(key), formatted]);
  }

  const files = answers.__files;
  if (files && typeof files === "object") {
    rows.push(["", ""]);
    rows.push(["Uploaded documents", ""]);
    for (const [fieldId, list] of Object.entries(files as Record<string, unknown>)) {
      const names = Array.isArray(list)
        ? list
            .map((x) =>
              typeof x === "object" && x && "name" in x
                ? String((x as { name: string }).name)
                : String(x)
            )
            .join("; ")
        : String(list);
      rows.push([labelFor(fieldId), names]);
    }
  }

  return rows.map((r) => r.map((c) => csvEscape(String(c))).join(",")).join("\r\n");
}
