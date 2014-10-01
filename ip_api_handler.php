<?php
include_once('Process_API.php');
include_once('api_global_function.php');

$url=explode("/",$_GET["api"]);
$proc_api = new Process_API();
switch (count($url))
{
    case 1:        
        switch ($url[0])
        {
            case 'list':            
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'GET':
                        $outputarr = $proc_api ->listip();  
                        echo json_encode($outputarr);
                        break;
                    default :
                        http_response_code(404);
                }
                break;    
            case 'set':                
                switch($_SERVER['REQUEST_METHOD'])
                {
                    case 'POST':
                        //Input Json : {"IP":[{"name":"eth1","ip":"192.168.94.208","mask":"255.255.248.0"},{"name":"eth2","ip":"192.168.12.78","mask":"255.255.255.0"}],"Gateway":[{"ip":"","bindport":""}],"DNS":[{"ip":"168.95.192.1"},{"ip":"8.8.8.8"}]}
                        $result = $proc_api ->setip(file_get_contents("php://input"));
                        if(!$result)
                            http_response_code(400);
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