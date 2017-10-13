/** @jsx React.DOM */
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */


var Profile = React.createClass({
  getInitialState: function() {
    return {
      name: "",
      description : "",
    };
  },

  handleClick: function() {
    this.props.link_state("settings").requestChange(
      new AtcSettings().mergeWithDefaultSettings(this.props.profile.content)
    );
  },

  updateName: function(event) {
    this.setState({name: event.target.value});
  },

  updateDescription: function(event) {
    this.setState({description: event.target.value});
  },

  removeProfile: function() {
    this.props.link_state("client").value.delete_profile(handleAPI(this.props.refreshProfiles, this.props.notify), this.props.profile.id);
  },

  render: function () {
    return (
      <div className="list-group-item row">
        <span className="col-sm-2 text-center vcenter"><kbd>{this.props.profile.name}</kbd></span>
        <span className="col-sm-4 text-center vcenter">{this.props.profile.description}</span>
        <span className="col-sm-2 text-center vcenter">{this.props.profile.content.up.rate} kbps</span>
        <span className="col-sm-2 text-center vcenter">{this.props.profile.content.down.rate} kbps</span>
        <button className="col-sm-1 btn btn-info vcenter" onClick={this.handleClick}>选择</button>
        <button className="col-sm-1 btn btn-danger vcenter" onClick={this.removeProfile}>删除</button>
      </div>);
  }
});


var ProfileList = React.createClass({
  render: function() {
    if (this.props.profiles.length == 0) {
      return false;
    }

    var profileNodes = this.props.profiles.map(function (profile) {
      return (
        <Profile refreshProfiles={this.props.refreshProfiles} link_state={this.props.link_state} action='delete' profile={profile} notify={this.props.notify} />
      );
    }.bind(this));

    return (
      <div>
        <h4>现有的配置文件</h4>
        <p>
          从下面的列表中选择一个配置文件来应用。
        </p>
        <div className="list-group">
          <div className="list-group-item row">
            <span className="col-sm-2 text-center vcenter"><b>名称</b></span>
            <span className="col-sm-4 text-center vcenter"><b>描述</b></span>
            <span className="col-sm-2 text-center vcenter"><b>上传速度</b></span>
            <span className="col-sm-2 text-center vcenter"><b>下载速度</b></span>
            <span className="col-sm-1 text-center vcenter"></span>
            <span className="col-sm-1 text-center vcenter"></span>
          </div>

          {profileNodes}
        </div>
      </div>
    );
  }
});


var CreateProfileWidget = React.createClass({
  getInitialState: function() {
    return {
      name: "",
      description : "",
    };
  },

  updateName: function(event) {
    this.setState({name: event.target.value});
  },

  updateDescription: function(event) {
    this.setState({description: event.target.value});
  },

  newProfile: function() {
    var failed = false;
    var settings = this.props.link_state('settings').value;
    if (settings.down.rate == null &&
      settings.up.rate == null) {
      this.props.notify("error", "你必须完整填写下方的管理设置。");
      failed = true;
    }
    if (this.state.name == "") {
      this.props.notify("error", "你必须给新的配置文件一个名称。");
      failed = true;
    }
    if (this.state.description == "") {
      this.props.notify("error", "你必须给新的配置文件一个描述。");
      failed = true;
    }
    if (failed) {
      return;
    }

    var addProfile = function() {
      this.setState({
        name: "",
        description: "",
      });
      this.props.refreshProfiles();
    }.bind(this);

    var profile = {
      name: this.state.name,
      description: this.state.description,
      content: settings
    };
    this.props.link_state("client").value.new_profile(handleAPI(addProfile, this.props.notify), profile);
  },

  render: function() {
    return (
      <div>
        <h4>新的配置文件</h4>
        <p>
          输入名称和描述，然后点击“创建”以保存下方的“管理设置”为一个新的配置文件。
        </p>
        <p>
          <input type="text" className="form-control" placeholder="配置文件名称" onChange={this.updateName}/>
        </p>
        <p>
          <input type="text" className="form-control" placeholder="配置文件描述" onChange={this.updateDescription}/>
        </p>
        <button className="col-sm-2 btn btn-success" onClick={this.newProfile}>创建</button>
      </div>
    );
  },
});


var ProfilePanel = React.createClass({
  render: function () {
    return (
      <div className="panel-group" id="accordion1" role="tablist" aria-multiselectable="false">
        <div className="panel panel-default">
          <div className="panel-heading" data-toggle="collapse" data-parent="#accordion1" href="#collapseProfiles" aria-expanded="false" aria-controls="collapseProfiles">
            <h3 className="panel-title">
              配置文件
            </h3>
          </div>
          <div id="collapseProfiles" className="panel-collapse collapse" role="tabpanel">
            <div className="panel-body">
              <ProfileList refreshProfiles={this.props.refreshProfiles} link_state={this.props.link_state} profiles={this.props.profiles} notify={this.props.notify}/>

              <CreateProfileWidget refreshProfiles={this.props.refreshProfiles} link_state={this.props.link_state} notify={this.props.notify}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
