import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile, useIsPortrait } from "@/hooks/use-mobile";
import { RecipeData, DifficultyTier } from "@/lib/games/recipes/recipeTypes";
import kitchenBg from "@/assets/kitchen/kitchen-bg.png";
import jellySplatImg from "@/assets/kitchen/jelly-toast/jelly-splat.webp";

interface KitchenDashGameProps {
  recipe: RecipeData;
  difficulty: DifficultyTier;
  onBack: () => void;
  onChangeDifficulty?: () => void;
  onNewRecipe?: () => void;
}

export const KitchenDashGame = ({ recipe, difficulty, onBack, onChangeDifficulty, onNewRecipe }: KitchenDashGameProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();

  const [currentStep, setCurrentStep] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isOverTarget, setIsOverTarget] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wrongItem, setWrongItem] = useState(false);
  const [bonusConfettiEmoji, setBonusConfettiEmoji] = useState<string | null>(null);
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneFading, setCutsceneFading] = useState(false);
  const [cutsceneData, setCutsceneData] = useState<{ dimOverlay?: boolean; slideDownImage?: string; centerScaleImage?: string } | null>(null);
  const [splatEffect, setSplatEffect] = useState(false);
  const [fadingAnimTarget, setFadingAnimTarget] = useState<string | null>(null);
  const skipDefaultSceneChanges = useRef(false);
  const lastDraggedItem = useRef<string | null>(null);

  // Track which objects are visible and their current images
  const [visibleObjects, setVisibleObjects] = useState<Set<string>>(
    new Set(recipe.initialVisibleObjects)
  );
  const [objectImages, setObjectImages] = useState<Record<string, string>>(() => {
    const images: Record<string, string> = {};
    Object.entries(recipe.sceneObjects).forEach(([id, obj]) => {
      images[id] = obj.image;
    });
    return images;
  });
  const [objectPositions, setObjectPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [objectSizes, setObjectSizes] = useState<Record<string, { width: number; height: number }>>({});

  const stepData = recipe.steps[currentStep];

  const advanceStep = useCallback(() => {
    const step = recipe.steps[currentStep];

    // Apply scene changes (image swaps) — skip if alt drop target already applied its own
    if (step.sceneChanges && !skipDefaultSceneChanges.current) {
      setObjectImages((prev) => ({ ...prev, ...step.sceneChanges }));
    }
    skipDefaultSceneChanges.current = false;
    if (step.objectPositionChanges) {
      setObjectPositions((prev) => ({ ...prev, ...step.objectPositionChanges }));
    }
    if (step.objectSizeChanges) {
      setObjectSizes((prev) => ({ ...prev, ...step.objectSizeChanges }));
    }

    // Hide items after drop — swap default drag item id with actual dragged item
    if (step.hideAfterDrop) {
      const defaultDragId = step.dragItem?.id;
      const actualDragId = lastDraggedItem.current;
      setVisibleObjects((prev) => {
        const next = new Set(prev);
        step.hideAfterDrop!.forEach((id) => {
          if (id === defaultDragId && actualDragId && actualDragId !== defaultDragId) {
            next.delete(actualDragId);
          } else {
            next.delete(id);
          }
        });
        return next;
      });
    }
    lastDraggedItem.current = null;

    // Check if next step has show/hide directives
    const nextStep = recipe.steps[currentStep + 1];
    if (nextStep) {
      if (nextStep.showOnStep) {
        setVisibleObjects((prev) => {
          const next = new Set(prev);
          nextStep.showOnStep!.forEach((id) => next.add(id));
          return next;
        });
      }
      if (nextStep.hideOnStep) {
        setVisibleObjects((prev) => {
          const next = new Set(prev);
          nextStep.hideOnStep!.forEach((id) => next.delete(id));
          return next;
        });
      }
    }

    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast.success("Great job!", { duration: 800 });
    } else {
      setShowSuccess(true);
      toast.success(`🎉 ${recipe.name} Complete!`, { duration: 2000 });
    }
  }, [currentStep, recipe]);

  const showWrongFeedback = useCallback(() => {
    setWrongItem(true);
    setTimeout(() => setWrongItem(false), 800);
  }, []);

  const isAcceptedDragItem = useCallback((itemId: string) => {
    if (!stepData?.dragItem) return false;
    if (stepData.dragItem.id === itemId) return true;
    return stepData.alternativeDragIds?.includes(itemId) ?? false;
  }, [stepData]);

  const isAcceptedDropTarget = useCallback((targetId: string) => {
    const currentImg = objectImages[targetId] ?? recipe.sceneObjects[targetId]?.image ?? "";
    // Primary drop target
    if (stepData?.dropTarget === targetId) {
      if (stepData.dropTargetSkipIfHasImage?.includes(currentImg)) return false;
      return true;
    }
    // Alternative drop targets
    const alt = stepData?.alternativeDropTargets?.find(a => a.id === targetId);
    if (alt) {
      if (alt.skipIfHasImage?.includes(currentImg)) return false;
      return true;
    }
    return false;
  }, [stepData, objectImages, recipe.sceneObjects]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (stepData?.action !== "drag") return;
    // Allow dragging any draggable item, or the current step's drag item
    const objDef = recipe.sceneObjects[itemId];
    if (!objDef?.isDraggable && !isAcceptedDragItem(itemId)) return;

    // Show wrong feedback if not the correct item
    if (!isAcceptedDragItem(itemId)) {
      showWrongFeedback();
    }

    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";

    // Use drag image if provided for the correct item
    if (stepData.dragItem?.id === itemId && stepData.dragItem.dragImage) {
      const dragImg = stepData.dragItem.dragImage;
      const img = document.createElement("img");
      img.src = dragImg;
      img.style.width = "80px";
      img.style.height = "80px";
      img.style.objectFit = "contain";
      img.style.position = "absolute";
      img.style.top = "-9999px";
      document.body.appendChild(img);
      e.dataTransfer.setDragImage(img, 40, 40);
      requestAnimationFrame(() => document.body.removeChild(img));
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (isAcceptedDropTarget(targetId) && draggedItem) {
      setIsOverTarget(targetId);
    }
  };

  const handleDragLeave = () => {
    setIsOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setIsOverTarget(null);

    if (stepData?.action === "drag" && isAcceptedDropTarget(targetId) && draggedItem && isAcceptedDragItem(draggedItem)) {
      lastDraggedItem.current = draggedItem;
      // If an alternative drag item was used, hide it (unless hideAfterDrop will handle it)
      if (draggedItem !== stepData.dragItem?.id && stepData.alternativeDragIds?.includes(draggedItem)) {
        if (!stepData.hideAfterDrop?.includes(stepData.dragItem?.id ?? "")) {
          setVisibleObjects((prev) => {
            const next = new Set(prev);
            next.delete(draggedItem!);
            return next;
          });
        }
      }
      // If an alternative drop target was used, apply its sceneChanges instead of defaults
      const altDrop = stepData.alternativeDropTargets?.find(alt => alt.id === targetId);
      if (altDrop?.sceneChanges) {
        skipDefaultSceneChanges.current = true;
        setObjectImages((prev) => ({ ...prev, ...altDrop.sceneChanges }));
      }
      // If there's an animation, play it before advancing
      if (stepData.animationDuring) {
        const anim = stepData.animationDuring;
        setIsAnimating(true);
        setObjectImages((prev) => ({ ...prev, [anim.target]: anim.image }));
        setTimeout(() => {
          setIsAnimating(false);
          // Fade out, then advance (which swaps image), then fade in
          setFadingAnimTarget(anim.target);
          setTimeout(() => {
            advanceStep();
            setTimeout(() => setFadingAnimTarget(null), 50);
          }, 300);
        }, anim.duration);
      } else {
        advanceStep();
      }
    } else {
      showWrongFeedback();
      toast.error("Try again!", { duration: 1000 });
    }
    setDraggedItem(null);
  };

  const handleTap = (objectId: string) => {
    if (isAnimating) return;

    // Handle tap action
    if (stepData?.action === "tap" && stepData.tapTarget === objectId) {
      // If there's an animation, play it first
      if (stepData.animationDuring) {
        const anim = stepData.animationDuring;
        setIsAnimating(true);
        setObjectImages((prev) => ({ ...prev, [anim.target]: anim.image }));

        setTimeout(() => {
          setIsAnimating(false);
          setFadingAnimTarget(anim.target);
          setTimeout(() => {
            advanceStep();
            setTimeout(() => setFadingAnimTarget(null), 50);
          }, 300);
        }, anim.duration);
      } else {
        advanceStep();
      }
      return;
    }

    // Handle mobile tap-to-select for drag items
    if (isMobile && stepData?.action === "drag") {
      const objDef = recipe.sceneObjects[objectId];
      // Prioritize drop-target handling when an item is already selected
      if (selectedItem && isAcceptedDropTarget(objectId)) {
        if (isAcceptedDragItem(selectedItem)) {
          // Hide the actual dragged item if it's an alternative
          if (selectedItem !== stepData.dragItem?.id && stepData.alternativeDragIds?.includes(selectedItem)) {
            setVisibleObjects((prev) => {
              const next = new Set(prev);
              next.delete(selectedItem!);
              return next;
            });
          }
          // Apply alt drop target sceneChanges instead of defaults
          const altDrop = stepData.alternativeDropTargets?.find(alt => alt.id === objectId);
          if (altDrop?.sceneChanges) {
            skipDefaultSceneChanges.current = true;
            setObjectImages((prev) => ({ ...prev, ...altDrop.sceneChanges }));
          }
          advanceStep();
        } else {
          showWrongFeedback();
          toast.error("Try again!", { duration: 1000 });
        }
        setSelectedItem(null);
        return;
      }
      // Select a drag item (only when no item is selected or tapping a different item)
      if (objDef?.isDraggable || isAcceptedDragItem(objectId)) {
        if (!isAcceptedDragItem(objectId)) {
          showWrongFeedback();
        }
        setSelectedItem(objectId);
        return;
      }
    }
  };

  const handleTargetTap = (targetId: string) => {
    if (isMobile && selectedItem && stepData?.action === "drag" && isAcceptedDropTarget(targetId)) {
      lastDraggedItem.current = selectedItem;
      if (selectedItem !== stepData.dragItem?.id && stepData.alternativeDragIds?.includes(selectedItem)) {
        setVisibleObjects((prev) => { const next = new Set(prev); next.delete(selectedItem!); return next; });
      }
      const altDrop = stepData.alternativeDropTargets?.find(alt => alt.id === targetId);
      if (altDrop?.sceneChanges) {
        skipDefaultSceneChanges.current = true;
        setObjectImages((prev) => ({ ...prev, ...altDrop.sceneChanges }));
      }
      if (stepData.animationDuring) {
        const anim = stepData.animationDuring;
        setIsAnimating(true);
        setObjectImages((prev) => ({ ...prev, [anim.target]: anim.image }));
        setTimeout(() => {
          setIsAnimating(false);
          setFadingAnimTarget(anim.target);
          setTimeout(() => {
            advanceStep();
            setTimeout(() => setFadingAnimTarget(null), 50);
          }, 300);
        }, anim.duration);
      } else {
        advanceStep();
      }
      setSelectedItem(null);
    }
  };

  // Mobile: tap anywhere on the scene to drop into the nearest valid drop target OR fire a tap action
  const handleSceneTap = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const tapX = ((touch.clientX - rect.left) / rect.width) * 100;
    const tapY = ((touch.clientY - rect.top) / rect.height) * 100;

    // Handle tap-action steps: find if the tap lands on the tap target
    if (stepData?.action === "tap" && stepData.tapTarget) {
      const tapTargetId = stepData.tapTarget;
      const objDef = recipe.sceneObjects[tapTargetId];
      if (objDef) {
        const x = objectPositions[tapTargetId]?.x ?? objDef.position.x;
        const y = objectPositions[tapTargetId]?.y ?? objDef.position.y;
        const w = objectSizes[tapTargetId]?.width ?? objDef.size.width;
        const h = objectSizes[tapTargetId]?.height ?? objDef.size.height;
        if (tapX >= x - w / 2 && tapX <= x + w / 2 && tapY >= y - h / 2 && tapY <= y + h / 2) {
          handleTap(tapTargetId);
          return;
        }
      }
    }

    if (!selectedItem || stepData?.action !== "drag" || !isAcceptedDragItem(selectedItem)) return;

    // Collect all accepted drop target IDs
    const acceptedTargetIds: string[] = [];
    if (stepData.dropTarget) acceptedTargetIds.push(stepData.dropTarget);
    stepData.alternativeDropTargets?.forEach(a => acceptedTargetIds.push(a.id));

    // Find the nearest accepted drop target whose bounding box contains the tap
    const hit = acceptedTargetIds.find((targetId) => {
      if (!isAcceptedDropTarget(targetId)) return false;
      const objDef = recipe.sceneObjects[targetId];
      if (!objDef) return false;
      const x = objectPositions[targetId]?.x ?? objDef.position.x;
      const y = objectPositions[targetId]?.y ?? objDef.position.y;
      const w = (objectSizes[targetId]?.width ?? objDef.size.width);
      const h = (objectSizes[targetId]?.height ?? objDef.size.height);
      const left = x - w / 2;
      const top = y - h / 2;
      return tapX >= left && tapX <= left + w && tapY >= top && tapY <= top + h;
    });

    if (hit) {
      handleTargetTap(hit);
    }
  }, [isMobile, selectedItem, stepData, isAcceptedDragItem, isAcceptedDropTarget, recipe.sceneObjects, objectPositions, objectSizes, handleTargetTap, handleTap]);

  // Mobile: tap anywhere on the success scene to fire easter egg drops via hit-test
  const handleEasterEggSceneTap = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || !selectedItem || !showSuccess) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const tapX = ((touch.clientX - rect.left) / rect.width) * 100;
    const tapY = ((touch.clientY - rect.top) / rect.height) * 100;

    let fired = false;
    for (const [targetId, objDef] of Object.entries(recipe.sceneObjects)) {
      const currentImg = objectImages[targetId] ?? objDef.image;
      const matchingEgg = recipe.easterEggs?.find(
        (ee) => ee.objectId === targetId && ee.dragSourceId === selectedItem &&
          (ee.condition === "success" || ee.condition === "always") &&
          (!ee.matchImage || ee.matchImage === currentImg) &&
          !ee.skipIfImages?.includes(currentImg)
      );
      if (!matchingEgg) continue;
      const x = objectPositions[targetId]?.x ?? objDef.position.x;
      const y = objectPositions[targetId]?.y ?? objDef.position.y;
      const w = objectSizes[targetId]?.width ?? objDef.size.width;
      const h = objectSizes[targetId]?.height ?? objDef.size.height;
      if (tapX >= x - w / 2 && tapX <= x + w / 2 && tapY >= y - h / 2 && tapY <= y + h / 2) {
        // Fire the easter egg
        const ee = matchingEgg;
        const newImages = ee.sceneChanges ? { ...objectImages, ...ee.sceneChanges } : objectImages;
        if (ee.sceneChanges) setObjectImages((prev) => ({ ...prev, ...ee.sceneChanges }));
        if (ee.toastMessage) toast.success(ee.toastMessage, { duration: 1500 });
        if (ee.confettiEmoji) setBonusConfettiEmoji(ee.confettiEmoji);
        if (ee.splatEffect) { setSplatEffect(true); setTimeout(() => setSplatEffect(false), 4000); }
        if (ee.groupId) {
          const groupEffect = recipe.easterEggGroupEffects?.[ee.groupId];
          if (groupEffect) {
            const groupEggs = recipe.easterEggs?.filter((g) => g.groupId === ee.groupId) ?? [];
            const allDone = groupEggs.every((g) => {
              const expected = g.sceneChanges?.[g.objectId];
              return expected !== undefined && newImages[g.objectId] === expected;
            });
            if (allDone) {
              if (groupEffect.confettiEmoji) setTimeout(() => setBonusConfettiEmoji(groupEffect.confettiEmoji!), 200);
              if (groupEffect.toastMessage) setTimeout(() => toast.success(groupEffect.toastMessage!, { duration: 2500 }), 300);
              if (groupEffect.cutscene) setTimeout(() => { setCutsceneData(groupEffect.cutscene!); setShowCutscene(true); }, 400);
            }
          }
        }
        setSelectedItem(null);
        fired = true;
        break;
      }
    }
    if (!fired) setSelectedItem(null);
  }, [isMobile, selectedItem, showSuccess, recipe.sceneObjects, recipe.easterEggs, recipe.easterEggGroupEffects, objectImages, objectPositions, objectSizes]);

  // Auto-advance for "wait" steps
  useEffect(() => {
    if (stepData?.action === "wait" && stepData.waitDuration && !showSuccess) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        advanceStep();
      }, stepData.waitDuration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, stepData, showSuccess, advanceStep]);

  const resetGame = () => {
    setCurrentStep(0);
    setShowSuccess(false);
    setDraggedItem(null);
    setSelectedItem(null);
    setBonusConfettiEmoji(null);
    setShowCutscene(false);
    setCutsceneFading(false);
    setCutsceneData(null);
    setIsAnimating(false);
    setWrongItem(false);
    setVisibleObjects(new Set(recipe.initialVisibleObjects));
    const images: Record<string, string> = {};
    Object.entries(recipe.sceneObjects).forEach(([id, obj]) => {
      images[id] = obj.image;
    });
    setObjectImages(images);
    setObjectPositions({});
    setObjectSizes({});
  };

  // Portrait prompt — for any touch device (phones AND tablets) in portrait
  if (isMobile && isPortrait) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
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
    <div className={`bg-background ${isMobile ? "h-screen flex flex-col" : "min-h-screen"}`}>
      <div className={`${isMobile ? "w-full px-0 py-0 flex flex-col flex-1 min-h-0" : "container mx-auto px-4 py-6 max-w-4xl"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between flex-shrink-0 ${isMobile ? "px-1 py-0.5" : "mb-4"}`}>
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-xs h-7 px-2 sm:h-8 sm:px-3 md:gap-2 md:text-sm md:h-10 md:px-4">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={resetGame} className="gap-1 text-xs h-7 px-2 sm:h-8 sm:px-3 md:gap-2 md:text-sm md:h-10 md:px-4">
            <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
            Reset
          </Button>
        </div>

        {/* Title - desktop only */}
        <div className={`text-center mb-4 ${isMobile ? "hidden" : ""}`}>
          <h1 className="text-3xl font-bold text-foreground mb-1">{recipe.emoji} {recipe.name}</h1>
        </div>

        {/* Progress - desktop only, hide on success */}
        {!showSuccess && !isMobile && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {recipe.steps.length}</span>
              <span>{Math.round(((currentStep) / recipe.steps.length) * 100)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / recipe.steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Kitchen Scene */}
        <div
          className={`relative rounded-2xl border-4 border-amber-300 dark:border-amber-700 overflow-hidden ${isMobile ? "flex-1 min-h-0 w-full" : "aspect-[3/2]"}`}
          style={{
            backgroundImage: `url(${kitchenBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onTouchEnd={isMobile ? (showSuccess ? (selectedItem ? handleEasterEggSceneTap : undefined) : handleSceneTap) : undefined}
        >
          {/* Instruction overlay - hidden in master mode (except success) */}
          {(difficulty === "junior" || showSuccess) && (
            <div className={`absolute top-1 left-1 right-1 sm:top-2 sm:left-2 sm:right-2 z-20 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 sm:p-2 md:p-3 text-center transition-colors duration-300 ${wrongItem ? "bg-destructive/90 border-2 border-destructive" : "bg-card/90 border-2 border-primary/30"}`}>
              {/* Mobile: compact single-line instruction + hint */}
              {!showSuccess && isMobile && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap">{currentStep + 1}/{recipe.steps.length}</span>
                  <div className="w-8 sm:w-10 h-1 bg-muted rounded-full overflow-hidden flex-shrink-0">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStep / recipe.steps.length) * 100}%` }} />
                  </div>
                  {stepData?.icon && difficulty === "junior" && (
                    <img src={stepData.icon} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" />
                  )}
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-tight truncate">
                    {stepData?.instruction}
                  </p>
                  {stepData && (
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {stepData.action === "drag"
                        ? selectedItem ? "👆 Place it" : "👆 Tap & place"
                        : stepData.action === "wait" ? "⏳ Wait..." : "👆 Tap!"}
                    </span>
                  )}
                </div>
              )}
              {/* Desktop instruction */}
              {(!isMobile || showSuccess) && (
                <>
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {!showSuccess && stepData?.icon && difficulty === "junior" && (
                      <img src={stepData.icon} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0" />
                    )}
                    <p className="text-sm md:text-lg font-medium text-foreground leading-tight">
                      {showSuccess ? `🎉 You made a ${recipe.name.toLowerCase()}!` : stepData?.instruction}
                    </p>
                  </div>
                  {!showSuccess && stepData && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stepData.action === "drag" ? "👆 Drag the item"
                        : stepData.action === "wait" ? "⏳ Wait for it..." : "👆 Tap it!"}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Master Chef: red flash overlay on wrong pick */}
          {difficulty === "master" && wrongItem && (
            <div className="absolute inset-0 z-20 bg-destructive/30 pointer-events-none transition-opacity duration-300 rounded-2xl" />
          )}

          {/* Master Chef: minimal progress indicator */}
          {difficulty === "master" && !showSuccess && (
            <div className="absolute top-2 left-2 right-2 z-20">
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(currentStep / recipe.steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Scene Objects */}
          {Object.entries(recipe.sceneObjects).map(([id, objDef]) => {
            if (!visibleObjects.has(id)) return null;
            // During success, show objects — easter eggs are interactive
            if (showSuccess) {
              const currentImage = id in objectImages ? objectImages[id] : objDef.image;
              if (!currentImage) return null;

              // Is this object a drag SOURCE for any drag-based easter egg?
              const isDragSource = recipe.easterEggs?.some(
                (ee) => ee.dragSourceId === id && (ee.condition === "success" || ee.condition === "always")
              );

              // Is this a DROP TARGET for the currently dragged source?
              const dragEasterEgg = draggedItem
                ? recipe.easterEggs?.find(
                    (ee) =>
                      ee.objectId === id &&
                      ee.dragSourceId === draggedItem &&
                      (ee.condition === "success" || ee.condition === "always") &&
                      (!ee.matchImage || ee.matchImage === currentImage) &&
                      !ee.skipIfImages?.includes(currentImage)
                  )
                : undefined;

              // Tap-based easter egg (no dragSourceId)
              const tapEasterEgg = recipe.easterEggs?.find(
                (ee) =>
                  ee.objectId === id &&
                  !ee.dragSourceId &&
                  (ee.condition === "success" || ee.condition === "always") &&
                  (!ee.matchImage || ee.matchImage === currentImage) &&
                  !ee.skipIfImages?.includes(currentImage)
              );

              const isDropTarget = !!dragEasterEgg;
              const isClickable = !!tapEasterEgg;

              const fireEasterEgg = (ee: typeof tapEasterEgg) => {
                if (!ee) return;
                const newImages = ee.sceneChanges
                  ? { ...objectImages, ...ee.sceneChanges }
                  : objectImages;
                if (ee.sceneChanges) {
                  setObjectImages((prev) => ({ ...prev, ...ee.sceneChanges }));
                }
                if (ee.toastMessage) toast.success(ee.toastMessage, { duration: 1500 });
                if (ee.confettiEmoji) setBonusConfettiEmoji(ee.confettiEmoji);
                if (ee.splatEffect) { setSplatEffect(true); setTimeout(() => setSplatEffect(false), 4000); }
                if (ee.groupId) {
                  const groupEffect = recipe.easterEggGroupEffects?.[ee.groupId];
                  if (groupEffect) {
                    const groupEggs = recipe.easterEggs?.filter((e) => e.groupId === ee.groupId) ?? [];
                    const allDone = groupEggs.every((e) => {
                      const expected = e.sceneChanges?.[e.objectId];
                      return expected !== undefined && newImages[e.objectId] === expected;
                    });
                    if (allDone) {
                      if (groupEffect.confettiEmoji) setTimeout(() => setBonusConfettiEmoji(groupEffect.confettiEmoji!), 200);
                      if (groupEffect.toastMessage) setTimeout(() => toast.success(groupEffect.toastMessage!, { duration: 2500 }), 300);
                      if (groupEffect.cutscene) setTimeout(() => { setCutsceneData(groupEffect.cutscene!); setShowCutscene(true); }, 400);
                    }
                  }
                }
              };

              // Drag handlers for drag-source objects on the success screen
              const handleSuccessDragStart = (e: React.DragEvent) => {
                const dragEgg = recipe.easterEggs?.find(
                  (ee) => ee.dragSourceId === id && (ee.condition === "success" || ee.condition === "always")
                );
                setDraggedItem(id);
                e.dataTransfer.effectAllowed = "move";
                if (dragEgg?.dragImage) {
                  const img = document.createElement("img");
                  img.src = dragEgg.dragImage;
                  img.style.cssText = "width:80px;height:80px;object-fit:contain;position:absolute;top:-9999px";
                  document.body.appendChild(img);
                  e.dataTransfer.setDragImage(img, 40, 40);
                  requestAnimationFrame(() => document.body.removeChild(img));
                }
              };

              return (
                <div
                  key={id}
                  className={`absolute transition-all duration-300 ${isClickable ? "cursor-pointer" : ""} ${isDragSource && !isMobile ? "cursor-grab active:cursor-grabbing" : ""} ${isDragSource && isMobile ? "cursor-pointer" : ""} ${isOverTarget === id ? "scale-110" : ""} ${selectedItem === id ? "scale-110 ring-4 ring-primary rounded-xl z-30" : ""} ${selectedItem && isDropTarget ? "scale-105 ring-4 ring-green-400 rounded-xl" : ""}`}
                  style={{
                    left: `${(objectPositions[id]?.x ?? objDef.position.x) - (objectSizes[id]?.width ?? objDef.size.width) * (isMobile ? 1.3 : 1) / 2}%`,
                    top: `${(objectPositions[id]?.y ?? objDef.position.y) - (objectSizes[id]?.height ?? objDef.size.height) * (isMobile ? 1.3 : 1) / 2}%`,
                    width: `${(objectSizes[id]?.width ?? objDef.size.width) * (isMobile ? 1.3 : 1)}%`,
                    height: `${(objectSizes[id]?.height ?? objDef.size.height) * (isMobile ? 1.3 : 1)}%`,
                    zIndex: isDropTarget ? 35 : isDragSource ? 30 : isClickable ? 35 : undefined,
                  }}
                  draggable={!isMobile && isDragSource}
                  onDragStart={isDragSource ? handleSuccessDragStart : undefined}
                  onDragEnd={() => { setDraggedItem(null); setIsOverTarget(null); }}
                  onDragOver={isDropTarget ? (e) => { e.preventDefault(); setIsOverTarget(id); } : undefined}
                  onDragLeave={isDropTarget ? () => setIsOverTarget(null) : undefined}
                  onDrop={isDropTarget ? (e) => {
                    e.preventDefault();
                    setIsOverTarget(null);
                    setDraggedItem(null);
                    fireEasterEgg(dragEasterEgg);
                  } : undefined}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    if (isClickable) { fireEasterEgg(tapEasterEgg); return; }
                    // Mobile: tap drag-source to select it
                    if (isMobile && isDragSource && !selectedItem) { setSelectedItem(id); return; }
                    // Mobile: tap drop target while source is selected
                    if (isMobile && selectedItem && isDropTarget) {
                      const mobileEgg = recipe.easterEggs?.find(
                        (ee) => ee.objectId === id && ee.dragSourceId === selectedItem &&
                          (ee.condition === "success" || ee.condition === "always") &&
                          (!ee.matchImage || ee.matchImage === currentImage) &&
                          !ee.skipIfImages?.includes(currentImage)
                      );
                      setSelectedItem(null);
                      if (mobileEgg) fireEasterEgg(mobileEgg);
                    }
                  }}
                  onClick={() => {
                    if (isClickable) { fireEasterEgg(tapEasterEgg); return; }
                    if (isMobile && isDragSource && !selectedItem) { setSelectedItem(id); return; }
                    if (isMobile && selectedItem && isDropTarget) {
                      const mobileEgg = recipe.easterEggs?.find(
                        (ee) => ee.objectId === id && ee.dragSourceId === selectedItem &&
                          (ee.condition === "success" || ee.condition === "always") &&
                          (!ee.matchImage || ee.matchImage === currentImage) &&
                          !ee.skipIfImages?.includes(currentImage)
                      );
                      setSelectedItem(null);
                      if (mobileEgg) fireEasterEgg(mobileEgg);
                    }
                  }}
                >
                  <img src={currentImage} alt={objDef.id} className={`w-full h-full pointer-events-none ${id === "bg" ? "object-cover" : "object-contain drop-shadow-lg"}`} draggable={false} />
                  {isDropTarget && isOverTarget === id && (
                    <div className="absolute inset-0 rounded-xl border-4 border-dashed border-green-400 bg-green-400/20 pointer-events-none" />
                  )}
                </div>
              );
            }
            if (!visibleObjects.has(id)) return null;

            const currentImage = id in objectImages ? objectImages[id] : objDef.image;
            const isCurrentDragItem = stepData?.action === "drag" && isAcceptedDragItem(id);
            const isAnyDraggable = stepData?.action === "drag" && (objDef.isDraggable || isCurrentDragItem) && visibleObjects.has(id);
            const isCurrentDropTarget = stepData?.dropTarget === id || (stepData?.action === "tap" && stepData?.tapTarget?.startsWith(id));
            const isTapTarget = stepData?.action === "tap" && (stepData.tapTarget === id || stepData.tapTarget === `${id}-button`);

            // Promote ALL active drop targets (primary + alts) to z:30 during drag
            // so invisible placeholder divs (z:10) can't block them
            const isActiveDropTarget = !!draggedItem && (
              stepData?.dropTarget === id ||
              stepData?.alternativeDropTargets?.some((alt) => alt.id === id)
            );

            return (
              <div
                key={id}
                className={`absolute transition-all duration-300 touch-instant ${
                  isAnyDraggable && !isMobile ? "cursor-grab active:cursor-grabbing" : ""
                } ${isAnyDraggable && isMobile ? "cursor-pointer" : ""} ${
                  isTapTarget ? "cursor-pointer" : ""
                } ${draggedItem === id ? "opacity-50 scale-95" : ""} ${
                  selectedItem === id
                    ? isAcceptedDragItem(selectedItem)
                      ? "scale-110 ring-4 ring-primary rounded-xl z-30"
                      : "scale-110 ring-4 ring-destructive rounded-xl z-30"
                    : ""
                } ${
                  isOverTarget === id ? "scale-110" : ""
                } ${
                  selectedItem && isAcceptedDropTarget(id) ? "scale-105 ring-4 ring-green-400 rounded-xl" : ""
                } ${isAnimating && stepData?.animationDuring?.target === id ? (stepData.animationDuring.className || "") : ""}`}
                style={{
                  left: `${(objectPositions[id]?.x ?? objDef.position.x) - (objectSizes[id]?.width ?? objDef.size.width) / 2}%`,
                  top: `${(objectPositions[id]?.y ?? objDef.position.y) - (objectSizes[id]?.height ?? objDef.size.height) / 2}%`,
                  width: `${(objectSizes[id]?.width ?? objDef.size.width)}%`,
                  height: `${(objectSizes[id]?.height ?? objDef.size.height)}%`,
                  zIndex: id === "bg" ? 1 : isActiveDropTarget ? 30 : isAnyDraggable ? 15 : isTapTarget ? 14 : objDef.isDropTarget ? 5 : 10,
                  // Prevent invisible non-interactive placeholders from intercepting pointer/drag events
                  // but always keep events on drop targets, draggables, and tap targets (even if they have no image yet)
                  pointerEvents: (currentImage || objDef.isDropTarget || objDef.isDraggable || isTapTarget) ? undefined : "none",
                }}
                draggable={!isMobile && isAnyDraggable && !isAnimating}
                onDragStart={(e) => isAnyDraggable && handleDragStart(e, id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => objDef.isDropTarget ? handleDragOver(e, id) : undefined}
                onDragLeave={objDef.isDropTarget ? handleDragLeave : undefined}
                onDrop={(e) => objDef.isDropTarget ? handleDrop(e, id) : undefined}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (isTapTarget) {
                    handleTap(stepData.tapTarget!);
                  } else if (isAnyDraggable) {
                    handleTap(id);
                  } else if (isMobile && objDef.isDropTarget) {
                    handleTargetTap(id);
                  }
                }}
                onClick={() => {
                  if (isTapTarget) {
                    handleTap(stepData.tapTarget!);
                  } else if (isAnyDraggable && isMobile) {
                    handleTap(id);
                  } else if (objDef.isDropTarget) {
                    handleTargetTap(id);
                  }
                }}
              >
                {currentImage && (
                  <img
                    src={currentImage}
                    alt={objDef.id}
                    className={`w-full h-full pointer-events-none transition-opacity duration-300 ${fadingAnimTarget === id ? "opacity-0" : "opacity-100"} ${id === "bg" ? "object-cover" : "object-contain drop-shadow-lg"}`}
                    draggable={false}
                  />
                )}
                {/* Drop target highlight */}
                {objDef.isDropTarget && isOverTarget === id && (
                  <div className="absolute inset-0 rounded-xl border-4 border-dashed border-green-400 bg-green-400/20 pointer-events-none" />
                )}
              </div>
            );
          })}

          {/* Wait step timer overlay */}
          {stepData?.action === "wait" && stepData.waitImage && isAnimating && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <img
                src={stepData.waitImage}
                alt="Timer"
                className="w-1/3 h-auto object-contain animate-pulse drop-shadow-2xl"
              />
            </div>
          )}

          {/* Bonus emoji confetti (easter egg or group completion) */}
          {bonusConfettiEmoji && (
            <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`bonus-${i}`}
                  className="absolute text-5xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-5%`,
                    animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
                    animationDelay: `${Math.random() * 0.8}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                >
                  {bonusConfettiEmoji}
                </div>
              ))}
            </div>
          )}

          {/* Confetti */}
          {showSuccess && (
            <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-5%`,
                    backgroundColor: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8', '#20c997', '#ff6b9d'][i % 8],
                    animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
                    animationDelay: `${Math.random() * 0.8}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Success overlay */}
          {showSuccess && (
            <div className="absolute top-2 left-2 right-2 z-30 animate-scale-in">
              <div className="bg-card p-3 sm:p-4 rounded-xl shadow-xl text-center border-2 border-green-400">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Delicious! You made a {recipe.name.toLowerCase()}!
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button size="sm" onClick={resetGame} className="gap-1 text-xs sm:text-sm">
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                    Make Again
                  </Button>
                  {onChangeDifficulty && (
                    <Button size="sm" variant="outline" onClick={onChangeDifficulty} className="gap-1 text-xs sm:text-sm">
                      Change Difficulty
                    </Button>
                  )}
                  {onNewRecipe && (
                    <Button size="sm" variant="outline" onClick={onNewRecipe} className="gap-1 text-xs sm:text-sm">
                      New Recipe
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Disco cutscene overlay — triggered when all easter eggs in a group complete */}
          {showCutscene && cutsceneData && (
            <div
              className={`absolute inset-0 z-40 overflow-hidden cursor-pointer ${cutsceneFading ? "animate-fade-out" : ""}`}
              onClick={() => {
                if (cutsceneFading) return;
                setCutsceneFading(true);
                setTimeout(() => { setShowCutscene(false); setCutsceneFading(false); }, 300);
              }}
            >
              {/* Dim overlay */}
              {cutsceneData.dimOverlay && (
                <div className="absolute inset-0 bg-black/50 animate-fade-in pointer-events-none" />
              )}
              {/* Disco Scene slides down from top */}
              {cutsceneData.slideDownImage && (
                <img
                  src={cutsceneData.slideDownImage}
                  alt="Disco scene"
                  className="absolute top-0 left-0 w-full animate-disco-slide-down pointer-events-none"
                  style={{ animationDelay: "0.3s" }}
                  draggable={false}
                />
              )}
              {/* Cheese Man scales in then dances */}
              {cutsceneData.centerScaleImage && (
                <div
                  className="absolute bottom-[8%] left-0 right-0 flex justify-center animate-cheese-scale-in pointer-events-none"
                  style={{ animationDelay: "0.8s" }}
                >
                  <img
                    src={cutsceneData.centerScaleImage}
                    alt="Cheese Man"
                    className="w-[60%] object-contain drop-shadow-2xl animate-cheese-dance"
                    style={{ animationDelay: "1.3s" }}
                    draggable={false}
                  />
                </div>
              )}
              {/* Tap hint */}
              <p className="absolute bottom-2 left-0 right-0 text-center text-white/70 text-xs pointer-events-none">
                Tap to close
              </p>
            </div>
          )}
        </div>

        {/* Help text - desktop only */}
        <div className="hidden md:block mt-4 text-sm text-muted-foreground text-center">
          <p>Drag items or tap when indicated. Highlighted items are interactive.</p>
        </div>

        {/* Jelly splat overlay */}
        {splatEffect && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex items-center justify-center">
            <img
              src={jellySplatImg}
              alt="Jelly splat"
              className="animate-splat-drip w-[120vw] max-w-none"
              style={{ filter: "drop-shadow(0 4px 30px rgba(100, 0, 150, 0.5))" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
