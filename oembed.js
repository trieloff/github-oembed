var request = require('request-promise');

function main(params) {
  return   {
    "width": 425,
    "author_name": "schmoyoho",
    "author_url": "http://www.youtube.com/user/schmoyoho",
    "version": "1.0",
    "provider_url": "http://www.github.com/",
    "provider_name": "GitHub",
    "thumbnail_width": 480,
    "thumbnail_url": "http://i3.ytimg.com/vi/bDOYN-6gdRE/hqdefault.jpg",
    "height": 344,
    "thumbnail_height": 360,
    "html": "<iframe type='text/html' width='425' height='344' src='http://www.youtube.com/embed/bDOYN-6gdRE' frameborder=0></iframe>",
    "url": "http://www.youtube.com/watch?v=bDOYN-6gdRE",
    "type": "rich",
    "title": "Auto-Tune the News #8: dragons. geese. Michael Vick. (ft. T-Pain)"
  };
}

main({'url':'https://gist.github.com/trieloff/013509c40db9860746fe3977acadb676'})