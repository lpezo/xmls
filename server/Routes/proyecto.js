const express = require("express");
const router = express.Router({ mergeParams: true });
const proyectoService = require("../Services/proyecto");

/* User Registration. */
router.post("/add", proyectoService.add);

router.put('/upd', proyectoService.upd);

router.delete('/del/:id', proyectoService.del);

router.post('/list', proyectoService.list);

/* env */
router.get("/env", proyectoService.env);
module.exports = router;