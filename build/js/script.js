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

  document.addEventListener('DOMContentLoaded', callback);

  function callback() {
    viewPort = document.documentElement.clientWidth;
    hideContent();
  }

  var onWindowResize = makeHandler();
  window.addEventListener('resize', onWindowResize);

  function makeHandler() {
    var flag = false;

    return function () {
      viewPort = document.documentElement.clientWidth;

      if (
        (viewPort > TABLET_WIDTH || viewPort === TABLET_WIDTH)
        && flag
      ) {
        flag = false;
      }

      if (
        viewPort < TABLET_WIDTH
        && !flag
      ) {
        hideContent();
        flag = true;
      }
    };
  }

  var Maybe = window.monad.Maybe;
  var accordeon = new Maybe(document.querySelector('.accordeon'));
  var buttons = accordeon.map(function (element) {
    return Array.from(element.querySelectorAll('.accordeon__btn'));
  });
  var contents = accordeon.map(function (element) {
    return Array.from(element.querySelectorAll('.accordeon__content'));
  });

  if (buttons.operand.length && contents.operand.length) {
    accordeon = accordeon.operand;
    buttons = buttons.operand;
    contents = contents.operand;

    buttons.forEach(function (it) {
      it.classList.add('accordeon__btn--js');
    });

    contents.forEach(function (it) {
      if (viewPort < TABLET_WIDTH) {
        it.style.maxHeight = null;
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

                var button = element.previousElementSibling
                  ? element.previousElementSibling
                  : null;

                if (button) {
                  if (button.classList.contains('accordeon__btn--active')) {
                    button.classList.remove('accordeon__btn--active');
                  }
                }
              }
            });
          }
        }
      });

      evt.target.classList.toggle('accordeon__btn--active');
    }
  }
})();

// Скролл
(function () {
  var Maybe = window.monad.Maybe;
  var consultationAnchor = new Maybe(document.querySelector('a[href="#consultation"]'));
  var advantagesAnchor = new Maybe(document.querySelector('a[href="#advantages"]'));

  if (consultationAnchor.operand) {
    consultationAnchor = consultationAnchor.operand;
    consultationAnchor.addEventListener('click', onAnchorClick);
  }

  if (advantagesAnchor.operand) {
    advantagesAnchor = advantagesAnchor.operand;
    advantagesAnchor.addEventListener('click', onAnchorClick);
  }

  function onAnchorClick(evt) {
    evt.preventDefault();
    letItScroll(evt);
  }

  function letItScroll(evt) {
    var aimId = evt.target.getAttribute('href');
    var aim = document.querySelector(aimId);

    if (aim) {
      aim.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
})();

(function () {
  var START_VALUE = '+7(';

  if (window.localStorage) {
    var elements = document.querySelectorAll('[name]')
      ? Array.from(document.querySelectorAll('[name]'))
      : null;

    if (elements.length) {
      elements.forEach(function (element) {
        var name = element.getAttribute('name');
        element.value = localStorage.getItem(name) || element.value;
        element.onkeyup = function () {
          localStorage.setItem(name, element.value);
        };
      });
    }
  }

  var phones = document.querySelectorAll('input[type="tel"]')
    ? Array.from(document.querySelectorAll('input[type="tel"]'))
    : null;

  if (phones.length) {
    phones.forEach(function (it) {
      it.addEventListener('focus', onPhoneFocus);
      it.addEventListener('input', onPhoneInput);
    });
  }

  function onPhoneFocus(evt) {
    if (evt.target.matches('input[type="tel"]')) {
      var input = evt.target;
      var value = typeof input.value === 'string'
        ? input.value
        : String(input.value);

      if (value === '') {
        input.value = START_VALUE;
      }
    }

    return;
  }

  function onPhoneInput(evt) {
    var prevLength = evt.target.value.length;
    var selectionStart = evt.target.selectionStart;

    var numbers = evt.target.value
        .replace('+7', '')
        .replace(/\D/g, '')
        .slice(0, 11);

    var x = numbers.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

    var firstPart = x[1] ? '7(' + x[1] : '';
    var secondPart = x[2] ? ')' + x[2] : '';
    var thirdPart = x[3] ? '-' + x[3] : '';

    var res = firstPart + secondPart + thirdPart;

    evt.target.value = res ? '+' + res : '';

    evt.target.selectionEnd = selectionStart + evt.target.value.length - prevLength;
  }
})();


// modal
(function () {
  var Maybe = window.monad.Maybe;
  var trigger = new Maybe(document.querySelector('a[id="ring-trigger"]'));
  var modal = new Maybe(document.querySelector('div[id="modal"]'));
  var cross = new Maybe(document.querySelector('button[id="cross"]'));

  if (trigger.operand && modal.operand && cross.operand) {
    trigger = trigger.operand;
    modal = modal.operand;
    cross = cross.operand;

    trigger.addEventListener('click', onTriggerClick);
  }

  function onTriggerClick(evt) {
    evt.preventDefault();
    modal.classList.remove('hidden-entity');
    document.body.classList.add('modal-open');

    modal.addEventListener('click', onModalClick);
    document.addEventListener('keydown', onDocumentKeydown);
    cross.addEventListener('click', onCrossClick);
  }

  function onModalClick(evt) {
    if (!Object.is(evt.target, modal)) {
      return;
    }

    onCrossClick(evt);
  }

  function onDocumentKeydown(evt) {
    if (isEscEvent(evt)) {
      onCrossClick(evt);
    }
  }

  function onCrossClick(evt) {
    evt.preventDefault();
    modal.classList.add('hidden-entity');
    document.body.classList.remove('modal-open');

    modal.removeEventListener('click', onModalClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    cross.removeEventListener('click', onCrossClick);
  }

  function isEscEvent(evt) {
    return evt.key === ('Escape' || 'Esc');
  }
})();
