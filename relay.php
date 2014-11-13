<?php
include_once('/var/www/html/include/api_global_function.php');
include_once '/var/www/html/include/HandleLogin.php';
$oLogin = new Login();
$oLogin->Sec_Session_Start();
if($oLogin->DB_Connection() == APIStatus::DBConnectSuccess)
{
    $eLoginStatus = $oLogin->Login_Check();
    if($eLoginStatus != APIStatus::LoginSuccess)
    {
        switch ($eLoginStatus)
        {
            case APIStatus::DBPrepareFail:
                http_response_code(503);
                echo "<h1>Error 503 DBPrepareFail</h1>";                
                break;
            default :
                http_response_code(401);
                echo "<h1>Error 401 Unauthorized</h1>";
                break;
        }
        exit();      
    }
}
else
{
    http_response_code(503);
    exit();
}
?>
<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>AcroRed TV Relay Station</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type='text/javascript' src="/js/jquery-1.11.1.min.js"></script>        
        <script type='text/javascript' src='/js/jquery-ui-1.11.1.min.js'></script>
        <script type="text/javascript" src="/js/jquery.dropdown.min.js"></script>
        <script type='text/javascript' src="/js/tvcloud.js"></script>
        <script type='text/javascript' src="/js/sha512.js"></script>
        <script type='text/javascript' src="/js/Structure.js"></script>
        <script type='text/javascript' src="/js/UIItemVar.js"></script>
        <script type='text/javascript' src="/js/ErrorHandle.js"></script>
        <script type='text/javascript' src="/js/RelayAjax.js"></script>
        <script type='text/javascript' src="/js/HtmlCreate.js"></script>        
        <script type='text/javascript' src="/js/UIIPControl.js"></script>
        <script type='text/javascript' src="/js/UIRelayControl.js"></script>
        <script type='text/javascript' src="/js/UISystemControl.js"></script>
        <script type='text/javascript' src="/js/UIUpgrageControl.js"></script>
        <script type='text/javascript' src="/js/UILogControl.js"></script>
        <script type='text/javascript' src="/js/RelayUI.js"></script>        
        <link type='text/css' href="/css/index.css" rel="stylesheet">
        <link type='text/css' href='/css/jquery-ui.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery-ui.structure.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery-ui.theme.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery.dropdown.css' rel='stylesheet'/>
    </head>
    <body>        
        <div id="div_relay_header">                
            <div class="Logo">
                AcroRed
            </div>

            <div class="Header">
                TV Relay Station Manager
            </div>

            <div class="Version">                
            </div>             
            <div class="OptionBar" style="position: absolute;top:40px"></div>
            <div id="rl" class="FunctionControl" onmouseover="mouseon_b('rl');" onmouseout="mouseout_b('rl');">
                <img src="/img/list.jpg" height="20" width="20" align="center" /> Relay List
            </div>             

            <div id="ise" class="FunctionControl" onmouseover="mouseon_b('ise');" onmouseout="mouseout_b('ise');">
                <img src="/img/socket.png" height="20" width="20" align="center" /> IP Setting
            </div>

            <div id="ss" class="FunctionControl"  onmouseover="mouseon_b('ss');" onmouseout="mouseout_b('ss');">
                <img src="/img/config.png" height="20" width="20" align="center" /> Sys. Setup
            </div>

            <div id="sup" class="FunctionControl" onmouseover="mouseon_b('sup');" onmouseout="mouseout_b('sup');">
                <img src="/img/performance.png" height="20" width="20" align="center" /> Sys. Update
            </div>

        <!--<div id="per" class="FunctionControl" style="position: absolute; z-index:2; left: 510px; width: 150px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('per');" onmouseout="mouseout_b('per');">
            <img src="img/performance.png" height="20" width="20" align="center" /> Performance
        </div>--> 

            <div id="el" class="FunctionControl"  onmouseover="mouseon_b('el');" onmouseout="mouseout_b('el');">
                <img src="/img/log.png" height="20" width="20" align="center" /> Event Log
            </div>

            <div id="lo" class="FunctionControl" onmouseover="mouseon_b('lo');" onmouseout="mouseout_b('lo');" onclick='window.location="/ui/Logout.html"'>
                <img src="/img/logout-512.png" height="20" width="20" align="center" /> Logout
            </div>                          
            
        </div>        
        <div id="div_relay_control">
