const express = require("express");
const {
  getAllProjects,
  createProject,
  getProject,
  deleteProject,
  updateProject,
  projectByClient,
} = require("../controllers/projects");

const routes = express.Router();

routes.route("/").get(getAllProjects).post(createProject);
routes.route("/by-client/:clientId").get(projectByClient);
routes.route("/:id").get(getProject).delete(deleteProject).put(updateProject);

module.exports = routes;
