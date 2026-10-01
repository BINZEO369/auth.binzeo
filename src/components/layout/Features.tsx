const features = [
  {
    title: "Secure by default",
    desc: "Enterprise-grade encryption protects your identity 24/7 with Row Level Security.",
    icon: "shield",
  },
  {
    title: "Unique BZ-U ID",
    desc: "Every user gets a unique identifier like BZ-U-XXXXXX for lifetime.",
    icon: "id",
  },
  {
    title: "Multi-sector access",
    desc: "Join multiple sectors with granular access control and permission management.",
    icon: "grid",
  },
  {
    title: "Verification built-in",
    desc: "Email, phone, and identity verification records tracked transparently.",
    icon: "check",
  },
  {
    title: "Device management",
    desc: "Track and manage every device that accesses your account.",
    icon: "device",
  },
  {
    title: "Full audit trail",
    desc: "Complete history of logins, activity, and changes — always in your control.",
    icon: "history",
  },
];

function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-5 h-5",
  };

  switch (name) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" />
        </svg>
      );
    case "id":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 10h.01M11 10h6M7 14h6M15 14h2" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "device":
      return (
        <svg {...common}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-[#1f1f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-medium text-indigo-400 tracking-wider uppercase mb-3">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything you need
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A complete identity platform with all the tools for managing your
            digital presence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-[#1f1f2e] bg-[#12121a]/50 hover:border-indigo-500/40 hover:bg-[#12121a] transition-all hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
                <Icon name={f.icon} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
