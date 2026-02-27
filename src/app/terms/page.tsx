"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          </div>
          <p className="text-slate-500">Last Updated: March 2024</p>
        </header>

        <main className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6 text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Scale className="w-4 h-4 text-primary" />
              <h2>Acceptance of Terms</h2>
            </div>
            <p>
              By using Pathway Ledger, you agree to these terms. This application is a tool provided &quot;as-is&quot; to assist individuals in their personal recovery work.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <h2>No Professional Advice</h2>
            </div>
            <p>
              The AI-generated prompts and the structure of this ledger are for reflective purposes only. This app is not a substitute for professional therapy, medical advice, or the guidance of a qualified 12-step sponsor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-slate-900 font-semibold">User Responsibility</h2>
            <p>
              You are solely responsible for the security of the device you use to access this app. Since data is stored locally in your browser, anyone with access to your device and browser may be able to view your data. We recommend using a private device and clearing your data or browser history after use if privacy is a concern.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-slate-900 font-semibold">Limitation of Liability</h2>
            <p>
              In no event shall the creators of Pathway Ledger be liable for any data loss, emotional distress, or other consequences arising from the use or inability to use this application. You use this tool at your own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-slate-900 font-semibold">Changes to Service</h2>
            <p>
              We reserve the right to modify or discontinue the application at any time without notice. Since no data is stored on our servers, we have no obligation to provide you with copies of your data upon discontinuation.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
