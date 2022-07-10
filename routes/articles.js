// This JS file contains all routes directly related to articles, e.g "Read more", "Edit"

const express = require('express')
const Article = require('./../models/article')
const router = express.Router() // this is a function and gives us a route we can use to do get requests, similar to the app.gets
// we have to tell our app to use this route, so we have to export the module and use it in our other js files
// similar to how we we're doing things before we used express

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() }) //we're passing in a brand new defualt article to stop it reloading something thats not valid
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id) // req.params grabs the article
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => { //we've set up the route to respond to article id's (now slugs)
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('./articles/show', { article: article }) // we send this id when a new file is created it's stored in /show because thats the page we send when the form submits
})

router.post('/', async (req,res) => {   // when we submit a form its gona call this router.post which will tkae it to / after the article

  let article = new Article({  // weve created a new article and passed in our all of our new articles
      title: req.body.title,
      description: req.body.description, // takes whatever we pass in the form 
      markdown: req.body.markdown

  })

  try{ 
 article =  await article.save()
 res.redirect(`/articles/${article.slug}`) // redirecting to the article id page if it saves properly
  } catch (e) {
      console.log(e)
  res.render('articles/new', {article: article})
  }
})

router.put('/:id', async (req, res, next) => { // when we submit a form its gona call this router.post which will tkae it to / after the article
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit')) // runs the function which combines put and post

router.delete('/:id', async (req, res) => { // deleting article is an asyrnconhous function, method override library has to be installed and used
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description // takes whatever we pass in the form 
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router