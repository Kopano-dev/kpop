export function qualifyURL(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.href;
}

export function showErrorInLoader(msg='Unknown error', err=null) {
  let loader = document.getElementById('loader');
  if (!loader) {
    loader = document.createElement("div");
    loader.id = 'loader';
    document.body.appendChild(loader);
  } else {
    loader.innerHTML='';
  }
  loader.appendChild(document.createTextNode(msg));
  if (err) {
    loader.appendChild(document.createTextNode(' '+err));
  }
}

export function parseParams(s) {
  if (!s) {
    return {};
  }
  let pieces = s.split('&');
  let data = {};
  let parts;
  for (let i = 0; i < pieces.length; i++) {
    parts = pieces[i].split('=');
    if (parts.length < 2) {
      parts.push('');
    }
    data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return data;
}

export function encodeParams(data) {
  let ret = [];
  for (let d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

export function parseQuery(s) {
  if (!s) {
    return {};
  }
  let pieces = s.split('&');
  let data = {};
  let parts;
  for (let i = 0; i < pieces.length; i++) {
    parts = pieces[i].split('=');
    if (parts.length < 2) {
      parts.push('');
    }
    data[decodeURI(parts[0])] = decodeURI(parts[1]);
  }

  return data;
}

export function encodeQuery(data) {
  let ret = [];
  for (let d in data) {
    ret.push(encodeURI(d) + '=' + encodeURI(data[d]));
  }
  return ret.join('&');
}

export function forceBase64URLEncoded(s) {
  // Converts Base64 Standard encoded string to Base64 URL encoded string. See
  // https://tools.ietf.org/html/rfc4648#section-5 for the specification.
  return s.replace(/\+/g, '-').replace(/\//, '_');
}

export function forceBase64StdEncoded(s) {
  // Converts Base64 URL encoded string to Base64 Standard encoded string. See
  // https://tools.ietf.org/html/rfc4648#section-5 for the specification.
  return s.replace(/-/g, '+').replace(/_/, '/');
}

export function isInStandaloneMode() {
  // Checks if running as progressive web app in standalone mode.
  return (
    window.matchMedia('(display-mode: standalone)').matches || // Standard compliant https://w3c.github.io/manifest/#the-display-mode-media-feature
    window.navigator.standalone // Safari meh :/
  );
}
