import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile, useIsPortrait } from "@/hooks/use-mobile";

// Import PB Sandwich assets
import kitchenBg from "@/assets/pb-sandwich/kitchen-bg.png";
import loafOfBread from "@/assets/pb-sandwich/loaf-of-bread.png";
import sliceOfBread from "@/assets/pb-sandwich/slice-of-bread.png";
import breadWithPb from "@/assets/pb-sandwich/bread-with-pb.png";
import peanutButter from "@/assets/pb-sandwich/peanut-butter.png";
import peanutButterOpen from "@/assets/pb-sandwich/peanut-butter-open.png";

type GameStep = {
  instruction: string;
  action: "drag" | "tap";
  targetId: string;
  itemId: string;
};

const steps: GameStep[] = [
  { instruction: "Drag a slice of bread onto the plate", action: "drag", targetId: "plate", itemId: "bread" },
  { instruction: "Drag another slice of bread onto the plate", action: "drag", targetId: "plate", itemId: "bread" },
  { instruction: "Tap the peanut butter jar to open it", action: "tap", targetId: "peanut-butter", itemId: "peanut-butter" },
  { instruction: "Drag peanut butter onto the bread", action: "drag", targetId: "bread-right", itemId: "peanut-butter" },
  { instruction: "Tap the plain bread to close the sandwich", action: "tap", targetId: "bread-left", itemId: "bread" },
];

