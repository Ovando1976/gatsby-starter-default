export function timeAgo(d) {
  const ms = Date.now() - d.getTime();
  const s = Math.floor(ms / 1000);
  if (s < 45) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 45) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 22) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  if (dd < 26) return `${dd}d ago`;
  return d.toLocaleString();
}
export function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(p=>p[0]).join("").toUpperCase() || "U";
}