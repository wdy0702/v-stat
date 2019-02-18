const equal = require('deep-equal')

let last_msg

const isValid = function(v) {
  if (v === undefined || v === null) return false
  if (Array.isArray(v) && v.length === 0) return false
  if (v === '') return false
  if (typeof v === 'object' && Object.keys(v).length === 0) return false
  return true
}

const MSG = function(send, aux, binding, event, vnode) {
  const info = binding.value.info
  const page = binding.value.page
  const value = info && vnode.context[binding.value.info]
  let msg
  if (info === undefined || isValid(value)) {
    msg = Object.assign({
      target: binding.value.target,
      event: event,
      page: page,
      info: value
    }, aux)
    if (last_msg === undefined || msg.target !== last_msg.target || msg.event !==
      last_msg.event || msg
      .page !== last_msg.page || msg.info !== last_msg.info || event ===
      'click') {
      last_msg = Object.assign({}, msg)
      msg.timestamp = Date.now()
      send(msg)
    }
  }
}

export default function(send, aux) {
  return {
    // called only once when first bound to element
    bind: function(el, binding, vnode) {
      const events = binding.arg.split('&')

      // click
      if (events.indexOf('click') > -1) {
        el.addEventListener('click', (e) => {
          if (e.clientX !== 0 || e.clientY !== 0) {
            MSG(send, aux, binding, 'click', vnode)
          }
        })
      }

      // enter
      if (events.indexOf('enter') > -1) {
        const self = this
        el.addEventListener('keydown', (e) => {
          if (e.which == 13 || e.keyCode == 13) {
            MSG(send, aux, binding, 'enter', vnode)
          }
        })
      }

      // ready
      if (events.indexOf('ready') > -1) {
        MSG(send, aux, binding, 'ready', vnode)
      }
    },

    // called when bound element has been inserted into its parent node
    inserted: function(el, binding, vnode) {},

    // called when VNode has been updated
    // possibly not after its children have benn updated
    update: function(el, binding, vnode, oldVnode) {
      // console.log('update')
      if (equal(vnode, oldVnode)) return

      const events = binding.arg.split('&')

      // typing
      if (events.indexOf('typing') > -1) {
        MSG(send, aux, binding, 'typing', vnode)
      }
    },

    // called when VNode and its children have been updated
    componentUpdated: function(el, binding, vnode, oldVnode) {
      // console.log('componentUpdated')
      if (equal(vnode, oldVnode)) return

      const events = binding.arg.split('&')

      // select
      if (events.indexOf('select') > -1) {
        MSG(send, aux, binding, 'select', vnode)
      }

    },

    // called only once when directive is unbounded from the element
    unbind: function(el, binding, vnode) {
      // console.log('unbind')
      const events = binding.arg.split('&')

      if (events.indexOf('click') > -1) {
        el.removeEventListener(event, () => {})
      }

      // exit
      if (events.indexOf('exit') > -1) {
        MSG(send, aux, binding, 'exit', vnode)
      }
    }
  }
}
