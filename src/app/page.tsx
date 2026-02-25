"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Copy, 
  Plus, 
  Trash2, 
  Info, 
  FileSpreadsheet, 
  Sparkles,
  Upload,
  Save,
  LifeBuoy,
  ClipboardPaste,
  Rows,
  LayoutDashboard,
  Search,
  ChevronRight,
  User,
  BookOpen,
  Tag
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
import { FifthStepViewer } from '@/components/fifth-step-viewer';
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
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TabValue = InventoryCategory | 'summary' | 'fifth-step';

export default function App() {
  const [data, setData] = useState<InventoryData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<TabValue>('resentments');
  const [isMounted, setIsMounted] = useState(false);
  const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFifthStepMode, setIsFifthStepMode] = useState(false);
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

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('pathway_ledger_data', JSON.stringify(data));
    }
  }, [data, isMounted]);

  const groupedData = useMemo(() => {
    const map = new Map<string, { 
      resentments: InventoryRow[], 
      fears: InventoryRow[], 
      harms: InventoryRow[] 
    }>();

    const addToMap = (category: InventoryCategory, rows: InventoryRow[]) => {
      rows.forEach(row => {
        const entity = (row.col1 || 'Unspecified').trim();
        if (!map.has(entity)) {
          map.set(entity, { resentments: [], fears: [], harms: [] });
        }
        map.get(entity)![category].push(row);
      });
    };

    addToMap('resentments', data.resentments);
    addToMap('fears', data.fears);
    addToMap('harms', data.harms);

    return Array.from(map.entries())
      .map(([name, counts]) => ({ name, ...counts }))
      .sort((a, b) => {
        const totalA = a.resentments.length + a.fears.length + a.harms.length;
        const totalB = b.resentments.length + b.fears.length + b.harms.length;
        return totalB - totalA;
      });
  }, [data]);

  const filteredSummary = useMemo(() => {
    if (!searchQuery.trim()) return groupedData;
    const lowerQuery = searchQuery.toLowerCase();
    return groupedData.filter(e => e.name.toLowerCase().includes(lowerQuery));
  }, [groupedData, searchQuery]);

  const updateCell = (tab: InventoryCategory, id: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [tab]: prev[tab].map(row => row.id === id ? { ...row, [field]: value } : row)
    }));
  };

  const toggleSuggestion = (tab: InventoryCategory, rowId: number, field: string, suggestion: string) => {
    const row = data[tab].find(r => r.id === rowId);
    if (!row) return;

    const currentVal = (row[field as keyof InventoryRow] || '') as string;
    const items = currentVal.split(',').map(i => i.trim()).filter(Boolean);
    
    let newVal;
    if (items.includes(suggestion)) {
      newVal = items.filter(i => i !== suggestion).join(', ');
    } else {
      newVal = [...items, suggestion].join(', ');
    }
    
    updateCell(tab, rowId, field, newVal);
  };

  const addRow = (tab: InventoryCategory) => {
    const newId = Date.now();
    const newRow: InventoryRow = { id: newId, col1: '', col2: '', col3: '', col4: '', col5: '' };
    setData(prev => ({
      ...prev,
      [tab]: [...prev[tab], newRow]
    }));
  };

  const duplicateRow = (tab: InventoryCategory, row: InventoryRow) => {
    const newRow: InventoryRow = { 
      id: Date.now(),
      col1: row.col1, // Keep the entity (person/institution)
      col2: '',       // Clear everything else for a fresh entry for the same person
      col3: '',
      col4: '',
      col5: '',
      fifthStepNotes: ''
    };
    setData(prev => ({
      ...prev,
      [tab]: [...prev[tab], newRow]
    }));
    toast({
      description: `Added another entry for "${row.col1 || 'Unspecified'}".`,
    });
  };

  const deleteRow = (tab: InventoryCategory, id: number) => {
    setData(prev => ({
      ...prev,
      [tab]: prev[tab].filter(row => row.id !== id)
    }));
  };

  const handleCopyTSV = async () => {
    const cat = activeTab === 'summary' || activeTab === 'fifth-step' ? 'resentments' : activeTab;
    const tabData = data[cat as InventoryCategory];
    const tabCols = INVENTORY_CONFIG[cat as InventoryCategory].cols;
    
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
        description: `Current ${activeTab} data ready to paste into Sheets.`,
      });
    } catch (err) {
      console.error('Failed to copy', err);
    }
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

  const handlePasteImport = () => {
    if (!pastedContent.trim() || activeTab === 'summary' || activeTab === 'fifth-step') return;

    const lines = pastedContent.split(/\r?\n/).filter(line => line.trim());
    const isTSV = pastedContent.includes('\t');
    const separator = isTSV ? '\t' : ',';

    const rows = lines.map((line, idx) => {
      const values = line.split(separator).map(v => v.trim().replace(/^"(.*)"$/, '$1'));
      const row: InventoryRow = { id: Date.now() + idx };
      INVENTORY_CONFIG[activeTab as InventoryCategory].cols.forEach((col, i) => {
        row[col.key as keyof InventoryRow] = values[i] || '';
      });
      return row;
    });

    setData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab as InventoryCategory], ...rows]
    }));

    toast({ title: "Pasted Data Imported", description: `Added ${rows.length} rows to ${activeTab}.` });
    setPastedContent('');
    setIsPasteDialogOpen(false);
  };

  if (!isMounted) return null;

  if (isFifthStepMode) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <FifthStepViewer 
          data={data} 
          onUpdateNote={(cat, id, note) => updateCell(cat, id, 'fifthStepNotes', note)}
          onClose={() => setIsFifthStepMode(false)}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
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
                A secure worksheet for your 4th step moral inventory. Your data stays in your browser.
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
                <input id="import-json" type="file" className="hidden" accept=".json" onChange={handleImportBackup} />
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
                disabled={activeTab === 'summary'}
              >
                <ClipboardPaste className="w-4 h-4" />
                Paste Data
              </Button>
              <Button 
                onClick={handleCopyTSV}
                className="gap-2 shadow-sm"
                disabled={activeTab === 'summary'}
              >
                <Copy className="w-4 h-4" />
                Copy for Sheets
              </Button>
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <TabsList className="bg-slate-200/50 p-1.5 h-auto rounded-2xl border border-slate-200/50 flex-wrap sm:flex-nowrap">
                <TabsTrigger value="resentments" className="rounded-xl px-4 md:px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all">
                  Resentments
                </TabsTrigger>
                <TabsTrigger value="fears" className="rounded-xl px-4 md:px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all">
                  Fears
                </TabsTrigger>
                <TabsTrigger value="harms" className="rounded-xl px-4 md:px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all">
                  Harms
                </TabsTrigger>
                <TabsTrigger value="summary" className="rounded-xl px-4 md:px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-sm transition-all gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Entity Summary
                </TabsTrigger>
              </TabsList>

              <Button 
                onClick={() => setIsFifthStepMode(true)}
                className="gap-2 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl shadow-slate-900/10 px-6"
              >
                <BookOpen className="w-4 h-4" />
                Enter 5th Step Mode
              </Button>
            </div>

            <TabsContent value="summary" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Inventory Visualization</h3>
                  <p className="text-slate-500 text-sm">Collated view of all entities across your worksheet to help you see patterns and focus your work.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search people/institutions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white border-slate-200 rounded-xl focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSummary.length > 0 ? (
                  filteredSummary.map((entity) => (
                    <Card key={entity.name} className="border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400 group-hover:text-primary transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <CardTitle className="text-base font-bold text-slate-800 line-clamp-1">
                            {entity.name}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-white text-slate-500 font-bold">
                          {entity.resentments.length + entity.fears.length + entity.harms.length} Total
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-xl bg-red-50/50 border border-red-100">
                            <div className="text-xs font-bold text-red-600 uppercase tracking-tighter mb-1">Resent</div>
                            <div className="text-lg font-black text-red-700">{entity.resentments.length}</div>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-orange-50/50 border border-orange-100">
                            <div className="text-xs font-bold text-orange-600 uppercase tracking-tighter mb-1">Fears</div>
                            <div className="text-lg font-black text-orange-700">{entity.fears.length}</div>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-blue-50/50 border border-blue-100">
                            <div className="text-xs font-bold text-blue-600 uppercase tracking-tighter mb-1">Harms</div>
                            <div className="text-lg font-black text-blue-700">{entity.harms.length}</div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-between text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 px-3"
                            onClick={() => {
                              setSearchQuery(entity.name);
                              setActiveTab('resentments');
                            }}
                          >
                            Drill Down into Resentments
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="inline-flex bg-slate-100 p-4 rounded-full text-slate-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-medium">No entities found. Start by adding items to your inventory tabs.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {['resentments', 'fears', 'harms'].map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="bg-white/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl p-5 flex gap-4 items-start shadow-sm mb-6">
                  <div className="bg-blue-100/50 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {INVENTORY_CONFIG[cat as InventoryCategory].description}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col transition-all">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200">
                          {INVENTORY_CONFIG[cat as InventoryCategory].cols.map((col) => (
                            <th key={col.key} className={`px-6 py-4 font-bold text-slate-800 text-[13px] uppercase tracking-wider border-r border-slate-200/50 last:border-r-0 ${col.width}`}>
                              {col.header}
                            </th>
                          ))}
                          <th className="px-6 py-4 font-bold text-slate-800 text-[13px] uppercase tracking-wider w-36 text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data[cat as InventoryCategory].map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/30 group transition-colors">
                            {INVENTORY_CONFIG[cat as InventoryCategory].cols.map((col) => (
                              <td key={col.key} className="p-0 border-r border-slate-100/50 last:border-r-0 align-top group/cell relative">
                                <textarea
                                  value={(row[col.key as keyof InventoryRow] || '') as string}
                                  onChange={(e) => updateCell(cat as InventoryCategory, row.id, col.key, e.target.value)}
                                  placeholder={col.placeholder}
                                  className="w-full min-h-[160px] p-5 bg-transparent resize-y outline-none focus:ring-2 focus:ring-primary/20 focus:bg-primary/5 text-sm text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed transition-all pb-10"
                                />
                                
                                {col.suggestions && (
                                  <div className="absolute bottom-2 left-2 flex gap-1 items-center">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-primary rounded-full">
                                          <Tag className="h-3 w-3" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-64 p-3 rounded-xl shadow-2xl border-slate-200" align="start">
                                        <div className="space-y-2">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Quick Picks</p>
                                          <div className="flex flex-wrap gap-1.5">
                                            {col.suggestions.map((suggestion) => {
                                              const isActive = ((row[col.key as keyof InventoryRow] || '') as string).includes(suggestion);
                                              return (
                                                <Badge
                                                  key={suggestion}
                                                  variant={isActive ? "default" : "outline"}
                                                  className={`cursor-pointer px-2 py-0.5 text-[10px] transition-all hover:scale-105 ${isActive ? 'bg-primary' : 'hover:bg-slate-50'}`}
                                                  onClick={() => toggleSuggestion(cat as InventoryCategory, row.id, col.key, suggestion)}
                                                >
                                                  {suggestion}
                                                </Badge>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Suggestions</span>
                                  </div>
                                )}
                              </td>
                            ))}
                            <td className="px-4 py-6 align-top">
                              <div className="flex items-center justify-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const combinedText = INVENTORY_CONFIG[cat as InventoryCategory].cols
                                          .map(c => row[c.key as keyof InventoryRow])
                                          .filter(Boolean)
                                          .join(' ');
                                        setReflectionState({ isOpen: true, text: combinedText, category: cat as InventoryCategory });
                                      }}
                                      className="text-primary hover:text-white hover:bg-primary rounded-lg"
                                      disabled={!INVENTORY_CONFIG[cat as InventoryCategory].cols.some(c => row[c.key as keyof InventoryRow])}
                                    >
                                      <Sparkles className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>AI Reflection</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => duplicateRow(cat as InventoryCategory, row)}
                                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                      <Rows className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add another cause for this entity</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deleteRow(cat as InventoryCategory, row.id)}
                                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Row</TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-6 bg-slate-50/50 border-t border-slate-200">
                    <Button
                      variant="outline"
                      onClick={() => addRow(cat as InventoryCategory)}
                      className="gap-2 bg-white border-slate-200 text-primary hover:bg-primary/5 font-semibold px-6 py-6 rounded-2xl"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Entry
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <footer className="pt-8 pb-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <LifeBuoy className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-widest">Self-Reliance Failed Us</span>
            </div>
            <p className="text-slate-400 text-xs">
              Pathway Ledger is an open-source utility for personal recovery work.
            </p>
            <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/license" className="hover:text-primary transition-colors">License</Link>
            </div>
          </footer>
        </div>

        <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Paste Worksheet Data</DialogTitle>
              <DialogDescription>
                Copy rows from Google Sheets or Excel and paste them here. Columns must match the order in the current tab.
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
    </TooltipProvider>
  );
}
