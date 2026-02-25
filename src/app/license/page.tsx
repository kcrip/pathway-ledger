"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Gavel, Code, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LicensePage() {
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
              <Gavel className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">License & Open Source</h1>
          </div>
        </header>

        <main className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6 text-slate-700 leading-relaxed">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
              <Code className="w-5 h-5 text-primary" />
              <h2>The MIT License</h2>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre leading-loose border border-slate-100">
{`Copyright (c) 2024 Pathway Ledger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Heart className="w-4 h-4 text-red-500" />
              <h2>Our Philosophy</h2>
            </div>
            <p>
              Pathway Ledger was built with the spirit of "freely given." We believe recovery tools should be accessible, private, and free from commercial exploitation. This project is open-source and intended to help those seeking a new way of life.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
