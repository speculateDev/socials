import { cookies } from "next/headers";
import ChatLayout from "./_components/chat/ChatLayout";
import PrefrencesTab from "./_components/PrefrencesTab";
import { redis } from "@/lib/db";
import { User } from "@/app/types";
import { currentUser } from "./_lib/helpers";

async function getUsers(): Promise<User[]> {
  const keyKey: string[] = [];
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: "user:email*",
      type: "string",
      count: 100,
    });

    cursor = nextCursor;
    keyKey.push(...keys);
  } while (cursor !== "0");

  // Fetch all userKeys in parallel
  const userKeys = (await Promise.all(
    keyKey.map(async (key) => {
      const userKey = await redis.get(key);
      return userKey ? userKey : null;
    })
  )) as string[];

  // Filter out null or invalid keys
  const validUserKeys = userKeys.filter(
    (key) => key !== null && key !== undefined
  );

  if (validUserKeys.length === 0) {
    return []; // Skip pipeline execution if no valid keys
  }

  const pipeline = redis.pipeline();
  validUserKeys.forEach((key) => pipeline.hgetall(key));

  const results = (await pipeline.exec()) as User[];

  const currUser = await currentUser();
  const users: User[] = [];
  for (const user of results) {
    if (user.id !== currUser?.id) {
      users.push(user);
    }
  }
  return users;
}

async function Home() {
  const cookiess = await cookies();
  const layout = cookiess.get("react-resizable-panels:layout");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const users = await getUsers();

  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 md:px-24 md:py-32 gap-4">
      {/* dottes pattern bg */}
      <div
        className="absolute top-0 z-[-2] h-screen w-screen dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] dark:bg-[size:20px_20px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:20px_20px]"
        aria-hidden="true"
      />

      <PrefrencesTab />
      <div className="z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm lg:flex">
        <ChatLayout defaultLayout={defaultLayout} users={users} />
      </div>
    </main>
  );
}

export default Home;
