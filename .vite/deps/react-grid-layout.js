import {
  require_react_dom
} from "./chunk-ELNDXDY2.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS,
  require_react
} from "./chunk-UCCAB3TN.js";

// node_modules/fast-equals/dist/fast-equals.js
var require_fast_equals = __commonJS({
  "node_modules/fast-equals/dist/fast-equals.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2["fast-equals"] = {}));
    })(exports, function(exports2) {
      "use strict";
      function createDefaultIsNestedEqual(comparator) {
        return function isEqual(a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, meta) {
          return comparator(a, b, meta);
        };
      }
      function createIsCircular(areItemsEqual) {
        return function isCircular(a, b, isEqual, cache) {
          if (!a || !b || typeof a !== "object" || typeof b !== "object") {
            return areItemsEqual(a, b, isEqual, cache);
          }
          var cachedA = cache.get(a);
          var cachedB = cache.get(b);
          if (cachedA && cachedB) {
            return cachedA === b && cachedB === a;
          }
          cache.set(a, b);
          cache.set(b, a);
          var result = areItemsEqual(a, b, isEqual, cache);
          cache.delete(a);
          cache.delete(b);
          return result;
        };
      }
      function merge(a, b) {
        var merged = {};
        for (var key in a) {
          merged[key] = a[key];
        }
        for (var key in b) {
          merged[key] = b[key];
        }
        return merged;
      }
      function isPlainObject(value) {
        return value.constructor === Object || value.constructor == null;
      }
      function isPromiseLike(value) {
        return typeof value.then === "function";
      }
      function sameValueZeroEqual(a, b) {
        return a === b || a !== a && b !== b;
      }
      var ARGUMENTS_TAG = "[object Arguments]";
      var BOOLEAN_TAG = "[object Boolean]";
      var DATE_TAG = "[object Date]";
      var REG_EXP_TAG = "[object RegExp]";
      var MAP_TAG = "[object Map]";
      var NUMBER_TAG = "[object Number]";
      var OBJECT_TAG = "[object Object]";
      var SET_TAG = "[object Set]";
      var STRING_TAG = "[object String]";
      var toString = Object.prototype.toString;
      function createComparator(_a) {
        var areArraysEqual2 = _a.areArraysEqual, areDatesEqual2 = _a.areDatesEqual, areMapsEqual2 = _a.areMapsEqual, areObjectsEqual2 = _a.areObjectsEqual, areRegExpsEqual2 = _a.areRegExpsEqual, areSetsEqual2 = _a.areSetsEqual, createIsNestedEqual = _a.createIsNestedEqual;
        var isEqual = createIsNestedEqual(comparator);
        function comparator(a, b, meta) {
          if (a === b) {
            return true;
          }
          if (!a || !b || typeof a !== "object" || typeof b !== "object") {
            return a !== a && b !== b;
          }
          if (isPlainObject(a) && isPlainObject(b)) {
            return areObjectsEqual2(a, b, isEqual, meta);
          }
          var aArray = Array.isArray(a);
          var bArray = Array.isArray(b);
          if (aArray || bArray) {
            return aArray === bArray && areArraysEqual2(a, b, isEqual, meta);
          }
          var aTag = toString.call(a);
          if (aTag !== toString.call(b)) {
            return false;
          }
          if (aTag === DATE_TAG) {
            return areDatesEqual2(a, b, isEqual, meta);
          }
          if (aTag === REG_EXP_TAG) {
            return areRegExpsEqual2(a, b, isEqual, meta);
          }
          if (aTag === MAP_TAG) {
            return areMapsEqual2(a, b, isEqual, meta);
          }
          if (aTag === SET_TAG) {
            return areSetsEqual2(a, b, isEqual, meta);
          }
          if (aTag === OBJECT_TAG || aTag === ARGUMENTS_TAG) {
            return isPromiseLike(a) || isPromiseLike(b) ? false : areObjectsEqual2(a, b, isEqual, meta);
          }
          if (aTag === BOOLEAN_TAG || aTag === NUMBER_TAG || aTag === STRING_TAG) {
            return sameValueZeroEqual(a.valueOf(), b.valueOf());
          }
          return false;
        }
        return comparator;
      }
      function areArraysEqual(a, b, isEqual, meta) {
        var index2 = a.length;
        if (b.length !== index2) {
          return false;
        }
        while (index2-- > 0) {
          if (!isEqual(a[index2], b[index2], index2, index2, a, b, meta)) {
            return false;
          }
        }
        return true;
      }
      var areArraysEqualCircular = createIsCircular(areArraysEqual);
      function areDatesEqual(a, b) {
        return sameValueZeroEqual(a.valueOf(), b.valueOf());
      }
      function areMapsEqual(a, b, isEqual, meta) {
        var isValueEqual = a.size === b.size;
        if (!isValueEqual) {
          return false;
        }
        if (!a.size) {
          return true;
        }
        var matchedIndices = {};
        var indexA = 0;
        a.forEach(function(aValue, aKey) {
          if (!isValueEqual) {
            return;
          }
          var hasMatch = false;
          var matchIndexB = 0;
          b.forEach(function(bValue, bKey) {
            if (!hasMatch && !matchedIndices[matchIndexB] && (hasMatch = isEqual(aKey, bKey, indexA, matchIndexB, a, b, meta) && isEqual(aValue, bValue, aKey, bKey, a, b, meta))) {
              matchedIndices[matchIndexB] = true;
            }
            matchIndexB++;
          });
          indexA++;
          isValueEqual = hasMatch;
        });
        return isValueEqual;
      }
      var areMapsEqualCircular = createIsCircular(areMapsEqual);
      var OWNER = "_owner";
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function areObjectsEqual(a, b, isEqual, meta) {
        var keysA = Object.keys(a);
        var index2 = keysA.length;
        if (Object.keys(b).length !== index2) {
          return false;
        }
        var key;
        while (index2-- > 0) {
          key = keysA[index2];
          if (key === OWNER) {
            var reactElementA = !!a.$$typeof;
            var reactElementB = !!b.$$typeof;
            if ((reactElementA || reactElementB) && reactElementA !== reactElementB) {
              return false;
            }
          }
          if (!hasOwnProperty.call(b, key) || !isEqual(a[key], b[key], key, key, a, b, meta)) {
            return false;
          }
        }
        return true;
      }
      var areObjectsEqualCircular = createIsCircular(areObjectsEqual);
      function areRegExpsEqual(a, b) {
        return a.source === b.source && a.flags === b.flags;
      }
      function areSetsEqual(a, b, isEqual, meta) {
        var isValueEqual = a.size === b.size;
        if (!isValueEqual) {
          return false;
        }
        if (!a.size) {
          return true;
        }
        var matchedIndices = {};
        a.forEach(function(aValue, aKey) {
          if (!isValueEqual) {
            return;
          }
          var hasMatch = false;
          var matchIndex = 0;
          b.forEach(function(bValue, bKey) {
            if (!hasMatch && !matchedIndices[matchIndex] && (hasMatch = isEqual(aValue, bValue, aKey, bKey, a, b, meta))) {
              matchedIndices[matchIndex] = true;
            }
            matchIndex++;
          });
          isValueEqual = hasMatch;
        });
        return isValueEqual;
      }
      var areSetsEqualCircular = createIsCircular(areSetsEqual);
      var DEFAULT_CONFIG = Object.freeze({
        areArraysEqual,
        areDatesEqual,
        areMapsEqual,
        areObjectsEqual,
        areRegExpsEqual,
        areSetsEqual,
        createIsNestedEqual: createDefaultIsNestedEqual
      });
      var DEFAULT_CIRCULAR_CONFIG = Object.freeze({
        areArraysEqual: areArraysEqualCircular,
        areDatesEqual,
        areMapsEqual: areMapsEqualCircular,
        areObjectsEqual: areObjectsEqualCircular,
        areRegExpsEqual,
        areSetsEqual: areSetsEqualCircular,
        createIsNestedEqual: createDefaultIsNestedEqual
      });
      var isDeepEqual = createComparator(DEFAULT_CONFIG);
      function deepEqual(a, b) {
        return isDeepEqual(a, b, void 0);
      }
      var isShallowEqual = createComparator(merge(DEFAULT_CONFIG, { createIsNestedEqual: function() {
        return sameValueZeroEqual;
      } }));
      function shallowEqual(a, b) {
        return isShallowEqual(a, b, void 0);
      }
      var isCircularDeepEqual = createComparator(DEFAULT_CIRCULAR_CONFIG);
      function circularDeepEqual(a, b) {
        return isCircularDeepEqual(a, b, /* @__PURE__ */ new WeakMap());
      }
      var isCircularShallowEqual = createComparator(merge(DEFAULT_CIRCULAR_CONFIG, {
        createIsNestedEqual: function() {
          return sameValueZeroEqual;
        }
      }));
      function circularShallowEqual(a, b) {
        return isCircularShallowEqual(a, b, /* @__PURE__ */ new WeakMap());
      }
      function createCustomEqual(getComparatorOptions) {
        return createComparator(merge(DEFAULT_CONFIG, getComparatorOptions(DEFAULT_CONFIG)));
      }
      function createCustomCircularEqual(getComparatorOptions) {
        var comparator = createComparator(merge(DEFAULT_CIRCULAR_CONFIG, getComparatorOptions(DEFAULT_CIRCULAR_CONFIG)));
        return function(a, b, meta) {
          if (meta === void 0) {
            meta = /* @__PURE__ */ new WeakMap();
          }
          return comparator(a, b, meta);
        };
      }
      exports2.circularDeepEqual = circularDeepEqual;
      exports2.circularShallowEqual = circularShallowEqual;
      exports2.createCustomCircularEqual = createCustomCircularEqual;
      exports2.createCustomEqual = createCustomEqual;
      exports2.deepEqual = deepEqual;
      exports2.sameValueZeroEqual = sameValueZeroEqual;
      exports2.shallowEqual = shallowEqual;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/clsx/dist/clsx.js
var require_clsx = __commonJS({
  "node_modules/clsx/dist/clsx.js"(exports, module) {
    function r2(e2) {
      var o, t, f = "";
      if ("string" == typeof e2 || "number" == typeof e2) f += e2;
      else if ("object" == typeof e2) if (Array.isArray(e2)) {
        var n = e2.length;
        for (o = 0; o < n; o++) e2[o] && (t = r2(e2[o])) && (f && (f += " "), f += t);
      } else for (t in e2) e2[t] && (f && (f += " "), f += t);
      return f;
    }
    function e() {
      for (var e2, o, t = 0, f = "", n = arguments.length; t < n; t++) (e2 = arguments[t]) && (o = r2(e2)) && (f && (f += " "), f += o);
      return f;
    }
    module.exports = e, module.exports.clsx = e;
  }
});

// node_modules/react-grid-layout/build/fastRGLPropsEqual.js
var require_fastRGLPropsEqual = __commonJS({
  "node_modules/react-grid-layout/build/fastRGLPropsEqual.js"(exports, module) {
    module.exports = function fastRGLPropsEqual(a, b, isEqualImpl) {
      if (a === b) return true;
      return a.className === b.className && isEqualImpl(a.style, b.style) && a.width === b.width && a.autoSize === b.autoSize && a.cols === b.cols && a.draggableCancel === b.draggableCancel && a.draggableHandle === b.draggableHandle && isEqualImpl(a.verticalCompact, b.verticalCompact) && isEqualImpl(a.compactType, b.compactType) && isEqualImpl(a.layout, b.layout) && isEqualImpl(a.margin, b.margin) && isEqualImpl(a.containerPadding, b.containerPadding) && a.rowHeight === b.rowHeight && a.maxRows === b.maxRows && a.isBounded === b.isBounded && a.isDraggable === b.isDraggable && a.isResizable === b.isResizable && a.allowOverlap === b.allowOverlap && a.preventCollision === b.preventCollision && a.useCSSTransforms === b.useCSSTransforms && a.transformScale === b.transformScale && a.isDroppable === b.isDroppable && isEqualImpl(a.resizeHandles, b.resizeHandles) && isEqualImpl(a.resizeHandle, b.resizeHandle) && a.onLayoutChange === b.onLayoutChange && a.onDragStart === b.onDragStart && a.onDrag === b.onDrag && a.onDragStop === b.onDragStop && a.onResizeStart === b.onResizeStart && a.onResize === b.onResize && a.onResizeStop === b.onResizeStop && a.onDrop === b.onDrop && isEqualImpl(a.droppingItem, b.droppingItem) && isEqualImpl(a.innerRef, b.innerRef);
    };
  }
});

// node_modules/react-grid-layout/build/utils.js
var require_utils = __commonJS({
  "node_modules/react-grid-layout/build/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.bottom = bottom;
    exports.childrenEqual = childrenEqual;
    exports.cloneLayout = cloneLayout;
    exports.cloneLayoutItem = cloneLayoutItem;
    exports.collides = collides;
    exports.compact = compact;
    exports.compactItem = compactItem;
    exports.compactType = compactType;
    exports.correctBounds = correctBounds;
    exports.fastPositionEqual = fastPositionEqual;
    exports.fastRGLPropsEqual = void 0;
    exports.getAllCollisions = getAllCollisions;
    exports.getFirstCollision = getFirstCollision;
    exports.getLayoutItem = getLayoutItem;
    exports.getStatics = getStatics;
    exports.modifyLayout = modifyLayout;
    exports.moveElement = moveElement;
    exports.moveElementAwayFromCollision = moveElementAwayFromCollision;
    exports.noop = void 0;
    exports.perc = perc;
    exports.resizeItemInDirection = resizeItemInDirection;
    exports.setTopLeft = setTopLeft;
    exports.setTransform = setTransform;
    exports.sortLayoutItems = sortLayoutItems;
    exports.sortLayoutItemsByColRow = sortLayoutItemsByColRow;
    exports.sortLayoutItemsByRowCol = sortLayoutItemsByRowCol;
    exports.synchronizeLayoutWithChildren = synchronizeLayoutWithChildren;
    exports.validateLayout = validateLayout;
    exports.withLayoutItem = withLayoutItem;
    var _fastEquals = require_fast_equals();
    var _react = _interopRequireDefault(require_react());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var isProduction = false;
    var DEBUG = false;
    function bottom(layout) {
      let max = 0, bottomY;
      for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) max = bottomY;
      }
      return max;
    }
    function cloneLayout(layout) {
      const newLayout = Array(layout.length);
      for (let i = 0, len = layout.length; i < len; i++) {
        newLayout[i] = cloneLayoutItem(layout[i]);
      }
      return newLayout;
    }
    function modifyLayout(layout, layoutItem) {
      const newLayout = Array(layout.length);
      for (let i = 0, len = layout.length; i < len; i++) {
        if (layoutItem.i === layout[i].i) {
          newLayout[i] = layoutItem;
        } else {
          newLayout[i] = layout[i];
        }
      }
      return newLayout;
    }
    function withLayoutItem(layout, itemKey, cb) {
      let item = getLayoutItem(layout, itemKey);
      if (!item) return [layout, null];
      item = cb(cloneLayoutItem(item));
      layout = modifyLayout(layout, item);
      return [layout, item];
    }
    function cloneLayoutItem(layoutItem) {
      return {
        w: layoutItem.w,
        h: layoutItem.h,
        x: layoutItem.x,
        y: layoutItem.y,
        i: layoutItem.i,
        minW: layoutItem.minW,
        maxW: layoutItem.maxW,
        minH: layoutItem.minH,
        maxH: layoutItem.maxH,
        moved: Boolean(layoutItem.moved),
        static: Boolean(layoutItem.static),
        // These can be null/undefined
        isDraggable: layoutItem.isDraggable,
        isResizable: layoutItem.isResizable,
        resizeHandles: layoutItem.resizeHandles,
        isBounded: layoutItem.isBounded
      };
    }
    function childrenEqual(a, b) {
      return (0, _fastEquals.deepEqual)(_react.default.Children.map(a, (c) => c == null ? void 0 : c.key), _react.default.Children.map(b, (c) => c == null ? void 0 : c.key)) && (0, _fastEquals.deepEqual)(_react.default.Children.map(a, (c) => c == null ? void 0 : c.props["data-grid"]), _react.default.Children.map(b, (c) => c == null ? void 0 : c.props["data-grid"]));
    }
    var fastRGLPropsEqual = exports.fastRGLPropsEqual = require_fastRGLPropsEqual();
    function fastPositionEqual(a, b) {
      return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
    }
    function collides(l1, l2) {
      if (l1.i === l2.i) return false;
      if (l1.x + l1.w <= l2.x) return false;
      if (l1.x >= l2.x + l2.w) return false;
      if (l1.y + l1.h <= l2.y) return false;
      if (l1.y >= l2.y + l2.h) return false;
      return true;
    }
    function compact(layout, compactType2, cols, allowOverlap) {
      const compareWith = getStatics(layout);
      const sorted = sortLayoutItems(layout, compactType2);
      const out = Array(layout.length);
      for (let i = 0, len = sorted.length; i < len; i++) {
        let l = cloneLayoutItem(sorted[i]);
        if (!l.static) {
          l = compactItem(compareWith, l, compactType2, cols, sorted, allowOverlap);
          compareWith.push(l);
        }
        out[layout.indexOf(sorted[i])] = l;
        l.moved = false;
      }
      return out;
    }
    var heightWidth = {
      x: "w",
      y: "h"
    };
    function resolveCompactionCollision(layout, item, moveToCoord, axis) {
      const sizeProp = heightWidth[axis];
      item[axis] += 1;
      const itemIndex = layout.map((layoutItem) => {
        return layoutItem.i;
      }).indexOf(item.i);
      for (let i = itemIndex + 1; i < layout.length; i++) {
        const otherItem = layout[i];
        if (otherItem.static) continue;
        if (otherItem.y > item.y + item.h) break;
        if (collides(item, otherItem)) {
          resolveCompactionCollision(layout, otherItem, moveToCoord + item[sizeProp], axis);
        }
      }
      item[axis] = moveToCoord;
    }
    function compactItem(compareWith, l, compactType2, cols, fullLayout, allowOverlap) {
      const compactV = compactType2 === "vertical";
      const compactH = compactType2 === "horizontal";
      if (compactV) {
        l.y = Math.min(bottom(compareWith), l.y);
        while (l.y > 0 && !getFirstCollision(compareWith, l)) {
          l.y--;
        }
      } else if (compactH) {
        while (l.x > 0 && !getFirstCollision(compareWith, l)) {
          l.x--;
        }
      }
      let collides2;
      while ((collides2 = getFirstCollision(compareWith, l)) && !(compactType2 === null && allowOverlap)) {
        if (compactH) {
          resolveCompactionCollision(fullLayout, l, collides2.x + collides2.w, "x");
        } else {
          resolveCompactionCollision(fullLayout, l, collides2.y + collides2.h, "y");
        }
        if (compactH && l.x + l.w > cols) {
          l.x = cols - l.w;
          l.y++;
          while (l.x > 0 && !getFirstCollision(compareWith, l)) {
            l.x--;
          }
        }
      }
      l.y = Math.max(l.y, 0);
      l.x = Math.max(l.x, 0);
      return l;
    }
    function correctBounds(layout, bounds) {
      const collidesWith = getStatics(layout);
      for (let i = 0, len = layout.length; i < len; i++) {
        const l = layout[i];
        if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w;
        if (l.x < 0) {
          l.x = 0;
          l.w = bounds.cols;
        }
        if (!l.static) collidesWith.push(l);
        else {
          while (getFirstCollision(collidesWith, l)) {
            l.y++;
          }
        }
      }
      return layout;
    }
    function getLayoutItem(layout, id) {
      for (let i = 0, len = layout.length; i < len; i++) {
        if (layout[i].i === id) return layout[i];
      }
    }
    function getFirstCollision(layout, layoutItem) {
      for (let i = 0, len = layout.length; i < len; i++) {
        if (collides(layout[i], layoutItem)) return layout[i];
      }
    }
    function getAllCollisions(layout, layoutItem) {
      return layout.filter((l) => collides(l, layoutItem));
    }
    function getStatics(layout) {
      return layout.filter((l) => l.static);
    }
    function moveElement(layout, l, x, y, isUserAction, preventCollision, compactType2, cols, allowOverlap) {
      if (l.static && l.isDraggable !== true) return layout;
      if (l.y === y && l.x === x) return layout;
      log(`Moving element ${l.i} to [${String(x)},${String(y)}] from [${l.x},${l.y}]`);
      const oldX = l.x;
      const oldY = l.y;
      if (typeof x === "number") l.x = x;
      if (typeof y === "number") l.y = y;
      l.moved = true;
      let sorted = sortLayoutItems(layout, compactType2);
      const movingUp = compactType2 === "vertical" && typeof y === "number" ? oldY >= y : compactType2 === "horizontal" && typeof x === "number" ? oldX >= x : false;
      if (movingUp) sorted = sorted.reverse();
      const collisions = getAllCollisions(sorted, l);
      const hasCollisions = collisions.length > 0;
      if (hasCollisions && allowOverlap) {
        return cloneLayout(layout);
      } else if (hasCollisions && preventCollision) {
        log(`Collision prevented on ${l.i}, reverting.`);
        l.x = oldX;
        l.y = oldY;
        l.moved = false;
        return layout;
      }
      for (let i = 0, len = collisions.length; i < len; i++) {
        const collision = collisions[i];
        log(`Resolving collision between ${l.i} at [${l.x},${l.y}] and ${collision.i} at [${collision.x},${collision.y}]`);
        if (collision.moved) continue;
        if (collision.static) {
          layout = moveElementAwayFromCollision(layout, collision, l, isUserAction, compactType2, cols);
        } else {
          layout = moveElementAwayFromCollision(layout, l, collision, isUserAction, compactType2, cols);
        }
      }
      return layout;
    }
    function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction, compactType2, cols) {
      const compactH = compactType2 === "horizontal";
      const compactV = compactType2 === "vertical";
      const preventCollision = collidesWith.static;
      if (isUserAction) {
        isUserAction = false;
        const fakeItem = {
          x: compactH ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
          y: compactV ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
          w: itemToMove.w,
          h: itemToMove.h,
          i: "-1"
        };
        const firstCollision = getFirstCollision(layout, fakeItem);
        const collisionNorth = firstCollision && firstCollision.y + firstCollision.h > collidesWith.y;
        const collisionWest = firstCollision && collidesWith.x + collidesWith.w > firstCollision.x;
        if (!firstCollision) {
          log(`Doing reverse collision on ${itemToMove.i} up to [${fakeItem.x},${fakeItem.y}].`);
          return moveElement(layout, itemToMove, compactH ? fakeItem.x : void 0, compactV ? fakeItem.y : void 0, isUserAction, preventCollision, compactType2, cols);
        } else if (collisionNorth && compactV) {
          return moveElement(layout, itemToMove, void 0, collidesWith.y + 1, isUserAction, preventCollision, compactType2, cols);
        } else if (collisionNorth && compactType2 == null) {
          collidesWith.y = itemToMove.y;
          itemToMove.y = itemToMove.y + itemToMove.h;
          return layout;
        } else if (collisionWest && compactH) {
          return moveElement(layout, collidesWith, itemToMove.x, void 0, isUserAction, preventCollision, compactType2, cols);
        }
      }
      const newX = compactH ? itemToMove.x + 1 : void 0;
      const newY = compactV ? itemToMove.y + 1 : void 0;
      if (newX == null && newY == null) {
        return layout;
      }
      return moveElement(layout, itemToMove, compactH ? itemToMove.x + 1 : void 0, compactV ? itemToMove.y + 1 : void 0, isUserAction, preventCollision, compactType2, cols);
    }
    function perc(num) {
      return num * 100 + "%";
    }
    var constrainWidth = (left, currentWidth, newWidth, containerWidth) => {
      return left + newWidth > containerWidth ? currentWidth : newWidth;
    };
    var constrainHeight = (top, currentHeight, newHeight) => {
      return top < 0 ? currentHeight : newHeight;
    };
    var constrainLeft = (left) => Math.max(0, left);
    var constrainTop = (top) => Math.max(0, top);
    var resizeNorth = (currentSize, _ref, _containerWidth) => {
      let {
        left,
        height,
        width
      } = _ref;
      const top = currentSize.top - (height - currentSize.height);
      return {
        left,
        width,
        height: constrainHeight(top, currentSize.height, height),
        top: constrainTop(top)
      };
    };
    var resizeEast = (currentSize, _ref2, containerWidth) => {
      let {
        top,
        left,
        height,
        width
      } = _ref2;
      return {
        top,
        height,
        width: constrainWidth(currentSize.left, currentSize.width, width, containerWidth),
        left: constrainLeft(left)
      };
    };
    var resizeWest = (currentSize, _ref3, containerWidth) => {
      let {
        top,
        height,
        width
      } = _ref3;
      const left = currentSize.left - (width - currentSize.width);
      return {
        height,
        width: left < 0 ? currentSize.width : constrainWidth(currentSize.left, currentSize.width, width, containerWidth),
        top: constrainTop(top),
        left: constrainLeft(left)
      };
    };
    var resizeSouth = (currentSize, _ref4, containerWidth) => {
      let {
        top,
        left,
        height,
        width
      } = _ref4;
      return {
        width,
        left,
        height: constrainHeight(top, currentSize.height, height),
        top: constrainTop(top)
      };
    };
    var resizeNorthEast = function() {
      return resizeNorth(arguments.length <= 0 ? void 0 : arguments[0], resizeEast(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var resizeNorthWest = function() {
      return resizeNorth(arguments.length <= 0 ? void 0 : arguments[0], resizeWest(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var resizeSouthEast = function() {
      return resizeSouth(arguments.length <= 0 ? void 0 : arguments[0], resizeEast(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var resizeSouthWest = function() {
      return resizeSouth(arguments.length <= 0 ? void 0 : arguments[0], resizeWest(...arguments), arguments.length <= 2 ? void 0 : arguments[2]);
    };
    var ordinalResizeHandlerMap = {
      n: resizeNorth,
      ne: resizeNorthEast,
      e: resizeEast,
      se: resizeSouthEast,
      s: resizeSouth,
      sw: resizeSouthWest,
      w: resizeWest,
      nw: resizeNorthWest
    };
    function resizeItemInDirection(direction, currentSize, newSize, containerWidth) {
      const ordinalHandler = ordinalResizeHandlerMap[direction];
      if (!ordinalHandler) return newSize;
      return ordinalHandler(currentSize, {
        ...currentSize,
        ...newSize
      }, containerWidth);
    }
    function setTransform(_ref5) {
      let {
        top,
        left,
        width,
        height
      } = _ref5;
      const translate = `translate(${left}px,${top}px)`;
      return {
        transform: translate,
        WebkitTransform: translate,
        MozTransform: translate,
        msTransform: translate,
        OTransform: translate,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute"
      };
    }
    function setTopLeft(_ref6) {
      let {
        top,
        left,
        width,
        height
      } = _ref6;
      return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute"
      };
    }
    function sortLayoutItems(layout, compactType2) {
      if (compactType2 === "horizontal") return sortLayoutItemsByColRow(layout);
      if (compactType2 === "vertical") return sortLayoutItemsByRowCol(layout);
      else return layout;
    }
    function sortLayoutItemsByRowCol(layout) {
      return layout.slice(0).sort(function(a, b) {
        if (a.y > b.y || a.y === b.y && a.x > b.x) {
          return 1;
        } else if (a.y === b.y && a.x === b.x) {
          return 0;
        }
        return -1;
      });
    }
    function sortLayoutItemsByColRow(layout) {
      return layout.slice(0).sort(function(a, b) {
        if (a.x > b.x || a.x === b.x && a.y > b.y) {
          return 1;
        }
        return -1;
      });
    }
    function synchronizeLayoutWithChildren(initialLayout, children, cols, compactType2, allowOverlap) {
      initialLayout = initialLayout || [];
      const layout = [];
      _react.default.Children.forEach(children, (child) => {
        if ((child == null ? void 0 : child.key) == null) return;
        const exists = getLayoutItem(initialLayout, String(child.key));
        const g = child.props["data-grid"];
        if (exists && g == null) {
          layout.push(cloneLayoutItem(exists));
        } else {
          if (g) {
            if (!isProduction) {
              validateLayout([g], "ReactGridLayout.children");
            }
            layout.push(cloneLayoutItem({
              ...g,
              i: child.key
            }));
          } else {
            layout.push(cloneLayoutItem({
              w: 1,
              h: 1,
              x: 0,
              y: bottom(layout),
              i: String(child.key)
            }));
          }
        }
      });
      const correctedLayout = correctBounds(layout, {
        cols
      });
      return allowOverlap ? correctedLayout : compact(correctedLayout, compactType2, cols);
    }
    function validateLayout(layout) {
      let contextName = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Layout";
      const subProps = ["x", "y", "w", "h"];
      if (!Array.isArray(layout)) throw new Error(contextName + " must be an array!");
      for (let i = 0, len = layout.length; i < len; i++) {
        const item = layout[i];
        for (let j = 0; j < subProps.length; j++) {
          const key = subProps[j];
          const value = item[key];
          if (typeof value !== "number" || Number.isNaN(value)) {
            throw new Error(`ReactGridLayout: ${contextName}[${i}].${key} must be a number! Received: ${value} (${typeof value})`);
          }
        }
        if (typeof item.i !== "undefined" && typeof item.i !== "string") {
          throw new Error(`ReactGridLayout: ${contextName}[${i}].i must be a string! Received: ${item.i} (${typeof item.i})`);
        }
      }
    }
    function compactType(props) {
      const {
        verticalCompact,
        compactType: compactType2
      } = props || {};
      return verticalCompact === false ? null : compactType2;
    }
    function log() {
      if (!DEBUG) return;
      console.log(...arguments);
    }
    var noop = () => {
    };
    exports.noop = noop;
  }
});

// node_modules/react-grid-layout/build/calculateUtils.js
var require_calculateUtils = __commonJS({
  "node_modules/react-grid-layout/build/calculateUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.calcGridColWidth = calcGridColWidth;
    exports.calcGridItemPosition = calcGridItemPosition;
    exports.calcGridItemWHPx = calcGridItemWHPx;
    exports.calcWH = calcWH;
    exports.calcXY = calcXY;
    exports.clamp = clamp;
    function calcGridColWidth(positionParams) {
      const {
        margin,
        containerPadding,
        containerWidth,
        cols
      } = positionParams;
      return (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols;
    }
    function calcGridItemWHPx(gridUnits, colOrRowSize, marginPx) {
      if (!Number.isFinite(gridUnits)) return gridUnits;
      return Math.round(colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx);
    }
    function calcGridItemPosition(positionParams, x, y, w, h, state) {
      const {
        margin,
        containerPadding,
        rowHeight
      } = positionParams;
      const colWidth = calcGridColWidth(positionParams);
      const out = {};
      if (state && state.resizing) {
        out.width = Math.round(state.resizing.width);
        out.height = Math.round(state.resizing.height);
      } else {
        out.width = calcGridItemWHPx(w, colWidth, margin[0]);
        out.height = calcGridItemWHPx(h, rowHeight, margin[1]);
      }
      if (state && state.dragging) {
        out.top = Math.round(state.dragging.top);
        out.left = Math.round(state.dragging.left);
      } else if (state && state.resizing && typeof state.resizing.top === "number" && typeof state.resizing.left === "number") {
        out.top = Math.round(state.resizing.top);
        out.left = Math.round(state.resizing.left);
      } else {
        out.top = Math.round((rowHeight + margin[1]) * y + containerPadding[1]);
        out.left = Math.round((colWidth + margin[0]) * x + containerPadding[0]);
      }
      return out;
    }
    function calcXY(positionParams, top, left, w, h) {
      const {
        margin,
        containerPadding,
        cols,
        rowHeight,
        maxRows
      } = positionParams;
      const colWidth = calcGridColWidth(positionParams);
      let x = Math.round((left - containerPadding[0]) / (colWidth + margin[0]));
      let y = Math.round((top - containerPadding[1]) / (rowHeight + margin[1]));
      x = clamp(x, 0, cols - w);
      y = clamp(y, 0, maxRows - h);
      return {
        x,
        y
      };
    }
    function calcWH(positionParams, width, height, x, y, handle) {
      const {
        margin,
        maxRows,
        cols,
        rowHeight
      } = positionParams;
      const colWidth = calcGridColWidth(positionParams);
      let w = Math.round((width + margin[0]) / (colWidth + margin[0]));
      let h = Math.round((height + margin[1]) / (rowHeight + margin[1]));
      let _w = clamp(w, 0, cols - x);
      let _h = clamp(h, 0, maxRows - y);
      if (["sw", "w", "nw"].indexOf(handle) !== -1) {
        _w = clamp(w, 0, cols);
      }
      if (["nw", "n", "ne"].indexOf(handle) !== -1) {
        _h = clamp(h, 0, maxRows);
      }
      return {
        w: _w,
        h: _h
      };
    }
    function clamp(num, lowerBound, upperBound) {
      return Math.max(Math.min(num, upperBound), lowerBound);
    }
  }
});

// node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS({
  "node_modules/react-is/cjs/react-is.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        var hasSymbol = typeof Symbol === "function" && Symbol.for;
        var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
        var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
        var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
        var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
        var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
        var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
        var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
        var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
        var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
        var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
        var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
        var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
        var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
        var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
        var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
        var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
        var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
        var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
        function isValidElementType(type) {
          return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
          type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
        }
        function typeOf(object) {
          if (typeof object === "object" && object !== null) {
            var $$typeof = object.$$typeof;
            switch ($$typeof) {
              case REACT_ELEMENT_TYPE:
                var type = object.type;
                switch (type) {
                  case REACT_ASYNC_MODE_TYPE:
                  case REACT_CONCURRENT_MODE_TYPE:
                  case REACT_FRAGMENT_TYPE:
                  case REACT_PROFILER_TYPE:
                  case REACT_STRICT_MODE_TYPE:
                  case REACT_SUSPENSE_TYPE:
                    return type;
                  default:
                    var $$typeofType = type && type.$$typeof;
                    switch ($$typeofType) {
                      case REACT_CONTEXT_TYPE:
                      case REACT_FORWARD_REF_TYPE:
                      case REACT_LAZY_TYPE:
                      case REACT_MEMO_TYPE:
                      case REACT_PROVIDER_TYPE:
                        return $$typeofType;
                      default:
                        return $$typeof;
                    }
                }
              case REACT_PORTAL_TYPE:
                return $$typeof;
            }
          }
          return void 0;
        }
        var AsyncMode = REACT_ASYNC_MODE_TYPE;
        var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
        var ContextConsumer = REACT_CONTEXT_TYPE;
        var ContextProvider = REACT_PROVIDER_TYPE;
        var Element2 = REACT_ELEMENT_TYPE;
        var ForwardRef = REACT_FORWARD_REF_TYPE;
        var Fragment = REACT_FRAGMENT_TYPE;
        var Lazy = REACT_LAZY_TYPE;
        var Memo = REACT_MEMO_TYPE;
        var Portal = REACT_PORTAL_TYPE;
        var Profiler = REACT_PROFILER_TYPE;
        var StrictMode = REACT_STRICT_MODE_TYPE;
        var Suspense = REACT_SUSPENSE_TYPE;
        var hasWarnedAboutDeprecatedIsAsyncMode = false;
        function isAsyncMode(object) {
          {
            if (!hasWarnedAboutDeprecatedIsAsyncMode) {
              hasWarnedAboutDeprecatedIsAsyncMode = true;
              console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
            }
          }
          return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
        }
        function isConcurrentMode(object) {
          return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
        }
        function isContextConsumer(object) {
          return typeOf(object) === REACT_CONTEXT_TYPE;
        }
        function isContextProvider(object) {
          return typeOf(object) === REACT_PROVIDER_TYPE;
        }
        function isElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function isForwardRef(object) {
          return typeOf(object) === REACT_FORWARD_REF_TYPE;
        }
        function isFragment(object) {
          return typeOf(object) === REACT_FRAGMENT_TYPE;
        }
        function isLazy(object) {
          return typeOf(object) === REACT_LAZY_TYPE;
        }
        function isMemo(object) {
          return typeOf(object) === REACT_MEMO_TYPE;
        }
        function isPortal(object) {
          return typeOf(object) === REACT_PORTAL_TYPE;
        }
        function isProfiler(object) {
          return typeOf(object) === REACT_PROFILER_TYPE;
        }
        function isStrictMode(object) {
          return typeOf(object) === REACT_STRICT_MODE_TYPE;
        }
        function isSuspense(object) {
          return typeOf(object) === REACT_SUSPENSE_TYPE;
        }
        exports.AsyncMode = AsyncMode;
        exports.ConcurrentMode = ConcurrentMode;
        exports.ContextConsumer = ContextConsumer;
        exports.ContextProvider = ContextProvider;
        exports.Element = Element2;
        exports.ForwardRef = ForwardRef;
        exports.Fragment = Fragment;
        exports.Lazy = Lazy;
        exports.Memo = Memo;
        exports.Portal = Portal;
        exports.Profiler = Profiler;
        exports.StrictMode = StrictMode;
        exports.Suspense = Suspense;
        exports.isAsyncMode = isAsyncMode;
        exports.isConcurrentMode = isConcurrentMode;
        exports.isContextConsumer = isContextConsumer;
        exports.isContextProvider = isContextProvider;
        exports.isElement = isElement;
        exports.isForwardRef = isForwardRef;
        exports.isFragment = isFragment;
        exports.isLazy = isLazy;
        exports.isMemo = isMemo;
        exports.isPortal = isPortal;
        exports.isProfiler = isProfiler;
        exports.isStrictMode = isStrictMode;
        exports.isSuspense = isSuspense;
        exports.isValidElementType = isValidElementType;
        exports.typeOf = typeOf;
      })();
    }
  }
});

