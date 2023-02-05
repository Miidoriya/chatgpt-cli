import { ChatGPTAPI } from "chatgpt";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let previousString = "";
let conversationId: string | undefined;
let parentMessageId: string | undefined;

function printDifference(str: string) {
  if (str === previousString) {
    return;
  }

  const difference = str.slice(previousString.length);
  process.stdout.write(difference);
  previousString = str;
}

async function main() {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
  while (true) {
    const message: string = await new Promise((resolve) => {
      readline.question("You>     ", (msg: string) => {
        resolve(msg);
      });
    });
    if (message === "exit") {
      break;
    }
    try {
      process.stdout.write("ChatGPT> ");
      const res = await api.sendMessage(message, {
        conversationId: conversationId,
        parentMessageId: parentMessageId,
        onProgress: (partialResponse) => {
          partialResponse.text != '\n' || " " ? printDifference(`${partialResponse.text.trim()}`) :
            null;
        },
      });
      conversationId = res.conversationId;
      parentMessageId = res.id;

      console.log("");
    } catch {
      console.log("Error: Something went wrong. Please try again.");
    }
  }
}

main();
