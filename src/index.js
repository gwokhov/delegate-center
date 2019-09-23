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
      this._runExecFunction(validatorsMap, e)
    })
  }

  _runExecFunction(validatorsMap, e) {
    for (let validator of validatorsMap.keys()) {
      if (this._isMatchValidator(validator, e.target)) {
        validatorsMap.get(validator).forEach(execFunc => {
          execFunc(e)
        })
      }
    }
  }

  /**
   * 节点验证
   * @param {String, Array, Node} selector
   * @param {Element} $ele 事件触发元素
   * @param {Boolean} isExcept 是否为排除验证器
   */
  _isMatchSelector(selector, $ele, isExcept = false) {
    if (!$ele) {
      return false
    }

    if (typeof selector === 'string') {
      if (/^\./.test(selector)) {
        const className = selector.replace(/^\./, '')
        return $ele.classList.contains(className)
      } else if (/^#/.test(selector)) {
        const id = selector.replace(/^#/, '')
        return $ele.id === id
      } else {
        const tagName = selector.toUpperCase()
        return $ele.tagName === tagName
      }
    }

    if (selector instanceof Element) {
      return $ele.isSameNode(selector)
    }

    if (Array.isArray(selector) && selector.length > 0) {
      if (isExcept) {
        return selector.some(s => this._isMatchSelector(s, $ele))
      } else {
        return selector.every(s => this._isMatchSelector(s, $ele))
      }
    }

    throw 'Please make sure validator is valid!'
  }

  /**
   * 类型验证
   * @param {null, String, Array, Node, Object, Function} validator 验证器
   * @param {Node} $ele 事件触发节点
   */
  _isMatchValidator(validator, $ele) {
    if (validator === undefined || !$ele) {
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
      return this._isMatchSelector(validator, $ele)
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
        isMatchSelector = this._isMatchSelector(validator.selector, $ele)
      } else {
        isMatchSelector = true
      }
      // 判断是否匹配被排除选择器
      if (validator.exceptSelector) {
        isMisMatchExceptSelector = !this._isMatchSelector(
          validator.exceptSelector,
          $ele,
          true
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
   * @param {Function} execFunc 触发后执行的函数
   */
  add(type, validator, execFunc) {
    if (typeof type !== 'string' || !type) {
      throw 'Please make sure event type is valid!'
    }
    if (validator === undefined) {
      throw 'Please make sure validator is valid!'
    }
    if (typeof execFunc !== 'function') {
      throw 'Please make sure execute Function is valid!'
    }

    if (!(type in this.typesMap)) {
      this._createEventType(type)
      let validatorsMap = this.typesMap[type]
      validatorsMap.set(validator, [execFunc])
    } else {
      let validatorsMap = this.typesMap[type]
      if (validatorsMap.has(validator)) {
        validatorsMap.get(validator).push(execFunc)
      } else {
        validatorsMap.set(validator, [execFunc])
      }
    }
    return this
  }

  remove(type, validator, execFunc) {
    //判断是否存在该事件类型
    if (!(type in this.typesMap)) {
      return
    }

    const validatorsMap = this.typesMap[type]
    //判断是否该事件类型是否存在触发元素和是否存在监听器
    if (
      !validatorsMap.has(validator) ||
      !validatorsMap.get(validator).length === 0
    ) {
      return
    }

    //判断是否存在指定监听器
    const execFuncQueue = validatorsMap.get(validator)
    let index = execFuncQueue.indexOf(execFunc)
    if (index >= 0) {
      execFuncQueue.splice(index, 1)
      if (execFuncQueue.length <= 0) {
        validatorsMap.delete(validator)
      }
      return this
    }
  }
}
