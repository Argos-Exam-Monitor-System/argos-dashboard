export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="avatar" aria-hidden="true">
      {initials}
    </span>
  )
}
