import React from 'react';
import { useGameStore } from '../../store/use-game-store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, TrendingDown, Target, X } from "lucide-react";

const MetricRow: React.FC<{ label: string; raw: string | number; smooth: string | number; unit: string; color: string }> = ({ label, raw, smooth, unit, color }) => (
    <div className="flex flex-col py-3 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">{label}</span>
        </div>
        <div className="flex justify-between items-baseline">
            <div className="flex items-baseline gap-1.5">
                <span className="text-[9px] uppercase text-white/40 font-bold">Raw</span>
                <span className="text-xs font-medium text-white/60 tabular-nums">{raw}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-[9px] uppercase font-bold text-white/80">Smooth</span>
                <span className="text-sm font-black text-white tabular-nums drop-shadow-md">
                    {smooth}
                </span>
                <span className="text-[10px] text-white/40 font-medium">{unit}</span>
            </div>
        </div>
    </div>
);

const ImprovementBadge: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 flex-1 transition-all hover:bg-white/10">
        <div className="flex items-center gap-1.5 mb-1 text-white/60">
            {icon}
            <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-sm font-black text-white">-{value}</span>
    </div>
)

const PathMetricsUI: React.FC = () => {
    const pathMetrics = useGameStore((state) => state.pathMetrics);
    const { showPathMetricsUI, setShowPathMetricsUI, cinematicMode, showBothPaths } = useGameStore();
    if (!showPathMetricsUI || cinematicMode) return null;

    return (
        <Card className="fixed top-20 right-6 z-40 w-72 bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
            <CardHeader className="pb-2 pt-5">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                        <Activity className="w-3 h-3 text-blue-400" />
                        EchoPath Analytics
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {pathMetrics && (
                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-white/5 border-white/10 text-white tabular-nums">
                                {pathMetrics.smooth.points} PTS
                            </Badge>
                        )}
                        <button
                            onClick={() => setShowPathMetricsUI(false)}
                            className="rounded-md p-1  hover:opacity-100 hover:bg-white/10 transition-all "
                            aria-label="Close Path Metrics"
                        >
                            <X className="w-3.5 h-3.5" color='white' />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                {pathMetrics ? (
                    <div className="space-y-1">
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
                            color="#60a5fa"
                        />
                        <MetricRow
                            label="Jerk Integral"
                            raw={pathMetrics.raw.jerk.toFixed(0)}
                            smooth={pathMetrics.smooth.jerk.toFixed(0)}
                            unit="ΣΔ"
                            color="#93c5fd"
                        />

                        <div className="mt-4 flex gap-2">
                            <ImprovementBadge
                                label="Curvature"
                                value={pathMetrics.improvement.curvatureReduction}
                                icon={<TrendingDown className="w-2.5 h-2.5" />}
                            />
                            <ImprovementBadge
                                label="Jerk"
                                value={pathMetrics.improvement.jerkReduction}
                                icon={<Zap className="w-2.5 h-2.5" />}
                            />
                        </div>

                        {showBothPaths && (
                            <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-1 bg-white/30 rounded-full border border-white/20" style={{ borderStyle: 'dashed' }} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Original (Raw)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">EchoPath (Smooth)</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl gap-3">
                        <Target className="w-8 h-8 opacity-10 animate-pulse" />
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 text-center">
                            Select target<br />to begin analysis
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PathMetricsUI;
