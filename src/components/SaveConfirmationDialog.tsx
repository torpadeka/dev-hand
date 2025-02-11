import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface SaveConfirmationDialogProps {
  disable: Boolean;
  onConfirm: () => void;
}

export function SaveConfirmationDialog({
  disable,
  onConfirm,
}: SaveConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setIsOpen(false); // Close the dialog
    onConfirm(); // Call the parent's function
  };

  return (
    <div>
      <a
        href="#_"
        className={`relative inline-flex group items-center justify-center px-2 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-chart-3 active:shadow-none shadow-lg bg-gradient-to-tr from-chart-3/80 to-chart-3/90 border-chart-3 text-white rounded overflow-hidden transition-all duration-300 ${
          disable
            ? "opacity-50 cursor-not-allowed pointer-events-none select-none"
            : "hover:opacity-90"
        }`}
        onClick={!disable ? handleButtonClick : undefined}
      >
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-40 group-hover:h-40 opacity-10"></span>
        <span className="relative">Submit Question</span>
      </a>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this question?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm Submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
