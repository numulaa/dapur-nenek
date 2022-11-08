const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Recipe Routes
router.get("/:id", ensureAuth, recipesController.getRecipe);

router.post(
  "/createRecipe",
  upload.single("file"),
  recipesController.createRecipe
);

router.put("/likeRecipe/:id", recipesController.likeRecipe);
router.post("/saveRecipe/:id", recipesController.saveRecipe);

router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;
