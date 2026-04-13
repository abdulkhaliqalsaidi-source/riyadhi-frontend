// Updates <title> and meta tags dynamically per page
export function useSeo() {
  function setPage({ title, description, url } = {}) {
    if (title) {
      document.title = title
      setMeta('og:title',       title)
      setMeta('twitter:title',  title)
    }
    if (description) {
      setMeta('description',         description)
      setMeta('og:description',      description)
      setMeta('twitter:description', description)
    }
    if (url) {
      setMeta('og:url', url, 'property')
    }
  }

  function setMeta(name, content, attr = 'name') {
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  return { setPage }
}
