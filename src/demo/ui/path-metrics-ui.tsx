import React from 'react';
import { useGameStore } from '../store/use-game-store';

const MetricRow: React.FC<{ label: string; value: string; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}80`,
            }} />
            <span style={{ fontSize: '12px', opacity: 0.7 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{
                fontSize: '16px',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
            }}>
                {value}
            </span>
            <span style={{ fontSize: '10px', opacity: 0.5 }}>{unit}</span>
        </div>
    </div>
);

const PathMetricsUI: React.FC = () => {
    const pathMetrics = useGameStore((state) => state.pathMetrics);

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            minWidth: '220px',
            padding: '14px 16px',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            color: 'white',
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            userSelect: 'none',
            transition: 'all 0.3s ease',
        }}>
            <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.5,
                marginBottom: '8px',
            }}>
                Path Metrics
            </div>

            {pathMetrics ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <MetricRow
                        label="Path Length"
                        value={pathMetrics.pathLength.toFixed(2)}
                        unit="units"
                        color="#3b82f6"
                    />
                    <MetricRow
                        label="Mean Curvature"
                        value={pathMetrics.meanCurvature.toFixed(4)}
                        unit="rad/u"
                        color="#10b981"
                    />
                    <MetricRow
                        label="Jerk Integral"
                        value={pathMetrics.jerkIntegral.toFixed(4)}
                        unit="Δκ"
                        color="#f59e0b"
                    />
                </div>
            ) : (
                <div style={{
                    fontSize: '12px',
                    opacity: 0.4,
                    padding: '8px 0',
                    textAlign: 'center',
                    fontStyle: 'italic',
                }}>
                    Click on terrain to generate a path
                </div>
            )}
        </div>
    );
};

export default PathMetricsUI;
