import Link from "next/link";

const SITE = "https://www.christianandtimbers.com/apply-for-ai-board-opportunities";

type Props = {
  active?: "home" | "admin" | "enter" | "workbook";
};

export function AppNav({ active }: Props) {
  return (
    <header className="bar">
      <div className="bar-in">
        <Link href="/" className="nav-brand">
          Project Alpha
        </Link>
        <nav className="nav-links" aria-label="App">
          <Link href="/" className={active === "home" ? "on" : undefined}>
            Home
          </Link>
          <Link href="/admin" className={active === "admin" ? "on" : undefined}>
            Admin
          </Link>
          <Link href="/enter" className={active === "enter" ? "on" : undefined}>
            Enter (test)
          </Link>
          <a href={SITE} target="_blank" rel="noopener noreferrer">
            Public page ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
