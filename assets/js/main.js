document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type=number]').forEach(input => {
    input.addEventListener('keypress', (event) => {
      if(!isNumber(event)){
        event.preventDefault()
      }
    },
      false
    )
  })

  document.querySelectorAll('input[name=tipOption]').forEach(input => {
    input.addEventListener('change', () => {
      document.getElementById('customTipInput').value = ""
      refreshResult()
    })
  })

  document.getElementById('billInput').addEventListener('keyup', refreshResult)
  document.getElementById('numberPeopleInput').addEventListener('keyup', refreshResult)
  document.getElementById('customTipInput').addEventListener('keyup', refreshResult)
  document.getElementById('resetButton').addEventListener('click', resetForm)
})

// -- Interfaz --

function refreshResult(){
  const form = document.getElementById('tipsForm')  
  const bill = parseValueToNumber('billInput', 'id', 'float')
  const numberOfPeople = parseValueToNumber('numberPeopleInput', 'id')

  if(numberOfPeople < 1 || bill < 1){
    form.classList.add('invalid')
    resetForm()
  }else{
    form.classList.remove('invalid') 

    let tipAmount = calculateTipAmount(bill, parseValueToNumber('input[type=radio][name=tipOption]:checked', 'query', 'float'))
    
    let tipCustomAmount = parseValueToNumber('customTipInput', 'id', 'float')

    if(tipCustomAmount > 0){
      document.getElementsByName('tipOption').forEach(item => item.checked = false)
      tipAmount = calculateTipAmount(bill, tipCustomAmount)
    } 

    const totalTipByPerson = calculateTipAmountByPerson(tipAmount, numberOfPeople)
    const totalBillByPerson = calculateTotalBillByPerson(bill + tipAmount, numberOfPeople)

    document.getElementById('totalTipPerson').innerHTML = parseCurrency(totalTipByPerson)
    document.getElementById('totalBillPerson').innerHTML =  parseCurrency(totalBillByPerson)
  }
}

function resetForm(){
  document.getElementById('totalTipPerson').innerHTML = parseCurrency(0)
  document.getElementById('totalBillPerson').innerHTML = parseCurrency(0)
}

// --- Cálculos ---

function calculateTipAmount(bill, tipAmount){
  return (bill < 1 || tipAmount < 1) ? 0 : (bill * tipAmount) / 100
}

function calculateTipAmountByPerson(tipAmount, numberOfPeople){
  if(numberOfPeople < 1){
    numberOfPeople = 1
  }
  return (tipAmount < 1 ) ? 0 : tipAmount / numberOfPeople
}

function calculateTotalBillByPerson(totalAmount, numberOfPeople){
  if(numberOfPeople < 1){
    numberOfPeople = 1
  }

  return (totalAmount < 1) ? totalAmount : totalAmount / numberOfPeople
}

// --- Filtros ---

function isNumber(event){
  event = event ? event : window.event
  const charCode = event.which ? event.which : event.keyCode
  return !(charCode > 31 && (charCode < 48 || charCode > 57))
}

function parseValueToNumber(selector, typeSelector = 'query', parseValueTo = 'int'){
  let element = null
  let value = 0

  if (typeSelector == 'id'){
    element = document.getElementById(selector)
  } else {
    element = document.querySelector(selector)
  }

  if (element != null && element.value){
    try{
      if (parseValueTo === 'int'){
          value = parseInt(element.value)
      }
      else if (parseValueTo === 'float'){
        value = parseFloat(element.value)
      }
    }catch(error){
      console.log(error)
      return 0
    }
  }

  return isNaN(value) ? 0 : value
}

// --- Formato ---

function parseCurrency(value){
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return formatter.format(value)
}