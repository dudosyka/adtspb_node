import {Timetable} from './Timetable';

let Group = function ({name, id}, timetable) {
    this.name = name;
    this.id = id;
    this.timetable = new Timetable(timetable);
}

export {Group};
