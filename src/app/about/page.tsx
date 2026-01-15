import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export const metadata = {
    title: 'About Tradeomony | Global B2B Marketplace',
    description: 'Empowering global trade through technology, trust, and transparency.',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent-50 rounded-full blur-3xl opacity-50"></div>

                <div className="container-custom relative">
                    <div className="max-w-3xl">
                        <Badge variant="primary" className="mb-6">Global Trade Simplified</Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary-900 mb-8 leading-tight">
                            Connecting the world through <span className="text-primary-600 italic">trusted</span> trade.
                        </h1>
                        <p className="text-xl text-secondary-600 leading-relaxed">
                            Tradeomony is more than just a marketplace. We are a digital bridge for manufacturers and importers, providing the tools needed to facilitate successful international business.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-secondary-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">Our Core Values</h2>
                        <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Integrity First',
                                description: 'We verify every manufacturer to ensure your trade partners are as reliable as you are.',
                                icon: '🛡️'
                            },
                            {
                                title: 'Digital Innovation',
                                description: 'Leveraging AI and modern web technology to automate sourcing and communication.',
                                icon: '⚡'
                            },
                            {
                                title: 'Global Reach',
                                description: 'Opening markets for small and medium enterprises across Asia, Europe, and America.',
                                icon: '🌏'
                            }
                        ].map((value, i) => (
                            <Card key={i} className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white border-none">
                                <div className="text-4xl mb-6">{value.icon}</div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-4">{value.title}</h3>
                                <p className="text-secondary-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 md:py-32">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="bg-secondary-900 rounded-3xl p-12 text-white relative h-[500px] flex items-center shadow-2xl">
                            <div className="absolute top-0 right-0 opacity-20 p-8">
                                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-3xl font-display font-bold mb-6">Our Mission</h3>
                                <p className="text-xl text-secondary-300 leading-relaxed">
                                    "To democratize international trade by removing technical and trust barriers for businesses worldwide."
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-8">Building the Infrastructure for Global Commerce</h2>
                            <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                                Traditional trade platforms are bloated and expensive. We built Tradeomony on the foundation of the modern web—fast, secure, and user-centric.
                            </p>
                            <p className="text-lg text-secondary-600 leading-relaxed mb-12">
                                Whether you are a garment manufacturer in India or a wholesale distributor in Dubai, Tradeomony provides the visibility and trust you need to grow.
                            </p>
                            <Link href="/signup" className="btn-primary inline-flex">
                                Join our Community
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
