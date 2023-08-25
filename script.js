const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearButton = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFormStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  resetUI();
}

const onAddItemSubmit = (e) => {
  //this will prevent default form submission
  e.preventDefault();

  const newItem = itemInput.value;

  //validate input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (ifItemExists(newItem)) {
    alert('Item Already exists');
    return;
  }

  //check for edit mode
  if (isEditMode) {
    const itemtoEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemtoEdit.textContent);
    itemtoEdit.classList.remove('edit-mode');
    //remove from DOM
    itemtoEdit.remove();
    isEditMode = false;
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  itemInput.value = '';

  //refresh ui state
  resetUI();
};

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.className = 'item';
  li.appendChild(document.createTextNode(item));

  const removeButton = createButton('remove-item btn-link text-red');
  li.appendChild(removeButton);

  //add li to dom
  itemList.appendChild(li);
}

function createButton(classNames) {
  const button = document.createElement('button');
  button.className = classNames;

  button.appendChild(createIcon('fa-solid fa-xmark'));
  return button;
}

function createIcon(classNames) {
  const icon = document.createElement('i');
  icon.className = classNames;
  return icon;
}

function onClickItem(e) {
  // if the X button is clicked then remove the item
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    console.log('ul clicked');
    setItemToEdit(e.target);
  }
}

function ifItemExists(item) {
  const itemsFromStorage = getItemsFormStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((li) => {
    li.classList.remove('edit-mode');
  });
  //item.style.color = '#ccc';
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  /*
  if (e.target.parentElement.classList.contains('items')) {
    console.log('ul clicked');
  }

  if (e.target.parentElement.classList.contains('remove-item')) {
    console.log('x clicked');
    if (confirm('Are you sure')) {
      e.target.parentElement.parentElement.remove();
      checkUI();
    }
  }
  */
  if (confirm('Are you sure')) {
    // remove item from DOM
    item.remove();

    removeItemFromStorage(item.textContent);
    // remove item from Storage
    resetUI();
  }
}

function removeItemFromStorage(itemText) {
  let itemsFromStorage = getItemsFormStorage();

  //filter elements that do not match
  itemsFromStorage = itemsFromStorage.filter((item) => {
    if (item !== itemText) {
      return item;
    }
  });

  //Reset to storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    item.remove();
  });

  localStorage.removeItem('items');
  resetUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase().trim();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFormStorage();

  //add new item to array
  itemsFromStorage.push(item);

  //convert to json string and set to lcoal storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFormStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function resetUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  console.log(items.length);
  console.log('Inside Check UI');
  if (items.length === 0) {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
}

function init() {
  //Event listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  clearButton.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  //Event Delegation
  itemList.addEventListener('click', onClickItem);
  //This will run only once on page load
  resetUI();
}
init();

//localStorage.setItem('name', 'Prashant');
//localStorage.clear();
