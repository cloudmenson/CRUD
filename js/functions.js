function displayListPeople() {
  let people = `<div class='people'>
        ${getListPeople()}
    </div>
    <button type='button' class='btn btn-success btn-add-people my-3'>Add people</button>`;
  wrapper.insertAdjacentHTML('afterbegin', people);

  tab();
  getEditPeople();
  toggleFormAddPeople();
  getDeletePeople();
}

let tab = function () {
  let tabNav = document.querySelectorAll('.nav-link'),
    tabContent = document.querySelectorAll('.tab'),
    tabName;

  tabNav.forEach((item) => {
    item.addEventListener('click', selectTavNav);
  });

  function selectTavNav() {
    tabNav.forEach((item) => {
      item.classList.remove('active');
    });
    this.classList.add('active');
    tabName = this.getAttribute('data-tab-name');
    selectTabContent(tabName);
  }

  function selectTabContent(tabName) {
    tabContent.forEach((item) => {
      item.classList.contains(tabName)
        ? item.classList.add('tab-active')
        : item.classList.remove('tab-active');
    });
  }
};

function getListPeople() {
  let list = `<ul class='list-group mt-3'>`;
  listPeople.forEach((people) => {
    list += `<li class='list-group-item' data-id='${people.id}'>
            <p>Name: ${people.name}</p>
            <p>Age: ${people.age}</p>
            <p>Car: ${people.car.model}</p>
            <button type='button' class='btn btn-warning btn-edit'>Edit</button>
            <button type='button' class='btn btn-danger btn-delete'>Delete</button>
        </li>`;
  });
  list += '</ul>';
  return list;
}

function getFormAddPeople(name = '', age = '', carId = null) {
  let form = `<form class='form-add-people'>
        <p class='person-title add-person-title'>Add person</p>
        <div class='mb-3'>
            <input required maxlength='16' type='text' name='name' value='${name}' class='form-control' id='people-validator' placeholder='Name'>
        </div>
        <div class='mb-3'>
            <input required type='number' name='age' value='${age}' class='form-control' placeholder='Age'>
        </div>
        <div class='mb-3'>
            <p>Choose a car</p>
            <select required class='form-select' name='car'>
                ${getOptionsCar(carId)}
            </select>
        </div>
        <button type='submit' class='btn btn-info mb-3'>Add</button>
    </form>`;
  return form;
}

function getFormEditPeople(id = null, name = '', age = '', car = null) {
  let form = `<form class='form-edit-people mt-3''>
        <p class='person-title edit-person-title'>Edit person</p>
        <div><input type='hidden' name='id' value='${id}'></div>
        <div class='mb-3'>
            <input required type='text' name='name' value='${name}' class='form-control' id='people-validator' placeholder='Name'>
        </div>
        <div class='mb-3'>
            <input required type='number' name='age' value='${age}' class='form-control' placeholder='Age'>
        </div>
        <div class='mb-3'>
            <p>Choose a car</p>
            <select required class='form-select' name='car'>
                ${getOptionsCar(car.id)}
            </select>
        </div>
        <button type='submit' class='btn btn-info mb-3'>Edit</button>
    </form>`;
  return form;
}

function getEditPeople() {
  const editButtons = document.querySelectorAll('.btn-edit');
  const btnAdd = document.querySelector('.btn-add-people');

  for (const button of editButtons) {
    button.addEventListener('click', (event) => {
      const id = +event.target.parentNode.dataset.id;

      const people = JSON.parse(localStorage.getItem('people')).find(
        (person) => person.id === id
      );

      const form = document.querySelector('.form-edit-people');

      btnAdd.style.display = 'none';

      if (form) {
        form.remove();

        btnAdd.style.display = 'inline-block';
      } else {
        wrapper.insertAdjacentHTML(
          'beforeend',
          getFormEditPeople(people.id, people.name, people.age, people.car)
        );
        document
          .querySelector('.form-edit-people')
          .addEventListener('submit', handlerFormEditPeople);
      }
    });
  }
}

