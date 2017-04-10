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

function countLines(code) {
  return code.split("\n").length;
}

function countColumns(code) {
  return Math.max.apply(null, code.split("\n").map(function(e) {return e.length}));
}

function makeHtml(code, language) {
  html = "<pre>";
  if (language) {
    html += '<code language="' + language + '">';
  } else {
    html += '<code>'
  }
  html += code;
  html += "</code></pre>";
  return html;
}

function makeHtmlFooter(filename, author, author_url, url, provider) {
  html = "View ";
  html += '<a href="' + url + '">' + filename + '</a>';
  html += ' by ';
  html += '<a href="' + author_url + '">' + author + '</a>';
  html += ' on ';
  html += '<a href="' + url + '">' + provider + '</a>';
  return html;
}

function getGistInfo(url) {
  return request({
      "method": "GET",
      "uri": ["http://api.github.com","gists", url.id].join("/"),
      "headers": {"User-Agent": "OEmbed Parser"},
      "json": true
    }).then(function(body) {
      return {
        "height": countLines(body.files[Object.keys(body.files)[0]].content) * 15,
        "width": countColumns(body.files[Object.keys(body.files)[0]].content) * 10,
        "html": makeHtml(body.files[Object.keys(body.files)[0]].content) + 
          makeHtmlFooter(body.files[Object.keys(body.files)[0]].filename,
          url.author_name,
          body.owner.html_url,
          url.url,
          url.provider
        ),
        "type": url.type,
        "provider": url.provider,
        "provider_url": url.provider_url,
        "version": url.version,
        "author_name": url.author_name,
        "author_url": body.owner.html_url,
        "thumbnail_url": body.owner.avatar_url,
        "thumbnail_height": 460,
        "thumbnail_width": 460
      };
    });
}

function getGitHubInfo(url) {
  return request({
    "method": "GET",
    "uri": ["http://api.github.com", "repos", url.author_name, url.repo, "contents", url.path].join("/"),
    "headers": {"User-Agent": "OEmbed Parser"},
    "json": true,
    "qs": {"ref": url.ref}
  }).then(function(body) {
    return request({
      "method": "GET",
      "uri": body.download_url,
      "headers": {"User-Agent": "OEmbed Parser"}
    }).then(function(raw){
      return {
        "height": countLines(raw) * 15,
        "width": countColumns(raw) * 10,
        "html": makeHtml(raw) + 
          makeHtmlFooter(body.name,
          url.author_name,
          url.author_url,
          url.url,
          url.provider
        ),
        "type": url.type,
        "provider": url.provider,
        "provider_url": url.provider_url,
        "version": url.version,
        "author_name": url.author_name,
        "author_url": url.author_url
      };
    });
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
    return getGitHubInfo(url);
  } else if (url.provider == "GitHubGist") {
    url = parseGist(url);
    return getGistInfo(url);
  }
  
  return url;
}

function main(params) {
  var url = params.url;
  if (!url) {
    return {"error":"Missing URL parameter 'url' of the page to embed."};
  }
  if (!parseUrl(url).provider) {
    return {'version':'1.0', 'error': 'no matching provider found', 'url':url}
  }
  return enrichUrl(parseUrl(url));
}

main({'url':'https://gist.github.com/trieloff/013509c40db9860746fe3977acadb676'}).then(function(result) {
  console.log(result);
});


main({'url':'https://github.com/Microsoft/reactxp/blob/release_0.34.1/README.md'}).then(function(result) {
  console.log(result);
});


/*

main({'url':'https://github.com/Microsoft/reactxp/blob/release_0.34.1/README.md'}).then(function(result) {
  console.log(result);
});

main({'url':'https://github.com/Microsoft/reactxp/blob/release_0.34.1/README.md'}).then(function(result) {
  console.log(result);
});

*/



//console.log(main({'url':'http://www.youtube.com'}));