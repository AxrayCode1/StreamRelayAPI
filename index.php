<?php
include_once '/var/www/html/include/HandleLogin.php';
$oLogin = new Login();
$oLogin->Sec_Session_Start();
if($oLogin->DB_Connection() == LoginStatus::DBConnectSuccess)
{
    if($oLogin->Login_Check() == LoginStatus::LoginSuccess)
    {
        header("Location: /ui/relay.html");
        exit();      
    }
}
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>

    <!-- Basics -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <!--<meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>-->

    <title>AcroRed TV Relay Station Login</title>

    <!-- CSS -->

    <link rel="stylesheet" href="/css/reset.css"/>
    <!--<link rel="stylesheet" href="css/animate.css"/>-->
    <link rel="stylesheet" href="/css/login.css"/>
    <script type='text/javascript' src="/js/sha512.js"></script>
    <script type='text/javascript' src="/js/index.js"></script>
  </head>

  <!-- Main HTML -->

  <body>

    <!-- Begin Page Content -->
    <div id="login">
        <div id="title">
            TV Relay Server
        </div>
        <div id="container">
            <form action="/ui/Login.html" method="post" name="login_form">
                <label class="LabelHead" for="username">Username:</label>
                <input type="text" id="username" name="username" />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" />
                <div id="lower">
                    <!--<input type="checkbox"><label class="check" for="checkbox">Keep me logged in</label>-->
                    <input type="submit" value="Login" onclick="formhash(this.form, this.form.password);">
                </div><!--/ lower-->
            </form>
        </div><!--/ container-->
    </div>
    <!--/ container-->
    <!-- End Page Content -->
    <?php
            if (isset($_GET['error'])) {
                echo '<script>alert("Login Failed.");window.location = "/ui/index.html"</script>';                
                exit();
            }            
    ?>
  </body>

</html>
