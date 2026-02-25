"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 -ml-2 text-slate-500 hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              Back to Ledger
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-slate-500">Last Updated: March 2024</p>
        </header>

        <main className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6 text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Lock className="w-4 h-4 text-primary" />
              <h2>No Cloud Collection</h2>
            </div>
            <p>
              Pathway Ledger is a "local-first" application. This means that 100% of the data you enter into your worksheet is stored exclusively in your browser's local storage (LocalStorage). We do not have a database, and we do not transmit your inventory data to any external servers.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <EyeOff className="w-4 h-4 text-primary" />
              <h2>Anonymity & PII</h2>
            </div>
            <p>
              We do not collect Personally Identifiable Information (PII). There are no user accounts, no email registrations, and no tracking cookies. Your identity remains completely anonymous to us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-slate-900 font-semibold">AI Reflection Privacy</h2>
            <p>
              When you use the "AI Reflective Tool," the specific text of that row is sent to a secure Generative AI model provider (Google Gemini via Genkit) to generate questions. This data is processed as a transient request and is not used to train global models. However, for maximum anonymity, we recommend avoiding the use of full names or highly specific identifying details in your inventory text if you intend to use the AI features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-slate-900 font-semibold">Third-Party Analytics</h2>
            <p>
              This app does not use Google Analytics, Facebook Pixels, or any other third-party tracking scripts that would compromise your privacy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-slate-900 font-semibold">Data Persistence</h2>
            <p>
              Because data is stored in your browser, clearing your browser cache or "site data" for this domain will delete your inventory. We provide "Backup" and "Export" tools on the main page so you can maintain your own local copies.
            </p>
          </section>
        </main>

        <footer className="text-center text-slate-400 text-sm">
          <p>Guided by the principle of anonymity.</p>
        </footer>
      </div>
    </div>
  );
}
