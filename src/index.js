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
      li.textContent = item.name;

      taskEl.append(li);
    }
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
  state.tasks.push({ id: idCount, name: taskName, listId: state.activeListId });
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