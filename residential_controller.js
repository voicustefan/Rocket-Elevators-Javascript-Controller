//const { isEmpty, reverse } = require("lodash");
//Global variables 
// let _floor;
// let _id;
// let _direction;
// let elevator;
// let floorRequestButtonsList = [];
// let floorRequestList = [];
// let elevatorID = 1;
//let floorRequestButtonID;



class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
        this.ID = _id;
        this.status = '';
        this.elevatorList = [];
        this.callButtonList = [];
        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);
    };

    createCallButtons(_amountOfFloors) {
        let buttonFloor = 1;
        let callButtonID = 1;
        for (var i = 0; i < _amountOfFloors; i++) {
            if (buttonFloor < _amountOfFloors) {
                let callButton = new CallButton(callButtonID, 'OFF', buttonFloor, 'up');
                //callButton._id = OFF;
                //callButton._buttonFloor = UP;
                this.callButtonList.push(callButton);
                callButton.ID++;
            }
            if (buttonFloor > 1) {
                let callButton = new CallButton(callButtonID, 'OFF', buttonFloor, 'down');
                this.callButtonList.push(callButton);
                callButton.ID++;
            }
            buttonFloor++;
        }
        // createElevators(_amountOfFloors, _amountOfElevators);
    }

    createElevators(_amountOfFloors, _amountOfElevators) {
        let elevatorID = 1;
        for (var j = 0; j < _amountOfElevators; j++) {
            let elevator = new Elevator(elevatorID, _amountOfFloors);
            this.elevatorList.push(elevator);
            elevatorID += 1;
        }
        // this.requestElevator(_floor, _direction);
        console.log('Number of elevators');
        console.log(this.elevatorList);
    }

    requestElevator(floor, direction) {
        console.log('floor and direction');
        console.log(floor, direction);
        let elevator = this.findElevator(floor, direction);
        // this.findElevator(_floor, _direction);
        console.log(elevator);
        elevator.floorRequestList.push(floor);
        elevator.move();
        console.log(elevator);
        // elevator.operateDoors();
        return elevator;
    }

    findElevator(_requestedFloor, _requestedDirection) {
        let _bestElevator;
        let _bestScore = 5;
        let _referenceGap = 10000000;
        let _bestElevatorInformations;
        let _scoreToCheck;
        for (var k = 0; k < this.elevatorList.length; k++) {
            //The elevator is at my floor and going in the direction I want
            if (_requestedFloor == this.elevatorList[k].currentFloor && this.elevatorList[k].status == 'stopped' && _requestedDirection == this.elevatorList[k].direction) {
                _scoreToCheck = 1;
                _bestElevatorInformations = this.checkIfElevatorIsBetter(_scoreToCheck, this.elevatorList[k], _bestScore, _referenceGap, _bestElevator, _requestedFloor);
                //The elevator is lower than me, is coming up and I want to go up
            } else if (_requestedFloor > this.elevatorList[k].currentFloor && this.elevatorList[k].direction == 'up' && _requestedDirection == this.elevatorList[k].direction) {
                _scoreToCheck = 2;
                _bestElevatorInformations = this.checkIfElevatorIsBetter(_scoreToCheck, this.elevatorList[k], _bestScore, _referenceGap, _bestElevator, _requestedFloor);
                //The elevator is higher than me, is coming down and I want to go down
            } else if (_requestedFloor < this.elevatorList[k].currentFloor && this.elevatorList[k].direction == 'down' && _requestedDirection == this.elevatorList[k].direction) {
                _scoreToCheck = 2;
                _bestElevatorInformations = this.checkIfElevatorIsBetter(_scoreToCheck, this.elevatorList[k], _bestScore, _referenceGap, _bestElevator, _requestedFloor);
                //The elevator is idle
            } else if (this.elevatorList[k].status == 'idle') {
                // this.elevatorList[k]._id = 3;
                _scoreToCheck = 3;
                _bestElevatorInformations = this.checkIfElevatorIsBetter(_scoreToCheck, this.elevatorList[k], _bestScore, _referenceGap, _bestElevator, _requestedFloor);
                //The elevator is not available, but still could take the call if nothing better is found
            } else {
                //this.elevator._id = 4
                _scoreToCheck = 4;
                _bestElevatorInformations = this.checkIfElevatorIsBetter(_scoreToCheck, this.elevatorList[k], _bestScore, _referenceGap, _bestElevator, _requestedFloor);
            }
            _bestElevator = _bestElevatorInformations[0];
            _bestScore = _bestElevatorInformations[1];
            _referenceGap = _bestElevatorInformations[2];
        }
        return _bestElevator;
    }

    checkIfElevatorIsBetter(_scoreToCheck, _newElevator, _bestScore, _referenceGap, _bestElevator, floor) {
        if (_scoreToCheck < _bestScore) {
            _bestScore = _scoreToCheck;
            _bestElevator = _newElevator;
            _referenceGap = Math.abs(_newElevator.currentFloor - floor);
        } else if (_bestScore == _scoreToCheck) {
            let _gap = Math.abs(_newElevator.currentFloor - floor);
            if (_referenceGap > _gap) {
                _bestElevator = _newElevator;
                _referenceGap = _gap;
            }
        }
        let _bestElevatorInformations = [_bestElevator, _bestScore, _referenceGap];
        return _bestElevatorInformations;
    }
}

