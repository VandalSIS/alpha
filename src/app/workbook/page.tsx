"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import "./workbook.css";

type Boot = {
  name: string;
  email: string;
  step: number;
  done: boolean;
  reference: string;
  answers: Record<string, unknown>;
};

declare global {
  interface Window {
    __PA_BOOTSTRAP?: Record<string, unknown>;
    __PA_PARTICIPANT?: { name: string; email: string };
    __PA_ENGINE_LOADED?: boolean;
    __PA_RERENDER?: () => void;
    __PA_DEV?: boolean;
  }
}

export default function WorkbookPage() {
  const router = useRouter();
  const [boot, setBoot] = useState<Boot | null>(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/workbook", { credentials: "same-origin" });
      if (res.status === 401) {
        router.replace("/enter");
        return;
      }
      if (!res.ok) {
        setError("Could not load workbook.");
        return;
      }
      const data = await res.json();
      const answers = data.answers || {};
      const files =
        answers.__files && typeof answers.__files === "object" ? answers.__files : {};
      const clean = { ...answers };
      delete clean.__files;

      window.__PA_PARTICIPANT = { name: data.name, email: data.email };
      const urlDev =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("dev") === "1";
      window.__PA_DEV = !!data.devTools || urlDev;
      window.__PA_BOOTSTRAP = {
        step: data.done ? 10 : data.step || 0,
        data: clean,
        files,
        done: !!data.done,
        ref: data.reference || null,
      };
      // If already submitted, engine shows confirmation when done=true
      if (data.done) {
        window.__PA_BOOTSTRAP.step = 0;
        window.__PA_BOOTSTRAP.done = true;
      }

      setBoot(data);
      setMounted(true);
    })();
  }, [router]);

  useEffect(() => {
    if (!mounted || !boot) return;

    if (window.__PA_ENGINE_LOADED) {
      window.__PA_RERENDER?.();
      return;
    }

    const s = document.createElement("script");
    s.src = `/pa-workbook-engine.js?v=6`;
    s.async = false;
    s.onload = () => {
      window.__PA_ENGINE_LOADED = true;
    };
    s.onerror = () => setError("Could not load workbook engine.");
    document.body.appendChild(s);
  }, [mounted, boot]);

  if (error) {
    return (
      <>
        <AppNav active="workbook" />
        <main className="page">
          <div className="shell">
            <p className="err">{error}</p>
          </div>
        </main>
      </>
    );
  }

  if (!boot) {
    return (
      <>
        <AppNav active="workbook" />
        <main className="page">
          <div className="shell">
            <p className="body">Loading workbook…</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppNav active="workbook" />
      <div id="pw-root">
        <div className="pw-bar" role="banner">
          <div className="pw-bar-in">
            <span className="pw-kicker">Project Alpha · {boot.name}</span>
            <span className="pw-saved" id="pw-saved" role="status"></span>
            <div className="pw-prog" id="pw-prog" aria-hidden="true"></div>
            <span className="pw-step-n" id="pw-stepn"></span>
          </div>
        </div>

        <div id="pw-view" className="pw-shell"></div>

        <div className="pw-nav" id="pw-nav" hidden>
          <div className="pw-nav-in">
            <button className="pw-btn pw-btn--ghost" id="pw-back" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.6 12H4.4" />
                <path d="m10.2 6.4-5.8 5.6 5.8 5.6" />
              </svg>
              Back
            </button>
            <button className="pw-btn pw-btn--link" id="pw-later" type="button">
              Save and continue later
            </button>
            <button
              className="pw-btn pw-btn--link"
              id="pw-fill-test-nav"
              type="button"
              hidden
            >
              Fill test answers
            </button>
            <span className="pw-spacer"></span>
            <button className="pw-btn" id="pw-next" type="button">
              Continue
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.4 12h15.2" />
                <path d="m13.8 6.4 5.8 5.6-5.8 5.6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
