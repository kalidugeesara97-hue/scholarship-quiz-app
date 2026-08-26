import { QuizData } from "./gemini";

export const DEFAULT_QUIZZES: Record<string, { subject: string; topic: string; subjectEmoji: string; questions: QuizData["questions"] }> = {
  "පරිසරය": {
    subject: "පරිසරය",
    topic: "ශ්‍රී ලංකාවේ ජාතික සංකේත හා භූගෝලය",
    subjectEmoji: "🌿",
    questions: [
      {
        id: 1,
        question: "ශ්‍රී ලංකාවේ උසම කන්ද කුමක්ද?",
        options: ["පිදුරුතලාගල කන්ද", "ශ්‍රී පාද කන්ද", "හක්ගල කන්ද"],
        correctAnswer: 0,
        explanation: "ශ්‍රී ලංකාවේ උසම කන්ද වන්නේ නුවරඑළිය දිස්ත්‍රික්කයේ පිහිටි මීටර් 2,524 ක් උස පිදුරුතලාගල කන්දයි."
      },
      {
        id: 2,
        question: "ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය කුමක්ද?",
        options: ["ඇසතු බෝ රුක", "නා ගස", "කොස් ගස"],
        correctAnswer: 1,
        explanation: "ශ්‍රී ලංකාවේ ජාතික වෘක්ෂය ලෙස නම් කර ඇත්තේ නා ගසයි (Mesua ferrea)."
      },
      {
        id: 3,
        question: "ශ්‍රී ලංකාවේ දිගම ගංගාව කුමක්ද?",
        options: ["කැළණි ගඟ", "කළු ගඟ", "මහවැලි ගඟ"],
        correctAnswer: 2,
        explanation: "ශ්‍රී ලංකාවේ දිගම ගංගාව කිලෝමීටර් 335ක් දිග මහවැලි ගඟයි."
      },
      {
        id: 4,
        question: "ශ්‍රී ලංකාවේ ජාතික පුෂ්පය කුමක්ද?",
        options: ["නිල් මානෙල් මල", "ඕලු මල", "නෙළුම් මල"],
        correctAnswer: 0,
        explanation: "ශ්‍රී ලංකාවේ ජාතික පුෂ්පය වන්නේ නිල් මානෙල් මලයි."
      },
      {
        id: 5,
        question: "ශ්‍රී ලංකාවේ ජාතික පක්ෂියා කවුද?",
        options: ["ලංකා ගිරවා", "වලිකුකුළා", "හබන් කුකුළා"],
        correctAnswer: 1,
        explanation: "ශ්‍රී ලංකාවේ ජාතික පක්ෂියා ලෙස නම් කර ඇත්තේ ලංකා වලිකුකුළා (Ceylon Junglefowl) ය."
      }
    ]
  },
  "සිංහල": {
    subject: "සිංහල",
    topic: "පර්යාය පද සහ ව්‍යාකරණ",
    subjectEmoji: "📖",
    questions: [
      {
        id: 1,
        question: "'සූර්යයා' යන වචනයට සමාන අර්ථයක් දෙන පදය කුමක්ද?",
        options: ["දිනකර", "චන්ද්‍රයා", "තාරකා"],
        correctAnswer: 0,
        explanation: "'සූර්යයා' යන වචනයට දිනකර, හිරු, ආදිත්‍ය, රිවි යන පද සමාන අර්ථ දෙයි."
      },
      {
        id: 2,
        question: "'අඳුර' යන වචනයේ විරුද්ධ පදය කුමක්ද?",
        options: ["කලුවර", "එළිය", "රාත්‍රිය"],
        correctAnswer: 1,
        explanation: "'අඳුර' යන්නෙහි ප්‍රතිවිරුද්ධ අර්ථය 'එළිය' හෝ 'ආලෝකය' වේ."
      },
      {
        id: 3,
        question: "නිවැරදි අක්ෂර වින්‍යාසය සහිත වචනය තෝරන්න:",
        options: ["ප්‍රවීන", "ප්‍රවීණ", "ප්‍රවිණ"],
        correctAnswer: 1,
        explanation: "නිවැරදි අක්ෂර වින්‍යාසය 'ප්‍රවීණ' (මූර්ධජ ණ සහිතව) වේ."
      },
      {
        id: 4,
        question: "'ළමයි සතුටින් සෙල්ලම් කරති' යන වාක්‍යයේ උක්ත පදය කුමක්ද?",
        options: ["ළමයි", "සතුටින්", "සෙල්ලම් කරති"],
        correctAnswer: 0,
        explanation: "ක්‍රියාව කරන ප්‍රධාන පාර්ශ්වය වන 'ළමයි' යන්න මෙහි උක්ත පදයයි."
      },
      {
        id: 5,
        question: "'වෘක්ෂය' යන්නෙහි බහුවචන පදය කුමක්ද?",
        options: ["වෘක්ෂ", "වෘක්ෂයෝ", "වෘක්ෂයන්"],
        correctAnswer: 0,
        explanation: "'වෘක්ෂය' යන අචේතනික නාම පදයේ බහුවචනය 'වෘක්ෂ' වේ."
      }
    ]
  },
  "ගණිතය": {
    subject: "ගණිතය",
    topic: "සංඛ්‍යා රටා සහ මූලික ගණිත ගැටලු",
    subjectEmoji: "➕",
    questions: [
      {
        id: 1,
        question: "3, 6, 9, 12, ... හි මීළඟ සංඛ්‍යාව කුමක්ද?",
        options: ["14", "15", "16"],
        correctAnswer: 1,
        explanation: "මෙය 3 බැගින් වැඩිවන සංඛ්‍යා රටාවකි. 12 + 3 = 15 වේ."
      },
      {
        id: 2,
        question: "පැය 1ක ඇති මිනිත්තු ගණන කීයද?",
        options: ["මිනිත්තු 50", "මිනිත්තු 60", "මිනිත්තු 100"],
        correctAnswer: 1,
        explanation: "පැය 1කට මිනිත්තු 60ක් අඩංගු වේ."
      },
      {
        id: 3,
        question: "රුපියල් 50 කින් රුපියල් 18 ක් අඩු කළ විට ඉතිරි මුදල කීයද?",
        options: ["රුපියල් 32", "රුපියල් 38", "රුපියල් 42"],
        correctAnswer: 0,
        explanation: "රුපියල් 50 - රුපියල් 18 = රුපියල් 32 කි."
      },
      {
        id: 4,
        question: "සමචතුරස්‍රයක ඇති පැති ගණන කීයද?",
        options: ["පැති 3", "පැති 4", "පැති 5"],
        correctAnswer: 1,
        explanation: "සමචතුරස්‍රයක දිගින් සමාන පැති 4ක් ඇත."
      },
      {
        id: 5,
        question: "පොත් 4 ක මිල රුපියල් 200 ක් නම්, එක් පොතක මිල කීයද?",
        options: ["රුපියල් 40", "රුපියල් 50", "රුපියල් 60"],
        correctAnswer: 1,
        explanation: "රුපියල් 200 ÷ 4 = රුපියල් 50 කි."
      }
    ]
  },
  "සාමාන්‍ය බුද්ධිය": {
    subject: "සාමාන්‍ය බුද්ධිය",
    topic: "තර්කනය සහ රටා හඳුනාගැනීම",
    subjectEmoji: "🧠",
    questions: [
      {
        id: 1,
        question: "නොගැළපෙන වචනය තෝරන්න:",
        options: ["අඹ", "කෙසෙල්", "කැරට්"],
        correctAnswer: 2,
        explanation: "අඹ සහ කෙසෙල් පලතුරු වන අතර කැරට් එළවළුවකි."
      },
      {
        id: 2,
        question: "අද බදාදා නම්, අනිද්දා දිනය කුමක්ද?",
        options: ["බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"],
        correctAnswer: 1,
        explanation: "අද බදාදා නම් හෙට බ්‍රහස්පතින්දා වන අතර, අනිද්දා සිකුරාදා වේ."
      },
      {
        id: 3,
        question: "කුරුල්ලා : පියාපත් :: මත්ස්‍යයා : ?",
        options: ["කරමල්", "වරල්", "කොරපොතු"],
        correctAnswer: 1,
        explanation: "කුරුල්ලා පිහිනන්නේ/පියාඹන්නේ පියාපත් ආධාරයෙනි. මත්ස්‍යයා පිහිනන්නේ වරල් ආධාරයෙනි."
      },
      {
        id: 4,
        question: "A, C, E, G, ... හි ඊළඟ අකුර කුමක්ද?",
        options: ["H", "I", "J"],
        correctAnswer: 1,
        explanation: "එක් අකුරක් හැර එක් අකුරක් ඉදිරියට යයි. G ට පසු H හැර I වේ."
      },
      {
        id: 5,
        question: "පැන්සල් 5ක් පෙට්ටියක තැබීමට විනාඩි 2ක් ගතවේ නම්, පෙට්ටි 3කට පැන්සල් තැබීමට ගතවන මුළු කාලය කීයද?",
        options: ["විනාඩි 5", "විනාඩි 6", "විනාඩි 10"],
        correctAnswer: 1,
        explanation: "එක් පෙට්ටියකට විනාඩි 2 බැගින් පෙට්ටි 3කට 2 × 3 = විනාඩි 6ක් ගතවේ."
      }
    ]
  }
};

export function getDefaultQuiz(subject?: string): { date: string; subject: string; topic: string; subjectEmoji: string; questions: QuizData["questions"] } {
  const today = new Date().toISOString().split("T")[0];
  const keys = Object.keys(DEFAULT_QUIZZES);
  const chosenKey = subject && DEFAULT_QUIZZES[subject] ? subject : keys[Math.floor(Date.now() / 86400000) % keys.length];
  const q = DEFAULT_QUIZZES[chosenKey];

  return {
    date: today,
    subject: q.subject,
    topic: q.topic,
    subjectEmoji: q.subjectEmoji,
    questions: q.questions,
  };
}
