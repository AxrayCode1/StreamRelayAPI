<?php
define("UpdateRootPath", "/var/www/html/check_update/");
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
}
?>