// node_modules/react-is/index.js
var require_react_is = __commonJS({
  "node_modules/react-is/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_is_development();
    }
  }
});

// node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports, module) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/prop-types/lib/ReactPropTypesSecret.js
var require_ReactPropTypesSecret = __commonJS({
  "node_modules/prop-types/lib/ReactPropTypesSecret.js"(exports, module) {
    "use strict";
    var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    module.exports = ReactPropTypesSecret;
  }
});

// node_modules/prop-types/lib/has.js
var require_has = __commonJS({
  "node_modules/prop-types/lib/has.js"(exports, module) {
    module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
  }
});

// node_modules/prop-types/checkPropTypes.js
var require_checkPropTypes = __commonJS({
  "node_modules/prop-types/checkPropTypes.js"(exports, module) {
    "use strict";
    var printWarning = function() {
    };
    if (true) {
      ReactPropTypesSecret = require_ReactPropTypesSecret();
      loggedTypeFailures = {};
      has = require_has();
      printWarning = function(text) {
        var message = "Warning: " + text;
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x) {
        }
      };
    }
    var ReactPropTypesSecret;
    var loggedTypeFailures;
    var has;
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
      if (true) {
        for (var typeSpecName in typeSpecs) {
          if (has(typeSpecs, typeSpecName)) {
            var error;
            try {
              if (typeof typeSpecs[typeSpecName] !== "function") {
                var err = Error(
                  (componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                );
                err.name = "Invariant Violation";
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning(
                (componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              loggedTypeFailures[error.message] = true;
              var stack = getStack ? getStack() : "";
              printWarning(
                "Failed " + location + " type: " + error.message + (stack != null ? stack : "")
              );
            }
          }
        }
      }
    }
    checkPropTypes.resetWarningCache = function() {
      if (true) {
        loggedTypeFailures = {};
      }
    };
    module.exports = checkPropTypes;
  }
});

// node_modules/prop-types/factoryWithTypeCheckers.js
var require_factoryWithTypeCheckers = __commonJS({
  "node_modules/prop-types/factoryWithTypeCheckers.js"(exports, module) {
    "use strict";
    var ReactIs = require_react_is();
    var assign = require_object_assign();
    var ReactPropTypesSecret = require_ReactPropTypesSecret();
    var has = require_has();
    var checkPropTypes = require_checkPropTypes();
    var printWarning = function() {
    };
    if (true) {
      printWarning = function(text) {
        var message = "Warning: " + text;
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x) {
        }
      };
    }
    function emptyFunctionThatReturnsNull() {
      return null;
    }
    module.exports = function(isValidElement, throwOnDirectAccess) {
      var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === "function") {
          return iteratorFn;
        }
      }
      var ANONYMOUS = "<<anonymous>>";
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker("array"),
        bigint: createPrimitiveTypeChecker("bigint"),
        bool: createPrimitiveTypeChecker("boolean"),
        func: createPrimitiveTypeChecker("function"),
        number: createPrimitiveTypeChecker("number"),
        object: createPrimitiveTypeChecker("object"),
        string: createPrimitiveTypeChecker("string"),
        symbol: createPrimitiveTypeChecker("symbol"),
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker
      };
      function is(x, y) {
        if (x === y) {
          return x !== 0 || 1 / x === 1 / y;
        } else {
          return x !== x && y !== y;
        }
      }
      function PropTypeError(message, data) {
        this.message = message;
        this.data = data && typeof data === "object" ? data : {};
        this.stack = "";
      }
      PropTypeError.prototype = Error.prototype;
      function createChainableTypeChecker(validate) {
        if (true) {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;
          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              var err = new Error(
                "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
              );
              err.name = "Invariant Violation";
              throw err;
            } else if (typeof console !== "undefined") {
              var cacheKey = componentName + ":" + propName;
              if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
              manualPropTypeWarningCount < 3) {
                printWarning(
                  "You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
              }
              return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
      }
      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            var preciseType = getPreciseType(propValue);
            return new PropTypeError(
              "Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."),
              { expectedType }
            );
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }
      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== "function") {
            return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createElementTypeTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          if (true) {
            if (arguments.length > 1) {
              printWarning(
                "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
              );
            } else {
              printWarning("Invalid argument supplied to oneOf, expected an array.");
            }
          }
          return emptyFunctionThatReturnsNull;
        }
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }
          var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === "symbol") {
              return String(value);
            }
            return value;
          });
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
        }
        return createChainableTypeChecker(validate);
      }
      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== "function") {
            return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          true ? printWarning("Invalid argument supplied to oneOfType, expected an instance of array.") : void 0;
          return emptyFunctionThatReturnsNull;
        }
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (typeof checker !== "function") {
            printWarning(
              "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + "."
            );
            return emptyFunctionThatReturnsNull;
          }
        }
        function validate(props, propName, componentName, location, propFullName) {
          var expectedTypes = [];
          for (var i2 = 0; i2 < arrayOfTypeCheckers.length; i2++) {
            var checker2 = arrayOfTypeCheckers[i2];
            var checkerResult = checker2(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
            if (checkerResult == null) {
              return null;
            }
            if (checkerResult.data && has(checkerResult.data, "expectedType")) {
              expectedTypes.push(checkerResult.data.expectedType);
            }
          }
          var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
        }
        return createChainableTypeChecker(validate);
      }
      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function invalidValidatorError(componentName, location, propFullName, key, type) {
        return new PropTypeError(
          (componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`."
        );
      }
      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (typeof checker !== "function") {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== "object") {
            return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
          }
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (has(shapeTypes, key) && typeof checker !== "function") {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            if (!checker) {
              return new PropTypeError(
                "Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  ")
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
      function isNode(propValue) {
        switch (typeof propValue) {
          case "number":
          case "string":
          case "undefined":
            return true;
          case "boolean":
            return !propValue;
          case "object":
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }
            return true;
          default:
            return false;
        }
      }
      function isSymbol(propType, propValue) {
        if (propType === "symbol") {
          return true;
        }
        if (!propValue) {
          return false;
        }
        if (propValue["@@toStringTag"] === "Symbol") {
          return true;
        }
        if (typeof Symbol === "function" && propValue instanceof Symbol) {
          return true;
        }
        return false;
      }
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return "array";
        }
        if (propValue instanceof RegExp) {
          return "object";
        }
        if (isSymbol(propType, propValue)) {
          return "symbol";
        }
        return propType;
      }
      function getPreciseType(propValue) {
        if (typeof propValue === "undefined" || propValue === null) {
          return "" + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === "object") {
          if (propValue instanceof Date) {
            return "date";
          } else if (propValue instanceof RegExp) {
            return "regexp";
          }
        }
        return propType;
      }
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case "array":
          case "object":
            return "an " + type;
          case "boolean":
          case "date":
          case "regexp":
            return "a " + type;
          default:
            return type;
        }
      }
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }
      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;
      return ReactPropTypes;
    };
  }
});

// node_modules/prop-types/index.js
var require_prop_types = __commonJS({
  "node_modules/prop-types/index.js"(exports, module) {
    if (true) {
      ReactIs = require_react_is();
      throwOnDirectAccess = true;
      module.exports = require_factoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
    } else {
      module.exports = null();
    }
    var ReactIs;
    var throwOnDirectAccess;
  }
});

// node_modules/react-draggable/node_modules/clsx/dist/clsx.m.js
var clsx_m_exports = {};
__export(clsx_m_exports, {
  clsx: () => clsx,
  default: () => clsx_m_default
});
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = ""; f < arguments.length; ) (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
var clsx_m_default;
var init_clsx_m = __esm({
  "node_modules/react-draggable/node_modules/clsx/dist/clsx.m.js"() {
    clsx_m_default = clsx;
  }
});

// node_modules/react-draggable/build/cjs/utils/shims.js
var require_shims = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/shims.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.dontSetMe = dontSetMe;
    exports.findInArray = findInArray;
    exports.int = int;
    exports.isFunction = isFunction;
    exports.isNum = isNum;
    function findInArray(array, callback) {
      for (let i = 0, length = array.length; i < length; i++) {
        if (callback.apply(callback, [array[i], i, array])) return array[i];
      }
    }
    function isFunction(func) {
      return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
    }
    function isNum(num) {
      return typeof num === "number" && !isNaN(num);
    }
    function int(a) {
      return parseInt(a, 10);
    }
    function dontSetMe(props, propName, componentName) {
      if (props[propName]) {
        return new Error("Invalid prop ".concat(propName, " passed to ").concat(componentName, " - do not set this, set it on the child."));
      }
    }
  }
});

// node_modules/react-draggable/build/cjs/utils/getPrefix.js
var require_getPrefix = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/getPrefix.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.browserPrefixToKey = browserPrefixToKey;
    exports.browserPrefixToStyle = browserPrefixToStyle;
    exports.default = void 0;
    exports.getPrefix = getPrefix;
    var prefixes = ["Moz", "Webkit", "O", "ms"];
    function getPrefix() {
      var _window$document;
      let prop = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
      if (typeof window === "undefined") return "";
      const style = (_window$document = window.document) === null || _window$document === void 0 || (_window$document = _window$document.documentElement) === null || _window$document === void 0 ? void 0 : _window$document.style;
      if (!style) return "";
      if (prop in style) return "";
      for (let i = 0; i < prefixes.length; i++) {
        if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
      }
      return "";
    }
    function browserPrefixToKey(prop, prefix) {
      return prefix ? "".concat(prefix).concat(kebabToTitleCase(prop)) : prop;
    }
    function browserPrefixToStyle(prop, prefix) {
      return prefix ? "-".concat(prefix.toLowerCase(), "-").concat(prop) : prop;
    }
    function kebabToTitleCase(str) {
      let out = "";
      let shouldCapitalize = true;
      for (let i = 0; i < str.length; i++) {
        if (shouldCapitalize) {
          out += str[i].toUpperCase();
          shouldCapitalize = false;
        } else if (str[i] === "-") {
          shouldCapitalize = true;
        } else {
          out += str[i];
        }
      }
      return out;
    }
    var _default = exports.default = getPrefix();
  }
});

// node_modules/react-draggable/build/cjs/utils/domFns.js
var require_domFns = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/domFns.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.addClassName = addClassName;
    exports.addEvent = addEvent;
    exports.addUserSelectStyles = addUserSelectStyles;
    exports.createCSSTransform = createCSSTransform;
    exports.createSVGTransform = createSVGTransform;
    exports.getTouch = getTouch;
    exports.getTouchIdentifier = getTouchIdentifier;
    exports.getTranslation = getTranslation;
    exports.innerHeight = innerHeight;
    exports.innerWidth = innerWidth;
    exports.matchesSelector = matchesSelector;
    exports.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
    exports.offsetXYFromParent = offsetXYFromParent;
    exports.outerHeight = outerHeight;
    exports.outerWidth = outerWidth;
    exports.removeClassName = removeClassName;
    exports.removeEvent = removeEvent;
    exports.removeUserSelectStyles = removeUserSelectStyles;
    var _shims = require_shims();
    var _getPrefix = _interopRequireWildcard(require_getPrefix());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    var matchesSelectorFunc = "";
    function matchesSelector(el, selector) {
      if (!matchesSelectorFunc) {
        matchesSelectorFunc = (0, _shims.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(method) {
          return (0, _shims.isFunction)(el[method]);
        });
      }
      if (!(0, _shims.isFunction)(el[matchesSelectorFunc])) return false;
      return el[matchesSelectorFunc](selector);
    }
    function matchesSelectorAndParentsTo(el, selector, baseNode) {
      let node = el;
      do {
        if (matchesSelector(node, selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode;
      } while (node);
      return false;
    }
    function addEvent(el, event, handler, inputOptions) {
      if (!el) return;
      const options = {
        capture: true,
        ...inputOptions
      };
      if (el.addEventListener) {
        el.addEventListener(event, handler, options);
      } else if (el.attachEvent) {
        el.attachEvent("on" + event, handler);
      } else {
        el["on" + event] = handler;
      }
    }
    function removeEvent(el, event, handler, inputOptions) {
      if (!el) return;
      const options = {
        capture: true,
        ...inputOptions
      };
      if (el.removeEventListener) {
        el.removeEventListener(event, handler, options);
      } else if (el.detachEvent) {
        el.detachEvent("on" + event, handler);
      } else {
        el["on" + event] = null;
      }
    }
    function outerHeight(node) {
      let height = node.clientHeight;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      height += (0, _shims.int)(computedStyle.borderTopWidth);
      height += (0, _shims.int)(computedStyle.borderBottomWidth);
      return height;
    }
    function outerWidth(node) {
      let width = node.clientWidth;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      width += (0, _shims.int)(computedStyle.borderLeftWidth);
      width += (0, _shims.int)(computedStyle.borderRightWidth);
      return width;
    }
    function innerHeight(node) {
      let height = node.clientHeight;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      height -= (0, _shims.int)(computedStyle.paddingTop);
      height -= (0, _shims.int)(computedStyle.paddingBottom);
      return height;
    }
    function innerWidth(node) {
      let width = node.clientWidth;
      const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      width -= (0, _shims.int)(computedStyle.paddingLeft);
      width -= (0, _shims.int)(computedStyle.paddingRight);
      return width;
    }
    function offsetXYFromParent(evt, offsetParent, scale) {
      const isBody = offsetParent === offsetParent.ownerDocument.body;
      const offsetParentRect = isBody ? {
        left: 0,
        top: 0
      } : offsetParent.getBoundingClientRect();
      const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
      const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
      return {
        x,
        y
      };
    }
    function createCSSTransform(controlPos, positionOffset) {
      const translation = getTranslation(controlPos, positionOffset, "px");
      return {
        [(0, _getPrefix.browserPrefixToKey)("transform", _getPrefix.default)]: translation
      };
    }
    function createSVGTransform(controlPos, positionOffset) {
      const translation = getTranslation(controlPos, positionOffset, "");
      return translation;
    }
    function getTranslation(_ref, positionOffset, unitSuffix) {
      let {
        x,
        y
      } = _ref;
      let translation = "translate(".concat(x).concat(unitSuffix, ",").concat(y).concat(unitSuffix, ")");
      if (positionOffset) {
        const defaultX = "".concat(typeof positionOffset.x === "string" ? positionOffset.x : positionOffset.x + unitSuffix);
        const defaultY = "".concat(typeof positionOffset.y === "string" ? positionOffset.y : positionOffset.y + unitSuffix);
        translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
      }
      return translation;
    }
    function getTouch(e, identifier) {
      return e.targetTouches && (0, _shims.findInArray)(e.targetTouches, (t) => identifier === t.identifier) || e.changedTouches && (0, _shims.findInArray)(e.changedTouches, (t) => identifier === t.identifier);
    }
    function getTouchIdentifier(e) {
      if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
    }
    function addUserSelectStyles(doc) {
      if (!doc) return;
      let styleEl = doc.getElementById("react-draggable-style-el");
      if (!styleEl) {
        styleEl = doc.createElement("style");
        styleEl.type = "text/css";
        styleEl.id = "react-draggable-style-el";
        styleEl.innerHTML = ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n";
        styleEl.innerHTML += ".react-draggable-transparent-selection *::selection {all: inherit;}\n";
        doc.getElementsByTagName("head")[0].appendChild(styleEl);
      }
      if (doc.body) addClassName(doc.body, "react-draggable-transparent-selection");
    }
    function removeUserSelectStyles(doc) {
      if (!doc) return;
      try {
        if (doc.body) removeClassName(doc.body, "react-draggable-transparent-selection");
        if (doc.selection) {
          doc.selection.empty();
        } else {
          const selection = (doc.defaultView || window).getSelection();
          if (selection && selection.type !== "Caret") {
            selection.removeAllRanges();
          }
        }
      } catch (e) {
      }
    }
    function addClassName(el, className) {
      if (el.classList) {
        el.classList.add(className);
      } else {
        if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
          el.className += " ".concat(className);
        }
      }
    }
    function removeClassName(el, className) {
      if (el.classList) {
        el.classList.remove(className);
      } else {
        el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), "g"), "");
      }
    }
  }
});

// node_modules/react-draggable/build/cjs/utils/positionFns.js
var require_positionFns = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/positionFns.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.canDragX = canDragX;
    exports.canDragY = canDragY;
    exports.createCoreData = createCoreData;
    exports.createDraggableData = createDraggableData;
    exports.getBoundPosition = getBoundPosition;
    exports.getControlPosition = getControlPosition;
    exports.snapToGrid = snapToGrid;
    var _shims = require_shims();
    var _domFns = require_domFns();
    function getBoundPosition(draggable, x, y) {
      if (!draggable.props.bounds) return [x, y];
      let {
        bounds
      } = draggable.props;
      bounds = typeof bounds === "string" ? bounds : cloneBounds(bounds);
      const node = findDOMNode(draggable);
      if (typeof bounds === "string") {
        const {
          ownerDocument
        } = node;
        const ownerWindow = ownerDocument.defaultView;
        let boundNode;
        if (bounds === "parent") {
          boundNode = node.parentNode;
        } else {
          boundNode = ownerDocument.querySelector(bounds);
        }
        if (!(boundNode instanceof ownerWindow.HTMLElement)) {
          throw new Error('Bounds selector "' + bounds + '" could not find an element.');
        }
        const boundNodeEl = boundNode;
        const nodeStyle = ownerWindow.getComputedStyle(node);
        const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
        bounds = {
          left: -node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingLeft) + (0, _shims.int)(nodeStyle.marginLeft),
          top: -node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingTop) + (0, _shims.int)(nodeStyle.marginTop),
          right: (0, _domFns.innerWidth)(boundNodeEl) - (0, _domFns.outerWidth)(node) - node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingRight) - (0, _shims.int)(nodeStyle.marginRight),
          bottom: (0, _domFns.innerHeight)(boundNodeEl) - (0, _domFns.outerHeight)(node) - node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingBottom) - (0, _shims.int)(nodeStyle.marginBottom)
        };
      }
      if ((0, _shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
      if ((0, _shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom);
      if ((0, _shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
      if ((0, _shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
      return [x, y];
    }
    function snapToGrid(grid, pendingX, pendingY) {
      const x = Math.round(pendingX / grid[0]) * grid[0];
      const y = Math.round(pendingY / grid[1]) * grid[1];
      return [x, y];
    }
    function canDragX(draggable) {
      return draggable.props.axis === "both" || draggable.props.axis === "x";
    }
    function canDragY(draggable) {
      return draggable.props.axis === "both" || draggable.props.axis === "y";
    }
    function getControlPosition(e, touchIdentifier, draggableCore) {
      const touchObj = typeof touchIdentifier === "number" ? (0, _domFns.getTouch)(e, touchIdentifier) : null;
      if (typeof touchIdentifier === "number" && !touchObj) return null;
      const node = findDOMNode(draggableCore);
      const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
      return (0, _domFns.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
    }
    function createCoreData(draggable, x, y) {
      const isStart = !(0, _shims.isNum)(draggable.lastX);
      const node = findDOMNode(draggable);
      if (isStart) {
        return {
          node,
          deltaX: 0,
          deltaY: 0,
          lastX: x,
          lastY: y,
          x,
          y
        };
      } else {
        return {
          node,
          deltaX: x - draggable.lastX,
          deltaY: y - draggable.lastY,
          lastX: draggable.lastX,
          lastY: draggable.lastY,
          x,
          y
        };
      }
    }
    function createDraggableData(draggable, coreData) {
      const scale = draggable.props.scale;
      return {
        node: coreData.node,
        x: draggable.state.x + coreData.deltaX / scale,
        y: draggable.state.y + coreData.deltaY / scale,
        deltaX: coreData.deltaX / scale,
        deltaY: coreData.deltaY / scale,
        lastX: draggable.state.x,
        lastY: draggable.state.y
      };
    }
    function cloneBounds(bounds) {
      return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
      };
    }
    function findDOMNode(draggable) {
      const node = draggable.findDOMNode();
      if (!node) {
        throw new Error("<DraggableCore>: Unmounted during event!");
      }
      return node;
    }
  }
});

// node_modules/react-draggable/build/cjs/utils/log.js
var require_log = __commonJS({
  "node_modules/react-draggable/build/cjs/utils/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = log;
    function log() {
      if (void 0) console.log(...arguments);
    }
  }
});

// node_modules/react-draggable/build/cjs/DraggableCore.js
var require_DraggableCore = __commonJS({
  "node_modules/react-draggable/build/cjs/DraggableCore.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDom = _interopRequireDefault(require_react_dom());
    var _domFns = require_domFns();
    var _positionFns = require_positionFns();
    var _shims = require_shims();
    var _log = _interopRequireDefault(require_log());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var eventsFor = {
      touch: {
        start: "touchstart",
        move: "touchmove",
        stop: "touchend"
      },
      mouse: {
        start: "mousedown",
        move: "mousemove",
        stop: "mouseup"
      }
    };
    var dragEventFor = eventsFor.mouse;
    var DraggableCore = class extends React.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "dragging", false);
        _defineProperty(this, "lastX", NaN);
        _defineProperty(this, "lastY", NaN);
        _defineProperty(this, "touchIdentifier", null);
        _defineProperty(this, "mounted", false);
        _defineProperty(this, "handleDragStart", (e) => {
          this.props.onMouseDown(e);
          if (!this.props.allowAnyClick && typeof e.button === "number" && e.button !== 0) return false;
          const thisNode = this.findDOMNode();
          if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
            throw new Error("<DraggableCore> not mounted on DragStart!");
          }
          const {
            ownerDocument
          } = thisNode;
          if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) {
            return;
          }
          if (e.type === "touchstart") e.preventDefault();
          const touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
          this.touchIdentifier = touchIdentifier;
          const position = (0, _positionFns.getControlPosition)(e, touchIdentifier, this);
          if (position == null) return;
          const {
            x,
            y
          } = position;
          const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
          (0, _log.default)("DraggableCore: handleDragStart: %j", coreEvent);
          (0, _log.default)("calling", this.props.onStart);
          const shouldUpdate = this.props.onStart(e, coreEvent);
          if (shouldUpdate === false || this.mounted === false) return;
          if (this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument);
          this.dragging = true;
          this.lastX = x;
          this.lastY = y;
          (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
          (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
        });
        _defineProperty(this, "handleDrag", (e) => {
          const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
          if (position == null) return;
          let {
            x,
            y
          } = position;
          if (Array.isArray(this.props.grid)) {
            let deltaX = x - this.lastX, deltaY = y - this.lastY;
            [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
            if (!deltaX && !deltaY) return;
            x = this.lastX + deltaX, y = this.lastY + deltaY;
          }
          const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
          (0, _log.default)("DraggableCore: handleDrag: %j", coreEvent);
          const shouldUpdate = this.props.onDrag(e, coreEvent);
          if (shouldUpdate === false || this.mounted === false) {
            try {
              this.handleDragStop(new MouseEvent("mouseup"));
            } catch (err) {
              const event = document.createEvent("MouseEvents");
              event.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              this.handleDragStop(event);
            }
            return;
          }
          this.lastX = x;
          this.lastY = y;
        });
        _defineProperty(this, "handleDragStop", (e) => {
          if (!this.dragging) return;
          const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
          if (position == null) return;
          let {
            x,
            y
          } = position;
          if (Array.isArray(this.props.grid)) {
            let deltaX = x - this.lastX || 0;
            let deltaY = y - this.lastY || 0;
            [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
            x = this.lastX + deltaX, y = this.lastY + deltaY;
          }
          const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
          const shouldContinue = this.props.onStop(e, coreEvent);
          if (shouldContinue === false || this.mounted === false) return false;
          const thisNode = this.findDOMNode();
          if (thisNode) {
            if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
          }
          (0, _log.default)("DraggableCore: handleDragStop: %j", coreEvent);
          this.dragging = false;
          this.lastX = NaN;
          this.lastY = NaN;
          if (thisNode) {
            (0, _log.default)("DraggableCore: Removing handlers");
            (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
            (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
          }
        });
        _defineProperty(this, "onMouseDown", (e) => {
          dragEventFor = eventsFor.mouse;
          return this.handleDragStart(e);
        });
        _defineProperty(this, "onMouseUp", (e) => {
          dragEventFor = eventsFor.mouse;
          return this.handleDragStop(e);
        });
        _defineProperty(this, "onTouchStart", (e) => {
          dragEventFor = eventsFor.touch;
          return this.handleDragStart(e);
        });
        _defineProperty(this, "onTouchEnd", (e) => {
          dragEventFor = eventsFor.touch;
          return this.handleDragStop(e);
        });
      }
      componentDidMount() {
        this.mounted = true;
        const thisNode = this.findDOMNode();
        if (thisNode) {
          (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
            passive: false
          });
        }
      }
      componentWillUnmount() {
        this.mounted = false;
        const thisNode = this.findDOMNode();
        if (thisNode) {
          const {
            ownerDocument
          } = thisNode;
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
          (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
            passive: false
          });
          if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument);
        }
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        var _this$props, _this$props2;
        return (_this$props = this.props) !== null && _this$props !== void 0 && _this$props.nodeRef ? (_this$props2 = this.props) === null || _this$props2 === void 0 || (_this$props2 = _this$props2.nodeRef) === null || _this$props2 === void 0 ? void 0 : _this$props2.current : _reactDom.default.findDOMNode(this);
      }
      render() {
        return React.cloneElement(React.Children.only(this.props.children), {
          // Note: mouseMove handler is attached to document so it will still function
          // when the user drags quickly and leaves the bounds of the element.
          onMouseDown: this.onMouseDown,
          onMouseUp: this.onMouseUp,
          // onTouchStart is added on `componentDidMount` so they can be added with
          // {passive: false}, which allows it to cancel. See
          // https://developers.google.com/web/updates/2017/01/scrolling-intervention
          onTouchEnd: this.onTouchEnd
        });
      }
    };
    exports.default = DraggableCore;
    _defineProperty(DraggableCore, "displayName", "DraggableCore");
    _defineProperty(DraggableCore, "propTypes", {
      /**
       * `allowAnyClick` allows dragging using any mouse button.
       * By default, we only accept the left button.
       *
       * Defaults to `false`.
       */
      allowAnyClick: _propTypes.default.bool,
      children: _propTypes.default.node.isRequired,
      /**
       * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
       * with the exception of `onMouseDown`, will not fire.
       */
      disabled: _propTypes.default.bool,
      /**
       * By default, we add 'user-select:none' attributes to the document body
       * to prevent ugly text selection during drag. If this is causing problems
       * for your app, set this to `false`.
       */
      enableUserSelectHack: _propTypes.default.bool,
      /**
       * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
       * instead of using the parent node.
       */
      offsetParent: function(props, propName) {
        if (props[propName] && props[propName].nodeType !== 1) {
          throw new Error("Draggable's offsetParent must be a DOM Node.");
        }
      },
      /**
       * `grid` specifies the x and y that dragging should snap to.
       */
      grid: _propTypes.default.arrayOf(_propTypes.default.number),
      /**
       * `handle` specifies a selector to be used as the handle that initiates drag.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable handle=".handle">
       *              <div>
       *                  <div className="handle">Click me to drag</div>
       *                  <div>This is some other content</div>
       *              </div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      handle: _propTypes.default.string,
      /**
       * `cancel` specifies a selector to be used to prevent drag initialization.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *           return(
       *               <Draggable cancel=".cancel">
       *                   <div>
       *                     <div className="cancel">You can't drag from here</div>
       *                     <div>Dragging here works fine</div>
       *                   </div>
       *               </Draggable>
       *           );
       *       }
       *   });
       * ```
       */
      cancel: _propTypes.default.string,
      /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
       * Unfortunately, in order for <Draggable> to work properly, we need raw access
       * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
       * as in this example:
       *
       * function MyComponent() {
       *   const nodeRef = React.useRef(null);
       *   return (
       *     <Draggable nodeRef={nodeRef}>
       *       <div ref={nodeRef}>Example Target</div>
       *     </Draggable>
       *   );
       * }
       *
       * This can be used for arbitrarily nested components, so long as the ref ends up
       * pointing to the actual child DOM node and not a custom component.
       */
      nodeRef: _propTypes.default.object,
      /**
       * Called when dragging starts.
       * If this function returns the boolean false, dragging will be canceled.
       */
      onStart: _propTypes.default.func,
      /**
       * Called while dragging.
       * If this function returns the boolean false, dragging will be canceled.
       */
      onDrag: _propTypes.default.func,
      /**
       * Called when dragging stops.
       * If this function returns the boolean false, the drag will remain active.
       */
      onStop: _propTypes.default.func,
      /**
       * A workaround option which can be passed if onMouseDown needs to be accessed,
       * since it'll always be blocked (as there is internal use of onMouseDown)
       */
      onMouseDown: _propTypes.default.func,
      /**
       * `scale`, if set, applies scaling while dragging an element
       */
      scale: _propTypes.default.number,
      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims.dontSetMe,
      style: _shims.dontSetMe,
      transform: _shims.dontSetMe
    });
    _defineProperty(DraggableCore, "defaultProps", {
      allowAnyClick: false,
      // by default only accept left click
      disabled: false,
      enableUserSelectHack: true,
      onStart: function() {
      },
      onDrag: function() {
      },
      onStop: function() {
      },
      onMouseDown: function() {
      },
      scale: 1
    });
  }
});

