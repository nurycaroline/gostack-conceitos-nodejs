const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Middlewares
 */

function validateID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  return next();
}

function checkRepositoryID(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  return next();
}

app.use("/repositories/:id", validateID, checkRepositoryID);

/**
 * Routes
 */

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id == id);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id == id);
  const repoLikes = repositories[repositoryIndex].likes;

  repositories[repositoryIndex].likes = repoLikes + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
