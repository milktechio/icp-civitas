import {
  Button,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { canisterId, createActor } from "../../../../declarations/test_backend";
import { useAuthContext } from "../../context/hooks/useAuthContext";
import { useState } from "react";
import "../../index.scss";

const NewVoting = () => {
  const [votingName, setVotingName] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [currenOption, setCurrentOption] = useState<string>("");
  const auth = useAuthContext();

  let backend = createActor(canisterId, {
    agentOptions: {
      host: "http://localhost:4943/",
    },
  });

  // Función para agregar una opción a la lista de opciones
  const addOption = () => {
    if (currenOption.trim()) {
      setOptions([...options, currenOption]);
      setCurrentOption("");
    }
  };

  // Función para manejar la creación de la votación
  const createVoting = async () => {
    if (votingName && options.length > 0) {
      const result = await backend.createPoll(votingName, options);
      setVotingName("");
      setOptions([]);
      console.log(result);
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

            {options.length > 0 && (
              <ListGroup className="mb-3">
                {options.map((opcion, index) => (
                  <ListGroupItem key={index}>{opcion}</ListGroupItem>
                ))}
              </ListGroup>
            )}

            <Button
              type="submit"
              color="success"
              disabled={!votingName || options.length === 0}
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
