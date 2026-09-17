import Link from "next/link";

const SITE = "https://www.christianandtimbers.com/project-alpha-board-readiness";

type Props = {
  active?: "home" | "admin" | "admin-learning" | "enter" | "workbook" | "portal" | "learning";
  /** Participant-facing pages hide Admin / internal links. */
  variant?: "internal" | "participant";
};

export function AppNav({ active, variant = "internal" }: Props) {
  const participant = variant === "participant";

  return (
    <header className="bar">
      <div className="bar-in">
        <Link href={participant ? "/portal" : "/"} className="nav-brand">
          Project Alpha
        </Link>
        {participant ? (
          <nav className="nav-links" aria-label="App">
            <Link href="/portal" className={active === "portal" ? "on" : undefined}>
              Portal
            </Link>
            <Link href="/portal/learning" className={active === "learning" ? "on" : undefined}>
              Learning
            </Link>
            <Link href="/workbook" className={active === "workbook" ? "on" : undefined}>
              Workbook
            </Link>
            <a href={SITE} target="_blank" rel="noopener noreferrer">
              Programme page ↗
            </a>
          </nav>
        ) : (
          <nav className="nav-links" aria-label="App">
            <Link href="/" className={active === "home" ? "on" : undefined}>
              Home
            </Link>
            <Link href="/admin" className={active === "admin" ? "on" : undefined}>
              Admin
            </Link>
            <Link href="/admin/learning" className={active === "admin-learning" ? "on" : undefined}>
              Learning
            </Link>
            <a href={SITE} target="_blank" rel="noopener noreferrer">
              Public page ↗
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
