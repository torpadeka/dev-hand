import { Button } from "./ui/button";

interface AnswerConfirmationProps {
  onConfirm: () => void;
}

export function AnswerConfirmation({ onConfirm }: AnswerConfirmationProps) {
  return (
    <div className="text-primary-foreground absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex justify-center items-center flex-col rounded-xl bg-background p-4">
        <p>Your Answer Has Been Submited</p>
        <Button
          className="button bg-popover-foreground m-2"
          onClick={onConfirm}
        >
          OK
        </Button>
      </div>
    </div>
  );
}
