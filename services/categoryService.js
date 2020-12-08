const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id).then(category => {
          return callback({ categories, category: category.toJSON() })
        })
      }
      return callback({ categories })
    })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }

    return Category.create({
      name: req.body.name
    }).then(category => {
      callback({ status: 'success', message: "Category has been successfully added" })
    })
  }
}

module.exports = categoryService