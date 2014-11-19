<?php
define("UpdateRootPath", "/var/www/html/check_update/");
define("RootPath","/var/www/html/");
class Process_System_API
{   
    function ChangePassword($JsonData,$oLogin)
    {               
        $Result = APIStatus::ChangePWDFail;
        $InputJson = json_decode($JsonData,true);        
        if(strlen($InputJson['PWD']) > 0)
        {
            $Result = $oLogin->Change_Password($InputJson['PWD']);
        }
        return $Result;
    }
    
    function ListVersion()
    {                
        $exu_str = UpdateRootPath.'list_version.sh';        
        $output = exec($exu_str,$outputarr);
        $json_arr = json_decode($output);          
        if($json_arr == null)
        {
            $json_arr['Result'] = '-99';
        }
        return $json_arr;
    }
    
    function CheckNewVersion()
    {
        $exu_str = "sudo ".UpdateRootPath."check_button_action.sh";        
        $output = exec($exu_str,$outputarr);           
        $json_arr = json_decode($output);        
        if($json_arr == null)
        {
            $json_arr['Result'] = '-99';
        }
        return $json_arr;
    }
    
    function Update()
    {
        $exu_str = "sudo ".UpdateRootPath."update_button_action.sh".' >/dev/null 2>&1 &';
        $pipe = popen($exu_str,"r");
        pclose($pipe);
        $json_arr['Result'] = '0';                
        return $json_arr;
    }
    
    function CheckUpdate()
    {
        $exu_str = "sudo ".UpdateRootPath."update_progress.sh";
        $output = exec($exu_str,$outputarr);   
        $json_arr = json_decode($output);
        if($json_arr == null)
        {
            $json_arr['Result'] = '-99';
        }
        return $json_arr;
    }
    
    function GetTime()
    {        
        $exu_str = "sudo ".RootPath."date.sh get tz";
        $timezone = exec($exu_str,$outputarr);   
        $exu_str = "sudo ".RootPath."date.sh get mode";
        $output = exec($exu_str,$outputarr);
        $outputarr = explode(',', $output);
        $mode = $outputarr[0];
        $ntp = $outputarr[1];        
        date_default_timezone_set($timezone);        
        $TimeData = array("Time" => date("Y/m/d H:i:s"),"TimeZone"=>$timezone
                ,"Mode"=>(int)$mode,"NTP"=>$ntp);
        return $TimeData;
    }
    
    function SetTime($JsonData)
    {        
        $Result = false;
        $InputJson = json_decode($JsonData,true);        
        if(strlen($InputJson['Mode']) > 0 && strlen($InputJson['TimeZone']) > 0)
        {
            switch ($InputJson['Mode'])
            {
                case 0:
                    if(strlen($InputJson['Time']) > 0)
                    {
                        $exu_str = "sudo ".RootPath."date.sh set tz ".$InputJson['TimeZone'];
                        $output = exec($exu_str,$outputarr);                       
                        $exu_str = "sudo ".RootPath.'date.sh set time '.$InputJson['Time'];
                        $output = exec($exu_str,$outputarr);     
                        if($output == 0)
                            $Result = true;
                    }
                    break;
                case 1:
                    if(strlen($InputJson['NTP']) > 0)
                    {
                        $exu_str = "sudo ".RootPath."date.sh set tz ".$InputJson['TimeZone'];
                        $output = exec($exu_str,$outputarr);                       
                        $exu_str = "sudo ".RootPath.'date.sh set ntp '.$InputJson['NTP'];
                        $output = exec($exu_str,$outputarr);     
                        if($output == 0)
                            $Result = true;
                    }
                    break;
            }
        }
        return $Result;
    }
    
    function UpdateTime($JsonData)
    {
        $Result = false;
        $InputJson = json_decode($JsonData,true);        
        if(strlen($InputJson['NTP']) > 0)
        {
            $exu_str = "sudo ".RootPath.'date.sh set ntpnow '.$InputJson['NTP'];            
            $output = exec($exu_str,$outputarr);     
            if($output == 0)
                $Result = true;
        }
        return $Result;
    }
}
?>