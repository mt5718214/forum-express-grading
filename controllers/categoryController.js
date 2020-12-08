const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

module.exports = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }

      req.flash('success_msg', data['message'])
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', "name didn't exist")
      return res.redirect('back')
    }

    return Category.findByPk(req.params.id).then(category => {
      return category.update({
        name: req.body.name
      })
        .then(category => {
          req.flash('success_msg', 'Category has been successfully updated')
          res.redirect('/admin/categories')
        })
    })
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            req.flash('success_msg', 'Category has been successfully deleted')
            res.redirect('/admin/categories')
          })
      })
  }

}