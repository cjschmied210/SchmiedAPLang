import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithPopup, User } from 'firebase/auth';
import type { RootState } from '../../store';
import { setRhetoricalContext } from '../../features/analysis/analysisSlice';
import type { RhetoricalContextType } from '../../types';
import { auth, googleProvider } from '../../firebase';
import { LogIn, ShieldCheck, Loader2 } from 'lucide-react';

interface EntryAirlockProps {
    children: React.ReactNode;
}

const EntryAirlock: React.FC<EntryAirlockProps> = ({ children }) => {
    const dispatch = useDispatch();
    const rhetoricalContext = useSelector((state: RootState) => state.analysis.rhetoricalContext);

    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    // Context Form State
    const [formData, setFormData] = useState<RhetoricalContextType>({
        speaker: '',
        audience: '',
        exigence: '',
        know: '',
        wantToLearn: '',
    });

    // 1. Listen for auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            setAuthError('');
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Login failed", err);
            setAuthError('Authentication failed. Please use your school account.');
        }
    };

    const handleContextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.speaker && formData.audience && formData.exigence) {
            dispatch(setRhetoricalContext(formData));
        }
    };

    // ------------------------------------------------------------------
    // RENDER: Loading State
    // ------------------------------------------------------------------
    if (authLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-[#FDFBF7]">
                <div className="flex flex-col items-center gap-4 text-indigo-600">
                    <Loader2 size={48} className="animate-spin" />
                    <p className="font-serif text-lg">Initializing System...</p>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // RENDER: Login Gate (If not authenticated)
    // ------------------------------------------------------------------
    if (!user) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#FDFBF7] p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-t-4 border-indigo-600 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                            <ShieldCheck size={48} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                        RhetoricOS
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Authorized Personnel Only. Please identify yourself to access the Analysis Engine.
                    </p>

                    {authError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {authError}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-3"
                    >
                        <LogIn size={20} />
                        Sign in with Google
                    </button>

                    <div className="mt-6 text-xs text-gray-400">
                        Secure Authentication by Firebase
                    </div>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // RENDER: Context Setup (If authenticated but no context)
    // ------------------------------------------------------------------
    if (!rhetoricalContext) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFBF7] bg-opacity-95 backdrop-blur-sm p-4">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 border border-gray-200 relative">

                    {/* User Badge in Context Modal */}
                    <div className="absolute top-8 right-8 flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        ID: {user.displayName}
                    </div>

                    <h2 className="text-3xl font-serif text-gray-900 mb-2">Establish Rhetorical Context</h2>
                    <p className="text-gray-600 mb-8 italic">Before entering the text, define the situation.</p>

                    <form onSubmit={handleContextSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="speaker" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Speaker</label>
                                <input
                                    type="text"
                                    id="speaker"
                                    name="speaker"
                                    value={formData.speaker}
                                    onChange={handleContextChange}
                                    placeholder="Who is writing?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-serif bg-gray-50 bg-opacity-50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="audience" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Audience</label>
                                <input
                                    type="text"
                                    id="audience"
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleContextChange}
                                    placeholder="Who is reading?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-serif bg-gray-50 bg-opacity-50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="exigence" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Exigence</label>
                                <input
                                    type="text"
                                    id="exigence"
                                    name="exigence"
                                    value={formData.exigence}
                                    onChange={handleContextChange}
                                    placeholder="Why now?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-serif bg-gray-50 bg-opacity-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                <span>Digital K-W-L</span>
                                <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Schema Activation</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="know" className="block text-xs font-bold text-gray-500 uppercase">What do I know?</label>
                                    <textarea
                                        id="know"
                                        name="know"
                                        value={formData.know}
                                        onChange={handleContextChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 bg-opacity-50"
                                        placeholder="Prior knowledge..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="wantToLearn" className="block text-xs font-bold text-gray-500 uppercase">What do I want to learn?</label>
                                    <textarea
                                        id="wantToLearn"
                                        name="wantToLearn"
                                        value={formData.wantToLearn}
                                        onChange={handleContextChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 bg-opacity-50"
                                        placeholder="Learning goals..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider flex items-center gap-2"
                            >
                                Enter Text
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // RENDER: Main Content (If authenticated AND context established)
    // ------------------------------------------------------------------
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Pinned Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between text-sm font-serif">
                <div className="flex gap-8 text-gray-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-sans font-bold">Speaker</span>
                        <span className="font-medium">{rhetoricalContext.speaker}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-sans font-bold">Audience</span>
                        <span className="font-medium">{rhetoricalContext.audience}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end text-right">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-sans font-bold">Exigence</span>
                        <span className="font-medium max-w-xs truncate">{rhetoricalContext.exigence}</span>
                    </div>

                    {/* Active User Badge in Header */}
                    <div className="pl-6 border-l border-gray-200 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-gray-500 font-sans">
                            {user.displayName?.split(' ')[0]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content (Canvas) */}
            <div className="flex-1 bg-[#FDFBF7]">
                {children}
            </div>
        </div>
    );
};

export default EntryAirlock;
