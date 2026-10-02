const steps = [
  {
    n: "01",
    t: "Create your account",
    d: "Sign up in seconds with just your email. Get your unique BZ-U ID instantly.",
  },
  {
    n: "02",
    t: "Complete your profile",
    d: "Add your details, choose your country, and join sectors that matter to you.",
  },
  {
    n: "03",
    t: "Share securely",
    d: "Share your public profile link with anyone. Full control, always yours.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28 border-t border-[#d5dfdd]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-medium text-[#216f9e] tracking-wider uppercase mb-3">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Three simple steps
          </h2>
          <p className="text-[#5c6b70] max-w-xl mx-auto">
            Get started in less than a minute.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#78c3e4]/50 to-transparent -translate-x-8" />
              )}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#78c3e4]/20 to-[#3f86b2]/10 border border-[#9bd7c7] flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-[#216f9e]">
                  {s.n}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#101820] mb-2">{s.t}</h3>
              <p className="text-sm text-[#5c6b70] leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
