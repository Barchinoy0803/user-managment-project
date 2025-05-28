"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransformedTime = void 0;
const getTransformedTime = () => {
    const time = String(new Date()).split(" ").splice(0, 5).join(" ");
    return time;
};
exports.getTransformedTime = getTransformedTime;
//# sourceMappingURL=index.js.map