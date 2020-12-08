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
  }
}

module.exports = categoryService