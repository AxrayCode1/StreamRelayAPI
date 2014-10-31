<?php
class Process_API
{
    function create($jsondata)
    {
        $result = false;
        $inputjson = json_decode($jsondata,true);
        if(!(strlen($inputjson['SourceUrl']) <=0 || strlen($inputjson['DestPort']) <=0 || strlen($inputjson['ChannelNumber']) <=0 || strlen($inputjson['Name']) <=0))
        {
            $exu_str = 'sudo /var/www/html/relay.exe "';
            $exu_str.=$inputjson['SourceUrl'];
            $exu_str.='" ';
            $exu_str.=$inputjson['DestPort'];
            $exu_str.=' -nf="';
            $exu_str.=$inputjson['DestName'];
            $exu_str.='" -cn="';
            $exu_str.=$inputjson['Name'];
            $exu_str.='" -cd="';
            $exu_str.=$inputjson['Description'];
            $exu_str.='" -nc=';
            $exu_str.=$inputjson['ChannelNumber'];
            $exu_str.=' >/dev/null 2>&1 &';
            $pipe = popen($exu_str,"r");    
            pclose($pipe);
            $result = true;
        }
        return $result;
    }
    
    function deldata($id)
    {
        $exu_str = "sudo /var/www/html/relay.exe stop $id";
        exec($exu_str,$output);
//        var_dump($output);       
    }
    
    function resume($jsondata)
    {
        $result = false;
        $inputjson = json_decode($jsondata,true);
        if(!(strlen($inputjson['Source']) <=0 || strlen($inputjson['Port']) <=0))
        {            
            $exu_str = "sudo /var/www/html/relay.exe restart ".$inputjson['ID'] .' >/dev/null 2>&1 &';
            $pipe = popen($exu_str,"r");
            pclose($pipe);
//            passthru($exu_str,$output);            
            $result = true;
        }
        return $result;
    }
    
    function listdata()
    {
        $ouputarr = array();
        $exu_str = 'sudo /var/www/html/relay.exe list';            
        exec($exu_str,$output);
        foreach ($output as $str)
        {
            $str_arr=explode(" ",$str);            
            //substr($str_arr[4],1,  strlen($str_arr[4])-1)
            //substr($str_arr[5],1,strlen($str_arr[5])-1)            
            $ouputarr[] = array('id'=>$str_arr[0],'SourceUrl'=>$str_arr[1],'Dest'=>$str_arr[2]
                    ,'Status'=>$str_arr[3],'Name'=>substr($str_arr[4],1,  strlen($str_arr[4])-2)
                ,'Description'=>substr($str_arr[5],1,strlen($str_arr[5])-2),'ChannelNumber'=>$str_arr[6]);           
        }
        return $ouputarr;
    }
    
    function listdatajson()
    {   
        $output = null;
        $exu_str = 'sudo /var/www/html/relay.exe listjson';            
        exec($exu_str,$output);        
        if(json_decode($output[0]) == null)
            $output = null;
        return $output[0];
    }
    
    function listip()
    {
        $outputarr = array();
        $exu_str = 'sudo /var/www/html/ifcfg.sh list';            
        $tmp = exec($exu_str,$output);
        foreach ($output as $str)
        {            
            $str_arr=explode(" ",$str);
            switch ($str_arr[0])
            {
                case 'IP':
                    $outputarr['IP'][] = array('name'=>$str_arr[1],'ip'=>$str_arr[2]=='NULL' ? '' : $str_arr[2],'mask'=>$str_arr[3]=='NULL'?'':$str_arr[3]);
                    break;
                case 'Gateway':
                    $outputarr['Gateway'][] = array('ip'=>$str_arr[1]=='NULL'?'':$str_arr[1],'bindport'=>$str_arr[2]=='NULL'?'':$str_arr[2]);
                    break;
                case 'DNS':
                    $outputarr['DNS'][] = array('ip'=>$str_arr[1]=='NULL'?'':$str_arr[1]);
                    break;
            }                       
        }
        return $outputarr;        
    }
    
