import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { Home, Volume2, VolumeX, Palette, User } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your Mac & Cheese experience</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Sound & Music
              </CardTitle>
              <CardDescription>Control audio settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects" className="flex flex-col gap-1">
                  <span className="font-medium">Sound Effects</span>
                  <span className="text-sm text-muted-foreground">Play sound effects in games</span>
                </Label>
                <Switch
                  id="sound-effects"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="background-music" className="flex flex-col gap-1">
                  <span className="font-medium">Background Music</span>
                  <span className="text-sm text-muted-foreground">Play music while playing</span>
                </Label>
                <Switch
                  id="background-music"
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                  <span className="font-medium">Dark Mode</span>
                  <span className="text-sm text-muted-foreground">Use dark theme</span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Settings;
