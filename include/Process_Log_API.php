<?php
class Process_Log_API
{
    private $TimeZoneArrMapping=array("Pacific/Midway"=>"-11:00",
"Pacific/Honolulu"=>"-10:00",
"US/Alaska"=>"-09:00",
"US/Pacific"=>"-08:00",
"US/Arizona"=>"-07:00",
"US/Mountain"=>"-07:00",
"America/Chihuahua"=>"-07:00",
"America/Guatemala"=>"-06:00)",
"US/Central"=>"-06:00",
"America/Mexico_City"=>"-06:00",
"Canada/Saskatchewan"=>"-06:00",
"America/Bogota"=>"-05:00",
"US/Eastern"=>"-05:00",
"US/East-Indiana"=>"-05:00",
"America/Caracas"=>"-04:30",
"Canada/Atlantic"=>"-04:00",
"America/La_Paz"=>"-04:00",
"America/Manaus"=>"-04:00",
"Canada/Newfoundland"=>"-03:30",
"America/Santiago"=>"-03:00",
"America/Fortaleza"=>"-03:00",
"America/Buenos_Aires"=>"-03:00",
"America/Godthab"=>"-03:00",
"America/Montevideo"=>"-02:00",
"Atlantic/South_Georgia"=>"-02:00",
"Atlantic/Azores"=>"-01:00",
"Atlantic/Cape_Verde"=>"-01:00",
"Africa/Casablanca"=>"+00:00",
"Europe/London"=>"+00:00",
"Africa/Monrovia"=>"+00:00",
"Europe/Amsterdam"=>"+01:00",
"Europe/Belgrade"=>"+01:00",
"Europe/Brussels"=>"+01:00",
"Europe/Sarajevo"=>"+01:00",
"Africa/Kinshasa"=>"+01:00",
"Africa/Windhoek"=>"+02:00",
"Asia/Amman"=>"+02:00",
"Europe/Athens"=>"+02:00",
"Asia/Beirut"=>"+02:00",
"Egypt"=>"+02:00",
"Africa/Harare"=>"+02:00",
"Europe/Helsinki"=>"+02:00",
"Israel"=>"+02:00",
"Africa/Gaborone"=>"+02:00",
"Europe/Sofia"=>"+02:00",
"Europe/Minsk"=>"+03:00",
"Asia/Baghdad"=>"+03:00",
"Asia/Kuwait"=>"+03:00",
"Africa/Nairobi"=>"+03:00",
"Europe/Moscow"=>"+03:00",
"Iran"=>"+03:30",
"Asia/Muscat"=>"+04:00",
"Asia/Baku"=>"+04:00",
"Asia/Tbilisi"=>"+04:00",
"Asia/Yerevan"=>"+04:00",
"Asia/Kabul"=>"+04:30",
"Asia/Karachi"=>"+05:00",
"Asia/Yekaterinburg"=>"+05:00",
"Asia/Calcutta"=>"+05:30",
"Asia/Kathmandu"=>"+05:45",
"Asia/Almaty"=>"+06:00",
"Asia/Dhaka"=>"+06:00",
"Asia/Novosibirsk"=>"+06:00",
"Asia/Rangoon"=>"+06:30",
"Asia/Bangkok"=>"+07:00",
"Asia/Krasnoyarsk"=>"+07:00",
"Asia/Taipei"=>"+08:00",
"Asia/Hong_Kong"=>"+08:00",
"Asia/Ulaanbaatar"=>"+08:00",
"Asia/Kuala_Lumpur"=>"+08:00",
"Australia/Perth"=>"+08:00",
"Asia/Irkutsk"=>"+08:00",
"Asia/Tokyo"=>"+09:00",
"Asia/Seoul"=>"+09:00",
"Asia/Yakutsk"=>"+09:00",
"Australia/Darwin"=>"+09:30",
"Australia/Brisbane"=>"+10:00",
"Pacifi/Guam"=>"+10:00",
"Asia/Vladivostok"=>"+10:00",
"Asia/Magadan"=>"+10:00",
"Australia/Adelaide"=>"+10:30",
"Australia/Tasmania"=>"+11:00",
"Australia/Melbourne"=>"+11:00",
"Pacific/Noumea"=>"+11:00",
"Pacific/Auckland"=>"+12:00",
"Pacific/Fiji"=>"+12:00");  
    function ListLog($PDODB,&$LogList=null)
    {
        $exu_str = "sudo /var/www/html/date.sh get tz";
        $timezone = exec($exu_str,$outputarr);         
        $gmt = $this->TimeZoneArrMapping[$timezone] == null ? "+08:00" : $this->TimeZoneArrMapping[$timezone];
        $sqlSetTimeZone = <<<SQL
                
                set time_zone=:timezone;
SQL;
        $sqlSELECTLog = <<<SQL
                
                SELECT * FROM tbLog ORDER BY timeCreate DESC;
SQL;
        $Stmt = $PDODB->prepare($sqlSetTimeZone);
        // Using prepared statements means that SQL injection is not possible. 
        if ($Stmt) {        
            $Stmt->bindValue(':timezone', $gmt, PDO::PARAM_STR);
            $Stmt->execute();    // Execute the prepared query.  
            $Stmt = $PDODB->prepare($sqlSELECTLog);
            $Stmt->execute();
            $LogList = array();
            while ($row = $Stmt->fetch()) {
                switch ($value['typeLog'])
                {
                    case 0:
                        $LogType = 'Normal';
                        break;
                    case 1:
                        $LogType = 'Warning';
                        break;
                    case 2:
                        $LogType = 'Error';
                        break;                            
                }
                $LogList[] = array('CreateTime'=>$row['timeCreate']==null?'N/A':$row['timeCreate']
                        ,'LogType'=>$LogType==null?'N/A':$LogType
                        ,'ChannelName'=>$row['nameChannel']==null?'N/A':$row['nameChannel']
                        ,'SouceURL'=>$row['source']==null?'N/A':$row['source']
                        ,'Dest'=>$row['outUrl']==null?'N/A':$row['outUrl']
                        ,'Description'=>$row['message']==null?'N/A':$row['message']
                        ,'Operator'=>$row['riser']==null?'N/A':$row['riser']
                        ,'ChannelNumber'=>$row['numberChannel']==null?'N/A':$row['numberChannel']);
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
                $BOM = "\xEF\xBB\xBF";
                $out = fopen('php://output', 'w');  
                fwrite($out, $BOM);
                fputcsv($out,array('Type','Operator','Channel Number','Channel Name','Source','Destination','Description','Time'));
                foreach ($outputarr as $key => $value)
                {
                    $LogType = 'Normal';
                    switch ($value['LogType'])
                    {
                        case 0:
                            $LogType = 'Normal';
                            break;
                        case 1:
                            $LogType = 'Warning';
                            break;
                        case 2:
                            $LogType = 'Error';
                            break;                            
                    }
                    fputcsv($out, array($LogType
                        ,$value['Operator']                        
                        ,$value['ChannelNumber']
                        ,$value['ChannelName']
                        ,$value['SouceURL']
                        ,$value['Dest']                        
                        ,$value['Description']
                        ,$value['CreateTime']));                    
                }                
                fclose($out);
                break;
        }            
        die();
    }
}