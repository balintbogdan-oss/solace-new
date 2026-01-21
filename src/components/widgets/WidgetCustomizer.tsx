import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { Widget } from './types';

interface WidgetCustomizerProps {
  availableWidgets: Widget[];
  enabledWidgets: Widget[];
  onWidgetsChange: (widgets: Widget[]) => void;
}

export function WidgetCustomizer({ 
  availableWidgets, 
  enabledWidgets, 
  onWidgetsChange 
}: WidgetCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const addWidget = (widget: Widget) => {
    onWidgetsChange([...enabledWidgets, widget]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='bg-white dark:bg-neutral-900 border text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800' size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Customize widgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-none  backdrop-blur-lg bg-white/50 dark:bg-gray-900/50">
        <DialogHeader>
          <DialogTitle>Add Widgets</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {availableWidgets.map((widget) => {
              const isEnabled = enabledWidgets.some(w => w.id === widget.id);
              return (
                <div
                  key={widget.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isEnabled ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{widget.title}</h4>
                      {isEnabled && (
                        <span className="flex items-center text-sm text-positive">
                          <Check className="h-4 w-4 mr-1" />
                          Added
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{widget.description}</p>
                  </div>
                  {!isEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addWidget(widget)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 