    function setip($jsondata)
    {
        $result_ip = false;
        $result_gateway = false;
        $result_dns = false;
        $inputjson = json_decode($jsondata,true);            
        $ipsetlist = array();
        $gatewaysetlist = array();
        $dnssetlist = array();
        $exu_str = 'sudo /var/www/html/ifcfg.sh ';        
        foreach($inputjson as $key=>$item)
        {
            switch ($key)
            {
                case 'IP' :
                    foreach ($item as $key => $ipitem)
                    {             
                        if($ipitem['ip'] == '' && $ipitem['mask'] == '')
                        {                            
                        }
                        else if (!filter_var($ipitem['ip'], FILTER_VALIDATE_IP) || !filter_var($ipitem['mask'], FILTER_VALIDATE_IP)) 
                        {
                            $result_ip = false;
                            break 2;
                        }                        
                        else                        
                            $result_ip = true;
                        $ipsetlist[] = $ipitem;                                                
                    }
                    break;
                case 'Gateway':
                    foreach ($item as $gatewayitem)
                    {         
                        if($gatewayitem['bindport'] == '')
                        {
                            $result_gateway = false;
                            break 2;
                        }
                        else if ($gatewayitem['ip'] == '')
                            $result_gateway = true;
                        else if(!filter_var($gatewayitem['ip'], FILTER_VALIDATE_IP))
                        {
                            $result_gateway = false;
                            break 2;
                        }
                        else
                        {
                            $result_gateway = true;
                            foreach ($ipsetlist as $tmpitem)
                            {
                                if($gatewayitem['bindport'] == $tmpitem['name'])
                                {
                                    if(!$this->valiate_ip_gateway_same_lan($gatewayitem['ip'],$tmpitem['ip'],$tmpitem['mask']))
                                    {                                        
                                        $result_gateway = false;
                                        break;
                                    }
                                }
                            }                      
                            if(!$result_gateway)
                                break 2;
                        }                                             
                        $gatewaysetlist[]=$gatewayitem;
                        break;
                    }
                    break;
                case 'DNS':
                    foreach ($item as $dnsitem)
                    {                        
                        if($dnsitem['ip'] == '')                        
                            $result_dns = true;                                    
                        else if(!filter_var($dnsitem['ip'], FILTER_VALIDATE_IP))
                        {
                            $result_dns = false;
                            break 2;
                        }
                        else
                            $result_dns = true;
                        $dnssetlist[] = $dnsitem;
                    }
                    break;
            }                                               
        }        
        if(!$result_ip || !$result_gateway || !$result_dns)
            return false;
        else
        {
            foreach ($ipsetlist as $setipitem)
            {
                $sExuSetIP = $exu_str.'set IP '.$setipitem['name'];
                if($setipitem['ip'] == '')                                
                    $sExuSetIP .= ' DEL DEL';
                else
                    $sExuSetIP .= ' '.$setipitem['ip'].' '.$setipitem['mask'];                
                exec($sExuSetIP,$output);
            }
            foreach ($gatewaysetlist as $setgatewayitem)
            {
                $sExuSetGateway = $exu_str.'set Gateway';
                if($setgatewayitem['ip'] == '')                                
                    $sExuSetGateway .= ' DEL DEL';
                else
                    $sExuSetGateway .= ' '.$setgatewayitem['ip'].' '.$setgatewayitem['bindport'];                
                exec($sExuSetGateway,$output);
            }
            foreach ($dnssetlist as $setdnsitem)
            {
                $sExuSetDNS = $exu_str.'set DNS';
                if($setdnsitem['ip'] == '')                                
                    $sExuSetDNS .= ' DEL DEL';
                else
                    $sExuSetDNS .= ' '.$setdnsitem['ip'];                 
                exec($sExuSetDNS,$output);
            }            
            exec($exu_str.'restart all',$output);
            return true;
        }
    }
    
    function valiate_ip_gateway_same_lan($gateway,$ip,$mask)
    {                   
        $gatewayarr = explode('.',$gateway);
        $iparr = explode('.',$ip);
        $maskarr = explode('.',$mask);
        if((ip2long($gateway) & ip2long($mask)) == (ip2long($ip) & ip2long($mask)))
            return true;
        else
            return false;
//        var_dump($gatewayarr);
//        var_dump($iparr);
//        var_dump($maskarr);
//        foreach($gatewayarr as $key=>$value)
//        {                        
//            echo $gatewayarr[$key].' '.$iparr[$key].' '.$maskarr[$key];
////            var_dump($iparr[key].' '.$maskarr[key].' '.$gatewayarr[key]);
//            var_dump($iparr[key] and $maskarr[key]);
//            var_dump($gatewayarr[key] and $maskarr[key]);
//            
//        }
    }
}
?>