<!--            <div style="position: absolute;left: 10px">
                <a id="btn_add"  href="#" class="btn-light">Add</a>
            </div>-->            
                        
            <div style="position: relative;">
                <a style="margin-left: 5px" href="#" class="btn-light" data-dropdown="#dropdown-Add">Create&nbsp;&darr;</a>
                <div style="position: absolute;top:0px;right: 10px">
                    <a id="btn_stop_all" href="#" class="btn-light">Stop All</a>
                    <a id="btn_resume_all" href="#" class="btn-light">Resume All</a>
                    <a  id="btn_refresh" href="#" class="btn-light">Refresh</a>
                </div>
            </div>
            <div id="div_relay_table" style="position: absolute;top: 40px;width: 100%">
                <table id="table_relay">
                    <tr>
                        <th width="1%">Item</th>                        
                        <th id="channelnumber" class="relayth" width="2%">Channel No.</th>
                        <th id="name" class="relayth" width="15%">Channel Name</th>
                        <th id="source" class="relayth" width="19%">Source URL</th>
                        <th id="sourcecount" class="relayth" width="2%">Source Qty.</th>
                        <th id="fulldest" class="relayth" width="19%">Destination URL</th>
                        <th id="status" class="relayth" width="5%">Status</th>                        
                        <th id="description" class="relayth" width="15%">Description</th>                        
                        <th width="23%">Action</th>
                    </tr>               
                </table>                               
            </div>
        </div>
        
        <div id="div_ip_control">
            <div id="div_ip_field">            
            </div>
            <div style="margin-top: 10px">
                <a id="btn_ip_confirm" href="#" class="btn-light">Confirm</a>
                <a style="margin-left: 10px" id="btn_ip_cancel" href="#" class="btn-light">Cancel</a>
            </div>
<!--            <div style="margin-top: 10px;text-align: right;margin-right: 10px">
                            Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
            </div>-->
        </div>
        
        <div id="div_sys_config">
            <fieldset>
                <legend>Change Password</legend>                            
                <div class="div_fieldcontent">                                        
                    <label class="LabelHead">Current Password : </label>                    
                    <input id="CurPWD" class="InputText"  style="height: 20px"  value="" type="password">
                    <br>    
                    <br>
                    <label class="LabelHead">New Password : </label>                    
                    <input id="NewPWD" class="InputText" style="height: 20px" value="" type="password">
                    <br>
                    <br>
                    <label class="LabelHead">Confirm New Password : </label>                    
                    <input id="ConfNewPWD" class="InputText" style="height: 20px" value="" type="password">                    
                    <br>
                    <br>
                    <a id="btn_chg_pwd" href="#" class="btn-light">Confirm</a>
                </div>
            </fieldset>
<!--            <div style="margin-top: 10px;text-align: right;margin-right: 10px">
                Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
            </div>-->
        </div>
        
        <div id="div_upgrade_control">
            <fieldset>
                <legend>System Update</legend>                            
                <div class="div_fieldcontent">
                    <label class="LabelVersionHead">Current Firmware Version : </label>
                    <label id="txt_now_firmware"></label>
                    <br>
                    <br>
                    <label class="LabelVersionHead">New Firmware Version : </label>
                    <label id="txt_new_firmware" style="color:blue"></label>                            
                    <br>            
                    <br>
                    <a id="btn_check_firmware" href="#" class="btn-light" >Check New Firmware</a>
                    <a id="btn_update_firmware" href="#" class="btn-light">Update</a>
                </div>
            </fieldset>
