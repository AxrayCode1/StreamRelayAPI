<?php
abstract class APIStatus
{
    const DBConnectFail = 0;
    const DBPrepareFail = 1;
    const DBConnectSuccess = 2;
    const LoginFail = 3;
    const LoginSuccess = 4;
    const ChangePWDSuccess = 5;
    const ChangePWDFail = 6;
    const ListLogSuccess = 11;
}
?>