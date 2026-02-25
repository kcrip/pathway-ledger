
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Copy, 
  Plus, 
  Trash2, 
  Info, 
  CheckCircle2, 
  FileSpreadsheet, 
  Sparkles,
  Upload,
  Save,
  LifeBuoy,
  ClipboardPaste,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  InventoryData, 
  InventoryCategory, 
  InventoryRow, 
  INVENTORY_CONFIG, 
  INITIAL_DATA 
} from '@/lib/types';
import { AIReflectionDialog } from '@/components/ai-reflection-dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  const [data, setData] = useState<InventoryData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<InventoryCategory>('resentments');
  const [isMounted, setIsMounted] = useState(false);
  const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [reflectionState, setReflectionState] = useState<{
    isOpen: boolean;
    text: string;
    category: InventoryCategory;
  }>({
    isOpen: false,
    text: '',
    category: 'resentments'
  });
  const { toast } = useToast();

  // Hydration safety
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('pathway_ledger_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('pathway_ledger_data', JSON.stringify(data));
    }
  }, [data, isMounted]);

  const updateCell = (tab: InventoryCategory, id: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [tab]: prev[tab].map(row => row.id === id ? { ...row, [field]: value } : row)
    }));
  };

  const addRow = (tab: InventoryCategory) => {
    const newId = data[tab].length > 0 ? Math.max(...data[tab].map(r => r.id)) + 1 : 1;
    const newRow: InventoryRow = { id: newId, col1: '', col2: '', col3: '', col4: '', col5: '' };
    setData(prev => ({
      ...prev,
      [tab]: [...prev[tab], newRow]
    }));
  };

  const deleteRow = (tab: InventoryCategory, id: number) => {
    setData(prev => ({
      ...prev,
      [tab]: prev[tab].filter(row => row.id !== id)
    }));
  };

  const handleCopyTSV = async () => {
    const tabData = data[activeTab];
    const tabCols = INVENTORY_CONFIG[activeTab].cols;
    
    const headerRow = tabCols.map(c => c.header).join('\t');
    const dataRows = tabData.map(row => {
      return tabCols.map(c => {
        let val = (row[c.key as keyof InventoryRow] || '') as string;
        val = val.replace(/\t/g, ' ').replace(/\n/g, ' ');
        return val;
      }).join('\t');
    }).join('\n');
    
    const tsv = `${headerRow}\n${dataRows}`;
    
    try {
      await navigator.clipboard.writeText(tsv);
      toast({
        title: "Copied!",
        description: "Tab-separated data ready to paste into Google Sheets (Cell A1).",
      });
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleExportCSV = () => {
    const tabData = data[activeTab];
    const tabCols = INVENTORY_CONFIG[activeTab].cols;
    
    const headerRow = tabCols.map(c => `"${c.header}"`).join(',');
    const dataRows = tabData.map(row => {
      return tabCols.map(c => {
        let val = (row[c.key as keyof InventoryRow] || '') as string;
        val = val.replace(/"/g, '""');
        return `"${val}"`;
      }).join(',');
    }).join('\n');
    
    const csv = `\ufeff${headerRow}\n${dataRows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pathway_Ledger_${activeTab}_Inventory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split(/\r?\n/).filter(line => line.trim());
      
      // Basic CSV parser (handles simple quotes, but not all edge cases)
      const parseCSVLine = (line: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i+1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      const rows = lines.slice(1).map((line, idx) => {
        const values = parseCSVLine(line);
        const row: InventoryRow = { id: Date.now() + idx };
        INVENTORY_CONFIG[activeTab].cols.forEach((col, i) => {
          row[col.key as keyof InventoryRow] = values[i] || '';
        });
        return row;
      });

      setData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], ...rows]
      }));
      
      toast({ title: "Import Successful", description: `Added ${rows.length} rows to ${activeTab}.` });
      event.target.value = ''; // Reset input
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!pastedContent.trim()) return;

    const lines = pastedContent.split(/\r?\n/).filter(line => line.trim());
    const isTSV = pastedContent.includes('\t');
    const separator = isTSV ? '\t' : ',';

    const rows = lines.map((line, idx) => {
      const values = line.split(separator).map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      const row: InventoryRow = { id: Date.now() + idx };
      INVENTORY_CONFIG[activeTab].cols.forEach((col, i) => {
        row[col.key as keyof InventoryRow] = values[i] || '';
      });
      return row;
    });

    setData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], ...rows]
    }));

    toast({ title: "Pasted Data Imported", description: `Added ${rows.length} rows to ${activeTab}.` });
    setPastedContent('');
    setIsPasteDialogOpen(false);
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pathway_Ledger_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setData(imported);
        toast({ title: "Success", description: "Your backup has been loaded successfully." });
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Invalid backup file format." });
      }
    };
    reader.readAsText(file);
  };

  if (!isMounted) return null;

  const currentConfig = INVENTORY_CONFIG[activeTab];
  const currentData = data[activeTab];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg shadow-primary/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
                Pathway Ledger
              </h1>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              A private, secure workspace for your moral inventory. Your data never leaves your browser unless you export it.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('import-json')?.click()}
              className="gap-2 border-slate-200 hover:bg-white"
            >
              <Upload className="w-4 h-4" />
              Full Import
              <input 
                id="import-json" 
                type="file" 
                className="hidden" 
                accept=".json" 
                onChange={handleImportBackup} 
              />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportBackup}
              className="gap-2 border-slate-200 hover:bg-white"
            >
              <Save className="w-4 h-4" />
              Full Backup
            </Button>
            <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block" />
            <Button 
              variant="secondary"
              onClick={() => setIsPasteDialogOpen(true)}
              className="gap-2 shadow-sm border border-slate-200"
            >
              <ClipboardPaste className="w-4 h-4" />
              Paste Data
            </Button>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('import-csv')?.click()}
              className="gap-2 border-slate-200"
            >
              <FileDown className="w-4 h-4" />
              Import CSV
              <input 
                id="import-csv" 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={handleImportCSV} 
              />
            </Button>
            <Button 
              onClick={handleCopyTSV}
              className="gap-2 shadow-sm"
            >
              <Copy className="w-4 h-4" />
              Copy for Sheets
            </Button>
          </div>
        </header>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as InventoryCategory)} 
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TabsList className="bg-slate-200/50 p-1.5 h-auto rounded-2xl border border-slate-200/50">
              <TabsTrigger value="resentments" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all">
                Resentments
              </TabsTrigger>
              <TabsTrigger value="fears" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all">
                Fears
              </TabsTrigger>
              <TabsTrigger value="harms" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all">
                Harms
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-xl">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Reflective Tools Enabled</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
            <div className="bg-blue-100/50 p-2 rounded-lg">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                {currentConfig.description}
              </p>
              <div className="flex gap-4 pt-1">
                <button 
                  onClick={handleExportCSV}
                  className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  Export {activeTab} CSV
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col transition-all">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    {currentConfig.cols.map((col) => (
                      <th key={col.key} className={`px-6 py-4 font-bold text-slate-800 text-[13px] uppercase tracking-wider border-r border-slate-200/50 last:border-r-0 ${col.width}`}>
                        {col.header}
                      </th>
                    ))}
                    <th className="px-6 py-4 font-bold text-slate-800 text-[13px] uppercase tracking-wider w-28 text-center">
                      Reflect
                    </th>
                    <th className="p-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/30 group transition-colors">
                      {currentConfig.cols.map((col) => (
                        <td key={col.key} className="p-0 border-r border-slate-100/50 last:border-r-0 align-top">
                          <textarea
                            value={(row[col.key as keyof InventoryRow] || '') as string}
                            onChange={(e) => updateCell(activeTab, row.id, col.key, e.target.value)}
                            placeholder={col.placeholder}
                            className="w-full min-h-[120px] p-5 bg-transparent resize-y outline-none focus:ring-2 focus:ring-primary/20 focus:bg-primary/5 text-sm text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed transition-all"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-6 align-top text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const combinedText = currentConfig.cols
                              .map(c => row[c.key as keyof InventoryRow])
                              .filter(Boolean)
                              .join(' ');
                            setReflectionState({ isOpen: true, text: combinedText, category: activeTab });
                          }}
                          className="text-accent hover:text-accent-foreground hover:bg-accent/10 rounded-xl"
                          disabled={!currentConfig.cols.some(c => row[c.key as keyof InventoryRow])}
                        >
                          <Sparkles className="w-5 h-5" />
                        </Button>
                      </td>
                      <td className="p-3 align-top text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRow(activeTab, row.id)}
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => addRow(activeTab)}
                className="gap-2 bg-white border-slate-200 text-primary hover:bg-primary/5 font-semibold px-6 py-6 rounded-2xl"
              >
                <Plus className="w-5 h-5" />
                Add Blank Row
              </Button>
            </div>
          </div>
        </Tabs>

        <footer className="pt-8 pb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <LifeBuoy className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-widest">Self-Reliance Failed Us</span>
          </div>
          <p className="text-slate-400 text-xs">
            Pathway Ledger is a local-first utility. No data is stored on our servers.
          </p>
          <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/license" className="hover:text-primary transition-colors">License</Link>
          </div>
        </footer>
      </div>

      <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Paste Spreadsheet Data</DialogTitle>
            <DialogDescription>
              Copy rows from Google Sheets or Excel and paste them here. The columns should match the order in the current tab.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Paste your TSV or CSV data here..." 
              className="min-h-[300px] font-mono text-xs rounded-xl"
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPasteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePasteImport} disabled={!pastedContent.trim()}>Import Rows</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIReflectionDialog
        isOpen={reflectionState.isOpen}
        text={reflectionState.text}
        category={reflectionState.category}
        onClose={() => setReflectionState(prev => ({ ...prev, isOpen: false }))}
      />
      <Toaster />
    </div>
  );
}
