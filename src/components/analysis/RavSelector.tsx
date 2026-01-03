import React from 'react';
import type { RhetoricalVerb } from '../../types';

interface RavSelectorProps {
    onSelect: (verb: RhetoricalVerb) => void;
    selectedVerb?: RhetoricalVerb;
}

const VERB_CATEGORIES = {
    EMPHASIZE: ['Highlight', 'Underscore', 'Reinforce', 'Accentuate'],
    CONTRAST: ['Juxtapose', 'Distinguish', 'Differentiate', 'Counter'],
    ARGUE: ['Assert', 'Contend', 'Maintain', 'Postulate'],
};

export const RavSelector: React.FC<RavSelectorProps> = ({ onSelect, selectedVerb }) => {
    return (
        <div className="rav-selector">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-ink)' }}>Rhetorical Action</h4>
            <div className="rav-section">
                {Object.entries(VERB_CATEGORIES).map(([category, verbs]) => (
                    <div key={category} className="rav-category">
                        <h5>To {category}</h5>
                        <div className="chips-container">
                            {verbs.map((verb) => (
                                <button
                                    key={verb}
                                    onClick={(e) => { e.stopPropagation(); onSelect({ category: category as any, verb }); }}
                                    className={`verb-chip ${selectedVerb?.verb === verb ? 'selected' : ''}`}
                                >
                                    {verb}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
