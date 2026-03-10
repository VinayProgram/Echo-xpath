import React from 'react';
import { useGameStore } from '../../store/use-game-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, Gamepad2, Move, Video, Info, X, PanelTopBottomDashedIcon, Activity } from "lucide-react";
import { Switch } from '@/components/ui/switch';

const TransformUI: React.FC = () => {
    const {
        obstacleAvoidance, setObstacleAvoidance,
        isTransforming, setIsTransforming,
        cameraMode, setCameraMode,
        followPathSteetingBehavior, setFollowPathSteetingBehavior,
        withEchoPath, setWithEchoPath,
        vehicleConfig, setVehicleConfig,
        showTransformUI, setShowTransformUI,
        showBothPaths, setShowBothPaths,
        cinematicMode, setCinematicMode,
        setShowPathMetricsUI
    } = useGameStore()
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    React.useEffect(() => {
        if (obstacleAvoidance) {
            setFollowPathSteetingBehavior(30)
        } else {
            setFollowPathSteetingBehavior(1)
        }
    }, [obstacleAvoidance, setFollowPathSteetingBehavior])

    if (!showTransformUI || cinematicMode) return null;

    return (
        <Card className="fixed top-20 left-4 z-40 w-72 bg-background/60 backdrop-blur-lg border-primary/10 shadow-xl transition-all hover:bg-background/80 overflow-auto max-h-[calc(100vh-100px)]">
            <CardHeader className="pb-3 pt-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        Simulation Controls
                    </CardTitle>
                    <button
                        onClick={() => setShowTransformUI(false)}
                        className="rounded-md p-1 opacity-50 hover:opacity-100 hover:bg-white/10 transition-all"
                        aria-label="Close Simulation Controls"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
                <CardDescription className="text-[10px]">Configure real-time behaviors</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 py-2">
                <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                    <div className="flex items-center gap-2">
                        <Move className="w-3.5 h-3.5 opacity-50" />
                        <Label htmlFor="transform-mode" className="text-sm cursor-pointer">Edit Obstacles</Label>
                    </div>
                    <Switch
                        id="transform-mode"
                        checked={isTransforming}
                        onCheckedChange={setIsTransforming}
                    />
                </div>

                <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="w-3.5 h-3.5 opacity-50" />
                        <Label htmlFor="echo-path" className="text-sm cursor-pointer">Echo Path X</Label>
                    </div>
                    <Switch
                        id="echo-path"
                        checked={withEchoPath}
                        onCheckedChange={setWithEchoPath}
                    />
                </div>

                <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="w-3.5 h-3.5 opacity-50" />
                        <Label htmlFor="avoidance" className="text-sm cursor-pointer">Obstacle Avoidance</Label>
                    </div>
                    <Switch
                        id="avoidance"
                        checked={obstacleAvoidance}
                        onCheckedChange={setObstacleAvoidance}
                    />
                </div>

                <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                    <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 opacity-50" />
                        <Label htmlFor="camera-mode" className="text-sm cursor-pointer">FPV Camera</Label>
                    </div>
                    <Switch
                        id="camera-mode"
                        checked={cameraMode === 'firstPerson'}
                        onCheckedChange={(checked) => setCameraMode(checked ? 'firstPerson' : 'orbit')}
                    />
                </div>

                <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                    <div className="flex items-center gap-2">
                        <PanelTopBottomDashedIcon className="w-3.5 h-3.5 opacity-50 text-blue-400" />
                        <div className="flex flex-col">
                            <Label htmlFor="show-both-paths" className="text-sm cursor-pointer">Compare Paths</Label>
                            <span className="text-[9px] opacity-40">Raw vs Smooth</span>
                        </div>
                    </div>
                    <Switch
                        id="show-both-paths"
                        checked={showBothPaths}
                        onCheckedChange={(checked) => setShowBothPaths(checked)}
                    />
                </div>

                <div className="space-y-4 pt-2 border-t border-white/5">
                    <Label className="text-[10px] font-semibold opacity-50 uppercase tracking-wider">
                        Camera & Presentation
                    </Label>

                    <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                        <div className="flex items-center gap-2">
                            <Video className="w-3.5 h-3.5 opacity-50" />
                            <Label htmlFor="lock-camera" className="text-sm cursor-pointer">Lock Camera</Label>
                        </div>
                        <Switch
                            id="lock-camera"
                            checked={cameraMode === 'none'}
                            onCheckedChange={(checked) => setCameraMode(checked ? 'none' : 'orbit')}
                        />
                    </div>

                    <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 opacity-50 text-red-500" />
                            <div className="flex flex-col">
                                <Label htmlFor="cinematic-mode" className="text-sm cursor-pointer font-bold">Record Mode</Label>
                                <span className="text-[9px] opacity-40 text-red-400">Hide UI for recordings</span>
                            </div>
                        </div>
                        <Switch
                            id="cinematic-mode"
                            checked={cinematicMode}
                            onCheckedChange={(checked) => {
                                setCinematicMode(checked);
                                if (checked) {
                                    setCameraMode('none');
                                    setShowPathMetricsUI(false);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                    <div
                        className="flex items-center justify-between cursor-pointer group hover:opacity-80 transition-opacity"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Label className="text-[10px] font-semibold opacity-50 uppercase tracking-wider cursor-pointer">
                            Vehicle Config (Advanced)
                        </Label>
                        <div className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
                            <Settings2 className="w-3 h-3 opacity-50" />
                        </div>
                    </div>

                    {showAdvanced && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] opacity-70">
                                    <span>Max Speed</span>
                                    <span>{vehicleConfig.maxSpeed}</span>
                                </div>
                                <Input
                                    type="range"
                                    min="0.1"
                                    max="50"
                                    step="0.1"
                                    value={vehicleConfig.maxSpeed}
                                    onChange={(e) => setVehicleConfig({ ...vehicleConfig, maxSpeed: Number(e.target.value) })}
                                    className="h-4 accent-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] opacity-70">
                                    <span>Max Force</span>
                                    <span>{vehicleConfig.maxForce}</span>
                                </div>
                                <Input
                                    type="range"
                                    min="0.1"
                                    max="20"
                                    step="0.1"
                                    value={vehicleConfig.maxForce}
                                    onChange={(e) => setVehicleConfig({ ...vehicleConfig, maxForce: Number(e.target.value) })}
                                    className="h-4 accent-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] opacity-70">
                                    <span>Mass</span>
                                    <span>{vehicleConfig.mass}</span>
                                </div>
                                <Input
                                    type="range"
                                    min="0.1"
                                    max="10"
                                    step="0.1"
                                    value={vehicleConfig.mass}
                                    onChange={(e) => setVehicleConfig({ ...vehicleConfig, mass: Number(e.target.value) })}
                                    className="h-4 accent-primary"
                                />
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-white/5">
                                <div className="flex justify-between text-[10px] opacity-70 font-medium">
                                    <span>Steering Weight</span>
                                    <span>{followPathSteetingBehavior}</span>
                                </div>
                                <Input
                                    type="number"
                                    value={followPathSteetingBehavior}
                                    onChange={(e) => setFollowPathSteetingBehavior(Number(e.target.value))}
                                    className="h-7 text-xs bg-white/5"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {isTransforming && (
                    <div className="mt-2 p-2 rounded bg-primary/5 border border-primary/20 flex gap-2 items-start">
                        <Info className="w-3.5 h-3.5 text-primary mt-0.5" />
                        <div className="text-[10px] leading-tight text-primary/80">
                            <strong>Hotkeys:</strong> [W] Translate | [E] Rotate | [R] Scale
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TransformUI;
