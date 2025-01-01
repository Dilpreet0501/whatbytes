const express = require('express');
const { createTask, listFilteredTasks, listProjectTasks, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:projectId/tasks', auth, createTask);               
router.get('/tasks', auth, listFilteredTasks);                    
router.get('/projects/:projectId/tasks', auth, listProjectTasks); 
router.put('/tasks/:taskId', auth, updateTask);                   
router.delete('/tasks/:taskId', auth, deleteTask);                

module.exports = router;
