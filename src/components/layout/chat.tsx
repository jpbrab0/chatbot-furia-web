import { Suspense, useEffect, useRef, useState } from "react"
import { Card } from "../ui/card"
import { ArrowUp, Gamepad2, ScrollText } from "lucide-react"
import { Message, Sender } from "../ui/message"
import api from "../../api/api"

type IPromptType = 'history' | 'csgoRoster'

interface IChat {
  text: string
  sender: Sender
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IChat[]>([]);
  const [input, setInput] = useState('');
  const [disabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const defaultPrompts = (type: IPromptType) => {
    const prompts = {
      'history': "Conte-me a história da furia!",
      'csgoRoster': "Qual é a lineup de cs2 da furia?",
    }

    handleSend(prompts[type])
  }

  const handleSend = async (text?: string) => {
    if (text === "" && input === "") return;

    const prompt = text || input.trim();
    if (!prompt) return;

    setMessages((prev) => [...prev, { text: prompt, sender: 'user' }]);
    setInput('');
    setDisabled(true);
    setLoading(true);

    try {
      const res = await api.post('api/chat/', { query: prompt });
      const fullMessage = res.data?.message || "";
      let currentText = "";

      setMessages((prev) => [...prev, { text: "", sender: 'bot' }]);
      setLoading(false);

      for (let i = 0; i < fullMessage.length; i++) {
        currentText += fullMessage[i];
        await new Promise(resolve => setTimeout(resolve, 15));

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: currentText, sender: 'bot' };
          return updated;
        });
      }
    } catch (error) {
      console.error("Erro ao buscar resposta:", error);
    }

    setDisabled(false);

  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isPrintableKey = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

      if (
        document.activeElement !== inputRef.current &&
        isPrintableKey
      ) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className=" text-white pb-14 px-4">
      <div className="max-w-4xl mx-auto py-4 space-y-4 mt-5 mb-22">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-white font-bold text-center mt-30 flex-col">
            <h1 className="text-2xl">👋 Olá! Envie uma mensagem para começar.</h1>
            <div className="flex flex-rox gap-3 mt-3">
              <Card onClick={() => { defaultPrompts('history') }} className="flex flex-row gap-2">
                <ScrollText />
                <p>
                  História da furia
                </p>
              </Card>
              <Card onClick={() => { defaultPrompts('csgoRoster') }} className="flex flex-row gap-2">
                <Gamepad2 />
                <p>Lineup de Counter-Stike 2</p>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message key={index} message={msg.text} sender={msg.sender} />
            ))}
            {loading ?
              <Suspense children={<Message message="Gerando resposta.." sender='bot' />} />
              :
              ''
            }
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-background px-4 py-4 h-[20vh]">
        <div className="flex max-w-4xl mx-auto">
          <textarea
            disabled={disabled}
            ref={inputRef}
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Envie uma mensagem"
            rows={1}
            className="flex-1 bg-gray-800 text-white p-3 rounded-lg resize-none focus:outline-none"
          />
          <button
            disabled={disabled}
            onClick={() => handleSend('')}
            className={`ml-2 px-3 bg-yellow-300 hover:bg-yellow-300 text-white font-semibold rounded-full`}
          >
            <ArrowUp color="black" />
          </button>
        </div>
        <p className="mt-10 mb-10">Feito por João Pedro Resende - <a href="https://github.com/jpbrab0" target="_blank" className="font-bold text-yellow-300">@jpbrab0</a></p>
      </div>
    </div>
  );
}

