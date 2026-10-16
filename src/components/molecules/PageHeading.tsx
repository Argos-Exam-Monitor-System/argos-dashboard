export function PageHeading({ title }: { title: string }) {
  return (
    <header className="page-heading">
      <title>{`${title} | ARGOS Dashboard`}</title>
      <div className="container page-heading-inner">
        <h1>{title}</h1>
      </div>
    </header>
  )
}
