<?php
include_once '/var/www/html/include/HandleLogin.php';
$oLogin = new Login();
$oLogin->Sec_Session_Start();
if(isset($_POST['username']) && isset($_POST['p']))
{
    if($oLogin->DB_Connection() == APIStatus::DBConnectSuccess)
    {
        if($oLogin->Login_By_Data($_POST['username'],$_POST['p']) == APIStatus::LoginSuccess)
        {            
            header("Location: /ui/relay.html");
            exit();      
        }
         else
        {
            header('Location: /ui/index.html?error=1');
            exit();
        }
    }
    else
    {
        header('HTTP/1.0 404 Not Found');
        echo "<h1>Error 404 DB Not Found</h1>";
        echo "The page that you have requested could not be found.";
        exit();
    }
}
else
{    
    header('HTTP/1.0 404 Not Found');
    echo "<h1>Error 404 Not Found</h1>";
    echo "The page that you have requested could not be found.";
    exit();
}
?>
