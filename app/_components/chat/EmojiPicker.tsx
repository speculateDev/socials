import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

interface EmojiMart {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
  aliases: string[];
}

function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="size-5 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Picker
          data={data}
          theme={theme === "dark" ? "dark" : "light"}
          emojiSize={18}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: EmojiMart) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;
