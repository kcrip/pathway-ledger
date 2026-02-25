"use client";

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  MessageSquare, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Loader2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { InventoryData, InventoryCategory, InventoryRow, INVENTORY_CONFIG } from '@/lib/types';
import { generatePrayerList } from '@/ai/flows/generate-prayer-list';

interface FifthStepViewerProps {
  data: InventoryData;
  onUpdateNote: (category: InventoryCategory, id: number, note: string) => void;
  onClose: () => void;
}

export function FifthStepViewer({ data, onUpdateNote, onClose }: FifthStepViewerProps) {
  const flattenedItems = useMemo(() => {
    const items: { category: InventoryCategory; row: InventoryRow }[] = [];
    (['resentments', 'fears', 'harms'] as const).forEach(cat => {
      data[cat].forEach(row => {
        items.push({ category: cat, row });
      });
    });
    return items;
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingPrayers, setIsGeneratingPrayers] = useState(false);
  const [prayers, setPrayers] = useState<string | null>(null);

  const currentItem = flattenedItems[currentIndex];
  const progress = flattenedItems.length > 0 
    ? ((currentIndex + 1) / flattenedItems.length) * 100 
    : 0;

  const handleNext = () => {
    if (currentIndex < flattenedItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleGeneratePrayers = async () => {
    setIsGeneratingPrayers(true);
    try {
      const result = await generatePrayerList({ inventory: data });
      setPrayers(result.prayerList);
    } catch (err) {
      console.error("Failed to generate prayers", err);
    } finally {
      setIsGeneratingPrayers(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (flattenedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full text-slate-400">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Inventory is Empty</h2>
        <p className="text-slate-500 max-w-xs">You need to add items to your inventory before you can start your 5th step session.</p>
        <Button onClick={onClose}>Return to Editor</Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex bg-green-100 p-4 rounded-full text-green-600 mb-2">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900">Session Complete</h1>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
            You have admitted the exact nature of your wrongs. This is a vital milestone. 
            Now, you can generate a personalized spiritual prayer list to help you move forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Session Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Items Shared</span>
                <span className="font-bold text-slate-900">{flattenedItems.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Resentments</span>
                <span className="font-bold text-red-600">{data.resentments.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Fears</span>
                <span className="font-bold text-orange-600">{data.fears.length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 font-medium">Harms</span>
                <span className="font-bold text-blue-600">{data.harms.length}</span>
              </div>
              <div className="pt-4 flex gap-2">
                <Button variant="outline" className="w-full rounded-xl gap-2" onClick={handlePrint}>
                  <Printer className="w-4 h-4" /> Print Results
                </Button>
                <Button variant="ghost" className="w-full rounded-xl gap-2" onClick={onClose}>
                  <ArrowLeft className="w-4 h-4" /> Exit
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 rounded-3xl shadow-xl shadow-primary/5 overflow-hidden border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                Spiritual Prayer List
              </CardTitle>
              <CardDescription>
                AI-synthesized prayers based on your turnarounds and spiritual remedies.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!prayers && !isGeneratingPrayers ? (
                <div className="text-center py-10 space-y-4">
                  <p className="text-slate-600 text-sm">Ready to generate your path forward?</p>
                  <Button onClick={handleGeneratePrayers} className="gap-2 rounded-2xl px-8 shadow-lg shadow-primary/20">
                    <Sparkles className="w-4 h-4" />
                    Generate My Prayers
                  </Button>
                </div>
              ) : isGeneratingPrayers ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-slate-500 font-medium animate-pulse">Synthesizing spiritual redirections...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-primary/10 shadow-inner max-h-[400px] overflow-auto prose prose-sm prose-slate">
                    {prayers?.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 text-slate-700">{line}</p>
                    ))}
                  </div>
                  <Button variant="outline" onClick={handleGeneratePrayers} className="w-full rounded-xl gap-2 border-primary/20 text-primary">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            5th Step Interactive Session
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Item {currentIndex + 1} of {flattenedItems.length}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Progress value={progress} className="w-full md:w-48 h-2 bg-slate-100" />
          <Button variant="outline" size="icon" onClick={handlePrint} className="rounded-xl shrink-0">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={onClose} className="font-bold text-slate-500 hover:text-red-500">
            Exit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none capitalize px-3 py-1 font-bold">
                  {currentItem.category}
                </Badge>
                {currentIndex === flattenedItems.length - 1 && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Final Item
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                {currentItem.row.col1 || 'Unspecified Entity'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {INVENTORY_CONFIG[currentItem.category].cols.slice(1).map((col) => (
                <div key={col.key} className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    {col.header}
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 min-h-[60px] whitespace-pre-wrap">
                    {currentItem.row[col.key as keyof InventoryRow] || <span className="text-slate-300 italic">No information provided</span>}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
              className="gap-2 rounded-2xl px-6 py-6 border-slate-200 font-bold"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Item
            </Button>
            <Button 
              onClick={handleNext} 
              className="gap-2 rounded-2xl px-8 py-6 font-bold shadow-lg shadow-primary/20"
            >
              {currentIndex === flattenedItems.length - 1 ? 'Complete Session' : 'Next Item'}
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 rounded-3xl shadow-sm bg-blue-50/30 border-dashed border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                <MessageSquare className="w-4 h-4 text-primary" />
                Sponsor Insights
              </CardTitle>
              <CardDescription className="text-xs">
                Take notes here as you share this item. These are saved to your local worksheet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Write down takeaways, patterns, or amends identified during your sharing..."
                className="min-h-[400px] bg-white border-slate-200 rounded-2xl text-sm focus:ring-primary/20 resize-none"
                value={currentItem.row.fifthStepNotes || ''}
                onChange={(e) => onUpdateNote(currentItem.category, currentItem.row.id, e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print-only section */}
      <div className="hidden print:block print:p-0 print:m-0">
        <div className="space-y-12">
          <header className="text-center border-b-2 border-black pb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter">4th Step Inventory Ledger</h1>
            <p className="text-sm font-bold mt-2">Prepared for 5th Step Disclosure • {new Date().toLocaleDateString()}</p>
          </header>

          {flattenedItems.map((item, idx) => (
            <div key={`${item.category}-${item.row.id}`} className="page-break-inside-avoid border-b border-slate-300 py-10 space-y-6">
              <div className="flex justify-between items-end border-l-8 border-black pl-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.category} • Item {idx + 1}</span>
                  <h2 className="text-3xl font-black">{item.row.col1}</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-4">
                <div className="space-y-4">
                  {INVENTORY_CONFIG[item.category].cols.slice(1).map(col => (
                    <div key={col.key}>
                      <span className="text-[10px] font-black uppercase block mb-1">{col.header}</span>
                      <p className="text-sm leading-relaxed">{item.row[col.key as keyof InventoryRow] || '-'}</p>
                    </div>
                  ))}
                </div>
                <div className="border-l border-slate-200 pl-8">
                  <span className="text-[10px] font-black uppercase block mb-2">5th Step Notes & Insights</span>
                  <div className="min-h-[200px] border-b border-slate-100 flex flex-col gap-4">
                    {item.row.fifthStepNotes ? (
                      <p className="text-sm italic text-slate-700">{item.row.fifthStepNotes}</p>
                    ) : (
                      <>
                        <div className="h-px bg-slate-100 mt-4" />
                        <div className="h-px bg-slate-100 mt-4" />
                        <div className="h-px bg-slate-100 mt-4" />
                        <div className="h-px bg-slate-100 mt-4" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
