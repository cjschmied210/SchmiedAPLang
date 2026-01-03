export interface StudentHighlight {
    studentId: string;
    start: number;
    end: number;
}

export const ANCHOR_TEXT_ANALYTICS = `My loving people,

We have been persuaded by some that are careful of our safety, to take heed how we commit ourselves to armed multitudes, for fear of treachery; but I assure you I do not desire to live to distrust my faithful and loving people. Let tyrants fear. I have always so behaved myself that, under God, I have placed my chiefest strength and safeguard in the loyal hearts and good-will of my subjects; and therefore I am come amongst you, as you see, at this time, not for my recreation and disport, but being resolved, in the midst and heat of the battle, to live and die amongst you all; to lay down for my God, and for my kingdom, and my people, my honour and my blood, even in the dust.

I know I have the body but of a weak and feeble woman; but I have the heart and stomach of a king, and of a king of England too, and think foul scorn that Parma or Spain, or any prince of Europe, should dare to invade the borders of my realm; to which rather than any dishonour shall grow by me, I myself will take up arms, I myself will be your general, judge, and rewarder of every one of your virtues in the field.

I know already, for your forwardness you have deserved rewards and crowns; and We do assure you on the word of a prince, they shall be duly paid you. In the mean time, my lieutenant general shall be in my stead, than whom never prince commanded a more noble or worthy subject; not doubting but by your obedience to my general, by your concord in the camp, and your valour in the field, we shall shortly have a famous victory over those enemies of my God, of my kingdom, and of my people.`;

const KEY_PHRASES = [
    "weak and feeble woman",
    "heart and stomach of a king",
    "live and die amongst you all",
    "foul scorn",
    "I myself will be your general"
];

const generateMockData = (): StudentHighlight[] => {
    const highlights: StudentHighlight[] = [];
    const STUDENT_COUNT = 30;

    // Helper to find all occurrences
    const getIndices = (searchStr: string, text: string) => {
        const indices: number[] = [];
        let pos = text.indexOf(searchStr);
        while (pos > -1) {
            indices.push(pos);
            pos = text.indexOf(searchStr, pos + 1);
        }
        return indices;
    };

    KEY_PHRASES.forEach(phrase => {
        const indices = getIndices(phrase, ANCHOR_TEXT_ANALYTICS);
        indices.forEach(startIndex => {
            const endIndex = startIndex + phrase.length;

            // Assign 80% of students to these key phrases with slight jitter
            const numStudents = Math.floor(STUDENT_COUNT * 0.8);

            for (let i = 0; i < numStudents; i++) {
                // Jitter start/end by -5 to +5 characters
                const jitterStart = Math.floor(Math.random() * 10) - 5;
                const jitterEnd = Math.floor(Math.random() * 10) - 5;

                highlights.push({
                    studentId: `student-${i}`,
                    start: Math.max(0, startIndex + jitterStart),
                    end: Math.min(ANCHOR_TEXT_ANALYTICS.length, endIndex + jitterEnd)
                });
            }
        });
    });

    // Add some random noise highlights (10% of students)
    for (let i = 0; i < STUDENT_COUNT * 2; i++) {
        const start = Math.floor(Math.random() * (ANCHOR_TEXT_ANALYTICS.length - 50));
        const length = Math.floor(Math.random() * 50) + 10;
        highlights.push({
            studentId: `random-${i}`,
            start,
            end: start + length
        });
    }

    return highlights;
};

export const MOCK_HIGHLIGHTS = generateMockData();
