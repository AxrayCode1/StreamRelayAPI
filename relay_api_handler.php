<?php
include_once('/var/www/html/include/Process_API.php');
include_once('/var/www/html/include/Process_Relay_Source_API.php');
include_once('/var/www/html/include/api_global_function.php');
include_once '/var/www/html/include/HandleLogin.php';
CheckAuth();
$url=explode("/",$_GET["api"]);
$proc_api = new Process_API();
switch (count($url))
{
    case 1:        
        switch ($url[0])
        {
            case 'create':            
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'POST':
                        $result = $proc_api -> create(file_get_contents("php://input"));
                        if(!result)
                            http_response_code(404);
                        else
                        {
                            echo '{}';
                        }
                        break;
                    default :
                        http_response_code(404);
                }
                break;            
            case 'resume':     
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'POST':                        
                        $result = $proc_api->resume(file_get_contents("php://input"));
                        if(!result)
                            http_response_code(404);
                        else                        
                            echo '{}';                                                                            
                        break;
                    default :
                        http_response_code(404);
                }
                break;
            case 'list':
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'GET':
//                        $rtn_arr = $proc_api -> listdata();
//                        header('Content-Type: application/json; charset=utf-8');  
//                        echo json_encode($rtn_arr);
                        $rtn_json = $proc_api ->listdatajson();
                        header('Content-Type: application/json; charset=utf-8');  
                        if($rtn_json != null)
                            echo $rtn_json;
                        else
                            http_response_code(503);
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
    case 2:        
        switch ($url[0])
        {            
            case 'delete':                
                if(strlen($url[1]) <= 0)
                {
                    http_response_code(404);
                    return;
                }
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'DELETE':
                        $proc_api ->deldata($url[1]);
                        echo '{}';
                        break;
                    default :
                        http_response_code(404);
                }
                break;
            case 'modify':            
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'PUT':
                        $result = $proc_api -> modify_channel($url[1],file_get_contents("php://input"));
                        if(!result)
                            http_response_code(404);
                        else
                        {
                            echo '{}';
                        }
                        break;
                    default :
                        http_response_code(404);
                }
                break;
            case 'stop': 
                switch ($url[1])
                {
                    case 'multi':
                        switch($_SERVER['REQUEST_METHOD'])
                        {
                            case 'POST':
                                $result = $proc_api ->stopmulti(file_get_contents("php://input"));
                                echo '{}';
                                break;
                            default :
                                http_response_code(404);
                        }
                        break;                    
                    default :
                        switch($_SERVER['REQUEST_METHOD'])
                        {
                            case 'PUT':
                                $result = $proc_api ->stop($url[1]);
                                echo '{}';
                                break;
                            default :
                                http_response_code(404);
                        }
                        break;
                }                
                break;    
            case 'source':
                $proc_source_api = new Process_Relay_Source_API();
                switch ($url[1]){
                    case "add":
                        switch($_SERVER['REQUEST_METHOD'])
                        {
                            case 'POST':
                                $rtn_json = $proc_source_api ->Add_Relay_Source(file_get_contents("php://input")); 
                                header('Content-Type: application/json; charset=utf-8');  
                                if($rtn_json != null)
                                    echo $rtn_json;
                                else
                                    http_response_code(503);                       
                                break;
                            default :
                                http_response_code(404);
                        }
                        break;
                    case "delete":
                        switch($_SERVER['REQUEST_METHOD'])
                        {
                            case 'POST':
                                $rtn_json = $proc_source_api ->Delete_Relay_Source(file_get_contents("php://input")); 
                                header('Content-Type: application/json; charset=utf-8');  
                                if($rtn_json != null)
                                    echo $rtn_json;
                                else
                                    http_response_code(503);                       
                                break;
                            default :
                                http_response_code(404);
                        }
                        break;                        
                    case "reorder":
                        switch($_SERVER['REQUEST_METHOD'])
                        {
                            case 'POST':
                                $rtn_json = $proc_source_api ->Reorder_Relay_Source(file_get_contents("php://input")); 
                                header('Content-Type: application/json; charset=utf-8');  
                                if($rtn_json != null)
                                    echo $rtn_json;
                                else
                                    http_response_code(503);                       
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
        break;
    default :
        http_response_code(404);
        break;                        
}
?>