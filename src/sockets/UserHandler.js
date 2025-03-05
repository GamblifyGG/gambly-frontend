
const { useContext } = require("react");



const HandleUser = (socket, io) => {
    // context

    // const setDepositAlerts = (depositAlerts) => {
    //     setUserSettings({ ...userSettings, depositAlerts: depositAlerts })
    //     // after 3 seconds, remove the alert
    //     setTimeout(() => {
    //         setUserSettings({ ...userSettings, depositAlerts: depositAlerts.filter((alert) => alert !== data) })
    //     }, 3000)
    // }


    socket.on('balanceUpdated', (data) => {
        console.log("balanceUpdated", data)
        // setUserSettings({ ...userSettings, balance: data })
    })


    socket.on('deposit', (data) => {
        console.log("deposit", data)
        // setDepositAlerts([...depositAlerts, data])
        // setTimeout(() => {
        //     setDepositAlerts(depositAlerts.filter((alert) => alert !== data))
        // }, 10000)
    })
}

module.exports = HandleUser;