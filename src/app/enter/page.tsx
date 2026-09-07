"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppNav } from "@/components/AppNav";

const ERRORS: Record<string, string> = {
  missing: "That resume link is incomplete. Enter your code below.",
  invalid: "That resume link is not valid. Enter your code below.",
  expired: "That resume link has expired. Enter your code below.",
  used: "That sign-in link was already used. Enter your code below to open the workbook again.",
};

function resolveNext(search: URLSearchParams, loginMode: boolean): "portal" | "workbook" {
  const next = search.get("next");
  if (next === "workbook" || next === "portal") return next;
  return loginMode ? "portal" : "workbook";
}

function EnterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const linkError = ERRORS[search.get("error") || ""] || "";
  const loginMode = search.get("mode") === "login";
  const nextDest = resolveNext(search, loginMode);

  const [code, setCode] = useState(search.get("code") || "");
  const [email, setEmail] = useState(search.get("email") || "");
  const [error, setError] = useState(linkError);
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  async function submitEntry(nextCode: string, nextEmail: string, destination: "portal" | "workbook") {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: nextCode, email: nextEmail, next: destination }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not sign you in.");
        return;
      }
      router.push(data.redirect || `/${destination}`);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "same-origin" });
        if (!res.ok) {
          if (!cancelled) setCheckingSession(false);
          return;
        }
        const data = await res.json();
        if (!cancelled && data.authenticated) {
          router.replace(`/${nextDest}`);
          return;
        }
        if (!cancelled) setCheckingSession(false);
      } catch {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, nextDest]);

  useEffect(() => {
    if (checkingSession) return;
    const qCode = search.get("code");
    const qEmail = search.get("email");
    if (qCode && qEmail && !linkError) {
      void submitEntry(qCode, qEmail, nextDest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingSession]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submitEntry(code, email, nextDest);
  }

  if (checkingSession) {
    return (
      <div className="shell" style={{ maxWidth: 560 }}>
        <p className="body">Checking your session…</p>
      </div>
    );
  }

  return (
    <div className="shell" style={{ maxWidth: 560 }}>
      <p className="kicker">Project Alpha · {loginMode ? "login" : "entry"}</p>
      <h1 className="h1">{loginMode ? "Log in to your portal" : "Enter the workbook"}</h1>
      <p className="body" style={{ marginTop: 16 }}>
        {loginMode
          ? "Use the invitation code and email address from your Project Alpha invitation. You will open your participant portal — stage, documents, and resources."
          : "Project Alpha is by invitation. Enter the code from your invitation and the address it was sent to, then open your workbook."}
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 28 }}>
        <div className="field">
          <label htmlFor="code">Invitation code</label>
          <input
            id="code"
            name="code"
            autoComplete="one-time-code"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Opening…" : loginMode ? "Login" : "Open workbook"}
        </button>
        {error ? <p className="err">{error}</p> : null}
        <p className="enter-alt">
          {loginMode ? (
            <>
              Starting your workbook?{" "}
              <Link href="/enter">Open with your invitation code</Link>
            </>
          ) : (
            <>
              I have an account —{" "}
              <Link href="/enter?mode=login">Log in to your portal</Link>
            </>
          )}
        </p>
        <p className="body" style={{ marginTop: 22, fontSize: 14 }}>
          Mislaid your code? Write to{" "}
          <a href="mailto:projectalpha@christian-timbers.com">projectalpha@christian-timbers.com</a>.
        </p>
      </form>
    </div>
  );
}

export default function EnterPage() {
  return (
    <>
      <AppNav active="enter" variant="participant" />
      <main className="page">
        <Suspense fallback={<div className="shell">Loading…</div>}>
          <EnterForm />
        </Suspense>
      </main>
    </>
  );
}
