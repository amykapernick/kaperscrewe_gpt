import { saveMemory } from './contextManager';

const seedData = [
	`User asked for a summary of overdue tasks while procrastinating aggressively.`,
	`Daily status was generated with unnecessary sarcasm—mission success.`,
	`ToDoist sync failed due to cosmic indifference (or a 401 error).`,
	`System prompt updated to reflect user’s growing megalomania.`,
];

async function seed() {
	for (const item of seedData) {
		await saveMemory(item);
		console.log(`Seeded: ${item}`);
	}
}

seed().then(() => {
	console.log(`🌱 Seeding complete.`);
	process.exit(0);
});
