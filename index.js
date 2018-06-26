(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['dependency'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('dependency'));
  } else {
    // Browser globals (root is window)
    root.dragger = factory(root.dependency);
  }
})(this, function(dependency) {
  // Use dependency in some fashion.
  return (function() {
    let emptyList = [];
    let draggables = [];
    let dragging = null;
    let draggerClass;
    let emptyClass;

    function onDragStart() {
      dragging = this;
      this.className += ' hold';
      setTimeout(() => (this.className = 'invisible'), 0);
    }
    function onDragEnd() {
      this.className = draggerClass;
    }

    function dragOver(e) {
      e.preventDefault();
    }
    function dragEnter(e) {
      e.preventDefault();
      this.className += ' hovered';
    }
    function dragLeave() {
      this.className = emptyClass;
    }
    function dragDrop() {
      this.className = emptyClass;
      this.append(dragging);
      dragging = null;
    }

    function init(options) {
      draggerClass = options.drag.substring(1);
      emptyClass = options.empty.substring(1);
      emptyList = document.querySelectorAll(options.empty);
      draggables = document.querySelectorAll(options.drag);
      for (const empty of emptyList) {
        empty.addEventListener('dragover', dragOver);
        empty.addEventListener('dragenter', dragEnter);
        empty.addEventListener('dragleave', dragLeave);
        empty.addEventListener('drop', dragDrop);
      }
      for (const el of draggables) {
        el.setAttribute('draggable', 'true');
        el.addEventListener('dragstart', onDragStart);
        el.addEventListener('dragend', onDragEnd);
      }
    }
    return function(options) {
      init(options);

      return {
        reset: newOptions => {
          init(newOptions || options);
        },
      };
    };
  })();
});
