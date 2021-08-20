let Admin = {};

Admin.confirmRemoveChild = async function(link) {
	const req = `
		mutation($link: Int) { 
		    confirmRemoveChild(link: $link)
		}
	`
	let data = {
		link
	}


}

Admin.getStat = async function() {
	const req = `
		query {
		    admin {
		        stat {
		            parent_amount,
		            child_amount,
		            proposal_amount,
		            associations {
		                id, name, planned, actual, fullness_percent
		            }
		        }
		    }
		}
	`

	return await _request('api', req)
		.then(data => {
			console.log(data.admin.stat)
			return data.admin.stat
		})
		.catch( err => console.error(err))
}

Admin.getAssociations = async function() {
	const req = `
		query {
		    association {
		        getAll {
		            id, 
		            name, 
		            description,  
		            closed,
		            min_age,
		            max_age,
		            study_years,
		            hours_week,
		            lessons_week,
		            study_form,
		            hours_count,
		            study_period,
		            isRecruiment,
		            groups { id, name, timetable { week } },
		        }
		    }
		}
	`

	return await _request('api', req)
		.then(data => {
			console.log(data)
			return(data.association.getAll)
		})
		.catch( err => console.error(err))
}

export {Admin};