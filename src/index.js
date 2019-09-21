export default class DelegateCenter {
  constructor() {
    this.typesMap = Object.create(null)
  }

  // 创建新的事件类型
  _createEventType(type) {
    this.typesMap[type] = new Map()
    const validatorsMap = this.typesMap[type]
    // 事件委托
    document.addEventListener(type, e => {
      this._runListeners(validatorsMap, e)
    })
  }

  _runListeners(validatorsMap, e) {
    for (let validator of validatorsMap.keys()) {
      if (this._isMatchValidator(validator, e.target)) {
        validatorsMap.get(validator).forEach(listener => {
          listener(e)
        })
      }
    }
  }

  /**
   * 节点验证
   * @param {String, Array, Node} selector
   * @param {*} $node 事件触发节点
   * @param {Boolean} isExcept 是否为排除验证器
   */
  _isMatchSelector(selector, $node, isExcept = false) {
    if (!$node) {
      return false
    }

    if (typeof selector === 'string') {
      if (/^\./.test(selector)) {
        const className = selector.replace(/^\./, '')
        return $node.classList.contains(className)
      } else if (/^#/.test(selector)) {
        const id = selector.replace(/^#/, '')
        return $node.id === id
      } else {
        const tagName = selector.toUpperCase()
        return $node.tagName === tagName
      }
    }

    if (selector instanceof Node) {
      return $node.isSameNode(selector)
    }

    if (Array.isArray(selector) && selector.length > 0) {
      if (isExcept) {
        return selector.some(s => this._isMatchSelector(s, $node))
      } else {
        return selector.every(s => this._isMatchSelector(s, $node))
      }
    }

    throw 'Please make sure validator is valid!'
  }

  /**
   * 类型验证
   * @param {null, String, Array, Node, Object, Function} validator 验证器
   * @param {Node} $node 事件触发节点
   */
  _isMatchValidator(validator, $node) {
    if (validator === undefined || !$node) {
      return false
    }

    if (validator === null) {
      return true
    }
    //================单匹配验证器================
    if (
      typeof validator === 'string' ||
      Array.isArray(validator) ||
      validator instanceof Node
    ) {
      return this._isMatchSelector(validator, $node)
    }
    //================自定义验证器================
    if (typeof validator === 'function') {
      return validator()
    }
    //================匹配与排除验证器================
    if (
      typeof validator === 'object' &&
      ('selector' in validator || 'exceptSelector' in validator)
    ) {
      let isMatchSelector = false
      let isMisMatchExceptSelector = false

      // 判断是否匹配选择器
      if (validator.selector) {
        isMatchSelector = this._isMatchSelector(validator.selector, $node)
      } else {
        isMatchSelector = true
      }
      // 判断是否匹配被排除选择器
      if (validator.exceptSelector) {
        isMisMatchExceptSelector = !this._isMatchSelector(
          validator.exceptSelector,
          $node
        )
      } else {
        isMisMatchExceptSelector = true
      }
      return isMatchSelector && isMisMatchExceptSelector
    }

    throw 'Please make sure validator is valid!'
  }

  /**
   * 添加监听事件
   * @param {String} type 事件的类型，如'click'
   * @param {null, String, Array, Node, Object, Function} validator 验证器，支持多种类型验证
   * @param {Function} listener 触发后执行的监听函数
   */
  add(type, validator, listener) {
    if (typeof type !== 'string' || !type) {
      throw 'Please make sure event type is valid!'
    }
    if (validator === undefined) {
      throw 'Please make sure validator is valid!'
    }
    if (typeof listener !== 'function') {
      throw 'Please make sure validator is a Function!'
    }

    if (!(type in this.typesMap)) {
      this._createEventType(type)
      let validatorsMap = this.typesMap[type]
      validatorsMap.set(validator, [listener])
    } else {
      let validatorsMap = this.typesMap[type]
      if (validatorsMap.has(validator)) {
        validatorsMap.get(validator).push(listener)
      } else {
        validatorsMap.set(validator, [listener])
      }
    }
    return this
  }

  remove(type, selector, listener) {
    //判断是否存在该事件类型
    if (!(type in this.typesMap)) {
      return
    }

    const validatorsMap = this.typesMap[type]
    //判断是否该事件类型是否存在触发元素和是否存在监听器
    if (
      !validatorsMap.has(selector) ||
      !validatorsMap.get(selector).length === 0
    ) {
      return
    }

    //判断是否存在指定监听器
    const listenerArr = validatorsMap.get(selector)
    let index = listenerArr.indexOf(listener)
    if (index >= 0) {
      listenerArr.splice(index, 1)
      if (listenerArr.length <= 0) {
        validatorsMap.delete(selector)
      }
      return this
    }
  }
}
