"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import fieldLabels from "@/lib/workbook-labels.json";

type Invite = {
  id: string;
  name: string;
  email: string;
  code: string;
  status: string;
  createdAt: string;
  submission?: { reference: string; done: boolean } | null;
};

type SubmissionDetail = {
  id: string;
  name: string;
  email: string;
  code: string;
  status: string;
  createdAt: string;
  startedAt: string | null;
  submittedAt: string | null;
  files: {
    id: string;
    fieldId: string;
    name: string;
    size: number;
    mimeType: string;
    createdAt: string;
  }[];
  submission: {
    reference: string;
    step: number;
    done: boolean;
    updatedAt: string;
    answers: Record<string, unknown>;
  } | null;
};

const labels = fieldLabels as Record<string, string>;

function formatAnswer(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    return value
      .map((v) =>
        typeof v === "object" && v && "name" in v
          ? String((v as { name: string }).name)
          : String(v)
      )
      .join("\n");
  }
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function labelFor(key: string): string {
  if (labels[key]) return labels[key];
  if (key.includes("::")) {
    const [base, rest] = key.split("::");
    const baseLabel = labels[base] || base;
    return `${baseLabel} — ${rest}`;
  }
  if (key.endsWith("_other")) {
    const base = key.slice(0, -6);
    return `${labels[base] || base} (other)`;
  }
  return key;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [list, setList] = useState<Invite[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function load(pw: string) {
    const res = await fetch(`/api/admin/invites?password=${encodeURIComponent(pw)}`);
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    setList(data);
    setUnlocked(true);
  }

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await load(password);
    } catch {
      setErr("Wrong password.");
    }
  }

  async function createInvite(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const raw =
          typeof data.error === "string"
            ? data.error
            : data.error
              ? JSON.stringify(data.error)
              : `Could not create invite (${res.status}).`;
        setErr(raw);
        return;
      }
      if (data.emailSent === false) {
        setMsg(
          `Invite created. Code: ${data.code}. Email FAILED: ${data.emailError || "unknown error"}`
        );
        setErr(data.emailError || "Email failed — invite still created.");
      } else {
        setMsg(`Invite created. Code: ${data.code}. Invitation email sent.`);
      }
      setName("");
      setEmail("");
      await load(password);
    } catch {
      setErr("Server error.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteInvite(id: string, label: string) {
    if (!confirm(`Delete invitation for ${label}? This cannot be undone.`)) return;
    setErr("");
    setMsg("");
    setRowBusy(id);
    try {
      const res = await fetch(`/api/admin/invites/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Delete failed.");
        return;
      }
      setMsg("Invitation deleted.");
      if (detail?.id === id) setDetail(null);
      await load(password);
    } catch {
      setErr("Server error.");
    } finally {
      setRowBusy(null);
    }
  }

  async function reopenInvite(id: string) {
    if (!confirm("Reopen this workbook so they can enter again with the same code?")) return;
    setErr("");
    setMsg("");
    setRowBusy(id);
    try {
      const res = await fetch(`/api/admin/invites/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "reopen" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Reopen failed.");
        return;
      }
      setMsg("Invitation reopened — they can enter with the same code again.");
      await load(password);
    } catch {
      setErr("Server error.");
    } finally {
      setRowBusy(null);
    }
  }

  async function viewAnswers(id: string) {
    setErr("");
    setDetailLoading(true);
    try {
      const res = await fetch(
        `/api/admin/invites/${id}?password=${encodeURIComponent(password)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Could not load answers.");
        return;
      }
      setDetail(data);
    } catch {
      setErr("Server error.");
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    if (!detail) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDetail(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  function downloadJson() {
    if (!detail?.submission) return;
    const blob = new Blob([JSON.stringify(detail, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${detail.submission.reference || detail.code}-answers.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCsv() {
    if (!detail?.submission) return;
    const rows: string[][] = [
      ["Question", "Answer"],
      ["Participant name", detail.name],
      ["Participant email", detail.email],
      ["Invitation code", detail.code],
      ["Reference", detail.submission.reference],
      ["", ""],
    ];
    for (const [key, value] of Object.entries(detail.submission.answers)) {
      if (key === "__files") continue;
      const text = formatAnswer(value);
      if (text === "—") continue;
      rows.push([labelFor(key), text.replace(/\n/g, " | ")]);
    }
    if (detail.files?.length) {
      rows.push(["", ""]);
      rows.push(["Uploaded documents", ""]);
      for (const f of detail.files) {
        rows.push([labelFor(f.fieldId), f.name]);
      }
    }
    const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const csv = rows.map((r) => r.map((c) => esc(String(c))).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${detail.submission.reference || detail.code}-answers.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function fileDownloadUrl(fileId: string) {
    return `/api/admin/files/${fileId}?password=${encodeURIComponent(password)}`;
  }

  const answerEntries = detail?.submission
    ? Object.entries(detail.submission.answers).filter(([k, v]) => {
        if (k === "__files") return false;
        if (typeof v === "string" && /fakepath/i.test(v)) return false;
        return true;
      })
    : [];
  const uploadedFiles = detail?.files || [];

  if (!unlocked) {
    return (
      <>
        <AppNav active="admin" />
        <main className="page">
          <div className="shell" style={{ maxWidth: 420 }}>
            <p className="kicker">Project Alpha</p>
            <h1 className="h1">Admin</h1>
            <form onSubmit={unlock}>
              <div className="field">
                <label htmlFor="pw">Admin password</label>
                <input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn" type="submit">
                Unlock
              </button>
              {err ? <p className="err">{err}</p> : null}
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppNav active="admin" />
      <main className="page">
        <div className="shell" style={{ maxWidth: 1100 }}>
          <h1 className="h1">Invitations</h1>
          <p className="body" style={{ marginTop: 12 }}>
            Add a participant. The system generates an invite code and sends the invitation email.
            After submit they can still enter with the same code and will see{" "}
            <strong>SUBMITTED</strong>. Use <strong>View</strong> to read answers,{" "}
            <strong>Reopen</strong> to let them edit again.
          </p>

          <form onSubmit={createInvite} style={{ maxWidth: 520, marginTop: 8 }}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create invite & send email"}
            </button>
            {msg ? <p className="ok">{msg}</p> : null}
            {err ? <p className="err">{typeof err === "string" ? err : "Error"}</p> : null}
          </form>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Code</th>
                <th>Status</th>
                <th>Ref</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => {
                const submitted =
                  i.status === "SUBMITTED" || i.status === "COMPLETE" || i.submission?.done;
                const hasSubmission = !!i.submission;
                const busyRow = rowBusy === i.id;
                return (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.email}</td>
                    <td>
                      <code>{i.code}</code>
                    </td>
                    <td>
                      <span className="badge">{i.status}</span>
                    </td>
                    <td>{i.submission?.reference || "—"}</td>
                    <td>
                      <div className="row-actions">
                        {hasSubmission ? (
                          <button
                            type="button"
                            className="btn-sm"
                            disabled={busyRow || detailLoading}
                            onClick={() => viewAnswers(i.id)}
                          >
                            View
                          </button>
                        ) : null}
                        {submitted ? (
                          <button
                            type="button"
                            className="btn-sm"
                            disabled={busyRow}
                            onClick={() => reopenInvite(i.id)}
                          >
                            Reopen
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="btn-sm btn-sm--danger"
                          disabled={busyRow}
                          onClick={() => deleteInvite(i.id, i.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!list.length ? (
                <tr>
                  <td colSpan={6} className="body">
                    No invitations yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>

      {detail ? (
        <div
          className="review-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null);
          }}
        >
          <aside className="review-panel" role="dialog" aria-labelledby="review-title">
            <header className="review-head">
              <div>
                <p className="kicker">Submission</p>
                <h2 className="h2" id="review-title">
                  {detail.name}
                </h2>
                <p className="review-meta">
                  {detail.email} · <code>{detail.code}</code>
                  {detail.submission?.reference ? (
                    <>
                      {" "}
                      · Ref <strong>{detail.submission.reference}</strong>
                    </>
                  ) : null}
                </p>
                <p className="review-meta">
                  Status <span className="badge">{detail.status}</span>
                  {detail.submission ? (
                    <>
                      {" "}
                      · Step {detail.submission.step}
                      {detail.submission.done ? " · Done" : ""}
                    </>
                  ) : null}
                </p>
              </div>
              <div className="review-actions">
                {detail.submission ? (
                  <>
                    <button type="button" className="btn-sm" onClick={downloadCsv}>
                      Download CSV
                    </button>
                    <button type="button" className="btn-sm" onClick={downloadJson}>
                      JSON
                    </button>
                  </>
                ) : null}
                <button type="button" className="btn-sm" onClick={() => setDetail(null)}>
                  Close
                </button>
              </div>
            </header>

            <div className="review-body">
              {!detail.submission ? (
                <p className="body">No answers saved yet.</p>
              ) : !answerEntries.length ? (
                <p className="body">Submission exists but answers are empty.</p>
              ) : (
                <dl className="review-list">
                  {answerEntries.map(([key, value]) => {
                    const text = formatAnswer(value);
                    if (text === "—") return null;
                    return (
                      <div key={key} className="review-item">
                        <dt>{labelFor(key)}</dt>
                        <dd>
                          {Array.isArray(value) ? (
                            <ul>
                              {value.map((v, idx) => (
                                <li key={idx}>
                                  {typeof v === "object" && v && "name" in v
                                    ? String((v as { name: string }).name)
                                    : String(v)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <pre>{text}</pre>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}

              {uploadedFiles.length ? (
                <section className="review-files">
                  <h3 className="h2" style={{ fontSize: 18 }}>
                    Uploaded documents
                  </h3>
                  <ul className="review-file-list">
                    {uploadedFiles.map((f) => (
                      <li key={f.id}>
                        <div>
                          <strong>{labelFor(f.fieldId)}</strong>
                          <span className="review-file-name">{f.name}</span>
                          <span className="review-file-size">
                            {(f.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                        <a className="btn-sm" href={fileDownloadUrl(f.id)} download={f.name}>
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : (
                <section className="review-files">
                  <h3 className="h2" style={{ fontSize: 18 }}>
                    Uploaded documents
                  </h3>
                  <p className="body">
                    No files stored yet. Older submissions only saved the filename — ask the
                    participant to re-upload after Reopen, or use new submissions.
                  </p>
                </section>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
