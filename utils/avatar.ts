export function getAvatarUrl(user: { name: string; avatar?: string | null }): string {
	if (!user) return "";
	if (user.avatar && user.avatar !== "") return user.avatar;

	// Create a simple avatar with the first letter of the name
	const name = user?.name?.trim();
	const firstLetter = name ? name[0].toUpperCase() : "?";
	const backgroundColor = stringToColor(name);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <rect width="40" height="40" fill="${backgroundColor}" rx="20"/>
        <text x="50%" y="50%" fill="#fff" font-family="Arial" font-size="20" text-anchor="middle" dy=".3em">${firstLetter}</text>
    </svg>`;

	// Encode the SVG for use in a data URL
	return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function stringToColor(str: string): string {
	if (!str) return "#000";
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash % 360);
	return `hsl(${hue}, 70%, 50%)`;
}
