"use strict";
exports.__esModule = true;
exports.Button = void 0;
var react_1 = require("react");
exports.Button = function (props) {
    return (react_1["default"].createElement("button", { className: 'button', onClick: props.onSubmit },
        react_1["default"].createElement("div", { className: 'button-title' }, props.title)));
};
exports["default"] = exports.Button;
