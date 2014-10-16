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
function HandlePassword($Action,$oProcSystem,$oLogin)
{
    switch ($Action)
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
}
function HandleUpdate($Action,$oProcSystem)
{
    switch($Action)
    {
        case 'list':
            switch($_SERVER['REQUEST_METHOD'])
            {
                case 'GET':
                    $VersionData = $oProcSystem->ListVersion();
                    break;
                default :
                    http_response_code(404);
            }
            break;
        case 'checknew':
            switch($_SERVER['REQUEST_METHOD'])
            {
                case 'GET':
                    $VersionData = $oProcSystem->CheckNewVersion();
                    break;
                default :
                    http_response_code(404);
            }
            break;
        case 'updatenew':
            switch($_SERVER['REQUEST_METHOD'])
            {
                case 'POST':
                    $Result = $oProcSystem->Update();
                    break;
                default :
                    http_response_code(404);
            }
            break;
        case 'checkupdate':
            switch($_SERVER['REQUEST_METHOD'])
            {
                case 'GET':
                    $Result = $oProcSystem->CheckUpdate();
                    break;
                default :
                    http_response_code(404);
            }
            break;
        default :
            http_response_code(404);
            break;
    }
}
$ologin = CheckAuth();
$url=explode("/",$_GET["api"]);
$oProcSystem = new Process_System_API();
switch (count($url))
{
    case 2:        
        switch ($url[0])
        {
            case 'password':
                HandlePassword($url[1],$oProcSystem,$ologin);
                break;            
            case 'update':
                HandleUpdate($url[1],$oProcSystem);
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