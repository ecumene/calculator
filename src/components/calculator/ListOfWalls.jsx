import React from "react";
import PropTypes from "prop-types";
import {Button, Card, ListGroup, Spinner} from "react-bootstrap";
import {checkForNameToDisplay} from "../utils/utilities";
import usePostAPI from "../../hooks/usePostAPI";

export default function ListOfWalls({
  listOfWalls,
  currentProject,
  isImperialUnit,
  deleteCallback,
}) {
  console.log("List of Walls:", listOfWalls);

  const [{isLoading: loadingBool, error: deleteError}, callAPI] = usePostAPI();

  const handleDeleteWall = async (id) => {
    const {status: deleteRes} = await callAPI(`http://localhost:3000/walls?id=${id}`);

    if (deleteRes === "Deleted!") {
      deleteCallback();
    }
  };
  if (deleteError) {
    return <div>{deleteError}</div>;
  }

  return loadingBool ? (
    <Spinner animation="border" />
  ) : (
    <ListGroup className="listGroup" variant="flush">
      <h3 className="listGroupHeader">{checkForNameToDisplay(currentProject.name)}</h3>
      {listOfWalls.length > 0 ? (
        listOfWalls.map((item) => (
          <ListGroup.Item key={item.id}>
            <Card bg="secondary">
              <Card.Body className="listGroupItem">
                {item.wallLength}
                &nbsp; 
{' '}
{isImperialUnit ? "inches." : "milimetres."}
                <br />
                {item.studs}
                &nbsp; studs.
                <br />
                Measurements: &nbsp;
                {item.list.join(" | ")}
              </Card.Body>
              <Button variant="danger" onClick={() => handleDeleteWall(item.id)}>
                REMOVE
              </Button>
            </Card>
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item className="emptyList">
          <h1>No Walls Created</h1>
        </ListGroup.Item>
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
  isImperialUnit: PropTypes.bool.isRequired,
  deleteCallback: PropTypes.func.isRequired,
};