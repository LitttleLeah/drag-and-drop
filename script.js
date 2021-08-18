const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// getSavedColumns();
// updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Filter Arrays to remove empty items
function filterArray(array) {
  // console.log(array);
  const filteredArray = array.filter(item => item !== null);
  // console.log(filteredArray);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('item:', item);
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  // In vid it's ((backlogItem))
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  }); 
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  }); 
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  }); 
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  }); 
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update item - delete if necessary or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  // console.log(selectedColumnEl[id].textContent);
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    // console.log(selectedArray);
    updateDOM();
  }
}

// Add to column list, also reset etxt box
function addToColumn(column) {
 const itemText = addItems[column].textContent;
 const selectedArray = listArrays[column];
 selectedArray.push(itemText);
 addItems[column].textContent = '';
 updateDOM();
}

//  Show add item input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide add item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allow arrays to refelct drag and drop items
function rebuildArrays() {
  // console.log(backlogList.children);
  // console.log(progressList.children);
  // backlogListArray = [];
  // for (let i = 0; i < 
    backlogListArray = Array.from(backlogList.children).map(i => i.textContent); 
    // i++) {
    // backlogListArray.push(backlogList.children[i].textContent);
  // }
  // progressListArray = [];
  // for (let i = 0; i < 
    progressListArray = Array.from(progressList.children).map(i => i.textContent); 
  //   i++) {
  //   progressListArray.push(progressList.children[i].textContent);
  // }
  // completeListArray = [];
  // for (let i = 0; i < 
    completeListArray = Array.from(completeList.children).map(i => i.textContent); 
  //   i++) {
  //   completeListArray.push(completeList.children[i].textContent);
  // }
  // onHoldListArray = [];
  // for (let i = 0; i < 
    onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent)
  //   ; i++) {
  //   onHoldListArray.push(onHoldList.children[i].textContent);
  // }
  updateDOM();
}

// When items start dragging
function drag(e) {
  draggedItem = e.target;
  // console.log('draggedItem', draggedItem);
  dragging = true;
}

// Column Allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When the item enters the column area
function dragEnter(column) {
  // console.log(listColumns[column]);
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping item in column
function drop(e) {
  e.preventDefault();
  // Remove BG colour padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Adding item to the column
  const parent =listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays(); 
}

// On Load
updateDOM();