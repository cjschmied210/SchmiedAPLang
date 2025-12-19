import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAnnotation } from '../../features/analysis/analysisSlice';

// Helper to chunk text locally
const CHARS_PER_PAGE = 3500; // rough estimate for a dense view

interface CanvasProps {
    text: string;
    textId?: string; // ID of the text/assignment
}

const Canvas: React.FC<CanvasProps> = ({ text, textId = 'default-text' }) => {
    const dispatch = useDispatch();
    const contentRef = useRef<HTMLDivElement>(null);
    const [pageIndex, setPageIndex] = useState(0);

    // Split text into pages preventing split words
    const pages = useMemo(() => {
        if (!text) return [];
        const result: string[] = [];
        let currentIndex = 0;

        while (currentIndex < text.length) {
            let endIndex = Math.min(currentIndex + CHARS_PER_PAGE, text.length);

            // If not at end, backtrack to nearest newline or space
            if (endIndex < text.length) {
                const lastNewline = text.lastIndexOf('\n', endIndex);
                if (lastNewline > currentIndex + CHARS_PER_PAGE * 0.5) {
                    endIndex = lastNewline + 1; // Include the newline
                } else {
                    const lastSpace = text.lastIndexOf(' ', endIndex);
                    if (lastSpace > currentIndex) {
                        endIndex = lastSpace + 1;
                    }
                }
            }

            result.push(text.slice(currentIndex, endIndex));
            currentIndex = endIndex;
        }
        return result;
    }, [text]);

    // Calculate the start offset of the current page in the full text
    const pageStartOffset = useMemo(() => {
        let offset = 0;
        for (let i = 0; i < pageIndex; i++) {
            offset += pages[i].length;
        }
        return offset;
    }, [pages, pageIndex]);

    const handleSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const container = contentRef.current;

        if (!container || !container.contains(range.commonAncestorContainer)) return;

        // Calculate offset relative to the page container
        // We use a temporary range to measure distance from the start
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(container);
        preCaretRange.setEnd(range.startContainer, range.startOffset);

        const relativeStart = preCaretRange.toString().length;
        const selectedText = selection.toString();
        const relativeEnd = relativeStart + selectedText.length;

        // Global offsets
        const globalStart = pageStartOffset + relativeStart;
        const globalEnd = pageStartOffset + relativeEnd;

        // Cleanup selection to avoid stuck highlights
        // selection.removeAllRanges(); // Optional: keep selection or clear it? 
        // Typically keep it so user sees what they selected until the sidebar action takes over.

        dispatch(createAnnotation({
            textId,
            start: globalStart,
            end: globalEnd,
            text: selectedText,
        }));
    };

    const handleNext = () => {
        if (pageIndex < pages.length - 1) {
            setPageIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const progress = Math.round(((pageIndex + 1) / pages.length) * 100);

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-12 min-h-[80vh] flex flex-col">
            <div
                ref={contentRef}
                onMouseUp={handleSelection}
                className="flex-1 font-serif text-xl leading-loose text-gray-900 whitespace-pre-wrap select-text mb-12"
                style={{ fontFamily: '"Merriweather", "Georgia", serif' }}
            >
                {pages[pageIndex]}
            </div>

            {/* Pagination Controls */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7] border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={pageIndex === 0}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${pageIndex === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                    >
                        Previous
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Page {pageIndex + 1} of {pages.length}
                        </span>
                        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={pageIndex === pages.length - 1}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${pageIndex === pages.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-indigo-600 hover:text-indigo-800'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