class Elevator {
    constructor(_id, _amountOfFloors) {
        this.ID = _id;
        // this._id = 1;
        this.status = '';
        this.currentFloor = 1;
        this.direction = null;
        this.door = new Door(_id, 'closed');
        this.floorRequestButtonList = [];
        this.floorRequestList = [];
        this.createFloorRequestButtons(_amountOfFloors);
    }

    createFloorRequestButtons(_amountOfFloors) {
        let buttonFloor = 1;
        // let elevator = new Elevator();
        let floorRequestButtonID = 1;
        for (var l = 0; l < _amountOfFloors; l++) {
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, buttonFloor);
            this.floorRequestButtonList.push(floorRequestButton);
            buttonFloor += 1;
            floorRequestButtonID += 1;
        }
        //console.log(this.floorRequestButtonList);
    }
    // //Simulate when a user press a button inside the elevator
    requestFloor(floor) {
        console.log('floor');
        console.log(floor);
        this.floorRequestList.push(floor);
        this.move();
        // this.operateDoors();
    }

    move() {
        while (this.floorRequestList.length != 0) {
            let _destination = this.floorRequestList[0];
            this.status = 'moving';
            if (this.currentFloor < _destination) {
                this.direction = 'up';
                this.sortFloorList();
                while (this.currentFloor < _destination) {
                    this.currentFloor++;
                    this._screenDisplay = this.currentFloor;
                }
            } else if (this.currentFloor > _destination) {
                this.direction = 'down';
                this.sortFloorList();
                while (this.currentFloor > _destination) {
                    this.currentFloor--;
                    this._screenDisplay = this.currentFloor;
                }
            }
            this.status = 'stopped';
            this.floorRequestList.shift();
            console.log('current floor');
            console.log(this.currentFloor);
        }
        this.status = 'idle';
    }

    sortFloorList() {
        if (this.direction == 'up') {
            this.floorRequestList.sort(function (a, b) { return a - b })
        }
        else {
            this.floorRequestList.sort(function (a, b) { return b - a })
        }
    }

    operateDoors() {
        let overweight;
        let obstruction;
        this.door.status = 'open';
       // setTimeout(() => { console.log(" "); }, 5000);
        if (!overweight) {
            this.door.status = 'closing';
            if (!obstruction) {
                this.door.status = 'closed';
            } else {
                this.operateDoors();
            }
        }
    }

}

class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = 'OFF';
        this.floor = _floor;
        this.direction = _direction;
    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = 'OFF';
        this.floor = _floor;
    }
}

class Door {
    constructor(_id) {
        this.ID = _id;
        this.status = 'closed';
    }
}

module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }

// const column = new Column(1, 10, 2);
// column.elevatorList[0]._currentFloor = 2;
// column.elevatorList[1]._currentFloor = 6;
// const elevator = column.requestElevator(3, 'up');
// elevator.requestFloor(7);
// console.log(elevator);

/*Scenario 2*/
//const column = new Column(1, 10, 2);
//column.elevatorList[0].currentFloor = 10;
//column.elevatorList[1].currentFloor = 3;
//Part 1
//const elevator = column.requestElevator(1, 'Up');
//elevator.requestFloor(6);
//console.log(elevator);
/*Part 2
const elevator = column.requestElevator(3, 'Up');
elevator.requestFloor(5);
console.log(elevator);*/
/*Part 3
const elevator = column.requestElevator(9, 'Down');
elevator.requestFloor(2);
console.log(elevator);*/
/*Scenario 3
const column = new Column(1, 'online', 10, 2);
column.elevatorList[0].currentFloor = 10;
column.elevatorList[1].currentFloor = 3;
column.elevatorList[1].status = 'moving';
column.elevatorList[1].floorRequestList.push(6);*/
/*Part 1
const elevator = column.requestElevator(3, 'Down');
elevator.requestFloor(2);
console.log(elevator);*/
/*Part 2
const elevator = column.requestElevator(10, 'Down');
elevator.requestFloor(3);
console.log(elevator);*/