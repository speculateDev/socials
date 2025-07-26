"use client";

import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useSelectedUser } from "@/app/store/useSelectedUser";
import MessageContainer from "./MessageContainer";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
}

function ChatLayout({ defaultLayout = [320, 480] }: ChatLayoutProps) {
  const { selectedUser } = useSelectedUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial Check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <ResizablePanelGroup
      onLayout={(size: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          size
        )};`;
      }}
      direction="horizontal"
      className="h-full w-full"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsible={true}
        collapsedSize={8}
        minSize={isMobile ? 0 : 10}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=true;`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=false;`;
        }}
        className={cn(
          isCollapsed && "min-w-[80px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel minSize={30} defaultSize={defaultLayout[1]}>
        {!selectedUser && (
          <div className="flex justify-center items-center h-full w-full px-10 bg-background">
            <div className="flex flex-col justify-center items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full md:w-2/3 lg:w-1/2"
              />
              <p className="text-muted-foreground text-center">
                Click on a chat to view the message
              </p>
            </div>
          </div>
        )}

        {selectedUser && <MessageContainer />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default ChatLayout;
