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
    input.addEventListener('change', (event) => {
      if(event.target.checked){
        document.getElementById('customTipInput').value = ""
        refreshAlerts()
      }
    })
  })

  document.getElementById('billInput').addEventListener('keyup', refreshResult)
  document.getElementById('numberPeopleInput').addEventListener('keyup', refreshResult)

  document.getElementById('customTipInput').addEventListener('keyup', refreshAlerts)
  document.getElementById('resetButton').addEventListener('click', () => {
    resetResults()
    document.getElementById('tipsForm').classList.remove('invalid')
  })
})

// -- Interfaz --

function refreshResult(){
  const form = document.getElementById('tipsForm')  
  const resetButton = document.getElementById('resetButton')
  const bill = parseValueToNumber('billInput', 'id', 'float')
  const numberOfPeople = parseValueToNumber('numberPeopleInput', 'id')

  if(numberOfPeople < 1 && bill < 1) {
    resetResults(true)
  }
  else if(numberOfPeople < 1 || bill < 1){
    form.classList.add('invalid')
    resetButton.removeAttribute('disabled')
    resetResults()
  }
  else{
    form.classList.remove('invalid')
    resetButton.removeAttribute('disabled')

    let tipAmount = calculateTipAmount(bill, parseValueToNumber('input[type=radio][name=tipOption]:checked', 'query', 'float'))
    
    let tipCustomAmount = parseValueToNumber('customTipInput', 'id', 'float')

    if(tipCustomAmount > 0){
      document.getElementsByName('tipOption').forEach(item => item.checked = false)
      tipAmount = calculateTipAmount(bill, tipCustomAmount)
    } 

    const totalTipPerson = parseCurrency(calculateTipAmountByPerson(tipAmount, numberOfPeople))
    const totalBillPerson = parseCurrency(calculateTotalBillByPerson(bill + tipAmount, numberOfPeople))

    checkFontSize(totalTipPerson, totalBillPerson)

    document.getElementById('totalTipPerson').innerHTML = totalTipPerson
    document.getElementById('totalBillPerson').innerHTML =  totalBillPerson
  }
}

function resetResults(disableReset = false){
  document.getElementById('totalTipPerson').innerHTML = parseCurrency(0)
  document.getElementById('totalBillPerson').innerHTML = parseCurrency(0)
  
  if (disableReset){
    document.getElementById('resetButton').setAttribute('disabled', '')
  }
}

function refreshAlerts(){
  if (parseValueToNumber('numberPeopleInput', 'id') < 1 && parseValueToNumber('billInput', 'id', 'float') < 1){
    document.getElementById('tipsForm') .classList.add('invalid')
    document.getElementById('resetButton').setAttribute('disabled', '')

    resetResults()
  }
  else{
    refreshResult()
  }
}

function checkFontSize(totalBillPerson, totalTipPerson){
  const resultContainer = document.getElementById('resultContainer')

  if(String(totalBillPerson).length > 10 || String(totalTipPerson).length > 10){
    resultContainer.classList.add('xs-text')
  }
  else if(String(totalBillPerson).length > 6 || String(totalTipPerson).length > 6){
    resultContainer.classList.add('sm-text')
  }
  else{
    resultContainer.classList.remove('sm-text', 'xs-text')
  }
}

// --- Cálculos ---

function calculateTipAmount(bill, tipAmount){
  return (bill < 1 || tipAmount < 1) ? 0 : (bill * tipAmount) / 100
}

function calculateTipAmountByPerson(tipAmount, numberOfPeople){
  if(numberOfPeople < 1){
    numberOfPeople = 1
  }
  return (tipAmount < 0 ) ? 0 : tipAmount / numberOfPeople
}

function calculateTotalBillByPerson(totalAmount, numberOfPeople){
  if(numberOfPeople < 1){
    numberOfPeople = 1
  }

  return (totalAmount < 0) ? totalAmount : totalAmount / numberOfPeople
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