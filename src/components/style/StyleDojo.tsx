import React, { useState } from 'react';
import { Check, AlertCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

interface Challenge {
    id: number;
    stems: string[];
    targetSkill: string;
    hint: string;
    description: string;
    validator: (input: string) => boolean;
}

const CHALLENGES: Challenge[] = [
    {
        id: 1,
        stems: ["The dog barked.", "The dog was loud.", "It was midnight."],
        targetSkill: "Participial Phrase",
        description: "Combine these sentences by turning the action of the dog into an introductory phrase.",
        hint: "Try starting your sentence with 'Barking...'",
        validator: (input: string) => /^\s*Barking/i.test(input)
    },
    {
        id: 2,
        stems: ["She studied hard.", "She wanted to pass.", "The test was difficult."],
        targetSkill: "Subordinating Conjunction (Although/Because)",
        description: "Combine these sentences to show the relationship between her effort and the difficulty.",
        hint: "Start with 'Although' or 'Because' to create a complex sentence.",
        validator: (input: string) => /^\s*(Although|Because)/i.test(input)
    },
    {
        id: 3,
        stems: ["The general commanded respect.", "The general was old.", "The general was battle-scarred."],
        targetSkill: "Appositive Phrase",
        description: "Combine these sentences by renaming the general inside the sentence.",
        hint: "Try: 'The general, an old and battle-scarred veteran,...'",
        validator: (input: string) => /The general,\s+[^,]+,/i.test(input)
    }
];

const StyleDojo: React.FC = () => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [xp, setXp] = useState(0);

    const challenge = CHALLENGES[currentLevel];
    const isFinished = currentLevel >= CHALLENGES.length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (challenge.validator(input)) {
            setFeedback('SUCCESS');
            setXp(prev => prev + 10);
        } else {
            setFeedback('ERROR');
        }
    };

    const handleNext = () => {
        setFeedback('IDLE');
        setInput('');
        setCurrentLevel(prev => prev + 1);
    };

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-full text-center">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <Trophy size={48} className="text-yellow-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Grandmaster Status Achieved</h2>
                <p className="text-gray-600 mb-8">You have completed all style challenges. Your syntactic maturity is growing.</p>
                <div className="text-xl font-bold text-indigo-600 mb-8">Total XP: {xp}</div>
                <button
                    onClick={() => { setCurrentLevel(0); setXp(0); }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Restart Training
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 h-full flex flex-col items-center justify-center">

            {/* Header / Progress */}
            <div className="w-full flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Style Dojo
                        <span className="text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            Level {currentLevel + 1}
                        </span>
                    </h2>
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    XP: <span className="text-indigo-600">{xp}</span>
                </div>
            </div>

            {/* Challenge Card */}
            <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    <div className="uppercase tracking-widest text-xs font-bold text-indigo-400 mb-2">Target Skill</div>
                    <h3 className="text-3xl font-serif mb-4">{challenge.targetSkill}</h3>
                    <p className="text-slate-300">{challenge.description}</p>
                </div>

                <div className="p-8">
                    {/* Stems */}
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-3">Combine these stems:</div>
                        <ul className="space-y-3">
                            {challenge.stems.map((stem, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-lg text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs text-gray-400 shadow-sm">{idx + 1}</div>
                                    {stem}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    if (feedback !== 'IDLE') setFeedback('IDLE');
                                }}
                                disabled={feedback === 'SUCCESS'}
                                placeholder="Type your combined sentence here..."
                                className={`w-full p-4 text-xl font-serif border-2 rounded-xl focus:ring-0 transition-all resize-none ${feedback === 'SUCCESS' ? 'border-green-500 bg-green-50 text-green-900' :
                                        feedback === 'ERROR' ? 'border-red-300 bg-red-50' :
                                            'border-gray-200 focus:border-indigo-500'
                                    }`}
                                rows={3}
                            />

                            {/* Feedback Icons */}
                            {feedback === 'SUCCESS' && (
                                <div className="absolute top-4 right-4 text-green-600 animate-bounce">
                                    <Check size={28} />
                                </div>
                            )}
                            {feedback === 'ERROR' && (
                                <div className="absolute top-4 right-4 text-red-500" title={challenge.hint}>
                                    <AlertCircle size={28} />
                                </div>
                            )}
                        </div>

                        {/* Actions / Hint */}
                        <div className="flex items-center justify-between">
                            <div className="h-6">
                                {feedback === 'ERROR' && (
                                    <span className="text-red-500 text-sm font-medium animate-pulse flex items-center gap-2">
                                        Hint: {challenge.hint}
                                    </span>
                                )}
                                {feedback === 'SUCCESS' && (
                                    <span className="text-green-600 text-sm font-medium flex items-center gap-2">
                                        Perfection! +10 XP
                                    </span>
                                )}
                            </div>

                            {feedback === 'SUCCESS' ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    Next Challenge <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Check Answer
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StyleDojo;
