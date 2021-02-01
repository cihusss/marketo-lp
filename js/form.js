var userConfig = {
   buttons: {
      prev: {
         label: "Back",
         disabled: false
      },
      next: {
         label: "Next"
      }
   },
   requiredFields: [
      {
         name: "Program_Of_Interest",
         message: "This field is required."
      },
      {
         name: "FirstName",
         message: "This field is required."
      },
      {
         name: "LastName",
         message: "This field is required."
      },
      {
         name: "Email",
         message: "This field is required."
      },
      {
         name: "Phone",
         message: "This field is required."
      },
      {
         name: "Military_Relationship__c",
         message: "This field is required."
      },
      {
         name: "Country_of_Citizenship__c",
         message: "This field is required."
      }
   ]
};

MktoForms2.whenReady(function(form) {
   var formEl = form.getFormElem()[0],
      arrayify = getSelection.call.bind([].slice);

   var fieldRowStor = ".mktoForm > .mktoFormRow",
      buttonRowStor = ".mktoForm > .mktoButtonRow",
      buttonStor = ".mktoButtonRow .mktoButton",
      fsaatPrefix = "fsaat-",
      localFragmentAttr = "data-form-local-fragment";
   
   var CSSOM_RULEPOS_FIRST = 0;

   var fieldRows = formEl.querySelectorAll(fieldRowStor),
      submitButtonRow = formEl.querySelector(buttonRowStor),
      submitButton = submitButtonRow.querySelector(buttonStor);
   
   userConfig.requiredFields
     .map(function(fieldDesc) {
        fieldDesc.label = formEl.querySelector("[for='"+ fieldDesc.name + "']");
        fieldDesc.refEl = formEl.querySelector("[name='" + fieldDesc.name + "']");
        return fieldDesc;
     })
     .forEach(function(fieldDesc){
        fieldDesc.label.parentNode.classList.add("mktoRequiredField");
     });
   
    var dynableSheet = arrayify(document.styleSheets)
     .filter(function(sheet){
       return sheet.ownerNode.nodeName == "STYLE";
     })[0];   
   
   arrayify(fieldRows).forEach(function(row, rowIdx) {
      var rowPos = {
         isFirst: rowIdx == 0,
         isLast: rowIdx == fieldRows.length - 1
      };

      // id each wrapper row in DOM order
      row.id = fsaatPrefix + rowIdx;

      var navButtonRow = rowPos.isLast
            ? submitButtonRow
            : submitButtonRow.cloneNode(true),
         newRowAxis = row.nextSibling,
         nextEnabled = !rowPos.isLast,
         prevEnabled = !rowPos.isFirst && !userConfig.buttons.prev.disabled,
         newButtonAxis,
         newButtonTmpl,
         navButtons = {};

      if (nextEnabled) {
         navButtons.next = navButtonRow.querySelector(buttonStor);
      }

      if (prevEnabled) {
         newButtonTmpl = newButtonAxis = navButtons.next || submitButton;
         navButtons.prev = newButtonTmpl.cloneNode();
      }

      Object.keys(navButtons).forEach(function(dir) {
         navButtons[dir].type = "button";
         navButtons[dir].setAttribute("data-dir", dir);
         navButtons[dir].innerHTML = userConfig.buttons[dir].label;
      });

      if (nextEnabled) {
         row.parentNode.insertBefore(navButtonRow, newRowAxis);
      }

      if (prevEnabled) {
         newButtonAxis.parentNode.insertBefore(navButtons.prev, newButtonAxis);
      }
            
      navButtonRow.addEventListener("click", function(e) {
         if (e.target.tagName == "BUTTON" && e.target.type == "button" ) {            
            if (e.target.getAttribute("data-dir") == "next" && !isCustomValid(true,row)) {
               return;
            }
            fsaatSet(row, e.target.getAttribute("data-dir"));
         }
      });
      
      dynableSheet.insertRule(
         [
           ".mktoForm[" + localFragmentAttr + "='#" + row.id + "']" + " " + ".mktoFormRow#" + row.id + ",",
           ".mktoForm[" + localFragmentAttr + "='#" + row.id + "']" + " " + ".mktoFormRow#" + row.id + " + " + ".mktoButtonRow", 
           "{ display: block; }"
         ].join(" "),
         CSSOM_RULEPOS_FIRST
      );
      
   });

   function fsaatSet(current, dir) {
      var FSAAT_DIR_PREV = "prev",
          FSAAT_DIR_NEXT = "next";
      
      var dir = dir || FSAAT_DIR_NEXT,
         currentIndex, 
         newHash;

      if (current instanceof HTMLElement) {
         currentIndex = +current.id.split(fsaatPrefix)[1];
      } else if (!isNaN(current)) {
         currentIndex = current;
      } else {
         currentIndex = -1;
      }

      newHash = "#" + fsaatPrefix + (dir == FSAAT_DIR_NEXT ? ++currentIndex : --currentIndex);

      formEl.setAttribute(localFragmentAttr, newHash);
   }    
   
   function isCustomValid(native, currentStep){
      form.submittable(false);
      
      var currentStep = currentStep || formEl,
          currentValues = form.getValues();

      var currentUnfilled = userConfig.requiredFields
        .filter(function(fieldDesc) {
          return currentStep.contains(fieldDesc.refEl) && (!currentValues[fieldDesc.name] || (fieldDesc.refEl.type == "checkbox" && currentValues[fieldDesc.name] == "no"));
        });

      if (currentUnfilled.length) {
         form.showErrorMessage(currentUnfilled[0].message,MktoForms2.$(currentUnfilled[0].refEl));
         return false;
      } else {
         form.submittable(true);
         return true;
      }         
   }
   
   form.onValidate(isCustomValid);
   fsaatSet();

  labels = document.getElementsByClassName('mktoLabel');
  inputs = document.getElementsByClassName('mktoField');
  inputValues = [];
   
  for (i = 0; i < labels.length; i++) {
      label = document.getElementsByClassName('mktoLabel')[i];
      label.style.opacity = '0';
      name = label.innerHTML.split("</div>").pop();
      input = label.nextSibling.nextSibling;
      input.setAttribute('placeholder', name);
   }
   
  for (i = 0; i < inputs.length; i++) {
      input = document.getElementsByClassName('mktoField')[i];
      input.addEventListener('focusin', function() {
        boo = this.previousSibling.previousSibling;
        boo.style.opacity = '1';
        placeholder = this.setAttribute('placeholder', '');
        this.setAttribute('style', 'padding: 12px 6px 0 6px !important');
      });
      input.addEventListener('focusout', function() {
        boo = this.previousSibling.previousSibling;
        placeholder = this.setAttribute('placeholder', boo.innerHTML.split("</div>").pop());
        if(this.value == "") {
          boo.style.opacity = '0';
          this.setAttribute('style', 'padding: 2px 6px 0 6px !important');
        }
        else {
          boo.style.opacity = '1';
        }
      });
  }

  console.log(inputs[0].value);

  // const arr = [null, null, null];
  // console.log(arr.every(element => element === null));

  btnSubmit = document.querySelector('button[type="submit"]');
  btnSubmit.addEventListener('click', function() {
    for (i = 0; i < inputs.length; i++) {
      inputVal = document.getElementsByClassName('mktoField')[i].value;
      console.log(inputVal);
      inputValues.push(inputVal);
    }
    // console.log(inputValues);
    if (inputValues.includes('')) {
      console.log('one of the values is empty');
    }
    else {
      btnSubmit.innerHTML = 'Wait...';
      alert('booooom');
      document.querySelector('button[type="button"]:nth-child(1)').style.display = 'none !important';
    }
  });

  legends = document.querySelectorAll('legend');
  legends.forEach(element => {
    let currText = element.innerHTML.replace('0', '');
    steps = document.querySelectorAll('fieldset');
    element.innerHTML = currText + ' of ' + steps.length;
    element.setAttribute('style', 'display: block !important');
  });

  lala = document.querySelectorAll('.mktoField');
  lala.forEach(element => {
      element.addEventListener('focusin', function() {
         console.log('focusIn');
         // element.setAttribute('style', 'padding: 12px 6px 0 6px !important');
      });
      element.addEventListener('focusout', function() {
         console.log('focusOut');
         // element.setAttribute('style', 'padding: 2px 6px 0 6px !important');
      });
   });

});