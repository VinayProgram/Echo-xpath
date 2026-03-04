import React from 'react';
import { useGameStore } from '../store/use-game-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, Gamepad2, Move, Video, Info } from "lucide-react";
import { Switch } from '@/components/ui/switch';

const TransformUI: React.FC = () => {
    const {
        obstacleAvoidance, setObstacleAvoidance,
        isTransforming, setIsTransforming,
        cameraMode, setCameraMode,
        followPathSteetingBehavior, setFollowPathSteetingBehavior,
        withEchoPath, setWithEchoPath
    } = useGameStore()
    React.useEffect(() => {
        if (obstacleAvoidance) {
            setFollowPathSteetingBehavior(30)
        } else {
            setFollowPathSteetingBehavior(1)
        }
    }, [obstacleAvoidance])
    return (
        <>
            <Card className="fixed top-20 left-4 z-40 w-72 bg-background/60 backdrop-blur-lg border-primary/10 shadow-xl transition-all hover:bg-background/80">
                <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        Simulation Controls
                    </CardTitle>
                    <CardDescription className="text-[10px]">Configure real-time behaviors</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 py-2">
                    <div className="flex items-center justify-between group transition-colors hover:bg-white/5 p-1 rounded-md">
                        <div className="flex items-center gap-2">
                            <Move className="w-3.5 h-3.5 opacity-50" />
                            <Label htmlFor="transform-mode" className="text-sm cursor-pointer">Transform Mode</Label>
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

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <Label className="text-[10px] font-semibold opacity-50 uppercase tracking-wider">Steering Weight</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min="0"
                                max="1000"
                                step="1"
                                value={followPathSteetingBehavior}
                                onChange={(e) => setFollowPathSteetingBehavior(Number(e.target.value))}
                                className="h-8 text-xs bg-white/5 border-white/10"
                            />
                        </div>
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
        </>
    );
};

export default TransformUI;
