export function formatPostDate(date: Date): string {
	const now = Date.now();
	const diff = now - date.getTime();

	if (diff < 60_000) return "just now";
	if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
	if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
	if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
	});
}
