import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const SITE = "https://www.christianandtimbers.com/apply-for-ai-board-opportunities";

export default function HomePage() {
  return (
    <>
      <AppNav active="home" />
      <main className="page">
        <div className="shell">
          <p className="kicker">A Christian &amp; Timbers Initiative</p>
          <h1 className="h1">Project Alpha</h1>
          <p className="body" style={{ marginTop: 18, maxWidth: "46ch" }}>
            Internal hub for the Board Aspiration and Readiness Workbook. Participants enter from
            the public programme page.
          </p>
          <p style={{ marginTop: 28 }}>
            <Link className="btn" href="/admin">
              Open admin
            </Link>
          </p>
          <p className="body" style={{ marginTop: 40, fontSize: 14 }}>
            Public entry (Webflow):{" "}
            <a href={SITE} target="_blank" rel="noopener noreferrer">
              apply-for-ai-board-opportunities
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
