import React, { createContext, useContext } from 'react';
import { message } from 'antd';

const MessageContext = createContext(null);

export const useGlobalMessage = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useGlobalMessage must be used inside <MessageProvider />');
  return ctx.messageApi;
};

export const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi, contextHolder }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};