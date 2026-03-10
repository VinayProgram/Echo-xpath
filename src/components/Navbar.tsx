import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useGameStore } from '@/store/use-game-store';
import { Settings2, Activity, Menu, X, ChevronRight, Zap } from 'lucide-react';

const Navbar = () => {
    const {
        withEchoPath,
        obstacleAvoidance,
        showTransformUI,
        setShowTransformUI,
        showPathMetricsUI,
        setShowPathMetricsUI,
        cinematicMode,
        setCinematicMode,
        setWithEchoPath
    } = useGameStore();

    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    if (cinematicMode) {
        return (
            <button
                onClick={() => setCinematicMode(false)}
                className="fixed bottom-4 right-4 z-[100] px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/50 rounded-full text-xs font-bold backdrop-blur-md transition-all animate-pulse"
            >
                EXIT RECORD MODE
            </button>
        )
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4 max-w-screen-2xl mx-auto">

                {/* ── Brand ── */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xl font-bold tracking-tight text-primary">
                        Echo<span className="text-blue-500">Path</span>
                        <span className="hidden sm:inline text-muted-foreground font-normal text-base ml-1">Simulation</span>
                    </span>
                </div>

                {/* ── Status badges (desktop) ── */}
                <div className="hidden md:flex gap-2 items-center">
                    <Badge variant={withEchoPath ? "default" : "outline"} className="transition-all">
                        {withEchoPath ? "EchoPath Active" : "Standard path"}
                    </Badge>
                    <Badge variant={obstacleAvoidance ? "default" : "destructive"} className="transition-all">
                        {obstacleAvoidance ? "Avoidance ON" : "Avoidance OFF"}
                    </Badge>
                </div>

                {/* ── Desktop nav items ── */}
                <div className="hidden md:flex items-center gap-1">
                    {/* Toggle: Simulation Controls */}
                    <button
                        onClick={() => setShowTransformUI(!showTransformUI)}
                        title="Toggle Simulation Controls"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border
                            ${showTransformUI
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'bg-transparent border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                    >
                        <Settings2 className="w-3.5 h-3.5" />
                        <span>Controls</span>
                        <ChevronRight className={`w-3 h-3 transition-transform ${showTransformUI ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Toggle: Path Analytics */}
                    <button
                        onClick={() => setShowPathMetricsUI(!showPathMetricsUI)}
                        title="Toggle Path Analytics"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border
                            ${showPathMetricsUI
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                : 'bg-transparent border-transparent text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/5'}`}
                    >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Analytics</span>
                        <ChevronRight className={`w-3 h-3 transition-transform ${showPathMetricsUI ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Toggle: Echo Path */}
                    <button
                        onClick={() => setWithEchoPath(!withEchoPath)}
                        title="Toggle Echo Path"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border
                            ${withEchoPath
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                : 'bg-transparent border-transparent text-muted-foreground hover:text-blue-400 hover:bg-blue-500/5'}`}
                    >
                        <Zap className={`w-3.5 h-3.5 ${withEchoPath ? 'fill-blue-400/20 animate-pulse' : ''}`} />
                        <span>Echo Path</span>
                    </button>

                    <div className="w-px h-5 bg-white/10 mx-1" />

                    <span className="text-sm font-medium opacity-50 hover:opacity-100 cursor-pointer px-3 transition-opacity">
                        Documentation
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider ml-1">
                        v1.0.0-beta
                    </Badge>
                </div>

                {/* ── Mobile hamburger ── */}
                <button
                    className="md:hidden rounded-md p-2 hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Mobile dropdown ── */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur-md px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Status row */}
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant={withEchoPath ? "default" : "outline"} className="transition-all text-xs">
                            {withEchoPath ? "EchoPath Active" : "Standard path"}
                        </Badge>
                        <Badge variant={obstacleAvoidance ? "default" : "destructive"} className="transition-all text-xs">
                            {obstacleAvoidance ? "Avoidance ON" : "Avoidance OFF"}
                        </Badge>
                    </div>

                    <div className="space-y-1">
                        {/* Toggle Controls */}
                        <button
                            onClick={() => { setShowTransformUI(!showTransformUI); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border
                                ${showTransformUI
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'bg-transparent border-white/10 text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
                        >
                            <Settings2 className="w-4 h-4" />
                            <span>Simulation Controls</span>
                            <span className="ml-auto text-[10px] opacity-50">{showTransformUI ? 'VISIBLE' : 'HIDDEN'}</span>
                        </button>

                        {/* Toggle Analytics */}
                        <button
                            onClick={() => { setShowPathMetricsUI(!showPathMetricsUI); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border
                                ${showPathMetricsUI
                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                    : 'bg-transparent border-white/10 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/5'}`}
                        >
                            <Activity className="w-4 h-4" />
                            <span>Path Analytics</span>
                            <span className="ml-auto text-[10px] opacity-50">{showPathMetricsUI ? 'VISIBLE' : 'HIDDEN'}</span>
                        </button>

                        {/* Toggle Echo Path */}
                        <button
                            onClick={() => { setWithEchoPath(!withEchoPath); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border
                                ${withEchoPath
                                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                    : 'bg-transparent border-white/10 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/5'}`}
                        >
                            <Zap className="w-4 h-4" />
                            <span>Echo Path X</span>
                            <span className="ml-auto text-[10px] opacity-50">{withEchoPath ? 'ACTIVE' : 'OFF'}</span>
                        </button>

                        <div className="pt-2 border-t border-white/10">
                            <span className="text-sm font-medium opacity-50 px-3 py-2 block cursor-pointer hover:opacity-80 transition-opacity">
                                Documentation
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">v2.1.0-beta</Badge>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
