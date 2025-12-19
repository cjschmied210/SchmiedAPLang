import React, { useMemo } from 'react';
import { MOCK_HIGHLIGHTS, ANCHOR_TEXT_ANALYTICS } from '../../features/analytics/mockData';

const TextHeatmap: React.FC = () => {
    // 1. Calculate Heat Map Array
    const heatScores = useMemo(() => {
        const scores = new Array(ANCHOR_TEXT_ANALYTICS.length).fill(0);

        MOCK_HIGHLIGHTS.forEach(({ start, end }) => {
            // Clamp
            const s = Math.max(0, start);
            const e = Math.min(ANCHOR_TEXT_ANALYTICS.length, end);
            for (let i = s; i < e; i++) {
                scores[i]++;
            }
        });
        return scores;
    }, []);

    // 2. Chunk text by score to minimize DOM nodes
    const chunks = useMemo(() => {
        const result: { text: string; score: number; startIdx: number }[] = [];
        if (ANCHOR_TEXT_ANALYTICS.length === 0) return result;

        let currentScore = heatScores[0];
        let currentText = ANCHOR_TEXT_ANALYTICS[0];
        let startIdx = 0;

        for (let i = 1; i < ANCHOR_TEXT_ANALYTICS.length; i++) {
            const char = ANCHOR_TEXT_ANALYTICS[i];
            const score = heatScores[i];

            if (score === currentScore) {
                currentText += char;
            } else {
                result.push({ text: currentText, score: currentScore, startIdx });
                currentScore = score;
                currentText = char;
                startIdx = i;
            }
        }
        // Push last chunk
        result.push({ text: currentText, score: currentScore, startIdx });

        return result;
    }, [heatScores]);

    // 3. Helper for color
    const getHeatColor = (score: number) => {
        if (score === 0) return 'transparent';
        if (score < 5) return '#FEF3C7'; // Amber 100
        if (score < 15) return '#FCD34D'; // Amber 300
        if (score < 25) return '#F59E0B'; // Amber 500
        return '#EF4444'; // Red 500
    };

    return (
        <div className="font-serif text-lg leading-loose whitespace-pre-wrap max-w-3xl mx-auto p-8 bg-white shadow-sm border border-gray-100 rounded-xl">
            {chunks.map((chunk, idx) => (
                <span
                    key={idx}
                    className="relative group cursor-default transition-colors duration-300"
                    style={{
                        backgroundColor: getHeatColor(chunk.score),
                        color: chunk.score > 24 ? 'white' : 'inherit'
                    }}
                >
                    {chunk.text}
                    {/* Tooltip on Hover */}
                    {chunk.score > 0 && (
                        <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap z-50 transition-opacity">
                            {chunk.score} students
                        </span>
                    )}
                </span>
            ))}
        </div>
    );
};

export default TextHeatmap;
