const baseUrl = 'http://localhost:5000'


const Endpoints = {
    notCompleter: `${baseUrl}/notCompleter`,
    taskDashboard: `${baseUrl}/taskDashboard`,
    changeStatus:`${baseUrl}/changeStatus`,
    addRevision:`${baseUrl}/addRevision`,
    getDoer:`${baseUrl}/getDoer`,
    deleteDoer:`${baseUrl}/delete-Doer`,
    editDoer:`${baseUrl}/edit-Doer`,
    taskDelegation:`${baseUrl}/taskDelegation`,
    addDoer:`${baseUrl}/add-Doer`,
    sendotp:`${baseUrl}/send-otp`,
    verityotp:`${baseUrl}/verity-otp`,
    adminLogin:`${baseUrl}/adminLogin`,
}

export default Endpoints