import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const trustItems = ["Encrypted by default", "Passkey ready", "Location-aware", "One memorable ID", "Built for everyone"];

const featureCards = [
  { title: "Identity that grows with you", body: "Keep your profile, access and connections organised in one secure identity layer.", tone: "lavender" },
  { title: "Always private, always yours", body: "Choose what you share, when you share it, and keep control of every verified session.", tone: "ink" },
  { title: "Ready wherever you go", body: "A calm, reliable identity for work, community and the digital spaces you use every day.", tone: "ink" },
];

const useCases = [
  { label: "Personal identity", title: "Your digital self, beautifully organised.", image: "/images/img12.jpg" },
  { label: "Secure access", title: "A softer way to move through the internet.", image: "/images/img11.jpg" },
  { label: "Connected life", title: "Share the right details with confidence.", image: "/images/img20.jpg" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="reference-home">
      <div className="reference-shell">
        <section className="reference-hero-banner">
          <img src="/images/img20.jpg" alt="A luminous digital world" />
          <div className="reference-hero-banner-overlay" />
          <div className="reference-hero-title">
            <p>BINZEO digital identity</p>
            <h1>Where your identity feels at home.</h1>
          </div>
        </section>

        <section id="what-is-binzeo" className="reference-intro">
          <div>
            <p className="reference-kicker">What is BINZEO?</p>
            <h2>A quieter way to own your digital identity.</h2>
            <Link href={isLoggedIn ? "/dashboard/profile" : "/signup"} className="reference-button reference-button-dark reference-button-small">Explore now <span aria-hidden="true">→</span></Link>
          </div>
          <p className="reference-intro-text">BINZEO brings your profile, access and connections into one considered space. It is made to feel simple on the surface, while the protection underneath does the hard work.</p>
        </section>

        <section className="reference-feature-grid" aria-label="BINZEO benefits">
          {featureCards.map((card, index) => (
            <article key={card.title} className={`reference-feature-card reference-feature-${card.tone}`}>
              <div className="reference-card-topline"><span>0{index + 1}</span><span aria-hidden="true">↗</span></div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </section>

        <section className="reference-trust-strip" aria-label="BINZEO trust signals">
          <p>Built with care for the moments that matter.</p>
          <div>{trustItems.map((item) => <span key={item}>{item}</span>)}</div>
        </section>

        <section className="reference-usecases">
          <div className="reference-usecase-heading">
            <div><p className="reference-kicker">BINZEO in action</p><h2>Use cases</h2></div>
            <p>One identity layer for people, teams and communities that value clarity, privacy and connection.</p>
          </div>
          <div className="reference-usecase-grid">
            {useCases.map((item, index) => (
              <article key={item.label} className={`reference-usecase-card reference-usecase-${index + 1}`}>
                <div className="reference-usecase-copy">
                  <p className="reference-kicker">{item.label}</p>
                  <h3>{item.title}</h3>
                  <Link href={isLoggedIn ? "/dashboard" : "/signup"}>Learn more <span aria-hidden="true">→</span></Link>
                </div>
                <img src={item.image} alt="" />
              </article>
            ))}
          </div>
        </section>

        <section className="reference-video-banner" aria-label="BINZEO video showcase">
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/img19.jpg">
            <source src="/videos/vid3.mp4" type="video/mp4" />
          </video>
          <div className="reference-video-overlay" />
          <div className="reference-video-caption">
            <p className="reference-kicker">BINZEO in motion</p>
            <h2>Identity for the way you move.</h2>
          </div>
        </section>

        <section className="reference-bottom-cta">
          <img src="/images/img13.jpg" alt="A connected cloud data environment" />
          <div>
            <p className="reference-kicker">A better beginning</p>
            <h2>One ID. More room to be you.</h2>
            <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="reference-button reference-button-dark">{isLoggedIn ? "Go to dashboard" : "Start with BINZEO"} <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
