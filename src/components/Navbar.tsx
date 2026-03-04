import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { useGameStore } from '@/store/use-game-store';

const Navbar = () => {
    const { withEchoPath, obstacleAvoidance } = useGameStore();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tracking-tight text-primary">
                        Echo<span className="text-blue-500">Path</span> Simulation
                    </span>
                    <div className="flex gap-2">
                        <Badge variant={withEchoPath ? "default" : "outline"} className="transition-all">
                            {withEchoPath ? "EchoPath Active" : "Standard path"}
                        </Badge>
                        <Badge variant={obstacleAvoidance ? "default" : "destructive"} className="transition-all">
                            {obstacleAvoidance ? "Avoidance ON" : "Avoidance OFF"}
                        </Badge>
                    </div>
                </div>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem className="text-sm font-medium opacity-60 hover:opacity-100 cursor-pointer px-3">
                            Documentation
                        </NavigationMenuItem>
                        <NavigationMenuItem className="text-sm font-medium opacity-60 hover:opacity-100 cursor-pointer px-3">
                            Settings
                        </NavigationMenuItem>
                        <NavigationMenuItem className="ml-4">
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">v2.1.0-beta</Badge>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
};

export default Navbar;
