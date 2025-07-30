"use server";

import { redis } from "@/lib/db";
import { currentUser } from "../_lib/helpers";
import { Message } from "../_db/dummy";

type SendMessageProps = {
  content: string;
  receiverId: string;
  messageType: "text" | "image";
};

export async function sendMessage({
  receiverId,
  messageType,
  content,
}: SendMessageProps) {
  const user = await currentUser();

  if (!user) return { success: false, message: "User not authenticated" };

  const senderId = user.id;

  // The ids were sorted as to not create a duplicate conversation if the sender and receiver gets switched
  const conversationId = `conversation:${[receiverId, senderId]
    .sort()
    .join(":")}`;

  const conversationExist = await redis.exists(conversationId);

  if (!conversationExist) {
    redis.hset(conversationId, {
      participant1: senderId,
      participant2: receiverId,
    });

    await redis.sadd(`user:${senderId}:conversations`, conversationId);
    await redis.sadd(`user:${receiverId}:conversations`, conversationId);
  }

  // Generate a unique id
  const messageId = `message:${Date.now()}:${Math.random()
    .toString(36)
    .substring(2, 9)}`;
  const timestamp = Date.now();

  // Create the message hash
  await redis.hset(messageId, {
    senderId,
    conversationId,
    content,
    timestamp,
    messageType,
  });

  await redis.zadd(`${conversationId}:messages`, {
    score: timestamp,
    member: JSON.stringify(messageId),
  });

  return { success: true, conversationId, messageId };
}

export async function getMessages(
  selectedUserId: string,
  currentUserId: string
) {
  const conversationId = `conversation:${[selectedUserId, currentUserId]
    .sort()
    .join(":")}`;

  const messagesIds = await redis.zrange(`${conversationId}:messages`, 0, -1);

  if (messagesIds.length === 0) return [];

  const pipeline = redis.pipeline();
  messagesIds.forEach((messageId) => pipeline.hgetall(messageId as string));
  const messages = await pipeline.exec();

  return messages as Message[];
}
