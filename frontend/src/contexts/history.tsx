import { HistoryService } from "@/helpers/history/history_api_wrappers";
import History from "@/types/history";
import User from "@/types/user";
import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./auth";

interface IHistoryContext {
  user: User | undefined;
  isLoading: boolean;
  isNotFoundError: boolean;
  history: History[];
  handleRetrieveHistory: () => Promise<void>;
}

const HistoryContext = createContext<IHistoryContext>({
  user: undefined,
  isLoading: false,
  isNotFoundError: false,
  history: [],
  handleRetrieveHistory: async () => {},
});

const useHistoryContext = () => useContext(HistoryContext);

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFoundError, setIsNotFoundError] = useState<boolean>(false);
  const [history, setHistory] = useState<History[]>([]);

  const handleRetrieveHistory = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.id) {
        setIsNotFoundError(true);
        return;
      }

      const history = await HistoryService.getAttemptedQuestionsHistory(
        user.id
      );

      if (!history || history.length === 0) {
        setIsNotFoundError(true);
        return;
      }

      setHistory(history);
    } catch (error) {
      setIsNotFoundError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        user,
        isLoading,
        isNotFoundError,
        history,
        handleRetrieveHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export { useHistoryContext, HistoryProvider };
