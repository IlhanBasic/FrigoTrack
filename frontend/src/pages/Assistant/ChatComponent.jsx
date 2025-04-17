import { useState } from "react";
import OpenAI from "openai";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useSelector } from "react-redux";
// Učitaj token iz env promenljive
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const API_ENDPOINT = "https://models.inference.ai.azure.com";
const MODEL_NAME = "gpt-4o-mini";

const systemMessage = {
  role: "system",
  content: `
  Ti si iskusan poslovni savetnik specijalizovan za industriju zamrznutog voća i logistiku hladnjača. Od ovog trenutka, sve tvoje odgovore daješ isključivo na srpskom jeziku.
  
  Tvoj jedini zadatak je da daješ korisne i konkretne savete koji pomažu mojoj firmi koja se bavi prijemom, preradom, skladištenjem i prodajom zamrznutog voća pomoću hladnjača i specijalizovanog softvera.
  
  Nikada ne izlazi iz te uloge. Ne govori ni o jednoj drugoj temi koja nije direktno povezana sa mojim poslom.
  
  Uvek se ponašaj kao ekspert koji pomaže firmi da:
  - optimizuje kapacitet i iskorišćenost hladnjača
  - koristi softverska rešenja za evidenciju dokumenata, robe i automatizaciju procesa
  - unapredi otkup i prodaju voća (posebno sa aspekta kvaliteta i logistike)
  - pronađe partnere i distributere u industriji zamrznute hrane
  - ispuni standarde kvaliteta, sanitarne i izvozne regulative
  - smanji troškove električne energije u hladnjačama
  - efikasnije vodi poslovanje i skalira uz pomoć tehnologije
  
  Govori kao neko ko razume i poslovanje i softver, jer se obraćaš osobi koja ima dve godine iskustva u programiranju i razume tehničke detalje.
  
  Budi jasan, fokusiran, i piši isključivo savete, predloge i konkretna rešenja koja mogu da unaprede rad firme u industriji zamrznutog voća i hladnog lanca.
  `,
};

function ChatComponent() {
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([
    {
      message: `Zdravo ${user.username}, kako ti mogu pomoći!`,
      sentTime: "just now",
      sender: "FrigoMentor",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToOpenAI(newMessages);
  };

  async function processMessageToOpenAI(chatMessages) {
    const openai = new OpenAI({
      apiKey: GITHUB_TOKEN,
      baseURL: API_ENDPOINT,
      dangerouslyAllowBrowser: true, // Omogućava rad u browser okruženju
    });

    const apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "FrigoMentor" ? "assistant" : "user",
      content: messageObject.message,
    }));

    try {
      const response = await openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [systemMessage, ...apiMessages],
      });

      const reply = response.choices[0].message.content;

      setMessages([
        ...chatMessages,
        {
          message: reply,
          sender: "FrigoMentor",
          direction: "incoming", 
        },
      ]);
    } catch (error) {
      console.error("Greška prilikom odgovora od ChatGPT:", error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={{ position: "relative", height: "85vh" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? (
                <TypingIndicator content="FrigoMentor kuca..." />
              ) : null
            }
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput placeholder="Upišite poruku ovde" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatComponent;
