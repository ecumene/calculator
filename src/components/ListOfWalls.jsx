import React from "react";
import PropTypes from "prop-types";
import {Button, Card, ListGroup} from "react-bootstrap";
import {checkForNameToDisplay} from "./utilities";

export default function ListOfWalls({listOfWalls, currentProject}) {
  console.log("List of Walls:", listOfWalls);

  // TODO wall length needs imperial/metric context
  return (
    <ListGroup className="listGroup" variant="flush">
      <h3 className="listGroupHeader">{checkForNameToDisplay(currentProject.name)}</h3>
      {listOfWalls ? (
        listOfWalls.map((item) => (
          <ListGroup.Item key={listOfWalls.id}>
            <Card bg="secondary">
              <Card.Body className="listGroupItem">
                {item.wallLength}
                &nbsp; inches.
                <br />
                {item.studs}
                &nbsp; studs.
                <br />
                Measurements: &nbsp;
                {item.list.join(" | ")}
              </Card.Body>
              <Button variant="danger">REMOVE</Button>
            </Card>
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No Walls Created</ListGroup.Item>
      )}
    </ListGroup>
  );
}

ListOfWalls.propTypes = {
  listOfWalls: PropTypes.arrayOf(
    PropTypes.shape({
      wall_length: PropTypes.number,
      list: PropTypes.arrayOf(PropTypes.number),
      studs: PropTypes.number,
    })
  ).isRequired,
  currentProject: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};
