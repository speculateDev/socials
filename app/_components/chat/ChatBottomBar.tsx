import { useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon, Loader2Icon, SendHorizonal, ThumbsUp } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "./EmojiPicker";
import useSound from "use-sound";
import { usePrefrences } from "@/app/store/usePrefrences";
import { useMutation } from "@tanstack/react-query";
import { sendMessage as sendMessageAction } from "@/app/actions/message";
import { useSelectedUser } from "@/app/store/useSelectedUser";

function ChatBottomBar() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [message, setMessage] = useState("");
  const { soundEnabled } = usePrefrences();

  const { selectedUser } = useSelectedUser();

  const [playSound1] = useSound("/sounds/keystroke1.mp3", { volume: 2 });
  const [playSound2] = useSound("/sounds/keystroke2.mp3", { volume: 2 });
  const [playSound3] = useSound("/sounds/keystroke3.mp3", { volume: 2 });
  const [playSound4] = useSound("/sounds/keystroke4.mp3", { volume: 2 });

  const playSoundsArr = [playSound1, playSound2, playSound3, playSound4];

  function playRandomKeySound() {
    const randomIndx = Math.floor(Math.random() * playSoundsArr.length);
    if (soundEnabled) playSoundsArr[randomIndx]();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessage(message + "\n");
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: sendMessageAction,
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    sendMessage({
      content: message,
      messageType: "text",
      receiverId: selectedUser.id,
    });

    setMessage("");
    textAreaRef.current?.focus();
  };

  return (
    <div className="flex w-full items-center p-2 gap-2 min-h-0">
      {!message.trim() && (
        <CldUploadWidget
          options={{
            folder: "socially",
          }}
          signatureEndpoint="/api/sign-cloudinary-params"
        >
          {({ open }) => {
            return (
              <ImageIcon
                className="text-muted-foreground cursor-pointer"
                size={20}
                onClick={() => open()}
              />
            );
          }}
        </CldUploadWidget>
      )}

      <Dialog open={!!imgUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center items-center relative h-96 w-full mx-auto">
            <Image
              src="/logo.png"
              alt="Image Preview"
              fill
              className="object-contain"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AnimatePresence applies an animation when items are added or removed from the list */}
      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
          className="flex-1 relative min-w-0"
        >
          <Textarea
            ref={textAreaRef}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder="Type a message..."
            rows={1}
            className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background min-h-0 pr-8"
            value={message}
            onChange={(e) => {
              playRandomKeySound();
              setMessage(e.target.value);
            }}
          />

          <div className="absolute right-2 bottom-0.5">
            <EmojiPicker
              onChange={(emoji) => {
                setMessage(message + emoji);
                if (textAreaRef.current) {
                  textAreaRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            onClick={handleSendMessage}
            key={"send"}
            variant="ghost"
            size="icon"
          >
            <SendHorizonal size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            key="a"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-9 w-9"
          >
            {!isPending ? (
              <ThumbsUp size={20} className="text-muted-foreground" />
            ) : (
              <Loader2Icon className="animate-spin text-muted-foreground" />
            )}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatBottomBar;