// node_modules/react-draggable/build/cjs/Draggable.js
var require_Draggable = __commonJS({
  "node_modules/react-draggable/build/cjs/Draggable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "DraggableCore", {
      enumerable: true,
      get: function() {
        return _DraggableCore.default;
      }
    });
    exports.default = void 0;
    var React = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDom = _interopRequireDefault(require_react_dom());
    var _clsx = _interopRequireDefault((init_clsx_m(), __toCommonJS(clsx_m_exports)));
    var _domFns = require_domFns();
    var _positionFns = require_positionFns();
    var _shims = require_shims();
    var _DraggableCore = _interopRequireDefault(require_DraggableCore());
    var _log = _interopRequireDefault(require_log());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var Draggable = class extends React.Component {
      // React 16.3+
      // Arity (props, state)
      static getDerivedStateFromProps(_ref, _ref2) {
        let {
          position
        } = _ref;
        let {
          prevPropsPosition
        } = _ref2;
        if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
          (0, _log.default)("Draggable: getDerivedStateFromProps %j", {
            position,
            prevPropsPosition
          });
          return {
            x: position.x,
            y: position.y,
            prevPropsPosition: {
              ...position
            }
          };
        }
        return null;
      }
      constructor(props) {
        super(props);
        _defineProperty(this, "onDragStart", (e, coreData) => {
          (0, _log.default)("Draggable: onDragStart: %j", coreData);
          const shouldStart = this.props.onStart(e, (0, _positionFns.createDraggableData)(this, coreData));
          if (shouldStart === false) return false;
          this.setState({
            dragging: true,
            dragged: true
          });
        });
        _defineProperty(this, "onDrag", (e, coreData) => {
          if (!this.state.dragging) return false;
          (0, _log.default)("Draggable: onDrag: %j", coreData);
          const uiData = (0, _positionFns.createDraggableData)(this, coreData);
          const newState = {
            x: uiData.x,
            y: uiData.y,
            slackX: 0,
            slackY: 0
          };
          if (this.props.bounds) {
            const {
              x,
              y
            } = newState;
            newState.x += this.state.slackX;
            newState.y += this.state.slackY;
            const [newStateX, newStateY] = (0, _positionFns.getBoundPosition)(this, newState.x, newState.y);
            newState.x = newStateX;
            newState.y = newStateY;
            newState.slackX = this.state.slackX + (x - newState.x);
            newState.slackY = this.state.slackY + (y - newState.y);
            uiData.x = newState.x;
            uiData.y = newState.y;
            uiData.deltaX = newState.x - this.state.x;
            uiData.deltaY = newState.y - this.state.y;
          }
          const shouldUpdate = this.props.onDrag(e, uiData);
          if (shouldUpdate === false) return false;
          this.setState(newState);
        });
        _defineProperty(this, "onDragStop", (e, coreData) => {
          if (!this.state.dragging) return false;
          const shouldContinue = this.props.onStop(e, (0, _positionFns.createDraggableData)(this, coreData));
          if (shouldContinue === false) return false;
          (0, _log.default)("Draggable: onDragStop: %j", coreData);
          const newState = {
            dragging: false,
            slackX: 0,
            slackY: 0
          };
          const controlled = Boolean(this.props.position);
          if (controlled) {
            const {
              x,
              y
            } = this.props.position;
            newState.x = x;
            newState.y = y;
          }
          this.setState(newState);
        });
        this.state = {
          // Whether or not we are currently dragging.
          dragging: false,
          // Whether or not we have been dragged before.
          dragged: false,
          // Current transform x and y.
          x: props.position ? props.position.x : props.defaultPosition.x,
          y: props.position ? props.position.y : props.defaultPosition.y,
          prevPropsPosition: {
            ...props.position
          },
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: false
        };
        if (props.position && !(props.onDrag || props.onStop)) {
          console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
        }
      }
      componentDidMount() {
        if (typeof window.SVGElement !== "undefined" && this.findDOMNode() instanceof window.SVGElement) {
          this.setState({
            isElementSVG: true
          });
        }
      }
      componentWillUnmount() {
        this.setState({
          dragging: false
        });
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        var _this$props$nodeRef$c, _this$props;
        return (_this$props$nodeRef$c = (_this$props = this.props) === null || _this$props === void 0 || (_this$props = _this$props.nodeRef) === null || _this$props === void 0 ? void 0 : _this$props.current) !== null && _this$props$nodeRef$c !== void 0 ? _this$props$nodeRef$c : _reactDom.default.findDOMNode(this);
      }
      render() {
        const {
          axis,
          bounds,
          children,
          defaultPosition,
          defaultClassName,
          defaultClassNameDragging,
          defaultClassNameDragged,
          position,
          positionOffset,
          scale,
          ...draggableCoreProps
        } = this.props;
        let style = {};
        let svgTransform = null;
        const controlled = Boolean(position);
        const draggable = !controlled || this.state.dragging;
        const validPosition = position || defaultPosition;
        const transformOpts = {
          // Set left if horizontal drag is enabled
          x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
          // Set top if vertical drag is enabled
          y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
        };
        if (this.state.isElementSVG) {
          svgTransform = (0, _domFns.createSVGTransform)(transformOpts, positionOffset);
        } else {
          style = (0, _domFns.createCSSTransform)(transformOpts, positionOffset);
        }
        const className = (0, _clsx.default)(children.props.className || "", defaultClassName, {
          [defaultClassNameDragging]: this.state.dragging,
          [defaultClassNameDragged]: this.state.dragged
        });
        return React.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop
        }), React.cloneElement(React.Children.only(children), {
          className,
          style: {
            ...children.props.style,
            ...style
          },
          transform: svgTransform
        }));
      }
    };
    exports.default = Draggable;
    _defineProperty(Draggable, "displayName", "Draggable");
    _defineProperty(Draggable, "propTypes", {
      // Accepts all props <DraggableCore> accepts.
      ..._DraggableCore.default.propTypes,
      /**
       * `axis` determines which axis the draggable can move.
       *
       *  Note that all callbacks will still return data as normal. This only
       *  controls flushing to the DOM.
       *
       * 'both' allows movement horizontally and vertically.
       * 'x' limits movement to horizontal axis.
       * 'y' limits movement to vertical axis.
       * 'none' limits all movement.
       *
       * Defaults to 'both'.
       */
      axis: _propTypes.default.oneOf(["both", "x", "y", "none"]),
      /**
       * `bounds` determines the range of movement available to the element.
       * Available values are:
       *
       * 'parent' restricts movement within the Draggable's parent node.
       *
       * Alternatively, pass an object with the following properties, all of which are optional:
       *
       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
       *
       * All values are in px.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable bounds={{right: 300, bottom: 300}}>
       *              <div>Content</div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
        left: _propTypes.default.number,
        right: _propTypes.default.number,
        top: _propTypes.default.number,
        bottom: _propTypes.default.number
      }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
      defaultClassName: _propTypes.default.string,
      defaultClassNameDragging: _propTypes.default.string,
      defaultClassNameDragged: _propTypes.default.string,
      /**
       * `defaultPosition` specifies the x and y that the dragged item should start at
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable defaultPosition={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      defaultPosition: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),
      positionOffset: _propTypes.default.shape({
        x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
        y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
      }),
      /**
       * `position`, if present, defines the current position of the element.
       *
       *  This is similar to how form elements in React work - if no `position` is supplied, the component
       *  is uncontrolled.
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable position={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      position: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),
      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims.dontSetMe,
      style: _shims.dontSetMe,
      transform: _shims.dontSetMe
    });
    _defineProperty(Draggable, "defaultProps", {
      ..._DraggableCore.default.defaultProps,
      axis: "both",
      bounds: false,
      defaultClassName: "react-draggable",
      defaultClassNameDragging: "react-draggable-dragging",
      defaultClassNameDragged: "react-draggable-dragged",
      defaultPosition: {
        x: 0,
        y: 0
      },
      scale: 1
    });
  }
});

// node_modules/react-draggable/build/cjs/cjs.js
var require_cjs = __commonJS({
  "node_modules/react-draggable/build/cjs/cjs.js"(exports, module) {
    "use strict";
    var {
      default: Draggable,
      DraggableCore
    } = require_Draggable();
    module.exports = Draggable;
    module.exports.default = Draggable;
    module.exports.DraggableCore = DraggableCore;
  }
});

// node_modules/react-resizable/build/utils.js
var require_utils2 = __commonJS({
  "node_modules/react-resizable/build/utils.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.cloneElement = cloneElement;
    var _react = _interopRequireDefault(require_react());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function cloneElement(element, props) {
      if (props.style && element.props.style) {
        props.style = _objectSpread(_objectSpread({}, element.props.style), props.style);
      }
      if (props.className && element.props.className) {
        props.className = element.props.className + " " + props.className;
      }
      return _react.default.cloneElement(element, props);
    }
  }
});

// node_modules/react-resizable/build/propTypes.js
var require_propTypes = __commonJS({
  "node_modules/react-resizable/build/propTypes.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.resizableProps = void 0;
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDraggable = require_cjs();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var resizableProps = {
      /*
      * Restricts resizing to a particular axis (default: 'both')
      * 'both' - allows resizing by width or height
      * 'x' - only allows the width to be changed
      * 'y' - only allows the height to be changed
      * 'none' - disables resizing altogether
      * */
      axis: _propTypes.default.oneOf(["both", "x", "y", "none"]),
      className: _propTypes.default.string,
      /*
      * Require that one and only one child be present.
      * */
      children: _propTypes.default.element.isRequired,
      /*
      * These will be passed wholesale to react-draggable's DraggableCore
      * */
      draggableOpts: _propTypes.default.shape({
        allowAnyClick: _propTypes.default.bool,
        cancel: _propTypes.default.string,
        children: _propTypes.default.node,
        disabled: _propTypes.default.bool,
        enableUserSelectHack: _propTypes.default.bool,
        offsetParent: _propTypes.default.node,
        grid: _propTypes.default.arrayOf(_propTypes.default.number),
        handle: _propTypes.default.string,
        nodeRef: _propTypes.default.object,
        onStart: _propTypes.default.func,
        onDrag: _propTypes.default.func,
        onStop: _propTypes.default.func,
        onMouseDown: _propTypes.default.func,
        scale: _propTypes.default.number
      }),
      /*
      * Initial height
      * */
      height: function height() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var props = args[0];
        if (props.axis === "both" || props.axis === "y") {
          var _PropTypes$number;
          return (_PropTypes$number = _propTypes.default.number).isRequired.apply(_PropTypes$number, args);
        }
        return _propTypes.default.number.apply(_propTypes.default, args);
      },
      /*
      * Customize cursor resize handle
      * */
      handle: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),
      /*
      * If you change this, be sure to update your css
      * */
      handleSize: _propTypes.default.arrayOf(_propTypes.default.number),
      lockAspectRatio: _propTypes.default.bool,
      /*
      * Max X & Y measure
      * */
      maxConstraints: _propTypes.default.arrayOf(_propTypes.default.number),
      /*
      * Min X & Y measure
      * */
      minConstraints: _propTypes.default.arrayOf(_propTypes.default.number),
      /*
      * Called on stop resize event
      * */
      onResizeStop: _propTypes.default.func,
      /*
      * Called on start resize event
      * */
      onResizeStart: _propTypes.default.func,
      /*
      * Called on resize event
      * */
      onResize: _propTypes.default.func,
      /*
      * Defines which resize handles should be rendered (default: 'se')
      * 's' - South handle (bottom-center)
      * 'w' - West handle (left-center)
      * 'e' - East handle (right-center)
      * 'n' - North handle (top-center)
      * 'sw' - Southwest handle (bottom-left)
      * 'nw' - Northwest handle (top-left)
      * 'se' - Southeast handle (bottom-right)
      * 'ne' - Northeast handle (top-center)
      * */
      resizeHandles: _propTypes.default.arrayOf(_propTypes.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
      /*
      * If `transform: scale(n)` is set on the parent, this should be set to `n`.
      * */
      transformScale: _propTypes.default.number,
      /*
       * Initial width
       */
      width: function width() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        var props = args[0];
        if (props.axis === "both" || props.axis === "x") {
          var _PropTypes$number2;
          return (_PropTypes$number2 = _propTypes.default.number).isRequired.apply(_PropTypes$number2, args);
        }
        return _propTypes.default.number.apply(_propTypes.default, args);
      }
    };
    exports.resizableProps = resizableProps;
  }
});

