import {Button, Card, CardColumns, CardGroup, Modal} from "react-bootstrap";
import React, {useState} from "react";
import ListGroupGenerator from "./ListGroupGenerator";
import LumberPrice from "./LumberPrice";
import Calculator from "./Calculator";
import Dashboard from "./Dashboard";
import RegisterUser from "./RegisterUser";
import ReturningUser from "./ReturningUser";

const CONVERSION_COEFFICIENT = 0.3048;
const PRODUCTION_USER_ID = 1;

export default function ProjectManager() {
  const [currentProject, setCurrentProject] = useState({id: 0, name: "", owner_id: 1});
  const [isImperialUnit, setImperialUnit] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [listOfMeasurements, setListOfMeasurements] = useState([]);
  const [listOfWalls, setListOfWalls] = useState([]);
  const [numberOfStuds, setNumberOfStuds] = useState(0);
  const [user, setUser] = useState({
    username: null,
    password: "password",
    id: PRODUCTION_USER_ID,
  });
  const [wallLength, setWallLength] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  console.log("Error:", error);
  const numberOfFeetOfPlate = isImperialUnit
    ? Math.ceil(numberOfStuds * 3.3)
    : Math.ceil(numberOfStuds * (3.3 * CONVERSION_COEFFICIENT));
  const topAndBottomPlates = isImperialUnit
    ? ` ${numberOfFeetOfPlate} feet `
    : ` ${numberOfFeetOfPlate} metres `;
  const studHeightDivisor = isImperialUnit ? 8 : 2.4;
  const studCost = 7;
  const totalCost =
    numberOfStuds * studCost + (numberOfFeetOfPlate / studHeightDivisor) * studCost;

  const addWall = async (length, projectID) => {
    console.log(length, projectID);
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({length, projectID}),
    };
    try {
      const res = await fetch(`http://localhost:3000/walls/post`, requestOptions);
      const json = await res.json();
      setResponse(json);
      // TODO SET LIST OF WALLS HERE?
      console.log(json);
    } catch (err) {
      setError(err);
    }
  };
  const handlePostWall = async () => {
    console.log(wallLength);
    setListOfWalls([
      ...listOfWalls,
      {
        wall_length: wallLength,
        studs: listOfMeasurements.length,
        list: listOfMeasurements,
      },
    ]);
    setNumberOfStuds(numberOfStuds + listOfMeasurements.length);
    await addWall(wallLength, currentProject.id);
    console.log(response);
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
      <CardColumns>
        <RegisterUser 
          setCurrentProject={(project) => setCurrentProject(project)} 
          user={user}
          setUser={(u) => setUser(u)}
        />
        <ReturningUser 
          setCurrentProject={(project) => setCurrentProject(project)} 
          user={user}
          setUser={(u) => setUser(u)}
        />
        <Dashboard
          currentProject={currentProject}
          setCurrentProject={(project) => setCurrentProject(project)}
          user={user}
        />
      </CardColumns>
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
                Use the Calculator component to layout a wall, and add the wall to your
                project.
                <br />
                <Button onClick={handleShow}>Open Calculator</Button>
                <>
                  <Modal show={isModalOpen} onHide={handleClose}>
                    <Modal.Header>
                      <Modal.Title>Wall Stud Calculator</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Calculator
                        className="calcInstance"
                        isImperialUnit={isImperialUnit}
                        listOfMeasurements={listOfMeasurements}
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
        <ListGroupGenerator
          listOfWalls={listOfWalls}
          currentProject={currentProject}
          wallLength={wallLength}
        />
      </Card>
    </CardGroup>
  );
}
