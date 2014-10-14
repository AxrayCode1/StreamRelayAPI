<?php
include_once('/var/www/html/include/api_global_function.php');
include_once '/var/www/html/include/HandleLogin.php';
include_once('/var/www/html/include/Process_System_API.php');
function ResponseChangePassword($Result)
{
    switch ($Result)
    {
        case LoginStatus::ChangePWDFail:
            http_response_code(400);
            exit();
        case LoginStatus::DBPrepareFail:
            http_response_code(503);
            exit();
    }
}
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
$oProcSystem = new Process_System_API();
switch (count($url))
{
    case 2:        
        switch ($url[0])
        {
            case 'password':
                switch ($url[1])
                {                    
                    case 'change':
                        switch($_SERVER['REQUEST_METHOD'])
                        {
                            case 'PUT':
                                $ResultChgPWD = $oProcSystem ->ChangePassword(file_get_contents("php://input"),$oLogin);
                                ResponseChangePassword($ResultChgPWD);
                                break;
                            default :
                                http_response_code(404);
                        }
                        break;
                    default :
                        http_response_code(404);
                        break;
                }
                break;            
            default :
                http_response_code(404);
                break;
        }
        break;   
    default :
        http_response_code(404);
        break;                        
}
?>