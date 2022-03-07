function People(id, name, age) {
    this.id = +id;
    this.name = name;
    this.age = age;
}

People.prototype.setCar = function(car) {
    this.car = car;
}