import React, {
  createContext,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { canisterId, createActor } from "../../../declarations/test_backend";
import { SharedPoll } from "../../../declarations/test_backend/test_backend.did";

type VotingContextType = {
  loading: boolean;
  error: string | null;
  polls: SharedPoll[] | undefined;
  setPoll: React.Dispatch<SetStateAction<SharedPoll[] | undefined>>;
  registerVote: (
    idPoll: bigint,
    idOpt: bigint,
    idVoter: string
  ) => Promise<void>;
  registerPollHandler: (votingName: string, options: string[]) => Promise<void>;
  removePoll: (idPoll: bigint) => Promise<void>;
};

export const VotingContext = createContext<VotingContextType | undefined>(
  undefined
);

export const VotingProvider = ({ children }: { children: React.ReactNode }) => {
  const [polls, setPoll] = useState<SharedPoll[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isLocalEnv = window.location.hostname === "localhost";

  let backend = createActor(canisterId, {
    agentOptions: {
      host: isLocalEnv ? "http://localhost:4943/" : "https://ic0.app/",
    },
  });

  const registerPollHandler = async (votingName: string, options: string[]) => {
    setLoading(true);
    const newPoll = await backend?.createPoll(votingName, options);
    setLoading(false);
  };

  const fetchVotaciones = async () => {
    try {
      const response = await backend.getPolls();
      setPoll(response?.elems);
      console.log(response.elems);
    } catch (err) {
      setError("Hubo un problema al cargar las votaciones");
    }
  };

  const registerVote = async (
    idPoll: bigint,
    idOpt: bigint,
    idVoter: string
  ) => {
    setLoading(true);
    const vote = await backend.addVoteToPoll(idPoll, idOpt, idVoter);
    await fetchVotaciones();
    setLoading(false);
  };

  const removePoll = async (idPoll: bigint) => {
    setLoading(true);

    await backend?.removePoll(idPoll);
    setLoading(false);
  };

  useEffect(() => {
    fetchVotaciones();
  }, [polls?.length]);

  return (
    <VotingContext.Provider
      value={{
        loading,
        error,
        polls,
        setPoll,
        registerPollHandler,
        registerVote,
        removePoll,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
