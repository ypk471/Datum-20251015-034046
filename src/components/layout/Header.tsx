import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
type HeaderProps = {
  onAddDocument: () => void;
};
export function Header({ onAddDocument }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        Datum
      </h1>
      <div className="flex items-center gap-2">
        <Button onClick={onAddDocument} className="transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Document
        </Button>
        <ThemeToggle className="relative top-0 right-0" />
      </div>
    </header>
  );
}