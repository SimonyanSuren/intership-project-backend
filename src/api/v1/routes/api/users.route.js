const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/users.controller');

router.get('/getAll', UserController.getAllUsers);
router.get('/get', UserController.getEachUser);
router.get('/search', UserController.searchUsers);

router.post('/fetch', UserController.fetchUsers);

router.patch('/edit', UserController.editUser);
router.delete('/delete/:uuid', UserController.deleteUser);

module.exports = router;
