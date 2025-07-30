import ChatTopbar from "./ChatTopbar";
import ChatBottomBar from "./ChatBottomBar";
import MessageList from "./MessageList";
import { useEffect } from "react";
import { useSelectedUser } from "@/app/store/useSelectedUser";

function MessageContainer() {
  const { setSelectedUser } = useSelectedUser();

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setSelectedUser]);

  return (
    <div className="flex flex-col justify-between w-full h-full bg-background">
      <ChatTopbar />
      <MessageList />
      <ChatBottomBar />
    </div>
  );
}

export default MessageContainer;
