import React from 'react';
import { BookOpen, GitGraph, PenTool } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'READER' | 'LOGIC' | 'STYLE';
    onToggle: (mode: 'READER' | 'LOGIC' | 'STYLE') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onToggle }) => {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
                onClick={() => onToggle('READER')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'READER'
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <BookOpen size={16} />
                <span>Read</span>
            </button>
            <button
                onClick={() => onToggle('LOGIC')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'LOGIC'
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <GitGraph size={16} />
                <span>Map</span>
            </button>
            <button
                onClick={() => onToggle('STYLE')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'STYLE'
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <PenTool size={16} />
                <span>Style</span>
            </button>
        </div>
    );
};
