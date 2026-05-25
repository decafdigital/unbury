export function About() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
        About Unbury
      </h2>

      <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-ink-soft">
        <p>
          Unbury was created by Kim, a web designer in Arizona who was drowning
          in debt.
        </p>
        <p>
          After struggling to find honest tools to help plan a payoff strategy,
          Kim built what was missing: a free calculator that compares
          strategies side-by-side without collecting your data or pushing
          products.
        </p>
        <p>
          Using these strategies, Kim consolidated high-interest credit cards
          and is on track to be debt-free.
        </p>
        <p>Unbury exists to help others find their path out too.</p>
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <p className="text-base text-ink-soft">
          Contact:{" "}
          <a
            href="mailto:hello@unbury.io"
            className="font-bold text-black underline decoration-2 underline-offset-2 transition-colors duration-150 hover:bg-brand-500 focus-ring"
          >
            hello@unbury.io
          </a>
        </p>
      </div>
    </div>
  );
}
