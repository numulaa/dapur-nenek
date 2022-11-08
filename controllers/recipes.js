const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Saved = require("../models/Saved");

module.exports = {
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { recipes: recipes });
    } catch (err) {
      console.log(err);
    }
  },
  getMyRecipe: async (req, res) => {
    try {
      const recipes = await Recipe.find({ user: req.user.id });
      res.render("myRecipe.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipes = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createRecipeForm: async (req, res) => {
    try {
      res.render("add-recipe.ejs");
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Recipe.create({
        title: req.body.foodTitle,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        direction: req.body.direction,
        likes: 0,
        user: req.user.id,
        createdBy: req.user.userName,
      });
      console.log("Post has been added!");
      res.redirect("/myRecipe");
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  saveRecipe: async (req, res) => {
    try {
      await Saved.create({ user: req.user.id, recipe: req.params.id });
      console.log("recipe saved");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  getSavedRecipe: async (req, res) => {
    try {
      const recipes = await Saved.find({ user: req.user.id }).populate(
        "recipe"
      );
      res.render("savedRecipe.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find recipe by id
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete recipe from db
      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/myRecipe");
    } catch (err) {
      res.redirect("/myRecipe");
    }
  },
};
