"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";

type ModuleRow = {
  id: string;
  title: string;
  summary: string;
  relevantFor: string | null;
  prompt: boolean;
  sessionTitle: string | null;
  caseStatus: "open" | "submitted" | "feedback";
};

type SessionRow = {
  id: string;
  title: string;
  kindLabel: string;
  startsAt: string;
  location: string | null;
  notes: string | null;
};

type Data = {
  name: string;
  cohort: { id: string; name: string; summary: string | null } | null;
  nextSession: SessionRow | null;
  sessions: SessionRow[];
  modules: ModuleRow[];
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

function statusLabel(s: ModuleRow["caseStatus"]) {
  if (s === "feedback") return "Feedback ready";
  if (s === "submitted") return "Case submitted";
  return "To complete";
}

export default function LearningIndexPage() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portal/learning");
        if (res.status === 401) {
          router.replace("/enter");
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError("Could not load learning.");
          return;
        }
        const json = (await res.json()) as Data;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("Could not load learning.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      <AppNav active="learning" variant="participant" />
      <main className="page">
        <div className="shell" style={{ maxWidth: 820 }}>
          {!data && !error ? <p className="body">Loading learning…</p> : null}
          {error ? <p className="err">{error}</p> : null}

          {data ? (
            <>
              <p className="kicker">Project Alpha · learning</p>
              <h1 className="h1">Material relevant to you</h1>
              <p className="body" style={{ marginTop: 14 }}>
                Work through the modules, submit a case where asked, and read feedback in the same
                place. Content is tied to your cohort and the sessions that follow.
              </p>

              <section className="portal-card" aria-labelledby="cohort-h">
                <h2 className="h2" id="cohort-h">
                  Your cohort
                </h2>
                {data.cohort ? (
                  <>
                    <p className="portal-stage-now">
                      <span className="badge">{data.cohort.name}</span>
                    </p>
                    {data.cohort.summary ? (
                      <p className="body" style={{ marginTop: 8 }}>
                        {data.cohort.summary}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="body" style={{ marginTop: 12 }}>
                    You will be placed in a cohort as the programme continues. Shared modules are
                    already available below.
                  </p>
                )}
              </section>

              <section className="portal-card" aria-labelledby="next-h">
                <h2 className="h2" id="next-h">
                  Upcoming sessions
                </h2>
                {data.sessions.length ? (
                  <ul className="portal-list">
                    {data.sessions.map((s) => (
                      <li key={s.id} className="learn-session">
                        <span className="portal-cat">{s.kindLabel}</span>
                        <strong>{s.title}</strong>
                        <p className="portal-desc">
                          {formatWhen(s.startsAt)}
                          {s.location ? ` · ${s.location}` : ""}
                        </p>
                        {s.notes ? <p className="portal-desc">{s.notes}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="body" style={{ marginTop: 12 }}>
                    No dated sessions yet. Firesides and mock boards will appear here when they are
                    scheduled.
                  </p>
                )}
              </section>

              <section className="portal-card" aria-labelledby="mod-h">
                <h2 className="h2" id="mod-h">
                  Modules
                </h2>
                {data.modules.length ? (
                  <ul className="portal-list">
                    {data.modules.map((m) => (
                      <li key={m.id} className="portal-item">
                        <div>
                          {m.relevantFor ? <span className="portal-cat">{m.relevantFor}</span> : null}
                          <strong>{m.title}</strong>
                          <p className="portal-desc">{m.summary}</p>
                          <span className="portal-meta">
                            {statusLabel(m.caseStatus)}
                            {m.sessionTitle ? ` · Linked session: ${m.sessionTitle}` : ""}
                          </span>
                        </div>
                        <Link className="btn-sm" href={`/portal/learning/${m.id}`}>
                          Open
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="body" style={{ marginTop: 12 }}>
                    Modules will appear here as the team publishes them.
                  </p>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
