<?php
include_once('/var/www/html/include/Process_API.php');
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
                        $outputarr = $proc_api ->ListLog();  
                        echo json_encode($outputarr);
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

