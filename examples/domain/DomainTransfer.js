/**
 * This is an example implementation of the sdk for AdonisJS (https://adonisjs.com/)
 */

"use strict";

let DomainRobot = require("@internetx/js-domainrobot-sdk").DomainRobot
let DomainRobotModels = require("@internetx/js-domainrobot-sdk").DomainRobotModels

const Logger = use("Logger")

class DomainTransfer {
    async sdk({ request, response, params }) {
        
        // Create a new Instance of the Domainrobot SDK
        // and provide your (AutoDNS) Authentication Data
        // The Option auth.context is optional for non personal 
        // AutoDNS Users but mandatory for personal ones
        let domainRobot = new DomainRobot({
            url: "http://dev-proxy-lab.intern.autodns-lab.com:10025",
            auth: {
                user: "user",
                password: "password",
                context: "4"
            }
        });

        // Create an Instance of an Domain Object
        let domainModel = new DomainRobotModels.Domain()

        // Set the Domain Name
        domainModel.name = "js-sdk-test.de"

        // Set the Nameservers
        domainModel.nameservers = [
            new DomainRobotModels.NameServer({
                'name': "nameserver-1.de"
            }),
            new DomainRobotModels.NameServer({
                'name': "nameserver-2.de"
            })
        ]

        // Query an existing Contact and get the Object
        let contactInfo = await domainRobot.contact().info(23354103)

        let contact = contactInfo.result.data[0]

        // Assign the Contact Object
        domainModel.adminc = contact
        domainModel.ownerc = contact
        domainModel.techc = contact
        domainModel.zonec = contact
        
        // Send an Request and react to Success or Error Results
        try {
            // If the Request is Successful the returned Object
            // will be of the Type DomainRobotResult
            let domainRobotResult = await domainRobot.domain().transfer(domainModel)

            Logger.transport("file").info("Request success", domainRobotResult)

            return domainRobotResult

        } catch (DomainRobotException) {
            // If the Request produces an Error the returned Object
            // will be of the Type DomainRobotException
            Logger.transport("file").error("Request error", DomainRobotException)
        }
    }
}

module.exports = DomainTransfer