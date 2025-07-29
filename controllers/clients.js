const {
  BadRequestError,
  NotfoundError,
  InternalServerError,
} = require("../Error");
const Client = require("../model/client");
const { StatusCodes } = require("http-status-codes");

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(StatusCodes.OK).json({ data: clients });
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(StatusCodes.CREATED).json({ data: client });
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const getClient = async (req, res) => {
  const {
    params: { id: clientId },
  } = req;
  try {
    const client = await Client.findById(clientId);
    if (!client) {
      const error = new NotfoundError(`No client with id: ${clientId}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(StatusCodes.OK).json({ data: client });
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.msg });
  }
};

const updateClient = async (req, res) => {
  const {
    body: { name, email },
    params: { id: clientId },
  } = req;
  if (name === "" || email === "") {
    const error = new BadRequestError("Please provide a name and email");
    return res.status(error.statusCode).json({ error: error.message });
  }
  try {
    const client = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    if (!client) {
      const error = new NotfoundError(`No client with id: ${clientId}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(StatusCodes.OK).json({ data: client });
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.msg });
  }
};

const deleteClient = async (req, res) => {
  const {
    params: { id: clientId },
  } = req;
  try {
    const client = await Client.findByIdAndDelete(clientId);
    if (!client) {
      const error = new NotfoundError(`No client with id: ${clientId}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.json({ message: "Client deleted successfully!" });
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.msg });
  }
};

module.exports = {
  getAllClients,
  createClient,
  getClient,
  deleteClient,
  updateClient,
};
