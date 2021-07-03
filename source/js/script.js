'use strict';
// maybe
(function () {
  function Maybe(operand) {
    this.operand = operand;
  }

  Maybe.prototype.map = function (operator) {
    if (this.operand && operator) {
      return new Maybe(operator(this.operand));
    } else {
      return new Maybe(null);
    }
  };

  window.monad = {
    Maybe: Maybe
  };
})();

// type checking
(function () {
  function checkType(value) {
    var regex = /^\[object (\S+?)\]$/;
    var matches = Object.prototype.toString.call(value).match(regex) || [];

    return (matches[1] || 'undefined').toLowerCase();
  }

  window.typeChecking = {
    checkType: checkType
  };
})();

// listeners managing
(function () {
  function manageListeners(elements, settings) {
    var isElementsArray = Array.isArray(elements);
    var isSettingsObject = window.typeChecking.checkType(settings) === 'object';

    if (!isElementsArray || !isSettingsObject) {
      return;
    }

    var handlersArray = Object.entries(settings);

    function callback(entries) {
      handlersArray.forEach(function (handlers) {
        var eventName = typeof handlers[0] === 'string'
          ? handlers[0]
          : String(handlers[0]);

        var eventFunction = typeof handlers[1] === 'function'
          ? handlers[1]
          : null;

        if (!eventName || eventFunction === null) {
          return;
        }
      });

      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          handlersArray.forEach(function (handlers) {
            entry.target.removeEventListener(handlers[0], handlers[1]);
          });
          return;
        }

        handlersArray.forEach(function (handlers) {
          entry.target.addEventListener(handlers[0], handlers[1]);
        });
      });
    }

    var observer = new IntersectionObserver(callback);
    elements.forEach(function (it) {
      observer.observe(it);
    });
  }

  window.listenersManaging = {
    manageListeners: manageListeners
  };
})();

// accordeon
(function () {
  var UNITS = 'px';
  var TABLET_WIDTH = 768;

  var viewPort = document.documentElement.clientWidth;
  var children;
  var isChildrenHidden = false;
  var scrollHeightKeeping = {};

  function callback() {
    viewPort = document.documentElement.clientWidth;
    hideContent();
  }

  document.addEventListener('DOMContentLoaded', callback);
  window.addEventListener('resize', callback);

  var Maybe = window.monad.Maybe;
  var accordeon = new Maybe(document.querySelector('.accordeon'));
  var contents = accordeon.map(function (element) {
    return Array.from(element.querySelectorAll('.accordeon__content'));
  });

  if (contents.operand.length) {
    accordeon = accordeon.operand;
    contents = contents.operand;

    contents.forEach(function (it) {
      if (viewPort < TABLET_WIDTH) {
        it.style.height = null;
      }
    });

    if ('IntersectionObserver' in window) {
      window.listenersManaging.manageListeners([accordeon], {'click': onAccordeonClick});
    } else {
      accordeon.addEventListener('click', onAccordeonClick);
    }
  }

  function hideContent() {
    contents.forEach(function (it) {
      if (viewPort < TABLET_WIDTH) {
        scrollHeightKeeping[it.id] = {
          scrollHeight: it.scrollHeight
        };

        it.classList.add('accordeon__content--js');

        children = Array.from(it.children);
        hideChildren(children);
        isChildrenHidden = true;
      }
    });
  }

  function hideChildren(array) {
    array.forEach(function (it) {
      it.classList.add('hidden-entity');
    });
  }

  function showChildren(array) {
    array.forEach(function (it) {
      it.classList.remove('hidden-entity');
    });
  }

  function onAccordeonClick(evt) {
    if (evt.target.matches('.accordeon__btn')) {
      contents.forEach(function (it) {
        if (it === evt.target.nextElementSibling) {
          if (it.style.maxHeight) {
            it.style.maxHeight = null;
          } else {
            if (isChildrenHidden) {
              children = Array.from(it.children);
              showChildren(children);
            }

            it.style.maxHeight = scrollHeightKeeping[it.id].scrollHeight + UNITS;
            it.classList.add('opened');
          }

          var openedContents = accordeon.querySelectorAll('.opened')
            ? Array.from(accordeon.querySelectorAll('.opened'))
            : null;

          if (openedContents.length > 1) {
            openedContents.forEach(function (element) {
              if (!Object.is(element, it)) {
                element.style.maxHeight = null;
              }
            });
          }
        }
      });

      evt.target.classList.toggle('accordeon__btn--active');
    }
  }
})();
