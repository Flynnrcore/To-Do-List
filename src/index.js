const state = {
  activeListId: null,
  lists: [],
  tasks: [],
};

let idCount = 1;
state.lists.push({ id: idCount, name: 'Основной' });
state.activeListId = state.lists[0].id;

const listEl = document.querySelector('[data-container="lists"]');
const taskEl = document.querySelector('[data-container="tasks"]');

const render = (type) => {
  if (type === 'lists') {
    listEl.innerHTML = '';
    const data = state.lists;
    for (const item of data) {
      const li = document.createElement('li');
      li.textContent = item.name;

      if (item.id === state.activeListId) {
        li.innerHTML = `<b>${li.textContent}</b>`;
      } else {
        li.innerHTML = `<a href="#${li.textContent.toLowerCase()}">${li.textContent}</a>`;
      }

      listEl.append(li);
    }
  } else if (type === 'tasks') {
    taskEl.innerHTML = '';
    const data = state[type].filter((item) => item.listId === state.activeListId);

    for (const item of data) {
      const li = document.createElement('li');

      li.innerHTML = item.checked === false ?
      `<input type="checkbox" id="${item.id}" name="${item.name}"><label for="${item.id}">${item.name}</label>`
      : `<input type="checkbox" id="${item.id}" name="${item.name}" checked><label for="${item.id}" class="strikethrough">${item.name}</label>`;

      taskEl.append(li);
    }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const chBoxName = e.target.name;
        const actualTaks = state.tasks.filter((task) => task.name === chBoxName);
        actualTaks[0].checked = e.target.checked;
          const labelEl = checkbox.closest('li').querySelector('label');
          labelEl.classList.toggle('strikethrough');
      });
    });
  }
};

const listsForm = document.querySelector('[data-container="new-list-form"]');
  listsForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formDataList = new FormData(e.target);
  const listName = formDataList.get('name');
  const listsNames = state.lists.map((list) => list.name);
  if (!listsNames.includes(listName)) {
    idCount += 1;
    state.lists.push({ id: idCount, name: listName });
  }

  listsForm.reset();
  listsForm.focus();

  render('lists');
});

const tasksForm = document.querySelector('[data-container="new-task-form"]');
tasksForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formDataTask = new FormData(e.target);
  const taskName = formDataTask.get('name');
  idCount += 1;
  state.tasks.push({ id: idCount, name: taskName, listId: state.activeListId, checked: false, });
  tasksForm.reset();
  tasksForm.focus();

  render('tasks');
});

listEl.addEventListener('click', (e) => {
  e.preventDefault();
  const liEl = e.target;
  const [{ id }] = state.lists.filter((list) => list.name === liEl.textContent);
  state.activeListId = id;

  render('lists');
  render('tasks');
});

render('lists');