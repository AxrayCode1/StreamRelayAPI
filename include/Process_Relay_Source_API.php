<?php
class Process_Relay_Source_API
{
    function Add_Relay_Source($jsondata)
    {       
        $result = null;
        $inputjson = json_decode($jsondata,true);
        if(!(strlen($inputjson['ChannelID']) ==0 || count($inputjson['AddSource']) == 0))
        {
            $exu_str = 'sudo /var/www/html/relay.exe source add ';
            $exu_str .= $inputjson['ChannelID'].' ';
            foreach ($inputjson['AddSource'] as $key => $value)
            {
                $exu_str.='"';
                $exu_str.=$value['URL'];
                $exu_str.='" ';
                $exu_str.=$value['Order'];
            }                                   
            exec($exu_str);                            
        }
        $result = $this->List_Relay_Source($inputjson['ChannelID']);
        return $result;
    }
    
    function Delete_Relay_Source($jsondata)
    {
        $result = null;
        $inputjson = json_decode($jsondata,true);
        if(!(strlen($inputjson['ChannelID']) ==0 || count($inputjson['DeleteSource']) == 0))
        {
            $exu_str = 'sudo /var/www/html/relay.exe source delete ';
            $exu_str .= $inputjson['ChannelID'].' ';
            foreach ($inputjson['DeleteSource'] as $key => $value)
            {
                $exu_str.=$value;
                $exu_str.=' ';
            }                                   
            exec($exu_str);                            
        }
        $result = $this->List_Relay_Source($inputjson['ChannelID']);
        return $result;
    }
    
    function Reorder_Relay_Source($jsondata)
    {
        $result = null;
        $inputjson = json_decode($jsondata,true);
        if(!(strlen($inputjson['ChannelID']) ==0 || count($inputjson['ReorderSource']) == 0))
        {
            $exu_str = 'sudo /var/www/html/relay.exe source modify ';
            $exu_str .= $inputjson['ChannelID'].' ';
            foreach ($inputjson['ReorderSource'] as $key => $value)
            {
                $exu_str.=$value['ID'];
                $exu_str.=' ';
                $exu_str.=$value['Order'];
                $exu_str.=' ';
            }                               
            exec($exu_str);                            
        }
        $result = $this->List_Relay_Source($inputjson['ChannelID']);
        return $result;
    }
    
    function List_Relay_Source($channelid)
    {        
        $exu_str = "sudo /var/www/html/relay.exe source list $channelid";      
        exec($exu_str,$output);
        if(json_decode($output[0]) == null)
            return null;
        else
            return $output[0];
    }
}
