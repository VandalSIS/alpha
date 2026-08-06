import Link from "next/link";
import { AppNav } from "@/components/AppNav";

export default function HomePage() {
  return (
    <>
      <AppNav active="home" />
      <main className="page">
        <div className="shell">
          <p className="kicker">A Christian &amp; Timbers Initiative</p>
          <h1 className="h1">Project Alpha</h1>
          <p className="body" style={{ marginTop: 18, maxWidth: "46ch" }}>
            Board Aspiration and Readiness Workbook. Participation is by invitation.
          </p>
          <p style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn" href="/admin">
              Open admin
            </Link>
            <Link
              className="btn"
              href="/enter"
              style={{ background: "transparent", color: "var(--ink)" }}
            >
              Enter (test)
            </Link>
          </p>
          <p className="body" style={{ marginTop: 40, fontSize: 14 }}>
            Public programme page (Webflow):{" "}
            <a href="https://www.christianandtimbers.com/apply-for-ai-board-opportunities">
              apply-for-ai-board-opportunities
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
