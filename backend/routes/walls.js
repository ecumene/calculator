const express = require("express");
const pool = require("../db");

const BASE_STUD = 0;
const CENTER_SPACING_IMPERIAL = 16;
const CENTER_SPACING_METRIC = 406.4;
const STUD_OFFSET_IMPERIAL = 0.75;
const STUD_OFFSET_METRIC = 19;
const router = express.Router();

const getListOfMeasurements = (wallLength, isImperialUnit) => {
  const newArray = [BASE_STUD];
  const onCenterSpacing =
    isImperialUnit === "true" ? CENTER_SPACING_IMPERIAL : CENTER_SPACING_METRIC;
  const studOffset =
    isImperialUnit === "true" ? STUD_OFFSET_IMPERIAL : STUD_OFFSET_METRIC;

  for (
    let studCount = 1;
    studCount < Math.ceil(wallLength / onCenterSpacing);
    studCount += 1
  ) {
    newArray.push(studCount * onCenterSpacing - studOffset);
  }
  newArray.push(wallLength - 2 * studOffset);
  return isImperialUnit === "true"
    ? newArray
    : newArray.map((roundedItem) => Math.round(roundedItem));
};

router.route("/").get(({query: {wallLength, isImperialUnit}}, res) => {
  res.json(getListOfMeasurements(wallLength, isImperialUnit));
});

router.route("/post").post(async ({body: {length, projectID}}, res) => {
  try {
    const newWall = await pool.query(
      "INSERT INTO walls (wall_length, project_id) VALUES ($1, $2) RETURNING wall_length, project_id",
        [length, projectID]
      );
      res.json(newWall.rows);
  } catch (err) {
    res.json({message: err.message});
  }
});

module.exports = router;
