async function sortByHandler(event) {

    const value = event.target.value;
    document.location.replace('/' + value);
}
document.querySelector('#sort-list').value = window.location.toString().split('/')[window.location.toString().split('/').length - 1] || '1';

document.querySelector('#sort-list').addEventListener('change', sortByHandler);