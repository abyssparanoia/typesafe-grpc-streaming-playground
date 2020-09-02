import { ChatService, IChatServer } from "../grpc/pb/chat_grpc_pb";
import { Message } from "../grpc/pb/chat_pb";
import {
  ServerUnaryCall,
  ServerDuplexStream,
  sendUnaryData,
  Server,
  ServerCredentials,
} from "grpc";

const users: ServerDuplexStream<Message, Message>[] = [];

class ServerImpl implements IChatServer {
  public join(stream: ServerDuplexStream<Message, Message>): void {
    stream.on("data", (_: Message) => {
      console.log("join now");
      users.push(stream);
      const msg = new Message();
      msg.setText("new user joined ...");
      msg.setUser("Server");
      notifyChat(msg);
    });
  }

  public send(
    call: ServerUnaryCall<Message>,
    callback: sendUnaryData<Message>
  ) {
    console.log("send now");
    notifyChat(call.request);
    callback(null, call.request);
  }
}

const notifyChat = (message: Message): void => {
  users.forEach((user) => {
    user.write(message);
  });
};

function startServer() {
  const server = new Server();

  server.addService(ChatService, new ServerImpl());
  server.bind("127.0.0.1:50051", ServerCredentials.createInsecure());
  server.start();

  console.log("Server started, listening: 127.0.0.1:50051");
}

startServer();
