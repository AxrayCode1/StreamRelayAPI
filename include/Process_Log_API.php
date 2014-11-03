<?php
class Process_Log_API
{
    function ListLog($PDODB,&$LogList=null)
    {
        $sqlSELECTLog = <<<SQL
                SELECT timeCreate,typeLog,nameChannel,source,outUrl,message FROM tbLog ORDER BY timeCreate DESC;
SQL;
        $Stmt = $PDODB->prepare($sqlSELECTLog);
        // Using prepared statements means that SQL injection is not possible. 
        if ($Stmt) {            
            $Stmt->execute();    // Execute the prepared query.  
            $LogList = array();
            while ($row = $Stmt->fetch()) {
                $LogList[] = array('CreateTime'=>$row['timeCreate'],'LogType'=>$row['typeLog']
                        ,'ChannelName'=>$row['nameChannel'],'SouceURL'=>$row['source'],'Dest'=>$row['outUrl']
                        ,'Description'=>$row['message']);
            }              
            return APIStatus::ListLogSuccess;
        }            
        else {
            // Could not create a prepared statement
            return APIStatus::DBPrepareFail;
        }
    }
    
    function OutputDownloadFile($PDODB)
    {                
        set_time_limit(0);
     
        $mime_type="application/force-download";


        // required for IE, otherwise Content-Disposition may be ignored
        if(ini_get('zlib.output_compression'))
        ini_set('zlib.output_compression', 'Off');

        header('Content-Type: ' . $mime_type);
        header("Content-Type: application/octet-stream; text/html; charset=utf-8");
        header("Content-Type: application/download; text/html; charset=utf-8");  
        $name = 'log_'.date("Y_m_d").'.csv';
        if(preg_match('/MSIE/i',  $_SERVER['HTTP_USER_AGENT']))    
        { 
            $encoded_filename = rawurlencode($name);   
            header('Content-Disposition: attachment; filename="'.$encoded_filename.'"');    
        }
        else
                header('Content-Disposition: attachment; filename="'.$name.'"');
        header("Content-Transfer-Encoding: binary");
        header('Accept-Ranges: bytes');

        /* The three lines below basically make the 
            download non-cacheable */
        header("Cache-control: private");
        header('Pragma: private');
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        

        /* output the file itself */
        $eStatus = $this ->ListLog($PDODB,$outputarr);  
        switch ($eStatus)
        {
            case APIStatus::DBPrepareFail:
                die();
                break;
            default :
                $out = fopen('php://output', 'w');
                fputcsv($out,array('Type','Source','Destination','Channel Name','Description','Time'));
                foreach ($outputarr as $key => $value)
                {
                    fputcsv($out, array($value['LogType'],$value['LogType'], $value['Dest']
                            , $value['ChannelName'],$value['Description'],$value['CreateTime']));
//                    print('"'.$value['LogType'].'","'.$value['LogType'].'","'.$value['Dest'].'","'.
//                          $value['ChannelName'].'","'.$value['Description'].'","'.$value['CreateTime'].'"\r\n');
                }
                fclose($out);
                break;
        }            
        die();
    }
}