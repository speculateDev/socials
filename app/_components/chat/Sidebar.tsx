import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { USERS } from "../../_db/dummy";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useSelectedUser } from "@/app/store/useSelectedUser";
import { usePrefrences } from "@/app/store/usePrefrences";
import useSound from "use-sound";

interface SidebarProps {
  isCollapsed: boolean;
}

function Sidebar({ isCollapsed }: SidebarProps) {
  const { soundEnabled } = usePrefrences();
  const [playClickSound] = useSound("/sounds/mouse-click.mp3");

  const { selectedUser, setSelectedUser } = useSelectedUser();

  return (
    <div className="group relative flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 max-h-full overflow-auto bg-background">
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
          </div>
        </div>
      )}

      <ScrollArea className="gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {USERS.map((user, idx) =>
          isCollapsed ? (
            <Tooltip key={idx} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  onClick={() => {
                    if (soundEnabled) {
                      playClickSound();
                    }
                    setSelectedUser(user);
                  }}
                >
                  <Avatar className="my-1 flex justify-center items-center">
                    <AvatarImage
                      src={user.image || "/user-placeholder.png"}
                      alt="User Image"
                      height={16}
                      width={16}
                      className="border-2 border-white rounded-full"
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>

                  <span className="sr-only">{user.name}</span>
                </div>
              </TooltipTrigger>

              <TooltipContent side="right" className="flex items-center gap-4">
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={() => {
                if (soundEnabled) {
                  playClickSound();
                }

                setSelectedUser(user);
              }}
              className={cn(
                "w-full justify-start gap-4 my-1",
                selectedUser?.email === user.email &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink"
              )}
              variant="grey"
              size="xl"
              key={idx}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={user.image || "/user-placeholder.png"}
                  alt="User Image"
                  height={16}
                  width={16}
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>

              {user.name}
            </Button>
          )
        )}
      </ScrollArea>

      {/* Logout btn */}
      <div className="mt-auto">
        <div className="flex justify-between items-center gap-2 md:px-6 py-2">
          {!isCollapsed && (
            <div className="hidden md:flex gap-2 items-center">
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={"/user-placeholder.png"}
                  alt="User Image"
                  height={16}
                  width={16}
                />
                <AvatarFallback>{"John Doe"}</AvatarFallback>
              </Avatar>

              <p className="font-bold">{"john Doe"}</p>
            </div>
          )}
          <div className="cursor-pointer">
            <LogOutIcon size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
