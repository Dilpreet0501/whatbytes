const express = require('express');
const { createUser, listUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser);
router.get('/', listUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
