"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";

type Cohort = { id: string; name: string; summary: string | null };
type Session = {
  id: string;
  title: string;
  kind: string;
  startsAt: string;
  location: string | null;
  notes: string | null;
  cohortId: string | null;
  cohortName: string | null;
};
type Module = {
  id: string;
  title: string;
  summary: string;
  published: boolean;
  relevantFor: string | null;
};
type Invite = { id: string; name: string; email: string; cohortId: string | null; status: string };
type CaseRow = {
  id: string;
  body: string;
  submittedAt: string;
  participantName: string;
  participantEmail: string;
  moduleTitle: string;
  feedback: { body: string; authorName: string } | null;
};

const PW_KEY = "pa_admin_pw";

export default function AdminLearningPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [cases, setCases] = useState<CaseRow[]>([]);

  const [cohortName, setCohortName] = useState("");
  const [cohortSummary, setCohortSummary] = useState("");

  const [sessTitle, setSessTitle] = useState("");
  const [sessKind, setSessKind] = useState("fireside");
  const [sessWhen, setSessWhen] = useState("");
  const [sessLoc, setSessLoc] = useState("");
  const [sessCohort, setSessCohort] = useState("");

  const [modTitle, setModTitle] = useState("");
  const [modSummary, setModSummary] = useState("");
  const [modBody, setModBody] = useState("");
  const [modPrompt, setModPrompt] = useState("");
  const [modRelevant, setModRelevant] = useState("");

  const [fbDraft, setFbDraft] = useState<Record<string, string>>({});

  async function load(pw: string) {
    const res = await fetch(`/api/admin/learning?password=${encodeURIComponent(pw)}`);
    if (!res.ok) throw new Error("Unauthorized");
    const data = await res.json();
    setCohorts(data.cohorts);
    setSessions(data.sessions);
    setModules(data.modules);
    setInvites(data.invites);
    setCases(data.cases);
    setUnlocked(true);
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(PW_KEY);
    if (!stored) return;
    setPassword(stored);
    load(stored).catch(() => sessionStorage.removeItem(PW_KEY));
  }, []);

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await load(password);
      sessionStorage.setItem(PW_KEY, password);
    } catch {
      setErr("Wrong password.");
    }
  }

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/admin/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof data.error === "string" ? data.error : "Request failed.");
        return;
      }
      setMsg("Saved.");
      await load(password);
    } catch {
      setErr("Server error.");
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <>
        <AppNav active="admin-learning" variant="internal" />
        <main className="page">
          <div className="shell" style={{ maxWidth: 480 }}>
            <p className="kicker">Admin</p>
            <h1 className="h1">Learning</h1>
            <form onSubmit={unlock} style={{ marginTop: 24 }}>
              <div className="field">
                <label htmlFor="pw">Password</label>
                <input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {err ? <p className="err">{err}</p> : null}
              <button className="btn" type="submit">
                Unlock
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppNav active="admin-learning" variant="internal" />
      <main className="page">
        <div className="shell" style={{ maxWidth: 920 }}>
          <p className="kicker">Admin</p>
          <h1 className="h1">Learning, cohorts, sessions</h1>
          <p className="body" style={{ marginTop: 14 }}>
            Assign participants to a cohort, publish modules, schedule firesides or mock boards, and
            reply to case responses.{" "}
            <Link href="/admin">Back to invitations</Link>
          </p>
          {err ? <p className="err">{err}</p> : null}
          {msg ? <p className="ok">{msg}</p> : null}

          <section className="admin-section">
            <h2 className="h2">Cohorts</h2>
            <ul className="portal-list">
              {cohorts.map((c) => (
                <li key={c.id} className="portal-item">
                  <div>
                    <strong>{c.name}</strong>
                    {c.summary ? <p className="portal-desc">{c.summary}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
            <form
              className="admin-portal-box"
              onSubmit={(e) => {
                e.preventDefault();
                post({ action: "cohort", name: cohortName, summary: cohortSummary }).then(() => {
                  setCohortName("");
                  setCohortSummary("");
                });
              }}
            >
              <div className="field">
                <label>New cohort name</label>
                <input value={cohortName} onChange={(e) => setCohortName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Summary (optional)</label>
                <textarea value={cohortSummary} onChange={(e) => setCohortSummary(e.target.value)} />
              </div>
              <button className="btn-sm" type="submit" disabled={busy}>
                Add cohort
              </button>
            </form>
          </section>

          <section className="admin-section">
            <h2 className="h2">Assign participants</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Cohort</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.email}</td>
                    <td>
                      <select
                        value={i.cohortId || ""}
                        onChange={(e) =>
                          post({
                            action: "assign",
                            invitationId: i.id,
                            cohortId: e.target.value || null,
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {cohorts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-section">
            <h2 className="h2">Sessions</h2>
            <ul className="portal-list">
              {sessions.map((s) => (
                <li key={s.id} className="learn-session">
                  <span className="portal-cat">{s.kind}</span>
                  <strong>{s.title}</strong>
                  <p className="portal-desc">
                    {new Date(s.startsAt).toLocaleString()}
                    {s.location ? ` · ${s.location}` : ""}
                    {s.cohortName ? ` · ${s.cohortName}` : " · all cohorts"}
                  </p>
                </li>
              ))}
            </ul>
            <form
              className="admin-portal-box"
              onSubmit={(e) => {
                e.preventDefault();
                post({
                  action: "session",
                  title: sessTitle,
                  kind: sessKind,
                  startsAt: sessWhen,
                  location: sessLoc,
                  cohortId: sessCohort || null,
                }).then(() => {
                  setSessTitle("");
                  setSessWhen("");
                  setSessLoc("");
                });
              }}
            >
              <div className="field">
                <label>Title</label>
                <input value={sessTitle} onChange={(e) => setSessTitle(e.target.value)} required />
              </div>
              <div className="field">
                <label>Type</label>
                <select value={sessKind} onChange={(e) => setSessKind(e.target.value)}>
                  <option value="fireside">Fireside</option>
                  <option value="mock_board">Mock board</option>
                  <option value="peer">Peer group</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>Starts</label>
                <input
                  type="datetime-local"
                  value={sessWhen}
                  onChange={(e) => setSessWhen(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Location</label>
                <input value={sessLoc} onChange={(e) => setSessLoc(e.target.value)} />
              </div>
              <div className="field">
                <label>Cohort</label>
                <select value={sessCohort} onChange={(e) => setSessCohort(e.target.value)}>
                  <option value="">All participants</option>
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn-sm" type="submit" disabled={busy}>
                Add session
              </button>
            </form>
          </section>

          <section className="admin-section">
            <h2 className="h2">Modules</h2>
            <ul className="portal-list">
              {modules.map((m) => (
                <li key={m.id} className="portal-item">
                  <div>
                    <strong>{m.title}</strong>
                    <p className="portal-desc">{m.summary}</p>
                    <span className="portal-meta">
                      {m.published ? "Published" : "Draft"}
                      {m.relevantFor ? ` · ${m.relevantFor}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <form
              className="admin-portal-box"
              onSubmit={(e) => {
                e.preventDefault();
                post({
                  action: "module",
                  title: modTitle,
                  summary: modSummary,
                  body: modBody,
                  prompt: modPrompt,
                  relevantFor: modRelevant,
                }).then(() => {
                  setModTitle("");
                  setModSummary("");
                  setModBody("");
                  setModPrompt("");
                  setModRelevant("");
                });
              }}
            >
              <div className="field">
                <label>Title</label>
                <input value={modTitle} onChange={(e) => setModTitle(e.target.value)} required />
              </div>
              <div className="field">
                <label>Summary</label>
                <input value={modSummary} onChange={(e) => setModSummary(e.target.value)} required />
              </div>
              <div className="field">
                <label>Relevant for (label)</label>
                <input
                  value={modRelevant}
                  onChange={(e) => setModRelevant(e.target.value)}
                  placeholder="Your cohort · upcoming fireside"
                />
              </div>
              <div className="field">
                <label>Material</label>
                <textarea value={modBody} onChange={(e) => setModBody(e.target.value)} required />
              </div>
              <div className="field">
                <label>Case prompt (optional)</label>
                <textarea value={modPrompt} onChange={(e) => setModPrompt(e.target.value)} />
              </div>
              <button className="btn-sm" type="submit" disabled={busy}>
                Publish module
              </button>
            </form>
          </section>

          <section className="admin-section">
            <h2 className="h2">Case responses</h2>
            {cases.length === 0 ? (
              <p className="body" style={{ marginTop: 12 }}>
                No cases submitted yet.
              </p>
            ) : (
              cases.map((c) => (
                <article key={c.id} className="admin-portal-box">
                  <p className="kicker">{c.moduleTitle}</p>
                  <p>
                    <strong>{c.participantName}</strong> · {c.participantEmail}
                  </p>
                  <p className="body" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
                    {c.body}
                  </p>
                  {c.feedback ? (
                    <p className="ok" style={{ whiteSpace: "pre-wrap" }}>
                      Feedback ({c.feedback.authorName}): {c.feedback.body}
                    </p>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        post({
                          action: "feedback",
                          caseId: c.id,
                          body: fbDraft[c.id] || "",
                        });
                      }}
                    >
                      <div className="field">
                        <label>Feedback</label>
                        <textarea
                          value={fbDraft[c.id] || ""}
                          onChange={(e) =>
                            setFbDraft((prev) => ({ ...prev, [c.id]: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <button className="btn-sm" type="submit" disabled={busy}>
                        Send feedback
                      </button>
                    </form>
                  )}
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </>
  );
}