// node_modules/react-resizable/build/Resizable.js
var require_Resizable = __commonJS({
  "node_modules/react-resizable/build/Resizable.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.default = void 0;
    var React = _interopRequireWildcard(require_react());
    var _reactDraggable = require_cjs();
    var _utils = require_utils2();
    var _propTypes = require_propTypes();
    var _excluded = ["children", "className", "draggableOpts", "width", "height", "handle", "handleSize", "lockAspectRatio", "axis", "minConstraints", "maxConstraints", "onResize", "onResizeStop", "onResizeStart", "resizeHandles", "transformScale"];
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
      return target;
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var Resizable = function(_React$Component) {
      _inheritsLoose(Resizable2, _React$Component);
      function Resizable2() {
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
        _this.handleRefs = {};
        _this.lastHandleRect = null;
        _this.slack = null;
        return _this;
      }
      var _proto = Resizable2.prototype;
      _proto.componentWillUnmount = function componentWillUnmount() {
        this.resetData();
      };
      _proto.resetData = function resetData() {
        this.lastHandleRect = this.slack = null;
      };
      _proto.runConstraints = function runConstraints(width, height) {
        var _this$props = this.props, minConstraints = _this$props.minConstraints, maxConstraints = _this$props.maxConstraints, lockAspectRatio = _this$props.lockAspectRatio;
        if (!minConstraints && !maxConstraints && !lockAspectRatio) return [width, height];
        if (lockAspectRatio) {
          var ratio = this.props.width / this.props.height;
          var deltaW = width - this.props.width;
          var deltaH = height - this.props.height;
          if (Math.abs(deltaW) > Math.abs(deltaH * ratio)) {
            height = width / ratio;
          } else {
            width = height * ratio;
          }
        }
        var oldW = width, oldH = height;
        var _ref = this.slack || [0, 0], slackW = _ref[0], slackH = _ref[1];
        width += slackW;
        height += slackH;
        if (minConstraints) {
          width = Math.max(minConstraints[0], width);
          height = Math.max(minConstraints[1], height);
        }
        if (maxConstraints) {
          width = Math.min(maxConstraints[0], width);
          height = Math.min(maxConstraints[1], height);
        }
        this.slack = [slackW + (oldW - width), slackH + (oldH - height)];
        return [width, height];
      };
      _proto.resizeHandler = function resizeHandler(handlerName, axis) {
        var _this2 = this;
        return function(e, _ref2) {
          var node = _ref2.node, deltaX = _ref2.deltaX, deltaY = _ref2.deltaY;
          if (handlerName === "onResizeStart") _this2.resetData();
          var canDragX = (_this2.props.axis === "both" || _this2.props.axis === "x") && axis !== "n" && axis !== "s";
          var canDragY = (_this2.props.axis === "both" || _this2.props.axis === "y") && axis !== "e" && axis !== "w";
          if (!canDragX && !canDragY) return;
          var axisV = axis[0];
          var axisH = axis[axis.length - 1];
          var handleRect = node.getBoundingClientRect();
          if (_this2.lastHandleRect != null) {
            if (axisH === "w") {
              var deltaLeftSinceLast = handleRect.left - _this2.lastHandleRect.left;
              deltaX += deltaLeftSinceLast;
            }
            if (axisV === "n") {
              var deltaTopSinceLast = handleRect.top - _this2.lastHandleRect.top;
              deltaY += deltaTopSinceLast;
            }
          }
          _this2.lastHandleRect = handleRect;
          if (axisH === "w") deltaX = -deltaX;
          if (axisV === "n") deltaY = -deltaY;
          var width = _this2.props.width + (canDragX ? deltaX / _this2.props.transformScale : 0);
          var height = _this2.props.height + (canDragY ? deltaY / _this2.props.transformScale : 0);
          var _this2$runConstraints = _this2.runConstraints(width, height);
          width = _this2$runConstraints[0];
          height = _this2$runConstraints[1];
          var dimensionsChanged = width !== _this2.props.width || height !== _this2.props.height;
          var cb = typeof _this2.props[handlerName] === "function" ? _this2.props[handlerName] : null;
          var shouldSkipCb = handlerName === "onResize" && !dimensionsChanged;
          if (cb && !shouldSkipCb) {
            e.persist == null ? void 0 : e.persist();
            cb(e, {
              node,
              size: {
                width,
                height
              },
              handle: axis
            });
          }
          if (handlerName === "onResizeStop") _this2.resetData();
        };
      };
      _proto.renderResizeHandle = function renderResizeHandle(handleAxis, ref) {
        var handle = this.props.handle;
        if (!handle) {
          return React.createElement("span", {
            className: "react-resizable-handle react-resizable-handle-" + handleAxis,
            ref
          });
        }
        if (typeof handle === "function") {
          return handle(handleAxis, ref);
        }
        var isDOMElement = typeof handle.type === "string";
        var props = _objectSpread({
          ref
        }, isDOMElement ? {} : {
          handleAxis
        });
        return React.cloneElement(handle, props);
      };
      _proto.render = function render() {
        var _this3 = this;
        var _this$props2 = this.props, children = _this$props2.children, className = _this$props2.className, draggableOpts = _this$props2.draggableOpts, width = _this$props2.width, height = _this$props2.height, handle = _this$props2.handle, handleSize = _this$props2.handleSize, lockAspectRatio = _this$props2.lockAspectRatio, axis = _this$props2.axis, minConstraints = _this$props2.minConstraints, maxConstraints = _this$props2.maxConstraints, onResize = _this$props2.onResize, onResizeStop = _this$props2.onResizeStop, onResizeStart = _this$props2.onResizeStart, resizeHandles = _this$props2.resizeHandles, transformScale = _this$props2.transformScale, p = _objectWithoutPropertiesLoose(_this$props2, _excluded);
        return (0, _utils.cloneElement)(children, _objectSpread(_objectSpread({}, p), {}, {
          className: (className ? className + " " : "") + "react-resizable",
          children: [].concat(children.props.children, resizeHandles.map(function(handleAxis) {
            var _this3$handleRefs$han;
            var ref = (_this3$handleRefs$han = _this3.handleRefs[handleAxis]) != null ? _this3$handleRefs$han : _this3.handleRefs[handleAxis] = React.createRef();
            return React.createElement(_reactDraggable.DraggableCore, _extends({}, draggableOpts, {
              nodeRef: ref,
              key: "resizableHandle-" + handleAxis,
              onStop: _this3.resizeHandler("onResizeStop", handleAxis),
              onStart: _this3.resizeHandler("onResizeStart", handleAxis),
              onDrag: _this3.resizeHandler("onResize", handleAxis)
            }), _this3.renderResizeHandle(handleAxis, ref));
          }))
        }));
      };
      return Resizable2;
    }(React.Component);
    exports.default = Resizable;
    Resizable.propTypes = _propTypes.resizableProps;
    Resizable.defaultProps = {
      axis: "both",
      handleSize: [20, 20],
      lockAspectRatio: false,
      minConstraints: [20, 20],
      maxConstraints: [Infinity, Infinity],
      resizeHandles: ["se"],
      transformScale: 1
    };
  }
});

