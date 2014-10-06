<?php
include_once('include/Process_API.php');
include_once('include/api_global_function.php');

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
                        $rtn_arr = $proc_api -> listdata();
                        header('Content-Type: application/json; charset=utf-8');  
                        echo json_encode($rtn_arr);
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
            default :
                http_response_code(404);
                break;
        }
        break;
    default :
        http_response_code(404);
        break;                        
}