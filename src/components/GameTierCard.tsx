import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GameTierCardProps {
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  emoji: string;
  onSelect: () => void;
}

const tierColors = {
  1: "bg-[#45bcfa]",
  2: "bg-yellow-400", 
  3: "bg-[#f55832]",
};

export const GameTierCard = ({ tier, title, description, emoji, onSelect }: GameTierCardProps) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      onClick={onSelect}
    >
      <CardHeader className={`${tierColors[tier]} text-center pb-4`}>
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-4xl">{emoji}</span>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-4 pb-6 bg-card">
        <CardDescription className="text-base mb-4 text-muted-foreground">
          {description}
        </CardDescription>
        <Button 
          size="lg" 
          className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
};
