<?php
include_once('/var/www/html/include/Process_Log_API.php');
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
                die();
                break;
            default :
                die();
                break;
        }
        exit();      
    }
}
else
{
    die();
    exit();
}
$proc_api = new Process_Log_API();
$proc_api->OutputDownloadFile($oLogin->PDODB);
