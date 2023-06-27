const state = {
  activeListId: null,
  lists: [],
  tasks: [],
  changeList: {
    status: false,
  },
};

let idCount = 1;
const defaultList = { id: idCount, name: 'Основной' };
state.lists.push(defaultList);
state.activeListId = defaultList.id;

const listEl = document.querySelector('[data-container="lists"]');
const taskEl = document.querySelector('[data-container="tasks"]');

const deleteList = (listId) => {
  state.lists = state.lists.filter((stateList) => stateList.id !== Number(listId));
  state.tasks = state.tasks.filter((stateTask) => stateTask.listId !== Number(listId));
  state.activeListId = defaultList.id;

  render('lists');
  render('tasks');
};

const render = (type) => {
  if (type === 'lists') {
    listEl.innerHTML = '';
    const data = state.lists;
    for (const item of data) {
      const li = document.createElement('li');
      li.textContent = item.name;

      const changeForm = document.createElement('form');
      changeForm.innerHTML =  `<label class="sr-only" for="${item.id}"> Изменить ${item.name}</label>
      <input type="text" id="${item.id}" name="name" value="${item.name}">
      <input type="submit" class="btn" value="изменить">`;

      if (item.id === state.activeListId) {
        li.innerHTML = `<b>${li.textContent}</b>`;
      } else {
        li.innerHTML = `<a id="${item.id}" href="#${li.textContent.toLowerCase()}">${li.textContent}</a>`;
      }

      if (item.id !== defaultList.id) {
        const changeButton = document.createElement('button');
        changeButton.classList.add('change');
        changeButton.setAttribute('id', `${item.id}`);
        changeButton.setAttribute('value', 'change');
        li.append(changeButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.setAttribute('id', `${item.id}`);
        deleteButton.setAttribute('value', 'delete');
        li.append(deleteButton);

        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteList(e.target.id);
        });

        changeButton.addEventListener('click', (e) => {
          e.stopPropagation();
          li.replaceChildren(changeForm);
          changeForm.elements.name.focus();
        });

        changeForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const formData = new FormData(changeForm);
          const newListName = formData.get('name');

          if (newListName.length !== 0) {
            state.lists.map((list) => {
              if (list.id === item.id) {
                list.name = newListName;
              }
            });
          }
          render('lists');
        });
      };

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
        const chBoxId = Number(e.target.id);
        const actualTaks = state.tasks.filter((task) => task.id === chBoxId);
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
  const aEl = document.querySelector(`a[id = "${e.target.id}"]`);
  const currentEl = e.target;

  if (currentEl.isEqualNode(aEl)) {
    e.preventDefault();

    state.activeListId = Number(currentEl.id);
    render('lists');
    render('tasks');
  }
});

render('lists');