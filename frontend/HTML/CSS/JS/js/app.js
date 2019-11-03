// name our angular app
angular.module('firstApp', [])

.controller('mainController', function() {
    // bind this to vm (view-model)
    var vm = this;

    //define variables and objects on this
    // this lets them be available to uour views

    // define a base variable
    vm.message = 'Basic Angular! CNPM Moi!';

    // define a list items
    vm.computers = [
        { name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
        { name: 'Yoga 5 Pro', color: 'Gray', nerdness: 6 },
        { name: 'Chormebook', color: 'Black', nerdness: 5 }
    ];
});