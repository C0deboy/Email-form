$(function(){
  'use strict';

  const userEmail = document.getElementsByName('from')[0];
  const subject = document.getElementsByName('subject')[0];
  const message = document.getElementsByName('message')[0];
  const recaptcha = document.querySelector(".g-recaptcha");
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
      userEmail.value='';
      subject.value='';
      message.value='';
      formAlert.innerHTML='';
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
          'userEmail' : userEmail.value,
          'subject' : subject.value,
          'message' : message.value,
          'g-recaptcha-response' : recaptchaResponse.value
        }
      });

      sendEmail.fail(function(error) {
        if(error.responseJSON.errors.userEmail){
          markWrongInput(userEmail, error.responseJSON.errors.userEmail);
        }
        if(error.responseJSON.errors.subject){
          markWrongInput(subject, error.responseJSON.errors.subject);
        }
        if(error.responseJSON.errors.message){
          markWrongInput(message, error.responseJSON.errors.message);
        }
        if(error.responseJSON.errors.recaptcha){
            markWrongInput(recaptcha, error.responseJSON.errors.recaptcha);
        }
        formAlert.innerHTML='W formularzu występują błędy!';
        console.log(error.responseJSON);
      });

      sendEmail.done(function(response){
        console.log(response);
        formAlert.innerHTML=response.text+'<i class="fa fa-check" aria-hidden="true"></i>';
      });
    }
    else {
        formAlert.innerHTML='W formularzu występują błędy!';
    }

  });

  function validateEmailForm(){
    let valid = true;
    if(userEmail.validity.valid===false){
      markWrongInput(userEmail,"Podaj poprawny email!");
      valid = false;
    }
    if (subject.validity.valueMissing){
      markWrongInput(subject,"Wpisz jakiś temat!");
      valid = false;
    }
    if (message.validity.valueMissing){
      markWrongInput(message,"Pusta wiadomość? Napisz coś!");
      valid = false;
    }
    if (grecaptcha.getResponse().length === 0){
      markWrongInput(recaptcha,"Potwierdź, że nie jesteś robotem!");
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

