import topicsData from "../../data/topics.json";

export interface TodayTopic {
  subject: string;
  topic: string;
  subjectEmoji: string;
}

const subjectEmojis: Record<string, string> = {
  "පරිසරය": "🌿",
  "සිංහල": "📖",
  "ගණිතය": "➕",
  "සාමාන්‍ය බුද්ධිය": "🧠",
};

const subjects = Object.keys(topicsData) as (keyof typeof topicsData)[];

/**
 * Deterministically selects today's subject and topic based on the date.
 * Rotates through all subjects and their topics in a cycle.
 */
export function getTodayTopic(dateOverride?: string): TodayTopic {
  const today = dateOverride || new Date().toISOString().split("T")[0];

  // Create a day number from the date (days since epoch)
  const date = new Date(today);
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));

  // Build a flat list of all (subject, topic) pairs for rotation
  const allTopics: { subject: string; topic: string }[] = [];
  for (const subject of subjects) {
    const topics = topicsData[subject] as string[];
    for (const topic of topics) {
      allTopics.push({ subject: subject as string, topic });
    }
  }

  // Use modulo to cycle through all topics
  const index = daysSinceEpoch % allTopics.length;
  const selected = allTopics[index];

  return {
    subject: selected.subject,
    topic: selected.topic,
    subjectEmoji: subjectEmojis[selected.subject] || "📚",
  };
}

/**
 * Get topic info for a specific date (for display purposes)
 */
export function getTopicForDate(dateStr: string): TodayTopic {
  return getTodayTopic(dateStr);
}

/**
 * Get the full topic rotation schedule for the next N days
 */
export function getUpcomingSchedule(days: number = 7): (TodayTopic & { date: string })[] {
  const schedule: (TodayTopic & { date: string })[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const topic = getTodayTopic(dateStr);
    schedule.push({ ...topic, date: dateStr });
  }

  return schedule;
}
