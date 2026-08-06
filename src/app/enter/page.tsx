"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppNav } from "@/components/AppNav";

const ERRORS: Record<string, string> = {
  missing: "That sign-in link is incomplete. Request a new one below.",
  invalid: "That sign-in link is not valid. Request a new one below.",
  expired: "That sign-in link has expired. Request a new one below.",
  used: "That sign-in link has already been used. Request a new one below.",
};

function EnterForm() {
  const search = useSearchParams();
  const linkError = ERRORS[search.get("error") || ""] || "";

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(linkError);
  const [msg, setMsg] = useState("");
  const [devLink, setDevLink] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    setDevLink("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send the sign-in link.");
        return;
      }
      setMsg(
        data.message ||
          "We have sent a secure sign-in link to that email address. It works once and expires in 60 minutes."
      );
      if (data.devLink) setDevLink(data.devLink);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell" style={{ maxWidth: 560 }}>
      <p className="kicker">Project Alpha · test entry</p>
      <h1 className="h1">Enter the workbook</h1>
      <p className="body" style={{ marginTop: 16 }}>
        Project Alpha is by invitation. Enter the code from your invitation and the address it was
        sent to. We will email you a secure sign-in link.
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
          {busy ? "Sending…" : "Send my sign-in link"}
        </button>
        {error ? <p className="err">{error}</p> : null}
        {msg ? <p className="ok">{msg}</p> : null}
        {devLink ? (
          <p className="ok" style={{ marginTop: 12 }}>
            <strong>Dev link (no Resend key yet):</strong>{" "}
            <a href={devLink}>{devLink}</a>
          </p>
        ) : null}
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
      <AppNav active="enter" />
      <main className="page">
        <Suspense fallback={<div className="shell">Loading…</div>}>
          <EnterForm />
        </Suspense>
      </main>
    </>
  );
}
