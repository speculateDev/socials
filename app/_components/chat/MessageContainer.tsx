import ChatTopbar from "./ChatTopbar";
import ChatBottomBar from "./ChatBottomBar";
import MessageList from "./MessageList";

function MessageContainer() {
  return (
    <div className="flex flex-col justify-between w-full h-full bg-background">
      <ChatTopbar />
      <MessageList />
      <ChatBottomBar />
    </div>
  );
}

export default MessageContainer;
