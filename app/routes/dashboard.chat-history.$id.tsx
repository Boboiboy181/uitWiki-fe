import { useNavigate, useParams } from '@remix-run/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import MESSAGES from '~/assets/message';
import { Message } from '~/components';
import { useSessionId } from '~/hooks';

const ChatHistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { messages, isLoading } = useSessionId(id!);

  useEffect(() => {
    if (!isLoading && (!messages || messages.length === 0)) {
      Swal.fire({
        title: messages.length !== 0 ? MESSAGES.notFoundChatHistory.title : 'Thông báo',
        text: messages.length !== 0 ? MESSAGES.notFoundChatHistory.text : 'Không có lịch sử cuộc trò chuyện',
        icon: messages.length !== 0 ? 'error' : 'info',
        confirmButtonText: MESSAGES.notFoundChatHistory.confirmText,
        confirmButtonColor: MESSAGES.notFoundChatHistory.confirmColor,
      }).then(() => {
        navigate('/dashboard/chat-history');
      });
    }
  }, [messages, isLoading, navigate]);

  return (
    <div className="rounded-lg border border-gray-200 p-5">
      {messages.map((message, index) => {
        return <Message key={index} message={message} />;
      })}
    </div>
  );
};

export default ChatHistoryDetailPage;
