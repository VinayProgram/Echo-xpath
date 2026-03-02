import React from 'react';
import { useGameStore } from '../store/use-game-store';

const TransformUI: React.FC = () => {
    const isTransforming = useGameStore((state) => state.isTransforming);
    const setIsTransforming = useGameStore((state) => state.setIsTransforming);

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            color: 'white',
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            userSelect: 'none'
        }}>
            <div style={{
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                opacity: 0.8
            }}>
                Editor Controls
            </div>

            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '15px'
            }}>
                <div
                    onClick={() => setIsTransforming(!isTransforming)}
                    style={{
                        width: '44px',
                        height: '24px',
                        backgroundColor: isTransforming ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <div style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: isTransforming ? '22px' : '2px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </div>
                <span>Transform Mode</span>
            </label>

            {isTransforming && (
                <div style={{
                    fontSize: '12px',
                    opacity: 0.6,
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    Select an object to transform.<br />
                    [W] Translate | [E] Rotate | [R] Scale
                </div>
            )}
        </div>
    );
};

export default TransformUI;
