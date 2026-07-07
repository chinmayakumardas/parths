import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Goal = {
  id: string;
  name: string;
  description?: string;
};

interface EditGoalDialogProps {
  goal: Goal | null;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
}

export function EditGoalDialog({ goal, onClose, onSave }: EditGoalDialogProps) {
  // Pass whether a goal object is active straight to the Shadcn controlled state
  const isCurrentlyOpen = !!goal;

  return (
    <Dialog open={isCurrentlyOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Goal</DialogTitle>
        </DialogHeader>
        {/* Form elements go here */}
      </DialogContent>
    </Dialog>
  );
}