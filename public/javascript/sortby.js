async function sortByHandler(event) {

    const value = event.target.value;

    document.location.replace('/' + value);
}
let listValue = window.location.toString().split('/')[window.location.toString().split('/').length - 1] > 5 ? '' : window.location.toString().split('/')[window.location.toString().split('/').length - 1] || '1';
if (!listValue || listValue > 5) listValue = 1;
document.querySelector('#sort-list').value = listValue;
console.log(listValue);

document.querySelector('#sort-list').addEventListener('change', sortByHandler);