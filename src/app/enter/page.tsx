"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppNav } from "@/components/AppNav";

const ERRORS: Record<string, string> = {
  missing: "That resume link is incomplete. Enter your code below.",
  invalid: "That resume link is not valid. Enter your code below.",
  expired: "That resume link has expired. Enter your code below.",
  used: "That sign-in link was already used. Enter your code below to open the workbook again.",
};

function EnterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const linkError = ERRORS[search.get("error") || ""] || "";

  const [code, setCode] = useState(search.get("code") || "");
  const [email, setEmail] = useState(search.get("email") || "");
  const [error, setError] = useState(linkError);
  const [busy, setBusy] = useState(false);

  async function openWorkbook(nextCode: string, nextEmail: string) {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: nextCode, email: nextEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not open the workbook.");
        return;
      }
      router.push(data.redirect || "/workbook");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const qCode = search.get("code");
    const qEmail = search.get("email");
    if (qCode && qEmail && !linkError) {
      void openWorkbook(qCode, qEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await openWorkbook(code, email);
  }

  return (
    <div className="shell" style={{ maxWidth: 560 }}>
      <p className="kicker">Project Alpha · entry</p>
      <h1 className="h1">Enter the workbook</h1>
      <p className="body" style={{ marginTop: 16 }}>
        Project Alpha is by invitation. Enter the code from your invitation and the address it was
        sent to. You can return with the same code whenever you need.
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
          {busy ? "Opening…" : "Open workbook"}
        </button>
        {error ? <p className="err">{error}</p> : null}
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
