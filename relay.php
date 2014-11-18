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
        <script src="/js/jquery.hashchange.js" type="text/javascript"></script>
        <script src="/js/jquery.easytabs.js" type="text/javascript"></script>
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
        <script type='text/javascript' src="/js/missed.js"></script>        
        <script type='text/javascript' src="/js/jquery.scombobox.min.js"></script>
        <script type='text/javascript' src="/js/jquery.easing.min.js"></script>
        <link type='text/css' href="/css/jquery.scombobox.css" rel="stylesheet" />
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
            <div id="tab-container" class='tab-container' style="padding: 10px">
                <ul class='etabs'>
                  <li class='tab'><a href="#tabs1-password">Change Password</a></li>
                  <li class='tab'><a href="#tabs1-time">Time</a></li>
                </ul>
                <div class='panel-container'>
                    <div id="tabs1-password"> 
                        <div class="div_fieldcontent" style="margin-top:20px;width: 550px;height: 280px;position: relative">                                        
                            <label class="LabelHead">Current Password : </label>                    
                            <input id="CurPWD" class="InputText" value="" type="password">
                            <br>    
                            <br>
                            <label class="LabelHead">New Password : </label>                    
                            <input id="NewPWD" class="InputText"  value="" type="password">
                            <br>
                            <br>
                            <label class="LabelHead">Confirm New Password : </label>                    
                            <input id="ConfNewPWD" class="InputText"  value="" type="password">                    
                            <br>
                            <br>
                            <div style="position: absolute;right: 0px">
                                <a id="btn_chg_pwd" href="#" class="btn-light">Confirm</a>
                                <a id="btn_clear_pwd" href="#" class="btn-light">Clear</a>
                            </div>
                        </div>
                    </div>
                    <div id="tabs1-time">
                        <div style="margin-top:20px;width: 600px;height: 480px;position: relative;">
                            <div style="position: absolute;border-bottom: dashed 1px rgba(0, 0, 0, .2);
                                    -webkit-background-clip: padding-box; 
                                    background-clip: padding-box;width: 600px">
                                <label style="padding: 10px;color: blue;font-size: large">Current Time</label>    
                            </div>
                            <div style="position: absolute;top:10px">                                
                              <label id="curTime" class="LabelHead" style="padding: 20px 0px 0px 10px;"></label>
                            </div>
                            <div style="position: absolute;border-bottom: dashed 1px rgba(0, 0, 0, .2);
                                    -webkit-background-clip: padding-box; 
                                    background-clip: padding-box;top: 80px;width: 600px">
                                <label style="padding: 10px;color: blue;font-size: large">Time Zone</label>    
                            </div>
                            <div style="position: absolute;top:100px">        
                                <div style="position: relative">
                                    <label class="LabelHead" style="position: absolute;top:20px;left: 10px">Time Zone :</label>
                                    <select id="combotimezone" >
                                        <option value="1">(GMT-11:00) Samnona Standard Time; Midway Is.</option>
                                        <option value="2">(GMT-10:00) Hawaii Standard Time</option>
                                        <option value="3">(GMT-09:00) Alaska Standard Time</option>
                                        <option value="4">(GMT-08:00) Pacific Time(US & Canada); Tijuana</option>
                                        <option value="5">(GMT-07:00) Arizona</option>
                                        <option value="6">(GMT-07:00) Chihuahua, Mazatlan</option>
                                        <option value="7">(GMT-07:00) Mountain Time (US & Canada)</option>
                                        <option value="8">(GMT-06:00) Central America Standard Time; Guate</option>
                                        <option value="9">(GMT-06:00) Central Time (US & Canada)</option>
                                        <option value="10">(GMT-06:00) Mexico City; Tegucigalpa</option>
                                        <option value="11">(GMT-06:00) Saskatchewan</option>
                                        <option value="12">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                                        <option value="13">(GMT-05:00) Eastern Time (US & Canada)</option>
                                        <option value="14">(GMT-05:00) Indiana (East)</option>
                                        <option value="15">(GMT-04:30) Caracas</option>
                                        <option value="16">(GMT-04:00) Atlantic Time (Canada)</option>
                                        <option value="17">(GMT-04:00) La Paz</option>
                                        <option value="18">(GMT-04:00) Manaus</option>
                                        <option value="19">(GMT-04:00) Santiago</option>
                                        <option value="20">(GMT-03:30) Newfoundland</option>
                                        <option value="21">(GMT-03:00) Brasilia</option>
                                        <option value="22">(GMT-03:00) Buenos Aires, Georgetown</option>
                                        <option value="23">(GMT-03:00) Greenland Standard Time</option>
                                        <option value="24">(GMT-03:00) Montevideo</option>
                                        <option value="25">(GMT-02:00) Mid-Atlantic Standard Time</option>
                                        <option value="26">(GMT-01:00) Azores Standard Time</option>
                                        <option value="27">(GMT-01:00) Cape Verde Is.</option>
                                        <option value="28">(GMT) Casablanca</option>
                                        <option value="29">(GMT) Dublin, Edinburgh, Lisbon, London</option>
                                        <option value="30">(GMT) Monrovia, Reykjavik</option>
                                        <option value="31">(GMT+01:00) Amsterdam, Berlin, Rome, Stockholm, Vienna</option>
                                        <option value="32">(GMT+01:00) Belgrade, Bratislava, Budapest, Prague</option>
                                        <option value="33">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                                        <option value="34">(GMT+01:00) Sarajevo, Skopie, Warsaw, Zagreb</option>
                                        <option value="35">(GMT+01:00) Western Africa Time</option>
                                        <option value="36">(GMT+01:00) Windhoek</option>
                                        <option value="37">(GMT+02:00) Amman</option>
                                        <option value="38">(GMT+02:00) Athens, Bucharest, Istanbul</option>
                                        <option value="39">(GMT+02:00) Beirut</option>
                                        <option value="40">(GMT+02:00) Egypt Standard Time</option>
                                        <option value="41">(GMT+02:00) Harare, Pretoria</option>
                                        <option value="42">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                                        <option value="43">(GMT+02:00) Israel Standard Time</option>
                                        <option value="44">(GMT+02:00) Central Africa Time</option>
                                        <option value="45">(GMT+02:00) Eastern Europe Standard Time</option>
                                        <option value="46">(GMT+03:00) Minsk</option>
                                        <option value="47">(GMT+03:00) Baghdad</option>
                                        <option value="48">(GMT+03:00) Kuwait</option>
                                        <option value="49">(GMT+03:00) Nairobi</option>
                                        <option value="50">(GMT+03:00) Moscow, St. Petersburg, Kazan, Volgograd</option>
                                        <option value="51">(GMT+03:30) Iran Standard Time</option>
                                        <option value="52">(GMT+04:00) Abu Dhabi, Muscat</option>
                                        <option value="53">(GMT+04:00) Baku</option>
                                        <option value="54">(GMT+04:00) Tbilisi</option>
                                        <option value="55">(GMT+04:00) Yerevan</option>
                                        <option value="56">(GMT+04:30) Afghanistan Standard Time</option>
                                        <option value="57">(GMT+05:00) Karachi, Islamabad, Tashkent</option>
                                        <option value="58">(GMT+05:00) Ekaterinburg</option>
                                        <option value="59">(GMT+05:30) Bombay, Calcutta, Madras, New Delhi, Colombo</option>
                                        <option value="60">(GMT+05:45) Kathmandu</option>
                                        <option value="61">(GMT+06:00) Almaty, Astana</option>
                                        <option value="62">(GMT+06:00) Dhaka</option>
                                        <option value="63">(GMT+06:00) Novosibirsk</option>
                                        <option value="64">(GMT+06:30) Yangon(Rangoon)</option>
                                        <option value="65">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                        <option value="66">(GMT+07:00) Krasnoyarsk</option>
                                        <option value="67">(GMT+08:00) Taipei</option>
                                        <option value="68">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                                        <option value="69">(GMT+08:00) Ulaanbaatar</option>
                                        <option value="70">(GMT+08:00) Kuala Lumpur, Singapore</option>
                                        <option value="71">(GMT+08:00) Perth</option>
                                        <option value="72">(GMT+08:00) Irkutsk</option>
                                        <option value="73">(GMT+09:00) Tokyo, Osaka, Sapporo</option>
                                        <option value="74">(GMT+09:00) Seoul</option>
                                        <option value="75">(GMT+09:00) Yakutsk</option>
                                        <option value="76">(GMT+09:30) Adelaide</option>
                                        <option value="77">(GMT+09:30) Darwin</option>
                                        <option value="78">(GMT+10:00) Brisbane</option>
                                        <option value="79">(GMT+10:00) Melbourne, Sydney, Canberra</option>
                                        <option value="80">(GMT+10:00) Guam, Port Moresby</option>
                                        <option value="81">(GMT+10:00) Tasmania Standard Time</option>
                                        <option value="82">(GMT+10:00) Vladivostok</option>
                                        <option value="83">(GMT+10:00) Magadan, Solomon Is., New Caledonia</option>
                                        <option value="84">(GMT+11:00) New Caledonia</option>
                                        <option value="85">(GMT+12:00) Auckland, Wellington</option>
                                        <option value="86">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                                    </select>        
                                </div>
                            </div>
                            <div style="position: absolute;border-bottom: dashed 1px rgba(0, 0, 0, .2);
                                    -webkit-background-clip: padding-box; /* for Safari */
                                    background-clip: padding-box;top:180px;width: 600px">
                                <label style="padding: 10px;color: blue;font-size: large">Time Setting</label>    
                            </div>
                            <div style="position: absolute;top:200px"> 
                                <div style="position: relative">
                                    <input type="radio" name="time" class="LabelHead radiotime" value="manually" style="position: absolute;top:8px;left: 10px" checked>
                                    <label class="LabelHead" style="position: absolute;top:10px;left: 35px">Manually</label>
                                    <label class="LabelHead" style="position: absolute;top:50px;left: 35px">Date :</label> 
                                    <input type="text" id="datepicker" style="position: absolute;
                                    width: 350px;
                                    height: 30px;
                                    top: 40px;
                                    left: 215px;"> 
                                    <label class="LabelHead" style="position: absolute;top:90px;left: 35px">Time :</label> 
                                    <select id="combohour" >
                                        <option value="0">00</option>
                                        <option value="1">01</option>
                                        <option value="2">02</option>
                                        <option value="3">03</option>
                                        <option value="4">04</option>
                                        <option value="5">05</option>
                                        <option value="6">06</option>
                                        <option value="7">07</option>
                                        <option value="8">08</option>
                                        <option value="9">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                    </select>
                                    <label id="lablehourmin">:</label>
                                    <select id="combomin" >
                                        <option value="0">00</option>
                                        <option value="1">01</option>
                                        <option value="2">02</option>
                                        <option value="3">03</option>
                                        <option value="4">04</option>
                                        <option value="5">05</option>
                                        <option value="6">06</option>
                                        <option value="7">07</option>
                                        <option value="8">08</option>
                                        <option value="9">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        <option value="29">29</option>
                                        <option value="30">30</option>
                                        <option value="31">31</option>
                                        <option value="32">32</option>
                                        <option value="33">33</option>
                                        <option value="34">34</option>
                                        <option value="35">35</option>
                                        <option value="36">36</option>
                                        <option value="37">37</option>
                                        <option value="38">38</option>
                                        <option value="39">39</option>
                                        <option value="40">40</option>
                                        <option value="41">41</option>
                                        <option value="42">42</option>
                                        <option value="43">43</option>
                                        <option value="44">44</option>
                                        <option value="45">45</option>
                                        <option value="46">46</option>
                                        <option value="47">47</option>
                                        <option value="48">48</option>
                                        <option value="49">49</option>
                                        <option value="50">50</option>  
                                        <option value="51">51</option>
                                        <option value="52">52</option>
                                        <option value="53">53</option>
                                        <option value="54">54</option>
                                        <option value="55">55</option>
                                        <option value="56">56</option>
                                        <option value="57">57</option>
                                        <option value="58">58</option>
                                        <option value="59">59</option>
                                    </select>
                                    <label id="lableminsecond">:</label>
                                    <select id="combosecond" >
                                        <option value="0">00</option>
                                        <option value="1">01</option>
                                        <option value="2">02</option>
                                        <option value="3">03</option>
                                        <option value="4">04</option>
                                        <option value="5">05</option>
                                        <option value="6">06</option>
                                        <option value="7">07</option>
                                        <option value="8">08</option>
                                        <option value="9">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        <option value="29">29</option>
                                        <option value="30">30</option>
                                        <option value="31">31</option>
                                        <option value="32">32</option>
                                        <option value="33">33</option>
                                        <option value="34">34</option>
                                        <option value="35">35</option>
                                        <option value="36">36</option>
                                        <option value="37">37</option>
                                        <option value="38">38</option>
                                        <option value="39">39</option>
                                        <option value="40">40</option>
                                        <option value="41">41</option>
                                        <option value="42">42</option>
                                        <option value="43">43</option>
                                        <option value="44">44</option>
                                        <option value="45">45</option>
                                        <option value="46">46</option>
                                        <option value="47">47</option>
                                        <option value="48">48</option>
                                        <option value="49">49</option>
                                        <option value="50">50</option>  
                                        <option value="51">51</option>
                                        <option value="52">52</option>
                                        <option value="53">53</option>
                                        <option value="54">54</option>
                                        <option value="55">55</option>
                                        <option value="56">56</option>
                                        <option value="57">57</option>
                                        <option value="58">58</option>
                                        <option value="59">59</option>
                                    </select>
                                    <input type="radio" name="time" class="LabelHead radiotime" value="sync" style="position: absolute;top:128px;left: 10px" >
                                    <label class="LabelHead" style="position: absolute;top:130px;left: 35px;width: 300px">Synchronize with NTP Server</label>                                                               
                                    <label class="LabelHead" style="position: absolute;top:170px;left: 35px">Server Address :</label> 
                                    <select id="combontpserver">
                                        <option value="pool.ntp.org">pool.ntp.org</option>
                                        <option value="time.nist.gov">time.nist.gov</option>
                                    </select>
                                    <a href="#" id="btnupdate" style="position: absolute;top:200px;left: 35px;width: 120px;font-size: smaller">Update Now</a>                                    
                                </div>                                
                            </div>                                                                     
                            
                            <div style="position: absolute;right: 0px;bottom: 0px">                                                              
                                <a id='btn_set_time' href="#" class="btn-light">Confirm</a>
                                <a id='btn_reset_time' href="#" class="btn-light">Reset</a>                                    
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
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