// node_modules/react-resizable/build/ResizableBox.js
var require_ResizableBox = __commonJS({
  "node_modules/react-resizable/build/ResizableBox.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.default = void 0;
    var React = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _Resizable = _interopRequireDefault(require_Resizable());
    var _propTypes2 = require_propTypes();
    var _excluded = ["handle", "handleSize", "onResize", "onResizeStart", "onResizeStop", "draggableOpts", "minConstraints", "maxConstraints", "lockAspectRatio", "axis", "width", "height", "resizeHandles", "style", "transformScale"];
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
      return target;
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var ResizableBox = function(_React$Component) {
      _inheritsLoose(ResizableBox2, _React$Component);
      function ResizableBox2() {
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
        _this.state = {
          width: _this.props.width,
          height: _this.props.height,
          propsWidth: _this.props.width,
          propsHeight: _this.props.height
        };
        _this.onResize = function(e, data) {
          var size = data.size;
          if (_this.props.onResize) {
            e.persist == null ? void 0 : e.persist();
            _this.setState(size, function() {
              return _this.props.onResize && _this.props.onResize(e, data);
            });
          } else {
            _this.setState(size);
          }
        };
        return _this;
      }
      ResizableBox2.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if (state.propsWidth !== props.width || state.propsHeight !== props.height) {
          return {
            width: props.width,
            height: props.height,
            propsWidth: props.width,
            propsHeight: props.height
          };
        }
        return null;
      };
      var _proto = ResizableBox2.prototype;
      _proto.render = function render() {
        var _this$props = this.props, handle = _this$props.handle, handleSize = _this$props.handleSize, onResize = _this$props.onResize, onResizeStart = _this$props.onResizeStart, onResizeStop = _this$props.onResizeStop, draggableOpts = _this$props.draggableOpts, minConstraints = _this$props.minConstraints, maxConstraints = _this$props.maxConstraints, lockAspectRatio = _this$props.lockAspectRatio, axis = _this$props.axis, width = _this$props.width, height = _this$props.height, resizeHandles = _this$props.resizeHandles, style = _this$props.style, transformScale = _this$props.transformScale, props = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return React.createElement(_Resizable.default, {
          axis,
          draggableOpts,
          handle,
          handleSize,
          height: this.state.height,
          lockAspectRatio,
          maxConstraints,
          minConstraints,
          onResizeStart,
          onResize: this.onResize,
          onResizeStop,
          resizeHandles,
          transformScale,
          width: this.state.width
        }, React.createElement("div", _extends({}, props, {
          style: _objectSpread(_objectSpread({}, style), {}, {
            width: this.state.width + "px",
            height: this.state.height + "px"
          })
        })));
      };
      return ResizableBox2;
    }(React.Component);
    exports.default = ResizableBox;
    ResizableBox.propTypes = _objectSpread(_objectSpread({}, _propTypes2.resizableProps), {}, {
      children: _propTypes.default.element
    });
  }
});

// node_modules/react-resizable/index.js
var require_react_resizable = __commonJS({
  "node_modules/react-resizable/index.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
    };
    module.exports.Resizable = require_Resizable().default;
    module.exports.ResizableBox = require_ResizableBox().default;
  }
});

// node_modules/react-grid-layout/build/ReactGridLayoutPropTypes.js
var require_ReactGridLayoutPropTypes = __commonJS({
  "node_modules/react-grid-layout/build/ReactGridLayoutPropTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.resizeHandleType = exports.resizeHandleAxesType = exports.default = void 0;
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _react = _interopRequireDefault(require_react());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var resizeHandleAxesType = exports.resizeHandleAxesType = _propTypes.default.arrayOf(_propTypes.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"]));
    var resizeHandleType = exports.resizeHandleType = _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]);
    var _default = exports.default = {
      //
      // Basic props
      //
      className: _propTypes.default.string,
      style: _propTypes.default.object,
      // This can be set explicitly. If it is not set, it will automatically
      // be set to the container width. Note that resizes will *not* cause this to adjust.
      // If you need that behavior, use WidthProvider.
      width: _propTypes.default.number,
      // If true, the container height swells and contracts to fit contents
      autoSize: _propTypes.default.bool,
      // # of cols.
      cols: _propTypes.default.number,
      // A selector that will not be draggable.
      draggableCancel: _propTypes.default.string,
      // A selector for the draggable handler
      draggableHandle: _propTypes.default.string,
      // Deprecated
      verticalCompact: function(props) {
        if (props.verticalCompact === false && true) {
          console.warn(
            // eslint-disable-line no-console
            '`verticalCompact` on <ReactGridLayout> is deprecated and will be removed soon. Use `compactType`: "horizontal" | "vertical" | null.'
          );
        }
      },
      // Choose vertical or hotizontal compaction
      compactType: _propTypes.default.oneOf(["vertical", "horizontal"]),
      // layout is an array of object with the format:
      // {x: Number, y: Number, w: Number, h: Number, i: String}
      layout: function(props) {
        var layout = props.layout;
        if (layout === void 0) return;
        require_utils().validateLayout(layout, "layout");
      },
      //
      // Grid Dimensions
      //
      // Margin between items [x, y] in px
      margin: _propTypes.default.arrayOf(_propTypes.default.number),
      // Padding inside the container [x, y] in px
      containerPadding: _propTypes.default.arrayOf(_propTypes.default.number),
      // Rows have a static height, but you can change this based on breakpoints if you like
      rowHeight: _propTypes.default.number,
      // Default Infinity, but you can specify a max here if you like.
      // Note that this isn't fully fleshed out and won't error if you specify a layout that
      // extends beyond the row capacity. It will, however, not allow users to drag/resize
      // an item past the barrier. They can push items beyond the barrier, though.
      // Intentionally not documented for this reason.
      maxRows: _propTypes.default.number,
      //
      // Flags
      //
      isBounded: _propTypes.default.bool,
      isDraggable: _propTypes.default.bool,
      isResizable: _propTypes.default.bool,
      // If true, grid can be placed one over the other.
      allowOverlap: _propTypes.default.bool,
      // If true, grid items won't change position when being dragged over.
      preventCollision: _propTypes.default.bool,
      // Use CSS transforms instead of top/left
      useCSSTransforms: _propTypes.default.bool,
      // parent layout transform scale
      transformScale: _propTypes.default.number,
      // If true, an external element can trigger onDrop callback with a specific grid position as a parameter
      isDroppable: _propTypes.default.bool,
      // Resize handle options
      resizeHandles: resizeHandleAxesType,
      resizeHandle: resizeHandleType,
      //
      // Callbacks
      //
      // Callback so you can save the layout. Calls after each drag & resize stops.
      onLayoutChange: _propTypes.default.func,
      // Calls when drag starts. Callback is of the signature (layout, oldItem, newItem, placeholder, e, ?node).
      // All callbacks below have the same signature. 'start' and 'stop' callbacks omit the 'placeholder'.
      onDragStart: _propTypes.default.func,
      // Calls on each drag movement.
      onDrag: _propTypes.default.func,
      // Calls when drag is complete.
      onDragStop: _propTypes.default.func,
      //Calls when resize starts.
      onResizeStart: _propTypes.default.func,
      // Calls when resize movement happens.
      onResize: _propTypes.default.func,
      // Calls when resize is complete.
      onResizeStop: _propTypes.default.func,
      // Calls when some element is dropped.
      onDrop: _propTypes.default.func,
      //
      // Other validations
      //
      droppingItem: _propTypes.default.shape({
        i: _propTypes.default.string.isRequired,
        w: _propTypes.default.number.isRequired,
        h: _propTypes.default.number.isRequired
      }),
      // Children must not have duplicate keys.
      children: function(props, propName) {
        const children = props[propName];
        const keys = {};
        _react.default.Children.forEach(children, function(child) {
          if ((child == null ? void 0 : child.key) == null) return;
          if (keys[child.key]) {
            throw new Error('Duplicate child key "' + child.key + '" found! This will cause problems in ReactGridLayout.');
          }
          keys[child.key] = true;
        });
      },
      // Optional ref for getting a reference for the wrapping div.
      innerRef: _propTypes.default.any
    };
  }
});

