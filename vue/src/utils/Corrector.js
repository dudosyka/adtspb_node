const Corrector = {}

Corrector.translateWeekDay = function (day) {
    if (day === 'monday') return 'понедельник';
    if (day === 'tuesday') return 'вторник';
    if (day === 'wednesday') return 'среда';
    if (day === 'thursday') return 'четверг';
    if (day === 'friday') return 'пятница';
    if (day === 'saturday') return 'суббота';
    if (day === 'sunday') return 'воскресенье';
}

Corrector.phone = function (phone) {
    return phone.length < 11 ? "8" + phone : phone;
}

Corrector.correctYears = function (years) {
  if (years > 1) {
    return ' года'
  } else {
    return ' год'
  }
}

Corrector.correctLessons = function (lessons) {
  if (lessons === 1 || lessons > 4) {
    return ' раз'
  } else {
    return ' раза'
  }
}

Corrector.correctHours = function (hours) {
  if (hours == 1) {
    return ' час'
  } else if (hours < 5) {
    return ' часа'
  } else {
    return ' часов'
  }
}

export {Corrector}
