import {Button, Card, CardGroup, Modal} from "react-bootstrap";
import React, {createContext, useState} from "react";
// eslint-disable-next-line import/no-cycle
import ListGroupGenerator from "./ListGroupGenerator";
import LumberPrice from "./LumberPrice";
import Calculator from "./Calculator";
import Dashboard from "./Dashboard";

const CONVERSION_COEFFICIENT = 0.3048;
export const wallLengthContext = createContext();

export default function ProjectManager() {
  const [currentProject, setCurrentProject] = useState({id: 0, name: "Default Project", owner_id: 1})
  const [isImperialUnit, setImperialUnit] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [listOfMeasurements, setListOfMeasurements] = useState([]);
  const [listOfWalls, setListOfWalls] = useState([]);
  const [numberOfStuds, setNumberOfStuds] = useState(0);
  const [wallLength, setWallLength] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null); 
  const numberOfFeetOfPlate = isImperialUnit 
    ? Math.ceil(numberOfStuds * 3.3) 
    : Math.ceil(numberOfStuds * (3.3 * CONVERSION_COEFFICIENT));
  const topAndBottomPlates = isImperialUnit
    ? ` ${numberOfFeetOfPlate} feet `
    : ` ${numberOfFeetOfPlate} metres `;
    const studHeightDivisor = isImperialUnit
    ? 8
    : 2.4;
  const studCost = 7;
  const totalCost = (numberOfStuds * studCost) + ((numberOfFeetOfPlate / studHeightDivisor) * studCost);

  const addWall = async (projectName, ownerUserID) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({projectName, ownerUserID})
    };
    try {
        const res = await fetch(
        `http://localhost:3000/walls/post`,
        requestOptions
        );
        const json = await res.json();
        const {name: returnedWall} = json[0];
        setResponse(returnedWall);
        } catch (err) {
            setError(err);
        } 
    return {response, error}    
  }
  const handlePostWall = () => {
    setListOfWalls([...listOfWalls, listOfMeasurements]);
    setNumberOfStuds(numberOfStuds + listOfMeasurements.length);
    addWall(wallLength, currentProject.owner_id);
  };
  function setListOfMeasurementsFunction(fetchedListOfMeasurements) {
    setListOfMeasurements(fetchedListOfMeasurements);
  }
  function setWallLengthFunction(event) {
    setWallLength(event);
  }
  function toggleUnits() {
    setImperialUnit((prevUnit) => !prevUnit);
    setListOfMeasurements(listOfMeasurements);
  }
  const handleClose = () => setModalOpen(false);
  const handleShow = () => setModalOpen(true);

  return (
  <CardGroup className="projectManager">
    <Dashboard currentProject={currentProject} setCurrentProject={(project) => setCurrentProject(project)}/>
    <Card>
      <Card.Header>
        <h1>Carpentry Project Manager</h1>
        <Button onClick={toggleUnits} variant="warning">
          Swap Between Imperial and Metric
        </Button>
      </Card.Header>
      <Card.Body>
        <CardGroup>
        <LumberPrice />
          <Card>
            <Card.Header className="header">Project Total:</Card.Header>
            <Card.Body>
              {`You need ${numberOfStuds} studs.`}
              <br />
              {`You will also need ${topAndBottomPlates}
              of boards for your top and bottom plates.`}
              <br />
              {`It will cost about: $${(totalCost * 1.1).toFixed(2)}`}
            </Card.Body>
          </Card>
          <Card>
            <Card.Header className="header">Directions:</Card.Header>
            <Card.Body>
              Use the Calculator component to layout a wall, and add the wall to your project.
              <br/>
              <Button onClick={handleShow}>
                Open Calculator
              </Button>
              <>
                <Modal show={isModalOpen} onHide={handleClose}>
                  <Modal.Header>
                    <Modal.Title>Wall Stud Calculator</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>                 
                    <Calculator className="calcInstance"
                      isImperialUnit={isImperialUnit}
                      setListOfMeasurements={setListOfMeasurementsFunction}
                      setWallLength={setWallLengthFunction}
                      wallLength={wallLength}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button onClick={handlePostWall} variant="primary">
                      Add Wall to Project
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            </Card.Body>         
          </Card>
        </CardGroup>
      </Card.Body>
        <ListGroupGenerator listOfWalls={listOfWalls} currentProject={currentProject} wallLength={wallLength} />
    </Card>
    </CardGroup>
  );
}


