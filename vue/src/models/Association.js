const Association = {}

Association.getAssociations = async function() {
    const req = `
        query {
          getAssociations {
            id,
            name,
            description,
            min_age, max_age,
            study_years,
            hours_week, lessons_week,
            study_form,
            hours_count,
            study_period,
            isRecruiment,
            timetable {
              group { id, name }
              monday, tuesday, wednesday, thursday, friday, saturday, sunday
            },
          }
        }
    `;

    return await _request("api", req)
        .then(data => {
            return data.getAssociations
        })

}

Association.createTimetable = function() {

}

export {Association}
