//To app work correct add new AppConfig.js file into this dir. It content should be like this: (If you need then change it compared with your data)
module.exports = {
    //<ROLES>
    parent_role_id: 8,
    common_user_id: 9,
    child_role_id: 10,
    super_admin_role_id: 11,
    teacher_role_id: 12,
    common_admin_role_id: 13,
    admissions_officer_role_id: 14,
    sector_admin_role_id: 15,
    //</ROLES>
    port: 8080,
    year: 2021,
    group_size: 15,
    email: {
        login: "lk_support@adtspb.ru",
        pass: ""
    },
    parentEndpoints: [
        'user', 'association', 'proposal'
    ],
    requestWhiteList: [
        "validToken", "rights", "confirm", "checkConfirmation" , "generateNewConfirmationCode"
    ],
    max_hours_week: 16,
    min_hours_week: 12,
}
