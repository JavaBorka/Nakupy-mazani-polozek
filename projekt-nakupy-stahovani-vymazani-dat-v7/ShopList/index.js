console.log('funguju!');

import { ListItem } from '../ListItem/index.js';

export const ShopList = (props) => {
  const {day, dayResult} = props

  let dayName = 'Načítám...'
  if (dayResult !== 'loading') {
    dayName = dayResult.dayName
  }
 // do hlavičky v komponentě ShopList přidejte HTML pro panel s tlačítkem obnovit. Hlavička komponenty pak bude vypadat takto:

  const element = document.createElement('div')
  element.classList.add('shoplist')
  element.innerHTML = `
        <div class="shoplist__head">
          <h2 class="shoplist__day">${dayName}</h2>
          <div class="shoplist__toolbar">
            <button class="reset-btn">obnovit</button>
            <button class="clear-btn">vymazat</button>
          </div>
        </div>
        <form class="shoplist__new">
          <div class="form-fields">  
            <input class="field-input product-input" type="text" />
            <input class="field-input amount-input" type="text" />
            <input class="field-input unit-input" type="text" />
          </div>
          <div class="form-controls">
            <button class="btn-add">Přidat</button>
          </div>
      </form>
      <div class="shoplist__items"></div>
    `

  if (dayResult === 'loading') {
    fetch(`https://nakupy.kodim.app/api/me/week/${day}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` // do local storage jsme zadali autentizačný token. Nepíšu ho prřímo do kódu - nechci ho zveřejňovat všem na githube.
      }
    })
    .then(response => response.json())
    .then(data => {
      element.replaceWith(
        ShopList({
          day: day,
          dayResult: data.result
        })
      )
    })

    return element
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const productInput = element.querySelector('.product-input')
    const amountInput = element.querySelector('.amount-input')
    const unitInput = element.querySelector('.unit-input')

    fetch(`https://nakupy.kodim.app/api/me/week/${day}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        product: productInput.value,
        amount: Number(amountInput.value),
        unit: unitInput.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        element.replaceWith(ShopList({ day, dayResult: data.result }));
      });
  }

// Když nám nákupní seznam příliš naroste, zatím to vyřešíme tak, že umožníme seznam vrátit do původní podoby tak, jak vypadal při prním přihlášení.

  const handleReset = () => {
      fetch(`https://nakupy.kodim.app/api/me/week/${day}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
        type: "reset"
        })
      })
      .then((response) => response.json())
      .then((data) => {
        element.replaceWith(ShopList({ day, dayResult: data.result }));
      });
  }

  const handleClear = () => {
      fetch(`https://nakupy.kodim.app/api/me/week/${day}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
        type: "clear"
        })
      })
      .then((response) => response.json())
      .then((data) => {
        element.replaceWith(ShopList({ day, dayResult: data.result }));
      });
  }

  const clearBtn = document.querySelector('.clear-btn')
  clearBtn.addEventListener('click', handleClear)

  const resetBtn = element.querySelector('.reset-btn')
  resetBtn.addEventListener('click', handleReset)

  const formELm = element.querySelector('form')
  formELm.addEventListener('submit', handleSubmit)

  const itemsElement = element.querySelector('.shoplist__items');
  itemsElement.append(...dayResult.items.map((item) => ListItem(item)));

  return element;
}