export const PBSandwichDemo = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const [currentStep, setCurrentStep] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // For tap-to-select on mobile
  const [isOverTarget, setIsOverTarget] = useState(false);
  
  // Game state
  const [breadOnPlate, setBreadOnPlate] = useState(0); // 0, 1, or 2 slices
  const [pbJarOpen, setPbJarOpen] = useState(false);
  const [pbOnBread, setPbOnBread] = useState(false);
  const [sandwichClosed, setSandwichClosed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStepData = steps[currentStep];

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (currentStepData?.action === "drag" && currentStepData.itemId === itemId) {
      setDraggedItem(itemId);
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsOverTarget(false);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (currentStepData?.targetId === targetId && draggedItem) {
      setIsOverTarget(true);
    }
  };

  const handleDragLeave = () => {
    setIsOverTarget(false);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setIsOverTarget(false);
    
    if (currentStepData?.action === "drag" && currentStepData.targetId === targetId && draggedItem) {
      advanceStep();
    } else {
      toast.error("Try again!", { duration: 1000 });
    }
    setDraggedItem(null);
  };

  const handleTap = (itemId: string) => {
    if (currentStepData?.action === "tap" && currentStepData.targetId === itemId) {
      advanceStep();
    } else if (currentStepData?.action === "tap") {
      toast.error("Try again!", { duration: 1000 });
    }
  };

  // Mobile tap-to-select handler for drag items
  const handleItemSelect = (itemId: string) => {
    if (currentStepData?.action === "drag" && currentStepData.itemId === itemId) {
      setSelectedItem(itemId);
    }
  };

  // Mobile tap-to-place handler for targets
  const handleTargetTap = (targetId: string) => {
    if (selectedItem && currentStepData?.action === "drag" && currentStepData.targetId === targetId) {
      advanceStep();
      setSelectedItem(null);
    } else if (selectedItem) {
      toast.error("Try again!", { duration: 1000 });
      setSelectedItem(null);
    }
  };

  const advanceStep = () => {
    // Update visual state based on current step
    if (currentStep === 0) setBreadOnPlate(1);
    if (currentStep === 1) setBreadOnPlate(2);
    if (currentStep === 2) setPbJarOpen(true);
    if (currentStep === 3) setPbOnBread(true);
    if (currentStep === 4) {
      setSandwichClosed(true);
      setShowSuccess(true);
      toast.success("🥪 Sandwich Complete!", { duration: 2000 });
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast.success("Great job!", { duration: 800 });
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setBreadOnPlate(0);
    setPbJarOpen(false);
    setPbOnBread(false);
    setSandwichClosed(false);
    setShowSuccess(false);
    setDraggedItem(null);
    setSelectedItem(null);
  };

  // Show rotate prompt for mobile users in portrait mode
  if (isMobile && isPortrait) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="mb-6 animate-bounce">
            <Smartphone className="w-20 h-20 mx-auto text-primary rotate-90" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Please Rotate Your Device</h2>
          <p className="text-muted-foreground">
            Turn your device sideways to play this game. Landscape mode works best for the kitchen!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-6 max-w-4xl">
        {/* Header - compact on mobile */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={resetGame} className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4">
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            Reset
          </Button>
        </div>

        {/* Title - hide on mobile */}
        <div className={`text-center mb-6 ${isMobile ? "hidden" : ""}`}>
          <h1 className="text-3xl font-bold text-foreground mb-2">🥜 Peanut Butter Sandwich</h1>
          <p className="text-lg text-muted-foreground">Drag & Drop Recipe</p>
        </div>

        {/* Progress - hide on mobile and on completion */}
        {!showSuccess && (
          <div className={`mb-4 ${isMobile ? "hidden" : ""}`}>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Kitchen Scene - 3:2 aspect ratio */}
        <div 
          className="relative rounded-2xl border-4 border-amber-300 dark:border-amber-700 overflow-hidden aspect-[3/2]"
          style={{
            backgroundImage: `url(${kitchenBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Instruction - inside playable area (hide progress on completion) */}
          <div className="absolute top-2 left-2 right-2 z-10 bg-card/90 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-2 sm:p-3 text-center">
            {/* Mobile progress inside instruction box - hide on success */}
            {!showSuccess && (
              <div className={isMobile ? "mb-2" : "hidden"}>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-medium">Step {currentStep + 1}/{steps.length}</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-base sm:text-lg font-medium text-foreground">
              {showSuccess ? "🎉 You made a sandwich!" : currentStepData?.instruction}
            </p>
            {!showSuccess && (
              <p className="text-xs text-muted-foreground">
                {currentStepData?.action === "drag" 
                  ? (isMobile ? (selectedItem ? "👆 Tap where to place it" : "👆 Tap the item, then tap where to place it") : "👆 Drag the item") 
                  : "👆 Tap the item"}
              </p>
            )}
          </div>
          {/* Plate Drop Zone - center of counter */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-24 transition-all duration-300 touch-instant ${
              isOverTarget && currentStepData?.targetId === "plate" 
                ? "scale-110" 
                : ""
            } ${
              selectedItem && currentStepData?.targetId === "plate"
                ? "scale-105"
                : ""
            }`}
            onDragOver={(e) => handleDragOver(e, "plate")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "plate")}
            onTouchEnd={(e) => { if (isMobile) { e.preventDefault(); handleTargetTap("plate"); } }}
          >
            {/* Plate visual indicator */}
            <div className={`absolute inset-0 rounded-full border-4 border-dashed transition-colors ${
              isOverTarget && currentStepData?.targetId === "plate"
                ? "border-green-400 bg-green-400/20"
                : selectedItem && currentStepData?.targetId === "plate"
                  ? "border-green-400 bg-green-400/20"
                  : "border-amber-400/50 bg-amber-200/30"
            }`} />
            
            {/* Bread slices on plate */}
            {breadOnPlate >= 1 && !sandwichClosed && (
              <div 
                className="absolute bottom-2 left-2 cursor-pointer transition-transform hover:scale-105 touch-instant"
                onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleTap("bread-left"); }}
                onClick={() => handleTap("bread-left")}
              >
              <img 
                  src={sliceOfBread} 
                  alt="Bread slice" 
                  className="w-24 h-20 object-contain drop-shadow-lg"
                />
              </div>
            )}
            
            {breadOnPlate >= 2 && !sandwichClosed && (
              <div 
                className={`absolute bottom-2 right-2 transition-all touch-instant ${
                  isOverTarget && currentStepData?.targetId === "bread-right" 
                    ? "scale-110 ring-4 ring-green-400 rounded-lg" 
                    : selectedItem && currentStepData?.targetId === "bread-right"
                      ? "scale-105 ring-4 ring-green-400 rounded-lg"
                      : ""
                }`}
                onDragOver={(e) => { e.stopPropagation(); handleDragOver(e, "bread-right"); }}
                onDragLeave={(e) => { e.stopPropagation(); handleDragLeave(); }}
                onDrop={(e) => { e.stopPropagation(); handleDrop(e, "bread-right"); }}
                onTouchEnd={(e) => { if (isMobile) { e.preventDefault(); e.stopPropagation(); handleTargetTap("bread-right"); } }}
              >
                <img 
                  src={pbOnBread ? breadWithPb : sliceOfBread} 
                  alt="Bread slice" 
                  className="w-24 h-20 object-contain drop-shadow-lg"
                />
              </div>
            )}

            {/* Closed Sandwich */}
            {sandwichClosed && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-scale-in">
                <img 
                  src={breadWithPb} 
                  alt="Completed sandwich" 
                  className="w-28 h-24 object-contain drop-shadow-xl"
                />
                <img 
                  src={sliceOfBread} 
                  alt="Top bread" 
                  className="w-28 h-24 object-contain drop-shadow-xl absolute top-0 left-0 -translate-y-3"
                />
              </div>
            )}
          </div>

          {/* Loaf of Bread (Draggable source) */}
          {breadOnPlate < 2 && (
            <div
              draggable={!isMobile && currentStepData?.itemId === "bread" && currentStepData.action === "drag"}
              onDragStart={(e) => handleDragStart(e, "bread")}
              onDragEnd={handleDragEnd}
              onTouchEnd={(e) => { if (isMobile) { e.preventDefault(); handleItemSelect("bread"); } }}
              className={`absolute bottom-12 left-8 transition-all touch-instant ${
                isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
              } ${
                draggedItem === "bread" ? "opacity-50 scale-95" : ""
              } ${
                selectedItem === "bread" ? "scale-110 ring-4 ring-primary rounded-xl" : ""
              }`}
            >
              <img 
                src={loafOfBread} 
                alt="Loaf of bread" 
                className="w-40 h-32 object-contain drop-shadow-lg"
              />
            </div>
          )}

          <div
            draggable={!isMobile && currentStepData?.itemId === "peanut-butter" && currentStepData.action === "drag" && pbJarOpen}
            onDragStart={(e) => handleDragStart(e, "peanut-butter")}
            onDragEnd={handleDragEnd}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (currentStepData?.action === "tap" && currentStepData.targetId === "peanut-butter") {
                handleTap("peanut-butter");
              } else if (isMobile && pbJarOpen && currentStepData?.itemId === "peanut-butter") {
                handleItemSelect("peanut-butter");
              } else if (pbJarOpen && currentStepData?.itemId !== "peanut-butter") {
                // Easter egg: close the jar!
                setPbJarOpen(false);
                toast("You closed the jar!", { duration: 1000 });
              }
            }}
            onClick={() => {
              if (currentStepData?.action === "tap" && currentStepData.targetId === "peanut-butter") {
                handleTap("peanut-butter");
              } else if (isMobile && pbJarOpen && currentStepData?.itemId === "peanut-butter") {
                handleItemSelect("peanut-butter");
              } else if (pbJarOpen && currentStepData?.itemId !== "peanut-butter") {
                // Easter egg: close the jar!
                setPbJarOpen(false);
                toast("You closed the jar!", { duration: 1000 });
              }
            }}
            className={`absolute bottom-8 right-8 transition-all touch-instant ${
              draggedItem === "peanut-butter" ? "opacity-50 scale-95" : ""
            } ${
              selectedItem === "peanut-butter" ? "scale-110 ring-4 ring-primary rounded-xl" : ""
            } ${
              (currentStepData?.targetId === "peanut-butter" || 
               (currentStepData?.itemId === "peanut-butter" && pbJarOpen))
                ? "cursor-pointer" 
                : "cursor-default"
            }`}
          >
            <img 
              src={pbJarOpen ? peanutButterOpen : peanutButter} 
              alt="Peanut Butter" 
              className="w-32 h-44 object-contain drop-shadow-lg"
            />
          </div>

          {/* Success Panel - positioned at top like the instruction/progress bar */}
          {showSuccess && (
            <div className="absolute top-2 left-2 right-2 z-20 animate-scale-in">
              <div className="bg-card p-3 sm:p-4 rounded-xl shadow-xl text-center border-2 border-green-400">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">Delicious! You made a sandwich!</h2>
                <Button size="sm" onClick={resetGame} className="gap-1 text-xs sm:text-sm">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  Make Another
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>Drag items or tap when indicated. Highlighted items are interactive.</p>
        </div>
      </div>
    </div>
  );
};
