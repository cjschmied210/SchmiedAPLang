import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import type { Annotation } from '../../types';
import {
    updateAnnotationContent,
    deleteAnnotation,
    setRhetoricalVerb,
    setActiveAnnotation
} from '../../features/analysis/analysisSlice';
import { RavSelector } from '../analysis/RavSelector';
import { motion, AnimatePresence } from 'framer-motion';

interface RhetoricalCardProps {
    annotation: Annotation;
    isActive: boolean;
}

export const RhetoricalCard: React.FC<RhetoricalCardProps> = ({ annotation, isActive }) => {
    const dispatch = useDispatch();
    const [showSpacecat, setShowSpacecat] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this analysis card?')) {
            dispatch(deleteAnnotation(annotation.id));
        }
    };

    const handleActivate = () => {
        dispatch(setActiveAnnotation(annotation.id));
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rhetorical-card ${isActive ? 'active' : ''}`}
            onClick={handleActivate}
        >
            {/* Header: Selected Text Preview */}
            <div className="card-header user-select-none group">
                <blockquote className="quote-preview">
                    "{annotation.selectedText}"
                </blockquote>
                <button
                    onClick={handleDelete}
                    className="delete-btn"
                    aria-label="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Body: Analysis Tools */}
            <div className="card-body">

                {/* RAV Selector */}
                <RavSelector
                    selectedVerb={annotation.verb}
                    onSelect={(verb) => dispatch(setRhetoricalVerb({ id: annotation.id, verb }))}
                />

                {/* Analysis Input */}
                <div className="analysis-input">
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                        <MessageSquare size={12} />
                        Analysis
                    </label>
                    <textarea
                        placeholder="How does this choice impact the audience?"
                        value={annotation.content}
                        onChange={(e) => dispatch(updateAnnotationContent({ id: annotation.id, content: e.target.value }))}
                    />
                </div>

                {/* SPACECAT Toggle */}
                <button
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-brand)', cursor: 'pointer', padding: 0 }}
                    onClick={(e) => { e.stopPropagation(); setShowSpacecat(!showSpacecat); }}
                >
                    {showSpacecat ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showSpacecat ? 'Hide Templates' : 'Use SPACECAT Templates'}
                </button>

                <AnimatePresence>
                    {showSpacecat && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ paddingTop: '0.5rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                                Templates coming in Phase 2...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
