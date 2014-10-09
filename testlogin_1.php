<?php
    include_once 'include/HandleLogin.php';
    $oLogin = new Login();
    $oLogin->sec_session_start();
    $username = $_SESSION['username'];    
    var_dump($_SESSION);

?>
