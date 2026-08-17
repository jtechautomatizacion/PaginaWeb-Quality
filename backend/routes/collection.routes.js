const express = require('express');
const { makeCollectionController } = require('../controllers/collection.controller');

function makeCollectionRouter(config) {
    const router = express.Router();
    const controller = makeCollectionController(config);

    router.get('/', controller.list);
    router.post('/', controller.create);
    router.put('/', controller.update);
    router.delete('/', controller.remove);

    return router;
}

module.exports = { makeCollectionRouter };
