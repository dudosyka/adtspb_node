import {Parser} from "../utils/Parser";
import {Group} from "./Group";
import {Timetable} from "./Timetable";

const Association = {}

function associationDataProcessing(association) {
    //1. create new arr for timetable
    //2. create new obj with keys: group, timetable
    //3. sort data to new obj
    //4. create new obj with constructor and push to arr
    //5. delete old key timetable

    association.groups = [];

    for (let timetables of association.timetable) {
        let group = {};
        let timetable = {};

        for (let el in timetables) {
            if (el === 'group') {
                group = timetables[el];
            } else {
                timetable[el] = timetables[el];
            }
        }

        association.groups.push(new Group(group, timetable));
        delete association.timetable
    }
    return association;
}

Association.getAssociations = async function(fields = null) {
    if (fields === null) {
        fields = {
            id: null,
            name: null,
            description: null,
            min_age: null,
            max_age: null,
            study_years: null,
            hours_week: null,
            lessons_week: null,
            study_form: null,
            hours_count: null,
            study_period: null,
            isRecruiment: null,
            timetable: {
                group: {
                    id: null,
                    name: null
                },
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null,
            }
        }
    }

    const req = `
        query {
          getAssociations {
            ` + Parser.objToGraphQlQuery(fields) + `
          }
        }
    `;

    return _request("api", req)
        .then(data => {
            return data.getAssociations.map(association => associationDataProcessing(association));
        })
        .catch(err => console.error(err));

}

Association.createTimetable = function() {

}

export {Association}
