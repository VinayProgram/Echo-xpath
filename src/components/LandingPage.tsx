import { Link } from '@tanstack/react-router'
import { ArrowRight, Zap, Target, Layers } from 'lucide-react'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
            {/* Hero Section */}
            <header className="relative overflow-hidden pt-32 pb-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/20 blur-[120px] rounded-full -z-10" />
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-cyan-400 mb-8 animate-fade-in">
                        <Zap size={14} className="fill-current" />
                        <span>v1.0.0 is now live</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Smooth Paths.<br />Smart Navigation.
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-zinc-400 mb-12 leading-relaxed">
                        Echo-Xpath provides state-of-the-art path smoothing and navigation mesh solutions for modern web-based 3D applications.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link
                            to="/demo-1"
                            className="group relative px-8 py-4 bg-white text-black font-semibold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
                        >
                            Explore Demo 1
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                        </Link>
                        <Link
                            to="/demo-2"
                            className="px-8 py-4 bg-zinc-900 border border-white/10 font-semibold rounded-xl hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2"
                        >
                            Explore Demo 2
                            <ArrowRight size={18} />
                        </Link>
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
