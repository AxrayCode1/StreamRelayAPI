<?php
include_once('/var/www/html/include/api_global_function.php');
include_once '/var/www/html/include/HandleLogin.php';
$oLogin = new Login();
$oLogin->Sec_Session_Start();
if($oLogin->DB_Connection() == LoginStatus::DBConnectSuccess)
{
    $eLoginStatus = $oLogin->Login_Check();
    if($eLoginStatus != LoginStatus::LoginSuccess)
    {
        switch ($eLoginStatus)
        {
            case LoginStatus::DBPrepareFail:
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
        <script type='text/javascript' src="/js/jquery-1.7.2.min.js"></script>
        <script type='text/javascript' src='/js/jquery-ui-1.11.1.min.js'></script>
        <!--<script type='text/javascript' src="/js/jquery.simplemodal.js"></script>-->
        <!--<script type='text/javascript' src="/js/jquery.blockUI.js"></script>-->
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
        <script type='text/javascript' src="/js/RelayUI.js"></script>        
        <link type='text/css' href="/css/index.css" rel="stylesheet">
        <link type='text/css' href='/css/jquery-ui.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery-ui.structure.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery-ui.theme.min.css' rel='stylesheet'/>
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
                <img src="/img/performance.png" height="20" width="20" align="center" /> Sys. Upgrage
            </div>

        <!--<div id="per" class="FunctionControl" style="position: absolute; z-index:2; left: 510px; width: 150px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('per');" onmouseout="mouseout_b('per');">
            <img src="img/performance.png" height="20" width="20" align="center" /> Performance
        </div>

        <div id="el" class="FunctionControl" style="position: absolute; z-index:2; left: 660px; width: 130px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('el');" onmouseout="mouseout_b('el');">
            <img src="img/log.png" height="20" width="20" align="center" /> Event Log.
        </div>--> 

            <div id="lo" class="FunctionControl" onmouseover="mouseon_b('lo');" onmouseout="mouseout_b('lo');" onclick='window.location="/ui/Logout.html"'>
                <img src="/img/logout-512.png" height="20" width="20" align="center" /> Logout
            </div>                          
            
        </div>

        <div id="div_relay_control">
            <div style="position: absolute;right: 10px">
                        <a id="btn_refresh"  href="#" class="btn-light">Refresh</a>
            </div>
            <div id="div_relay_table" style="position: absolute;top: 40px">
                <table id="table_relay" style="width: 100%">
                    <tr>
                        <th width="3%">Item</th>                        
                        <th id="source" class="relayth" width="20%">Source</th>
                        <th id="fulldest" class="relayth" width="20%">Destination</th>
                        <th id="status" class="relayth" width="8%">Status</th>
                        <th id="channelnumber" class="relayth" width="10%">Channel Number</th>
                        <th id="name" class="relayth" width="8%">Name</th>
                        <th id="description" class="relayth" width="14%">Description</th>                        
                        <th width="17%">Action</th>
                    </tr>               
                </table>
                <div id="div_control_table">  
                    <div style="position: relative;top: 10px" >                    
                        <div style="position: absolute;left: 10px; top: 30px">
                            <fieldset>
                                <legend>Create</legend>
                                <div class="div_fieldcontent">
                                    <label class="LabelRelayHead">Source Url : </label>
                                    <input id="Source"  class="InputRelay" value="" type="text">
                                    <br>
                                    <br>                                
                                    <label class="LabelRelayHead">Destination Port : </label>
                                    <input id="Port" class="InputRelay" value="" type="text">
                                    <br>
                                    <br>
                                    <label class="LabelRelayHead">Destination Name : </label>
                                    <input id="DestinationName" class="InputRelay" value="" type="text">
                                    <br>
                                    <br>
                                    <label class="LabelRelayHead">Channel Number : </label>
                                    <input id="ChannelNumber"  class="InputRelay" value="" type="text">
                                    <br>
                                    <br>
                                    <label class="LabelRelayHead">Name : </label>
                                    <input id="Name"  class="InputRelay" value="" type="text">
                                    <br>
                                    <br>
                                    <label class="LabelRelayHead">Description : </label>
                                    <input id="Description"  class="InputRelay" value="" type="text">
                                    <br>
                                    <br>
                                    <a id="btn_create" href="#" class="btn-light">Create</a>
                                </div>
                            </fieldset>
                        </div>
                        <div style="position: absolute;left:610px; top: 30px">
                            <fieldset>
                                <legend>Mass Entry</legend>                            
                                <div class="div_fieldcontent">
                                    <a href="/MassCreateRelay.txt" style="text-decoration: underline;" download>Download Sample File</a>
                                    <div style="margin-top:10px">
                                        <input id="uploadFile" type="text" disabled="disabled" placeholder="Choose File">
                                        <div class="file-upload btn btn-primary" style="margin-left: 10px">    
                                            <span>Select</span>
                                            <br>
                                            <input id="file_mass_create" accept=".txt" type="file" class="upload" />
                                        </div>
                                        <a id="btn_mass_create" style="margin-left: 10px" href="#" class="btn-light">Create</a>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div style="position: absolute;right:10px; top: 350px">
                            Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
                        </div>
                    </div>
                </div>
               
            </div>

        </div>
        
        <div id="div_ip_control">
            <div id="div_ip_field">            
            </div>
            <div style="margin-top: 10px">
                <a id="btn_ip_confirm" href="#" class="btn-light">Confirm</a>
                <a style="margin-left: 10px" id="btn_ip_cancel" href="#" class="btn-light">Cancel</a>
            </div>
            <div style="margin-top: 10px;text-align: right;margin-right: 10px">
                            Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
            </div>
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
            <div style="margin-top: 10px;text-align: right;margin-right: 10px">
                Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
            </div>
        </div>
        
        <div id="div_upgrade_control">
            <fieldset>
                <legend>System Upgrade</legend>                            
                <div class="div_fieldcontent">
                    <label>Now Firmware Version : </label>
                    <label id="txt_now_firmware"></label>
                    <br>
                    <br>
                    <label>New Firmware Version : </label>
                    <label id="txt_new_firmware" style="color:blue"></label>                            
                    <br>            
                    <br>
                    <a id="btn_check_firmware" href="#" class="btn-light" >Check New Firmware</a>
                    <a id="btn_update_firmware" href="#" class="btn-light">Update</a>
                </div>
            </fieldset>
            <div style="margin-top: 10px;text-align: right;margin-right: 10px">
                Copyright © 2014 AcroRed Technologies, Inc. All rights reserved.
            </div>
        </div>
        
        <div id="modal_update_progress_content">
            <!--h3>Mass Entry</h3>-->
            <div style="position: relative;top:5px;color: black">Progress : <div id="progressbar">
                    <div class="progress-label"></div>                
                </div>               
            </div>
            <div>
                <div class="scrollit" style="position: relative;top:20px">
                    <table id="MassEntryResulTable"  style="width: 100%">
                        <tr>                            
                            <th style="height: 12px" width="20%">Fail Row</th>
                            <th style="height: 12px" width="80%">Fail Result</th>                        
                        </tr>                        
                    </table>
                </div>
            </div>
            <div style="position: absolute;right: 10px;bottom: 10px">
                <a id="closedialog" href="#" class="btn-light">Close</a>
            </div>
        </div>
        <div id="dialog_wait">
            <h2 id="dialog_msg" style="text-align: center;top:50%">Please Wait...</h2>
        </div>            
        <script type="text/javascript">            
            main();
        </script>
    </body>
</html>
