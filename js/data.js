let listPeople = [];
let listCar = [];

const savedListPeople = localStorage.getItem('people');
if (savedListPeople) {
    listPeople = JSON.parse(savedListPeople).map((people) => Object.assign(new People(), people));
}

const savedListCars = localStorage.getItem('cars');
if (savedListCars) {
    listCar = JSON.parse(savedListCars).map((cars) => Object.assign(new Car(), cars));
}