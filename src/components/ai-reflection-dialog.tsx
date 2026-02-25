"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generateReflectivePrompts } from '@/ai/flows/generate-reflective-prompts';
import { InventoryCategory } from '@/lib/types';

interface AIReflectionDialogProps {
  category: InventoryCategory;
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIReflectionDialog({ category, text, isOpen, onClose }: AIReflectionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const result = await generateReflectivePrompts({
        entryCategory: category === ' resentments' ? 'resentments' : (category === 'fears' ? 'fears' : 'harms'),
        entryText: text
      });
      setPrompts(result.clarifyingPrompts);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && text.trim()) {
      handleGenerate();
    } else {
      setPrompts(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-white rounded-2xl overflow-hidden p-0">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-accent p-6 text-white relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold">Pathway Reflection</DialogTitle>
          </div>
          <DialogDescription className="text-white/80 font-medium leading-relaxed">
            AI-generated questions to help you uncover your part and find clarity.
          </DialogDescription>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 text-sm">
            "{text}"
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse text-sm">Generating insightful prompts...</p>
            </div>
          ) : prompts ? (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                {prompts.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
              <Button 
                onClick={handleGenerate} 
                variant="outline" 
                className="w-full mt-4 flex items-center justify-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate Questions
              </Button>
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8 text-sm">No entry text provided for reflection.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
