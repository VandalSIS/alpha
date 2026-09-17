"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";

type ModuleDetail = {
  id: string;
  title: string;
  summary: string;
  body: string;
  prompt: string | null;
  relevantFor: string | null;
  session: {
    title: string;
    kindLabel: string;
    startsAt: string;
    location: string | null;
  } | null;
  caseResponse: {
    body: string;
    submittedAt: string;
    locked: boolean;
    feedback: { body: string; authorName: string; createdAt: string } | null;
  } | null;
};

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function LearningModulePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<ModuleDetail | null>(null);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/portal/learning/${id}`);
        if (res.status === 401) {
          router.replace("/enter");
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError("This module is not available.");
          return;
        }
        const json = (await res.json()) as ModuleDetail;
        if (!cancelled) {
          setData(json);
          setDraft(json.caseResponse?.body || "");
        }
      } catch {
        if (!cancelled) setError("Could not load this module.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function submitCase(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch(`/api/portal/learning/${id}/case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Could not submit.");
        return;
      }
      setMsg("Case submitted. You can update it until feedback is given.");
      setData((prev) =>
        prev
          ? {
              ...prev,
              caseResponse: {
                body: draft,
                submittedAt: json.submittedAt || new Date().toISOString(),
                locked: false,
                feedback: prev.caseResponse?.feedback || null,
              },
            }
          : prev
      );
    } catch {
      setError("Could not submit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AppNav active="learning" variant="participant" />
      <main className="page">
        <div className="shell" style={{ maxWidth: 820 }}>
          <p className="kicker">
            <Link href="/portal/learning">Learning</Link>
          </p>
          {error && !data ? <p className="err">{error}</p> : null}
          {!data && !error ? <p className="body">Loading module…</p> : null}

          {data ? (
            <>
              {data.relevantFor ? <p className="portal-cat">{data.relevantFor}</p> : null}
              <h1 className="h1">{data.title}</h1>
              <p className="body" style={{ marginTop: 14 }}>
                {data.summary}
              </p>

              {data.session ? (
                <p className="learn-linked">
                  Linked session · {data.session.kindLabel}: {data.session.title}
                  {" · "}
                  {formatWhen(data.session.startsAt)}
                  {data.session.location ? ` · ${data.session.location}` : ""}
                </p>
              ) : null}

              <article className="learn-body">{data.body}</article>

              {data.prompt ? (
                <section className="portal-card" aria-labelledby="case-h">
                  <h2 className="h2" id="case-h">
                    Case response
                  </h2>
                  <p className="body" style={{ marginTop: 12 }}>
                    {data.prompt}
                  </p>
                  {data.caseResponse?.locked ? (
                    <p className="body" style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
                      {data.caseResponse.body}
                    </p>
                  ) : (
                    <form onSubmit={submitCase}>
                      <div className="field">
                        <label htmlFor="case-body">Your response</label>
                        <textarea
                          id="case-body"
                          className="learn-textarea"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          required
                          minLength={40}
                        />
                      </div>
                      {error ? <p className="err">{error}</p> : null}
                      {msg ? <p className="ok">{msg}</p> : null}
                      <button className="btn" type="submit" disabled={busy}>
                        {data.caseResponse ? "Update case" : "Submit case"}
                      </button>
                    </form>
                  )}
                </section>
              ) : null}

              {data.caseResponse?.feedback ? (
                <section className="portal-card" aria-labelledby="fb-h">
                  <h2 className="h2" id="fb-h">
                    Feedback
                  </h2>
                  <p className="portal-meta" style={{ marginTop: 10 }}>
                    {data.caseResponse.feedback.authorName} ·{" "}
                    {formatWhen(data.caseResponse.feedback.createdAt)}
                  </p>
                  <p className="body" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
                    {data.caseResponse.feedback.body}
                  </p>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
