import { ListGroup, ListGroupItem, Spinner, Alert, Button } from "reactstrap";
import { useVotingContext } from "../../context/hooks/useVotingContext";

const VotingHome = () => {
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
                </>
              )}
              {poll.votes.includes(1n) && (
                <>
                  {
                    <>
                      Votaste -
                      {`> ${poll.options[poll.votes.indexOf(1n)].name}`}
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
