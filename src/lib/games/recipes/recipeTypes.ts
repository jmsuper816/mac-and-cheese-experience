export interface DragItemDef {
  id: string;
  image: string;
  label: string;
  /** Optional different image shown while dragging (e.g. ice cubes fly out of ice bowl) */
  dragImage?: string;
}

export interface AnimationDuring {
  target: string;
  image: string;
  duration: number;
  className?: string;
}

export interface RecipeStep {
  instruction: string;
  action: "drag" | "tap" | "wait";

  // Icon image shown next to instruction in Junior Chef mode
  icon?: string;

  // For drag actions
  dragItem?: DragItemDef;
  dropTarget?: string;
  /** Alternative drop targets that are also accepted, with their own sceneChanges */
  alternativeDropTargets?: Array<{
    id: string;
    sceneChanges?: Record<string, string>;
    /** Skip this target if its current image matches one of these values (e.g. already occupied) */
    skipIfHasImage?: string[];
  }>;
  /** Skip the primary dropTarget if its current image matches one of these values */
  dropTargetSkipIfHasImage?: string[];
  // For tap actions
  tapTarget?: string;

  // For wait actions — auto-advances after duration (ms)
  waitDuration?: number;
  /** Image shown as overlay during a wait step (e.g. timer) */
  waitImage?: string;

  // Scene changes after this step completes
  sceneChanges?: Record<string, string>;

  // Position/size overrides after this step completes
  objectPositionChanges?: Record<string, { x: number; y: number }>;
  objectSizeChanges?: Record<string, { width: number; height: number }>;

  // Items to hide after drop completes (if using alternativeDragIds, the actual dragged item is auto-hidden)
  hideAfterDrop?: string[];

  // Alternative drag item IDs that are also accepted for this step
  alternativeDragIds?: string[];

  // Items to show/hide when this step becomes active
  showOnStep?: string[];
  hideOnStep?: string[];

  // Animation to play during the step (e.g. blending)
  animationDuring?: AnimationDuring;
}

export type DifficultyTier = "junior" | "master";

export interface SceneObjectDef {
  id: string;
  image: string;
  position: { x: number; y: number }; // percentage-based
  size: { width: number; height: number }; // percentage-based
  isDraggable?: boolean;
  isDropTarget?: boolean;
  hidden?: boolean;
}

export interface EasterEggGroupEffect {
  confettiEmoji?: string;
  toastMessage?: string;
  /** Full-screen disco cutscene triggered on group completion */
  cutscene?: {
    /** Semitransparent black overlay over the play area */
    dimOverlay?: boolean;
    /** Image that slides down from the top (e.g. disco scene) */
    slideDownImage?: string;
    /** Character image that scales in from centre then dances */
    centerScaleImage?: string;
  };
}

export interface EasterEggDef {
  objectId: string;
  /** When the easter egg is active */
  condition: "success" | "always";
  /** Only trigger if the object's current image matches this */
  matchImage?: string;
  /** Don't trigger if the object's current image matches any of these (e.g. already topped) */
  skipIfImages?: string[];
  sceneChanges?: Record<string, string>;
  toastMessage?: string;
  confettiEmoji?: string;
  /** Show a splat drip overlay effect */
  splatEffect?: boolean;
  /** Group ID — when all eggs in the same group are activated, groupEffect fires */
  groupId?: string;
  /** If set, this egg is triggered by dragging from this object ID onto objectId */
  dragSourceId?: string;
  /** Custom image shown while dragging from dragSourceId */
  dragImage?: string;
}

export interface RecipeData {
  id: string;
  name: string;
  emoji: string;
  tier: number;
  finishedImage: string;
  steps: RecipeStep[];
  sceneObjects: Record<string, SceneObjectDef>;
  initialVisibleObjects: string[];
  easterEggs?: EasterEggDef[];
  /** Effects triggered when all easter eggs in a group are completed */
  easterEggGroupEffects?: Record<string, EasterEggGroupEffect>;
}
