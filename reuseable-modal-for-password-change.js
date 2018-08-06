/**
* modal that allows password changes
*/

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import * as usersService from "../services/users.service";
import { onChange, showFormErrors } from "../helpers/validation.helper";
import * as logOut from '../../src/helpers/logOut.helper'

class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                currentPassword: '',
                password: '',
                passwordConfirm: ''
            },
            showModal: false,
            refs: {},
            errors: {},
            message: ''
        }
        this.onChange = onChange.bind(this)
    }

    showModal = (e) => {
        this.setState({
            showModal: true
        })
    }

    closeModal = (e) => {
        this.setState({
            currentPassword: '',
            password: '',
            passwordConfirm: '',
            showModal: false
        })
    }

    changePasswordHandler = (refs) => {
        /* removed for brevity */
        const passwordData = {}
        passwordData.oldPassword = this.state.formData.currentPassword
        passwordData.newPassword = this.state.formData.password

        usersService.changePassword(passwordData)
            .then(response => {
                /* removed for brevity */
                usersService.update(data, this.props.currentUser._id)
                    .then(response => {
                        logOut.logOutAndRedirect()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                /* removed for brevity */
                console.log(error)
            })
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    type="button"
                    classNme="btn btn-success"
                    fileType={this.props.fileType}
                    onClick={this.showModal}>Change Password
                </Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-theme rounded shadow">
                                <div className="panel-heading">
                                    <div className="pull-left">
                                        <h3 className="panel-title">Change Your Password</h3>
                                    </div>
                                    <div className="pull-right">
                                        <button className="btn btn-sm" data-action="remove" data-container="body" data-toggle="tooltip" data-placement="top" data-title="Remove" data-original-title="" title="" onClick={this.closeModal}><i className="fa fa-times"></i></button>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="panel-body">
                                    <form className="form-horizontal form-bordered"
                                        id="basic-validate"
                                        action="#"
                                        noValidate="novalidate">
                                        <div className="form-body">
                                            <div style={{ "color": "red", "text-align": "center", "font-weight": "bold" }}>{this.state.message}</div>
                                            <div id="currentPasswordLabel" className={"form-group " + (this.state.errors.currentPassword ? "has-error" : '')}>
                                                <label className="col-sm-3 control-label" htmlFor="currentPassword">Current Password</label>
                                                <div className="col-sm-9 col-lg-7">
                                                    <input
                                                        type='password'
                                                        name='currentPassword'
                                                        ref='currentPassword'
                                                        className='form-control rounded'
                                                        placeholder='Enter your current password'
                                                        value={this.state.formData.currentPassword}
                                                        onChange={this.onChange}
                                                        required>
                                                    </input>
                                                    <div className="asterisk">{this.state.errors && this.state.errors.currentPassword}</div>
                                                </div>
                                            </div>
                                            <div id="passwordLabel" className={"form-group " + (this.state.errors.password ? "has-error" : '')}>
                                                <label className="col-sm-3 control-label" htmlFor="password">New Password</label>
                                                <div className="col-sm-9 col-lg-7">
                                                    <input
                                                        type='password'
                                                        name='password'
                                                        ref='password'
                                                        pattern=".{7,}"
                                                        className='form-control rounded'
                                                        placeholder='Enter your new password'
                                                        value={this.state.formData.password}
                                                        onChange={this.onChange}
                                                        required>
                                                    </input>
                                                    <div className="asterisk">{this.state.errors && this.state.errors.password}</div>
                                                </div>
                                            </div>
                                            <div id="passwordConfirmLabel" className={"form-group " + (this.state.errors.passwordConfirm ? "has-error" : '')}>
                                                <label className="col-sm-3 control-label" htmlFor="passwordConfirm">Re-enter New Password</label>
                                                <div className="col-sm-9 col-lg-7">
                                                    <input
                                                        type='password'
                                                        name='passwordConfirm'
                                                        ref='passwordConfirm'
                                                        className='form-control rounded'
                                                        placeholder='Re-enter your new password'
                                                        value={this.state.formData.passwordConfirm}
                                                        onChange={this.onChange}
                                                        required>
                                                    </input>
                                                    <div className="asterisk">{this.state.errors && this.state.errors.passwordConfirm}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal.Footer>
                        <div className="pull-left">
                            <button
                                type="button"
                                className="btn btn-theme"
                                onClick={() => this.changePasswordHandler(this.props.refs)}>Save and Sign Out</button>
                        </div>
                        <button
                            type="button"
                            onClick={this.closeModal}
                            className="btn asterisk">Close</button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}

export default ChangePasswordModal
