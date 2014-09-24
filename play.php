 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Play Stream</title>
    <meta name="description" content="">
    <link href="css/style.css" rel="stylesheet">
    <link href="css/hPlayer.css" rel="stylesheet">
    <script type="text/javascript" src="js/jquery_1.4.3.min.js"></script>
    <script src="js/jqueryui_1.10.3.min.js"></script>
    <script src="js/hPlayer.js"></script>
  </head>
  <body>
    <div id="header">
        <h1 id="h1_header"></h1>
    </div>
    <div id="hPlayer"></div>
    <div class="continer">
        <div class="controls">
<?php
    include_once 'Process_API.php';
    $proc_api = new Process_API();
    $data_arr = $proc_api ->listdata();
    foreach ($data_arr as $key => $data)
    {    
        $mergestyle = '';
        if($key != 0)
            $mergestyle = "margin-left: 10px;";
        $index = ++$key;        
        $url = urlencode(trim(str_replace('http://<IP>', 'http://'.$_SERVER[HTTP_HOST], $data['dest'])));                       
//        echo '<a href="#" class="btn-dark"  onclick="$("#h1_header").text("Channel 01"); hPlayer.play({ stream: "'.$url.'"}); return false">Chanel '.$index.'</a>';
        echo '<a style="'.$mergestyle.'" href="#" class="btn-dark"  onclick="$'."('#h1_header').text('Channel ".$index."');hPlayer.play({ stream: decodeURIComponent('$url')});".' return false">Channel '.$index.'</a>';
    }    
?>     
        </div>
    </div>
    <script type="text/javascript">
        hPlayer.init({});
    </script>
  </body>
</html>
