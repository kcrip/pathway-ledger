// src/components/security-dialog.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityDialogProps {
  isOpen: boolean;
  mode: 'setup' | 'unlock';
  onUnlock: (password: string) => void;
  onReset?: () => void;
  isError?: boolean;
}

export function SecurityDialog({ isOpen, mode, onUnlock, onReset, isError }: SecurityDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    if (mode === 'setup' && password !== confirmPassword) {
      // Simple client-side validation for setup
      return;
    }

    onUnlock(password);
  };

  // Reset internal state when dialog opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setShowResetConfirm(false);
    }
  }, [isOpen, mode]);

  const isSetup = mode === 'setup';

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto bg-slate-100 p-3 rounded-full mb-4">
            {isSetup ? <ShieldCheck className="w-8 h-8 text-primary" /> : <Lock className="w-8 h-8 text-slate-600" />}
          </div>
          <DialogTitle className="text-center text-xl">
            {isSetup ? "Secure Your Inventory" : "Unlock Pathway Ledger"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {isSetup
              ? "Create a password to encrypt your data. Your inventory is stored locally and can only be accessed with this password."
              : "Enter your password to decrypt and access your personal inventory."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={isSetup ? "Create Password" : "Enter Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
              autoFocus
            />
          </div>

          {isSetup && (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`text-center ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 text-center font-medium">Passwords do not match</p>
              )}
            </div>
          )}

          {isError && !isSetup && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 text-xs font-medium">
                Incorrect password. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full font-bold"
            disabled={!password || (isSetup && password !== confirmPassword)}
          >
            {isSetup ? "Encrypt & Start" : "Unlock"}
          </Button>
        </form>

        {!isSetup && onReset && (
          <div className="text-center pt-2 border-t">
            {!showResetConfirm ? (
              <Button variant="link" className="text-xs text-slate-400" onClick={() => setShowResetConfirm(true)}>
                Forgot Password?
              </Button>
            ) : (
              <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                <p className="text-xs text-red-600 font-bold px-4">
                  Warning: Resetting will delete all existing data. This cannot be undone.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={onReset}>Yes, Delete Data</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
