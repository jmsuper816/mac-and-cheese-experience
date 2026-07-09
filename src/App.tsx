import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProgressProvider } from "@/contexts/GameProgressContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CountCrunch from "./pages/CountCrunch";
import WordWich from "./pages/WordWich";
import PatternPizza from "./pages/PatternPizza";
import SortNSnack from "./pages/SortNSnack";
import KitchenDash from "./pages/KitchenDash";
import SnackAttack from "./pages/SnackAttack";

import StickerBook from "./pages/StickerBook";
import Wardrobe from "./pages/Wardrobe";
import Settings from "./pages/Settings";
import PBSandwichDemoPage from "./pages/PBSandwichDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProgressProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/count-crunch" element={<CountCrunch />} />
              <Route path="/word-wich" element={<WordWich />} />
              <Route path="/pattern-pizza" element={<PatternPizza />} />
              <Route path="/sort-n-snack" element={<SortNSnack />} />
              <Route path="/kitchen-dash" element={<KitchenDash />} />
              <Route path="/snack-attack" element={<SnackAttack />} />
              
              <Route path="/sticker-book" element={<StickerBook />} />
              <Route path="/wardrobe" element={<Wardrobe />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pb-sandwich-demo" element={<PBSandwichDemoPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </GameProgressProvider>
  </QueryClientProvider>
);

export default App;