// node_modules/react-grid-layout/build/GridItem.js
var require_GridItem = __commonJS({
  "node_modules/react-grid-layout/build/GridItem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _react = _interopRequireDefault(require_react());
    var _reactDom = require_react_dom();
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _reactDraggable = require_cjs();
    var _reactResizable = require_react_resizable();
    var _utils = require_utils();
    var _calculateUtils = require_calculateUtils();
    var _ReactGridLayoutPropTypes = require_ReactGridLayoutPropTypes();
    var _clsx = _interopRequireDefault(require_clsx());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var GridItem = class extends _react.default.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "state", {
          resizing: null,
          dragging: null,
          className: ""
        });
        _defineProperty(this, "elementRef", _react.default.createRef());
        _defineProperty(this, "onDragStart", (e, _ref) => {
          let {
            node
          } = _ref;
          const {
            onDragStart,
            transformScale
          } = this.props;
          if (!onDragStart) return;
          const newPosition = {
            top: 0,
            left: 0
          };
          const {
            offsetParent
          } = node;
          if (!offsetParent) return;
          const parentRect = offsetParent.getBoundingClientRect();
          const clientRect = node.getBoundingClientRect();
          const cLeft = clientRect.left / transformScale;
          const pLeft = parentRect.left / transformScale;
          const cTop = clientRect.top / transformScale;
          const pTop = parentRect.top / transformScale;
          newPosition.left = cLeft - pLeft + offsetParent.scrollLeft;
          newPosition.top = cTop - pTop + offsetParent.scrollTop;
          this.setState({
            dragging: newPosition
          });
          const {
            x,
            y
          } = (0, _calculateUtils.calcXY)(this.getPositionParams(), newPosition.top, newPosition.left, this.props.w, this.props.h);
          return onDragStart.call(this, this.props.i, x, y, {
            e,
            node,
            newPosition
          });
        });
        _defineProperty(this, "onDrag", (e, _ref2, dontFlush) => {
          let {
            node,
            deltaX,
            deltaY
          } = _ref2;
          const {
            onDrag
          } = this.props;
          if (!onDrag) return;
          if (!this.state.dragging) {
            throw new Error("onDrag called before onDragStart.");
          }
          let top = this.state.dragging.top + deltaY;
          let left = this.state.dragging.left + deltaX;
          const {
            isBounded,
            i,
            w,
            h,
            containerWidth
          } = this.props;
          const positionParams = this.getPositionParams();
          if (isBounded) {
            const {
              offsetParent
            } = node;
            if (offsetParent) {
              const {
                margin,
                rowHeight,
                containerPadding
              } = this.props;
              const bottomBoundary = offsetParent.clientHeight - (0, _calculateUtils.calcGridItemWHPx)(h, rowHeight, margin[1]);
              top = (0, _calculateUtils.clamp)(top - containerPadding[1], 0, bottomBoundary);
              const colWidth = (0, _calculateUtils.calcGridColWidth)(positionParams);
              const rightBoundary = containerWidth - (0, _calculateUtils.calcGridItemWHPx)(w, colWidth, margin[0]);
              left = (0, _calculateUtils.clamp)(left - containerPadding[0], 0, rightBoundary);
            }
          }
          const newPosition = {
            top,
            left
          };
          if (dontFlush) {
            this.setState({
              dragging: newPosition
            });
          } else {
            (0, _reactDom.flushSync)(() => {
              this.setState({
                dragging: newPosition
              });
            });
          }
          const {
            x,
            y
          } = (0, _calculateUtils.calcXY)(positionParams, top, left, w, h);
          return onDrag.call(this, i, x, y, {
            e,
            node,
            newPosition
          });
        });
        _defineProperty(this, "onDragStop", (e, _ref3) => {
          let {
            node
          } = _ref3;
          const {
            onDragStop
          } = this.props;
          if (!onDragStop) return;
          if (!this.state.dragging) {
            throw new Error("onDragEnd called before onDragStart.");
          }
          const {
            w,
            h,
            i
          } = this.props;
          const {
            left,
            top
          } = this.state.dragging;
          const newPosition = {
            top,
            left
          };
          this.setState({
            dragging: null
          });
          const {
            x,
            y
          } = (0, _calculateUtils.calcXY)(this.getPositionParams(), top, left, w, h);
          return onDragStop.call(this, i, x, y, {
            e,
            node,
            newPosition
          });
        });
        _defineProperty(this, "onResizeStop", (e, callbackData, position) => this.onResizeHandler(e, callbackData, position, "onResizeStop"));
        _defineProperty(this, "onResizeStart", (e, callbackData, position) => this.onResizeHandler(e, callbackData, position, "onResizeStart"));
        _defineProperty(this, "onResize", (e, callbackData, position) => this.onResizeHandler(e, callbackData, position, "onResize"));
      }
      shouldComponentUpdate(nextProps, nextState) {
        if (this.props.children !== nextProps.children) return true;
        if (this.props.droppingPosition !== nextProps.droppingPosition) return true;
        const oldPosition = (0, _calculateUtils.calcGridItemPosition)(this.getPositionParams(this.props), this.props.x, this.props.y, this.props.w, this.props.h, this.state);
        const newPosition = (0, _calculateUtils.calcGridItemPosition)(this.getPositionParams(nextProps), nextProps.x, nextProps.y, nextProps.w, nextProps.h, nextState);
        return !(0, _utils.fastPositionEqual)(oldPosition, newPosition) || this.props.useCSSTransforms !== nextProps.useCSSTransforms;
      }
      componentDidMount() {
        this.moveDroppingItem({});
      }
      componentDidUpdate(prevProps) {
        this.moveDroppingItem(prevProps);
      }
      // When a droppingPosition is present, this means we should fire a move event, as if we had moved
      // this element by `x, y` pixels.
      moveDroppingItem(prevProps) {
        const {
          droppingPosition
        } = this.props;
        if (!droppingPosition) return;
        const node = this.elementRef.current;
        if (!node) return;
        const prevDroppingPosition = prevProps.droppingPosition || {
          left: 0,
          top: 0
        };
        const {
          dragging
        } = this.state;
        const shouldDrag = dragging && droppingPosition.left !== prevDroppingPosition.left || droppingPosition.top !== prevDroppingPosition.top;
        if (!dragging) {
          this.onDragStart(droppingPosition.e, {
            node,
            deltaX: droppingPosition.left,
            deltaY: droppingPosition.top
          });
        } else if (shouldDrag) {
          const deltaX = droppingPosition.left - dragging.left;
          const deltaY = droppingPosition.top - dragging.top;
          this.onDrag(
            droppingPosition.e,
            {
              node,
              deltaX,
              deltaY
            },
            true
            // dontFLush: avoid flushSync to temper warnings
          );
        }
      }
      getPositionParams() {
        let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.props;
        return {
          cols: props.cols,
          containerPadding: props.containerPadding,
          containerWidth: props.containerWidth,
          margin: props.margin,
          maxRows: props.maxRows,
          rowHeight: props.rowHeight
        };
      }
      /**
       * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
       * well when server rendering, and the only way to do that properly is to use percentage width/left because
       * we don't know exactly what the browser viewport is.
       * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
       * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
       *
       * @param  {Object} pos Position object with width, height, left, top.
       * @return {Object}     Style object.
       */
      createStyle(pos) {
        const {
          usePercentages,
          containerWidth,
          useCSSTransforms
        } = this.props;
        let style;
        if (useCSSTransforms) {
          style = (0, _utils.setTransform)(pos);
        } else {
          style = (0, _utils.setTopLeft)(pos);
          if (usePercentages) {
            style.left = (0, _utils.perc)(pos.left / containerWidth);
            style.width = (0, _utils.perc)(pos.width / containerWidth);
          }
        }
        return style;
      }
      /**
       * Mix a Draggable instance into a child.
       * @param  {Element} child    Child element.
       * @return {Element}          Child wrapped in Draggable.
       */
      mixinDraggable(child, isDraggable) {
        return _react.default.createElement(_reactDraggable.DraggableCore, {
          disabled: !isDraggable,
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop,
          handle: this.props.handle,
          cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : ""),
          scale: this.props.transformScale,
          nodeRef: this.elementRef
        }, child);
      }
      /**
       * Utility function to setup callback handler definitions for
       * similarily structured resize events.
       */
      curryResizeHandler(position, handler) {
        return (e, data) => (
          /*: Function*/
          handler(e, data, position)
        );
      }
      /**
       * Mix a Resizable instance into a child.
       * @param  {Element} child    Child element.
       * @param  {Object} position  Position object (pixel values)
       * @return {Element}          Child wrapped in Resizable.
       */
      mixinResizable(child, position, isResizable) {
        const {
          cols,
          minW,
          minH,
          maxW,
          maxH,
          transformScale,
          resizeHandles,
          resizeHandle
        } = this.props;
        const positionParams = this.getPositionParams();
        const maxWidth = (0, _calculateUtils.calcGridItemPosition)(positionParams, 0, 0, cols, 0).width;
        const mins = (0, _calculateUtils.calcGridItemPosition)(positionParams, 0, 0, minW, minH);
        const maxes = (0, _calculateUtils.calcGridItemPosition)(positionParams, 0, 0, maxW, maxH);
        const minConstraints = [mins.width, mins.height];
        const maxConstraints = [Math.min(maxes.width, maxWidth), Math.min(maxes.height, Infinity)];
        return _react.default.createElement(
          _reactResizable.Resizable,
          {
            draggableOpts: {
              disabled: !isResizable
            },
            className: isResizable ? void 0 : "react-resizable-hide",
            width: position.width,
            height: position.height,
            minConstraints,
            maxConstraints,
            onResizeStop: this.curryResizeHandler(position, this.onResizeStop),
            onResizeStart: this.curryResizeHandler(position, this.onResizeStart),
            onResize: this.curryResizeHandler(position, this.onResize),
            transformScale,
            resizeHandles,
            handle: resizeHandle
          },
          child
        );
      }
      /**
       * Wrapper around resize events to provide more useful data.
       */
      onResizeHandler(e, _ref4, position, handlerName) {
        let {
          node,
          size,
          handle
        } = _ref4;
        const handler = this.props[handlerName];
        if (!handler) return;
        const {
          x,
          y,
          i,
          maxH,
          minH,
          containerWidth
        } = this.props;
        const {
          minW,
          maxW
        } = this.props;
        let updatedSize = size;
        if (node) {
          updatedSize = (0, _utils.resizeItemInDirection)(handle, position, size, containerWidth);
          (0, _reactDom.flushSync)(() => {
            this.setState({
              resizing: handlerName === "onResizeStop" ? null : updatedSize
            });
          });
        }
        let {
          w,
          h
        } = (0, _calculateUtils.calcWH)(this.getPositionParams(), updatedSize.width, updatedSize.height, x, y, handle);
        w = (0, _calculateUtils.clamp)(w, Math.max(minW, 1), maxW);
        h = (0, _calculateUtils.clamp)(h, minH, maxH);
        handler.call(this, i, w, h, {
          e,
          node,
          size: updatedSize,
          handle
        });
      }
      render() {
        const {
          x,
          y,
          w,
          h,
          isDraggable,
          isResizable,
          droppingPosition,
          useCSSTransforms
        } = this.props;
        const pos = (0, _calculateUtils.calcGridItemPosition)(this.getPositionParams(), x, y, w, h, this.state);
        const child = _react.default.Children.only(this.props.children);
        let newChild = _react.default.cloneElement(child, {
          ref: this.elementRef,
          className: (0, _clsx.default)("react-grid-item", child.props.className, this.props.className, {
            static: this.props.static,
            resizing: Boolean(this.state.resizing),
            "react-draggable": isDraggable,
            "react-draggable-dragging": Boolean(this.state.dragging),
            dropping: Boolean(droppingPosition),
            cssTransforms: useCSSTransforms
          }),
          // We can set the width and height on the child, but unfortunately we can't set the position.
          style: {
            ...this.props.style,
            ...child.props.style,
            ...this.createStyle(pos)
          }
        });
        newChild = this.mixinResizable(newChild, pos, isResizable);
        newChild = this.mixinDraggable(newChild, isDraggable);
        return newChild;
      }
    };
    exports.default = GridItem;
    _defineProperty(GridItem, "propTypes", {
      // Children must be only a single element
      children: _propTypes.default.element,
      // General grid attributes
      cols: _propTypes.default.number.isRequired,
      containerWidth: _propTypes.default.number.isRequired,
      rowHeight: _propTypes.default.number.isRequired,
      margin: _propTypes.default.array.isRequired,
      maxRows: _propTypes.default.number.isRequired,
      containerPadding: _propTypes.default.array.isRequired,
      // These are all in grid units
      x: _propTypes.default.number.isRequired,
      y: _propTypes.default.number.isRequired,
      w: _propTypes.default.number.isRequired,
      h: _propTypes.default.number.isRequired,
      // All optional
      minW: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("minWidth not Number");
        if (value > props.w || value > props.maxW) return new Error("minWidth larger than item width/maxWidth");
      },
      maxW: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("maxWidth not Number");
        if (value < props.w || value < props.minW) return new Error("maxWidth smaller than item width/minWidth");
      },
      minH: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("minHeight not Number");
        if (value > props.h || value > props.maxH) return new Error("minHeight larger than item height/maxHeight");
      },
      maxH: function(props, propName) {
        const value = props[propName];
        if (typeof value !== "number") return new Error("maxHeight not Number");
        if (value < props.h || value < props.minH) return new Error("maxHeight smaller than item height/minHeight");
      },
      // ID is nice to have for callbacks
      i: _propTypes.default.string.isRequired,
      // Resize handle options
      resizeHandles: _ReactGridLayoutPropTypes.resizeHandleAxesType,
      resizeHandle: _ReactGridLayoutPropTypes.resizeHandleType,
      // Functions
      onDragStop: _propTypes.default.func,
      onDragStart: _propTypes.default.func,
      onDrag: _propTypes.default.func,
      onResizeStop: _propTypes.default.func,
      onResizeStart: _propTypes.default.func,
      onResize: _propTypes.default.func,
      // Flags
      isDraggable: _propTypes.default.bool.isRequired,
      isResizable: _propTypes.default.bool.isRequired,
      isBounded: _propTypes.default.bool.isRequired,
      static: _propTypes.default.bool,
      // Use CSS transforms instead of top/left
      useCSSTransforms: _propTypes.default.bool.isRequired,
      transformScale: _propTypes.default.number,
      // Others
      className: _propTypes.default.string,
      // Selector for draggable handle
      handle: _propTypes.default.string,
      // Selector for draggable cancel (see react-draggable)
      cancel: _propTypes.default.string,
      // Current position of a dropping element
      droppingPosition: _propTypes.default.shape({
        e: _propTypes.default.object.isRequired,
        left: _propTypes.default.number.isRequired,
        top: _propTypes.default.number.isRequired
      })
    });
    _defineProperty(GridItem, "defaultProps", {
      className: "",
      cancel: "",
      handle: "",
      minH: 1,
      minW: 1,
      maxH: Infinity,
      maxW: Infinity,
      transformScale: 1
    });
  }
});