function getOptionsCar(carId) {
  let options = '';
  listCar.forEach((car) => {
    options += `<option ${car.id === carId ? 'selected' : ''} value='${
      car.id
    }'>${car.model}</option>`;
  });
  return options;
}

function toggleFormAddPeople() {
  document
    .querySelector('.btn-add-people')
    .addEventListener('click', function () {
      const form = document.querySelector('.form-add-people');

      const btnEdit = document.querySelectorAll('.btn-edit');
      btnEdit.forEach((item) => {
        item.style.display = 'none';
      });

      if (form) {
        form.remove();

        btnEdit.forEach((item) => {
          item.style.display = 'inline-block';
        });
      } else {
        wrapper.insertAdjacentHTML('beforeend', getFormAddPeople());
        document
          .querySelector('.form-add-people')
          .addEventListener('submit', handlerFormAddPeople);
      }
    });
}

function handlerFormAddPeople(e) {
  e.preventDefault();

  let itemPeople = new People(
    generateId(listPeople),
    this.elements.name.value,
    this.elements.age.value
  );
  let idCar = +this.elements.car.value;
  let selectCar = listCar.find((car) => car.id === idCar);
  itemPeople.setCar(selectCar);

  listPeople.push(itemPeople);

  this.remove();
  wrapper.innerHTML = '';
  displayListPeople();
  updateStorage();
}

function handlerFormEditPeople(e) {
  e.preventDefault();

  let itemPeople = new People(
    this.elements.id.value,
    this.elements.name.value,
    this.elements.age.value
  );

  let idCar = +this.elements.car.value;
  let selectCar = listCar.find((car) => car.id === idCar);
  itemPeople.setCar(selectCar);

  listPeople = listPeople.map((person) => {
    if (person.id === itemPeople.id) return itemPeople;
    else {
      return person;
    }
  });

  this.remove();
  wrapper.innerHTML = '';
  displayListPeople();
  updateStorage();
}

function getDeletePeople() {
  document.querySelector('.people').addEventListener('click', function (e) {
    let target = e.target;

    if (target.classList.contains('btn-delete')) {
      const item = target.closest('li');
      const id = Number(item.getAttribute('data-id'));
      const indexHuman = listPeople.findIndex((user) => user.id === id);
      if (indexHuman !== -1 && confirm('Delete user?')) {
        listPeople.splice(indexHuman, 1);
        item.remove();
        updateStorage();
      } else alert('Canceled');
    }
  });
}

function generateId(list) {
  let id = 0;
  if (list.length > 0) {
    id = list[list.length - 1].id + 1;
  }
  return id;
}

function updateStorage() {
  localStorage.setItem('people', JSON.stringify(listPeople));
}

// CARS
function displayListCars() {
  let cars = `<div class='cars'>
        ${getListCars()}
    </div>
    <button type='button' class='btn btn-success btn-add-cars my-3'>Add car</button>`;
  carsWrapper.insertAdjacentHTML('afterbegin', cars);

  getEditListenerCars();
  toggleFormAddCars();
  deleteCars();
}

function getEditListenerCars() {
  const editButtons = document.querySelectorAll('.btn-edit-car');
  const btnAdd = document.querySelector('.btn-add-cars');

  for (const button of editButtons) {
    button.addEventListener('click', (event) => {
      const id = +event.target.parentNode.dataset.id;

      const cars = JSON.parse(localStorage.getItem('cars')).find(
        (car) => car.id === id
      );

      btnAdd.style.display = 'none';

      const form = document.querySelector('.form-edit-cars');
      if (form) {
        form.remove();
        btnAdd.style.display = 'inline-block';
      } else {
        carsWrapper.insertAdjacentHTML(
          'beforeend',
          getFormEditCars(cars.id, cars.model, cars.price)
        );
        document
          .querySelector('.form-edit-cars')
          .addEventListener('submit', handlerFormEditCars);
      }
    });
  }
}

