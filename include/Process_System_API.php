<?php
class Process_System_API
{
    function ChangePassword($JsonData,$oLogin)
    {               
        $Result = LoginStatus::ChangePWDFail;
        $InputJson = json_decode($JsonData,true);        
        if(strlen($InputJson['PWD']) > 0)
        {
            $Result = $oLogin->Change_Password($InputJson['PWD']);
        }
        return $Result;
    }
}
?>