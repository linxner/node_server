const mongoose = require('mongoose')

const MovieSchema = require('../schems/movies')

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie