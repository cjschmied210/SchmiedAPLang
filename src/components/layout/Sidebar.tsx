import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { RhetoricalCard } from './RhetoricalCard';
import { BrainCircuit } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const { annotations, activeAnnotationId } = useAppSelector((state) => state.analysis);
    const scrollRef = useRef<HTMLDivElement>(null);

    // FIX: Auto-scroll to active card
    useEffect(() => {
        if (activeAnnotationId && scrollRef.current) {
            // Find the active card DOM element within the sidebar
            // The RhetoricalCard component adds the '.active' class when selected
            const activeCard = scrollRef.current.querySelector('.rhetorical-card.active');

            if (activeCard) {
                activeCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [activeAnnotationId, annotations.length]); // Re-run when selection changes or new items added

    return (
        <aside className="sidebar">
            {/* Header */}
            <div className="sidebar-header">
                <div className="branding">
                    <BrainCircuit size={24} />
                    <span>Analysis Engine</span>
                </div>
                <div className="item-count" style={{ fontSize: '0.75rem', color: 'var(--color-ink-light)' }}>
                    {annotations.length} items
                </div>
            </div>

            {/* Cards Container */}
            <div
                ref={scrollRef}
                className="sidebar-content"
            >
                {annotations.length === 0 ? (
                    <div className="empty-state">
                        <BrainCircuit size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
                        <p>Highlight text in the reader to begin your rhetorical analysis.</p>
                    </div>
                ) : (
                    annotations.map((annotation) => (
                        <RhetoricalCard
                            key={annotation.id}
                            annotation={annotation}
                            isActive={annotation.id === activeAnnotationId}
                        />
                    ))
                )}
            </div>

            {/* Footer / Status */}
            <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #E2E8F0' }}>
                RhetoricOS Phase 1.0
            </div>
        </aside>
    );
};
