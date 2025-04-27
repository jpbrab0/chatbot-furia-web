import { Card } from "./card";

export type Sender = 'bot' | 'user'

export const Message = ({ message, sender }: { message: string, sender: Sender }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card className={`border-0 rounded-lg whitespace-pre-wrap ${isUser ? 'bg-gray-600 text-white max-w-[75%] text-left p-3' : 'bg-transparent text-white w-full text-left'} break-words`}>
        {message}
      </Card>
    </div>
  );
};