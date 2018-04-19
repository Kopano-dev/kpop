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
