import React from "react";
import PropTypes from "prop-types";
import {Button, Card, ListGroup} from "react-bootstrap";
import checkForNameToDisplay from "./reusableCode";

export default function ListGroupGenerator({listOfWalls, currentProject}) {
console.log("List of Walls:", listOfWalls);
 
  return (
    <ListGroup className="listGroup" variant="flush">
      <h3 className="listGroupHeader">{checkForNameToDisplay(currentProject.name)}</h3>
      {listOfWalls.map((item) => (
        <ListGroup.Item key={listOfWalls.id}>
          <Card bg="secondary">
            <Card.Body className="listGroupItem">
              {`${item.wall_length} inches.`}
              <br/>
              {`${item.studs} studs.`}
              <br/>
              {`Measurements: ${item.list}`}
            </Card.Body>
            <Button variant="danger" >REMOVE</Button>
          </Card>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

ListGroupGenerator.propTypes = {
  listOfWalls: PropTypes.arrayOf(PropTypes.shape({wall_length: PropTypes.number, studs: PropTypes.number, list: PropTypes.arrayOf(PropTypes.number)})).isRequired,
  currentProject: PropTypes.shape({id: PropTypes.number, name: PropTypes.string, owner_id: PropTypes.number}).isRequired,
};