// node_modules/react-grid-layout/build/ReactGridLayout.js
var require_ReactGridLayout = __commonJS({
  "node_modules/react-grid-layout/build/ReactGridLayout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React = _interopRequireWildcard(require_react());
    var _fastEquals = require_fast_equals();
    var _clsx = _interopRequireDefault(require_clsx());
    var _utils = require_utils();
    var _calculateUtils = require_calculateUtils();
    var _GridItem = _interopRequireDefault(require_GridItem());
    var _ReactGridLayoutPropTypes = _interopRequireDefault(require_ReactGridLayoutPropTypes());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r2 = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(e2) {
        return e2 ? t : r2;
      })(e);
    }
    function _interopRequireWildcard(e, r2) {
      if (!r2 && e && e.__esModule) return e;
      if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
      var t = _getRequireWildcardCache(r2);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n.default = e, t && t.set(e, n), n;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var layoutClassName = "react-grid-layout";
    var isFirefox = false;
    try {
      isFirefox = /firefox/i.test(navigator.userAgent);
    } catch (e) {
    }
    var ReactGridLayout = class extends React.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "state", {
          activeDrag: null,
          layout: (0, _utils.synchronizeLayoutWithChildren)(
            this.props.layout,
            this.props.children,
            this.props.cols,
            // Legacy support for verticalCompact: false
            (0, _utils.compactType)(this.props),
            this.props.allowOverlap
          ),
          mounted: false,
          oldDragItem: null,
          oldLayout: null,
          oldResizeItem: null,
          resizing: false,
          droppingDOMNode: null,
          children: []
        });
        _defineProperty(this, "dragEnterCounter", 0);
        _defineProperty(this, "onDragStart", (i, x, y, _ref) => {
          let {
            e,
            node
          } = _ref;
          const {
            layout
          } = this.state;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            placeholder: true,
            i
          };
          this.setState({
            oldDragItem: (0, _utils.cloneLayoutItem)(l),
            oldLayout: layout,
            activeDrag: placeholder
          });
          return this.props.onDragStart(layout, l, l, null, e, node);
        });
        _defineProperty(this, "onDrag", (i, x, y, _ref2) => {
          let {
            e,
            node
          } = _ref2;
          const {
            oldDragItem
          } = this.state;
          let {
            layout
          } = this.state;
          const {
            cols,
            allowOverlap,
            preventCollision
          } = this.props;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            placeholder: true,
            i
          };
          const isUserAction = true;
          layout = (0, _utils.moveElement)(layout, l, x, y, isUserAction, preventCollision, (0, _utils.compactType)(this.props), cols, allowOverlap);
          this.props.onDrag(layout, oldDragItem, l, placeholder, e, node);
          this.setState({
            layout: allowOverlap ? layout : (0, _utils.compact)(layout, (0, _utils.compactType)(this.props), cols),
            activeDrag: placeholder
          });
        });
        _defineProperty(this, "onDragStop", (i, x, y, _ref3) => {
          let {
            e,
            node
          } = _ref3;
          if (!this.state.activeDrag) return;
          const {
            oldDragItem
          } = this.state;
          let {
            layout
          } = this.state;
          const {
            cols,
            preventCollision,
            allowOverlap
          } = this.props;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          const isUserAction = true;
          layout = (0, _utils.moveElement)(layout, l, x, y, isUserAction, preventCollision, (0, _utils.compactType)(this.props), cols, allowOverlap);
          const newLayout = allowOverlap ? layout : (0, _utils.compact)(layout, (0, _utils.compactType)(this.props), cols);
          this.props.onDragStop(newLayout, oldDragItem, l, null, e, node);
          const {
            oldLayout
          } = this.state;
          this.setState({
            activeDrag: null,
            layout: newLayout,
            oldDragItem: null,
            oldLayout: null
          });
          this.onLayoutMaybeChanged(newLayout, oldLayout);
        });
        _defineProperty(this, "onResizeStart", (i, w, h, _ref4) => {
          let {
            e,
            node
          } = _ref4;
          const {
            layout
          } = this.state;
          const l = (0, _utils.getLayoutItem)(layout, i);
          if (!l) return;
          this.setState({
            oldResizeItem: (0, _utils.cloneLayoutItem)(l),
            oldLayout: this.state.layout,
            resizing: true
          });
          this.props.onResizeStart(layout, l, l, null, e, node);
        });
        _defineProperty(this, "onResize", (i, w, h, _ref5) => {
          let {
            e,
            node,
            size,
            handle
          } = _ref5;
          const {
            oldResizeItem
          } = this.state;
          const {
            layout
          } = this.state;
          const {
            cols,
            preventCollision,
            allowOverlap
          } = this.props;
          let shouldMoveItem = false;
          let finalLayout;
          let x;
          let y;
          const [newLayout, l] = (0, _utils.withLayoutItem)(layout, i, (l2) => {
            let hasCollisions;
            x = l2.x;
            y = l2.y;
            if (["sw", "w", "nw", "n", "ne"].indexOf(handle) !== -1) {
              if (["sw", "nw", "w"].indexOf(handle) !== -1) {
                x = l2.x + (l2.w - w);
                w = l2.x !== x && x < 0 ? l2.w : w;
                x = x < 0 ? 0 : x;
              }
              if (["ne", "n", "nw"].indexOf(handle) !== -1) {
                y = l2.y + (l2.h - h);
                h = l2.y !== y && y < 0 ? l2.h : h;
                y = y < 0 ? 0 : y;
              }
              shouldMoveItem = true;
            }
            if (preventCollision && !allowOverlap) {
              const collisions = (0, _utils.getAllCollisions)(layout, {
                ...l2,
                w,
                h,
                x,
                y
              }).filter((layoutItem) => layoutItem.i !== l2.i);
              hasCollisions = collisions.length > 0;
              if (hasCollisions) {
                y = l2.y;
                h = l2.h;
                x = l2.x;
                w = l2.w;
                shouldMoveItem = false;
              }
            }
            l2.w = w;
            l2.h = h;
            return l2;
          });
          if (!l) return;
          finalLayout = newLayout;
          if (shouldMoveItem) {
            const isUserAction = true;
            finalLayout = (0, _utils.moveElement)(newLayout, l, x, y, isUserAction, this.props.preventCollision, (0, _utils.compactType)(this.props), cols, allowOverlap);
          }
          const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            static: true,
            i
          };
          this.props.onResize(finalLayout, oldResizeItem, l, placeholder, e, node);
          this.setState({
            layout: allowOverlap ? finalLayout : (0, _utils.compact)(finalLayout, (0, _utils.compactType)(this.props), cols),
            activeDrag: placeholder
          });
        });
        _defineProperty(this, "onResizeStop", (i, w, h, _ref6) => {
          let {
            e,
            node
          } = _ref6;
          const {
            layout,
            oldResizeItem
          } = this.state;
          const {
            cols,
            allowOverlap
          } = this.props;
          const l = (0, _utils.getLayoutItem)(layout, i);
          const newLayout = allowOverlap ? layout : (0, _utils.compact)(layout, (0, _utils.compactType)(this.props), cols);
          this.props.onResizeStop(newLayout, oldResizeItem, l, null, e, node);
          const {
            oldLayout
          } = this.state;
          this.setState({
            activeDrag: null,
            layout: newLayout,
            oldResizeItem: null,
            oldLayout: null,
            resizing: false
          });
          this.onLayoutMaybeChanged(newLayout, oldLayout);
        });
        _defineProperty(this, "onDragOver", (e) => {
          var _a;
          e.preventDefault();
          e.stopPropagation();
          if (isFirefox && // $FlowIgnore can't figure this out
          !((_a = e.nativeEvent.target) == null ? void 0 : _a.classList.contains(layoutClassName))) {
            return false;
          }
          const {
            droppingItem,
            onDropDragOver,
            margin,
            cols,
            rowHeight,
            maxRows,
            width,
            containerPadding,
            transformScale
          } = this.props;
          const onDragOverResult = onDropDragOver == null ? void 0 : onDropDragOver(e);
          if (onDragOverResult === false) {
            if (this.state.droppingDOMNode) {
              this.removeDroppingPlaceholder();
            }
            return false;
          }
          const finalDroppingItem = {
            ...droppingItem,
            ...onDragOverResult
          };
          const {
            layout
          } = this.state;
          const gridRect = e.currentTarget.getBoundingClientRect();
          const layerX = e.clientX - gridRect.left;
          const layerY = e.clientY - gridRect.top;
          const droppingPosition = {
            left: layerX / transformScale,
            top: layerY / transformScale,
            e
          };
          if (!this.state.droppingDOMNode) {
            const positionParams = {
              cols,
              margin,
              maxRows,
              rowHeight,
              containerWidth: width,
              containerPadding: containerPadding || margin
            };
            const calculatedPosition = (0, _calculateUtils.calcXY)(positionParams, layerY, layerX, finalDroppingItem.w, finalDroppingItem.h);
            this.setState({
              droppingDOMNode: React.createElement("div", {
                key: finalDroppingItem.i
              }),
              droppingPosition,
              layout: [...layout, {
                ...finalDroppingItem,
                x: calculatedPosition.x,
                y: calculatedPosition.y,
                static: false,
                isDraggable: true
              }]
            });
          } else if (this.state.droppingPosition) {
            const {
              left,
              top
            } = this.state.droppingPosition;
            const shouldUpdatePosition = left != layerX || top != layerY;
            if (shouldUpdatePosition) {
              this.setState({
                droppingPosition
              });
            }
          }
        });
        _defineProperty(this, "removeDroppingPlaceholder", () => {
          const {
            droppingItem,
            cols
          } = this.props;
          const {
            layout
          } = this.state;
          const newLayout = (0, _utils.compact)(layout.filter((l) => l.i !== droppingItem.i), (0, _utils.compactType)(this.props), cols, this.props.allowOverlap);
          this.setState({
            layout: newLayout,
            droppingDOMNode: null,
            activeDrag: null,
            droppingPosition: void 0
          });
        });
        _defineProperty(this, "onDragLeave", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dragEnterCounter--;
          if (this.dragEnterCounter === 0) {
            this.removeDroppingPlaceholder();
          }
        });
        _defineProperty(this, "onDragEnter", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dragEnterCounter++;
        });
        _defineProperty(this, "onDrop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const {
            droppingItem
          } = this.props;
          const {
            layout
          } = this.state;
          const item = layout.find((l) => l.i === droppingItem.i);
          this.dragEnterCounter = 0;
          this.removeDroppingPlaceholder();
          this.props.onDrop(layout, item, e);
        });
      }
      componentDidMount() {
        this.setState({
          mounted: true
        });
        this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
      }
      static getDerivedStateFromProps(nextProps, prevState) {
        let newLayoutBase;
        if (prevState.activeDrag) {
          return null;
        }
        if (!(0, _fastEquals.deepEqual)(nextProps.layout, prevState.propsLayout) || nextProps.compactType !== prevState.compactType) {
          newLayoutBase = nextProps.layout;
        } else if (!(0, _utils.childrenEqual)(nextProps.children, prevState.children)) {
          newLayoutBase = prevState.layout;
        }
        if (newLayoutBase) {
          const newLayout = (0, _utils.synchronizeLayoutWithChildren)(newLayoutBase, nextProps.children, nextProps.cols, (0, _utils.compactType)(nextProps), nextProps.allowOverlap);
          return {
            layout: newLayout,
            // We need to save these props to state for using
            // getDerivedStateFromProps instead of componentDidMount (in which we would get extra rerender)
            compactType: nextProps.compactType,
            children: nextProps.children,
            propsLayout: nextProps.layout
          };
        }
        return null;
      }
      shouldComponentUpdate(nextProps, nextState) {
        return (
          // NOTE: this is almost always unequal. Therefore the only way to get better performance
          // from SCU is if the user intentionally memoizes children. If they do, and they can
          // handle changes properly, performance will increase.
          this.props.children !== nextProps.children || !(0, _utils.fastRGLPropsEqual)(this.props, nextProps, _fastEquals.deepEqual) || this.state.activeDrag !== nextState.activeDrag || this.state.mounted !== nextState.mounted || this.state.droppingPosition !== nextState.droppingPosition
        );
      }
      componentDidUpdate(prevProps, prevState) {
        if (!this.state.activeDrag) {
          const newLayout = this.state.layout;
          const oldLayout = prevState.layout;
          this.onLayoutMaybeChanged(newLayout, oldLayout);
        }
      }
      /**
       * Calculates a pixel value for the container.
       * @return {String} Container height in pixels.
       */
      containerHeight() {
        if (!this.props.autoSize) return;
        const nbRow = (0, _utils.bottom)(this.state.layout);
        const containerPaddingY = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
        return nbRow * this.props.rowHeight + (nbRow - 1) * this.props.margin[1] + containerPaddingY * 2 + "px";
      }
      onLayoutMaybeChanged(newLayout, oldLayout) {
        if (!oldLayout) oldLayout = this.state.layout;
        if (!(0, _fastEquals.deepEqual)(oldLayout, newLayout)) {
          this.props.onLayoutChange(newLayout);
        }
      }
      /**
       * Create a placeholder object.
       * @return {Element} Placeholder div.
       */
      placeholder() {
        const {
          activeDrag
        } = this.state;
        if (!activeDrag) return null;
        const {
          width,
          cols,
          margin,
          containerPadding,
          rowHeight,
          maxRows,
          useCSSTransforms,
          transformScale
        } = this.props;
        return React.createElement(_GridItem.default, {
          w: activeDrag.w,
          h: activeDrag.h,
          x: activeDrag.x,
          y: activeDrag.y,
          i: activeDrag.i,
          className: `react-grid-placeholder ${this.state.resizing ? "placeholder-resizing" : ""}`,
          containerWidth: width,
          cols,
          margin,
          containerPadding: containerPadding || margin,
          maxRows,
          rowHeight,
          isDraggable: false,
          isResizable: false,
          isBounded: false,
          useCSSTransforms,
          transformScale
        }, React.createElement("div", null));
      }
      /**
       * Given a grid item, set its style attributes & surround in a <Draggable>.
       * @param  {Element} child React element.
       * @return {Element}       Element wrapped in draggable and properly placed.
       */
      processGridItem(child, isDroppingItem) {
        if (!child || !child.key) return;
        const l = (0, _utils.getLayoutItem)(this.state.layout, String(child.key));
        if (!l) return null;
        const {
          width,
          cols,
          margin,
          containerPadding,
          rowHeight,
          maxRows,
          isDraggable,
          isResizable,
          isBounded,
          useCSSTransforms,
          transformScale,
          draggableCancel,
          draggableHandle,
          resizeHandles,
          resizeHandle
        } = this.props;
        const {
          mounted,
          droppingPosition
        } = this.state;
        const draggable = typeof l.isDraggable === "boolean" ? l.isDraggable : !l.static && isDraggable;
        const resizable = typeof l.isResizable === "boolean" ? l.isResizable : !l.static && isResizable;
        const resizeHandlesOptions = l.resizeHandles || resizeHandles;
        const bounded = draggable && isBounded && l.isBounded !== false;
        return React.createElement(_GridItem.default, {
          containerWidth: width,
          cols,
          margin,
          containerPadding: containerPadding || margin,
          maxRows,
          rowHeight,
          cancel: draggableCancel,
          handle: draggableHandle,
          onDragStop: this.onDragStop,
          onDragStart: this.onDragStart,
          onDrag: this.onDrag,
          onResizeStart: this.onResizeStart,
          onResize: this.onResize,
          onResizeStop: this.onResizeStop,
          isDraggable: draggable,
          isResizable: resizable,
          isBounded: bounded,
          useCSSTransforms: useCSSTransforms && mounted,
          usePercentages: !mounted,
          transformScale,
          w: l.w,
          h: l.h,
          x: l.x,
          y: l.y,
          i: l.i,
          minH: l.minH,
          minW: l.minW,
          maxH: l.maxH,
          maxW: l.maxW,
          static: l.static,
          droppingPosition: isDroppingItem ? droppingPosition : void 0,
          resizeHandles: resizeHandlesOptions,
          resizeHandle
        }, child);
      }
      render() {
        const {
          className,
          style,
          isDroppable,
          innerRef
        } = this.props;
        const mergedClassName = (0, _clsx.default)(layoutClassName, className);
        const mergedStyle = {
          height: this.containerHeight(),
          ...style
        };
        return React.createElement("div", {
          ref: innerRef,
          className: mergedClassName,
          style: mergedStyle,
          onDrop: isDroppable ? this.onDrop : _utils.noop,
          onDragLeave: isDroppable ? this.onDragLeave : _utils.noop,
          onDragEnter: isDroppable ? this.onDragEnter : _utils.noop,
          onDragOver: isDroppable ? this.onDragOver : _utils.noop
        }, React.Children.map(this.props.children, (child) => this.processGridItem(child)), isDroppable && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, true), this.placeholder());
      }
    };
    exports.default = ReactGridLayout;
    _defineProperty(ReactGridLayout, "displayName", "ReactGridLayout");
    _defineProperty(ReactGridLayout, "propTypes", _ReactGridLayoutPropTypes.default);
    _defineProperty(ReactGridLayout, "defaultProps", {
      autoSize: true,
      cols: 12,
      className: "",
      style: {},
      draggableHandle: "",
      draggableCancel: "",
      containerPadding: null,
      rowHeight: 150,
      maxRows: Infinity,
      // infinite vertical growth
      layout: [],
      margin: [10, 10],
      isBounded: false,
      isDraggable: true,
      isResizable: true,
      allowOverlap: false,
      isDroppable: false,
      useCSSTransforms: true,
      transformScale: 1,
      verticalCompact: true,
      compactType: "vertical",
      preventCollision: false,
      droppingItem: {
        i: "__dropping-elem__",
        h: 1,
        w: 1
      },
      resizeHandles: ["se"],
      onLayoutChange: _utils.noop,
      onDragStart: _utils.noop,
      onDrag: _utils.noop,
      onDragStop: _utils.noop,
      onResizeStart: _utils.noop,
      onResize: _utils.noop,
      onResizeStop: _utils.noop,
      onDrop: _utils.noop,
      onDropDragOver: _utils.noop
    });
  }
});

// node_modules/react-grid-layout/build/responsiveUtils.js
var require_responsiveUtils = __commonJS({
  "node_modules/react-grid-layout/build/responsiveUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.findOrGenerateResponsiveLayout = findOrGenerateResponsiveLayout;
    exports.getBreakpointFromWidth = getBreakpointFromWidth;
    exports.getColsFromBreakpoint = getColsFromBreakpoint;
    exports.sortBreakpoints = sortBreakpoints;
    var _utils = require_utils();
    function getBreakpointFromWidth(breakpoints, width) {
      const sorted = sortBreakpoints(breakpoints);
      let matching = sorted[0];
      for (let i = 1, len = sorted.length; i < len; i++) {
        const breakpointName = sorted[i];
        if (width > breakpoints[breakpointName]) matching = breakpointName;
      }
      return matching;
    }
    function getColsFromBreakpoint(breakpoint, cols) {
      if (!cols[breakpoint]) {
        throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + breakpoint + " is missing!");
      }
      return cols[breakpoint];
    }
    function findOrGenerateResponsiveLayout(layouts, breakpoints, breakpoint, lastBreakpoint, cols, compactType) {
      if (layouts[breakpoint]) return (0, _utils.cloneLayout)(layouts[breakpoint]);
      let layout = layouts[lastBreakpoint];
      const breakpointsSorted = sortBreakpoints(breakpoints);
      const breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));
      for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
        const b = breakpointsAbove[i];
        if (layouts[b]) {
          layout = layouts[b];
          break;
        }
      }
      layout = (0, _utils.cloneLayout)(layout || []);
      return (0, _utils.compact)((0, _utils.correctBounds)(layout, {
        cols
      }), compactType, cols);
    }
    function sortBreakpoints(breakpoints) {
      const keys = Object.keys(breakpoints);
      return keys.sort(function(a, b) {
        return breakpoints[a] - breakpoints[b];
      });
    }
  }
});

