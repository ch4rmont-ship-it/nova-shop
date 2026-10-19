import Link from "next/link";

export function SectionHeading({ eyebrow, title, href, linkLabel = "View all" }: { eyebrow?: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="mb-6 flex items-end justify-between gap-4">
    <div>{eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2></div>
    {href ? <Link href={href} className="text-sm font-bold underline decoration-1 underline-offset-4">{linkLabel}</Link> : null}
  </div>;
}
