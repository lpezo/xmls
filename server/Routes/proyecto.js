const express = require("express");
const router = express.Router({ mergeParams: true });
const proyectoService = require("../Services/proyecto");

/* User Registration. */
router.post("/add", proyectoService.add);

router.put('/upd', proyectoService.upd);

router.delete('/del/:id', proyectoService.del);

router.post('/list', proyectoService.list);

router.post('/send', proyectoService.receive);

router.post('/refresh/:id', proyectoService.refresh);

router.post('/procesa/:id', proyectoService.proc);

module.exports = router;