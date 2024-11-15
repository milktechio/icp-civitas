import { ListGroup, ListGroupItem, Spinner, Alert, Button } from "reactstrap";
import { useVotingContext } from "../../context/hooks/useVotingContext";
import { useAuthContext } from "../../context/hooks/useAuthContext";

const VotingHome = () => {
  const auth = useAuthContext();
  const voting = useVotingContext();

  return (
    <div style={{ height: "100%", width: "80%" }}>
      <h2>Lista de Votaciones</h2>
      {voting?.loading ? (
        <Spinner color="primary" />
      ) : voting?.error ? (
        <Alert color="danger">{voting?.error}</Alert>
      ) : voting?.polls?.length === 0 ? (
        <Alert color="info">No hay votaciones disponibles</Alert>
      ) : (
        <ListGroup>
          {voting?.polls?.map((poll) => (
            <ListGroupItem key={poll?.id}>
              <h5>Votacion: {poll?.name}</h5>
              {!poll.votes.includes(1n) && (
                <>
                  <p>Opciones:</p>
                  <ul>
                    {poll?.options.map((option, index) => (
                      <li className="" key={index}>
                        <Button
                          className="mb-2 mx-4"
                          onClick={() =>
                            voting?.registerVote(
                              poll?.id,
                              option?.id,
                              "algun texto"
                            )
                          }
                        >
                          {option?.name}
                        </Button>
                        <label>
                          Votos totales: {String(poll?.votes[index])}
                        </label>
                      </li>
                    ))}
                  </ul>
                  {auth?.isAdmin && (
                    <Button
                      onClick={async () => await voting?.removePoll(poll?.id)}
                    >
                      Eliminar votacion
                    </Button>
                  )}
                </>
              )}
              {poll.votes.includes(1n) && (
                <>
                  {
                    <>
                      <div>
                        Votaste -
                        {`> ${poll.options[poll.votes.indexOf(1n)].name}`}
                      </div>
                      {auth?.isAdmin && (
                        <Button onClick={() => voting?.removePoll(poll?.id)}>
                          Eliminar votacion
                        </Button>
                      )}
                    </>
                  }
                </>
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default VotingHome;
