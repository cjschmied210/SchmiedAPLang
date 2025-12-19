import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

interface SpeedBumpProps {
    question: string;
    onPass: () => void;
}

const SpeedBump: React.FC<SpeedBumpProps> = ({ question, onPass }) => {
    const [answer, setAnswer] = useState('');
    const [isShimmying, setIsShimmying] = useState(false);

    const isValid = answer.trim().length >= 15;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            onPass();
        } else {
            setIsShimmying(true);
            setTimeout(() => setIsShimmying(false), 500);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            {/* The Blur Layer */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.7s',
                pointerEvents: 'none'
            }} />

            {/* The Gate Content */}
            <div className={isShimmying ? 'animate-shake' : ''} style={{
                position: 'relative',
                zIndex: 20,
                width: '100%',
                maxWidth: '450px',
                backgroundColor: 'white',
                border: '1px solid #E0E7FF',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    margin: '0 auto 1rem auto',
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'var(--color-brand-faint)',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand)'
                }}>
                    <Lock size={24} />
                </div>

                <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    color: '#111827',
                    marginBottom: '0.5rem'
                }}>Cognitive Speed Bump</h3>
                <p style={{
                    color: '#4B5563',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.6'
                }}>
                    {question}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your reflection here..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid #D1D5DB',
                                borderRadius: '0.5rem',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.875rem',
                                resize: 'none',
                                boxSizing: 'border-box'
                            }}
                            autoFocus
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            right: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#9CA3AF',
                            fontWeight: 500
                        }}>
                            {answer.length}/15
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            letterSpacing: '0.025em',
                            textTransform: 'uppercase',
                            border: 'none',
                            cursor: isValid ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            backgroundColor: isValid ? 'var(--color-brand)' : '#F3F4F6',
                            color: isValid ? 'white' : '#9CA3AF',
                            boxShadow: isValid ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isValid ? (
                            <>
                                <Unlock size={16} />
                                Unlock Page
                            </>
                        ) : (
                            'Expand your thought...'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SpeedBump;
