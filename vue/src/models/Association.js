import {Parser} from "../utils/Parser";
import {Timetable} from "./Timetable";

const Association = {}

function associationDataProcessing(association) {
    if (association.groups)
        association.groups.map(el => {
            el.timetable = new Timetable(el.timetable);
        });

    return association;
}

Association.getAssociations = async function(fields = null, child_id) {
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
            groups: {
                name: null,
                num: null,
                timetable: {
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
    }

    const req = `
        query ($child_id: Int) {
          getAssociationsForChild (child_id: $child_id) {
            ` + Parser.objToGraphQlQuery(fields) + `
          }
        }
    `;

    const data = {
        child_id: Number(child_id)
    }

    return _request("api", req, data)
        .then(data => {
            return data.getAssociationsForChild.map(association => associationDataProcessing(association));
        })
        .catch(err => console.error(err));

}

Association.createTimetable = function() {

}

export {Association}
