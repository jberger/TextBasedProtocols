function cloneAttributes(target, source) {
  [...source.attributes].forEach( attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName ,attr.nodeValue) })
}

export default class Include {
  constructor(path) {
    this.id = 'include';
    this.base = path;
    this.cite = true;
    this.useScriptElement = false;
  }

  async includeFile(elem) {
    const path = elem.dataset.include;
    const res = await fetch(this.base + path);
    const text = await res.text();
    let target = elem;

    // build proper container if not already a code tag
    if (elem.tagName !== 'CODE') {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      cloneAttributes(code, elem);

      if (this.useScriptElement) {
        target = document.createElement('script');
        target.type='text/template';
        code.appendChild(target);
      } else {
        target = code;
      }

      pre.appendChild(code);
      elem.appendChild(pre);
      elem.classList.add('include', 'include-container');

      // override global cite with data-include-no-cite
      if (this.cite && 'includeNoCite' in elem.dataset === false) {
        const cite = document.createElement('div');
        cite.textContent = path;
        cite.classList.add('include', 'include-citation');
        elem.appendChild(cite);
      }

      elem = code;
    }

    const lang = elem.dataset.includeLang;
    if (lang) {
      elem.classList.add(lang);
    }

    if (target.tagName === 'SCRIPT') {
      target.text = text;
    } else if ('includeHtml' in elem.dataset) {
      // include as html with data-include-html
      target.innerHTML = text;
    } else {
      target.textContent = text;
    }
  }

  init (reveal) {
    const elems = Array.from(document.querySelectorAll('[data-include]'));
    return Promise.all(elems.map(elem => this.includeFile(elem)));
  };
}
