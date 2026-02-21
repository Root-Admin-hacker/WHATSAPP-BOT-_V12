const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'data', 'offline_queue.json')

function load() {
  try {
    if (!fs.existsSync(FILE)) return []
    const raw = fs.readFileSync(FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    console.error('offline_queue: load error', e)
    return []
  }
}

function save(queue) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(queue, null, 2))
  } catch (e) {
    console.error('offline_queue: save error', e)
  }
}

let queue = load()

module.exports = {
  enqueue(item) {
    queue.push(Object.assign({ ts: Date.now() }, item))
    save(queue)
  },
  peekAll() {
    return queue.slice()
  },
  drainAll() {
    const all = queue.slice()
    queue = []
    save(queue)
    return all
  },
  size() {
    return queue.length
  }
}
