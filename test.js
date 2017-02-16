var imdb = require('imdb-api');
"use strict";
var movie;
 
imdb.getReq(process.argv[2], (err, things) => {
    movie = things;
});
 console.log(movie);
// Promises! 
imdb.get(process.argv[2]).then(console.log(movie));
// imdb.getById('tt0090190').then(console.log);
// imdb.getReq({ name: 'The Toxic Avenger' }).then(console.log);