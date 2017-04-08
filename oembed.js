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

function shiftN(arr, n) {
  for (i=0;i<n;i++) {
    arr.shift();
  }
  return arr;
}

function parseGitHub(url) {
  url["repo"] = url.url.split("/")[4];
  url["ref"] = url.url.split("/")[6];
  url["path"] = shiftN(url.url.split("/"), 7).join("/");
  return url;
}

function parseGist(url) {
  url["id"] = shiftN(url.url.split("/"), 4).pop();
  return url;
}

function getGistInfo(url) {
  return request({
      "method": "GET",
      "uri": ["http://api.github.com","gists", url.id].join("/"),
      "headers": {"User-Agent": "OEmbed Parser"},
      "json": true
    }).then(function(body) {
      return {
        "filename": body.files
      };
    });
}

function enrichUrl(url) {
  url["author_name"] = url.url.split("/")[3];
  
  var urls = {
    "github.com": "https://github.com/" + url.url.split("/")[3],
    "gist.github.com": "https://gist.github.com" + url.url.split("/")[3]
  }
  
  if (url.provider == "GitHub") {
    url = parseGitHub(url);
  } else if (url.provider == "GitHubGist") {
    url = parseGist(url);
    return getGistInfo(url);
  }
  
  return url;
}

function main(params) {
  var url = params.url;
  if (!parseUrl(url).provider) {
    return {'version':'1.0', 'error': 'no matching provider found', 'url':url}
  }
  return enrichUrl(parseUrl(url));
}

main({'url':'https://gist.github.com/trieloff/013509c40db9860746fe3977acadb676'}).then(function(result) {
  console.log(result);
});
console.log(main({'url':'https://github.com/Microsoft/reactxp/blob/release_0.34.1/README.md'}));
console.log(main({'url':'https://github.com/Microsoft/reactxp/blob/master/samples/README.md'}));
console.log(main({'url':'http://www.youtube.com'}));