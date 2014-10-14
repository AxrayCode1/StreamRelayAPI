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
        <script type='text/javascript' src="/js/jquery.simplemodal.js"></script>
        <script type='text/javascript' src="/js/jquery.blockUI.js"></script>
        <script type='text/javascript' src="/js/tvcloud.js"></script>
        <script type='text/javascript' src="/js/sha512.js"></script>
        <script type='text/javascript' src="/js/Structure.js"></script>
        <script type='text/javascript' src="/js/ErrorHandle.js"></script>
        <script type='text/javascript' src="/js/RelayAjax.js"></script>
        <script type='text/javascript' src="/js/HtmlCreate.js"></script>        
        <script type='text/javascript' src="/js/UIIPControl.js"></script>
        <script type='text/javascript' src="/js/UIRelayControl.js"></script>
        <script type='text/javascript' src="/js/UISystemControl.js"></script>
        <script type='text/javascript' src="/js/RelayUI.js"></script>        
        <link type='text/css' href="/css/index.css" rel="stylesheet">
        <link type='text/css' href='/css/jquery-ui.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery-ui.structure.min.css' rel='stylesheet'/>
        <link type='text/css' href='/css/jquery-ui.theme.min.css' rel='stylesheet'/>
    </head>
    <body>
        <div id="div_relay_create_control">                
            <div class="Logo">
                AcroRed
            </div>

            <div class="Header">
                TV Relay Station Manager
            </div>

            <div class="Version">
                Version : 1.0.0
            </div> 
            
        </div>
        <div id="div_option" >
            <div class="OptionBar">	
            </div>
            <div id="rl" onmouseover="mouseon_b('rl');" onmouseout="mouseout_b('rl');">
                <img src="/img/list.jpg" height="20" width="20" align="center" /> Relay List
            </div>             

            <div id="ise" onmouseover="mouseon_b('ise');" onmouseout="mouseout_b('ise');">
                <img src="/img/socket.png" height="20" width="20" align="center" /> IP Setting
            </div>

            <div id="ss" style="position: absolute; z-index:2; left: 380px; width: 130px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('ss');" onmouseout="mouseout_b('ss');">
        	<img src="/img/config.png" height="20" width="20" align="center" /> Sys. Setup
            </div>
    
            <!--<div id="per" style="position: absolute; z-index:2; left: 510px; width: 150px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('per');" onmouseout="mouseout_b('per');">
                <img src="img/performance.png" height="20" width="20" align="center" /> Performance
            </div>

            <div id="el" style="position: absolute; z-index:2; left: 660px; width: 130px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('el');" onmouseout="mouseout_b('el');">
                <img src="img/log.png" height="20" width="20" align="center" /> Event Log.
            </div>--> 

            <div id="lo" style="position: absolute; z-index:2; left: 790px; width: 100px; height: 30px; text-align:center; line-height:25px; font-size: larger;" onmouseover="mouseon_b('lo');" onmouseout="mouseout_b('lo');" onclick='window.location="/ui/Logout.html"'>
                <img src="/img/logout-512.png" height="20" width="20" align="center" /> Logout
            </div>                          
        </div>
        <div id="div_relay_control">
            <div id="div_relay_table">
                <table id="table_relay" style="width: 100%">
                    <tr>
                        <th width="3%">Item</th>                        
                        <th width="20%">Source</th>
                        <th width="20%">Destination</th>
                        <th width="10%">Status</th>
                        <th width="15%">Remark 1</th>
                        <th width="15%">Remark 2</th>                        
                        <th width="17%">Action</th>
                    </tr>               
                </table>
            </div>
            <div id="div_control_table">  
                <div style="position: relative;top: 10px" >
                    <div style="position: absolute; right: 0px">
                        <a id="btn_refresh"  href="#" class="btn-light">Refresh</a>
                    </div>
                    <div style="position: absolute;left: 10px; top: 35px">
                        <fieldset>
                            <legend>Create</legend>
                            <div class="div_fieldcontent">
                                <label>Source Url : </label>
                                <input id="Source"  style="height: 20px;width: 200px" class="inputs" value="" type="text">
                                <label style="margin-left: 10px;">Port : </label>
                                <input id="Port" style="height: 20px;width: 60px" class="inputs" value="" type="text">
                                <label style="margin-left: 10px;">Channel Name : </label>
                                <input id="ChannelName" style="height: 20px;width: 100px" class="inputs" value="" type="text">
                                <label>Remark 1 : </label>
                                <input id="Remark1"  style="height: 20px;width: 120px" class="inputs" value="" type="text">
                                <label>Remark 2 : </label>
                                <input id="Remark2"  style="height: 20px;width: 120px" class="inputs" value="" type="text">
                                <a id="btn_create" style="margin-left: 10px" href="#" class="btn-light">Create</a>
                            </div>
                        </fieldset>
                    </div>
                    <div style="position: absolute;left:10px; top: 120px">
                        <fieldset>
                            <legend>Mass Entry</legend>                            
                            <div class="div_fieldcontent">
                                <a href="MassCreateRelay.txt" style="text-decoration: underline;" download>Download Sample File</a>
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
        </div>
        <div id="div_sys_config">
            <fieldset>
                <legend>Change Password</legend>                            
                <div class="div_fieldcontent">                                        
                    <label>Current Password : </label>                    
                    <input id="CurPWD"  style="height: 20px;width: 150px" class="inputs" value="" type="password">
                    <br>    
                    <br>
                    <label>New Password : </label>                    
                    <input id="NewPWD" style="height: 20px;width: 150px" class="inputs" value="" type="password">
                    <br>
                    <br>
                    <label>Confirm New Password : </label>                    
                    <input id="ConfNewPWD" style="height: 20px;width: 150px" class="inputs" value="" type="password">                    
                    <br>
                    <br>
                    <a id="btn_chg_pwd" href="#" class="btn-light">Confirm</a>
                </div>
            </fieldset>
        </div>
        <div id="modal_update_progress_content">
            <h3>Mass Entry</h3>
            <div style="position: relative;top:5px;color: black">Progress : <div id="progressbar">
                    <div class="progress-label"></div>                
                </div>               
            </div>
            <div>
                <div class="scrollit" style="position: relative;top:20px">
                    <table id="MassEntryResulTable"  style="width: 100%">
                        <tr>                            
                            <th style="height: 15px" width="20%">Fail Row</th>
                            <th style="height: 15px" width="80%">Fail Result</th>                        
                        </tr>                        
                    </table>
                </div>
            </div>
            <div style="position: absolute;right: 10px;bottom: 10px">
                <a id="closedialog" href="#" class="btn-light">Close</a>
            </div>
        </div>
        <script type="text/javascript">            
            main();
        </script>
    </body>
</html>
