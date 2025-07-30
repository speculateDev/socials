import { useSelectedUser } from "@/app/store/useSelectedUser";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getMessages as getMessagesAction } from "@/app/actions/message";
import { useSession } from "next-auth/react";
import MessagesSkeleton from "../skeletons/MessagesSkeleton";
import { useEffect, useRef } from "react";

function MessageList() {
  const messageContainerRef = useRef<HTMLElement>(null);
  const { selectedUser } = useSelectedUser();
  const { data } = useSession();

  const currentUser = data?.user;

  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryFn: async () => {
      if (selectedUser && currentUser) {
        return await getMessagesAction(selectedUser?.id, currentUser.id);
      }
    },

    queryKey: ["messages", selectedUser?.id],
    enabled: !!selectedUser && !!currentUser,
  });

  useEffect(() => {
    // Scroll to the last message
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // const senderMessages = selectedUser
  //   ? messagesDB.filter((m) => m.senderId === selectedUser.id)
  //   : [];

  // const randomMessages = selectedUser
  //   ? messagesDB.filter((m) => m.senderId !== selectedUser.id)
  //   : [];

  // const messages = [...senderMessages, ...randomMessages.slice(0, 3)];

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden overflow-y-auto min-h-0">
      {/* this component ensure the animation is applied when items are added or removed */}
      <AnimatePresence>
        {!isMessagesLoading &&
          messages?.map((message, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, x: 0, y: 0 }}
              transition={{
                opacity: { duration: 0.5 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.senderId === selectedUser?.id
                  ? "items-end"
                  : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.senderId === selectedUser?.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={selectedUser?.image || "/user-placeholder.png"}
                      alt="User Image"
                      className="border-2 border-white rounded-full"
                    />
                  </Avatar>
                )}
                {message.messageType === "text" ? (
                  <span className="bg-accent p-3 rounded-md max-w-xs">
                    {message.content}
                  </span>
                ) : (
                  <img
                    src={message.content}
                    alt="Message Image"
                    className="border p-2 rounded h-40 md:h-52 object-cover"
                  />
                )}

                {message.senderId !== selectedUser?.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={currentUser?.image || "/user-placeholder.png"}
                      alt="User Image"
                      className="border-2 border-white rounded-full"
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}

        {isMessagesLoading && (
          <>
            <MessagesSkeleton />
            <MessagesSkeleton />
            <MessagesSkeleton />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MessageList;
