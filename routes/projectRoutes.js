const express = require('express');
const { createProject, listProjects, updateProject, deleteProject } = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/', auth, createProject);
router.get('/', auth, listProjects);
router.put('/:projectId', auth, updateProject);
router.delete('/:projectId', auth, deleteProject);

module.exports = router;
