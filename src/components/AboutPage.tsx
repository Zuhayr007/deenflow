import { Link } from "@tanstack/react-router";
import Page from "./Page";
import { ABOUT } from "@/lib/about-content";
export default function AboutPage({ topic }: { topic: keyof typeof ABOUT }) {
  const data = ABOUT[topic];
  const email = import.meta.env.VITE_CONTACT_EMAIL;
  const showSectionNav = topic !== "about" && topic !== "privacy";

  return (
    <Page title={data.title}>
      <div className="flex flex-wrap items-center gap-3 text-sm text-primary">
        <Link to="/" className="inline-flex items-center gap-1">
          ← Back
        </Link>
        {topic !== "about" && <Link to="/about">About</Link>}
        {topic !== "privacy" && <Link to="/about/privacy">Privacy</Link>}
      </div>
      {showSectionNav && (
        <nav className="flex flex-wrap gap-3 text-sm text-primary">
          {Object.entries(ABOUT).map(([key, value]) => (
            <a key={key} href={key === "about" ? "/about" : "/about/" + key}>
              {value.title}
            </a>
          ))}
        </nav>
      )}
      {data.paragraphs.map((p) => (
        <p className="text-sm leading-relaxed" key={p}>
          {p}
        </p>
      ))}
      {topic === "sources" && (
        <div className="space-y-3 text-primary text-sm">
          <a className="block" href="https://alquran.cloud/api">
            AlQuran Cloud API and editions ↗
          </a>
          <a className="block" href="https://sunnah.com/abudawud:5082">
            Abu Dawud 5082 ↗
          </a>
          <a className="block" href="https://sunnah.com/bukhari:6405">
            Bukhari 6405 ↗
          </a>
          <a className="block" href="https://github.com/batoulapps/adhan-js">
            Adhan calculation library ↗
          </a>
        </div>
      )}
      {topic === "contact" &&
        (email ? (
          <a
            className="action"
            href={"mailto:" + email + "?subject=DeenFlow%20correction"}
          >
            Send a correction
          </a>
        ) : (
          <p className="panel text-sm">
            A public contact address has not been published yet. Please report
            corrections to the person who shared DeenFlow with you.
          </p>
        ))}
    </Page>
  );
}
