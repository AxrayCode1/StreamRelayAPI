<?php
include_once '/var/www/html/include/HandleLogin.php';
$oLogin = new Login();
$oLogin->DoLogout();
header('Location: /ui/index.html');
exit();
?>

