import pastPaperData from "../../data/past-paper-samples.json";

/**
 * Get past paper sample patterns for a given subject and topic.
 * Returns formatted string for the Gemini prompt.
 */
export function getPastPaperSamples(subject: string, topic: string): string {
  const subjectData = pastPaperData[subject as keyof typeof pastPaperData];
  if (!subjectData) {
    return getGenericPatterns(subject);
  }

  const topicData = subjectData[topic as keyof typeof subjectData];
  if (!topicData || !Array.isArray(topicData)) {
    // Try to find a closely related topic
    const relatedKey = Object.keys(subjectData).find(
      (key) => topic.includes(key) || key.includes(topic)
    );
    if (relatedKey) {
      const related = subjectData[relatedKey as keyof typeof subjectData];
      if (Array.isArray(related)) {
        return formatSamples(related);
      }
    }
    return getGenericPatterns(subject);
  }

  return formatSamples(topicData);
}

interface PastPaperSample {
  pattern: string;
  examples?: string[];
  difficulty?: string;
}

function formatSamples(samples: PastPaperSample[]): string {
  return samples
    .map((sample, i) => {
      let text = `රටාව ${i + 1}: ${sample.pattern}`;
      if (sample.examples && sample.examples.length > 0) {
        text += "\nඋදාහරණ:\n" + sample.examples.map((ex) => `  - ${ex}`).join("\n");
      }
      if (sample.difficulty) {
        text += `\nදුෂ්කරතා මට්ටම: ${sample.difficulty}`;
      }
      return text;
    })
    .join("\n\n");
}

function getGenericPatterns(subject: string): string {
  const genericPatterns: Record<string, string> = {
    "පරිසරය": `රටාව 1: ශ්‍රී ලංකාවේ භූගෝලීය/ඓතිහාසික/සංස්කෘතික කරුණු හඳුනාගැනීමේ MCQ ප්‍රශ්න
උදාහරණ:
  - ශ්‍රී ලංකාවේ [විශේෂත්වය] කුමක්ද? (අ) [පිළිතුර 1] (ආ) [පිළිතුර 2] (ඇ) [පිළිතුර 3]
  - [ස්ථානය/සිද්ධිය] පිහිටා ඇත්තේ [කොතැනද/කවදාද]?
දුෂ්කරතා මට්ටම: easy-medium`,

    "සිංහල": `රටාව 1: ව්‍යාකරණ/වාක්‍ය/පද සම්බන්ධ MCQ ප්‍රශ්න
උදාහරණ:
  - දී ඇති වචනයට [පර්යාය/විරුද්ධ] පදය තෝරන්න
  - වාක්‍යයේ [නාම/ක්‍රියා/විශේෂණ] පදය හඳුනාගන්න
දුෂ්කරතා මට්ටම: easy-medium`,

    "ගණිතය": `රටාව 1: ගණිත ගැටලු සහ ගණනය කිරීමේ MCQ ප්‍රශ්න
උදාහරණ:
  - [සංඛ්‍යා ගැටලුව] = ? (අ) [පිළිතුර 1] (ආ) [පිළිතුර 2] (ඇ) [පිළිතුර 3]
  - [ප්‍රායෝගික ගැටලුව] විසඳන්න
දුෂ්කරතා මට්ටම: easy-medium`,

    "සාමාන්‍ය බුද්ධිය": `රටාව 1: තාර්කික/රූප/අනුක්‍රම හඳුනාගැනීමේ MCQ ප්‍රශ්න
උදාහරණ:
  - [අනුක්‍රමය]... ? මීළඟ [සංඛ්‍යාව/අකුර] කුමක්ද?
  - නොගැළපෙන එක තෝරන්න: (අ) [A] (ආ) [B] (ඇ) [C]
දුෂ්කරතා මට්ටම: easy-medium`,
  };

  return genericPatterns[subject] || genericPatterns["පරිසරය"];
}
