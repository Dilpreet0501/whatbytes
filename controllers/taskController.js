const prisma = require('../models/prismaClient');

// Create a new task within a project
exports.createTask = async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: {
        ...req.body,
        projectId: parseInt(req.params.projectId, 10),
        assignedUserId: req.body.assignedUserId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Here list all tasks with optional filtering by status and assigned user
exports.listFilteredTasks = async (req, res) => {
  const { status, assignedUserId } = req.query; 
  const filters = {};

  if (status) filters.status = status;
  if (assignedUserId) filters.assignedUserId = assignedUserId;

  try {
    const tasks = await prisma.task.findMany({
      where: filters,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};

// Here tasks for a specific project with optional status filter
exports.listProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.query; 

  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: parseInt(projectId, 10),
        ...(status && { status }), 
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project tasks' });
  }
};

exports.deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Find the task and verify project ownership and assignment
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId, 10) },
    });

    if (!task || task.projectId !== parseInt(projectId, 10)) {
      return res.status(404).json({ error: 'Task not found or does not belong to the project' });
    }

    // Check if the authenticated user is assigned to the task
    if (task.assignedUserId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this task' });
    }

    // Proceed with deletion if authorized
    await prisma.task.delete({
      where: { id: parseInt(taskId, 10) },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Update a specific task by ID within a project
exports.updateTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Find the task and verify project ownership and assignment
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId, 10) },
    });

    if (!task || task.projectId !== parseInt(projectId, 10)) {
      return res.status(404).json({ error: 'Task not found or does not belong to the project' });
    }

    // Check if the authenticated user is assigned to the task
    if (task.assignedUserId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this task' });
    }

    // Proceed with the update if authorized
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId, 10) },
      data: req.body,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};
