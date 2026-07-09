import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export const GameCard = ({ title, description, icon: Icon, color, onClick }: GameCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-4 hover:shadow-2xl transition-all duration-300 animate-pop-in hover:-translate-y-2"
      onClick={onClick}
    >
      <CardHeader className={`${color} text-center pb-4`}>
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-10 w-10 text-foreground" strokeWidth={2.5} />
        </div>
        <CardTitle className="text-2xl font-bold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-4 pb-6">
        <CardDescription className="text-base mb-4 text-foreground/80">
          {description}
        </CardDescription>
        <Button variant="game" size="lg" className="w-full">
          Play Now!
        </Button>
      </CardContent>
    </Card>
  );
};
