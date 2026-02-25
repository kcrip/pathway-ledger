"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Coins, 
  BarChart3, 
  Info, 
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function SupportPage() {
  // Placeholder values for transparency. These can be manually updated by the project owner.
  const stats = {
    monthlyGoal: 50, // AI costs, hosting, domain
    currentSupport: 0,
    lastMonthCost: 24.50,
    donorCount: 0
  };

  const percentToGoal = Math.min((stats.currentSupport / stats.monthlyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 -ml-2 text-slate-500 hover:text-primary font-semibold">
              <ArrowLeft className="w-4 h-4" />
              Back to Ledger
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-xl shadow-primary/20">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Support Pathway</h1>
              <p className="text-slate-500 font-medium">Keeping recovery tools free, open, and private.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <main className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
              <CardContent className="p-8 space-y-6 text-slate-700 leading-relaxed">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
                  <p>
                    Pathway Ledger was created with a single purpose: to provide high-quality, private recovery tools to anyone who needs them, without the barrier of cost or the compromise of privacy.
                  </p>
                  <p>
                    <strong>We don't sell your data. We don't have ads. We don't have subscriptions.</strong>
                  </p>
                  <p>
                    However, the "AI Reflection" tools and server hosting incur real monthly costs. Your support helps cover these "GenAI" tokens and infrastructure expenses so the site can stay alive for the next person reaching for help.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-blue-900 font-bold">
                    <Coins className="w-6 h-6" />
                    <h3>Support via Venmo</h3>
                  </div>
                  <p className="text-sm text-blue-800/80">
                    If this tool helped you uncover insights or find peace, consider "tipping" a few dollars to cover the server costs.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link href="https://venmo.com/u/kcdrip" target="_blank" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-[#008CFF] hover:bg-[#0074D4] text-white rounded-2xl px-8 py-6 font-bold text-lg gap-2 shadow-lg shadow-blue-500/20">
                        Venmo @kcdrip
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="text-center sm:text-left">
                      <span className="text-xs font-black uppercase tracking-widest text-blue-400">KC Rippy</span>
                      <p className="text-[10px] text-blue-400 font-medium italic">Project Lead & Developer</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">Always Private</h4>
                      <p className="text-xs text-slate-500">Donations are anonymous to the app logic. We never link your identity to your inventory.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Code className="w-10 h-10 text-slate-400 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">Open Source</h4>
                      <p className="text-xs text-slate-500">Built for the community. You can view, fork, or host this yourself for free.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden sticky top-8">
              <CardHeader className="bg-slate-900 text-white pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em]">Transparency Report</CardTitle>
                </div>
                <CardDescription className="text-slate-400 text-xs font-medium">
                  Real-time visibility into project sustainability.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 -mt-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500 uppercase">Monthly Sustain Goal</span>
                      <span className="text-sm font-black text-slate-900">${stats.currentSupport} / ${stats.monthlyGoal}</span>
                    </div>
                    <Progress value={percentToGoal} className="h-2 bg-slate-100" />
                    <p className="text-[10px] text-slate-400 italic">Covers GenAI tokens, hosting, and domain fees.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">Expense</Badge>
                        <span className="text-xs font-bold text-slate-700">Last Month Cloud Cost</span>
                      </div>
                      <span className="text-xs font-black text-red-500">-${stats.lastMonthCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">Support</Badge>
                        <span className="text-xs font-bold text-slate-700">Total Donors</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500">{stats.donorCount}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      All funds go directly toward infrastructure. Excess funds are saved to cover future high-usage months.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Link href="https://github.com/pathway-ledger" target="_blank" className="w-full">
                  <Button variant="ghost" className="w-full text-slate-400 hover:text-primary text-[10px] font-black uppercase tracking-widest gap-2">
                    <Code className="w-3 h-3" />
                    View Source on GitHub
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </aside>
        </div>

        <footer className="text-center text-slate-400 text-xs pb-12">
          <p>© {new Date().getFullYear()} Pathway Ledger. Built with gratitude.</p>
        </footer>
      </div>
    </div>
  );
}
