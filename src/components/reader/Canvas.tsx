import React, { useState, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { createAnnotation } from '../../features/analysis/analysisSlice';
import SpeedBump from './SpeedBump';

const CHARS_PER_PAGE = 3500;

interface CanvasProps {
    text: string;
    textId?: string;
}

const Canvas: React.FC<CanvasProps> = ({ text, textId = 'default-text' }) => {
    const dispatch = useDispatch();
    const contentRef = useRef<HTMLDivElement>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [unlockedPages, setUnlockedPages] = useState<Set<number>>(new Set());

    // Clean text pagination logic
    const pages = useMemo(() => {
        if (!text) return [];
        const result: string[] = [];
        let currentIndex = 0;

        while (currentIndex < text.length) {
            let endIndex = Math.min(currentIndex + CHARS_PER_PAGE, text.length);
            if (endIndex < text.length) {
                const lastNewline = text.lastIndexOf('\n', endIndex);
                if (lastNewline > currentIndex + CHARS_PER_PAGE * 0.5) {
                    endIndex = lastNewline + 1;
                } else {
                    const lastSpace = text.lastIndexOf(' ', endIndex);
                    if (lastSpace > currentIndex) endIndex = lastSpace + 1;
                }
            }
            result.push(text.slice(currentIndex, endIndex));
            currentIndex = endIndex;
        }
        return result;
    }, [text]);

    const pageStartOffset = useMemo(() => {
        let offset = 0;
        for (let i = 0; i < pageIndex; i++) {
            offset += pages[i].length;
        }
        return offset;
    }, [pages, pageIndex]);

    // Locking Logic: Lock every even page > 0 (Page 2, 4, 6...) unless unlocked
    // This implements "Speed bump after every 2nd page" (Reads 0, 1 -> BUMP -> 2, 3 -> BUMP)
    const isLocked = (pageIndex > 0 && pageIndex % 2 === 0) && !unlockedPages.has(pageIndex);

    const handleUnlock = () => {
        setUnlockedPages(prev => new Set(prev).add(pageIndex));
    };

    const handleSelection = () => {
        if (isLocked) return; // Prevent selection on locked pages
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const container = contentRef.current;
        if (!container || !container.contains(range.commonAncestorContainer)) return;

        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(container);
        preCaretRange.setEnd(range.startContainer, range.startOffset);

        const relativeStart = preCaretRange.toString().length;
        const selectedText = selection.toString();
        const globalStart = pageStartOffset + relativeStart;
        const globalEnd = globalStart + selectedText.length;

        dispatch(createAnnotation({
            textId,
            start: globalStart,
            end: globalEnd,
            text: selectedText,
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNext = () => {
        if (pageIndex < pages.length - 1) {
            setPageIndex(prev => prev + 1);
            scrollToTop();
        }
    };

    const handlePrev = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
            scrollToTop();
        }
    };

    const progress = Math.round(((pageIndex + 1) / pages.length) * 100);

    return (
        <div style={{
            width: '100%',
            maxWidth: '48rem', // max-w-3xl
            margin: '0 auto',
            padding: '3rem 1.5rem',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* The Text Content */}
            <div
                ref={contentRef}
                onMouseUp={handleSelection}
                style={{
                    flex: 1,
                    fontFamily: '"Merriweather", "Georgia", serif',
                    fontSize: '1.25rem', // text-xl
                    lineHeight: '2', // leading-loose
                    color: '#111827', // text-gray-900
                    whiteSpace: 'pre-wrap',
                    marginBottom: '3rem',
                    cursor: 'text',
                    userSelect: 'text'
                }}
            >
                {pages[pageIndex]}
            </div>

            {/* Speed Bump Overlay */}
            {isLocked && (
                <SpeedBump
                    question="Identify one rhetorical choice the speaker made on the previous page to advance their purpose."
                    onPass={handleUnlock}
                />
            )}

            {/* Pagination Controls */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#FDFBF7',
                borderTop: '1px solid #E5E7EB',
                padding: '1rem',
                zIndex: 5
            }}>
                <div style={{
                    maxWidth: '48rem',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <button
                        onClick={handlePrev}
                        disabled={pageIndex === 0 || isLocked}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            border: 'none',
                            background: 'none',
                            color: pageIndex === 0 || isLocked ? '#D1D5DB' : 'var(--color-brand)',
                            cursor: pageIndex === 0 || isLocked ? 'not-allowed' : 'pointer',
                            transition: 'color 0.2s'
                        }}
                    >
                        Previous
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '0.25rem'
                        }}>
                            Page {pageIndex + 1} of {pages.length}
                        </span>
                        <div style={{
                            width: '8rem',
                            height: '0.25rem',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '9999px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: 'var(--color-brand)',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={pageIndex === pages.length - 1 || isLocked}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            border: 'none',
                            background: 'none',
                            color: (pageIndex === pages.length - 1 || isLocked) ? '#D1D5DB' : 'var(--color-brand)',
                            cursor: (pageIndex === pages.length - 1 || isLocked) ? 'not-allowed' : 'pointer',
                            transition: 'color 0.2s'
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
