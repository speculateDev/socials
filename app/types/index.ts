export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
};

export type Message = {
  id: number;
  senderId: string;
  content: string;
  messageType: "text" | "image";
};
