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
                http_response_code(503);
                break;
            default :
                http_response_code(401);
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
$url=explode("/",$_GET["api"]);
$proc_api = new Process_Log_API();
switch (count($url))
{
    case 1:        
        switch ($url[0])
        {
            case 'list':            
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'GET':
                        $eStauts = $proc_api ->ListLog($oLogin->PDODB,$outputarr);  
                        switch ($eStauts)
                        {
                            case APIStatus::DBPrepareFail:
                                http_response_code(503);
                                break;
                            default :
                                echo json_encode($outputarr);
                                break;
                        }                        
                        break;
                    default :
                        http_response_code(404);
                }
                break;            
        }
        break;   
    default :
        http_response_code(404);
        break;                        
}

