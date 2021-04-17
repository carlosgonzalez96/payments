// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("local-time").start()

window.Rails = Rails

import 'bootstrap'
import 'data-confirm-modal'

$(document).on("turbolinks:load", () => {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()
})

document.addEventListener("turbolinks:load", () => {
  const form = document.querySelector("#payment-form")
  if (form == null){return}
  const public_key = document.querySelector("meta[name='stripe-key']").getAttribute("content")
  const stripe = Stripe(public_key)

  const elements = stripe.elements()
  const card = elements.create('card')
  card.mount('#card-element')

  card.addEventListener("change", (event) => {
    var displayError = document.getElementById('card-errors')
    if(event.error) {
      displayError.textContent = event.error.message
    } else {
      displayError.textContent = ''
    }
  })

  
  form.addEventListener("submit", (event) => {
    event.preventDefault()

    let data = {
      payment_method: {
        card: card,
        billing_details: {
          name: form.querySelector("#name_on_card").value
        }
      }
    }

    stripe.confirmCardPayment(form.dataset.paymentIntentId, data).then((result) => {
      if(result.error) {
        var errorElement = document.getElementById('card-errors')
        errorElement.textContent = result.error.message
      } else {
        form.submit()
      }
    })
  })
})