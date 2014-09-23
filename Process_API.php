<?php
class Process_API
{
    function create($jsondata)
    {
        $result = false;
        $inputjson = json_decode($jsondata,true);
        if(!(strlen($inputjson['Source']) <=0 || strlen($inputjson['Port']) <=0))
        {
            $exu_str = 'sudo /var/www/html/relay.exe ';
            $exu_str.=$inputjson['Source'];
            $exu_str.=' ';
            $exu_str.=$inputjson['Port'];
            $exu_str.=' ';
            $exu_str.=$inputjson['ChannelName'];            
            exec($exu_str,$output);         
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
    
    function listdata()
    {
        $ouputarr = array();
        $exu_str = 'sudo /var/www/html/relay.exe list';            
        exec($exu_str,$output);
        foreach ($output as $str)
        {
            $str_arr=explode(" ",$str);
            $ouputarr[] = array('id'=>$str_arr[0],'source'=>$str_arr[1],'dest'=>$str_arr[2]);           
        }
        return $ouputarr;
    }
}

