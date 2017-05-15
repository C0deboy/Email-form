$(function(){
  'use strict';

  const formDataElements = {
    'userEmail': document.getElementsByName('userEmail')[0],
    'subject' : document.getElementsByName('subject')[0],
    'message': document.getElementsByName('message')[0],
    'recaptcha': document.querySelector(".g-recaptcha"),
  }

  const formAlert = document.querySelector(".emailFormAlert");

  const contactForm = $('#contact');

  function toggleContactForm(state) {
    if (typeof state !== 'boolean') return TypeError('State must be a boolean');

    if (state === true) {
      contactForm.fadeIn();
      contactForm.attr('aria-hidden', 'false');
      firstInput.focus();
    }
    else {
      contactForm.fadeOut();
      contactForm.attr('aria-hidden', 'true');

      for(const input in formDataElements){
        formDataElements[input].value = '';
      }

      grecaptcha.reset();
      openContactBtn.focus();
    }
  }

  const closeContactBtn = $('#close-contact-btn');
  const openContactBtn = $('#open-contact-btn');

  openContactBtn.click(function () {
    toggleContactForm(true);
  });

  closeContactBtn.click(function () {
    toggleContactForm(false);
  });

  const firstInput = $('input[name="from"]');

  closeContactBtn.on('keydown', function (e) {
   if ((e.which === 9 && !e.shiftKey)) {//tab
       e.preventDefault();
       firstInput.focus();
   }
  });

  firstInput.on('keydown', function (e) {
      if ((e.which === 9 && e.shiftKey)) {//tab
          e.preventDefault();
          closeContactBtn.focus();
      }
  });

  contactForm.on('keydown', function (e) {
      if ((e.which === 27)) {//esc
          toggleContactForm(false);
      }
  });
  

  $('.emailFormSubmit').click(function (event) {
    formAlert.innerHTML='<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
    event.preventDefault();

    const recaptchaResponse = document.getElementById("g-recaptcha-response");

    const isValid = true;//validateEmailForm();

    if(isValid===true){

      const sendEmail = $.ajax({
        type: "POST",
        url: "ajaxsend.php",
        dataType : 'json',
        data: {
          'userEmail' : formDataElements['userEmail'].value,
          'subject' : formDataElements['subject'].value,
          'message' : formDataElements['message'].value,
          'g-recaptcha-response' : recaptchaResponse.value
        }
      });

      sendEmail.fail(function(error) {
        console.log(error);
        console.log(error.responseJSON.errors);
        if(error.responseJSON !== undefined) {
          for(var el in error.responseJSON.errors){
            markWrongInput(formDataElements[el],error.responseJSON.errors[el]);
          }
        }
        formAlert.innerHTML='W formularzu występują błędy!';
      });

      sendEmail.done(function(response){
        console.log(response);
        formAlert.innerHTML=response.status;
      });
    }
    else {
        formAlert.innerHTML='W formularzu występują błędy!';
    }

  });

  function validateEmailForm(){
    let valid = true;
    for(const el in formDataElements){
      if(el === 'recaptcha'){
        continue;
      }
      if(formDataElements[el].validity.valid === false){
        markWrongInput(formDataElements[el], "Pole niepoprawne!");
        valid = false;
      }
    }
    if (grecaptcha.getResponse().length === 0){
      markWrongInput(formDataElements['recaptcha'],"Potwierdź, że nie jesteś robotem!");
      valid = false;
    }
    return valid;
    
  }

  function markWrongInput(wrongElement,alert){
    const errorMessage = document.createElement('p');
    errorMessage.classList.add("error");
    errorMessage.classList.add('wrongInput');
    errorMessage.textContent = alert;

    wrongElement.parentElement.append(errorMessage);
    wrongElement.classList.add('wrongInput');
    wrongElement.addEventListener("focus", function (){
      this.classList.remove('wrongInput');
      this.parentElement.removeChild(errorMessage);
      formAlert.innerHTML='';
    });

  }
});

