var request = require('request-promise');

function parseUrl(url) {
  var fragments = url.split("/");
  
  var providers = {
    "github.com": "GitHub",
    "gist.github.com": "GitHubGist"
  };
  
  var urls = {
    "github.com": "https://github.com",
    "gist.github.com": "https://gist.github.com"
  }
  
  return {
    'url': url,
    'provider': providers[fragments[2]],
    'provider_url': urls[fragments[2]],
    'type': 'rich',
    'version': '1.0'
  }; 
}

function main(params) {
  var url = params.url;
  if (!parseUrl(url).provider) {
    return {'version':'1.0', 'error': 'no matching provider found', 'url':url}
  }
  return parseUrl(url);
}

console.log(main({'url':'https://gist.github.com/trieloff/013509c40db9860746fe3977acadb676'}));
console.log(main({'url':'https://github.com/Microsoft/reactxp/blob/release_0.34.1/README.md'}));
console.log(main({'url':'http://www.youtube.com'}));