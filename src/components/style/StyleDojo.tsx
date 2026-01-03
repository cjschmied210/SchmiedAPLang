import React, { useState, useMemo } from 'react';
import { Check, AlertCircle, ArrowRight, Trophy, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { ANCHOR_TEXT_ANALYTICS } from '../../features/analytics/mockData';

interface Challenge {
    id: number;
    originalSentence: string;
    stems: string[];
    context: string;
    targetEffect: string;
}

// 1. CONTEXT-AWARE: We extract these directly from the Queen Elizabeth Text
const LIVE_CHALLENGES: Challenge[] = [
    {
        id: 1,
        originalSentence: "I have the body but of a weak and feeble woman; but I have the heart and stomach of a king.",
        stems: [
            "I have the body of a weak woman.",
            "I have the body of a feeble woman.",
            "I have the heart of a king.",
            "I have the stomach of a king."
        ],
        context: "Elizabeth is addressing troops who doubt her ability to lead in war.",
        targetEffect: "Create a contrast between physical appearance and inner strength."
    },
    {
        id: 2,
        originalSentence: "I myself will be your general, judge, and rewarder of every one of your virtues in the field.",
        stems: [
            "I will be your general.",
            "I will be your judge.",
            "I will be your rewarder.",
            "I will reward your virtues in the field."
        ],
        context: "She wants to assure the soldiers of her personal involvement.",
        targetEffect: "Use parallel structure to build authority."
    },
    {
        id: 3,
        originalSentence: "Let tyrants fear.",
        stems: [
            "Tyrants should be afraid.",
            "I am not afraid."
        ],
        context: "A short, punchy declarative sentence amidst long complex ones.",
        targetEffect: "Create a short, imperative command for emphasis."
    }
];

// 2. AI COACH SIMULATION
// In production, this would be an API call to OpenAI/Gemini
const simulateAIAnalysis = async (input: string, target: string): Promise<{ status: 'SUCCESS' | 'NEEDS_WORK'; feedback: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerInput = input.toLowerCase();

            // Heuristic checks to simulate "Intelligence"
            if (input.length < 10) {
                resolve({
                    status: 'NEEDS_WORK',
                    feedback: "This feels a bit too brief. Can you elaborate to fully capture the complexity of the stems?"
                });
            } else if (target.includes("contrast") && (lowerInput.includes("but") || lowerInput.includes("yet") || lowerInput.includes("however"))) {
                resolve({
                    status: 'SUCCESS',
                    feedback: "Excellent! You used a coordinating conjunction to sharply pivot between the two contrasting ideas. This mirrors Elizabeth's own rhetorical strategy."
                });
            } else if (target.includes("contrast") && lowerInput.includes("although")) {
                resolve({
                    status: 'SUCCESS',
                    feedback: "Sophisticated choice. Using a subordinating conjunction like 'Although' creates a concessive tone that highlights the main clause effectively."
                });
            } else if (target.includes("parallel") && (lowerInput.includes("and") || lowerInput.includes(","))) {
                resolve({
                    status: 'SUCCESS',
                    feedback: "Strong rhythm. By listing the roles in sequence, you've created a 'tricolon' (rule of three) that builds authority."
                });
            } else if (target.includes("imperative")) {
                resolve({
                    status: 'SUCCESS',
                    feedback: "Short, punchy, and powerful. You captured the authoritative tone perfectly."
                });
            } else {
                // Generic "Coach" response for other cases
                resolve({
                    status: 'NEEDS_WORK',
                    feedback: "You've combined the information, but the rhetorical effect is weak. Try focusing more on the 'Target Effect' above."
                });
            }
        }, 1500); // 1.5s delay to make it feel like "thinking"
    });
};

const StyleDojo: React.FC = () => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'SUCCESS' | 'NEEDS_WORK'>('IDLE');
    const [aiFeedback, setAiFeedback] = useState('');
    const [xp, setXp] = useState(0);

    const challenge = LIVE_CHALLENGES[currentLevel];
    const isFinished = currentLevel >= LIVE_CHALLENGES.length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setStatus('ANALYZING');
        setAiFeedback('');

        // Call our "AI"
        const result = await simulateAIAnalysis(input, challenge.targetEffect);

        setStatus(result.status);
        setAiFeedback(result.feedback);

        if (result.status === 'SUCCESS') {
            setXp(prev => prev + 50);
        }
    };

    const handleNext = () => {
        setStatus('IDLE');
        setAiFeedback('');
        setInput('');
        setCurrentLevel(prev => prev + 1);
    };

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-full text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Trophy size={48} className="text-yellow-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Rhetorical Mastery</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    You have successfully reconstructed the rhetorical strategies of Queen Elizabeth I.
                </p>
                <div className="text-2xl font-bold text-indigo-600 mb-8 bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-100">
                    Total XP: {xp}
                </div>
                <button
                    onClick={() => { setCurrentLevel(0); setXp(0); }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                    Return to Dojo
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 h-full flex flex-col items-center justify-center">

            {/* Header / Progress */}
            <div className="w-full flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-amber-500" size={24} />
                        Rhetorical Dojo
                    </h2>
                    <p className="text-sm text-gray-500">Reconstruct the master's voice</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-gray-400">
                        {currentLevel + 1} / {LIVE_CHALLENGES.length}
                    </div>
                    <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {xp} XP
                    </div>
                </div>
            </div>

            {/* Challenge Card */}
            <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">

                {/* Left: Context & Stems */}
                <div className="md:w-1/3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col">
                    <div className="mb-6">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <BookOpen size={12} /> Context
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                            "{challenge.context}"
                        </p>
                    </div>

                    <div className="flex-1">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Sentence Stems
                        </div>
                        <ul className="space-y-2">
                            {challenge.stems.map((stem, idx) => (
                                <li key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm">
                                    {stem}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Workspace */}
                <div className="md:w-2/3 p-8 flex flex-col">
                    <div className="mb-6">
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Target Effect</div>
                        <h3 className="text-xl font-serif text-gray-900 font-medium">
                            {challenge.targetEffect}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (status !== 'IDLE' && status !== 'ANALYZING') setStatus('IDLE');
                            }}
                            disabled={status === 'SUCCESS' || status === 'ANALYZING'}
                            placeholder="Combine the stems to achieve the target effect..."
                            className={`w-full flex-1 p-4 text-lg font-serif border-2 rounded-xl focus:ring-0 transition-all resize-none ${status === 'SUCCESS' ? 'border-green-500 bg-green-50/30' :
                                    status === 'NEEDS_WORK' ? 'border-amber-300 bg-amber-50/30' :
                                        'border-gray-200 focus:border-indigo-500'
                                }`}
                        />

                        {/* AI Feedback Area */}
                        {(status === 'SUCCESS' || status === 'NEEDS_WORK') && (
                            <div className={`p-4 rounded-lg text-sm flex gap-3 ${status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                <div className="mt-0.5">
                                    {status === 'SUCCESS' ? <Check size={16} /> : <AlertCircle size={16} />}
                                </div>
                                <div>
                                    <span className="font-bold block mb-1">
                                        {status === 'SUCCESS' ? 'Rhetorical Analysis' : 'Coach Feedback'}
                                    </span>
                                    {aiFeedback}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            {status === 'SUCCESS' ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition flex items-center gap-2"
                                >
                                    Next Challenge <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!input.trim() || status === 'ANALYZING'}
                                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {status === 'ANALYZING' ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Submit for Analysis'
                                    )}
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
