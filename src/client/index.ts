import { credentials } from "grpc";
import { Message } from "../grpc/pb/chat_pb";
import { ChatClient } from "../grpc/pb/chat_grpc_pb";
import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username = "";

const client = new ChatClient("127.0.0.1:50051", credentials.createInsecure());

const onDataCallaback = (message: Message) => {
  if (message.getUser() === username) {
    return;
  }
  console.log(`${message.toObject().user}: ${message.toObject().text}`);
};

const startChat = () => {
  const msg = new Message();
  msg.setUser(username);
  let channel = client.join(msg);
  channel.on("data", onDataCallaback);

  rl.addListener("line", (text: string) => {
    const msg = new Message();
    msg.setUser(username);
    msg.setText(text);
    client.send(msg, () => {});
  });
};

rl.question("User name: ", (answer: string) => {
  username = answer;

  startChat();
});
