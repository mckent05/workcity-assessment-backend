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
    res.status(StatusCodes.OK).json(clients);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerError("Server error"));
  }
};

const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerError("Server error"));
  }
};

const getClient = async (req, res) => {
  const {
    params: { id: clientId },
  } = req;
  try {
    const client = await Client.findById(clientId);
    if (!client)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(NotfoundError(`No client with id: ${clientId}`));
    res.status(StatusCodes.OK).json(client);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerError("Server error"));
  }
};

const updateClient = async (req, res) => {
  const {
    body: { name, email },
    params: { id: clientId },
  } = req;
  if (name === "" || email === "") {
    return BadRequestError("Please add a value for both name and email");
  }
  try {
    const client = await Client.findByIdAndUpdate(clientId, req.body, {
      new: true,
    });
    if (!client)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(NotfoundError(`No client with id: ${clientId}`));
    res.status(StatusCodes.OK).json(client);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerError("Server error"));
  }
};

const deleteClient = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const foundJob = await Job.findByIdAndDelete({
    _id: jobId,
    userId,
  });
  if (!foundJob) {
    throw NotfoundError(`No job with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json("Job deleted successfully");
};

module.exports = {
  getAllClients,
  createClient,
  getClient,
  deleteClient,
  updateClient,
};
