const {
  BadRequestError,
  NotfoundError,
  InternalServerError,
} = require("../Error");
const Project = require("../model/project");
const { StatusCodes } = require("http-status-codes");

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("client");
    res.status(StatusCodes.OK).json(projects);
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(StatusCodes.CREATED).json(project);
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const getProject = async (req, res) => {
  const {
    params: { id: projectId },
  } = req;
  try {
    const project = await Project.findById(projectId).populate("client");
    if (!project) {
      const error = new NotfoundError(`No project with id: ${projectId}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(StatusCodes.OK).json(project);
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  const {
    body: { title, description },
    params: { id: projectId },
  } = req;
  if (title === "" || description === "") {
    const error = new BadRequestError("Please provide a title and description");
    return res.status(error.statusCode).json({ error: error.message });
  }
  try {
    const project = await Project.findByIdAndUpdate(projectId, req.body, {
      new: true,
    });
    if (!project) {
      const error = new NotfoundError(`No project with id: ${projectId}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(StatusCodes.OK).json(project);
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const {
    params: { id: projectId },
  } = req;
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      const error = new NotfoundError(`No project with id: ${projectId}`);
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.json({ message: "Project deleted successfully!" });
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

const projectByClient = async (req, res) => {
  const {
    params: { clientId: clientId },
  } = req;
  try {
    const projects = await Project.find({
      client: clientId,
    }).populate("client");
    res.status(StatusCodes.OK).json(projects);
  } catch (err) {
    console.error(err);
    const error = new InternalServerError("Server error");
    res.status(error.statusCode).json({ error: error.message });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProject,
  deleteProject,
  updateProject,
  projectByClient,
};
