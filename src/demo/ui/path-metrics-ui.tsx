import React from 'react';
import { useGameStore } from '../store/use-game-store';

const MetricRow: React.FC<{ label: string; raw: string | number; smooth: string | number; unit: string; color: string }> = ({ label, raw, smooth, unit, color }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
        }}>
            <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}80`,
            }} />
            <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '10px', opacity: 0.4 }}>Raw:</span>
                <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>{raw}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: color, opacity: 0.8 }}>Smooth:</span>
                <span style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'white',
                    fontVariantNumeric: 'tabular-nums',
                    textShadow: `0 0 10px ${color}40`
                }}>
                    {smooth}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.4 }}>{unit}</span>
            </div>
        </div>
    </div>
);

const ImprovementBadge: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: '6px',
        padding: '4px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    }}>
        <span style={{ fontSize: '9px', opacity: 0.6, marginBottom: '2px' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 800, color: color }}>-{value}</span>
    </div>
)

const PathMetricsUI: React.FC = () => {
    const pathMetrics = useGameStore((state) => state.pathMetrics);

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            width: '260px',
            padding: '16px',
            background: 'rgba(10, 10, 15, 0.7)',
            backdropFilter: 'blur(16px) saturate(180%)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            userSelect: 'none',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
            }}>
                <div style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#00f3ff',
                }}>
                    EchoPath Analytics
                </div>
                {pathMetrics && (
                    <div style={{
                        fontSize: '10px',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        opacity: 0.6,
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {pathMetrics.smooth.points} pts
                    </div>
                )}
            </div>

            {pathMetrics ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <MetricRow
                        label="Path Length"
                        raw={pathMetrics.raw.length.toFixed(2)}
                        smooth={pathMetrics.smooth.length.toFixed(2)}
                        unit="u"
                        color="#3b82f6"
                    />
                    <MetricRow
                        label="Avg Curvature"
                        raw={pathMetrics.raw.curvature.toFixed(1)}
                        smooth={pathMetrics.smooth.curvature.toFixed(1)}
                        unit="°"
                        color="#10b981"
                    />
                    <MetricRow
                        label="Jerk Integral"
                        raw={pathMetrics.raw.jerk.toFixed(0)}
                        smooth={pathMetrics.smooth.jerk.toFixed(0)}
                        unit="ΣΔ"
                        color="#f59e0b"
                    />

                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        gap: '8px',
                    }}>
                        <ImprovementBadge
                            label="CURVATURE"
                            value={pathMetrics.improvement.curvatureReduction}
                            color="#10b981"
                        />
                        <ImprovementBadge
                            label="JERK"
                            value={pathMetrics.improvement.jerkReduction}
                            color="#f59e0b"
                        />
                    </div>
                </div>
            ) : (
                <div style={{
                    fontSize: '12px',
                    opacity: 0.5,
                    padding: '20px 0',
                    textAlign: 'center',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                }}>
                    Target a point to analyze path optimization
                </div>
            )}
        </div>
    );
};

export default PathMetricsUI;
