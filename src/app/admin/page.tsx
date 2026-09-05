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
  nextSteps?: string | null;
  createdAt: string;
  submission?: { reference: string; done: boolean } | null;
};

type PortalDoc = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  hasFile: boolean;
  originalName: string | null;
  size: number | null;
  createdAt: string;
  category?: string | null;
};

type SubmissionDetail = {
  id: string;
  name: string;
  email: string;
  code: string;
  status: string;
  nextSteps: string | null;
  createdAt: string;
  startedAt: string | null;
  submittedAt: string | null;
  portalDocs: PortalDoc[];
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

const STATUSES = [
  "INVITED",
  "STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "IN_REVIEW",
  "COMPLETE",
] as const;

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

  const [editStatus, setEditStatus] = useState("");
  const [editNextSteps, setEditNextSteps] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  const [resources, setResources] = useState<PortalDoc[]>([]);
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resCategory, setResCategory] = useState("");
  const [resFile, setResFile] = useState<File | null>(null);

  async function load(pw: string) {
    const res = await fetch(`/api/admin/invites?password=${encodeURIComponent(pw)}`);
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    setList(data);
    setUnlocked(true);
  }

  async function loadResources(pw: string) {
    const res = await fetch(`/api/admin/resources?password=${encodeURIComponent(pw)}`);
    if (!res.ok) return;
    setResources(await res.json());
  }

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await load(password);
      await loadResources(password);
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
      setEditStatus(data.status);
      setEditNextSteps(data.nextSteps || "");
      setDocTitle("");
      setDocUrl("");
      setDocFile(null);
    } catch {
      setErr("Server error.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function savePortalFields() {
    if (!detail) return;
    setErr("");
    setMsg("");
    setRowBusy(detail.id);
    try {
      const res = await fetch(`/api/admin/invites/${detail.id}/portal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          status: editStatus,
          nextSteps: editNextSteps.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Could not save portal fields.");
        return;
      }
      setMsg("Portal stage / next steps saved.");
      await load(password);
      await viewAnswers(detail.id);
    } catch {
      setErr("Server error.");
    } finally {
      setRowBusy(null);
    }
  }

  async function addPersonalDoc(e: FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setErr("");
    setMsg("");
    setRowBusy(detail.id);
    try {
      const form = new FormData();
      form.set("password", password);
      form.set("title", docTitle);
      if (docUrl.trim()) form.set("url", docUrl.trim());
      if (docFile) form.set("file", docFile);

      const res = await fetch(`/api/admin/invites/${detail.id}/portal`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(typeof data.error === "string" ? data.error : "Could not add document.");
        return;
      }
      setMsg("Document added to participant portal.");
      setDocTitle("");
      setDocUrl("");
      setDocFile(null);
      await viewAnswers(detail.id);
    } catch {
      setErr("Server error.");
    } finally {
      setRowBusy(null);
    }
  }

  async function deletePersonalDoc(docId: string) {
    if (!detail || !confirm("Remove this document from their portal?")) return;
    setRowBusy(detail.id);
    try {
      const res = await fetch(`/api/admin/invites/${detail.id}/portal`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, docId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || "Delete failed.");
        return;
      }
      setMsg("Document removed.");
      await viewAnswers(detail.id);
    } catch {
      setErr("Server error.");
    } finally {
      setRowBusy(null);
    }
  }

  async function addResource(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      const form = new FormData();
      form.set("password", password);
      form.set("title", resTitle);
      if (resCategory.trim()) form.set("category", resCategory.trim());
      if (resUrl.trim()) form.set("url", resUrl.trim());
      if (resFile) form.set("file", resFile);

      const res = await fetch("/api/admin/resources", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setErr(typeof data.error === "string" ? data.error : "Could not add resource.");
        return;
      }
      setMsg("Shared resource published to all portals.");
      setResTitle("");
      setResUrl("");
      setResCategory("");
      setResFile(null);
      await loadResources(password);
    } catch {
      setErr("Server error.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteResource(id: string) {
    if (!confirm("Remove this shared resource?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || "Delete failed.");
        return;
      }
      setMsg("Resource removed.");
      await loadResources(password);
    } catch {
      setErr("Server error.");
    } finally {
      setBusy(false);
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
            Add a participant, manage workbook submissions, and update their{" "}
            <strong>portal</strong> (stage, next steps, personal documents). Shared programme
            resources are managed below.
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
                        <button
                          type="button"
                          className="btn-sm"
                          disabled={busyRow || detailLoading}
                          onClick={() => viewAnswers(i.id)}
                        >
                          Portal / View
                        </button>
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

          <section className="admin-section" aria-labelledby="res-admin-h">
            <h2 className="h2" id="res-admin-h">
              Shared portal resources
            </h2>
            <p className="body" style={{ marginTop: 10 }}>
              These appear for every participant under Project Alpha resources (podcasts, fireside
              chats, governance notes, etc.).
            </p>

            <form onSubmit={addResource} style={{ maxWidth: 560, marginTop: 8 }}>
              <div className="field">
                <label htmlFor="resTitle">Title</label>
                <input
                  id="resTitle"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="resCategory">Category (optional)</label>
                <input
                  id="resCategory"
                  placeholder="Podcast, Governance, Fireside…"
                  value={resCategory}
                  onChange={(e) => setResCategory(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="resUrl">URL (optional if uploading a file)</label>
                <input
                  id="resUrl"
                  type="url"
                  placeholder="https://"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="resFile">File PDF/Word (optional)</label>
                <input
                  id="resFile"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={(e) => setResFile(e.target.files?.[0] || null)}
                />
              </div>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Publish resource"}
              </button>
            </form>

            <ul className="portal-list" style={{ marginTop: 24 }}>
              {resources.map((r) => (
                <li key={r.id} className="portal-item">
                  <div>
                    {r.category ? <span className="portal-cat">{r.category}</span> : null}
                    <strong>{r.title}</strong>
                    {r.url ? <span className="portal-meta">{r.url}</span> : null}
                    {r.hasFile && r.originalName ? (
                      <span className="portal-meta">{r.originalName}</span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="btn-sm btn-sm--danger"
                    onClick={() => deleteResource(r.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {!resources.length ? (
                <li className="body" style={{ padding: "12px 0" }}>
                  No shared resources yet.
                </li>
              ) : null}
            </ul>
          </section>
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
                <p className="kicker">Participant</p>
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
              <section className="admin-portal-box">
                <h3 className="h2" style={{ fontSize: 18 }}>
                  Portal settings
                </h3>
                <div className="field">
                  <label htmlFor="editStatus">Stage shown to participant</label>
                  <select
                    id="editStatus"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px" }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="editNext">Next steps (optional custom text)</label>
                  <textarea
                    id="editNext"
                    value={editNextSteps}
                    onChange={(e) => setEditNextSteps(e.target.value)}
                    placeholder="Leave blank to use the default text for this stage."
                  />
                </div>
                <button
                  type="button"
                  className="btn-sm"
                  disabled={rowBusy === detail.id}
                  onClick={() => savePortalFields()}
                >
                  Save stage & next steps
                </button>
              </section>

              <section className="review-files">
                <h3 className="h2" style={{ fontSize: 18 }}>
                  Personal portal documents
                </h3>
                <ul className="review-file-list">
                  {(detail.portalDocs || []).map((d) => (
                    <li key={d.id}>
                      <div>
                        <strong>{d.title}</strong>
                        {d.url ? <span className="review-file-name">{d.url}</span> : null}
                        {d.hasFile && d.originalName ? (
                          <span className="review-file-name">{d.originalName}</span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="btn-sm btn-sm--danger"
                        onClick={() => deletePersonalDoc(d.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                  {!(detail.portalDocs || []).length ? (
                    <li className="body">No personal documents yet.</li>
                  ) : null}
                </ul>

                <form onSubmit={addPersonalDoc} style={{ marginTop: 16 }}>
                  <div className="field">
                    <label htmlFor="docTitle">Document title</label>
                    <input
                      id="docTitle"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="docUrl">URL (optional)</label>
                    <input
                      id="docUrl"
                      type="url"
                      value={docUrl}
                      onChange={(e) => setDocUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="docFile">File PDF/Word (optional)</label>
                    <input
                      id="docFile"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf"
                      onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <button className="btn-sm" type="submit" disabled={rowBusy === detail.id}>
                    Add to their portal
                  </button>
                </form>
              </section>

              {!detail.submission ? (
                <p className="body" style={{ marginTop: 28 }}>
                  No workbook answers saved yet.
                </p>
              ) : !answerEntries.length ? (
                <p className="body" style={{ marginTop: 28 }}>
                  Submission exists but answers are empty.
                </p>
              ) : (
                <dl className="review-list" style={{ marginTop: 28 }}>
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
                    Workbook uploads
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
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
