console.log('funguju!');

import {ShopList} from './ShopList/index.js'

document
  .querySelector('main')
  .append(
    ShopList({ day: 'mon', dayResult: 'loading' }),
    ShopList({ day: 'tue', dayResult: 'loading' })
  );

// fetch('https://nakupy.kodim.app/api/sampleweek/mon')
//   .then((response) => response.json())
//   .then((data) => {
//     mainElement.append(
//       ShopList(
//         {
//         dayName: data.result.dayName,
//         items: data.result.items
//         }
//       )
//     )
//   });

//   fetch('https://nakupy.kodim.app/api/sampleweek/tue')
//   .then((response) => response.json())
//   .then((data) => {
//     mainElement.append(
//       ShopList(
//         {
//         dayName: data.result.dayName,
//         items: data.result.items,
//         }
//       )
//     )
//   });
