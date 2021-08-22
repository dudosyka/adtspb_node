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

Admin.getProposals = async function(association_id) {
	const req = `
		query ($association_id: Int) {
		    admin {
		        association_proposal_list (association_id: $association_id) {
		            id,
		            child {
		                id, name, surname, lastname
		            },
		            status {
		                id, text
		            },
		            parent {
		                id, name, surname, lastname
		            }
		        }
		    }
		}
	`

	const data = { association_id }

	return await _request('api', req)
		.then( data => {
			console.log(data)
			return data
		})
		.catch( err => console.error(err))
}

Admin.editUserData = async function (id, dataOnEdit) {
	const req = `
		mutation ($input: UserInput) {
			admin {
				edit_user (input: $input)
			}
		}
	`;

	const data = {
		input: {
			id,
			...dataOnEdit
		}
	};

	return await __request('api', req, data).then(res => {
		console.log(res);
		return res.admin ?? res;
	})
}

Admin.confirmDataEditing = async function (request) {
	const req = `
		mutation ($request: Int) {
			user {
				confirmEditData (request_id: $request)
			}
		}
	`;

	const data = {
		request
	};

	return await _request('api', req, data).then(res => {
		console.log(res);
		return res.user ?? res;
	});
}

Admin.confirmChildDeleting = async function (link) {
	const req = `
		mutation ($link: Int) {
			user {
				confirmChildDeleting (link: $link)
			}
		}
	`;

	const data = {
		link
	};

	return await _request('api', req, data).then(res => {
		console.log(res);
		return res.user ?? res;
	});
}

export {Admin};
