const projectService = require('../services/projectRequestPartThree.service')
const emailService = require('../services/email.service')
const evaluationService = require('../services/evalAndRank.service')
const usersService = require('../services/users.service')
const moment = require('moment')

module.exports = {
    getApprovedRequests,
    sendEmail
}

function getApprovedRequests(req, res) {
    projectService.prioritizeRequests()
    Promise.all([projectService.prioritizeRequests(), evaluationService.getNumProposalsEvaluated(), usersService.getBoardMembersCount()])
        .then(result => {
            let projectsFilteredByApproved = result[0];
            let allEvals = result[1];
            let numBoardMembers = result[2];
            for (let i = 0; i < projectsFilteredByApproved.length; i++) {
                innerloop: for (let j = 0; j < allEvals.length; j++) {
                    if ((projectsFilteredByApproved[i]._id).toString() == allEvals[j]._id) {
                        projectsFilteredByApproved[i].numEvals = allEvals[j].numberOfEvalsForThisRequest
                        break innerloop;
                    } else {
                        if (j == allEvals.length - 1) {
                            projectsFilteredByApproved[i].numEvals = 0
                        }
                    }
                }
                projectsFilteredByApproved[i].numEvals += " out of " + numBoardMembers
                projectsFilteredByApproved[i].days = projectsFilteredByApproved[i].createDate ? moment.utc(projectsFilteredByApproved[i].createDate).fromNow() : "Unknown"
            }
            res.send(projectsFilteredByApproved)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

usersService.sendEmail(req.model.contact)
    .then(data => {
        if (data && data.notificationOptions) {
            if (data.notificationOptions.email) {
                const emailBody = 'Email body text goes here...'
                const email = req.model.contact
                const submitMailHtml = /* removed for brevity ... */'<div class="bodytext" style={{ "font-size": "14px" }}><span class="headline" style={{ "font-weight": "bold", "font-size": "24px", "text-shadow": "3px 2px #000000" }}>PROJECT STATION - ' + date + '</span><p>' + emailBody + '</p><p>Please do not reply to this email as this inbox is not monitored. If you feel you have received this message in error, plese disregard this email .....' // removed for brevity...
                const submitMailSubject = 'Project Station subject text goes here ... ' // removed for brevity...
                emailService.sendEmail(email, submitMailHtml, submitMailSubject)
                res.send(data)
            } else {
                console.log("Email not sent. Email notifications are turned off")
                res.send(data)
            }
        }
    })
    .catch(err => {
        console.log('Could not send email.', err)
        res.status(500)
        res.end()
    })
