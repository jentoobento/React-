/**
* sample of chat modal using websocket
*/

import React from 'react'
import { Modal } from 'react-bootstrap'
import * as usersService from '../services/users.service'
import './chatModal.css'

class ChatModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            messagesComingIn: [],
            allUsers: [],
            recipientId: 'ALL',
            recipientName: 'ALL',
            webSocketConnection: '',
            errorMsg: ''
        }
        this.onChange = this.onChange.bind(this)
        this.personClickHandler = this.personClickHandler.bind(this)
        this.onSubmitHandler = this.onSubmitHandler.bind(this)
    }

    componentDidMount() {
        usersService.readAll()
            .then(result => {
                result.unshift({
                    "_id": "ALL",
                    "firstName": "ALL",
                    "lastName": "",
                    "imageUploadUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Group_font_awesome.svg/2000px-Group_font_awesome.svg.png"
                })
                this.setState({
                    allUsers: result
                })
            })
            .catch(error => console.log('Failed to get all users:', error))
    }

    componentWillReceiveProps(futureProps) {
        if (futureProps.webSocketConnection !== this.props.webSocketConnection) {
            this.setState({
                webSocketConnection: futureProps.webSocketConnection
            })
        }

        if (futureProps.messagesComingIn !== this.props.messagesComingIn) {
            this.setState({
                messagesComingIn: futureProps.messagesComingIn
            })
        }
    }

    onChange(e) {
        this.setState({
            text: e.target.value,
            errorMsg: ''
        })
    }

    personClickHandler(e) {
        this.setState({
            recipientName: e.target.title ? e.target.title : e.target.children[0].title,
            recipientId: e.target.id ? e.target.id : e.target.parentElement.id
        })
    }

    onSubmitHandler(e) {
        e.preventDefault();
        let message = this.state.text
        if (message.trim()) {
            let messageToSend = {
                senderId: this.props.currentUser._id,
                senderName: this.props.currentUser.firstName,
                recipientId: this.state.recipientId,
                recipientName: this.state.recipientName,
                userName: this.props.currentUser.firstName,
                message: message,
                notificationType: 'chat'
            }
            this.props.webSocketConnection.send(JSON.stringify(messageToSend))
            this.setState({
                text: ''
            })
        } else {
            console.log('Cannot send an empty message!')
            this.setState({
                errorMsg: 'Your message is empty!'
            })
        }
    }

    render() {
        const usersArr = this.state.allUsers.map(person => { // populate chat buttons
            if (person._id !== this.props.currentUser._id) { // do not add yourself to the buttons (cant send message to yourself)
                let personStyle = {}
                personStyle.backgroundColor = person._id === this.state.recipientId ? "#1B78D6" : "#E6EEF1" // indicate which person is currently selected
                personStyle.color = "white"
                personStyle.cursor = "pointer"
                personStyle.padding = '3px'
                personStyle.marginBottom = '5px'

                return ( // render the buttons as a bunch of divs
                    <div key={person._id} className="rounded" id={person._id} onClick={this.personClickHandler} style={personStyle} >
                        <img src={person.imageUploadUrl ? person.imageUploadUrl : "https://research.kent.ac.uk/theoryandsimulation/wp-content/plugins/wp-person-cpt/images/featured-default.png"} title={person.firstName ? person.firstName : "Undefined"} width="40px" height="40px" alt="Profile Pic" />
                        <br />
                    </div>
                )
            }
        })

        var i = 0
        const messagesArr = this.state.messagesComingIn ? this.state.messagesComingIn.filter(item => item.message) : null
        const messages = messagesArr ? messagesArr.map(item => {
            const timeArr = item.createDate.split('T')[1].split(':')
            let hours = timeArr[0]
            if (hours > 12) hours -= 12
            let mins = timeArr[1]
            let time = hours + ':' + mins
            let messageStyle = {}
            messageStyle.paddingBottom = '5px'
            let messageColor = {}
            messageColor.padding = '5px'
            let messageHtml;
            let flag = false;
            // for broadcast messages
            if (item.recipientId === 'ALL' && this.state.recipientId === 'ALL') { 
                flag = true;
                item.senderId === this.props.currentUser._id ? messageStyle.marginLeft = "100px" : messageStyle.marginRight = "100px"
                messageColor.backgroundColor = item.senderId === this.props.currentUser._id ? "#33a5fc" : "#e4e4ea"
                messageColor.color = item.senderId === this.props.currentUser._id ? "white" : "black"
                messageHtml = <h4 style={{ "display": "inline" }}>{item.senderName}: {item.message}</h4>
            }

            // for individual messages, private messages between 2 people
            if ((item.senderId === this.props.currentUser._id && item.recipientId === this.state.recipientId)
                || (item.senderId === this.state.recipientId && item.recipientId === this.props.currentUser._id)) {
                flag = true
                item.recipientId === this.props.currentUser._id ? messageStyle.marginRight = "100px" : messageStyle.marginLeft = "100px"
                messageColor.backgroundColor = item.recipientId === this.props.currentUser._id ? "#e4e4ea" : "#33a5fc"
                messageColor.color = item.recipientId === this.props.currentUser._id ? "black" : "white"
                messageHtml = <h4 style={{ "display": "inline" }}>{item.message}</h4>
            }

            if (flag) {
                return (
                    <div style={messageStyle} key={i++}>
                        <li
                            className='mb5 rounded'
                            style={messageColor}>
                            <div style={{ "display": "inline-block" }}>
                                <span style={{ "display": "inline", "margin": "10px", "fontSize": "8px" }}>{time} </span>
                                {messageHtml}
                            </div>
                        </li>
                    </div>
                )
            }
        }) : null

        return (
            <React.Fragment>
                <Modal show={this.props.showModal} onHide={this.props.closeModalHandler} >
                    <div className="chat-modal" >
                        <div className="row">
                            <div className="panel-heading chat-heading">
                                <div className="pull-left">
                                    <h3 className="panel-title">Message Center - Your Messages with {this.state.recipientName}</h3>
                                </div>
                                <div className="pull-right">
                                    <button className="btn btn-sm" data-action="remove" data-container="body" data-toggle="tooltip" data-placement="top" data-title="Remove" data-original-title="" title="" onClick={this.props.closeModalHandler}><i className="fa fa-times"></i></button>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="col-md-2">
                                <div className="panel panel-theme rounded shadow" style={{ "paddingLeft": "5px" }}>
                                    {usersArr}
                                </div>
                            </div>
                            <div className="col-md-10">
                                <div className="panel panel-theme rounded shadow">
                                    <div className="panel-body" >
                                        <form onSubmit={this.onSubmitHandler} className="form-horizontal form-bordered"

                                            id="basic-validate"
                                            action="#"
                                            noValidate="novalidate">
                                            <div className="form-body">
                                                <ul className='list-group' style={{ "listStyleType": "none" }}>{messages}</ul>
                                                {this.state.errorMsg && <p style={{ "color": "red" }}>{this.state.errorMsg}</p>}
                                                <input
                                                    className='form-control rounded'
                                                    type='text'
                                                    placeholder='Type something here. Press Enter to Send.'
                                                    value={this.state.text}
                                                    onChange={this.onChange} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal.Footer>
                        <button
                            type="button"
                            onClick={this.props.closeModalHandler}
                            className="btn btn-danger">Close</button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment >
        )
    }
}

export default ChatModal
