(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   *
   * @param {*} data 当前数据是否为对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 重写数组的基本方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
  // slice不会 因此不需要劫持
  var oldArrayMethods = Array.prototype; // value.__proto__ = arrayMethods 原型链向上查找，先查找重写的，没有重写的继续向上查找

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log("\u7528\u6237\u8C03\u7528\u4E86".concat(method, "\u65B9\u6CD5")); // AOP切片编程

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // 调用原生数组方法
      // push unshift 添加的元素还可能是个对象

      var inserted; // 当前插入的元素

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          //
          inserted = args.slice(2);
      }

      if (inserted) {
        ob.observerArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据层次过多 需要递归解析对象中属性， 依次增加set和get方法
      // so vue3 -> proxy
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 如果是数组，不对索引进行监控，会导致性能问题
        // 前端开发中很少操作索引 push shift unshift
        value.__proto__ = arrayMethods; //如果数组里是对象再监控

        this.observerArray(value);
      } else {
        this.copy(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "copy",
      value: function copy(data) {
        var keys = Object.keys(data); // [name, age, address]

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 递归实现深度检测

    Object.defineProperty(data, key, {
      get: function get() {
        // 获取值的时候做一些事情
        return value;
      },
      set: function set(newValue) {
        console.log('更新数据'); // 设置值的时候做一些事情

        if (newValue === value) {
          return;
        }

        console.log('值发生变化');
        observe(newValue); // 继续劫持设置的值，cuz有可能设置的是一个对象

        value = newValue;
      }
    });
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    console.log(opts, '1123123'); // vue的数据来源 属性 方法 数据 计算属性 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化工作
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持 用户改变了数据时得到通知->刷新页面
    // MVVM 数据变化驱动视图变化
    // Object.defineProperty() 给属性增加get方法和set方法

    observe(data); // 响应式原理
  }

  // 虚拟DOM: 用对象来描述DOM节点 AST语法树: 用对象来描述原生语法
  function compileToFunction(template) {
    return function render() {};
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // vue中使用this.$options指代的就是用户传递的属性

      vm.$options = options; // 初始化状态

      initState(vm); // 如果用户传入el属性 需要将页面渲染出来 实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认先查找有没有render(), 没有的话会采用template, 还没有就使用el中的内容

      if (!options.render) {
        // 对模板进行编译
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        console.log(template); // 将template转化成render方法 vue2.0起->虚拟DOM

        var render = compileToFunction();
        options.render = render;
      }
    };
  }

  function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options);
  }

  initMixin(Vue); // 给vue原型添加_init方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
