const express = require("express");
const {
  getAllClients,
  createClient,
  getClient,
  deleteClient,
  updateClient,
} = require("../controllers/clients");

const routes = express.Router();

routes.route("/").get(getAllClients).post(createClient);

routes.route("/:id").get(getClient).delete(deleteClient).put(updateClient);

module.exports = routes;
