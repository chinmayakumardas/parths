"use client";

import React from "react";
import { X } from "lucide-react";

type DeleteGoalDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteGoalDialog({ isOpen, onClose, onConfirm }: DeleteGoalDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-lg border max-w-sm w-full p-5 space-y-4 relative">
        {/* Top Right Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pr-6">
          <h3 className="text-base font-semibold text-slate-900">Delete Goal</h3>
          <p className="text-xs text-muted-foreground">
            Are you sure you want to delete this goal? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}