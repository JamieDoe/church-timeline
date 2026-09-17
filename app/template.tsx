// A template (unlike a layout) is re-mounted on every navigation, so the CSS
// enter animation below replays each time the route changes — giving every page
// a gentle "ink settling" transition. Kept a Server Component: the effect is
// pure CSS, no client JS needed. See node_modules/next/dist/docs — template.md.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-transition flex min-h-0 flex-1 flex-col">{children}</div>
  );
}
