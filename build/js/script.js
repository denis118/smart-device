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
// (function () {
//   var TABLET_WIDTH = 768;

//   var accordeons;

//   window.addEventListener('load', function () {
//     findAccordeons();

//     if (accordeons.length) {
//       addButtonsJsStyles();

//       if (isPreTabletWidth()) {
//         addContentsJsStyles();
//         setEventListeners();
//       }
//     }
//   });

//   function isPreTabletWidth() {
//     return document.documentElement.clientWidth < TABLET_WIDTH;
//   }

//   function findAccordeons() {
//     var Maybe = window.monad.Maybe;
//     accordeons = new Maybe(document.querySelectorAll('.accordeon'));
//     accordeons = accordeons.operand.length
//       ? Array.from(accordeons.operand)
//       : null;
//   }

//   function addButtonsJsStyles() {
//     accordeons.forEach(function (it) {
//       Array.from(it.querySelectorAll('.accordeon__btn')).forEach(function (item) {
//         item.classList.add('accordeon__btn--js');
//       });
//     });
//   }

//   function removeButtonsActiveStyles() {
//     accordeons.forEach(function (it) {
//       Array.from(it.querySelectorAll('.accordeon__btn--active')).forEach(function (item) {
//         item.classList.remove('accordeon__btn--active');
//       });
//     });
//   }

//   function addContentsJsStyles() {
//     accordeons.forEach(function (it) {
//       Array.from(it.querySelectorAll('.accordeon__content')).forEach(function (item) {
//         hideContent(item);
//       });
//     });
//   }

//   function removeContentsJsStyles() {
//     accordeons.forEach(function (it) {
//       Array.from(it.querySelectorAll('.accordeon__content')).forEach(function (item) {
//         showChildren(Array.from(item.children));
//       });
//     });
//   }

//   function hideContent(item) {
//     hideChildren(Array.from(item.children));
//   }

//   function hideChildren(children) {
//     children.forEach(function (it) {
//       it.classList.add('hidden-entity');
//     });
//   }

//   function showChildren(children) {
//     children.forEach(function (it) {
//       it.classList.remove('hidden-entity');
//     });
//   }

//   function setEventListeners() {
//     accordeons.forEach(function (it) {
//       it.addEventListener('click', onAccordeonClick);
//     });
//   }

//   function eraseEventListeners() {
//     accordeons.forEach(function (it) {
//       it.removeEventListener('click', onAccordeonClick);
//     });
//   }

//   function onAccordeonClick(evt) {
//     if (evt.target.matches('.accordeon__btn')) {
//       var isButtonInactive = !evt.target.classList.contains('accordeon__btn--active');
//       var accordeon = evt.target.closest('.accordeon');

//       Array.from(accordeon.querySelectorAll('.accordeon__btn')).forEach(function (item) {
//         item.classList.remove('accordeon__btn--active');
//       });

//       Array.from(accordeon.querySelectorAll('.accordeon__content')).forEach(function (item) {
//         hideContent(item);
//       });

//       if (isButtonInactive) {
//         evt.target.classList.toggle('accordeon__btn--active');

//         var hasButtonNextElementSibling = evt.target.nextElementSibling
//           ? true
//           : false;

//         var isButtonNextElementSiblingContent = evt.target.nextElementSibling.matches('.accordeon__content')
//           ? true
//           : false;

//         if (hasButtonNextElementSibling && isButtonNextElementSiblingContent) {
//           var parent = evt.target.nextElementSibling;
//           showChildren(Array.from(parent.children));
//         }
//       }
//     }
//   }

//   var onWindowResize = (function () {
//     var isWorkedOnPreTabletWidth = false;

//     return function () {
//       if (!isPreTabletWidth()) {
//         if (!accordeons) {
//           return;
//         }

//         removeButtonsActiveStyles();
//         removeContentsJsStyles();
//         eraseEventListeners();
//         isWorkedOnPreTabletWidth = false;
//         return;
//       }

//       if (isPreTabletWidth() && !isWorkedOnPreTabletWidth) {
//         addContentsJsStyles();
//         setEventListeners();
//         isWorkedOnPreTabletWidth = true;
//       }
//     };
//   })();

//   window.addEventListener('resize', onWindowResize);
// })();

(function () {
  var TABLET_WIDTH = 768;
  var UNITS = 'px';

  var accordeons;

  window.addEventListener('load', function () {
    findAccordeons();

    if (accordeons.length) {
      addButtonsJsStyles();

      if (isPreTabletWidth()) {
        addContentsJsStyles();
        setEventListeners();
      }
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

  function addButtonsJsStyles() {
    accordeons.forEach(function (it) {
      Array.from(it.querySelectorAll('.accordeon__btn')).forEach(function (item) {
        item.classList.add('accordeon__btn--js');
      });
    });
  }

  function removeButtonsActiveStyles() {
    accordeons.forEach(function (it) {
      Array.from(it.querySelectorAll('.accordeon__btn--active')).forEach(function (item) {
        item.classList.remove('accordeon__btn--active');
      });
    });
  }

  function addContentsJsStyles() {
    accordeons.forEach(function (it) {
      Array.from(it.querySelectorAll('.accordeon__content')).forEach(function (item) {
        hideContent(item);
      });
    });
  }

  function removeContentsJsStyles() {
    accordeons.forEach(function (it) {
      Array.from(it.querySelectorAll('.accordeon__content')).forEach(function (item) {
        showContent(item);
      });
    });
  }

  function hideContent(item) {
    item.classList.add('accordeon__content--js');
  }

  function showContent(item) {
    item.classList.remove('accordeon__content--js');
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
        item.style.maxHeight = null;
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
          var content = evt.target.nextElementSibling;

          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + UNITS;
          }
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

        removeContentsJsStyles();
        eraseEventListeners();
        isWorkedOnPreTabletWidth = false;
        return;
      }

      if (isPreTabletWidth() && !isWorkedOnPreTabletWidth) {
        addContentsJsStyles();
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
  var name = new Maybe(document.querySelector('input[id="name-modal"]'));

  var focusableElements;

  if (trigger.operand && modal.operand && cross.operand && name.operand) {
    trigger = trigger.operand;
    modal = modal.operand;
    cross = cross.operand;
    name = name.operand;

    trigger.addEventListener('click', onTriggerClick);

    focusableElements = Array.from(document.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), input[type="tel"]:not([disabled]), select:not([disabled])'));
  }

  function onTriggerClick(evt) {
    evt.preventDefault();
    modal.classList.remove('hidden-entity');
    document.body.classList.add('modal-open');

    modal.addEventListener('click', onModalClick);
    document.addEventListener('keydown', onDocumentKeydown);
    cross.addEventListener('click', onCrossClick);

    removeFocus(focusableElements);
    name.focus();
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

    returnFocus(focusableElements);
  }

  function removeFocus(elements) {
    elements.forEach(function (it) {
      if (!it.closest('#modal')) {
        it.setAttribute('tabindex', '-1');
      }
    });
  }

  function returnFocus(elements) {
    elements.forEach(function (it) {
      if (!it.closest('#modal')) {
        it.removeAttribute('tabindex');
      }
    });
  }

  function isEscEvent(evt) {
    return evt.key === ('Escape' || 'Esc');
  }
})();
