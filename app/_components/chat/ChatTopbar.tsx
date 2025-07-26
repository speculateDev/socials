import { useSelectedUser } from "@/app/store/useSelectedUser";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Info, X } from "lucide-react";

function ChatTopbar() {
  const { selectedUser, setSelectedUser } = useSelectedUser();

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={selectedUser?.image}
            alt="User Image"
            height={16}
            width={16}
            className="object-cover rounded-full"
          />
        </Avatar>

        <span>{selectedUser?.name}</span>
      </div>

      <div className="flex gap-2">
        <Info className="text-muted-foreground hover:text-primary size-5 cursor-pointer" />
        <X
          onClick={() => setSelectedUser(null)}
          className="text-muted-foreground hover:text-primary size-5 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default ChatTopbar;
