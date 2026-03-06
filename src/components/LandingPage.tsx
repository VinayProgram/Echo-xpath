import { Link } from '@tanstack/react-router'
import { ArrowRight, Zap, Target, Layers, Car, Home, Rocket } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const LandingPage = () => {
    const demos = [
        {
            to: "/demo-1",
            title: "Demo 1",
            description: "Vehicle simulation with advanced path tracking",
            icon: <Car className="w-8 h-8 text-blue-500" />,
            bgColor: "bg-blue-500/10",
        },
        {
            to: "/demo-2",
            title: "Demo 2",
            description: "Interior navigation and spatial awareness",
            icon: <Home className="w-8 h-8 text-emerald-500" />,
            bgColor: "bg-emerald-500/10",
        },
        {
            to: "/demo-3",
            title: "Demo 3",
            description: "High-speed obstacle avoidance simulation",
            icon: <Rocket className="w-8 h-8 text-purple-500" />,
            bgColor: "bg-purple-500/10",
        }
    ]

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
            {/* Hero Section */}
            <header className="relative overflow-hidden pt-32 pb-16">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/20 blur-[120px] rounded-full -z-10" />
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-cyan-400 mb-8 animate-fade-in">
                        <Zap size={14} className="fill-current" />
                        <span>v2.1.0 is now live</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Smooth Paths.<br />Smart Navigation.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-16 leading-relaxed">
                        Echo-Xpath provides state-of-the-art path smoothing and navigation mesh solutions for modern web-based 3D applications.
                    </p>

                    {/* Demo Cards Section */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto px-4">
                        {demos.map((demo, index) => (
                            <Link
                                key={index}
                                to={demo.to}
                                className="group flex-1 min-w-[280px] max-w-[350px]"
                            >
                                <Card className="bg-zinc-900/50 border-white/10 hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all duration-300 h-full">
                                    <CardContent className="p-8 flex flex-col items-center text-center">
                                        <div className={`w-16 h-16 rounded-2xl ${demo.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            {demo.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white transition-colors group-hover:text-cyan-400">
                                            {demo.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                            {demo.description}
                                        </p>
                                        <div className="mt-auto flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            Launch Experience <ArrowRight size={14} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-24 border-t border-white/5 bg-zinc-950/50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="group">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Precise Target Tracking</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Highly accurate navigation algorithms that ensure your entities reach their destination with pixel-perfect precision.
                            </p>
                        </div>
                        <div className="group">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Real-time Smoothing</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Advanced Catmull-Rom and Laplacian smoothing ensures natural, fluid movements even with jagged navmesh data.
                            </p>
                        </div>
                        <div className="group">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">YUKA Integration</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Built on top of the powerful YUKA library, providing a robust foundation for complex steering behaviors.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center">
                <div className="container mx-auto px-6">
                    <p className="text-zinc-500 text-sm">
                        &copy; {new Date().getFullYear()} EchoPath XR. All rights reserved.
                    </p>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    )
}

export default LandingPage
