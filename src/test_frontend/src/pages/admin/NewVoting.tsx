import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useAuthContext } from "../../context/hooks/useAuthContext";
import { useState } from "react";
import "../../index.scss";
import { useVotingContext } from "../../context/hooks/useVotingContext";

const NewVoting = () => {
  const [votingName, setVotingName] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [currenOption, setCurrentOption] = useState<string>("");

  const auth = useAuthContext();
  const voting = useVotingContext();

  const addOption = () => {
    if (currenOption.trim()) {
      setOptions((prevOptions) => [...prevOptions, currenOption]);
      setCurrentOption("");
    }
  };

  const createVoting = async () => {
    if (votingName && options?.length > 0) {
      const newPoll = await voting?.registerPollHandler(votingName, options);
      setVotingName("");
      setOptions([]);
    }
  };

  return (
    <>
      {auth.isAuthenticated && (
        <div className="newVotingPage">
          <h2>Crear Nueva Votación</h2>
          <Form>
            <FormGroup>
              <Label for="nombreVotacion">Nombre de la Votación</Label>
              <Input
                type="text"
                id="nombreVotacion"
                placeholder="Ingrese el nombre de la votación"
                value={votingName}
                onChange={(e) => setVotingName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="opcion">Agregar Opción</Label>
              <div className="d-flex">
                <Input
                  type="text"
                  id="opcion"
                  placeholder="Ingrese una opción"
                  value={currenOption}
                  onChange={(e) => setCurrentOption(e.target.value)}
                />
                <Button
                  color="primary"
                  onClick={() => addOption()}
                  className="ms-2"
                >
                  Agregar
                </Button>
              </div>
            </FormGroup>

            {options?.length > 0 && (
              <ListGroup className="mb-3">
                {options?.map((opcion, index) => (
                  <ListGroupItem key={index}>{opcion}</ListGroupItem>
                ))}
              </ListGroup>
            )}

            <Button
              type="submit"
              color="success"
              disabled={!votingName || options?.length === 0}
              onClick={createVoting}
            >
              Crear Votación
            </Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default NewVoting;
