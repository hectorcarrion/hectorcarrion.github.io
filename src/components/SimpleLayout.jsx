export function SimpleLayout({ title, intro, children }) {
  return (
    <div className="site-container pt-28 pb-8">
      <header className="max-w-2xl">
        <h1
          className="text-4xl sm:text-5xl"
          style={{
            fontFamily: 'var(--font-serif)',
            lineHeight: 1.05,
            color: 'var(--text)',
          }}
        >
          {title}
        </h1>
        {intro && (
          <p className="mt-5 text-base leading-relaxed text-[var(--text-2)]">
            {intro}
          </p>
        )}
      </header>
      <div className="mt-12 sm:mt-14">{children}</div>
    </div>
  )
}