<!--            <div style="margin-top: 10px;text-align: right;margin-right: 10px">
                Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
            </div>-->
        </div>
        
        <div id="div_log_control">
            <a href="/ui/download_log.html" style="position :absolute;left: 5px;text-decoration: underline;" download>Click Here to Export Log</a>
            <div style="position: absolute;right: 10px">
                <a id="btn_log_refresh"  href="#" class="btn-light">Refresh</a>
            </div>
            <div id="div_log_table" style="position: absolute;top: 40px;width: 100%">
                <table id="table_log">
                    <tr>
                        <th width="2%">Item</th>                        
                        <th id="type" class="logth" width="10%">Operator</th>
                        <th id="source" class="logth" width="18%">Source</th>
                        <th id="fulldest" class="logth" width="18%">Destination</th>    
                        <th id="name" class="logth" width="15%">Channel Name</th>
                        <th id="description" class="logth" width="19%">Description</th>                        
                        <th id="time" class="logth" width="18%">Time</th>
                    </tr>               
                </table>
            </div>
        </div>
        
        <div id="modal_update_progress_content">
            <div style="position:relative;height: 450px">
                <!--<a href="/MassCreateRelay.txt" style="text-decoration: underline;" download>Download Sample File</a>-->            
                <form id="downloadExample" method="get" action="/download_MassEntryExample.php">
                    <label style="text-decoration: underline;cursor:pointer;color: blue" onclick="$('#downloadExample').submit();">Download Sample File</label>            
                </form>                
                <div style="position: absolute;top:40px">                
                    <input id="uploadFile" type="text" disabled="disabled" placeholder="Choose File">
                    <div class="file-upload btn btn-primary" style="margin-left: 10px">    
                        <span>Select</span>
                        <br>
                        <input id="file_mass_create" accept=".txt" type="file" class="upload" />
                    </div>
                    <a id="btn_mass_create" style="margin-left: 10px" href="#" class="btn-light">Create</a>
                </div>                               
                <div style="position: absolute;top:90px;color: black">Progress : <div id="progressbar">
                        <div class="progress-label"></div>                
                    </div>               
                </div>
                <div style="position: absolute;top:120px;width: 530px">
                    <div class="scrollit">
                        <table id="MassEntryResulTable"  style="width: 100%">
                            <tr>                            
                                <th style="height: 12px" width="20%">Fail Row</th>
                                <th style="height: 12px" width="80%">Fail Result</th>                        
                            </tr>                        
                        </table>
                    </div>
                </div>
                <div style="position: absolute;right: 0px;bottom: 10px">
                    <a id="closedialog" href="#" class="btn-light">Exit</a>
                </div>
            </div>
        </div>
        
        <div id="modal_modify_source_content">                        
            <div id="ModifySourceArea">                
            </div>
            <div style="position: absolute;right: 10px">
                <a id="closemodifydialog" href="#" class="btn-light">Exit</a>
            </div>
        </div>
        
        <div id="modal_modify_channel_content"> 
            <div style="position:relative;height: 320px">
                <label class="LabelRelayHead">*&nbsp;Channel Number : </label>
                <input id="ModfiyChannelNumber"  class="InputRelay" value="" type="text">
                <br>
                <br>
                <label class="LabelRelayHead">*&nbsp;Channel Name : </label>
                <input id="ModfiyName"  class="InputRelay" value="" type="text">
                <br>
                <br>
                <label class="LabelRelayHead">&nbsp;&nbsp;Destination URL : </label>
                <label>http://ServerIP:Port/Name</label>
                <br>
                <br> 
                <label class="LabelRelayHead" style="margin-left: 10px">*&nbsp;Port : </label>
                <input style="margin-left: -10px" id="ModfiyPort" class="InputRelay" value="" type="text">
                <br>
                <br>
                <label class="LabelRelayHead" style="margin-left: 10px">&nbsp;&nbsp;Name : </label>
                <input style="margin-left: -10px" id="ModfiyDestinationName" class="InputRelay" value="" type="text">
                <br>
                <br>            
                <label class="LabelRelayHead">&nbsp;&nbsp;Description : </label>
                <input id="ModfiyDescription"  class="InputRelay" value="" type="text">
                <br>
                <br>
                <div style="position: absolute;right: 10px">
                    <a id="btn_modify_channel" href="#" class="btn-light">Confirm</a>
                    <a id="btn_close_modify_channel" href="#" class="btn-light">Exit</a>
                </div>
            </div>
        </div>
        
        <div id="dropdown-1" class="dropdown dropdown-tip dropdown-anchor-right">
            <ul class="dropdown-menu">
                <li><a href="#1" class="delete">Delete</a></li>
                <li><a href="#2" class="ModifySource">Edit Source URL</a></li>
                <li><a href="#3" class="ModifyChannel">Modify Miscellaneous</a></li>                                        
            </ul>
        </div>
        
        <div id="dropdown-Add" class="dropdown dropdown-tip">
            <ul class="dropdown-menu">
                <li><a href="#1" class="btn_add_single">Single Channel</a></li>
                <li><a href="#2" class="btn_mass_entry">Mass Entry</a></li>                
            </ul>
        </div>
        
        <div id='modal_detail_content'>
            <table id='table_detail'>                
            </table>
            <div style="position: absolute;bottom: 10px;right: 10px">                
                <a id="btn_close_detail_content" href="#" class="btn-light">Exit</a>
            </div>
        </div>
        
        <div id="modal_create_channel_content">
            <div style="position:relative;height: 460px">
                <div class="div_fieldcontent">
                    <label class="LabelRelayHead">*&nbsp;Channel Number : </label>
                    <input id="ChannelNumber"  class="InputRelay SingleCreate" value="" type="text">
                    <br>
                    <br>
                    <label class="LabelRelayHead">*&nbsp;Channel Name : </label>
                    <input id="Name"  class="InputRelay SingleCreate" value="" type="text">
                    <br>
                    <br>
                    <label>*&nbsp;Source URL : </label>
    <!--                <div id="UrlArea" style="margin-top: 10px;margin-left: 20px; 
                         padding: 5px;border: 1px solid rgba(0, 0, 0,.2);">                                        
                    </div>                                    -->
                    <div id="UrlArea" style="margin-top: 10px;margin-left: 20px; 
                         padding: 5px;">                                        
                    </div>                                    
                    <br>                      
                    <label class="LabelRelayHead">&nbsp;&nbsp;Destination URL : </label>
                    <label>http://ServerIP:Port/Name</label>
                    <br>
                    <br>                
                    <label class="LabelRelayHead" style="margin-left: 10px">*&nbsp;Port : </label>
                    <input id="Port" style="margin-left: -10px" class="InputRelay SingleCreate" value="" type="text">
                    <br>
                    <br>
                    <label class="LabelRelayHead" style="margin-left: 10px">&nbsp;&nbsp;Name : </label>
                    <input id="DestinationName" style="margin-left: -10px" class="InputRelay SingleCreate" value="" type="text">
                    <br>
                    <br>                                    
                    <label class="LabelRelayHead">&nbsp;&nbsp;Description : </label>
                    <input id="Description"  class="InputRelay SingleCreate" value="" type="text">
                    <br>
                    <br>
                    <label class="LabelRelayHead"></label>
                    <div style="position: absolute;right: 10px">
                        <a id="btn_create" href="#" class="btn-light">Confirm</a>
                        <a id="btn_close_create_channel" href="#" class="btn-light">Exit</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="modal_mass_entry_content">
            
        </div>
        
        <div id="moadl_modify_content">
            
        </div>
        
        <div id="dialog_wait">
            <h2 id="dialog_msg" style="text-align: center;top:50%">Please Wait...</h2>
        </div>            
        <script type="text/javascript">            
            //main();
        </script>
    </body>
</html>
