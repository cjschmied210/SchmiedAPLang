import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setRhetoricalContext } from '../../features/analysis/analysisSlice';
import { RhetoricalContextType } from '../../types';

interface EntryAirlockProps {
    children: React.ReactNode;
}

const EntryAirlock: React.FC<EntryAirlockProps> = ({ children }) => {
    const dispatch = useDispatch();
    const rhetoricalContext = useSelector((state: RootState) => state.analysis.rhetoricalContext);

    // Local state for form input
    const [formData, setFormData] = useState<RhetoricalContextType>({
        speaker: '',
        audience: '',
        exigence: '',
        know: '',
        wantToLearn: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (formData.speaker && formData.audience && formData.exigence) {
            dispatch(setRhetoricalContext(formData));
        }
    };

    if (!rhetoricalContext) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFBF7] bg-opacity-95 backdrop-blur-sm p-4">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
                    <h2 className="text-3xl font-serif text-gray-900 mb-2">Establish Rhetorical Context</h2>
                    <p className="text-gray-600 mb-8 italic">Before entering the text, define the situation.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="speaker" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Speaker</label>
                                <input
                                    type="text"
                                    id="speaker"
                                    name="speaker"
                                    value={formData.speaker}
                                    onChange={handleChange}
                                    placeholder="Who is writing?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-serif bg-gray-50"
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
                                    onChange={handleChange}
                                    placeholder="Who is reading?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-serif bg-gray-50"
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
                                    onChange={handleChange}
                                    placeholder="Why now?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-serif bg-gray-50"
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
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Prior knowledge..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="wantToLearn" className="block text-xs font-bold text-gray-500 uppercase">What do I want to learn?</label>
                                    <textarea
                                        id="wantToLearn"
                                        name="wantToLearn"
                                        value={formData.wantToLearn}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Learning goals..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
                            >
                                Enter Text
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

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
                <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-sans font-bold">Exigence</span>
                    <span className="font-medium max-w-xs truncate">{rhetoricalContext.exigence}</span>
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
