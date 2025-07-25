"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { usePrefrences } from "../store/usePrefrences";
import useSound from "use-sound";

function PrefrencesTab() {
  const { setTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = usePrefrences();

  const [playMouseClick] = useSound("/sounds/mouse-click.mp3");
  const [playSoundOn] = useSound("/sounds/sound-on.mp3", { volume: 0.3 });
  const [playSoundOff] = useSound("/sounds/sound-off.mp3", { volume: 0.3 });

  return (
    <div className="flex flex-wrap gap-2 px-1 md:px-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setTheme("light");
          if (soundEnabled) {
            playMouseClick();
          }
        }}
      >
        <SunIcon className="size-[1.2rem] text-muted-foreground" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setTheme("dark");
          if (soundEnabled) {
            playMouseClick();
          }
        }}
      >
        <MoonIcon className="size-[1.2rem] text-muted-foreground " />
      </Button>

      <Button
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          if (soundEnabled) {
            playSoundOff();
          } else {
            playSoundOn();
          }
        }}
        variant="outline"
        size="icon"
      >
        {soundEnabled ? (
          <Volume2 className="size-[1.2rem] text-muted-foreground" />
        ) : (
          <VolumeX className="size-[1.2rem] text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}

export default PrefrencesTab;
