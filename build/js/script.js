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


// accordeon
(function () {
  var UNITS = 'px';
  var TABLET_WIDTH = 768;

  var accordeons;
  var scrollHeightKeeping = {};

  window.addEventListener('load', function () {
    findAccordeons();

    if (isPreTabletWidth() && accordeons.length) {
      storeContentScrollHeight();
      addJsStyles();
      setEventListeners();
    }
  });

  function isPreTabletWidth() {
    return document.documentElement.clientWidth < TABLET_WIDTH;
  }

  function findAccordeons() {
    var Maybe = window.monad.Maybe;
    accordeons = new Maybe(document.querySelectorAll('.accordeon'));
    accordeons = accordeons.operand.length
      ? Array.from(accordeons.operand)
      : null;
  }

  function storeContentScrollHeight() {
    accordeons.forEach(function (it) {
      Array.from(it.querySelectorAll('.accordeon__content')).forEach(function (item) {
        scrollHeightKeeping[item.id] = {
          scrollHeight: item.scrollHeight
        };
      });
    });
  }

  function addJsStyles() {
    accordeons.forEach(function (it) {
      Array.from(it.querySelectorAll('.accordeon__btn')).forEach(function (item) {
        item.classList.add('accordeon__btn--js');
      });

      Array.from(it.querySelectorAll('.accordeon__content')).forEach(function (item) {
        hideContent(item);
      });
    });
  }

  function hideContent(item) {
    var children = Array.from(item.children);
    var callback = function (it) {
      it.classList.add('accordeon__content--js');
      it.style.maxHeight = null;
    };

    hideChildren(item, children, callback);
  }

  function hideChildren(parent, children, cb) {
    children.forEach(function (it) {
      it.classList.add('hidden-entity');
    });

    if (!cb) {
      return;
    }

    cb(parent);
  }

  function showChildren(parent, children, cb) {
    children.forEach(function (it) {
      it.classList.remove('hidden-entity');
    });

    if (!cb) {
      return;
    }

    cb(parent);
  }

  function setEventListeners() {
    accordeons.forEach(function (it) {
      it.addEventListener('click', onAccordeonClick);
    });
  }

  function eraseEventListeners() {
    accordeons.forEach(function (it) {
      it.removeEventListener('click', onAccordeonClick);
    });
  }

  function onAccordeonClick(evt) {
    if (evt.target.matches('.accordeon__btn')) {
      var isButtonInactive = !evt.target.classList.contains('accordeon__btn--active');
      var accordeon = evt.target.closest('.accordeon');

      Array.from(accordeon.querySelectorAll('.accordeon__btn')).forEach(function (item) {
        item.classList.remove('accordeon__btn--active');
      });

      Array.from(accordeon.querySelectorAll('.accordeon__content')).forEach(function (item) {
        hideContent(item);
      });

      if (isButtonInactive) {
        evt.target.classList.toggle('accordeon__btn--active');

        var hasButtonNextElementSibling = evt.target.nextElementSibling
          ? true
          : false;

        var isButtonNextElementSiblingContent = evt.target.nextElementSibling.matches('.accordeon__content')
          ? true
          : false;

        if (hasButtonNextElementSibling && isButtonNextElementSiblingContent) {
          var parent = evt.target.nextElementSibling;
          var children = Array.from(parent.children);
          var callback = function (element) {
            element.style.maxHeight = scrollHeightKeeping[element.id].scrollHeight + UNITS;
          };

          showChildren(parent, children, callback);
        }
      }
    }
  }

  var onWindowResize = (function () {
    var isWorkedOnPreTabletWidth = false;

    return function () {
      if (!isPreTabletWidth()) {
        if (!accordeons) {
          return;
        }

        accordeons.forEach(function (accordeon) {
          Array.from(accordeon.querySelectorAll('.accordeon__content')).forEach(function (item) {
            var children = Array.from(item.children);
            showChildren(item, children);
          });
        });

        eraseEventListeners();
        isWorkedOnPreTabletWidth = false;
        return;
      }

      if (isPreTabletWidth() && !isWorkedOnPreTabletWidth) {
        setEventListeners();
        isWorkedOnPreTabletWidth = true;
      }
    };
  })();

  window.addEventListener('resize', onWindowResize);
})();


// scroll
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


// mask
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
