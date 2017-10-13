/** @jsx React.DOM */
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */


 var ShapingButton = React.createClass({
  render: function () {
    button_values = [
      {
        message: "ATC服务没有在运行",
        css: "warning",
      },
      {
        message: "关闭",
        css: "danger",
      },
      {
        message: "打开",
        css: "primary",
      },
      {
        message: "更新配置",
        css: "success",
      },
    ];

    content = button_values[this.props.status];
    return (
      <button type="button" id={this.props.id} className={"btn btn-" + content.css} disabled={this.props.status == atc_status.OFFLINE} onClick={this.props.onClick}>
        {content.message}
      </button>
    );
  }
});


var LinkShapingNumberSetting = React.createClass({
  mixins: [IdentifyableObject],
  render: function () {
    id = this.getIdentifier();
    link_state = this.props.link_state("settings_" + id);
    return (
      <div className="form-group">
        <label htmlFor={id} className="col-sm-3 control-label">{this.props.text}</label>
        <div className="col-sm-9">
          <input type="number" defaultValue={link_state.value} className="form-control" id={id} placeholder={this.props.placeholder} min="0" max={this.props.max_value} valueLink={link_state} />
        </div>
      </div>
    )
  }
});


var LinkShapingPercentSetting = React.createClass({
  render: function () {
    return (
      <LinkShapingNumberSetting input_id={this.props.input_id} text={this.props.text} placeholder="In %" link_state={this.props.link_state} max_value="100" />
    )
  }
});


var CollapseableInputList = React.createClass({
  render: function () {
    return (
      <fieldset className="accordion-group">
        <legend>{this.props.text}</legend>
        {this.props.children}
      </fieldset>
    );
  }
});


var CollapseableInputGroup = React.createClass({
  mixins: [IdentifyableObject],
  getInitialState: function () {
    return {collapsed: true};
  },

  handleClick: function (e) {
    this.setState({collapsed: !this.state.collapsed})
  },

  render: function () {
    id = this.getIdentifier();
    var text = this.state.collapsed ? '显示更多' : '隐藏';
    return (
      <div>
        <div className="accordion-heading">
          <a className="accordion-toggle" data-toggle="collapse" data-target={"#" + id} href="javascript:void(0)" onClick={this.handleClick}>{text}</a>
        </div>
        <div className="accordion-body collapse" id={id}>
          <div className="accordion-inner">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});


var LinkShapingSettings = React.createClass({
  render: function () {
    d = this.props.direction;
    return (
      <div>
        <h4>{capitalizeFirstLetter(d) + "link"}:</h4>
        <div className="well" id={d + "_well"}>
          <div className="form-horizontal accordion">
            <CollapseableInputList text="带宽">
              <LinkShapingNumberSetting params={[d, "rate"]} text="速度" placeholder="单位:kbps" link_state={this.props.link_state} />
            </CollapseableInputList>
            <CollapseableInputList text="延迟">
              <LinkShapingNumberSetting params={[d, "delay", "delay"]} text="延时(Delay)" placeholder="单位:ms" link_state={this.props.link_state} />
              <CollapseableInputGroup params={[d, "delay", "collapse"]}>
                <LinkShapingNumberSetting params={[d, "delay","jitter"]} text="抖动(Jitter)" placeholder="单位:%" link_state={this.props.link_state} />
                <LinkShapingNumberSetting params={[d, "delay", "correlation"]} text="相关性（Correlation）" placeholder="单位:%" link_state={this.props.link_state} />
              </CollapseableInputGroup>
            </CollapseableInputList>
            <CollapseableInputList text="丢包">
              <LinkShapingNumberSetting params={[d, "loss", "percentage"]} text="百分比（Percentage）" placeholder="单位:%" link_state={this.props.link_state} />
              <CollapseableInputGroup params={[d, "loss", "collapse"]}>
                <LinkShapingNumberSetting params={[d, "loss", "correlation"]} text="相关性（Correlation）" placeholder="单位:%" link_state={this.props.link_state} />
              </CollapseableInputGroup>
            </CollapseableInputList>
            <CollapseableInputList text="错包">
              <LinkShapingNumberSetting params={[d, "corruption", "percentage"]} text="百分比（Percentage）" placeholder="单位:%" link_state={this.props.link_state} />
              <CollapseableInputGroup params={[d, "corruption", "collapse"]}>
                <LinkShapingNumberSetting params={[d, "corruption", "correlation"]} text="相关性（Correlation）" placeholder="单位:%" link_state={this.props.link_state} />
              </CollapseableInputGroup>
            </CollapseableInputList>
            <CollapseableInputList text="乱序">
              <LinkShapingNumberSetting params={[d, "reorder", "percentage"]} text="百分比（Percentage）" placeholder="单位:%" link_state={this.props.link_state} />
              <CollapseableInputGroup params={[d, "reorder", "collapse"]}>
                <LinkShapingNumberSetting params={[d, "reorder", "correlation"]} text="相关性（Correlation）" placeholder="单位:%" link_state={this.props.link_state} />
                <LinkShapingNumberSetting params={[d, "reorder", "gap"]} text="间隔（Gap）" placeholder="整数" link_state={this.props.link_state}/>
              </CollapseableInputGroup>
            </CollapseableInputList>
          </div>
        </div>
      </div>
    );
  }
});


var ShapingSettings = React.createClass({
  render: function () {
    return (
      <div className="panel-group" id="accordion2" role="tablist" aria-multiselectable="false">
        <div className="panel panel-default">
          <div className="panel-heading" data-toggle="collapse" data-parent="#accordion2" href="#collapseShaping" aria-expanded="false" aria-controls="collapseShaping">
              <h4 className="panel-title">
                  管理设置
              </h4>
          </div>
          <LinkShapingParams />
          <div id="collapseShaping" className="panel-collapse collapse in" role="tabpanel">
            <div className="panel-body">
              <div className="row">
                <div className="col-md-6">
                  <LinkShapingSettings direction="up" link_state={this.props.link_state} />
                </div>
                <div className="col-md-6">
                  <LinkShapingSettings direction="down" link_state={this.props.link_state} />
                </div>
              </div>

              <JSONView json={this.props.before} label="更改前:" />
              <JSONView json={this.props.after} label="更改后:" />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var LinkShapingParams = React.createClass({
  render: function () {
    return (
        <div className="col-md-12">
          <h4>参数说明：</h4>
          <p>
            <ul>
              <li><b>Rate：</b>带宽</li>
              <li><b>Delay：</b>延时，这里设置的是单向的延时。Jitter，抖动；Correlation，相关性，用来设置这个包的延迟时间与上一个包的时间的相关度</li>
              <li><b>Loss：</b>丢包率；Correlation，相关性，以一定的概率发生突发的大量的丢包，但平均丢包率不会超过Loss定义的值</li>
              <li><b>Corruption：</b>错包率，按概率产生噪音，即格式错误的包；Correlation，相关性，类似丢包率的Correlation</li>
              <li><b>Reorder：</b>包重排序率，按概率将包的顺序打乱；Gap用来确定包重排序的个数，不设置更接近真实的环境；Correlation，相关性，类似丢包率的Correlation</li>
            </ul>
            <span><b>注：Correlation的另一种说法是该项的数值浮动范围，仅供参考。</b></span>
          </p>
        </div>
      );
  }
}); 