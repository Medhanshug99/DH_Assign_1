import { HeroSection } from '@/components/marketing/hero'
import { Navbar } from '@/components/shared/navbar'
import { Target, HeartHandshake, Gift, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary selection:text-black font-sans">
      <Navbar />
      <HeroSection />
      
      {/* How It Works - Timeline Layout */}
      <section id="how-it-works" className="py-32 relative bg-surface/20 border-y border-border/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">The Mechanics of Impact</h2>
            <p className="text-muted text-xl font-light leading-relaxed">
              We’ve completely transformed the traditional golf club model into a continuous loop of performance, reward, and philanthropy.
            </p>
          </div>
          
          <div className="relative">
            {/* Horizontal connection line for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-surface border border-border shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">1. Track Your Edge</h3>
                <p className="text-muted leading-relaxed font-light">
                  Submit your latest rounds natively in our platform. We intelligently manage your 5 most recent scores to ensure your profile reflects your current true form.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-surface border border-border shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                  <HeartHandshake className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">2. Direct Your Impact</h3>
                <p className="text-muted leading-relaxed font-light">
                  Choose a verified global charity. A guaranteed minimum of 10% from your tier goes directly to your cause. You control where the impact hits.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-surface border border-border shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                  <Gift className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">3. Enter the Draw</h3>
                <p className="text-muted leading-relaxed font-light">
                  Match your active scores against our audited monthly draw. Land 3, 4, or 5 matches to unlock elite tier payouts directly to your linked account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Impact & Live Rewards Grid */}
      <section id="rewards" className="py-32 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side text & stats */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Real Numbers. <br/>Real World Change.</h2>
              <p className="text-lg text-muted font-light leading-relaxed mb-12">
                Our platform isn’t just about the game—it’s about leveraging our collective network. Together, our members have driven unprecedented contributions to environmental and youth initiatives.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface/50 border border-border/50 rounded-2xl p-6 hover:bg-surface transition-colors">
                  <div className="text-4xl font-extrabold text-white mb-2">$840k+</div>
                  <div className="text-sm font-medium text-primary uppercase tracking-wider">Total Donated</div>
                </div>
                <div className="bg-surface/50 border border-border/50 rounded-2xl p-6 hover:bg-surface transition-colors">
                  <div className="text-4xl font-extrabold text-white mb-2">32.4k</div>
                  <div className="text-sm font-medium text-accent uppercase tracking-wider">Scores Verified</div>
                </div>
              </div>
            </div>

            {/* Right side live rewards preview */}
            <div className="relative">
              <div className="absolute inset-x-0 -top-20 -bottom-20 bg-gradient-to-r from-primary/5 to-accent/5 blur-[100px] -z-10" />
              
              <Card className="p-1 border-primary/20 bg-black/40 backdrop-blur-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-xl">Recent Payouts</h3>
                  <span className="flex items-center gap-2 text-xs text-muted"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { user: "Alex T.", matches: 4, amount: "$500", date: "2 mins ago" },
                    { user: "Sarah M.", matches: 3, amount: "$50", date: "15 mins ago" },
                    { user: "David C.", matches: 5, amount: "$10,000", date: "4 hrs ago" },
                  ].map((payout, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-sm">
                          {payout.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{payout.user}</div>
                          <div className="text-xs text-muted">{payout.matches} Matches</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{payout.amount}</div>
                        <div className="text-xs text-muted">{payout.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-white/5">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full text-muted hover:text-white flex items-center justify-between group">
                      Qualify for next draw
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">Ready to elevate your game?</h2>
          <Link href="/login">
            <Button size="lg" variant="primary" className="px-12 py-6 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-black py-16 text-center">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Target className="w-5 h-5" />
            <span className="font-bold tracking-tight">Fairway Impact</span>
          </div>
          <p className="text-sm font-light">&copy; {new Date().getFullYear()} Fairway Impact Premium. Handcrafted design.</p>
        </div>
      </footer>
    </main>
  )
}
