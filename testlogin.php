<?php
    include_once 'include/HandleLogin.php';
    $oLogin = new Login();
    $oLogin->sec_session_start();
    $_SESSION['username'] = "karl";
    var_dump($_SESSION);
?>

