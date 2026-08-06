import Link from "next/link";

const SITE = "https://www.christianandtimbers.com/apply-for-ai-board-opportunities";

type Props = {
  active?: "home" | "admin" | "enter" | "workbook";
  /** Participant-facing pages hide Admin / internal links. */
  variant?: "internal" | "participant";
};

export function AppNav({ active, variant = "internal" }: Props) {
  const participant = variant === "participant";

  return (
    <header className="bar">
      <div className="bar-in">
        <Link href={participant ? SITE : "/"} className="nav-brand">
          Project Alpha
        </Link>
        {participant ? (
          <nav className="nav-links" aria-label="App">
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
            <a href={SITE} target="_blank" rel="noopener noreferrer">
              Public page ↗
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
