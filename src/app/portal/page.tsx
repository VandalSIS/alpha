"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";

type Doc = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  category: string | null;
  hasFile: boolean;
  originalName: string | null;
  size: number | null;
};

type PortalData = {
  name: string;
  email: string;
  status: string;
  stageLabel: string;
  stages: { id: string; label: string; current: boolean }[];
  nextSteps: string;
  documents: Doc[];
  resources: Doc[];
  workbookPath: string;
};

function DocRow({ doc }: { doc: Doc }) {
  const href = doc.hasFile ? `/api/portal/docs/${doc.id}` : doc.url || "#";
  const external = !doc.hasFile && !!doc.url;

  return (
    <li className="portal-item">
      <div>
        {doc.category ? <span className="portal-cat">{doc.category}</span> : null}
        <strong>{doc.title}</strong>
        {doc.description ? <p className="portal-desc">{doc.description}</p> : null}
        {doc.hasFile && doc.originalName ? (
          <span className="portal-meta">{doc.originalName}</span>
        ) : null}
      </div>
      <a
        className="btn-sm"
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {doc.hasFile ? "Download" : "Open"}
      </a>
    </li>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portal");
        if (res.status === 401) {
          router.replace("/enter");
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError("Could not load your portal.");
          return;
        }
        const json = (await res.json()) as PortalData;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("Could not load your portal.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      <AppNav active="portal" variant="participant" />
      <main className="page">
        <div className="shell" style={{ maxWidth: 820 }}>
          {!data && !error ? <p className="body">Loading your portal…</p> : null}
          {error ? <p className="err">{error}</p> : null}

          {data ? (
            <>
              <p className="kicker">Project Alpha · participant portal</p>
              <h1 className="h1">Welcome, {data.name.split(" ")[0]}</h1>
              <p className="body" style={{ marginTop: 14 }}>
                One place for your stage, next steps, documents, and Project Alpha resources.
              </p>

              <section className="portal-card" aria-labelledby="stage-h">
                <h2 className="h2" id="stage-h">
                  Where you are
                </h2>
                <p className="portal-stage-now">
                  <span className="badge">{data.stageLabel}</span>
                </p>
                <ol className="portal-stages" aria-label="Programme stages">
                  {data.stages.map((s) => (
                    <li key={s.id} className={s.current ? "is-current" : undefined}>
                      {s.label}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="portal-card" aria-labelledby="next-h">
                <h2 className="h2" id="next-h">
                  Your next steps
                </h2>
                <p className="body" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
                  {data.nextSteps}
                </p>
                {(data.status === "INVITED" ||
                  data.status === "STARTED" ||
                  data.status === "IN_PROGRESS") && (
                  <Link className="btn" href={data.workbookPath}>
                    Open workbook
                  </Link>
                )}
              </section>

              <section className="portal-card" aria-labelledby="docs-h">
                <h2 className="h2" id="docs-h">
                  Your documents
                </h2>
                {data.documents.length ? (
                  <ul className="portal-list">
                    {data.documents.map((d) => (
                      <DocRow key={d.id} doc={d} />
                    ))}
                  </ul>
                ) : (
                  <p className="body" style={{ marginTop: 12 }}>
                    No personal documents yet. When the team shares strategy or board materials with
                    you, they will appear here.
                  </p>
                )}
              </section>

              <section className="portal-card" aria-labelledby="res-h">
                <h2 className="h2" id="res-h">
                  Project Alpha resources
                </h2>
                {data.resources.length ? (
                  <ul className="portal-list">
                    {data.resources.map((d) => (
                      <DocRow key={d.id} doc={d} />
                    ))}
                  </ul>
                ) : (
                  <p className="body" style={{ marginTop: 12 }}>
                    Programme resources (fireside chats, podcasts, governance notes) will be listed
                    here as they are published.
                  </p>
                )}
              </section>

              <p className="body" style={{ marginTop: 28, fontSize: 14 }}>
                Questions?{" "}
                <a href="mailto:projectalpha@christian-timbers.com">
                  projectalpha@christian-timbers.com
                </a>
              </p>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
