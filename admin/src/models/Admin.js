import {Parser} from '../utils/Parser'

let Admin = {};

Admin.editAssociationData = async function(data) {
	const req = `
		mutation ($input: AssociationInput) {
		    admin {
		        edit_association (input: $input) 
		    }
		}
	`

	var data = {

	}

	return await _request('api', req, data)
		.then( data => {
			console.log(data)
			return data
		} )
		.catch( err => console.error(err) )
}

Admin.getDataOnEdit = async function(search) {
	const req = `
		query ($search: String) {
		    admin {
		        user_data_on_edit (search: $search) {
		            id,
		            target {
		                surname, name, lastname
		            },
		            requester {
		                surname, name, lastname
		            },
		            field,
		            old_value,
		            new_value
		        }
		    }
		}
	`

	var data = { search }
	console.log(data)

	return await _request('api', req, data)
		.then( data => {
			console.log(data.admin.user_data_on_edit)
			return data.admin.user_data_on_edit
		} )
		.catch( err => console.error(err) )
}

Admin.getChildOnDelet = async function() {
	const req = `
		query {
		    admin {
		        child_on_delete {
		            id,
		            child {
		                surname, name, lastname
		            },
		            parent {
		                surname, name, lastname
		            },
		            comment,
		            remove,
		        }
		    }
		}
	`

	return await _request('api', req)
		.then( data => {
			console.log(data.admin.child_on_delete)
			return data.admin.child_on_delete
		} )
		.catch( err => console.error(err) )
}

Admin.confirmRemoveChild = async function(link) {
	const req = `
		mutation ($link: Int) {
		    user {
		        confirmRemoveChild (link: $link)
		    }
		}
	`
	let data = {
		"link": link
	}

	return await _request('api', req, data)
		.then( data => {
			console.log(data)
			return data
		} )
		.catch( err => console.error(err) )
}

Admin.getStat = async function() {
	const req = `
		query {
		    admin {
		        stat {
		            parent_amount,
		            child_amount,
		            proposal_amount,
					proposal_amount_document_taken,
					proposal_reserve_amount,
		            associations {
		                id, name, planned, actual, fullness_percent, document_taken, group_amount
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

Admin.getAssociations = async function(
	fields = {
		id: null,
		name: null,
		description: null,
		closed: null,
		min_age: null,
		max_age: null,
		study_years: null,
		hours_week: null,
		lessons_week: null,
		study_form: null,
		hours_count: null,
		study_period: null,
		isRecruiment: null,
		proposals: {
			id: null,
			child: {
				id: null,
				name: null,
				surname: null,
			},
			parent: {
				id: null,
				name: null,
				surname: null,
			},
			isReserve: null
		},
		groups: {
			id: null,
			name: null,
			timetable: {
				week: null
			}
		}
	},
	id = null
)
{
	const req = `
		query {
		    admin {
		        get_all_associations {
		            ` + Parser.objToGraphQlQuery(fields) + `
		        }
		    }
		}
	`;

	return await _request('api', req)
		.then(data => {
			return(data.admin.get_all_associations);
		})
		.catch( err => console.error(err));
}

Admin.getAssociationById = async function (
	fields = {
		id: null,
		name: null,
		description: null,
		closed: null,
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
			id: null,
			name: null,
			timetable: {
				week: null
			},
			students: {
				id: null,
				surname: null,
				name: null,
				lastname: null,
				email: null,
				phone: null
			}
		},
	},
	id
) {
	const req = `
		query ($id: Int) {
		    association {
		        getById (id: $id) {
		            ` + Parser.objToGraphQlQuery(fields) + `
		        }
		    }
		}
	`;

	return await _request('api', req, { id })
		.then(data => {
			return(data.association.getById);
		})
		.catch( err => console.error(err));
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

	return await _request('api', req, data).then(res => {
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
		"request": request
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