function getListCars() {
  let list = `<ul class='list-group mt-3'>`;
  listCar.forEach((car) => {
    list += `<li class='list-group-item' data-id='${car.id}'>
            <p>Model: ${car.model}</p>
            <p>Price: ${car.price}</p>
            <button type='button' class='btn btn-warning btn-edit-car'>Edit</button>
            <button type='button' class='btn btn-danger btn-delete'>Delete</button>
        </li>`;
  });
  list += '</ul>';
  return list;
}

function getFormAddCars(model = '', price = '') {
  let form = `<form class='form-add-cars'>
        <p class='car-title add-car-title'>Add car</p>
        <div class='mb-3'>
            <input required maxlength='32' type='text' name='model' value='${model}' class='form-control' id='cars-validator' placeholder='Model'>
        </div>
        <div class='mb-3'>
            <input required  maxlength='32' type='text' name='price' value='${price}' class='form-control' placeholder='Price'>
        </div>
        <button type='submit' class='btn btn-info mb-3'>Add</button>
    </form>`;
  return form;
}

function getFormEditCars(id = null, model = '', price = '') {
  let form = `<form class='form-edit-cars mt-2'>
        <p class='car-title edit-car-title'>Edit car</p>
        <div><input type='hidden' name='id' value='${id}'></div>
        <div class='mb-3'>
            <input required maxlength='32' type='text' name='model' value='${model}' class='form-control' id='cars-validator'>
        </div>
        <div class='mb-3'>
            <input required maxlength='32' type='text' name='price' value='${price}' class='form-control'>
        </div>
        <button type='submit' class='btn btn-info mb-3'>Edit</button>
    </form>`;
  return form;
}

function toggleFormAddCars() {
  document
    .querySelector('.btn-add-cars')
    .addEventListener('click', function () {
      const form = document.querySelector('.form-add-cars');

      const btnEdit = document.querySelectorAll('.btn-edit-car');
      btnEdit.forEach((item) => {
        item.style.display = 'none';
      });

      if (form) {
        form.remove();

        const btnEdit = document.querySelectorAll('.btn-edit-car');
        btnEdit.forEach((item) => {
          item.style.display = 'inline-block';
        });
      } else {
        carsWrapper.insertAdjacentHTML('beforeend', getFormAddCars());
        document
          .querySelector('.form-add-cars')
          .addEventListener('submit', handlerFormAddCars);
      }
    });
}

function handlerFormAddCars(e) {
  e.preventDefault();

  let itemCars = new Car(
    generateId(listCar),
    this.elements.model.value,
    this.elements.price.value
  );

  listCar.push(itemCars);

  this.remove();
  carsWrapper.innerHTML = '';
  displayListCars();
  updateCarStorage();
}

function handlerFormEditCars(e) {
  e.preventDefault();

  let itemCars = new Car(
    this.elements.id.value,
    this.elements.model.value,
    this.elements.price.value
  );

  listCar = listCar.map((car) => {
    if (car.id === itemCars.id) return itemCars;
    else {
      return car;
    }
  });

  this.remove();
  carsWrapper.innerHTML = '';
  displayListCars();
  updateCarStorage();
}

function deleteCars() {
  document.querySelector('.cars').addEventListener('click', function (e) {
    let target = e.target;

    if (target.classList.contains('btn-delete')) {
      const item = target.closest('li');
      const id = Number(item.getAttribute('data-id'));
      const indexCar = listCar.findIndex((car) => car.id === id);
      if (indexCar !== -1 && confirm('Delete car?')) {
        listCar.splice(indexCar, 1);
        item.remove();
        updateCarStorage();
      } else alert('Canceled');
    }
  });
}

function updateCarStorage() {
  localStorage.setItem('cars', JSON.stringify(listCar));
}