import { useEffect, useState } from "react";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Spinner,
  Alert,
  Button,
} from "reactstrap";
import { canisterId, createActor } from "../../../../declarations/test_backend";
import { SharedPoll } from "../../../../declarations/test_backend/test_backend.did";

const VotingHome = () => {
  const [votaciones, setVotaciones] = useState<SharedPoll[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  let backend = createActor(canisterId, {
    agentOptions: {
      host: "http://localhost:4943/",
    },
  });

  const fetchVotaciones = async () => {
    try {
      const response = await backend.getPolls();
      console.log(response);
      setVotaciones(response?.elems);
    } catch (err) {
      setError("Hubo un problema al cargar las votaciones");
    } finally {
      setLoading(false);
    }
  };

  const registerVote = async (
    idPoll: bigint,
    idOpt: bigint,
    idVoter: string
  ) => {
    const vote = await backend.addVoteToPoll(idPoll, idOpt, idVoter);
    console.log(vote);
  };

  useEffect(() => {
    fetchVotaciones();
  }, [votaciones?.length]);

  return (
    <div style={{ height: "100%", width: "80%" }}>
      <h2>Lista de Votaciones</h2>
      {loading ? (
        <Spinner color="primary" />
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : votaciones?.length === 0 ? (
        <Alert color="info">No hay votaciones disponibles</Alert>
      ) : (
        <ListGroup>
          {votaciones?.map((votacion) => (
            <ListGroupItem key={votacion?.id}>
              <h5>{votacion?.name}</h5>
              <p>Opciones:</p>
              <ul>
                {votacion?.options.map((option, index) => (
                  <li key={index}>
                    <Button
                      className="mb-2"
                      onClick={() =>
                        registerVote(votacion?.id, option?.id, "algun texto")
                      }
                    >
                      {option?.name}
                    </Button>
                    <div>{String(votacion?.votes[index])}</div>
                  </li>
                ))}
              </ul>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default VotingHome;
