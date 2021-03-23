let http = (options = {}) => {
  options.type = (options.type || 'GET').toUpperCase()
  let params = formatParams(options.data)
  let xhr = new XMLHttpRequest()

  if (options.type === 'GET') {
    xhr.open('GET', options.url + '?' + params)
    xhr.send(null)
  }

  if (options.type === 'POST') {
    xhr.open('POST', options.url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    Object.keys(options.header).forEach(key => { xhr.setRequestHeader(key, options.header[key]) })
    xhr.send(JSON.stringify(options.data))
  }

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr)
        }
      }
    }
  })
}

let formatParams = (data) => {
  var arr = []
  for (var name in data) {
    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
  }
  arr.push('s=' + new Date().getTime())
  return arr.join('&')
}

export default http
