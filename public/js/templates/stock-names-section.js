(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})({
    1: [ function(require, module, exports) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self;
        }
        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }
        var StockBlock = function(_React$Component) {
            _inherits(StockBlock, _React$Component);
            function StockBlock(props) {
                _classCallCheck(this, StockBlock);
                var _this = _possibleConstructorReturn(this, (StockBlock.__proto__ || Object.getPrototypeOf(StockBlock)).call(this, props));
                _this.handleClick = _this.handleClick.bind(_this);
                return _this;
            }
            _createClass(StockBlock, [ {
                key: "handleClick",
                value: function handleClick(e) {
                    app.delStockItem(this.props.code);
                    this.props.update();
                }
            }, {
                key: "render",
                value: function render() {
                    return React.createElement("div", {
                        className: "col-md-4 col-sm-6 stock-block"
                    }, React.createElement("h3", null, this.props.code, React.createElement("button", {
                        type: "button",
                        className: "close",
                        onClick: this.handleClick
                    }, "x")), React.createElement("span", null, this.props.companyName));
                }
            } ]);
            return StockBlock;
        }(React.Component);
        var StockAddForm = function(_React$Component2) {
            _inherits(StockAddForm, _React$Component2);
            function StockAddForm(props) {
                _classCallCheck(this, StockAddForm);
                var _this2 = _possibleConstructorReturn(this, (StockAddForm.__proto__ || Object.getPrototypeOf(StockAddForm)).call(this, props));
                _this2.handleChange = _this2.handleChange.bind(_this2);
                _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
                _this2.state = {
                    code: "",
                    isError: false
                };
                return _this2;
            }
            _createClass(StockAddForm, [ {
                key: "handleSubmit",
                value: function handleSubmit(e) {
                    e.preventDefault();
                    var self = this;
                    app.addStockItem(this.state.code, function(err) {
                        if (err) self.setState({
                            isError: true
                        }); else {
                            self.props.update();
                            self.setState({
                                code: ""
                            });
                        }
                    });
                }
            }, {
                key: "handleChange",
                value: function handleChange(e) {
                    this.state.isError = false;
                    var newState = {};
                    newState[e.target.name] = e.target.value;
                    this.setState(newState);
                }
            }, {
                key: "render",
                value: function render() {
                    return React.createElement("div", null, React.createElement("form", {
                        onSubmit: this.handleSubmit,
                        novalidate: true
                    }, React.createElement("div", {
                        className: "input-group"
                    }, React.createElement("input", {
                        name: "code",
                        type: "text",
                        className: "form-control",
                        placeholder: "Stock Code",
                        onChange: this.handleChange,
                        value: this.state.code
                    }), React.createElement("span", {
                        className: "input-group-btn"
                    }, React.createElement("button", {
                        className: "btn btn-success",
                        type: "submit",
                        disabled: !this.state.code
                    }, "Add")))), this.state.isError ? React.createElement("div", {
                        className: "error"
                    }, "Could not find stock code") : React.createElement("div", null));
                }
            } ]);
            return StockAddForm;
        }(React.Component);
        var StockNamesSection = function(_React$Component3) {
            _inherits(StockNamesSection, _React$Component3);
            function StockNamesSection(props) {
                _classCallCheck(this, StockNamesSection);
                var _this3 = _possibleConstructorReturn(this, (StockNamesSection.__proto__ || Object.getPrototypeOf(StockNamesSection)).call(this, props));
                _this3.update = _this3.update.bind(_this3);
                _this3.state = {
                    stockList: app.getStockList()
                };
                return _this3;
            }
            _createClass(StockNamesSection, [ {
                key: "update",
                value: function update() {
                    this.setState({
                        stockList: app.getStockList()
                    });
                }
            }, {
                key: "render",
                value: function render() {
                    var _this4 = this;
                    var stockListRows = [];
                    this.state.stockList.forEach(function(item) {
                        stockListRows.push(React.createElement(StockBlock, {
                            code: item.stockCode,
                            companyName: item.companyName,
                            update: _this4.update
                        }));
                    });
                    return React.createElement("div", null, React.createElement("div", {
                        className: "col-md-4 col-sm-6 stock-block stock-new"
                    }, React.createElement("label", null, "Add Stock Code"), React.createElement(StockAddForm, {
                        update: this.update
                    })), stockListRows);
                }
            } ]);
            return StockNamesSection;
        }(React.Component);
        ReactDOM.render(React.createElement(StockNamesSection, null), document.querySelector("#stock-names-section"));
    }, {} ]
}, {}, [ 1 ]);