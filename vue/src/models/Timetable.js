import {Corrector} from '../utils/Corrector';

let Timetable = function (timetable) {
    this.week = {}
    this.show = false;

    for (let day in timetable) {
      if (timetable[day] !== '-') {
        const dayRusName = Corrector.translateWeekDay(day)
        this.week[day] = {time: timetable[day], name: dayRusName}
      }
    }
}

export {Timetable};