// node_modules/react-grid-layout/build/ResponsiveReactGridLayout.js
var require_ResponsiveReactGridLayout = __commonJS({
  "node_modules/react-grid-layout/build/ResponsiveReactGridLayout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var React = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _fastEquals = require_fast_equals();
    var _utils = require_utils();
    var _responsiveUtils = require_responsiveUtils();
    var _ReactGridLayout = _interopRequireDefault(require_ReactGridLayout());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r2 = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(e2) {
        return e2 ? t : r2;
      })(e);
    }
    function _interopRequireWildcard(e, r2) {
      if (!r2 && e && e.__esModule) return e;
      if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
      var t = _getRequireWildcardCache(r2);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n.default = e, t && t.set(e, n), n;
    }
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var type = (obj) => Object.prototype.toString.call(obj);
    function getIndentationValue(param, breakpoint) {
      if (param == null) return null;
      return Array.isArray(param) ? param : param[breakpoint];
    }
    var ResponsiveReactGridLayout = class extends React.Component {
      constructor() {
        super(...arguments);
        _defineProperty(this, "state", this.generateInitialState());
        _defineProperty(this, "onLayoutChange", (layout) => {
          this.props.onLayoutChange(layout, {
            ...this.props.layouts,
            [this.state.breakpoint]: layout
          });
        });
      }
      generateInitialState() {
        const {
          width,
          breakpoints,
          layouts,
          cols
        } = this.props;
        const breakpoint = (0, _responsiveUtils.getBreakpointFromWidth)(breakpoints, width);
        const colNo = (0, _responsiveUtils.getColsFromBreakpoint)(breakpoint, cols);
        const compactType = this.props.verticalCompact === false ? null : this.props.compactType;
        const initialLayout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(layouts, breakpoints, breakpoint, breakpoint, colNo, compactType);
        return {
          layout: initialLayout,
          breakpoint,
          cols: colNo
        };
      }
      static getDerivedStateFromProps(nextProps, prevState) {
        if (!(0, _fastEquals.deepEqual)(nextProps.layouts, prevState.layouts)) {
          const {
            breakpoint,
            cols
          } = prevState;
          const newLayout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(nextProps.layouts, nextProps.breakpoints, breakpoint, breakpoint, cols, nextProps.compactType);
          return {
            layout: newLayout,
            layouts: nextProps.layouts
          };
        }
        return null;
      }
      componentDidUpdate(prevProps) {
        if (this.props.width != prevProps.width || this.props.breakpoint !== prevProps.breakpoint || !(0, _fastEquals.deepEqual)(this.props.breakpoints, prevProps.breakpoints) || !(0, _fastEquals.deepEqual)(this.props.cols, prevProps.cols)) {
          this.onWidthChange(prevProps);
        }
      }
      /**
       * When the width changes work through breakpoints and reset state with the new width & breakpoint.
       * Width changes are necessary to figure out the widget widths.
       */
      onWidthChange(prevProps) {
        const {
          breakpoints,
          cols,
          layouts,
          compactType
        } = this.props;
        const newBreakpoint = this.props.breakpoint || (0, _responsiveUtils.getBreakpointFromWidth)(this.props.breakpoints, this.props.width);
        const lastBreakpoint = this.state.breakpoint;
        const newCols = (0, _responsiveUtils.getColsFromBreakpoint)(newBreakpoint, cols);
        const newLayouts = {
          ...layouts
        };
        if (lastBreakpoint !== newBreakpoint || prevProps.breakpoints !== breakpoints || prevProps.cols !== cols) {
          if (!(lastBreakpoint in newLayouts)) newLayouts[lastBreakpoint] = (0, _utils.cloneLayout)(this.state.layout);
          let layout = (0, _responsiveUtils.findOrGenerateResponsiveLayout)(newLayouts, breakpoints, newBreakpoint, lastBreakpoint, newCols, compactType);
          layout = (0, _utils.synchronizeLayoutWithChildren)(layout, this.props.children, newCols, compactType, this.props.allowOverlap);
          newLayouts[newBreakpoint] = layout;
          this.props.onBreakpointChange(newBreakpoint, newCols);
          this.props.onLayoutChange(layout, newLayouts);
          this.setState({
            breakpoint: newBreakpoint,
            layout,
            cols: newCols
          });
        }
        const margin = getIndentationValue(this.props.margin, newBreakpoint);
        const containerPadding = getIndentationValue(this.props.containerPadding, newBreakpoint);
        this.props.onWidthChange(this.props.width, margin, newCols, containerPadding);
      }
      render() {
        const {
          breakpoint,
          breakpoints,
          cols,
          layouts,
          margin,
          containerPadding,
          onBreakpointChange,
          onLayoutChange,
          onWidthChange,
          ...other
        } = this.props;
        return React.createElement(_ReactGridLayout.default, _extends({}, other, {
          // $FlowIgnore should allow nullable here due to DefaultProps
          margin: getIndentationValue(margin, this.state.breakpoint),
          containerPadding: getIndentationValue(containerPadding, this.state.breakpoint),
          onLayoutChange: this.onLayoutChange,
          layout: this.state.layout,
          cols: this.state.cols
        }));
      }
    };
    exports.default = ResponsiveReactGridLayout;
    _defineProperty(ResponsiveReactGridLayout, "propTypes", {
      //
      // Basic props
      //
      // Optional, but if you are managing width yourself you may want to set the breakpoint
      // yourself as well.
      breakpoint: _propTypes.default.string,
      // {name: pxVal}, e.g. {lg: 1200, md: 996, sm: 768, xs: 480}
      breakpoints: _propTypes.default.object,
      allowOverlap: _propTypes.default.bool,
      // # of cols. This is a breakpoint -> cols map
      cols: _propTypes.default.object,
      // # of margin. This is a breakpoint -> margin map
      // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
      // Margin between items [x, y] in px
      // e.g. [10, 10]
      margin: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
      // # of containerPadding. This is a breakpoint -> containerPadding map
      // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
      // Padding inside the container [x, y] in px
      // e.g. [10, 10]
      containerPadding: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
      // layouts is an object mapping breakpoints to layouts.
      // e.g. {lg: Layout, md: Layout, ...}
      layouts(props, propName) {
        if (type(props[propName]) !== "[object Object]") {
          throw new Error("Layout property must be an object. Received: " + type(props[propName]));
        }
        Object.keys(props[propName]).forEach((key) => {
          if (!(key in props.breakpoints)) {
            throw new Error("Each key in layouts must align with a key in breakpoints.");
          }
          (0, _utils.validateLayout)(props.layouts[key], "layouts." + key);
        });
      },
      // The width of this component.
      // Required in this propTypes stanza because generateInitialState() will fail without it.
      width: _propTypes.default.number.isRequired,
      //
      // Callbacks
      //
      // Calls back with breakpoint and new # cols
      onBreakpointChange: _propTypes.default.func,
      // Callback so you can save the layout.
      // Calls back with (currentLayout, allLayouts). allLayouts are keyed by breakpoint.
      onLayoutChange: _propTypes.default.func,
      // Calls back with (containerWidth, margin, cols, containerPadding)
      onWidthChange: _propTypes.default.func
    });
    _defineProperty(ResponsiveReactGridLayout, "defaultProps", {
      breakpoints: {
        lg: 1200,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0
      },
      cols: {
        lg: 12,
        md: 10,
        sm: 6,
        xs: 4,
        xxs: 2
      },
      containerPadding: {
        lg: null,
        md: null,
        sm: null,
        xs: null,
        xxs: null
      },
      layouts: {},
      margin: [10, 10],
      allowOverlap: false,
      onBreakpointChange: _utils.noop,
      onLayoutChange: _utils.noop,
      onWidthChange: _utils.noop
    });
  }
});

// node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
var ResizeObserver_es_exports = {};
__export(ResizeObserver_es_exports, {
  default: () => ResizeObserver_es_default
});
function throttle(callback, delay) {
  var leadingCall = false, trailingCall = false, lastCallTime = 0;
  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }
    if (trailingCall) {
      proxy();
    }
  }
  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  function proxy() {
    var timeStamp = Date.now();
    if (leadingCall) {
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      }
      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }
    lastCallTime = timeStamp;
  }
  return proxy;
}
function toFloat(value) {
  return parseFloat(value) || 0;
}
function getBordersSize(styles) {
  var positions = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }
  return positions.reduce(function(size, position) {
    var value = styles["border-" + position + "-width"];
    return size + toFloat(value);
  }, 0);
}
function getPaddings(styles) {
  var positions = ["top", "right", "bottom", "left"];
  var paddings = {};
  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles["padding-" + position];
    paddings[position] = toFloat(value);
  }
  return paddings;
}
function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
function getHTMLElementContentRect(target) {
  var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }
  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom;
  var width = toFloat(styles.width), height = toFloat(styles.height);
  if (styles.boxSizing === "border-box") {
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, "left", "right") + horizPad;
    }
    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, "top", "bottom") + vertPad;
    }
  }
  if (!isDocumentElement(target)) {
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight;
    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }
    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }
  return createRectInit(paddings.left, paddings.top, width, height);
}
function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }
  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }
  return getHTMLElementContentRect(target);
}
function createReadOnlyRect(_a) {
  var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
  var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype);
  defineConfigurable(rect, {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
function createRectInit(x, y, width, height) {
  return { x, y, width, height };
}
var MapShim, isBrowser, global$1, requestAnimationFrame$1, trailingTimeout, REFRESH_DELAY, transitionKeys, mutationObserverSupported, ResizeObserverController, defineConfigurable, getWindowOf, emptyRect, isSVGGraphicsElement, ResizeObservation, ResizeObserverEntry, ResizeObserverSPI, observers, ResizeObserver, index, ResizeObserver_es_default;
var init_ResizeObserver_es = __esm({
  "node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js"() {
    MapShim = function() {
      if (typeof Map !== "undefined") {
        return Map;
      }
      function getIndex(arr, key) {
        var result = -1;
        arr.some(function(entry, index2) {
          if (entry[0] === key) {
            result = index2;
            return true;
          }
          return false;
        });
        return result;
      }
      return (
        /** @class */
        function() {
          function class_1() {
            this.__entries__ = [];
          }
          Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function() {
              return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
          });
          class_1.prototype.get = function(key) {
            var index2 = getIndex(this.__entries__, key);
            var entry = this.__entries__[index2];
            return entry && entry[1];
          };
          class_1.prototype.set = function(key, value) {
            var index2 = getIndex(this.__entries__, key);
            if (~index2) {
              this.__entries__[index2][1] = value;
            } else {
              this.__entries__.push([key, value]);
            }
          };
          class_1.prototype.delete = function(key) {
            var entries = this.__entries__;
            var index2 = getIndex(entries, key);
            if (~index2) {
              entries.splice(index2, 1);
            }
          };
          class_1.prototype.has = function(key) {
            return !!~getIndex(this.__entries__, key);
          };
          class_1.prototype.clear = function() {
            this.__entries__.splice(0);
          };
          class_1.prototype.forEach = function(callback, ctx) {
            if (ctx === void 0) {
              ctx = null;
            }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
              var entry = _a[_i];
              callback.call(ctx, entry[1], entry[0]);
            }
          };
          return class_1;
        }()
      );
    }();
    isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
    global$1 = function() {
      if (typeof global !== "undefined" && global.Math === Math) {
        return global;
      }
      if (typeof self !== "undefined" && self.Math === Math) {
        return self;
      }
      if (typeof window !== "undefined" && window.Math === Math) {
        return window;
      }
      return Function("return this")();
    }();
    requestAnimationFrame$1 = function() {
      if (typeof requestAnimationFrame === "function") {
        return requestAnimationFrame.bind(global$1);
      }
      return function(callback) {
        return setTimeout(function() {
          return callback(Date.now());
        }, 1e3 / 60);
      };
    }();
    trailingTimeout = 2;
    REFRESH_DELAY = 20;
    transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
    mutationObserverSupported = typeof MutationObserver !== "undefined";
    ResizeObserverController = /** @class */
    function() {
      function ResizeObserverController2() {
        this.connected_ = false;
        this.mutationEventsAdded_ = false;
        this.mutationsObserver_ = null;
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
      }
      ResizeObserverController2.prototype.addObserver = function(observer) {
        if (!~this.observers_.indexOf(observer)) {
          this.observers_.push(observer);
        }
        if (!this.connected_) {
          this.connect_();
        }
      };
      ResizeObserverController2.prototype.removeObserver = function(observer) {
        var observers2 = this.observers_;
        var index2 = observers2.indexOf(observer);
        if (~index2) {
          observers2.splice(index2, 1);
        }
        if (!observers2.length && this.connected_) {
          this.disconnect_();
        }
      };
      ResizeObserverController2.prototype.refresh = function() {
        var changesDetected = this.updateObservers_();
        if (changesDetected) {
          this.refresh();
        }
      };
      ResizeObserverController2.prototype.updateObservers_ = function() {
        var activeObservers = this.observers_.filter(function(observer) {
          return observer.gatherActive(), observer.hasActive();
        });
        activeObservers.forEach(function(observer) {
          return observer.broadcastActive();
        });
        return activeObservers.length > 0;
      };
      ResizeObserverController2.prototype.connect_ = function() {
        if (!isBrowser || this.connected_) {
          return;
        }
        document.addEventListener("transitionend", this.onTransitionEnd_);
        window.addEventListener("resize", this.refresh);
        if (mutationObserverSupported) {
          this.mutationsObserver_ = new MutationObserver(this.refresh);
          this.mutationsObserver_.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        } else {
          document.addEventListener("DOMSubtreeModified", this.refresh);
          this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
      };
      ResizeObserverController2.prototype.disconnect_ = function() {
        if (!isBrowser || !this.connected_) {
          return;
        }
        document.removeEventListener("transitionend", this.onTransitionEnd_);
        window.removeEventListener("resize", this.refresh);
        if (this.mutationsObserver_) {
          this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
          document.removeEventListener("DOMSubtreeModified", this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
      };
      ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
        var isReflowProperty = transitionKeys.some(function(key) {
          return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
          this.refresh();
        }
      };
      ResizeObserverController2.getInstance = function() {
        if (!this.instance_) {
          this.instance_ = new ResizeObserverController2();
        }
        return this.instance_;
      };
      ResizeObserverController2.instance_ = null;
      return ResizeObserverController2;
    }();
    defineConfigurable = function(target, props) {
      for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
          value: props[key],
          enumerable: false,
          writable: false,
          configurable: true
        });
      }
      return target;
    };
    getWindowOf = function(target) {
      var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
      return ownerGlobal || global$1;
    };
    emptyRect = createRectInit(0, 0, 0, 0);
    isSVGGraphicsElement = function() {
      if (typeof SVGGraphicsElement !== "undefined") {
        return function(target) {
          return target instanceof getWindowOf(target).SVGGraphicsElement;
        };
      }
      return function(target) {
        return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
      };
    }();
    ResizeObservation = /** @class */
    function() {
      function ResizeObservation2(target) {
        this.broadcastWidth = 0;
        this.broadcastHeight = 0;
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
      }
      ResizeObservation2.prototype.isActive = function() {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
      };
      ResizeObservation2.prototype.broadcastRect = function() {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
      };
      return ResizeObservation2;
    }();
    ResizeObserverEntry = /** @class */
    /* @__PURE__ */ function() {
      function ResizeObserverEntry2(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        defineConfigurable(this, { target, contentRect });
      }
      return ResizeObserverEntry2;
    }();
    ResizeObserverSPI = /** @class */
    function() {
      function ResizeObserverSPI2(callback, controller, callbackCtx) {
        this.activeObservations_ = [];
        this.observations_ = new MapShim();
        if (typeof callback !== "function") {
          throw new TypeError("The callback provided as parameter 1 is not a function.");
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
      }
      ResizeObserverSPI2.prototype.observe = function(target) {
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        if (typeof Element === "undefined" || !(Element instanceof Object)) {
          return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
          throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        if (observations.has(target)) {
          return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        this.controller_.refresh();
      };
      ResizeObserverSPI2.prototype.unobserve = function(target) {
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        if (typeof Element === "undefined" || !(Element instanceof Object)) {
          return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
          throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        if (!observations.has(target)) {
          return;
        }
        observations.delete(target);
        if (!observations.size) {
          this.controller_.removeObserver(this);
        }
      };
      ResizeObserverSPI2.prototype.disconnect = function() {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
      };
      ResizeObserverSPI2.prototype.gatherActive = function() {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function(observation) {
          if (observation.isActive()) {
            _this.activeObservations_.push(observation);
          }
        });
      };
      ResizeObserverSPI2.prototype.broadcastActive = function() {
        if (!this.hasActive()) {
          return;
        }
        var ctx = this.callbackCtx_;
        var entries = this.activeObservations_.map(function(observation) {
          return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
      };
      ResizeObserverSPI2.prototype.clearActive = function() {
        this.activeObservations_.splice(0);
      };
      ResizeObserverSPI2.prototype.hasActive = function() {
        return this.activeObservations_.length > 0;
      };
      return ResizeObserverSPI2;
    }();
    observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
    ResizeObserver = /** @class */
    /* @__PURE__ */ function() {
      function ResizeObserver2(callback) {
        if (!(this instanceof ResizeObserver2)) {
          throw new TypeError("Cannot call a class as a function.");
        }
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
      }
      return ResizeObserver2;
    }();
    [
      "observe",
      "unobserve",
      "disconnect"
    ].forEach(function(method) {
      ResizeObserver.prototype[method] = function() {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
      };
    });
    index = function() {
      if (typeof global$1.ResizeObserver !== "undefined") {
        return global$1.ResizeObserver;
      }
      return ResizeObserver;
    }();
    ResizeObserver_es_default = index;
  }
});

// node_modules/react-grid-layout/build/components/WidthProvider.js
var require_WidthProvider = __commonJS({
  "node_modules/react-grid-layout/build/components/WidthProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = WidthProvideRGL;
    var React = _interopRequireWildcard(require_react());
    var _propTypes = _interopRequireDefault(require_prop_types());
    var _resizeObserverPolyfill = _interopRequireDefault((init_ResizeObserver_es(), __toCommonJS(ResizeObserver_es_exports)));
    var _clsx = _interopRequireDefault(require_clsx());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap) return null;
      var r2 = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(e2) {
        return e2 ? t : r2;
      })(e);
    }
    function _interopRequireWildcard(e, r2) {
      if (!r2 && e && e.__esModule) return e;
      if (null === e || "object" != typeof e && "function" != typeof e) return { default: e };
      var t = _getRequireWildcardCache(r2);
      if (t && t.has(e)) return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
        var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
        i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
      }
      return n.default = e, t && t.set(e, n), n;
    }
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var layoutClassName = "react-grid-layout";
    function WidthProvideRGL(ComposedComponent) {
      var _class;
      return _class = class WidthProvider extends React.Component {
        constructor() {
          super(...arguments);
          _defineProperty(this, "state", {
            width: 1280
          });
          _defineProperty(this, "elementRef", React.createRef());
          _defineProperty(this, "mounted", false);
          _defineProperty(this, "resizeObserver", void 0);
        }
        componentDidMount() {
          this.mounted = true;
          this.resizeObserver = new _resizeObserverPolyfill.default((entries) => {
            const node2 = this.elementRef.current;
            if (node2 instanceof HTMLElement) {
              const width = entries[0].contentRect.width;
              this.setState({
                width
              });
            }
          });
          const node = this.elementRef.current;
          if (node instanceof HTMLElement) {
            this.resizeObserver.observe(node);
          }
        }
        componentWillUnmount() {
          this.mounted = false;
          const node = this.elementRef.current;
          if (node instanceof HTMLElement) {
            this.resizeObserver.unobserve(node);
          }
          this.resizeObserver.disconnect();
        }
        render() {
          const {
            measureBeforeMount,
            ...rest
          } = this.props;
          if (measureBeforeMount && !this.mounted) {
            return React.createElement("div", {
              className: (0, _clsx.default)(this.props.className, layoutClassName),
              style: this.props.style,
              ref: this.elementRef
            });
          }
          return React.createElement(ComposedComponent, _extends({
            innerRef: this.elementRef
          }, rest, this.state));
        }
      }, _defineProperty(_class, "defaultProps", {
        measureBeforeMount: false
      }), _defineProperty(_class, "propTypes", {
        // If true, will not render children until mounted. Useful for getting the exact width before
        // rendering, to prevent any unsightly resizing.
        measureBeforeMount: _propTypes.default.bool
      }), _class;
    }
  }
});

// node_modules/react-grid-layout/index.js
var require_react_grid_layout = __commonJS({
  "node_modules/react-grid-layout/index.js"(exports, module) {
    module.exports = require_ReactGridLayout().default;
    module.exports.utils = require_utils();
    module.exports.calculateUtils = require_calculateUtils();
    module.exports.Responsive = require_ResponsiveReactGridLayout().default;
    module.exports.Responsive.utils = require_responsiveUtils();
    module.exports.WidthProvider = require_WidthProvider().default;
  }
});
export default require_react_grid_layout();
/*! Bundled license information:

react-is/cjs/react-is.development.js:
  (** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

object-assign/index.js:
  (*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  *)
*/
//# sourceMappingURL=react-grid-layout.js.map
