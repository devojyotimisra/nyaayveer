import React, { createContext, useContext, useEffect, useState } from "react";
import { Message } from "./components/ChatUtils";
import { AuthContext } from "./appwrite/AuthContext";

// Define the context type
interface AppContextType {
  victimName: string;
  setVictimName: React.Dispatch<React.SetStateAction<string>>;
  caseNumber: string;
  setCaseNumber: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userData: UserObj | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserObj | undefined>>;
  currentUserMessage: Message | undefined;
  setCurrentUserMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;
  userToken: string | null;
  name: string | undefined;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

type UserObj = {
    unique_id: string;
  };

// Context provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Shared states
  const [victimName, setVictimName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData, setUserData] = useState<UserObj|undefined>();
  const [name, setName] = useState<string|undefined>();
  const [currentUserMessage, setCurrentUserMessage] = useState<Message | undefined>({id: 0, uri: '', text: '', sender: 'user', type: 'text'});
  const { userToken, getCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser();
      if (response) {
        setName(response.name);
        console.log("name",name);
        setUserData({unique_id: response.unique_id});
      }
    };
    fetchUser();
  }, [getCurrentUser]);



  return (
    <AppContext.Provider
      value={{
        victimName,
        setVictimName,
        caseNumber,
        setCaseNumber,
        messages,
        setMessages,
        userData,
        setUserData,
        currentUserMessage,
        setCurrentUserMessage,
        userToken,
        name
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
