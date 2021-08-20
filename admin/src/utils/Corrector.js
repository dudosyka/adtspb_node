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

Corrector.weekDayByNumber = function (number) {
  switch(number) {
    case 0: 
      return 'понедельник'
      break;
    case 1:
      return 'вторник'
      break;
    case 2: 
      return 'среда'
      break;
    case 3: 
      return 'четверг'
      break;
    case 4:
      return 'пятница'
      break;
    case 5:
      return 'суббота'
      break;
    case 6:
      return 'воскресенье'
      break;
  }
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

Corrector.userField = function (field) {
    const correct = {
        birthday: "Дата рождения",
        disability: "Инвалидность",
        disability_group: "Группа инвалидности",
        ovz: "ОВЗ",
        ovz_type: "Тип ОВЗ",
        registration_address: "Адрес регистрации",
        registration_flat: "Квартира по адресу регистрации",
        relationship: " Степень родства",
        residence_address: "Адрес проживания",
        residence_flat: "Квартира по адресу проживания",
        state: "Гражданство",
        studyPlace: "Место обучения",
    };
    return correct[field];
}

export {Corrector}
